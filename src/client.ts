/**
Asking lemonfiber for something, and telling it to do something.

Spec: 20-architecture/contracts/web-api.md
*/
import { address } from "./address.js";
import { answeredAs, blobOf, refusalOf } from "./answered.js";
import type { ActingOn, DocumentRead, ReadAsking } from "./asked.js";
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
import { parse, type Envelope, type Reading } from "./envelope.js";
import {
  FILES,
  READS,
  type ActionName,
  type ByKind,
  type Choice,
  type FileQuery,
  type KeysBody,
  type ReadAnswer,
  type SetupAnswerBody,
} from "./generated/index.js";
import { lastSegment, type Handed, type Written } from "./handed.js";
import {
  DEVICE_KEYS,
  deviceKey,
  deviceKeyChallenge,
  registrationBody,
  type Registering,
} from "./device-keys.js";
import { jobs, type Jobs } from "./jobs.js";
import { KEYS, type Minting } from "./keys.js";
import { pushEndpoints, type PushEndpoints } from "./push-endpoints.js";
import type { Answer, Sending } from "./sending.js";
import {
  PICTURE_TYPES,
  pictureFrom,
  type AskablePictureQuery,
  type PictureAsking,
  type PictureQuery,
  type PictureRead,
  type Pictured,
} from "./picture.js";
import { unreachable, unrecognised, type Problem } from "./problem.js";
import { filledIn, search } from "./query.js";

export type { Sending } from "./sending.js";

export interface Talking {
  /**
  Where lemonfiber is listening, as it printed the address.
  */
  url: string;
  /**
  The token lemonfiber printed when it started serving.
  */
  token: string;
  sending: Sending;
  /**
  The longest any one call waits for its answer, every attempt at it
  included. `DEFAULT_TIMEOUT_MS` where none is given; a call may give its own.
  */
  timeoutMs?: number;
}

export type Opened = { ok: true; client: Client } | { ok: false; problem: Problem };

/**
Where the first-run setup is walked, one request a step.
*/
const SETUP = "/api/setup";

/**
Where what this stack can do is read, as the credential that asked may do it.
*/
const CAPABILITIES = "/api/capabilities";

/**
Where setup stands after a step: the question it is on, the answers so far,
and what it found.
*/
export type Walked = Reading<ByKind["wizard"]>;

/**
Talks to one running lemonfiber.

Every reply that is a document is read through the envelope, so a version
this package cannot speak is refused rather than half-understood. A file is
handed over as the bytes that arrived.
*/
export class Client {
  readonly #base: string;
  readonly #token: string;
  readonly #sending: Sending;
  readonly #timeoutMs: number;

  /**
  The phones this credential may have woken, listed, registered and removed.
  */
  readonly pushEndpoints: PushEndpoints;

  /**
  Work already begun, asked about and released by its name.
  */
  readonly jobs: Jobs;

  private constructor(base: string, token: string, sending: Sending, timeoutMs: number) {
    this.#base = base;
    this.#token = token;
    this.#sending = sending;
    this.#timeoutMs = timeoutMs;
    const ask = this.#ask.bind(this);
    this.pushEndpoints = pushEndpoints(ask);
    this.jobs = jobs(ask);
  }

  /**
  Opens a client, refusing an address that is not on this machine, a token no
  header can carry and a wait that is not a length of time, each as a
  `configuration` problem.
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
  Asks for what a command would print under `--json`, by the read's name.
  
  The name, the parameters it takes and the kinds it answers with are the
  contract's own list. An answer of a kind the contract does not list for the
  read is `unrecognised` rather than handed on as the read's.
  
  A read whose path has a segment the caller fills, such as `held/{id}`, takes
  it in `query`, and its query type needs it. Asked without it, the read is
  `misasked` and nothing is sent: `query` stays optional so a caller generic
  over the read name can still pass one along.
  */
  async read<N extends DocumentRead>(
    name: N,
    asking: ReadAsking<N> = {},
  ): Promise<Reading<ReadAnswer<N>>> {
    const read = READS[name];
    const filled = filledIn(read.path, read.segments, asking.query ?? {});
    if (!filled.ok) return filled;
    const answered = await this.#ask(
      "GET",
      `${filled.value.path}${search(filled.value.rest)}`,
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
  Tells lemonfiber to do something the command line could also do: one of the
  actions the contract lists, with the arguments the contract types for it.
  */
  async act<N extends ActionName>(
    name: N,
    ...[acting]: ActingOn<N>
  ): Promise<Reading<Envelope>> {
    return this.#ask(
      "POST",
      `/api/actions/${name}`,
      acting ?? {},
      JSON.stringify(acting?.body ?? {}),
    );
  }

