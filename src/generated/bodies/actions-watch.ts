// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/watch` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `watch` action is posted with. */
export interface ActionsWatchBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The forms to act on. */
  forms?: string[];
}
