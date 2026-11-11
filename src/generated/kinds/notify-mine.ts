// Generated from the lemonfiber contract. Do not edit.
// The `notify-mine` envelope, and the shapes only `notify-mine` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `notify-mine`. */
export interface NotifyMineEnvelope {
  api_version: number;
  data: NotifyMineReport;
  host?: string | null;
  job?: string | null;
  kind: "notify-mine";
}

/**
 * The ways a member may be told that something they asked for is ready, and nothing
 * technical.
 */
export interface NotifyMineReport {
  /** Each way the operator offered the household, in the order it was offered. */
  offered: NotifyOffered[];
  /** Whether this member's own phone is registered to be woken. */
  phone: boolean;
  /** Whether this was a rehearsal of a choice, with nothing kept. */
  rehearsed: boolean;
}

/** One way to be told that the operator offered the household, as a member reads it. */
export interface NotifyOffered {
  /** What it is chosen by. */
  id: string;
  /** The name the household reads it by. */
  name: string;
  /** Whether this member is told on it. */
  receiving: boolean;
}
