// Generated from the lemonfiber contract. Do not edit.
// The `error` envelope, and the shapes only `error` carries.
// Regenerate with `npm run contract:generate`.

import type { Problem } from "../shared/doctor__error__plugins.js";

/** The envelope carrying `error`. */
export interface ErrorEnvelope {
  api_version: number;
  data: Problem;
  host?: string | null;
  job?: string | null;
  kind: "error";
}
