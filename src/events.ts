/**
 * The live stream, and the three things about it that are easy to get wrong.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { askedAgain } from "./again.js";
import { address } from "./address.js";
import { tokenProblem } from "./credential.js";
import { parse } from "./envelope.js";
import { Ledger } from "./ledger.js";
import { streamEnded, streamLost, unreachable, type Problem } from "./problem.js";
import { refusalIn } from "./refusal.js";
import { SseParser } from "./sse.js";

/**
 * The header the per-run token travels in. Never a query parameter.
 */
export const TOKEN_HEADER = "X-Lemonfiber-Token";

/**
 * How often the server speaks when it has nothing to say.
 */
export const HEARTBEAT_MS = 15_000;

/**
 * Silence beyond this means the stream is broken, not quiet.
 *
 * Twice the beat, which leaves one missed beat short of a broken stream. What is
 * measured is the moment anything last arrived, a beat included; a beat carries
 * no value and exists for no other purpose than to be counted here.
 */
export const SILENCE_ALLOWED_MS = HEARTBEAT_MS * 2;

/**
 * How many times a broken stream is reopened before following gives up.
 */
export const RECONNECTS_ALLOWED = 5;

/**
 * What a follower is handed.
 *
 * `lost` is the stream gone: refused, unreachable, broken or closed. An event
 * that could not be read is `unreadable`, and reading goes on after it.
 */
export type Arrival<T> =
  | { at: "live"; kind: string; data: T }
  | { at: "stale"; kind: string; data: T; quietForMs: number }
  | { at: "unreadable"; problem: Problem }
  | { at: "lost"; problem: Problem };

/**
 * The slice of `fetch` this needs, so a test can supply its own.
 *
 * `redirect` is always `"error"`, for the reason `Sending`'s is.
 */
export type Fetching = (
  url: string,
  init: { headers: Record<string, string>; signal: AbortSignal; redirect: "error" },
) => Promise<{ ok: boolean; status: number; body: ReadableStream<Uint8Array> | null }>;

export interface Following {
  /**
   * The stream's own address on the machine lemonfiber runs on, read as
   * `Client.at` reads one, and refused as it refuses one.
   */
  url: string;
  token: string;
  fetching: Fetching;
  /**
   * Injected so silence can be tested without waiting for it.
   */
  now?: () => number;
  silenceAllowedMs?: number;
  reconnectsAllowed?: number;
  signal?: AbortSignal;
}

/**
 * An opened stream's body, or why there is none.
 */
type Opened = { ok: true; body: ReadableStream<Uint8Array> } | { ok: false; problem: Problem };

/**
 * What one read of an opening produced.
 */
type Heard = { heard: "words"; chunk: Uint8Array } | { heard: "end" } | { heard: "silence" };

/**
 * What one opening of the stream needs in order to be read.
 */
interface Opening {
  body: ReadableStream<Uint8Array>;
  ledger: Ledger;
  now: () => number;
  silenceAllowedMs: number;
  onId: (id: string) => void;
  /**
   * The caller's way of saying it has stopped listening, where it gave one.
   */
  signal: AbortSignal | undefined;
  /**
   * Set when the stream fell silent longer than it is allowed to, which is the
   * difference between a stream that ended and one that died.
   */
  broke: boolean;
}

/**
 * Follows the stream, yielding what arrives and what has gone stale.
 *
 * On a break every held value cools: a value gathered before a gap is not
 * current, whatever the transport reports about the gap.
 *
 * An address that is not on this machine, or carries more than an address, is
 * lost before anything is sent: the token goes nowhere it was not given for.
 */
export async function* follow<T>(options: Following): AsyncGenerator<Arrival<T>> {
  const where = address(options.url);
  if (!where.ok) {
    yield { at: "lost", problem: where.problem };
    return;
  }

  const unusable = tokenProblem(options.token);
  if (unusable !== undefined) {
    yield { at: "lost", problem: unusable };
    return;
  }

  const now = options.now ?? (() => Date.now());
  const silenceAllowedMs = options.silenceAllowedMs ?? SILENCE_ALLOWED_MS;
  const reconnectsAllowed = options.reconnectsAllowed ?? RECONNECTS_ALLOWED;
  const ledger = new Ledger();

  let lastEventId: string | undefined;
  let reconnects = 0;

  for (;;) {
    const opened = await open(options, where.base, lastEventId);

    if (!opened.ok) {
      ledger.cool();
      yield { at: "lost", problem: opened.problem };
      return;
    }

    const opening: Opening = {
      body: opened.body,
      ledger,
      now,
      silenceAllowedMs,
      onId: (id) => {
        lastEventId = id;
      },
      signal: options.signal,
      broke: false,
    };
    yield* readOpening<T>(opening);

    const quietForMs = ledger.quietForMs(now()) ?? silenceAllowedMs;
    ledger.cool();
    yield { at: "lost", problem: opening.broke ? streamLost(quietForMs) : streamEnded() };

    for (const held of ledger.cooled(now())) {
      yield {
        at: "stale",
        kind: held.kind,
        data: held.data as T,
        quietForMs: held.quietForMs,
      };
    }

    if (options.signal?.aborted === true) return;

    reconnects += 1;
    if (reconnects > reconnectsAllowed) return;
  }
}

