// Generated from the lemonfiber contract. Do not edit.
// The `repair` envelope, and the shapes only `repair` carries.
// Regenerate with `npm run contract:generate`.

import type { Remedy } from "../shared/doctor__error__plugins__repair.js";

/** A repair that has run out of chances, and where to go instead. */
export interface Beyond {
  /** The check whose fault has outlasted every attempt at it. */
  check: string;
  /** What to do about it now that lemonfiber has stopped offering to. */
  remedy: Remedy;
}

/** One repair, and what became of it. */
export interface Mended {
  /** How it turned out, once the check was asked again. */
  outcome: RepairOutcome;
  /** What was proposed. */
  repair: Repair;
}

/** One repair lemonfiber could carry out. */
export interface Repair {
  /** The check whose finding this answers, as the finding names it. */
  check: string;
  /** What it would do, in the words the operator will read before confirming. */
  does: string;
  /**
   * What else changes if it does.
   *
   * Stated before it is confirmed and never afterwards, because an effect an operator
   * learns about after the fact is not something they agreed to. Empty where a repair
   * touches nothing but the thing it names.
   */
  effects: string[];
  /**
   * Whether carrying it out is recorded well enough to be undone.
   *
   * A repair that cannot be reversed is still worth offering — restarting a container
   * is not undoable and is usually right — but the operator confirming one deserves to
   * know which kind they are agreeing to.
   */
  reversible: boolean;
}

/** The envelope carrying `repair`. */
export interface RepairEnvelope {
  api_version: number;
  data: RepairReport;
  host?: string | null;
  job?: string | null;
  kind: "repair";
}

/**
 * How a repair turned out, once the check that raised the finding has been asked again.
 *
 * Deliberately not a boolean. "It ran" and "it worked" are different claims, and a model
 * that cannot tell them apart will eventually report the first as the second.
 */
export type RepairOutcome = RepairOutcomeFixed | RepairOutcomeFixFailed | RepairOutcomeStopped | RepairOutcomeDeclined | RepairOutcomeWouldOverwrite | RepairOutcomeUnmanaged;

/** Not carried out, because the operator said no. */
export interface RepairOutcomeDeclined {
  outcome: "declined";
}

/** It ran, and the check still fails. */
export interface RepairOutcomeFixFailed {
  outcome: "fix_failed";
}

/** It ran, and the check now passes. */
export interface RepairOutcomeFixed {
  outcome: "fixed";
}

/**
 * It stopped partway, leaving this.
 *
 * Named precisely rather than as "failed": a half-applied change is a different
 * state to be in from an unchanged one, and the operator has to know which they are
 * looking at before they try anything else.
 */
export interface RepairOutcomeStopped {
  /** What the machine is now in, said plainly. */
  leaving: string;
  outcome: "stopped";
}

/**
 * Not carried out, because the operator declared the area it would write
 * unmanaged.
 *
 * Apart from [`Self::WouldOverwrite`], which is lemonfiber declining to write over
 * a change it can see. This is lemonfiber obeying an instruction it was given, and
 * telling somebody the first when they wrote the second would send them looking
 * for a change they did not make.
 */
export interface RepairOutcomeUnmanaged {
  outcome: "unmanaged";
}

/** Refused, because it would have written over something changed by hand. */
export interface RepairOutcomeWouldOverwrite {
  outcome: "would_overwrite";
}

/** What a repairing run offered, and what it did. */
export interface RepairReport {
  /** Whether this run was allowed to act at all. */
  acted: boolean;
  /**
   * What this offer is, so consent given for it can name which offer it read.
   *
   * Carried on every report rather than only on the ones that offer something: a
   * surface that has to look for it is a surface that can fail to find it, and an
   * offer of nothing is still an offer somebody may agree to nothing of.
   */
  agreement: string;
  /**
   * What has been tried too often to keep offering.
   *
   * Said rather than passed over. A repair that quietly stopped being offered leaves
   * the operator watching a fault nobody mentions any more, which is worse than being
   * told plainly that this is past what lemonfiber can work out.
   */
  beyond: Beyond[];
  /** What was carried out, in the order it was. */
  mended: Mended[];
  /** What could be put right, whether or not it was. */
  offered: Repair[];
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}
