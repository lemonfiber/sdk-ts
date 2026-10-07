// Generated from the lemonfiber contract. Do not edit.
// The `bandwidth` envelope, and the shapes only `bandwidth` carries.
// Regenerate with `npm run contract:generate`.

import type { Pulling } from "../shared/bandwidth__pausing.js";

/** How one download client answered about the limits on it. */
export type Answer = AnswerHeld | AnswerSilent;

/** It answered, in both directions. */
export interface AnswerHeld {
  answered: "held";
  /** What became of the download limit. */
  down: BandwidthHeld;
  /**
   * Which side of the household's day it says it is on, where it keeps the
   * hours itself.
   */
  period?: Period | null;
  /** And of the upload one. */
  up: BandwidthHeld;
}

/**
 * It did not answer, and this is what it said.
 *
 * Its own line rather than an absence, because a client nobody could reach is
 * a client whose limits are unknown, and an unknown limit rendered as no
 * limit is the report reading better than the stack is.
 */
export interface AnswerSilent {
  answered: "silent";
  /** What went wrong, in the words of whatever refused. */
  said: string;
}

/** The envelope carrying `bandwidth`. */
export interface BandwidthEnvelope {
  api_version: number;
  data: Sharing;
  host?: string | null;
  job?: string | null;
  kind: "bandwidth";
}

/** One direction on one client: what it was asked for, took, and is doing. */
export interface BandwidthHeld {
  /** What it reports as in force. */
  accepted?: number | null;
  /** What it was asked to hold to, in bytes a second, where anything was. */
  asked?: number | null;
  /** What it is moving right now, where it reported a figure. */
  moving?: number | null;
  /** What that adds up to. */
  verdict: BandwidthVerdict;
}

/** One direction's limit, as declared and as it comes to. */
export interface BandwidthReading {
  /** The limit as it was expressed. */
  limit: Limit;
  /** What it comes to against the measured line. */
  resolved: Resolved;
  /**
   * The limit and the line it was measured against, in one sentence.
   *
   * Carried rather than left to each surface, so the rule that a share is never
   * shown without the figure it is a share of is kept in one place instead of
   * three.
   */
  says: string;
}

/** What became of one limit, in one direction, on one client. */
export type BandwidthVerdict = "unasked" | "nothing-to-limit" | "holding" | "ignored" | "overrunning";

/** A monthly allowance, and what to do at the end of it. */
export interface Cap {
  /** What happens when it is reached, chosen when the cap was declared. */
  exceeded: WhenExceeded;
  /** The allowance, in bytes. */
  monthly: number;
}

/** What the line was measured to carry. */
export interface Capacity {
  /** Bytes a second down. */
  down: number;
  /** Where the figure came from. */
  source: Source;
  /** When it was taken, in seconds since the epoch. */
  taken: number;
  /** Whether the path it was measured over goes through the VPN tunnel. */
  through_tunnel: boolean;
  /**
   * Bytes a second up.
   *
   * Measured apart from the download, because a home connection is asymmetric
   * and a single figure for both would make every upload share far larger than
   * the operator meant.
   */
  up: number;
}

/** One download client, and what became of the limits it was given. */
export interface Holding {
  /** What it said. */
  answer: Answer;
  /** The client, by the name the stack knows it under. */
  client: string;
  /**
   * Whether it is fetching at all, where a declared cap made that a question.
   *
   * Absent on a stack with no cap rather than assumed to be fetching: asking
   * every client whether it has stopped, on a stack where nothing would ever
   * stop it, is traffic spent on a figure nothing would act on.
   */
  pulling?: Pulling | null;
}

/** How much of the line something may take. */
export type Limit = LimitUnlimited | LimitShare | LimitAbsolute;

/** A figure in bytes a second, as it was given. */
export interface LimitAbsolute {
  as: "absolute";
  at: number;
}

/** A proportion of what the line was measured to carry, in whole per cent. */
export interface LimitShare {
  as: "share";
  at: number;
}

