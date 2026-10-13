// Generated from the lemonfiber contract. Do not edit.
// The `device-key` envelope, and the shapes only `device-key` carries.
// Regenerate with `npm run contract:generate`.

import type { DeviceKeyBacking } from "../shared/device-key__device-keys.js";

/** The envelope carrying `device-key`. */
export interface DeviceKeyEnvelope {
  api_version: number;
  data: RegisteredDeviceKey;
  host?: string | null;
  job?: string | null;
  kind: "device-key";
}

/** A device key registered. */
export interface RegisteredDeviceKey {
  /** The app that made it, as `LEMONFIBER_DEVICE_KEY_APPS` spells an identity. */
  app: string;
  /** Where it lives, as its attestation says. */
  backing: DeviceKeyBacking;
  /** The SHA-256 of its public half's `SubjectPublicKeyInfo`, in lower-case hex. */
  fingerprint: string;
  /** The name it was registered under. */
  name: string;
  /** When it was registered. */
  registered: string;
}
