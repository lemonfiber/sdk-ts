// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/undo` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";

/** What the `undo` action is posted with. */
export interface ActionsUndoBody {
  /** When the run to put back was made, as the history writes it. */
  at?: Instant | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
}
