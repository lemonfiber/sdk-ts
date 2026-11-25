// Generated from the lemonfiber contract. Do not edit.
// The `notify-heard` envelope, and the shapes only `notify-heard` carries.
// Regenerate with `npm run contract:generate`.

/** Which service told of an event. */
export interface Heard {
  /** The service whose key it presented. */
  service: string;
}

/** The envelope carrying `notify-heard`. */
export interface NotifyHeardEnvelope {
  api_version: number;
  data: Heard;
  host?: string | null;
  job?: string | null;
  kind: "notify-heard";
}
