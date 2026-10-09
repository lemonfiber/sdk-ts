// Generated from the lemonfiber contract. Do not edit.
// The `grant` envelope, and the shapes only `grant` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `grant`. */
export interface GrantEnvelope {
  api_version: number;
  data: GrantReport;
  host?: string | null;
  job?: string | null;
  kind: "grant";
}

/**
 * A grant to play on a member's own account, the token the device plays with, and how
 * long it lasts.
 */
export interface GrantReport {
  /** Whether a session was opened for the device. A rehearsal opens none. */
  granted: boolean;
  /**
   * The last day the grant holds unless the member's client speaks to the core
   * before then, as `YYYY-MM-DD`.
   */
  lasts_until: string;
  /** The member the device now plays as, by the name they are known by. */
  member: string;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
  /**
   * The token the device presents at the guarded front door, as
   * `Authorization: Bearer <token>`. Answered once, here, and kept by nothing in the
   * core; absent where nothing was granted.
   */
  token?: string | null;
}
