// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/migrate-adopt` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `migrate-adopt` action is posted with. */
export interface ActionsMigrateAdoptBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
}
