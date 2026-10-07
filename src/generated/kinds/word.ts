// Generated from the lemonfiber contract. Do not edit.
// The `word` envelope, and the shapes only `word` carries.
// Regenerate with `npm run contract:generate`.

import type { Term } from "../shared/glossary__word.js";

/** The envelope carrying `word`. */
export interface WordEnvelope {
  api_version: number;
  data: Term;
  host?: string | null;
  job?: string | null;
  kind: "word";
}
