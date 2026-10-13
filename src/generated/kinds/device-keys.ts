// Generated from the lemonfiber contract. Do not edit.
// The `device-keys` envelope, and the shapes only `device-keys` carries.
// Regenerate with `npm run contract:generate`.

import type { DeviceKeyBacking } from "../shared/device-key__device-keys.js";

/** Every device key this machine has registered, and what became of a revoke. */
export interface DeviceKeyListing {
  /** In the order they were registered. */
  keys: ListedDeviceKey[];
  /** Whether this was a rehearsal: what revoking would come to, with nothing revoked. */
  rehearsed: boolean;
  /** The device key this request revoked, where it revoked one. */
  revoked?: string | null;
}

/** The envelope carrying `device-keys`. */
export interface DeviceKeysEnvelope {
  api_version: number;
  data: DeviceKeyListing;
  host?: string | null;
  job?: string | null;
  kind: "device-keys";
}

/** One device key as the listing shows it. */
export interface ListedDeviceKey {
  /** The app that made it. */
  app: string;
  /** Where it lives, as its attestation said. */
  backing: DeviceKeyBacking;
  /** The SHA-256 of its public half's `SubjectPublicKeyInfo`, in lower-case hex. */
  fingerprint: string;
  /** The name it was registered under. */
  name: string;
  /** When it was registered. */
  registered: string;
  /** When it was revoked, where it has been. */
  revoked?: string | null;
  /** When it last proved a mint, where it has. */
  used?: string | null;
}
