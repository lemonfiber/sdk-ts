// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/household-approve` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `household-approve` action is posted with. */
export interface ActionsHouseholdApproveBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * The request being ruled on, by the reference the household list names it with:
   * the request service's own number (`42`), or `tv-<n>`, `movies-<n>`, `music-<n>` or
   * `books-<n>` for an ask the core keeps.
   */
  request?: string | null;
}
