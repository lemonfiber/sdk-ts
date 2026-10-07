// Generated from the lemonfiber contract. Do not edit.
// The `backup` envelope, and the shapes only `backup` carries.
// Regenerate with `npm run contract:generate`.

import type { Scope } from "../shared/backup__restore.js";

/** The envelope carrying `backup`. */
export interface BackupEnvelope {
  api_version: number;
  data: BackupReport;
  host?: string | null;
  job?: string | null;
  kind: "backup";
}

/** What a capture produced. */
export interface BackupReport {
  /**
   * What the capture moved, against what a capture is meant to stay inside.
   *
   * Read off the room check that already ran, so saying it costs nothing: the trees
   * were walked to decide whether the archive would fit, and this is the same number
   * put to a second use.
   */
  pace: Pace;
  /**
   * Where the archive was written, or — on a run that only said what it would
   * capture — where it would have gone.
   */
  path: string;
  /** The older backups retention pruned, oldest first — or would prune. */
  pruned: string[];
  /**
   * Whether this run only said what it would capture.
   *
   * A flag rather than a second shape, because every other field means the same
   * thing either way: a capture is settled before it is written — the room is
   * measured, the manifest described, the name and the path derived, and retention
   * worked out — so what a rehearsal reports is what a real run would report, with
   * the one write left out. What changes is the tense a surface says it in.
   */
  rehearsed: boolean;
  /** What the backup covers. */
  scope: Scope;
  /** Whether it carries credentials, and so must be handled as sensitive. */
  sensitive: boolean;
}

/**
 * What a capture came to, against the time a capture is meant to take.
 *
 * Reported and never enforced. The room check already walks the trees to decide
 * whether the archive fits, so the bytes are in hand before anything is written and
 * cost nothing extra to say — and what they are measured against is the work, not a
 * clock. A wall-clock gate on a machine whose disk throughput varies by more than the
 * margin either passes for reasons unrelated to this product or fails for them, and
 * neither reading is worth having.
 */
export interface Pace {
  /** Whether this capture is inside it. */
  brisk: boolean;
  /**
   * The bytes a capture may move and still be expected to finish in time.
   *
   * Carried with the reading rather than left for a reader to look up, so a surface
   * showing this does not need a second copy of the number to compare against.
   */
  budget: number;
  /** The bytes the captured trees came to, as the room check measured them. */
  moved: number;
}