  /**
  What this stack can do, each request by the path it is served at, as this
  credential may do it, with whose credential asked and which stack answered.
  A request the stack does not have is absent.
  */
  async capabilities(asking: Asking = {}): Promise<Reading<ByKind["capabilities"]>> {
    return answeredAs(
      await this.#ask("GET", CAPABILITIES, asking, undefined, true),
      "capabilities",
    );
  }

  /**
  The integration keys this credential may see, without their secrets.
  
  An operator lists every key, and a household member only the keys scoped to
  them. A key is refused here whatever its scope.
  */
  async keys(asking: Asking = {}): Promise<Reading<ByKind["keys"]>> {
    return answeredAs(await this.#ask("GET", KEYS, asking, undefined, true), "keys");
  }

  /**
  Mints one integration key, its secret in this reply and in no other, proved
  by the password given again or by a device key's signature over the text
  `signedText` spells.
  
  The reply carries the secret beside the stack's certificate pin and the
  address it is served at encrypted, where it is; nothing here keeps any of it.
  */
  async mint(minting: Minting, asking: Asking = {}): Promise<Reading<ByKind["minted-key"]>> {
    return answeredAs(
      await this.#ask("POST", KEYS, asking, JSON.stringify(minting satisfies KeysBody)),
      "minted-key",
    );
  }

  /**
  Mints one integration key as a claim: answered with the key link a program
  collects it with, once, within ten minutes, and no secret.
  */
  async mintClaim(
    minting: Minting,
    asking: Asking = {},
  ): Promise<Reading<ByKind["key-claim"]>> {
    return answeredAs(
      await this.#ask(
        "POST",
        KEYS,
        asking,
        JSON.stringify({ ...minting, claim: true } satisfies KeysBody),
      ),
      "key-claim",
    );
  }

  /**
  Revokes one integration key by its name, answered with the keys as they now
  stand. The name is sent as one path segment.
  */
  async revoke(name: string, asking: Asking = {}): Promise<Reading<ByKind["keys"]>> {
    return answeredAs(
      await this.#ask("DELETE", `${KEYS}/${encodeURIComponent(name)}`, asking),
      "keys",
    );
  }

  /**
  Registers a phone's key pair as a device key, with the platform's attestation
  and the operator's password, answered with the device key as registered.
  */
  async registerDeviceKey(
    registering: Registering,
    asking: Asking = {},
  ): Promise<Reading<ByKind["device-key"]>> {
    return answeredAs(
      await this.#ask("POST", DEVICE_KEYS, asking, registrationBody(registering)),
      "device-key",
    );
  }

  /**
  The operator's device keys, revoked ones included, without their public halves.
  */
  async deviceKeys(asking: Asking = {}): Promise<Reading<ByKind["device-keys"]>> {
    return answeredAs(
      await this.#ask("GET", DEVICE_KEYS, asking, undefined, true),
      "device-keys",
    );
  }

  /**
  A challenge for one device key, good for one mint from this client's token
  within a minute. Asking again spends the one asked before.
  */
  async deviceKeyChallenge(
    name: string,
    asking: Asking = {},
  ): Promise<Reading<ByKind["device-challenge"]>> {
    return answeredAs(
      await this.#ask("POST", deviceKeyChallenge(name), asking),
      "device-challenge",
    );
  }

