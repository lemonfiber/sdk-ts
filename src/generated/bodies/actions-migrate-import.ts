// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/migrate-import` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `migrate-import` action is posted with. */
export interface ActionsMigrateImportBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
}
