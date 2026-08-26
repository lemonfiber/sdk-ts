/**
 * The live stream, and the three things about it that are easy to get wrong.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { parse } from "./envelope.js";
import { Ledger } from "./ledger.js";
import { streamLost, unreachable, type Problem } from "./problem.js";
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
 */
export type Arrival<T> =
  | { at: "live"; kind: string; data: T }
  | { at: "stale"; kind: string; data: T; quietForMs: number }
  | { at: "lost"; problem: Problem };

/**
 * The slice of `fetch` this needs, so a test can supply its own.
 */
export type Fetching = (
  url: string,
  init: { headers: Record<string, string>; signal: AbortSignal },
) => Promise<{ ok: boolean; body: ReadableStream<Uint8Array> | null }>;

export interface Following {
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
 */
export async function* follow<T>(options: Following): AsyncGenerator<Arrival<T>> {
  const now = options.now ?? (() => Date.now());
  const silenceAllowedMs = options.silenceAllowedMs ?? SILENCE_ALLOWED_MS;
  const reconnectsAllowed = options.reconnectsAllowed ?? RECONNECTS_ALLOWED;
  const ledger = new Ledger();

  let lastEventId: string | undefined;
  let reconnects = 0;

  for (;;) {
    const body = await open(options, lastEventId);

    if (body === undefined) {
      ledger.cool();
      yield { at: "lost", problem: unreachable() };
      return;
    }

    const opening: Opening = {
      body,
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

    const quietForMs = ledger.quietForMs(now()) ?? 0;
    ledger.cool();
    yield { at: "lost", problem: streamLost(opening.broke ? quietForMs : silenceAllowedMs) };

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

  if (!read.ok) return { at: "lost", problem: read.problem };

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
 * The caller's own way of stopping is what the request is given, so a stop said
 * before this reaches the network is a request that is never made. A caller that
 * gave none is given one nothing ever raises.
 */
async function open(
  options: Following,
  lastEventId: string | undefined,
): Promise<ReadableStream<Uint8Array> | undefined> {
  const headers: Record<string, string> = {
    [TOKEN_HEADER]: options.token,
    Accept: "text/event-stream",
  };
  if (lastEventId !== undefined) headers["Last-Event-ID"] = lastEventId;

  try {
    const answer = await options.fetching(options.url, {
      headers,
      signal: options.signal ?? new AbortController().signal,
    });
    return answer.ok && answer.body !== null ? answer.body : undefined;
  } catch {
    return undefined;
  }
}
