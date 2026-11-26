// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/remove` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `remove` action is posted with. */
export interface ActionsRemoveBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
}
