// Generated from the lemonfiber contract. Do not edit.
// The shapes `held`, `part-way` and `title` all carry.
// Regenerate with `npm run contract:generate`.

/** The certificate a guarded door presents, as a client pins it. */
export interface Pinned {
  /** SHA-256 over the certificate's DER encoding, lower-case hex. */
  fingerprint: string;
}
