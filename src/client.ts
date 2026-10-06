/**
 * Asking lemonfiber for something, and telling it to do something.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { address } from "./address.js";
import { askedAgain } from "./again.js";
import { tokenProblem } from "./credential.js";
import { parse, type Envelope, type Reading } from "./envelope.js";
import { TOKEN_HEADER } from "./events.js";
import type { Bundle } from "./generated/index.js";
import { unreachable, type Problem } from "./problem.js";
import { refusalIn } from "./refusal.js";

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
  headers?: { get: (name: string) => string | null };
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
   * Opens a client, refusing an address that is not on this machine and a token
   * no header can carry, each as a `configuration` problem.
   */
  static at(options: Talking): Opened {
    const where = address(options.url);
    if (!where.ok) return { ok: false, problem: where.problem };

    const unusable = tokenProblem(options.token);
    if (unusable !== undefined) return { ok: false, problem: unusable };

    return { ok: true, client: new Client(where.base, options.token, options.sending) };
  }

  /**
   * Asks for what a command would print under `--json`.
   */
  async read(endpoint: string, query: Query = {}): Promise<Reading<Envelope>> {
    return this.#ask("GET", `/api/${endpoint}${search(query)}`, undefined, true);
  }

  /**
   * Tells lemonfiber to do something the command line could also do.
   */
  async act(name: string, body: Record<string, unknown> = {}): Promise<Reading<Envelope>> {
    return this.#ask("POST", `/api/actions/${name}`, JSON.stringify(body));
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
      return { ok: false, problem: refusalOf(answer, said), said };
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

  /**
   * One request read through the envelope. A read is asked again before a
   * passing failure is reported; anything else is asked once.
   */
  async #ask(
    method: string,
    path: string,
    body?: string,
    isARead = false,
  ): Promise<Reading<Envelope>> {
    const sent = () => this.#send(method, path, "application/json", body);
    const answer = isARead ? await askedAgain(sent) : await sent();
    if (answer === undefined) return { ok: false, problem: unreachable() };

    const said = await textOf(answer);
    if (said === undefined) return { ok: false, problem: unreachable() };

    if (!answer.ok) return { ok: false, problem: refusalOf(answer, said) };

    return parse(said);
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
 * The problem a reply that was not a success is, its `Retry-After` included.
 */
function refusalOf(answer: Answer, said: string): Problem {
  return refusalIn(answer.status, said, answer.headers?.get("Retry-After"));
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
