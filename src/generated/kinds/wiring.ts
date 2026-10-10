// Generated from the lemonfiber contract. Do not edit.
// The `wiring` envelope, and the shapes only `wiring` carries.
// Regenerate with `npm run contract:generate`.

import type { Wired } from "../shared/plugins__wiring.js";
import type { Unfilled } from "../shared/substitution__wiring.js";

/** The envelope carrying `wiring`. */
export interface WiringEnvelope {
  api_version: number;
  data: WiringReport;
  host?: string | null;
  job?: string | null;
  kind: "wiring";
}

/** What this stack wires to what. */
export interface WiringReport {
  /**
   * Every capability something asks for and nothing fills, naming what asked.
   *
   * Repeated out of the links above rather than left to be found among them: a
   * stack with one unfilled ask among twenty working ones is a stack whose one
   * problem is a line in a list, and a consumer that had to notice it would be
   * the reason nobody did.
   */
  unfilled: Unfilled[];
  /** Every link, in the order the stack declares them. */
  wired: Wired[];
}
