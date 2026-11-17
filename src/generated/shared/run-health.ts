// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard` and `status` both carry.
// Regenerate with `npm run contract:generate`.

import type { ScheduledRun } from "./scheduled-run.js";

/** How a run-and-exit service's last run exited. */
export type RunHealth = "not-run" | "succeeded" | "failed";

/** One run-and-exit service, as its runs left it. */
export interface ScheduledService {
  /** Whether this machine's scheduler holds its job, so its times are fired. */
  fired: boolean;
  /** Its health: how its last run exited. */
  health: RunHealth;
  /** Its id, which is its Compose service name. */
  id: string;
  /** Its last run, where it has run. */
  last?: ScheduledRun | null;
  /** What it is called in front of an operator. */
  name: string;
  /** Whether a run of it is going now. */
  running: boolean;
  /** How many of its times fell due while a run was still going, each skipped. */
  skipped: number;
}
