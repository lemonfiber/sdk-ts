// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/plugin-remove` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `plugin-remove` action is posted with. */
export interface ActionsPluginRemoveBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /**
   * The plugin an update or a removal acts on, by the id the record of what is
   * installed lists it under.
   */
  plugin?: string | null;
}
