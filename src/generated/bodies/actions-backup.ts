// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/backup` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `backup` action is posted with. */
export interface ActionsBackupBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The one service to act on instead of the whole stack. */
  service?: string | null;
}
