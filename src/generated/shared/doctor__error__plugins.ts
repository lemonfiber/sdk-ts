// Generated from the lemonfiber contract. Do not edit.
// The shapes `doctor`, `error` and `plugins` all carry.
// Regenerate with `npm run contract:generate`.

import type { ProblemSeverity } from "./dashboard__doctor__error__plugins.js";
import type { Remedy } from "./doctor__error__plugins__repair.js";

/**
 * A stable identifier for a kind of problem.
 *
 * Stability is the whole point: an operator who searches for a code should find
 * the same answer a year later. Every code is declared in the error crate's `codes`
 * module, and a code is never recycled.
 */
export type Code = string;

/** Something that went wrong, in the form an operator can act on. */
export interface Problem {
  /** The problem that produced this one, where several share a root. */
  cause?: Problem | null;
  /** The stable identifier for this kind of problem. */
  code: Code;
  /** The underlying technical detail, available but never leading. */
  detail?: string | null;
  /** What it means for the operator. */
  meaning: string;
  /** What to do, most likely first. */
  remedies: Remedy[];
  /** How much it matters. */
  severity: ProblemSeverity;
  /** Where it stands with respect to being fixed. */
  state: ProblemState;
  /** What happened, in one plain sentence. */
  summary: string;
}

/** Where a problem stands with respect to being fixed. */
export type ProblemState = "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
