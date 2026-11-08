// Generated from the lemonfiber contract. Do not edit.
// The shapes `substitution` and `wiring` both carry.
// Regenerate with `npm run contract:generate`.

import type { Apis } from "./plugins__substitution__wiring.js";

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
  /** The medium it asked a filler of, where nothing filling it files that medium. */
  files?: string | null;
  /** The media it asked a filler of, where nothing filling it files one of them. */
  media_types?: string[];
  /**
   * The upstream's own API it asked in, or every API it asked in any of, where no
   * upstream filling it declares one of them.
   */
  native?: Apis | null;
}
