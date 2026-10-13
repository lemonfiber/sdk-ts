// Generated from the lemonfiber contract. Do not edit.
// The `device-challenge` envelope, and the shapes only `device-challenge` carries.
// Regenerate with `npm run contract:generate`.

/** A challenge, as the phone is handed it to sign. */
export interface DeviceChallenge {
  /** The challenge, in base64url, signed as it is written here. */
  challenge: string;
  /** When it stops standing, one minute after it was issued. */
  expires: string;
}

/** The envelope carrying `device-challenge`. */
export interface DeviceChallengeEnvelope {
  api_version: number;
  data: DeviceChallenge;
  host?: string | null;
  job?: string | null;
  kind: "device-challenge";
}
