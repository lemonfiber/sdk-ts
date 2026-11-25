// Generated from the lemonfiber contract. Do not edit.
// The `renewed` envelope, and the shapes only `renewed` carries.
// Regenerate with `npm run contract:generate`.

/** The grant to play of a member whose client spoke, and until when it holds. */
export interface Renewed {
  /** The last day the grant holds unless their client speaks again, as `YYYY-MM-DD`. */
  lasts_until: string;
  /** The member, by the id their session or key names. */
  member: string;
  /** Whether this was a rehearsal, which renews nothing. */
  rehearsed: boolean;
}

/** The envelope carrying `renewed`. */
export interface RenewedEnvelope {
  api_version: number;
  data: Renewed;
  host?: string | null;
  job?: string | null;
  kind: "renewed";
}
