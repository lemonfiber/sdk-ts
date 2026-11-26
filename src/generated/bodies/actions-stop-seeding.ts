// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/stop-seeding` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `stop-seeding` action is posted with. */
export interface ActionsStopSeedingBody {
  /**
   * The completed download the client is to be asked to let go, by the name both
   * sides use.
   */
  download?: string | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
}
