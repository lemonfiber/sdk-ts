// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/play` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `play` action is posted with. */
export interface ActionsPlayBody {
  /**
   * The id a player keeps for the device it plays on, which a grant opens a session
   * for.
   */
  device?: string | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * The thing an action is about, by its id: the title or episode a player's progress
   * is on, by the identifier the shelf lists it under, the title a member asks for, by
   * the identifier their search listed it under, or the wake a phone confirms.
   */
  id?: string | null;
  /** The pass a browser holds, handed back for a new one around the same session. */
  pass?: string | null;
}
