// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/switch` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `switch` action is posted with. */
export interface ActionsSwitchBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The forms to act on. */
  forms?: string[];
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
}
