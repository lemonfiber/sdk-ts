// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/invite` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `invite` action is posted with. */
export interface ActionsInviteBody {
  /** The age above which an invitation has the media server hold things back. */
  age_limit?: number | null;
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * The libraries an invitation lets them open, by the names the media server
   * gives those libraries. Empty is every one.
   */
  libraries?: string[];
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
  /**
   * What is to happen to content the media server has no rating for.
   *
   * A word rather than a switch, because the choice has a cost either way and a
   * switch has a default nobody can see: `block` holds unrated content back, and
   * `allow` lets it through. Carried as it was written and read next door, so a
   * word this build does not know is refused by name rather than falling to
   * whichever answer the shape happened to default to.
   */
  unrated?: string | null;
}
