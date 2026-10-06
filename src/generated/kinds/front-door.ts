// Generated from the lemonfiber contract. Do not edit.
// The `front-door` envelope, and the shapes only `front-door` carries.
// Regenerate with `npm run contract:generate`.

import type { FrontDoorReport } from "../shared/dashboard__front-door.js";

/** The envelope carrying `front-door`. */
export interface FrontDoorEnvelope {
  api_version: number;
  data: FrontDoorReport;
  host?: string | null;
  kind: "front-door";
}
