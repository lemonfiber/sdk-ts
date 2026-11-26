// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/household-handoff` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `household-handoff` action is posted with. */
export interface ActionsHouseholdHandoffBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
}
