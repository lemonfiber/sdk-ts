// Generated from the lemonfiber contract. Do not edit.
// The shapes `doctor` and `plugins` both carry.
// Regenerate with `npm run contract:generate`.

import type { ValueOrigin } from "./config__credentials__doctor__outbound__plugins__wiring__wizard.js";
import type { ProblemSeverity } from "./dashboard__doctor__error__plugins.js";
import type { Code, Problem, ProblemState } from "./doctor__error__plugins.js";
import type { Remedy } from "./doctor__error__plugins__repair.js";

/**
 * The family a check belongs to, so a run can be narrowed to one of them.
 *
 * These are the diagnostic categories the product recognises; the checks that
 * fill each one arrive over time, so a category may name more than lemonfiber
 * can yet establish.
 */
export type DoctorCategory = "environment" | "storage" | "network" | "vpn" | "credentials" | "services" | "providers" | "queue" | "config";

/**
 * How a single check turned out.
 *
 * "Could not check" (`Unverified`) is its own variant rather than a level of
 * severity, so a check that could not run can never be mistaken for one that
 * passed — the dishonesty this whole subsystem exists to prevent.
 */
export type DoctorVerdict = DoctorVerdictPass | DoctorVerdictWarn | DoctorVerdictFail | DoctorVerdictUnverified | DoctorVerdictSkipped;

/** Not working. */
export interface DoctorVerdictFail {
  /** The problem that produced this one, where several share a root. */
  cause?: Problem | null;
  /** The stable identifier for this kind of problem. */
  code: Code;
  /** The underlying technical detail, available but never leading. */
  detail?: string | null;
  /** What it means for the operator. */
  meaning: string;
  outcome: "fail";
  /** What to do, most likely first. */
  remedies: Remedy[];
  /** How much it matters. */
  severity: ProblemSeverity;
  /** Where it stands with respect to being fixed. */
  state: ProblemState;
  /** What happened, in one plain sentence. */
  summary: string;
}

/** Verified working, with the evidence worth showing. */
export interface DoctorVerdictPass {
  /** What was observed, where stating it helps — an address, a port. */
  note?: string | null;
  outcome: "pass";
}

/** A prerequisite was absent, so the check did not apply. */
export interface DoctorVerdictSkipped {
  outcome: "skipped";
  /** Why the check did not apply. */
  reason: string;
}

/** Could not be established. Never a pass. */
export interface DoctorVerdictUnverified {
  outcome: "unverified";
  /** Why it could not be determined. */
  reason: string;
  /** What the operator can do to get an answer. */
  remedy: Remedy;
}

/** Working, but degraded or risky. */
export interface DoctorVerdictWarn {
  /** The problem that produced this one, where several share a root. */
  cause?: Problem | null;
  /** The stable identifier for this kind of problem. */
  code: Code;
  /** The underlying technical detail, available but never leading. */
  detail?: string | null;
  /** What it means for the operator. */
  meaning: string;
  outcome: "warn";
  /** What to do, most likely first. */
  remedies: Remedy[];
  /** How much it matters. */
  severity: ProblemSeverity;
  /** Where it stands with respect to being fixed. */
  state: ProblemState;
  /** What happened, in one plain sentence. */
  summary: string;
}

/** One thing a check established, and how it turned out. */
export interface Finding {
  /** The family this belongs to. */
  category: DoctorCategory;
  /**
   * The check whose finding explains this one, where another does.
   *
   * Set after the run rather than by the check itself: a check is independent
   * by construction and cannot see what any other found, which is a property
   * worth keeping.
   */
  caused_by?: string | null;
  /** A stable identifier for the thing checked, such as `vpn.egress-match`. */
  check: string;
  /**
   * When the stack first saw this check wrong since it last saw it right, in whole
   * seconds since the epoch.
   *
   * Set after the run from the store of conditions, like [`Self::said`], so it is
   * the moment the health summary names for the same check and a restart does not
   * move it. Absent where the finding says nothing is wrong, and where the checks
   * ran for something other than a diagnosis.
   */
  onset?: string | null;
  /**
   * Whose check this is: one this build ships, or one a named plugin contributed.
   *
   * Carried rather than read off the identifier. A contributed check's id is
   * namespaced with the plugin's, and a reader could decode that from the colon —
   * but an origin a reader has to decode is one a reader gets wrong, and the day a
   * bundled id grew a colon every such reader would misattribute it in silence.
   */
  origin: ValueOrigin;
  /**
   * What the service said for itself, lately.
   *
   * Carried on the finding rather than left for the operator to go and fetch,
   * because the explanation is almost always in it: a check can say a service is
   * not answering, and only the service can say why. Absent where the finding is
   * not about a service, where the service is fine, or where the engine would not
   * say — an empty section would be a promise of evidence that is not there.
   *
   * Set after the run, like [`Self::caused_by`], since reading a service's output
   * is not the check's own business and a check that did it would be doing two
   * things.
   */
  said?: string | null;
  /**
   * The service this is about, where it is about one.
   *
   * Absent for the checks that are about the machine rather than about
   * something running on it — the environment, the filesystem, the operator's
   * own choices. Carried so that one service's trouble can be attributed to
   * the service underneath it rather than counted as one more independent
   * thing wrong.
   */
  service?: string | null;
  /**
   * What the stack calls that service in front of an operator.
   *
   * Carried beside the id rather than left for a surface to derive, because the id is
   * a key and not a name: capitalising `qbittorrent` does not arrive at qBittorrent,
   * and the stack has already written the name down. Absent where the finding is about
   * no service, and where the stack declares no service by that id — an id standing in
   * for a name would put the key back in front of the operator.
   *
   * Set after the run, like [`Self::caused_by`], from the same manifest that says
   * which service depends on which.
   */
  service_name?: string | null;
  /** The one-line summary of what was checked. */
  title: string;
  /** How it turned out. */
  verdict: DoctorVerdict;
}
