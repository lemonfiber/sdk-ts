// Generated from the lemonfiber contract. Do not edit.
// The `upgrade` envelope, and the shapes only `upgrade` carries.
// Regenerate with `npm run contract:generate`.

import type { Triggered } from "../shared/music__upgrade.js";

/** The envelope carrying `upgrade`. */
export interface UpgradeEnvelope {
  api_version: number;
  data: UpgradeReport;
  host?: string | null;
  job?: string | null;
  kind: "upgrade";
}

/**
 * One media type an upgrade covers: its chosen quality, that quality's cost, and —
 * once confirmed — what became of asking its service to re-search.
 *
 * Reported per media type rather than as one figure, because each type carries its
 * own preset and so its own cost: film at maximum and television at space-saving are
 * upgraded to different bars, and a single number would misstate one of them.
 */
export interface UpgradeMedia {
  /** The media type — `tv` or `movies`. */
  media_type: string;
  /**
   * What became of the re-search, or `None` where the upgrade was not confirmed
   * and only the cost was stated.
   */
  outcome?: Triggered | null;
  /** The preset in force for it. */
  preset: string;
  /** Roughly what an hour of it costs at that preset. */
  size_per_hour: string;
}

/**
 * What upgrading existing content did, or — unconfirmed — would do.
 *
 * Upgrading re-acquires the existing library at the chosen quality, which is a
 * large, bandwidth-expensive operation, so it is a separate explicit action whose
 * cost is stated before it runs and which does nothing until confirmed. Each *arr
 * re-searches against its own current cutoff, so the report speaks per media type
 * rather than asserting one preset across the library.
 */
export interface UpgradeReport {
  /**
   * Whether the operator confirmed; without it nothing was triggered, only the
   * cost stated.
   */
  confirmed: boolean;
  /** Per media type: its preset, that preset's cost, and — confirmed — the outcome. */
  media: UpgradeMedia[];
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}
