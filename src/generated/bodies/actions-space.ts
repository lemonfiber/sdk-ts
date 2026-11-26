// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/space` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `space` action is posted with. */
export interface ActionsSpaceBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /** The categories of what the offer holds as costing nothing to take, orphaned or extracted; all it holds where none is named. */
  only?: string[];
}
