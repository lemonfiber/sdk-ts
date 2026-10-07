// Generated from the lemonfiber contract. Do not edit.
// The `doctor` envelope, and the shapes only `doctor` carries.
// Regenerate with `npm run contract:generate`.

import type { Finding } from "../shared/doctor__plugins.js";

/** The envelope carrying `doctor`. */
export interface DoctorEnvelope {
  api_version: number;
  data: DoctorReport;
  host?: string | null;
  job?: string | null;
  kind: "doctor";
}

/** What a diagnostic run found, and what it amounts to. */
export interface DoctorReport {
  /** Each finding, in the order the checks produced them. */
  findings: Finding[];
  /** What the findings amount to, as one word. */
  overall: Overall;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}

/** What a run's findings amount to. */
export type Overall = "healthy" | "degraded" | "broken" | "unknown";
