// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/uninstall` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `uninstall` action is posted with. */
export interface ActionsUninstallBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /**
   * Which of the four removals an uninstall was asked for.
   *
   * A word rather than a level, for the reason `policy` is a word: they are four
   * decisions and not a scale, and one this build does not know is refused by
   * name rather than falling to whichever removal the shape happened to default
   * to — which on this subject would be a library gone.
   */
  tier?: string | null;
  /** Whether anything still downloading is let finish before the stop. */
  wait?: boolean;
}
