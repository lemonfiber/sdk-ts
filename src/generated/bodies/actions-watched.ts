// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/watched` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `watched` action is posted with. */
export interface ActionsWatchedBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * Whether the member finished it. Absent says nothing about finishing, which is
   * a position like any other.
   */
  ended?: boolean | null;
  /**
   * The thing an action is about, by its id: the title or episode a player's progress
   * is on, by the identifier the shelf lists it under, the title a member asks for, by
   * the identifier their search listed it under, or the wake a phone confirms.
   */
  id?: string | null;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
  /** How far into it the member is, in whole seconds. */
  position?: number | null;
}
