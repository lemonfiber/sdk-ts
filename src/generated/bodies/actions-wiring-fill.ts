// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/wiring-fill` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `wiring-fill` action is posted with. */
export interface ActionsWiringFillBody {
  /** The capability whose filler is being chosen. */
  capability?: string | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /**
   * Why a request is being turned down, or why a service was chosen to fill a
   * capability.
   */
  reason?: string | null;
  /** The one service to act on instead of the whole stack. */
  service?: string | null;
}
