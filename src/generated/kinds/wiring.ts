// Generated from the lemonfiber contract. Do not edit.
// The `wiring` envelope, and the shapes only `wiring` carries.
// Regenerate with `npm run contract:generate`.

import type { ValueOrigin } from "../shared/config__credentials__doctor__outbound__plugins__wiring__wizard.js";
import type { Unfilled } from "../shared/substitution__wiring.js";

/** What one link reaches, and how that was settled. */
export type Reaches = ReachesAsked | ReachesByName;

/** An ask for a capability. */
export interface ReachesAsked {
  /** The capability asked for. */
  capability: string;
  how: "asked";
  /**
   * Where each service that claims it came from: this build's stack, or a
   * named plugin.
   *
   * Every claimant rather than only what the ask reaches, because a contest
   * reaches nothing and is exactly where an operator most needs to know which of
   * the names in front of them is not the stack's.
   */
  origins: { [key: string]: ValueOrigin };
  /** What the ask reaches — empty where nothing fills it or a contest stands. */
  services: string[];
  /** How it was settled. */
  settled: WiringSettled;
}

/** A link deliberately kept to a named service, shown as the exception it is. */
export interface ReachesByName {
  how: "by-name";
  /** The service named. */
  service: string;
  /** Why it is by name. */
  why: string;
}

/** Who settled a contest between claimants. */
export type Whose = "stack" | "operator";

/** One of the stack's links, answered. */
export interface Wired {
  /** The service the link runs from — what asked. */
  by: string;
  /** What it reaches. */
  reaches: Reaches;
}

/** The envelope carrying `wiring`. */
export interface WiringEnvelope {
  api_version: number;
  data: WiringReport;
  host?: string | null;
  job?: string | null;
  kind: "wiring";
}

/** What this stack wires to what. */
export interface WiringReport {
  /**
   * Every capability something asks for and nothing fills, naming what asked.
   *
   * Repeated out of the links above rather than left to be found among them: a
   * stack with one unfilled ask among twenty working ones is a stack whose one
   * problem is a line in a list, and a consumer that had to notice it would be
   * the reason nobody did.
   */
  unfilled: Unfilled[];
  /** Every link, in the order the stack declares them. */
  wired: Wired[];
}

/** How an ask was settled. */
export type WiringSettled = WiringSettledOutright | WiringSettledEach | WiringSettledContested | WiringSettledChosen | WiringSettledUnfilled;

/** Several claimants, and a choice is recorded. */
export interface WiringSettledChosen {
  /** The ones not chosen, so the choice reads as a choice. */
  over: string[];
  settled: "chosen";
  /** Who chose. */
  whose: Whose;
  /** Why, where the chooser said. */
  why?: string | null;
}

/**
 * Several claimants and the link asked for one. Refused until somebody chooses:
 * install order, precedence and recency are each a way of being right most of
 * the time, and the times they are wrong are somebody's stack answering to the
 * wrong software.
 */
export interface WiringSettledContested {
  /** Every candidate, named, so a choice is made from a list. */
  claimants: string[];
  settled: "contested";
}

/** Every claimant, because the link asked for all of them rather than one. */
export interface WiringSettledEach {
  settled: "each";
}

/** One claimant, and nothing to settle. */
export interface WiringSettledOutright {
  settled: "outright";
}

/** Nothing claims it. What asked is named beside this, which is the point. */
export interface WiringSettledUnfilled {
  settled: "unfilled";
}
