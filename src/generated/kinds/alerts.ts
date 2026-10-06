// Generated from the lemonfiber contract. Do not edit.
// The `alerts` envelope, and the shapes only `alerts` carries.
// Regenerate with `npm run contract:generate`.

/** What the operator will be told about, and what changing it came to. */
export interface AlertReport {
  /** Whether this call changed the answer. */
  changed: boolean;
  /** Events set apart from the preset, quietest name first. */
  exceptions: ExceptionReport[];
  /** What that preset means, in the operator's terms. */
  means: string;
  /** The preset in force for events with no exception of their own. */
  preset: string;
  /** Whether it only reported what it would have written. */
  rehearsed: boolean;
}

/** The envelope carrying `alerts`. */
export interface AlertsEnvelope {
  api_version: number;
  data: AlertReport;
  host?: string | null;
  kind: "alerts";
}

/** One event kind the operator set apart from the preset. */
export interface ExceptionReport {
  /** The kind of event, by the name a finding gives it. */
  kind: string;
  /** Whether it is heard about, whatever the preset would say. */
  wanted: boolean;
}
