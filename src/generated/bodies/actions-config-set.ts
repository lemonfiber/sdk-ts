// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/config-set` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `config-set` action is posted with. */
export interface ActionsConfigSetBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The configuration key to change. */
  key?: string | null;
  /** What to change the key to, written as exactly itself. */
  value?: string | null;
  /** Whether anything still downloading is let finish before the stop. */
  wait?: boolean;
}
