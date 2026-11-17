// Generated from the lemonfiber contract. Do not edit.
// The `ran` envelope, and the shapes only `ran` carries.
// Regenerate with `npm run contract:generate`.

import type { ScheduledRun } from "../shared/scheduled-run.js";

/** The envelope carrying `ran`. */
export interface RanEnvelope {
  api_version: number;
  data: RunReport;
  host?: string | null;
  job?: string | null;
  kind: "ran";
}

/** What `lemonfiber run` came to for one service. */
export interface RunReport {
  /** Whether a time fell due or a run was owed, so it ran or would have. */
  due: boolean;
  /** Why nothing was looked at, where something held it back. */
  held?: string | null;
  /** The run, where one went. */
  ran?: ScheduledRun | null;
  /** Whether nothing was run because this was a rehearsal. */
  rehearsed: boolean;
  /** The service. */
  service: string;
  /** How many times fell due while that run was still going, each skipped. */
  skipped: number;
}
