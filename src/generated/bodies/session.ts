// Generated from the lemonfiber contract. Do not edit.
// The body `/api/session` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What a caller offers at the door. */
export interface SessionBody {
  /**
   * Who they say they are, where they say so. Absent from an operator signing in
   * with the machine's own password, which is nobody's name.
   */
  name?: string | null;
  /** What was typed. */
  password: string;
}