/**
 * Reads one opening to its end, collecting what arrives and whether it broke.
 *
 * A caller that has stopped listening is one of the ways this ends, and the read
 * already waiting when it says so is what its word has to reach: letting go of
 * the body settles that read, which is what brings the loop back to end. The
 * body is let go of however the reading ends, since a reader still holding one
 * goes on draining a connection nobody is reading from.
 */
async function* readOpening<T>(opening: Opening): AsyncGenerator<Arrival<T>> {
  const reader = opening.body.getReader();
  const parser = new SseParser();
  const decoder = new TextDecoder();
  const stopping = (): void => {
    void reader.cancel();
  };
  opening.signal?.addEventListener("abort", stopping, { once: true });

  try {
    for (;;) {
      const step = await nextChunk(reader, opening.silenceAllowedMs);
      if (step.heard === "end") return;

      if (step.heard === "silence") {
        opening.broke = true;
        return;
      }

      opening.ledger.spoke(opening.now());
      const events = parser.push(decoder.decode(step.chunk, { stream: true }));

      for (const event of events) {
        if (event.id !== undefined) opening.onId(event.id);
        yield received<T>(event.data, opening);
      }
    }
  } finally {
    opening.signal?.removeEventListener("abort", stopping);
    await letGo(reader);
  }
}

/**
 * Lets go of the body, whatever state it is in.
 *
 * A body whose stream already failed says so again when it is let go of, and a
 * stream that has already ended the reading leaves nothing further to do about
 * it.
 */
async function letGo(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void> {
  try {
    await reader.cancel();
  } catch {
    return;
  }
}

/**
 * One event's text, read and recorded.
 */
function received<T>(text: string, opening: Opening): Arrival<T> {
  const read = parse<T>(text);

  if (!read.ok) return { at: "unreadable", problem: read.problem };

  opening.ledger.record(read.value.kind, read.value.data, opening.now());
  return { at: "live", kind: read.value.kind, data: read.value.data };
}

/**
 * The next chunk, or what its absence means.
 *
 * The wait is the whole of the silence detection. A stream that has gone quiet
 * says nothing at all, so nothing arrives to prompt a reading of the clock, and a
 * connection that died without closing would be waited on for as long as the
 * process lived. The deadline ends the wait instead, and it starts again from
 * whatever last arrived.
 */
async function nextChunk(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  silenceAllowedMs: number,
): Promise<Heard> {
  const waiting = new AbortController();
  try {
    return await Promise.race([reading(reader), silence(silenceAllowedMs, waiting.signal)]);
  } finally {
    waiting.abort();
  }
}

/**
 * One read, ended by the stream rather than by the clock.
 */
async function reading(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<Heard> {
  try {
    const step = await reader.read();
    return step.done ? { heard: "end" } : { heard: "words", chunk: step.value };
  } catch {
    return { heard: "end" };
  }
}

/**
 * A wait that ends in silence, dropped where a read got there first.
 */
function silence(ms: number, until: AbortSignal): Promise<Heard> {
  return new Promise((tell) => {
    const bell = setTimeout(() => {
      tell({ heard: "silence" });
    }, ms);
    until.addEventListener(
      "abort",
      () => {
        clearTimeout(bell);
      },
      { once: true },
    );
  });
}

/**
 * Opens the stream, resuming from `lastEventId` where there is one.
 *
 * A stream nothing answered is `unreachable`. A refusal is read as every other
 * refusal is, from its status and its body, so a key the run does not admit is
 * `refused` and a stream the server does not serve is `missing`.
 *
 * The caller's own way of stopping is what the request is given, so a stop said
 * before this reaches the network is a request that is never made. A caller that
 * gave none is given one nothing ever raises.
 */
async function open(
  options: Following,
  url: string,
  lastEventId: string | undefined,
): Promise<Opened> {
  const headers: Record<string, string> = {
    [TOKEN_HEADER]: options.token,
    Accept: "text/event-stream",
    // Spread rather than assigned afterwards: the header is part of what this
    // request is, and a mutation a line later reads as an afterthought to a
    // value that was already complete.
    ...(lastEventId !== undefined && { "Last-Event-ID": lastEventId }),
  };

  // Opening the stream is a read, so it is asked again before a passing failure
  // is reported, the way every other read is.
  const answer = await askedAgain(async () => {
    try {
      return await options.fetching(url, {
        headers,
        signal: options.signal ?? new AbortController().signal,
        redirect: "error",
      });
    } catch {
      return;
    }
  });
  if (answer === undefined) return { ok: false, problem: unreachable() };
  if (!answer.ok)
    return { ok: false, problem: refusalIn(answer.status, await textOf(answer.body)) };
  if (answer.body === null) return { ok: false, problem: unreachable() };
  return { ok: true, body: answer.body };
}

/**
 * A refusal's body as text, or nothing where there is none or it could not be read.
 */
async function textOf(body: ReadableStream<Uint8Array> | null): Promise<string> {
  if (body === null) return "";
  try {
    return await new Response(body).text();
  } catch {
    return "";
  }
}
