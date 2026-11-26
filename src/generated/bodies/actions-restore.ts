// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/restore` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `restore` action is posted with. */
export interface ActionsRestoreBody {
  /** The backup to restore from, by the name it was written under. */
  archive?: string | null;
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /** Whether re-pointing to this machine's data root was accepted. */
  repoint?: boolean;
}
