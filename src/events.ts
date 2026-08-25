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
 * What one opening of the stream needs in order to be read.
 */
interface Opening {
  body: ReadableStream<Uint8Array>;
  ledger: Ledger;
  now: () => number;
  silenceAllowedMs: number;
  onId: (id: string) => void;
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
 */
async function* readOpening<T>(opening: Opening): AsyncGenerator<Arrival<T>> {
  const reader = opening.body.getReader();
  const parser = new SseParser();
  const decoder = new TextDecoder();

  for (;;) {
    const chunk = await nextChunk(reader);
    if (chunk === undefined) return;

    const events = parser.push(decoder.decode(chunk, { stream: true }));

    for (const event of events) {
      if (event.id !== undefined) opening.onId(event.id);
      yield received<T>(event.data, opening);
    }

    if (opening.ledger.isBroken(opening.now(), opening.silenceAllowedMs)) {
      opening.broke = true;
      return;
    }
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
 * The next chunk, or nothing once the stream has ended or failed.
 */
async function nextChunk(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): Promise<Uint8Array | undefined> {
  try {
    const step = await reader.read();
    return step.done ? undefined : step.value;
  } catch {
    return undefined;
  }
}

/**
 * Opens the stream, resuming from `lastEventId` where there is one.
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
      signal: new AbortController().signal,
    });
    return answer.ok && answer.body !== null ? answer.body : undefined;
  } catch {
    return undefined;
  }
}
