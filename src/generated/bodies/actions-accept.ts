// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/accept` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `accept` action is posted with. */
export interface ActionsAcceptBody {
  /** The check a warning is being answered for. */
  check?: string | null;
  /** Whether the checks that disturb the running system are included. */
  disruptive: boolean;
}
