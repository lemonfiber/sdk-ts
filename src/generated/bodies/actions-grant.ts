// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/grant` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `grant` action is posted with. */
export interface ActionsGrantBody {
  /**
   * The id a player keeps for the device it plays on, which a grant opens a session
   * for.
   */
  device?: string | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
}
