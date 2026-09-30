/**
 * Asking lemonfiber for something, and telling it to do something.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { address } from "./address.js";
import { isKind, parse, type Envelope, type Reading } from "./envelope.js";
import { TOKEN_HEADER } from "./events.js";
import {
  isRefusalCode,
  REFUSAL_CODES,
  type Bundle,
  type RefusalCode,
} from "./generated/contract.js";
import {
  declined,
  failed,
  misasked,
  missing,
  refused,
  unreachable,
  type Problem,
} from "./problem.js";

/**
 * One value a query parameter can carry.
 */
type Scalar = string | number | boolean;

/**
 * What a query parameter may carry. A value that is `undefined` is not sent.
 *
 * A list is the same parameter given once for each of its values, in order
 * (`form=a&form=b`), which is how a command's flag given more than once is
 * written as a read. An empty list sends nothing, the same as `undefined`: a
 * flag given no times is a flag not given.
 */
export type Query = Record<string, Scalar | readonly Scalar[] | undefined>;

/**
 * The slice of `fetch` this needs, so a test can supply its own.
 *
 * `blob` is read for a file lemonfiber hands over and for nothing else, so a
 * reply without it answers every request but those. `fetch`'s reply has it.
 *
 * `redirect` is always `"error"`: an answer pointing somewhere else is not
 * followed, so the token goes to the address it was given for and nowhere
 * else. `fetch` honours it as given; a `sending` of any other kind has to as
 * well.
 */
export type Sending = (
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string; redirect: "error" },
) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  blob?: () => Promise<Blob>;
}>;

/**
 * One reply, as `sending` handed it back.
 */
type Answer = Awaited<ReturnType<Sending>>;

/**
 * A file lemonfiber handed over, or why it did not.
 *
 * The file is kept as it arrived, bytes and type both, so a browser can offer it
 * as a download without decoding it first.
 *
 * A refusal carries the body it arrived with, whole, as `said`. `problem` is the
 * reading `refusalIn` gives every other request; `said` is what that reading
 * leaves out — every field of an error envelope beyond its summary, and the
 * sentence a turned-away request was answered with, which `refused` never
 * carries. It is absent where nothing arrived to carry.
 */
export type Handed = { ok: true; value: Blob } | { ok: false; problem: Problem; said?: string };

/**
 * Where a support bundle was written, as the `support` action's `bundle` payload
 * says. The payload itself is one, once its `path` is known to be there.
 *
 * Only a written one: a payload without a `path` described a bundle and wrote
 * none, so there is no file to ask for.
 */
export interface Written {
  path: NonNullable<Bundle["path"]>;
}

export interface Talking {
  /**
   * Where lemonfiber is listening, as it printed the address.
   */
  url: string;
  /**
   * The token lemonfiber printed when it started serving.
   */
  token: string;
  sending: Sending;
}

export type Opened = { ok: true; client: Client } | { ok: false; problem: Problem };

/**
 * Talks to one running lemonfiber.
 *
 * Every reply that is a document is read through the envelope, so a version
 * this package cannot speak is refused rather than half-understood. A file is
 * handed over as the bytes that arrived.
 */
export class Client {
  readonly #base: string;
  readonly #token: string;
  readonly #sending: Sending;

  private constructor(base: string, token: string, sending: Sending) {
    this.#base = base;
    this.#token = token;
    this.#sending = sending;
  }

  /**
   * Opens a client, refusing an address that is not on this machine.
   */
  static at(options: Talking): Opened {
    const where = address(options.url);
    if (!where.ok) return { ok: false, problem: where.problem };

    if (options.token.trim() === "") {
      return {
        ok: false,
        problem: refused(),
      };
    }

    return { ok: true, client: new Client(where.base, options.token, options.sending) };
  }

  /**
   * Asks for what a command would print under `--json`.
   */
  async read<T>(endpoint: string, query: Query = {}): Promise<Reading<Envelope<T>>> {
    return this.#ask<T>("GET", `/api/${endpoint}${search(query)}`);
  }

  /**
   * Tells lemonfiber to do something the command line could also do.
   */
  async act<T>(
    name: string,
    body: Record<string, unknown> = {},
  ): Promise<Reading<Envelope<T>>> {
    return this.#ask<T>("POST", `/api/actions/${name}`, JSON.stringify(body));
  }

