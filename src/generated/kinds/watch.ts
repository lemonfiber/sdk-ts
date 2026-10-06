// Generated from the lemonfiber contract. Do not edit.
// The `watch` envelope, and the shapes only `watch` carries.
// Regenerate with `npm run contract:generate`.

/** What a watch saw, once the data root it was guarding was lost. */
export interface SupervisionReport {
  /** The forms that were being watched, and are now stopped. */
  forms: string[];
  /**
   * Why the watch ended: the data root vanished, or a different volume took
   * its place — or, on a run that only said what a watch would do, that nothing
   * was watched at all.
   */
  reason: string;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** Whether stopping the services succeeded. */
  stopped: boolean;
  /**
   * The watch this run would have kept, where it only said what it would do.
   *
   * A guard is the one command with no ending of its own, so a rehearsal of it
   * cannot be the command with its last step left out — it would hold until the
   * drive was pulled. What it answers with is this instead, and the fields above
   * then describe a watch that never began: nothing ended, and nothing was
   * stopped. Absent on every watch that actually ran.
   */
  would?: Vigil | null;
}

/** The watch a run would keep, and what it would do at the end of it. */
export interface Vigil {
  /**
   * The invocation it would run the moment that location went, word for word.
   *
   * Built by the same path a real watch stops the services through, rather than
   * described beside it: an argv reported from a second reckoning is one nobody
   * runs, and the one nobody runs is the one that stops being right.
   */
  command: string[];
  /** How often it would look, in seconds. */
  every: number;
  /** The data location it would hold. */
  root: string;
}

/** The envelope carrying `watch`. */
export interface WatchEnvelope {
  api_version: number;
  data: SupervisionReport;
  host?: string | null;
  kind: "watch";
}
