// Generated from the lemonfiber contract. Do not edit.
// The `logs` envelope, and the shapes only `logs` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `logs`. */
export interface LogsEnvelope {
  api_version: number;
  data: LogsReport;
  host?: string | null;
  job?: string | null;
  kind: "logs";
}

/** What reading the logs came to. */
export interface LogsReport {
  /** How many lines were read. */
  lines: number;
}
