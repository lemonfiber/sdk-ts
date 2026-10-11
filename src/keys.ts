/**
What integration keys are minted with, and where.

Spec: 20-architecture/contracts/web-api.md
*/
import type { KeyPurpose } from "./generated/index.js";

/**
Where integration keys are listed, minted and revoked.
*/
export const KEYS = "/api/keys";

/**
What one integration key is minted with.

The password is the minter's own, given again for this one request. It is sent
in the body and kept by nothing here.
*/
export interface Minting {
  /**
  What to call it. No other key may hold the name.
  */
  name: string;
  /**
  What it admits: `read`, `act`, or `member:` and the account it acts as.
  */
  scope: "read" | "act" | `member:${string}`;
  /**
  What it is for, as whoever mints it declares.
  */
  purpose: KeyPurpose;
  /**
  The minter's password, given again.
  */
  password: string;
}
