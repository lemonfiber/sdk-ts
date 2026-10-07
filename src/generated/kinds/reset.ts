// Generated from the lemonfiber contract. Do not edit.
// The `reset` envelope, and the shapes only `reset` carries.
// Regenerate with `npm run contract:generate`.

import type { StackEdit } from "../shared/lifecycle__quality__reset__update.js";

/** The envelope carrying `reset`. */
export interface ResetEnvelope {
  api_version: number;
  data: ResetReport;
  host?: string | null;
  job?: string | null;
  kind: "reset";
}

/**
 * What a full reset did, or — until it is confirmed — would do: the operator edits it
 * reverts back to lemonfiber's own state, and whether it was carried out or only shown.
 */
export interface ResetReport {
  /** Whether the reset was carried out, or only previewed pending confirmation. */
  confirmed: boolean;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * The operator's edits that were reverted — or, unconfirmed, that a reset would
   * revert — each with the diff of what is lost against what lemonfiber restores.
   */
  reverted: StackEdit[];
  /**
   * The service connections whose drifted value was reverted to lemonfiber's — or,
   * unconfirmed, would be — each named as it reads in a seed report.
   */
  reverted_connections: string[];
}
