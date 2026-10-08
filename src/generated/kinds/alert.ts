// Generated from the lemonfiber contract. Do not edit.
// The `alert` envelope, and the shapes only `alert` carries.
// Regenerate with `npm run contract:generate`.

import type { Alert } from "../shared/alert__dashboard.js";

/** The envelope carrying `alert`. */
export interface AlertEnvelope {
  api_version: number;
  data: Alert;
  host?: string | null;
  job?: string | null;
  kind: "alert";
}
