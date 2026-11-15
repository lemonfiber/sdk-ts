// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard`, `household` and `invitation` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * What is to happen to content the media server has no rating for.
 *
 * A choice rather than a default, because a great deal of content carries no rating
 * and either answer is wrong for somebody: holding it back makes legitimate content
 * invisible, and letting it through lets through the one thing nobody vetted.
 *
 * Spelled `HeldBack` and `LetThrough` rather than blocked and allowed, because
 * [`Allowed`] is the shape this sits on and a field called `unrated: Allowed` would
 * read as the opposite of what it is.
 *
 * A word rather than a flag on both the read and the write, so the setting is named
 * the same in the answer that reports it as in the call that made it — and so neither
 * [`Access`] nor the report built from it becomes a row of four unlabelled booleans.
 *
 * Letting it through is the default because it is the media server's: a new account
 * is made holding nothing back, so that is the state an account is found in rather
 * than a decision anybody took.
 */
export type Unrated = "held-back" | "let-through";
