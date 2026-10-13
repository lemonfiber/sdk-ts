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
The first line of the text a device key signs to prove a mint.
*/
export const MINT_FORM = "lemonfiber-mint/1";

/**
What ends every line of the text a device key signs.
*/
const LINE_END = "\n";

/**
What one integration key is: its name, what it admits and what it is for.
*/
export interface Mint {
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
}

/**
The minter's password, given again for this one request. It is sent in the
body and kept by nothing here.
*/
export interface PasswordProof {
  password: string;
}

/**
A registered device key's signature over the text `signedText` spells for this
mint and a challenge the stack issued for it.
*/
export interface DeviceProof {
  /**
  The device key's name.
  */
  device: string;
  /**
  The challenge, as the stack handed it over.
  */
  challenge: string;
  /**
  ECDSA P-256 over SHA-256, in DER, in base64url; `base64url` writes it.
  */
  signature: string;
}

/**
What one integration key is minted with: the key, and the operator's proof.
*/
export type Minting = Mint & (PasswordProof | DeviceProof);

/**
The text a device key signs to prove `mint` over `challenge`: the form, the
challenge, the name, the scope, the purpose and `claim` or `key`, each ended by
a line feed. Undefined where any part holds a line feed, which would sign
another mint.
*/
export function signedText(
  mint: Mint,
  challenge: string,
  isClaim: boolean,
): string | undefined {
  const lines = [
    MINT_FORM,
    challenge,
    mint.name,
    mint.scope,
    mint.purpose,
    isClaim ? "claim" : "key",
  ];
  if (lines.some((line) => line.includes(LINE_END))) return undefined;
  return lines.map((line) => line + LINE_END).join("");
}

/**
Bytes written as the stack reads them in a body: base64url, unpadded.
*/
export function base64url(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}
