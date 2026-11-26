// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/tune` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `tune` action is posted with. */
export interface ActionsTuneBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * The thing an action is about, by its id: the title or episode a player's progress
   * is on, by the identifier the shelf lists it under, the title a member asks for, by
   * the identifier their search listed it under, or the wake a phone confirms.
   */
  id?: string | null;
  /** Whether to close the live stream named rather than renew its passes. */
  stop?: boolean | null;
  /**
   * The live stream a renewal or a stop names, as a channel opened for the member
   * answered it.
   */
  stream?: string | null;
}
