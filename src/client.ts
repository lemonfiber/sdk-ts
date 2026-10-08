/**
 * Asking lemonfiber for something, and telling it to do something.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { address } from "./address.js";
import { askedAgain } from "./again.js";
import { TOKEN_HEADER, tokenProblem } from "./credential.js";
import {
  callFor,
  DEFAULT_TIMEOUT_MS,
  isAWait,
  notAWait,
  within,
  type Asking,
  type Call,
} from "./deadline.js";
import { isKind, parse, type Envelope, type Reading } from "./envelope.js";
import {
  READS,
  type Bundle,
  type ByKind,
  type Choice,
  type KeyPurpose,
  type Kind,
  type ReadAnswer,
  type ReadName,
  type ReadQuery,
  type Scalar,
  type SetupAnswerBody,
} from "./generated/index.js";
import { unreachable, unrecognised, type Problem } from "./problem.js";
import { refusalIn } from "./refusal.js";

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
 * The read answered with a line of its own for each envelope rather than with
 * one document. `read` takes every other read the contract lists.
 */
type LineByLine = "logs";

/**
 * The name of a read `read` answers: one answered with one document.
 */
export type DocumentRead = Exclude<ReadName, LineByLine>;

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
 *
 * `signal` is raised when the call runs out of time or its caller stops it, and
 * `fetch` gives up on the request and on reading its body when it is. A
 * `sending` of any other kind has to as well, or a call waits on it past its
 * deadline.
 */
export type Sending = (
  url: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body?: string;
    redirect: "error";
    signal: AbortSignal;
  },
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
  /**
   * The longest any one call waits for its answer, every attempt at it
   * included. `DEFAULT_TIMEOUT_MS` where none is given; a call may give its own.
   */
  timeoutMs?: number;
}

export type Opened = { ok: true; client: Client } | { ok: false; problem: Problem };

/**
 * Where integration keys are listed, minted and revoked.
 */
const KEYS = "/api/keys";

/**
 * Where the first-run setup is walked, one request a step.
 */
const SETUP = "/api/setup";

/**
 * Where setup stands after a step: the question it is on, the answers so far,
 * and what it found.
 */
export type Walked = Reading<ByKind["wizard"]>;

/**
 * What one integration key is minted with.
 *
 * The password is the minter's own, given again for this one request. It is sent
 * in the body and kept by nothing here.
 */
