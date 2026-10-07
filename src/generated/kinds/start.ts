// Generated from the lemonfiber contract. Do not edit.
// The `start` envelope, and the shapes only `start` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `start`. */
export interface StartEnvelope {
  api_version: number;
  data: string;
  host?: string | null;
  job?: string | null;
  kind: "start";
}
