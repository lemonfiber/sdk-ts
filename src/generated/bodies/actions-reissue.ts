// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/reissue` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `reissue` action is posted with. */
export interface ActionsReissueBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
}
