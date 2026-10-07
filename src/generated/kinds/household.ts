// Generated from the lemonfiber contract. Do not edit.
// The `household` envelope, and the shapes only `household` carries.
// Regenerate with `npm run contract:generate`.

import type { HouseholdReport } from "../shared/dashboard__household.js";

/** The envelope carrying `household`. */
export interface HouseholdEnvelope {
  api_version: number;
  data: HouseholdReport;
  host?: string | null;
  job?: string | null;
  kind: "household";
}
