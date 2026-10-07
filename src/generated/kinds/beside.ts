// Generated from the lemonfiber contract. Do not edit.
// The `beside` envelope, and the shapes only `beside` carries.
// Regenerate with `npm run contract:generate`.

import type { Stance } from "../shared/adoption__beside__config__import__replacement.js";
import type { MovedReport } from "../shared/beside__migration.js";

/** The envelope carrying `beside`. */
export interface BesideEnvelope {
  api_version: number;
  data: BesideReport;
  host?: string | null;
  job?: string | null;
  kind: "beside";
}

/** What standing lemonfiber beside an existing setup came to, or would come to. */
export interface BesideReport {
  /** Where each service would listen instead, lowest original port first. */
  ports: MovedReport[];
  /** Why nothing was written, where nothing was. */
  refusal?: string | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** Where the act stands. */
  stance: Stance;
  /** Where the Compose file that says so was written. */
  written?: string | null;
}
