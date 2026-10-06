// Generated from the lemonfiber contract. Do not edit.
// The `pairing` envelope, and the shapes only `pairing` carries.
// Regenerate with `npm run contract:generate`.

/** Pairing material, and what the operator is told beside it. */
export interface Pairing {
  /** What is worth knowing about the address itself, where anything is. */
  caution?: string | null;
  /**
   * The fingerprint in the short form a person compares with what the phone shows
   * after typing the line in, as [`comparable`] derives it.
   */
  compare: string;
  /** The material itself. */
  material: PairingMaterial;
  /**
   * What would make every paired phone refuse this machine, said now rather than
   * discovered then. In words any surface can show: how the certificate is replaced
   * is each surface's own to say, so this names no command.
   */
  replacing: string;
  /** When it stops being good, as a date and a time of day. */
  until: string;
  /** The material as the one line a code carries and a person types. */
  written: string;
}

/** The envelope carrying `pairing`. */
export interface PairingEnvelope {
  api_version: number;
  data: Pairing;
  host?: string | null;
  kind: "pairing";
}

/**
 * What a phone is handed, exactly as it reads it.
 *
 * Four fields and no more: a reader refuses one it does not know, which is what keeps a
 * credential from ever riding along under a name nobody thought to forbid.
 */
export interface PairingMaterial {
  /** Where the phone reaches the stack: an `https` address on the household network. */
  address: string;
  /** When the material stops being good, in seconds since the Unix epoch. */
  expires: number;
  /**
   * The certificate that address presents: SHA-256 over its DER encoding, in
   * lower-case hex. Not the digest of its public key.
   */
  fingerprint: string;
  /**
   * The stack's own identifier: opaque, minted once from nothing and kept, and the
   * same across every issue of the material, a change of address and a replacement of
   * the certificate. Not the stack's name and not its version, and it carries nothing
   * about the household or anybody in it.
   */
  stack: string;
}
