// Generated from the lemonfiber contract. Do not edit.
// The `keys` envelope, and the shapes only `keys` carries.
// Regenerate with `npm run contract:generate`.

import type { KeyPurpose } from "../shared/keys__minted-key.js";

/** Every key this machine has minted, and what became of a revoke. */
export interface KeyListing {
  /** In the order they were minted. */
  keys: ListedKey[];
  /** What a purpose in the listing is worth, said with it. */
  purposes: string;
  /** Whether this was a rehearsal: what revoking would come to, with nothing revoked. */
  rehearsed: boolean;
  /** The key this run revoked, where it revoked one. */
  revoked?: string | null;
}

/** Where a key stands. */
export type KeyState = "active" | "revoked" | "orphaned" | "unconfirmed";

/** The envelope carrying `keys`. */
export interface KeysEnvelope {
  api_version: number;
  data: KeyListing;
  host?: string | null;
  job?: string | null;
  kind: "keys";
}

/** One key as the listing shows it, without its secret. */
export interface ListedKey {
  /** Whether a household member minted it for themselves. */
  member_minted: boolean;
  /** When it was minted. */
  minted: string;
  /** The name it was minted under. */
  name: string;
  /** What the minter said it is for. A declaration, not something the core verified. */
  purpose: KeyPurpose;
  /** When it was revoked, where it has been. */
  revoked?: string | null;
  /** What it admits: `read`, `act` or `member:<name>`. */
  scope: string;
  /** Where it stands. */
  state: KeyState;
  /** When it was last admitted, where it has been. */
  used?: string | null;
}
