// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/hosting-install` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `hosting-install` action is posted with. */
export interface ActionsHostingInstallBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The forms to act on. */
  forms?: string[];
  /**
   * Which command this machine is being asked to keep running, or stop keeping.
   *
   * A word rather than a switch, for the reason `policy` is one: there is more than
   * one of them, and a word this build does not know is refused by name rather than
   * silently taken for whichever the shape happened to default to.
   */
  kept?: string | null;
}
