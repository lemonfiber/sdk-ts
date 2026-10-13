// Generated from the lemonfiber contract. Do not edit.
// The body `/api/keys` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What a mint is asked with. */
export interface KeysBody {
  /** The challenge the core issued for this device key, as it was handed over. */
  challenge?: string | null;
  /**
   * Whether to mint it as a claim: the reply carries the link a program collects it
   * with, once, within ten minutes, and no secret.
   */
  claim?: boolean;
  /** The name of the device key whose signature stands in for the password. */
  device?: string | null;
  /** What to call it. */
  name: string;
  /**
   * The operator's password, given again; or, from a phone, nothing, and the three
   * fields that prove the operator with a device key in its place.
   */
  password?: string | null;
  /** What it is for: `home-assistant`, `mcp` or `other`. */
  purpose: string;
  /** What it admits: `read`, `act` or `member:<account>`. */
  scope: string;
  /**
   * ECDSA P-256 over SHA-256, in DER, in base64url, of the UTF-8 lines
   * `lemonfiber-mint/1`, the challenge, the name, the scope, the purpose and `claim` or
   * `key`, each ended by a line feed.
   */
  signature?: string | null;
}
