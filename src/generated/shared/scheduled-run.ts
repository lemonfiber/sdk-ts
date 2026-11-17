// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard`, `ran` and `status` all carry.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "./instant.js";

/** One run of a run-and-exit service, as it ended. */
export interface ScheduledRun {
  /** When it ended. */
  ended: Instant;
  /** How it exited, absent where it never started or a signal ended it. */
  exit?: number | null;
  /**
   * The last lines it wrote, oldest first, each with any credential in it withheld;
   * none to a key, a member or the shared stream, none of which is handed them.
   */
  log: string[];
  /** When it started. */
  started: Instant;
}
