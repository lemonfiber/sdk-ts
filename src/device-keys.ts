/**
Where the operator's device keys are listed, registered, revoked and
challenged, and what a registration is asked with.

Spec: 20-architecture/contracts/web-api.md
*/
import type { DeviceKeyAttestation } from "./generated/index.js";
import { base64url } from "./keys.js";

/**
Where device keys are listed and registered.
*/
export const DEVICE_KEYS = "/api/device-keys";

/**
Where the device key of that name is revoked, the name sent as one segment.
*/
export const deviceKey = (name: string): string => `${DEVICE_KEYS}/${encodeURIComponent(name)}`;

/**
Where a challenge for the device key of that name is asked for.
*/
export const deviceKeyChallenge = (name: string): string => `${deviceKey(name)}/challenge`;

/**
What one device key is registered with.

The password is the operator's, given again for this one request; nothing here
keeps it.
*/
export interface Registering {
  /**
  What to call it: lower-case letters, digits, dots, dashes and underscores.
  */
  name: string;
  /**
  The public half's `SubjectPublicKeyInfo` DER.
  */
  publicKey: Uint8Array;
  /**
  The platform's attestation of where the key lives and which app made it.
  */
  attestation: DeviceKeyAttestation;
  /**
  The operator's password, given again.
  */
  password: string;
}

/**
The body a registration is sent as.
*/
export function registrationBody(registering: Registering): string {
  return JSON.stringify({
    name: registering.name,
    public_key: base64url(registering.publicKey),
    attestation: registering.attestation,
    password: registering.password,
  });
}
