// Generated from the lemonfiber contract. Do not edit.
// Source: v0.0.0-fixture  ·  api_version 1
// Regenerate with `npm run contract:generate`.

export interface WordEnvelope {
  api_version: number;
  kind: string;
  data: string;
}

/** Every kind the server may send. */
export type Kind = "word";

/** The envelope carrying each kind, so a payload is typed by what it is. */
export interface ByKind {
  "word": WordEnvelope;
}

/** The wire version these types were generated for. */
export const CONTRACT_API_VERSION = 1;