export interface Minting {
  /**
   * What to call it. No other key may hold the name.
   */
  name: string;
  /**
   * What it admits: `read`, `act`, or `member:` and the account it acts as.
   */
  scope: "read" | "act" | `member:${string}`;
  /**
   * What it is for, as whoever mints it declares.
   */
  purpose: KeyPurpose;
  /**
   * The minter's password, given again.
   */
  password: string;
}

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
  readonly #timeoutMs: number;

  private constructor(base: string, token: string, sending: Sending, timeoutMs: number) {
    this.#base = base;
    this.#token = token;
    this.#sending = sending;
    this.#timeoutMs = timeoutMs;
  }

  /**
   * Opens a client, refusing an address that is not on this machine, a token no
   * header can carry and a wait that is not a length of time, each as a
   * `configuration` problem.
   */
  static at(options: Talking): Opened {
    const where = address(options.url);
    if (!where.ok) return { ok: false, problem: where.problem };

    const unusable = tokenProblem(options.token);
    if (unusable !== undefined) return { ok: false, problem: unusable };

    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    if (!isAWait(timeoutMs)) return { ok: false, problem: notAWait(timeoutMs) };

    return {
      ok: true,
      client: new Client(where.base, options.token, options.sending, timeoutMs),
    };
  }

  /**
   * Asks for what a command would print under `--json`, by the read's name.
   *
   * The name, the parameters it takes and the kinds it answers with are the
   * contract's own list. An answer of a kind the contract does not list for the
   * read is `unrecognised` rather than handed on as the read's.
   */
  async read<N extends DocumentRead>(
    name: N,
    query?: ReadQuery[N],
    asking: Asking = {},
  ): Promise<Reading<ReadAnswer<N>>> {
    const read = READS[name];
    const answered = await this.#ask(
      "GET",
      `${read.path}${search(query ?? {})}`,
      asking,
      undefined,
      true,
    );
    if (!answered.ok) return answered;
    const envelope = answered.value;
    if (!isAnswerTo(name, envelope)) return { ok: false, problem: unrecognised(envelope.kind) };
    return { ok: true, value: envelope };
  }

  /**
   * Tells lemonfiber to do something the command line could also do.
   */
  async act(
    name: string,
    body: Record<string, unknown> = {},
    asking: Asking = {},
  ): Promise<Reading<Envelope>> {
    return this.#ask("POST", `/api/actions/${name}`, asking, JSON.stringify(body));
  }

  /**
   * The integration keys this credential may see, without their secrets.
   *
   * An operator lists every key, and a household member only the keys scoped to
   * them. A key is refused here whatever its scope.
   */
  async keys(asking: Asking = {}): Promise<Reading<ByKind["keys"]>> {
    return answeredAs(await this.#ask("GET", KEYS, asking, undefined, true), "keys");
  }

  /**
   * Mints one integration key, its secret in this reply and in no other.
   *
   * The reply carries the secret beside the stack's certificate pin and the
   * address it is served at encrypted, where it is; nothing here keeps any of it.
   */
  async mint(minting: Minting, asking: Asking = {}): Promise<Reading<ByKind["minted-key"]>> {
    return answeredAs(
      await this.#ask("POST", KEYS, asking, JSON.stringify(minting)),
      "minted-key",
    );
  }

  /**
   * Revokes one integration key by its name, answered with the keys as they now
   * stand. The name is sent as one path segment.
   */
  async revoke(name: string, asking: Asking = {}): Promise<Reading<ByKind["keys"]>> {
    return answeredAs(
      await this.#ask("DELETE", `${KEYS}/${encodeURIComponent(name)}`, asking),
      "keys",
    );
  }

  /**
   * Where setup stands and what it is still asking for. Asking changes nothing.
   *
   * The answers so far live in the progress file setup keeps on the machine, so
   * a walk begun anywhere is the one this reads.
   */
  async setup(asking: Asking = {}): Promise<Walked> {
    return answeredAs(await this.#ask("GET", SETUP, asking, undefined, true), "wizard");
  }

  /**
   * Answers the question setup is on. A credential in the answer is tested
   * against its service as it is given, and what the service said is on the
   * reply; the value itself never is.
   */
  async setupAnswer(answer: SetupAnswerBody, asking: Asking = {}): Promise<Walked> {
    return this.#walk("answer", asking, JSON.stringify(answer));
  }

  /**
   * On past a step that only informs.
   */
  async setupNext(asking: Asking = {}): Promise<Walked> {
    return this.#walk("next", asking);
  }

  /**
   * Back to the question before.
   */
  async setupBack(asking: Asking = {}): Promise<Walked> {
    return this.#walk("back", asking);
  }

  /**
   * Writes the reviewed answers, answered once the writing is done.
   */
  async setupApply(asking: Asking = {}): Promise<Walked> {
    return this.#walk("apply", asking);
  }

  /**
   * Takes one way out of an apply that stopped part-way, chosen after the
   * reply naming what that apply had already written.
   */
  async setupRecover(choice: Choice, asking: Asking = {}): Promise<Walked> {
    return this.#walk("recover", asking, JSON.stringify({ choice }));
  }

  /**
   * One step of setup, asked once: none of them is safe to send twice.
   */
  async #walk(step: string, asking: Asking, body?: string): Promise<Walked> {
    return answeredAs(await this.#ask("POST", `${SETUP}/${step}`, asking, body), "wizard");
  }

  /**
   * Asks for what lemonfiber hands over as a file rather than as a document.
   *
   * The reply is not read through the envelope, since there is none; it is kept
   * as the bytes that arrived. A refusal is read as every other one is, and keeps
   * its body besides.
   */
  async take(endpoint: string, asking: Asking = {}): Promise<Handed> {
    const call = this.#call(asking);
    if (!call.ok) return call;
    const { signal, ended, release } = call.value;
    try {
      const answer = await this.#send("GET", `/api/${endpoint}`, "*/*", signal);
      if (answer === undefined) return { ok: false, problem: ended() ?? unreachable() };

      if (!answer.ok) {
        const said = await within(answer.text(), signal);
        if (said === undefined) return { ok: false, problem: ended() ?? unreachable() };
        return { ok: false, problem: refusalOf(answer, said), said };
      }

      const kept = await within(blobOf(answer), signal);
      if (kept === undefined) return { ok: false, problem: ended() ?? unreachable() };
      return { ok: true, value: kept };
    } finally {
      release();
    }
  }

  /**
   * One support bundle lemonfiber kept, handed over whole.
   *
   * Asked for by the name it was written under, or by the `bundle` payload the
   * `support` action answered with, whose `path` ends in that name. The name is
   * sent as one path segment, so a name carrying a separator reaches lemonfiber as
   * written and is refused there by name.
   */
  async bundle(written: string | Written, asking: Asking = {}): Promise<Handed> {
    const name = typeof written === "string" ? written : lastSegment(written.path);
    return this.take(`bundle/${encodeURIComponent(name)}`, asking);
  }

  /**
   * One call's deadline: the caller's wait where it gave one, the client's
   * otherwise, ended early by the caller's own signal.
   */
  #call(asking: Asking): Reading<Call> {
    const timeoutMs = asking.timeoutMs ?? this.#timeoutMs;
    if (!isAWait(timeoutMs)) return { ok: false, problem: notAWait(timeoutMs) };
    return { ok: true, value: callFor(timeoutMs, asking.signal) };
  }

  /**
   * One request read through the envelope. A read is asked again before a
   * passing failure is reported; anything else is asked once. Every attempt
   * shares the call's one deadline, and a call that runs out of it, or that its
   * caller stops, says which.
   */
  async #ask(
    method: string,
    path: string,
    asking: Asking,
    body?: string,
    isARead = false,
  ): Promise<Reading<Envelope>> {
    const call = this.#call(asking);
    if (!call.ok) return call;
    const { signal, ended, release } = call.value;
    try {
      const sent = () => this.#send(method, path, "application/json", signal, body);
      const answer = isARead ? await askedAgain(sent, signal) : await sent();
      if (answer === undefined) return { ok: false, problem: ended() ?? unreachable() };

      const said = await within(answer.text(), signal);
      if (said === undefined) return { ok: false, problem: ended() ?? unreachable() };

      if (!answer.ok) return { ok: false, problem: refusalOf(answer, said) };

      return parse(said);
    } finally {
      release();
    }
  }

  /**
   * The reply to one request, or nothing where none arrived before `signal`.
   */
  async #send(
    method: string,
    path: string,
    accept: string,
    signal: AbortSignal,
    body?: string,
  ): Promise<Answer | undefined> {
    const headers: Record<string, string> = {
      [TOKEN_HEADER]: this.#token,
      Accept: accept,
      // Part of what the request is, rather than assigned onto a value that
      // was already complete a line earlier.
      ...(body !== undefined && { "Content-Type": "application/json" }),
    };

    return within(
      this.#sending(`${this.#base}${path}`, {
        method,
        headers,
        ...(body !== undefined && { body }),
        redirect: "error",
        signal,
      }),
      signal,
    );
  }
}

