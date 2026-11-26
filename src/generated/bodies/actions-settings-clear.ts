// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/settings-clear` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `settings-clear` action is posted with. */
export interface ActionsSettingsClearBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /**
   * The settings to put back to their defaults, by the names the settings read lists
   * them under.
   */
  settings?: string[];
}
