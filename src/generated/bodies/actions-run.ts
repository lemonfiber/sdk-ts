// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/run` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `run` action is posted with. */
export interface ActionsRunBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * Whether a run-and-exit service runs at once, whether or not one of its times fell
   * due.
   */
  now?: boolean;
  /** The one service to act on instead of the whole stack. */
  service?: string | null;
}