/**
 * The problem a reply that was not a success is, its `Retry-After` included.
 */
function refusalOf(answer: Answer, said: string): Problem {
  return refusalIn(answer.status, said, answer.headers?.get("Retry-After"));
}

/**
 * A reply's body as the bytes that arrived, or nothing where it cannot be read
 * as bytes.
 */
function blobOf(answer: Answer): Promise<Blob | undefined> {
  return answer.blob === undefined ? Promise.resolve(undefined) : answer.blob();
}

/**
 * The file a path names: whatever follows its last separator, of either kind.
 */
function lastSegment(path: string): string {
  return path.slice(Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\")) + 1);
}

/**
 * An answer narrowed to the one kind its route answers with, or `unrecognised`
 * where it came back as another.
 */
function answeredAs<K extends Kind>(answered: Reading<Envelope>, kind: K): Reading<ByKind[K]> {
  if (!answered.ok) return answered;
  return isKind(answered.value, kind)
    ? { ok: true, value: answered.value }
    : { ok: false, problem: unrecognised(answered.value.kind) };
}

/**
 * Whether an envelope is of a kind the contract lists the read as answering with.
 */
function isAnswerTo<N extends DocumentRead>(
  name: N,
  envelope: Envelope,
): envelope is ReadAnswer<N> {
  const kinds: readonly string[] = READS[name].kinds;
  return kinds.includes(envelope.kind);
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
