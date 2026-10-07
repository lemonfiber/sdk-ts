// Generated from the lemonfiber contract. Do not edit.
// The `update` envelope, and the shapes only `update` carries.
// Regenerate with `npm run contract:generate`.

import type { StackEdit } from "../shared/lifecycle__quality__reset__update.js";
import type { Notes } from "../shared/update__version.js";

/** How one service's update ended. */
export type Ending = "updated" | "not-fetched" | "not-started" | "not-reached";

/**
 * How large a step from one version to another is.
 *
 * Named after the part of the version that moved rather than after a size, because
 * that is the fact an operator weighs: a first-number change is where a project puts
 * the work that breaks configurations, and the two behind it are where it puts the
 * work that does not.
 */
export type Jump = "major" | "minor" | "patch" | "untellable";

/** What updating the stack would change, or what a run of it came to. */
export interface StackUpdateReport {
  /** What became of each service the run reached, in the order it reached them. */
  applied: UpdateApplied[];
  /** Where the backup taken before anything moved was written. */
  backup?: string | null;
  /**
   * What the release that brought these pins changed.
   *
   * The stack this would move to is the one this build carries, and the release
   * that carried this build is what says why it moved. An operator weighing a
   * stack update is weighing that, and being shown only which image numbers go up
   * is being shown the arithmetic rather than the reason.
   */
  changelog: Notes;
  /** What would move, and what taking each step means. */
  changes: UpdateChange[];
  /** Whether the steps were agreed to, or only shown. */
  confirmed: boolean;
  /**
   * Why the stack is not as the run found it, where it is not.
   *
   * Two runs end that way and an operator has the same thing to do about either:
   * one that met a service which would not come back and stopped there, and one
   * where every step succeeded and the stack would not start again afterwards.
   * The second is not a failure of the update — `state` still says `Updated`,
   * because it is — but the stack came down for the capture and something has to
   * say that it is still down.
   */
  halted?: string | null;
  /**
   * What the download clients are still working on, named so an operator can
   * tell whether the thing they have been waiting for is among them.
   */
  in_flight: string[];
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * Stack files the operator had edited, left as they set them rather than
   * overwritten with this build's own, each with the change that was held back.
   */
  stack_edits: StackEdit[];
  /** The one word the run comes to. */
  state: UpdateState;
}

/** What one service's update came to. */
export interface UpdateApplied {
  /** What went wrong, where anything did. */
  detail?: string | null;
  /** How it ended. */
  ending: Ending;
  /** The version it was standing on before the run. */
  from: string;
  /** How it could be put back, given how it ended. */
  reversal: UpdateReversal;
  /** The service it is about. */
  service: string;
  /** The version the run was moving it to. */
  to: string;
}

/** What updating one service would change. */
export interface UpdateChange {
  /** What the step means, in the words an operator decides on. */
  because: string;
  /** The version it is standing on now. */
  current: string;
  /** Whether taking it is a step nothing walks back. */
  irreversible: boolean;
  /** How large the step between them is. */
  jump: Jump;
  /** Whether lemonfiber refuses to take it at all. */
  refused: boolean;
  /** The service, by its manifest id, which is also its Compose service name. */
  service: string;
  /** The version this build pins for it. */
  target: string;
}

/** The envelope carrying `update`. */
export interface UpdateEnvelope {
  api_version: number;
  data: StackUpdateReport;
  host?: string | null;
  job?: string | null;
  kind: "update";
}

/**
 * How a service could be put back the way it was.
 *
 * The distinction is the whole of why this is reported rather than left to be
 * worked out: pinning the previous image again is a minute's work, and restoring a
 * backup is an evening. Offering the first where only the second can succeed is
 * worse than offering nothing, because it is acted on.
 */
export type UpdateReversal = "rollback" | "restore";

/**
 * Where the stack stands against the versions this build pins.
 *
 * Exactly one of these is true of a run at a time. A surface that had to say
 * "updates available, and also partly applied" would be reporting the question
 * rather than the answer.
 */
export type UpdateState = "current" | "updates-available" | "updated" | "partial" | "failed";
