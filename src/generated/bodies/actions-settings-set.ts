// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/settings-set` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `settings-set` action is posted with. */
export interface ActionsSettingsSetBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /**
   * Each setting to change, by the name the settings read lists it under, with the
   * value it is to hold, written as exactly itself.
   */
  values?: { [key: string]: string };
}
