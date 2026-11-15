// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard`, `doctor`, `error`, `held`, `household`, `part-way`, `play`, `playing`, `plugins`, `title` and `tuned` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * A stable identifier for a kind of problem.
 *
 * Stability is the whole point: an operator who searches for a code should find
 * the same answer a year later. Every code is declared in the error crate's `codes`
 * module, and a code is never recycled.
 */
export type Code = string;
