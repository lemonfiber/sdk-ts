// Generated from the lemonfiber contract. Do not edit.
// The `logs-exported` envelope, and the shapes only `logs-exported` carries.
// Regenerate with `npm run contract:generate`.

/** Where an export went, or would have gone. */
export interface LogsExported {
  /** The file, named relative to the directory the viewer was run in. */
  path: string;
  /** Whether it only said where it would have written. */
  rehearsed: boolean;
}

/** The envelope carrying `logs-exported`. */
export interface LogsExportedEnvelope {
  api_version: number;
  data: LogsExported;
  host?: string | null;
  job?: string | null;
  kind: "logs-exported";
}
