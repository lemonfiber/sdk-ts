// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/repair` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `repair` action is posted with. */
export interface ActionsRepairBody {
  /** The checks whose repairs were agreed to, as that offer names them. */
  agreed?: string[];
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether the checks that disturb the running system are included. */
  disruptive: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
}
