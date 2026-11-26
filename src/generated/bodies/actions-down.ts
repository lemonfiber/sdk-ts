// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/down` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `down` action is posted with. */
export interface ActionsDownBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The forms to act on. */
  forms?: string[];
  /** The services to act on, leaving the rest of the form alone. */
  services?: string[];
  /** Whether anything still downloading is let finish before the stop. */
  wait?: boolean;
}