  /**
   * Asks for what lemonfiber hands over as a file rather than as a document.
   *
   * The reply is not read through the envelope, since there is none; it is kept
   * as the bytes that arrived. A refusal is read as every other one is, and keeps
   * its body besides.
   */
  async take(endpoint: string): Promise<Handed> {
    const answer = await this.#send("GET", `/api/${endpoint}`, "*/*");
    if (answer === undefined) return { ok: false, problem: unreachable() };

    if (!answer.ok) {
      const said = await textOf(answer);
      if (said === undefined) return { ok: false, problem: unreachable() };
      return { ok: false, problem: refusalIn(answer.status, said), said };
    }

    const kept = await blobOf(answer);
    if (kept === undefined) return { ok: false, problem: unreachable() };
    return { ok: true, value: kept };
  }

  /**
   * One support bundle lemonfiber kept, handed over whole.
   *
   * Asked for by the name it was written under, or by the `bundle` payload the
   * `support` action answered with, whose `path` ends in that name. The name is
   * sent as one path segment, so a name carrying a separator reaches lemonfiber as
   * written and is refused there by name.
   */
  async bundle(written: string | Written): Promise<Handed> {
    const name = typeof written === "string" ? written : lastSegment(written.path);
    return this.take(`bundle/${encodeURIComponent(name)}`);
  }

  async #ask<T>(method: string, path: string, body?: string): Promise<Reading<Envelope<T>>> {
    const answer = await this.#send(method, path, "application/json", body);
    if (answer === undefined) return { ok: false, problem: unreachable() };

    const said = await textOf(answer);
    if (said === undefined) return { ok: false, problem: unreachable() };

    if (!answer.ok) return { ok: false, problem: refusalIn(answer.status, said) };

    return parse<T>(said);
  }

  /**
   * The reply to one request, or nothing where none arrived.
   */
  async #send(
    method: string,
    path: string,
    accept: string,
    body?: string,
  ): Promise<Answer | undefined> {
    const headers: Record<string, string> = {
      [TOKEN_HEADER]: this.#token,
      Accept: accept,
      // Part of what the request is, rather than assigned onto a value that
      // was already complete a line earlier.
      ...(body !== undefined && { "Content-Type": "application/json" }),
    };

    try {
      return await this.#sending(`${this.#base}${path}`, {
        method,
        headers,
        ...(body !== undefined && { body }),
        redirect: "error",
      });
    } catch {
      return undefined;
    }
  }
}

/**
 * A reply's body as text, or nothing where it could not be read.
 */
async function textOf(answer: Answer): Promise<string | undefined> {
  try {
    return await answer.text();
  } catch {
    return undefined;
  }
}

/**
 * A reply's body as the bytes that arrived, or nothing where it could not be
 * read as bytes.
 */
async function blobOf(answer: Answer): Promise<Blob | undefined> {
  if (answer.blob === undefined) return undefined;
  try {
    return await answer.blob();
  } catch {
    return undefined;
  }
}

/**
 * The file a path names: whatever follows its last separator, of either kind.
 */
