// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/plugin-update` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `plugin-update` action is posted with. */
export interface ActionsPluginUpdateBody {
  /**
   * Every value a recipe would carry elsewhere that is approved, as `value@destination`,
   * every privileged shape, as `shape@service`, and every credential granted to a
   * plugin, as `setting@plugin`, exactly as the reading lists them.
   */
  approved?: string[];
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * Every value the operator supplies for an input a recipe asks for, as `name=value`.
   * What follows the `=` may be a secret, and is never repeated back.
   */
  inputs?: string[];
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
  /**
   * Where a plugin comes from: its name in the catalogue, its directory on this
   * machine or the `plugin.toml` inside it, or a git repository, at a branch, tag or
   * commit named after its last `@`.
   */
  source?: string | null;
}
