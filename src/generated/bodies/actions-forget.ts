// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/forget` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `forget` action is posted with. */
export interface ActionsForgetBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
}
