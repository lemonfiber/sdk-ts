// Generated from the lemonfiber contract. Do not edit.
// The `watched` envelope, and the shapes only `watched` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `watched`. */
export interface WatchedEnvelope {
  api_version: number;
  data: WatchedReport;
  host?: string | null;
  job?: string | null;
  kind: "watched";
}

/** A player's report of how far a member got, as the media server now holds it. */
export interface WatchedReport {
  /** Whether it was recorded as finished. */
  ended: boolean;
  /** The title or episode, by the identifier the shelf lists it under. */
  id: string;
  /** How far in, in whole seconds, as recorded. */
  position: number;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
}
