// Generated from the lemonfiber contract. Do not edit.
// The `minted-key` envelope, and the shapes only `minted-key` carries.
// Regenerate with `npm run contract:generate`.

import type { KeyPurpose } from "../shared/keys__minted-key.js";

/**
 * A key minted, with everything a client on another machine needs to use it.
 *
 * The only document that ever carries the secret. Every surface that renders it does so
 * once, and nothing here writes it down.
 */
export interface MintedKey {
  /**
   * Where a client on another machine reaches the stack: the `https` address it was
   * last served at on the network. Absent where it has never been served that way.
   */
  address?: string | null;
  /**
   * What is worth knowing before handing the key over, where anything is: how to
   * serve the stack so another machine can reach it.
   */
  caution?: string | null;
  /** The name it was minted under. */
  name: string;
  /**
   * The certificate that address presents: SHA-256 over its DER encoding, in
   * lower-case hex. A client off this machine pins it.
   */
  pin?: string | null;
  /** What the minter said it is for. */
  purpose: KeyPurpose;
  /** What it admits: `read`, `act` or `member:<name>`. */
  scope: string;
  /** The secret, sent in `X-Lemonfiber-Token`. It is not shown again. */
  secret: Secret;
}

/** The envelope carrying `minted-key`. */
export interface MintedKeyEnvelope {
  api_version: number;
  data: MintedKey;
  host?: string | null;
  kind: "minted-key";
}

/**
 * A key's secret, as it is handed over once.
 *
 * It has no `Debug` that prints it and no way back from its digest, and nothing here
 * writes it anywhere: the one reply that carries it is the only place it appears.
 */
export type Secret = string;
