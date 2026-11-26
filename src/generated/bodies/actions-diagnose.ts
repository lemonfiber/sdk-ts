// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/diagnose` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `diagnose` action is posted with. */
export interface ActionsDiagnoseBody {
  /** Whether the checks that disturb the running system are included. */
  disruptive: boolean;
  /** The group of checks, or the one check, a diagnosis is narrowed to. */
  only?: string | null;
}
