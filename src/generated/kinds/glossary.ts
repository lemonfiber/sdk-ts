// Generated from the lemonfiber contract. Do not edit.
// The `glossary` envelope, and the shapes only `glossary` carries.
// Regenerate with `npm run contract:generate`.

import type { Term } from "../shared/glossary__word.js";

/** The envelope carrying `glossary`. */
export interface GlossaryEnvelope {
  api_version: number;
  data: Vocabulary;
  host?: string | null;
  kind: "glossary";
}

/**
 * Every word this product explains, for somebody who asked what there is to ask
 * about.
 */
export interface Vocabulary {
  /** The words, in the order somebody meets them. */
  words: Term[];
}
