// Generated from the lemonfiber contract. Do not edit.
// The body `/api/device-keys` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** An attestation as a phone sends it, tagged by the platform that made it. */
export type DeviceKeyAttestation = DeviceKeyAttestationAndroid | DeviceKeyAttestationIos;

/** An Android key attestation. */
export interface DeviceKeyAttestationAndroid {
  /**
   * The chain, each certificate's DER in base64url, the key's own certificate
   * first.
   */
  chain: string[];
  platform: "android";
}

/**
 * An iOS App Attest attestation, made with the SHA-256 of exactly the bytes
 * `public_key` decodes to as its client data hash.
 */
export interface DeviceKeyAttestationIos {
  /** The attestation object's CBOR, in base64url. */
  object: string;
  platform: "ios";
}

/** What a registration is asked with. */
export interface DeviceKeysBody {
  /** The platform's attestation of where the key lives. */
  attestation?: DeviceKeyAttestation | null;
  /** What to call it: lower-case letters, digits, dots, dashes and underscores. */
  name: string;
  /** The operator's password, given again. */
  password: string;
  /**
   * The public half of a P-256 key pair, as its `SubjectPublicKeyInfo` in base64url,
   * its point uncompressed.
   */
  public_key: string;
}
