// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/push-woken` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `push-woken` action is posted with. */
export interface ActionsPushWokenBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * The thing an action is about, by its id: the title or episode a player's progress
   * is on, by the identifier the shelf lists it under, the title a member asks for, by
   * the identifier their search listed it under, or the wake a phone confirms.
   */
  id?: string | null;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
}
