// Generated from the lemonfiber contract. Do not edit.
// The `stuck` envelope, and the shapes only `stuck` carries.
// Regenerate with `npm run contract:generate`.

import type { UnsupportedReport } from "../shared/import__migration__seed__status__stuck.js";
import type { Stage } from "../shared/stuck__trace.js";

/** One stuck item queue health found, named so it links straight to its own trace. */
export interface StuckEntry {
  /** The \*arr whose queue is holding it. */
  service: string;
  /** The stage its download is stuck at. */
  stage: Stage;
  /** The item's title — the term a `trace` searches by. */
  title: string;
}

/** The envelope carrying `stuck`. */
export interface StuckEnvelope {
  api_version: number;
  data: StuckReport;
  host?: string | null;
  kind: "stuck";
}

/**
 * The items whose downloads are stuck, across the \*arrs — the landing point for "N
 * items stuck" that queue health reports, each entry naming the item so the operator
 * goes straight to its per-item trace rather than to a count to investigate.
 */
export interface StuckReport {
  /**
   * Whether an \*arr's queue could not be read, so the list may be short — reported
   * rather than read as "nothing stuck", the same honesty a trace keeps.
   */
  incomplete: boolean;
  /** The stuck items, each linkable to its trace. */
  items: StuckEntry[];
  /**
   * Services whose queue lemonfiber cannot read at all, each with why.
   *
   * Apart from [`Self::incomplete`], which is a queue that was asked and would not
   * answer. This is a queue that was never asked, because the service declares an
   * API shape this build does not speak or a Servarr declaration it cannot reach
   * through — and a reading that dropped those would be as short as an unreadable
   * queue makes it, without the sentence that says so.
   */
  unsupported?: UnsupportedReport[];
}
