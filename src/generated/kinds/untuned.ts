// Generated from the lemonfiber contract. Do not edit.
// The `untuned` envelope, and the shapes only `untuned` carries.
// Regenerate with `npm run contract:generate`.

/** How many live streams whose passes lapsed unrenewed were closed. */
export interface Untuned {
  /** How many were closed. */
  closed: number;
}

/** The envelope carrying `untuned`. */
export interface UntunedEnvelope {
  api_version: number;
  data: Untuned;
  host?: string | null;
  job?: string | null;
  kind: "untuned";
}
