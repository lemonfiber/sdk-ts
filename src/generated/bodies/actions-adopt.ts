// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/adopt` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `adopt` action is posted with. */
export interface ActionsAdoptBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
}
