// Generated from the lemonfiber contract. Do not edit.
// The `pull` envelope, and the shapes only `pull` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `pull`. */
export interface PullEnvelope {
  api_version: number;
  data: string;
  host?: string | null;
  job?: string | null;
  kind: "pull";
}
