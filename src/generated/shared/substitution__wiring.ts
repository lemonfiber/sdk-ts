// Generated from the lemonfiber contract. Do not edit.
// The shapes `substitution` and `wiring` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * A capability something asks for and nothing fills, and what asked for it.
 *
 * The pair rather than the name: a capability nothing fills is a fact about the
 * stack, and a capability *`seerr` asks for* and nothing fills is a thing somebody
 * can act on. Reporting the first and leaving the second to be worked out is the
 * obscure failure at the point of use this exists instead of.
 */
export interface Unfilled {
  /** The service that asked. */
  by: string;
  /** What it asked for. */
  capability: string;
}
