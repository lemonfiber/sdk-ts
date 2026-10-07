// Generated from the lemonfiber contract. Do not edit.
// The `preview` envelope, and the shapes only `preview` carries.
// Regenerate with `npm run contract:generate`.

import type { Plan } from "../shared/lifecycle__preview.js";

/** The envelope carrying `preview`. */
export interface PreviewEnvelope {
  api_version: number;
  data: Plan;
  host?: string | null;
  job?: string | null;
  kind: "preview";
}
