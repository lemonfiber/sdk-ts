// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/restart` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `restart` action is posted with. */
export interface ActionsRestartBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The forms to act on. */
  forms?: string[];
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /** The services to act on, leaving the rest of the form alone. */
  services?: string[];
}
