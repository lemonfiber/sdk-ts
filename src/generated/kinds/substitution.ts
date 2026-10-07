// Generated from the lemonfiber contract. Do not edit.
// The `substitution` envelope, and the shapes only `substitution` carries.
// Regenerate with `npm run contract:generate`.

import type { Unfilled } from "../shared/substitution__wiring.js";

/** One service standing in for another, worked out before anything is written. */
export interface Substitution {
  /** Every service that asks for it, so the reach of the change is visible. */
  asked_by: string[];
  /** The capability whose filler changes. */
  capability: string;
  /**
   * What this would leave with nothing filling it, each naming what asked.
   *
   * The one thing an operator cannot find out afterwards. A service filling two
   * capabilities is replaced for one of them, and the other stops being filled —
   * which is a working stack becoming a broken one, on a change that reads as
   * swapping like for like.
   */
  leaves_unfilled: Unfilled[];
  /** What would fill it. */
  now: string;
  /** The setting the change writes. */
  setting: string;
  /** What fills it now, where anything does. */
  was?: string | null;
  /**
   * What the operator said about the choice, where they said anything.
   *
   * Read back as the choice's own `why` wherever the choice is read, and absent
   * where nothing was said: nothing supplies a reason on the operator's behalf.
   */
  why?: string | null;
}

/** The envelope carrying `substitution`. */
export interface SubstitutionEnvelope {
  api_version: number;
  data: SubstitutionReport;
  host?: string | null;
  job?: string | null;
  kind: "substitution";
}

/** What substituting one service for another would come to. */
export interface SubstitutionReport {
  /**
   * What this reading names itself, so a choice answering it can say which reading
   * it answered.
   *
   * Named part by part — the choice itself, what fills the capability now, what asks
   * for it, and what the change would leave unfilled — so a choice refused because the
   * wiring moved is told which of those moved.
   */
  agreement: string;
  /**
   * Whether it was written, or only worked out.
   *
   * A run that only says what it would do writes nothing and reports the same
   * answer, so the two are told apart here rather than by the caller remembering
   * which flags it passed.
   */
  applied: boolean;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** The change itself, and what it would leave with nothing filling it. */
  substitution: Substitution;
}
