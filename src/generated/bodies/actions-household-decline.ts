// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/household-decline` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `household-decline` action is posted with. */
export interface ActionsHouseholdDeclineBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * Why a request is being turned down, or why a service was chosen to fill a
   * capability.
   */
  reason?: string | null;
  /**
   * The request being ruled on, by the reference the household list names it with:
   * the request service's own number (`42`), or `tv-<n>`, `movies-<n>`, `music-<n>` or
   * `books-<n>` for an ask the core keeps.
   */
  request?: string | null;
}
