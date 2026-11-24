// Generated from the lemonfiber contract. Do not edit.
// The `replay` envelope, and the shapes only `replay` carries.
// Regenerate with `npm run contract:generate`.

/** What a stream opened again from an id says of what it is handed before going on. */
export interface Replay {
  /** Whether it holds every alert raised since the id. */
  alerts: ReplayAlerts;
}

/** Whether a replay holds every alert raised since the id it was asked from. */
export type ReplayAlerts = "whole" | "partial";

/** The envelope carrying `replay`. */
export interface ReplayEnvelope {
  api_version: number;
  data: Replay;
  host?: string | null;
  job?: string | null;
  kind: "replay";
}
