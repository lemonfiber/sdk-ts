// Generated from the lemonfiber contract. Do not edit.
// The `history` envelope, and the shapes only `history` carries.
// Regenerate with `npm run contract:generate`.

/** One change lemonfiber made, and whether it could be put back. */
export interface ChangeReport {
  /**
   * How many changes that one operation made, this one among them.
   *
   * An operation is the unit an operator agreed to, and undoing half of one leaves a
   * machine in a state nobody chose — so what a single line would take with it is on
   * the line rather than left to be counted off the list.
   */
  alongside: number;
  /**
   * When it was made, as whole seconds since the Unix epoch, written in decimal.
   *
   * A string of digits rather than a number, because it is the stamp the record keeps
   * and a stamp is compared and stored as text; what it counts is stated here so a
   * reader can turn it into a time without guessing at a format.
   *
   * **`0` means the clock was unreadable when the change was written**, not that it
   * was made at the epoch: it is how a machine whose clock would not answer stamps a
   * change. It is not an instant, so two changes both stamped `0` were not made at
   * the same moment, and a reader showing it as a date in 1970 would be inventing
   * one.
   */
  at: string;
  /** Why it could not go further, where it could not. */
  because?: string | null;
  /** What it did, in the operator's terms. */
  did: string;
  /** What to do instead, where there is something. */
  instead?: string | null;
  /**
   * The operation that made it — a seed, a reconfigure, an applied fix — so a
   * history reads as what happened rather than as bare diffs.
   */
  operation: string;
  /** How far it could be put back. */
  reversal: ChangeReversal;
  /** What it was made to. */
  target: string;
}

/**
 * How far a change can be put back.
 *
 * Published as the closed set it is, rather than as a word a reader has to trust will
 * be one of three: a surface that lays out a history branches on it, and a set the
 * contract names is one a generated reader can match exhaustively.
 */
export type ChangeReversal = "whole" | "partial" | "none";

/** The envelope carrying `history`. */
export interface HistoryEnvelope {
  api_version: number;
  data: HistoryReport;
  host?: string | null;
  job?: string | null;
  kind: "history";
}

/** Everything lemonfiber changed, most recent first. */
export interface HistoryReport {
  /** The changes, newest first. */
  changes: ChangeReport[];
  /**
   * How far back the record goes, in the operator's terms.
   *
   * Stated rather than left to be inferred from the oldest entry: a record that has
   * been trimmed and one that has always been short look identical from the entries
   * alone, and only one of them means something is missing.
   */
  horizon: string;
}