  /**
  Revokes one device key by its name, spending every challenge standing for it,
  answered with the device keys as they now stand. The keys it proved stay.
  */
  async revokeDeviceKey(
    name: string,
    asking: Asking = {},
  ): Promise<Reading<ByKind["device-keys"]>> {
    return answeredAs(await this.#ask("DELETE", deviceKey(name), asking), "device-keys");
  }

  /**
  Where setup stands and what it is still asking for. Asking changes nothing.
  
  The answers so far live in the progress file setup keeps on the machine, so
  a walk begun anywhere is the one this reads.
  */
  async setup(asking: Asking = {}): Promise<Walked> {
    return answeredAs(await this.#ask("GET", SETUP, asking, undefined, true), "wizard");
  }

  /**
  Answers the question setup is on. A credential in the answer is tested
  against its service as it is given, and what the service said is on the
  reply; the value itself never is.
  */
  async setupAnswer(answer: SetupAnswerBody, asking: Asking = {}): Promise<Walked> {
    return this.#walk("answer", asking, JSON.stringify(answer));
  }

  /**
  On past a step that only informs.
  */
  async setupNext(asking: Asking = {}): Promise<Walked> {
    return this.#walk("next", asking);
  }

  /**
  Back to the question before.
  */
  async setupBack(asking: Asking = {}): Promise<Walked> {
    return this.#walk("back", asking);
  }

  /**
  Writes the reviewed answers, answered once the writing is done.
  */
  async setupApply(asking: Asking = {}): Promise<Walked> {
    return this.#walk("apply", asking);
  }

  /**
  Takes one way out of an apply that stopped part-way, chosen after the
  reply naming what that apply had already written.
  */
  async setupRecover(choice: Choice, asking: Asking = {}): Promise<Walked> {
    return this.#walk("recover", asking, JSON.stringify({ choice }));
  }

  /**
  One step of setup, asked once: none of them is safe to send twice.
  */
  async #walk(step: string, asking: Asking, body?: string): Promise<Walked> {
    return answeredAs(await this.#ask("POST", `${SETUP}/${step}`, asking, body), "wizard");
  }

  /**
  Asks for what lemonfiber hands over as a file rather than as a document.
  
  The reply is not read through the envelope, since there is none; it is kept
  as the bytes that arrived. A refusal is read as every other one is, and keeps
  its body besides.
  */
  async take(endpoint: string, asking: Asking = {}): Promise<Handed> {
    return this.#handOver(`/api/${endpoint}`, "*/*", asking, blobOf);
  }

  /**
  A title's poster, by the id its shelf lists it under: one of `PICTURE_TYPES`,
  of at most `PICTURE_MOST` bytes. `query` takes `member` and `defaults`, as the
  title read does.
  */
  async poster(id: string, asking: PictureAsking<PictureQuery> = {}): Promise<Pictured> {
    return this.#picture("held/poster", id, asking.query, asking);
  }

  /**
  A title's backdrop, read and refused as `poster` reads its poster.
  */
  async backdrop(id: string, asking: PictureAsking<PictureQuery> = {}): Promise<Pictured> {
    return this.#picture("held/backdrop", id, asking.query, asking);
  }

  /**
  The poster of a title a member may ask for, by the id their search lists it
  under, read and refused as `poster` reads a shelf's poster. `query` takes
  `member` and `kind`.
  */
  async askablePoster(
    id: string,
    asking: PictureAsking<AskablePictureQuery> = {},
  ): Promise<Pictured> {
    return this.#picture("askable/poster", id, asking.query, asking);
  }

  async #picture<R extends PictureRead>(
    name: R,
    id: string,
    query: Omit<FileQuery[R], "id"> | undefined,
    asking: Asking,
  ): Promise<Pictured> {
    const file = FILES[name];
    const filled = filledIn(file.path, file.segments, { ...query, id });
    if (!filled.ok) return filled;
    const path = `${filled.value.path}${search(filled.value.rest)}`;
    return this.#handOver(path, PICTURE_TYPES.join(", "), asking, pictureFrom);
  }

  async #handOver<T>(
    path: string,
    accept: string,
    asking: Asking,
    keep: (answer: Answer) => Promise<Reading<T> | undefined>,
  ): Promise<Reading<T> & { said?: string }> {
    const call = this.#call(asking);
    if (!call.ok) return call;
    const { signal, ended, release } = call.value;
    try {
      const answer = await this.#send("GET", path, accept, signal);
      if (answer === undefined) return { ok: false, problem: ended() ?? unreachable() };

      if (!answer.ok) {
        const said = await within(answer.text(), signal);
        if (said === undefined) return { ok: false, problem: ended() ?? unreachable() };
        return { ok: false, problem: refusalOf(answer, said), said };
      }

      const kept = await within(keep(answer), signal);
      return kept ?? { ok: false, problem: ended() ?? unreachable() };
    } finally {
      release();
    }
  }

  /**
  One support bundle lemonfiber kept, handed over whole.
  
  Asked for by the name it was written under, or by the `bundle` payload the
  `support` action answered with, whose `path` ends in that name. The name is
  sent as one path segment, so a name carrying a separator reaches lemonfiber as
  written and is refused there by name.
  */
  async bundle(written: string | Written, asking: Asking = {}): Promise<Handed> {
    const name = typeof written === "string" ? written : lastSegment(written.path);
    return this.take(`bundle/${encodeURIComponent(name)}`, asking);
  }

  /**
  One call's deadline: the caller's wait where it gave one, the client's
  otherwise, ended early by the caller's own signal.
  */
  #call(asking: Asking): Reading<Call> {
    const timeoutMs = asking.timeoutMs ?? this.#timeoutMs;
    if (!isAWait(timeoutMs)) return { ok: false, problem: notAWait(timeoutMs) };
    return { ok: true, value: callFor(timeoutMs, asking.signal) };
  }

  /**
  One request read through the envelope. A read is asked again before a
  passing failure is reported; anything else is asked once. Every attempt
  shares the call's one deadline, and a call that runs out of it, or that its
  caller stops, says which.
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
  The reply to one request, or nothing where none arrived before `signal`.
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
Whether an envelope is of a kind the contract lists the read as answering with.
*/
function isAnswerTo<N extends DocumentRead>(
  name: N,
  envelope: Envelope,
): envelope is ReadAnswer<N> {
  const kinds: readonly string[] = READS[name].kinds;
  return kinds.includes(envelope.kind);
}
