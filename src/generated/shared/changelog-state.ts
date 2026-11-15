// Generated from the lemonfiber contract. Do not edit.
// The shapes `update` and `version` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * Whether the record describes what this build could have shipped.
 *
 * The three the specification names, and the distinction between the last two is
 * the one worth keeping: being behind the tags is a lag, and contradicting them is
 * a fault.
 */
export type ChangelogState = "current" | "pending" | "stale";

/** One change, as a reader meets it. */
export interface Entry {
  /** Where it was reviewed, where it was reviewed anywhere. */
  reference?: string | null;
  /** The requirements it served, which are the link rather than the headline. */
  requirements: string[];
  /** What changed, in the words it was written in. */
  summary: string;
}

/** The entries of one kind, under the name an operator reads them by. */
export interface Group {
  /** The changes, in the order they were made. */
  entries: Entry[];
  /** What this group of changes is: new, fixed, faster, or maintenance. */
  title: string;
}

/** What a surface shows about the record, given the version asking. */
export interface Notes {
  /** Every release the record holds, newest first. */
  releases: ReleaseSummary[];
  /** What each requirement the running release cites is, and where it is defined. */
  requirements: { [key: string]: Requirement };
  /** What the running version changed, where the record holds its release. */
  running?: Release | null;
  /** Whether the record describes what this build could have shipped. */
  state: ChangelogState;
}

/** One release, and everything the record holds about it. */
export interface Release {
  /** The version whose goals this tag carried, where that is not its own. */
  carried?: string | null;
  /** What it set out to deliver, in the words the version was staged under. */
  delivers?: string | null;
  /** The changes, gathered by what kind of change each is. */
  groups: Group[];
  /** The version this one patched, where it is a patch. */
  patches?: string | null;
  /** The day it was published, where the record of it says. */
  released_on?: string | null;
  /** The tag it was cut from. */
  tag: string;
  /** Whether anything in it is a change an operator would notice. */
  user_facing: boolean;
  /** The version, without the tag's leading letter. */
  version: string;
  /** Why it was withdrawn, where it was. */
  withdrawn?: string | null;
}

/**
 * One release as a listing shows it: everything but what it changed.
 *
 * Kept apart from [`Release`] rather than being it with the entries left out,
 * because the two are read for different things. A listing answers which releases
 * there have been and which of them was taken back; only the one being read needs
 * to carry every line of what it changed.
 */
export interface ReleaseSummary {
  /** What it set out to deliver. */
  delivers?: string | null;
  /** The version this one patched, where it is a patch. */
  patches?: string | null;
  /** The day it was published, where the record of it says. */
  released_on?: string | null;
  /** Whether anything in it is a change an operator would notice. */
  user_facing: boolean;
  /** The version. */
  version: string;
  /** Why it was withdrawn, where it was. */
  withdrawn?: string | null;
}

/** One requirement, and every release that shipped something citing it. */
export interface Requirement {
  /** The feature it belongs to, in words. */
  feature: string;
  /** Every version that shipped something citing it, newest first. */
  shipped_in: string[];
  /** Where it is defined, unless it has since been withdrawn. */
  url?: string | null;
  /** Whether it was withdrawn after it shipped. */
  withdrawn?: boolean;
}
