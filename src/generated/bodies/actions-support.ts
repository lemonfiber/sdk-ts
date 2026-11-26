// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/support` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `support` action is posted with. */
export interface ActionsSupportBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** Whether media filenames are shown rather than replaced. */
  filenames?: boolean;
  /** How many log lines to take from each service. */
  logs?: number | null;
  /** The settings to show as they are, named as the bundle names them. */
  reveal?: string[];
  /** Whether to produce the bundle, rather than say what one would hold. */
  write?: boolean;
}
