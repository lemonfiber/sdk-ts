// Generated from the lemonfiber contract. Do not edit.
// The `undo` envelope, and the shapes only `undo` carries.
// Regenerate with `npm run contract:generate`.

import type { UndoReversal } from "../shared/plugins__undo.js";

/** The envelope carrying `undo`. */
export interface UndoEnvelope {
  api_version: number;
  data: UndoReversal;
  host?: string | null;
  kind: "undo";
}
