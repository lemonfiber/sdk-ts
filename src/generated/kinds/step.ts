// Generated from the lemonfiber contract. Do not edit.
// The `step` envelope, and the shapes only `step` carries.
// Regenerate with `npm run contract:generate`.

import type { Line } from "../shared/step__walkthrough.js";

/** The envelope carrying `step`. */
export interface StepEnvelope {
  api_version: number;
  data: Line;
  host?: string | null;
  job?: string | null;
  kind: "step";
}
