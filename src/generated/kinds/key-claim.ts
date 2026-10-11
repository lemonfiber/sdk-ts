// Generated from the lemonfiber contract. Do not edit.
// The `key-claim` envelope, and the shapes only `key-claim` carries.
// Regenerate with `npm run contract:generate`.

import type { KeyPurpose } from "../shared/key-claim__keys__minted-key.js";

/** A key minted as a claim: the link that collects it, and no secret. */
export interface KeyClaim {
  /** When the claim stops collecting the key, written as every other instant is. */
  lapses: string;
  /**
   * The key link: `lemonfiber://key` with the address, the certificate fingerprint,
   * the stack, when the claim lapses and the claim. Shown once, and drawn as a code.
   */
  link: string;
  /** The name it was minted under. */
  name: string;
  /** What the minter said it is for. */
  purpose: KeyPurpose;
  /** What it admits: `read`, `act` or `member:<name>`. */
  scope: string;
}

/** The envelope carrying `key-claim`. */
export interface KeyClaimEnvelope {
  api_version: number;
  data: KeyClaim;
  host?: string | null;
  job?: string | null;
  kind: "key-claim";
}
