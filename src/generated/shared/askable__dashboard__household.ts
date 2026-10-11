// Generated from the lemonfiber contract. Do not edit.
// The shapes `askable`, `dashboard` and `household` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * Where one member stands against what a period allows them.
 *
 * Four, and the one worth having is the middle: somebody told only when they have run
 * out has been told too late to do anything but wait, which is the answer this whole
 * feature exists to avoid handing anybody.
 */
export type AskingStanding = "unlimited" | "within-quota" | "near-quota" | "quota-exhausted";

/** One of the two counts the request service keeps, and what it has left. */
export interface Counted {
  /**
   * How many the period allows. Absent where nothing limits them, which is a
   * different answer from a limit of nought.
   */
  limit?: number | null;
  /**
   * How long the period is, in the words a household says it in — absent where
   * the count runs from the beginning rather than over a window.
   */
  period?: string | null;
  /** How many more they may ask for. Absent where nothing limits them. */
  remaining?: number | null;
  /** How many the period has already counted against them. */
  used: number;
}

/**
 * What one member may ask for, where the request service could be asked.
 *
 * Both counts, because the service keeps them apart and folding them would report a
 * household as within its limit while the half that matters is spent: television is
 * counted a season at a time, so one ask for a six-season series spends six.
 */
export interface MemberAsking {
  /** Films, counted one to a request. */
  films: Counted;
  /**
   * When the count next lets go of something, so one more becomes possible.
   *
   * Absent where nothing limits them, and where the request service's own dates
   * could not be read — an invented one would be a promise about a day on which
   * nothing happens. The period is a window that rolls rather than a month that
   * ends, so this is the moment their earliest counted request ages out.
   */
  frees_up?: string | null;
  /** What happens to what they ask for. */
  policy: Policy;
  /** Where they stand against what their period allows, taken over both counts. */
  standing: AskingStanding;
  /** Television, counted one to a season. */
  television: Counted;
}

/**
 * What happens to what a household member asks for.
 *
 * Three, and they are the three the request service can actually be put into. A
 * household is in one of them because of two settings taken together — whether requests
 * arrive unseen, and whether a period limits how many — so the words here are a reading
 * of that pair rather than a fourth setting kept beside it.
 *
 * Choosing per person is not a fourth policy. It is one of these three chosen for one
 * member rather than for the house, which is why what a surface offers is a policy and,
 * separately, who it is for.
 */
export type Policy = "trusted" | "within-a-limit" | "everything-waits";
