/**
 * How long one call may take, every attempt at it included, and the caller's way
 * of stopping it, held as one signal.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { misconfigured, outOfTime, stopped, type Problem } from "./problem.js";

/**
 * The longest a call waits where neither the client nor the call says otherwise.
 */
export const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * What a caller may say about one call.
 */
export interface Asking {
  /**
   * The caller's way of stopping the call before an answer arrives.
   */
  signal?: AbortSignal;
  /**
   * The longest this call waits, every attempt included, in place of the
   * client's.
   */
  timeoutMs?: number;
}

/**
 * One call's signal, why it ended where it did, and the clock to let go of.
 */
export interface Call {
  readonly signal: AbortSignal;
  /**
   * Why the call ended without an answer: the wait ran out, or the caller
   * stopped it. Nothing where neither happened.
   */
  readonly ended: () => Problem | undefined;
  readonly release: () => void;
}

/**
 * Whether a length of time is one a call can wait.
 */
export const isAWait = (milliseconds: number): boolean =>
  Number.isFinite(milliseconds) && milliseconds > 0;

/**
 * A wait that is not a length of time, refused before anything is sent.
 */
export const notAWait = (milliseconds: number): Problem =>
  misconfigured(
    `A wait of ${String(milliseconds)} milliseconds is not one a call can wait. Give a number of milliseconds above zero.`,
  );

/**
 * What `work` comes to, or nothing where `ending` is raised first or the work
 * fails. A `sending` that ignores its signal is let go of rather than waited on.
 */
export async function within<T>(work: Promise<T>, ending: AbortSignal): Promise<T | undefined> {
  if (ending.aborted) return undefined;
  const settled = new AbortController();
  const cut = new Promise<undefined>((resolve) => {
    ending.addEventListener(
      "abort",
      () => {
        resolve(undefined);
      },
      { once: true, signal: settled.signal },
    );
  });
  try {
    return await Promise.race([work, cut]);
  } catch {
    return undefined;
  } finally {
    settled.abort();
  }
}

/**
 * A call that ends after `timeoutMs` or when `caller` says so, whichever comes first.
 */
export function callFor(timeoutMs: number, caller?: AbortSignal): Call {
  const ending = new AbortController();
  let why: Problem | undefined;
  const end = (problem: Problem): void => {
    if (why !== undefined) return;
    why = problem;
    ending.abort();
  };
  const clock = setTimeout(() => {
    end(outOfTime(timeoutMs));
  }, timeoutMs);
  const stopping = (): void => {
    end(stopped());
  };
  if (caller?.aborted === true) stopping();
  caller?.addEventListener("abort", stopping, { once: true });

  return {
    signal: ending.signal,
    ended: () => why,
    release: () => {
      clearTimeout(clock);
      caller?.removeEventListener("abort", stopping);
    },
  };
}
