// Generated from the lemonfiber contract. Do not edit.
// The `walkthrough` envelope, and the shapes only `walkthrough` carries.
// Regenerate with `npm run contract:generate`.

import type { Line, WalkthroughStep } from "../shared/step__walkthrough.js";

/** Where a finished walkthrough leaves the operator. */
export interface Handover {
  /** What to do next, in order. */
  next: Next[];
}

/**
 * What the import did with the finished download — the difference between one copy of a
 * file and two.
 */
export type Link = "hardlinked" | "copied";

/** One thing to do next. */
export type Next = "more-content" | "household" | "client-apps";

/** Why a walkthrough could not go on. */
export type Reason = "no-indexers" | "indexers-failed" | "nothing-matched" | "none-met-the-preset" | "tunnel-down" | "not-grabbed" | "stalled" | "import-failed" | "no-media-server" | "not-visible";

/** Which walkthrough this stack is offered. */
export type Shape = "pipeline" | "library-only";

/** A walkthrough that stopped: where, why, what the services were saying, and what to do. */
export interface Stopped {
  /**
   * What the services involved were saying at the time, shown inline rather than left
   * for the operator to go and find — a fault report they have to research is a fault
   * report they abandon.
   */
  logs: string[];
  /** Why. */
  reason: Reason;
  /** The one thing to try. */
  remedy: string;
  /** The step it stopped at. */
  step: WalkthroughStep;
}

/** The envelope carrying `walkthrough`. */
export interface WalkthroughEnvelope {
  api_version: number;
  data: WalkthroughReport;
  host?: string | null;
  kind: "walkthrough";
}

/**
 * What a first-content walkthrough did — the whole of it, narrated line by line as it
 * happened and gathered here so the ending can be rendered, serialised and exited on.
 */
export interface WalkthroughReport {
  /** Whether what was asked for was already here, and so was not acquired again. */
  already_here: boolean;
  /** Where it leaves the operator, where it worked. */
  handover?: Handover | null;
  /** Whether the download was handed to the background rather than waited out. */
  in_background: boolean;
  /** What it walked, where it got as far as choosing something. */
  item?: string | null;
  /**
   * Every line it said, in order — the same lines the operator watched arrive, kept so
   * a machine-readable run is not a silent one.
   */
  lines: Line[];
  /** What the import did with the file, where it got that far. */
  link?: Link | null;
  /** What it set out to prove, said so the operator knows what they watched. */
  proves: string;
  /** Which walk this was. */
  shape: Shape;
  /** Where it ended up. */
  state: WalkthroughState;
  /** Where and why it stopped, where it did. */
  stopped?: Stopped | null;
  /**
   * What could have been walked instead, where nothing was chosen — the safe first
   * attempts, so an operator with an empty library is not left guessing.
   */
  suggestions: string[];
}

/** What has become of a walkthrough. */
export type WalkthroughState = "offered" | "skipped" | "searching" | "grabbing" | "downloading" | "importing" | "complete" | "failed" | "abandoned";
