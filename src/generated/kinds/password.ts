// Generated from the lemonfiber contract. Do not edit.
// The `password` envelope, and the shapes only `password` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `password`. */
export interface PasswordEnvelope {
  api_version: number;
  data: PasswordReport;
  host?: string | null;
  job?: string | null;
  kind: "password";
}

/** What setting the password came to. */
export interface PasswordReport {
  /** Whether every device key registered under the password before was revoked. */
  device_keys_revoked: boolean;
}
