// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard`, `held`, `household`, `part-way`, `play`, `playing`, `title` and `tuned` all carry.
// Regenerate with `npm run contract:generate`.

import type { Code } from "./code.js";

/**
 * Something in the way of one part of an answer, said by its code.
 *
 * What a read carries beside the part it could not give, rather than a sentence of its
 * own: a sentence carries no code, so nothing could word it again for whoever reads it.
 */
export interface Obstacle {
  /** The code that names what is in the way. */
  code: Code;
  /** What to do about it. */
  remedy: string;
  /** What is in the way, in one sentence. */
  said: string;
}
