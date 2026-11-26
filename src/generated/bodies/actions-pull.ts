// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/pull` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `pull` action is posted with. */
export interface ActionsPullBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The forms to act on. */
  forms?: string[];
}