function lastSegment(path: string): string {
  return path.slice(Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\")) + 1);
}

/**
 * Whether a status is lemonfiber turning away who is asking.
 *
 * Both are read: 403 is what it answers most of them with, 401 is what it answers
 * a wrong password with, and 401 is what a proxy in front of it may answer with
 * instead.
 */
const wasTurnedAway = (status: number): boolean => status === 403 || status === 401;

/**
 * The registry name of the refusal that is the key: the request carried nothing
 * this run admits.
 *
 * Its code is read from the contract's list by this name, so no code is written
 * here.
 */
const THE_KEY = "NOT_ADMITTED";

/**
 * Whether a refusal's code is the key's.
 */
function isTheKey(code: RefusalCode): boolean {
  const listed: { readonly name: string } = REFUSAL_CODES[code];
  return listed.name === THE_KEY;
}

/**
 * What an answer's body said: the one sentence it holds, and the code it named,
 * as it arrived.
 */
interface Said {
  sentence?: string;
  code?: string;
}

/**
 * Whether a code arrived and is one the contract lists. Any other reads as none.
 */
const isListed = (code: string | undefined): code is RefusalCode =>
  code !== undefined && isRefusalCode(code);

/**
 * A problem carrying the code it was refused with, where the contract lists it.
 */
const carrying = (problem: Problem, code: string | undefined): Problem =>
  isListed(code) ? { ...problem, code } : problem;

/**
 * What opens something other than a sentence: a JSON body, or markup from
 * whatever stands between the caller and lemonfiber.
 */
const OPENS_A_STRUCTURE = /^[<[{]/;

/**
 * What a status says the request itself got wrong.
 *
 * lemonfiber settles where a problem lies at the point the problem is raised — in
 * what the request named, in how it asked, or in the answering — and answers with
 * the status that carries that reading, so this is read back rather than guessed
 * at from the sentence. Two of the three are the request's, and they are the two
 * listed. The third needs no entry: a status faulting neither what was named nor
 * how it was asked leaves the answering, which is `failed`.
 *
 * Falling through to `failed` rather than listing 500 is deliberate. A status
 * nothing here recognises is then read as a failure of the answering rather than
 * as the key, which is the safe direction of the two: a caller told its key is
 * wrong rotates a credential that was working, while a caller told the answering
 * failed is given the sentence, which names what actually broke.
 */
const MEANT_BY: ReadonlyMap<number, (said: string) => Problem> = new Map([
  [400, misasked],
  [404, missing],
]);

/**
 * The problem an answer that was not a success is, given the body it arrived
 * with.
 *
 * Offered rather than kept private. A caller that reads a status itself — because
 * what it asked for is not one document, and so is not something `read` can parse
 * — would otherwise write this reading a second time, and a second copy of which
 * status means which kind is a second place to remember when a status is added.
 *
 * A refusal lemonfiber wrote a sentence for is that sentence, under the kind its
 * status warrants. A failure whose body holds no sentence this package can read is
 * reported as not answering: a body it cannot read tells it no more than silence
 * would, whatever status other than 401 or 403 carried it.
 *
 * What that rules out is a document, not a stranger. A page and a body of JSON
 * that is not this envelope are both refused, and a plain sentence is taken as
 * lemonfiber's own — which it usually is, since every refusal the write surface
 * makes is prose and so are the reads it could not read. Nothing in a line of
 * words says who wrote it, so a plain-text page from whatever else is listening on
 * a loopback port is read as lemonfiber's account of what there is. Refusing prose
 * would close that door by discarding the surface's own refusals, which is the
 * larger loss of the two.
 *
 * A refusal's code, where the contract lists it, is carried on the problem it is
 * read as. A code the contract does not list reads as none.
 *
 * A request turned away at 401 or 403 is read from its code. The key's code is
 * `refused`, carrying it. Any other listed code is `declined`, carrying the code
 * and lemonfiber's sentence, since what it objects to is who is asking or where
 * from and a new key would not help. No code, a code the contract does not list,
 * or a listed code with no sentence beside it is read from the status alone,
 * which for these two is the key — `refused`, carrying no code and no sentence.
 */
export function refusalIn(status: number, body: string): Problem {
  const said = saidIn(body);
  if (wasTurnedAway(status)) return turnedAway(said);

  if (said.sentence === undefined) return unreachable();

  const meant = MEANT_BY.get(status) ?? failed;
  return carrying(meant(said.sentence), said.code);
}

/**
 * The problem a request turned away at 401 or 403 is, given what its body said.
 */
function turnedAway({ sentence, code }: Said): Problem {
  if (!isListed(code)) return refused();
  if (isTheKey(code)) return { ...refused(), code };
  if (sentence === undefined) return refused();
  return declined(sentence, code);
}

/**
 * What lemonfiber refused with, or nothing where the body holds nothing it said.
 *
 * Two shapes arrive. An action lemonfiber does not offer, or an argument it does
 * not know, is answered in prose, which carries no code. A command that ran and
 * failed, and a request it turned away, are answered with an `error` envelope,
 * whose summary is that same one sentence and whose code names why. A body of any
 * other shape did not come from lemonfiber and is not handed on as its words.
 */
function saidIn(body: string): Said {
  const words = body.trim();
  if (words === "") return {};
  if (OPENS_A_STRUCTURE.test(words)) return errorIn(words);
  return { sentence: words };
}

/**
 * The one plain sentence an `error` envelope carries, and the code it names.
 *
 * The kind names the payload; it does not prove its shape. Each field is read as
 * something arriving off a wire, so an envelope labelled `error` that carries no
 * sentence yields none, and one whose code is not a string yields no code.
 */
function errorIn(body: string): Said {
  const envelope = parse<unknown>(body);
  if (!envelope.ok || !isKind(envelope.value, "error")) return {};

  const data: unknown = envelope.value.data;
  if (typeof data !== "object" || data === null) return {};

  const { summary, code } = data as Record<string, unknown>;
  return {
    ...(typeof summary === "string" && summary.trim() !== "" && { sentence: summary.trim() }),
    ...(typeof code === "string" && { code }),
  };
}

/**
 * A parameter's values, whether it was given one or a list of them.
 */
function listed(value: Scalar | readonly Scalar[]): readonly Scalar[] {
  return typeof value === "object" ? value : [value];
}

/**
 * A query string, or nothing when there is nothing to ask for.
 *
 * The token is never among these: a credential in a URL reaches logs, history
 * and referrers.
 */
function search(query: Query): string {
  const parts = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    for (const one of listed(value)) parts.append(key, String(one));
  }

  const text = parts.toString();
  return text === "" ? "" : `?${text}`;
}