/** Nothing holds it back. */
export interface LimitUnlimited {
  as: "unlimited";
}

/** What the stack itself moved in a calendar month, and what that leaves out. */
export interface Metered {
  /** Bytes pulled down, as far as the clients count them. */
  down: number;
  /** What this count does not include, always said. */
  excludes: string;
  /** What is known to be missing from the count itself, where anything is. */
  incomplete: string[];
  /** The month, as the client that dated the figures dates them. */
  month: string;
  /** Bytes given back. */
  up: number;
}

/** Which side of the household's day a moment falls on. */
export type Period = "active" | "quiet";

/** Where a month stands against a declared cap. */
export type Reached = "within" | "warning" | "exceeded";

/** What a limit comes to once it is weighed against a measured line. */
export type Resolved = ResolvedUnlimited | ResolvedAt | ResolvedUnmeasured;

/** This many bytes a second. */
export interface ResolvedAt {
  bytes_per_second: number;
  is: "at";
}

/** Nothing holds it back. */
export interface ResolvedUnlimited {
  is: "unlimited";
}

/**
 * A proportion was asked for and nothing has measured the line.
 *
 * Deliberately not folded into [`Self::Unlimited`]. "Half of an unknown
 * number" resolving to "no limit at all" is the shape of a setting an
 * operator believes is in force while the stack takes the whole line.
 */
export interface ResolvedUnmeasured {
  is: "unmeasured";
}

/** Where a respite stands against the clock. */
export type RespiteStanding = RespiteStandingNone | RespiteStandingInForce | RespiteStandingExpired;

/** It ran out, this long ago. Said once, then cleared. */
export interface RespiteStandingExpired {
  seconds: number;
  standing: "expired";
}

/** In force, with this long left. */
export interface RespiteStandingInForce {
  seconds: number;
  standing: "in-force";
}

/** None was asked for. */
export interface RespiteStandingNone {
  standing: "none";
}

/** Where the line stands. */
export type Restraint = "unlimited" | "limited" | "scheduled-active" | "scheduled-quiet" | "overridden" | "cap-warning" | "cap-exceeded";

/** The hours the household is awake, declared once for every download client. */
export interface Rhythm {
  /** When the household's day starts. */
  from: string;
  /** When it ends, which may be the next morning. */
  to: string;
}

/** How the line is shared, and what that costs. */
export interface Sharing {
  /** What a spent cap is doing to the figures above, where one is spent. */
  acting?: string | null;
  /** Whether this run wrote the limits to the clients or only read them. */
  applied: boolean;
  /** The monthly cap, where one was declared. */
  cap?: Cap | null;
  /** What the line was measured to carry. */
  capacity?: Capacity | null;
  /** What is worth knowing about that reading before trusting it. */
  cautions: string[];
  /** What each download client was asked and what it is doing about it. */
  clients: Holding[];
  /** The download limit. */
  down: BandwidthReading;
  /** What that means for the household. */
  means: string;
  /** What the stack itself moved this month. */
  metered?: Metered | null;
  /** What throttling the upload costs, where an upload limit is in force. */
  ratio?: string | null;
  /** Where the month stands against it. */
  reached?: Reached | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** The override, where one is running or has just run out. */
  respite: RespiteStanding;
  /** What the override amounts to, in words. */
  respite_says?: string | null;
  /** Where the line stands. */
  restraint: Restraint;
  /** The household's hours, where any were declared. */
  rhythm?: Rhythm | null;
  /** What is outside every limit here. */
  untouched: string[];
  /** The upload limit, which is declared apart and defaults lower. */
  up: BandwidthReading;
  /** The zone the clients read those hours in, where the stack says. */
  zone?: string | null;
}

/** Where a figure for the line came from. */
export type Source = "declared" | "observed";

/** What to do when a declared cap is reached. */
export type WhenExceeded = "pause" | "throttle" | "continue";
