// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/household-allow` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `household-allow` action is posted with. */
export interface ActionsHouseholdAllowBody {
  /** How long that period is, in days. */
  days?: number | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
  /**
   * What is to happen to what the household asks for, as it is written.
   *
   * A word rather than a switch, for the reason `unrated` is one: there are three
   * answers rather than two, and a word this build does not know is refused by name
   * instead of falling to whichever arrangement the shape happened to default to.
   */
  policy?: string | null;
  /** How many requests a period allows. */
  requests?: number | null;
}
