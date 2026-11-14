// Generated from the lemonfiber contract. Do not edit.
// The `plugin-claims` envelope, and the shapes only `plugin-claims` carries.
// Regenerate with `npm run contract:generate`.

import type { Violation } from "../shared/plugin-claims__plugin-conformance__plugin-recording.js";
import type { PluginEvidence, PluginVerdict } from "../shared/plugin-claims__plugins.js";

/** One assertion that is not a probe, and what its recording came to. */
export interface Asserted {
  /** What a verdict is reported against. */
  id: string;
  /** Which of the two it is. */
  kind: Assertion;
  /** What it establishes, in one line. */
  says: string;
  /** The service it asks. */
  service: string;
  /** What the recording said about it. */
  verdict: PluginVerdict;
}

/**
 * Which kind of assertion a verdict is about.
 *
 * A probe is reported against the capability it demonstrates and is not here. These
 * two are, because neither belongs to a capability: one gates the install of this
 * plugin and the other is a row in a register that runs every day afterwards.
 */
export type Assertion = "proof" | "check";

/** Everything a plugin's source says, and what this build makes of it. */
export interface Claimed {
  /** What every verdict in this report was reached against. */
  against: PluginEvidence;
  /** What its services declare they can do. */
  capabilities: Claiming[];
  /**
   * The checks it contributes, against the recordings they name.
   *
   * Reported and never counted against the install. A contributed check reports on a
   * running stack rather than gating one, so a check that its own recording refuses
   * is a check doing its job on a machine in the state it was recorded in — which is
   * a different fact from a claim its recordings refute.
   */
  checks: Asserted[];
  /** What it adds to lemonfiber's own registers. */
  contributions: Contributed[];
  /** The extension points generation it was held to. */
  extension_points_version: number;
  /** The plugin's id. */
  id: string;
  /**
   * Whether this plugin would be installed as it stands.
   *
   * Carried rather than left for a reader to work out. It is one rule over two of
   * the fields above, and a consumer deciding it for itself would be a second copy
   * of that rule — free to disagree with the exit status this same answer produces.
   */
  installable: boolean;
  /** Its human-facing name. */
  name: string;
  /** What must hold before it is installed, against the recordings it ships. */
  proofs: Asserted[];
  /** Everything the two published vocabularies refuse, in one pass. */
  refusals: Violation[];
  /** The author's own version of it. */
  version: string;
  /**
   * The capability vocabulary generation it was held to.
   *
   * Carried for the reason every other read under this word carries one: an author
   * comparing what they were refused for with what they read needs to know whether
   * the difference is their manifest or this build.
   */
  vocabulary_version: number;
}

/** One capability a plugin's service declares, and what this build makes of it. */
export interface Claiming {
  /**
   * What asking for it would come to, or nothing where nothing can ask.
   *
   * A namespaced capability has no answer here rather than an empty one: nothing
   * consumes it, which is what *inert* means, and reporting it as unfilled would be
   * describing a gap where there is a design.
   */
  filling?: Filling | null;
  /** The capability's name. */
  name: string;
  /** Whether it is this plugin's own rather than one from the core vocabulary. */
  own: boolean;
  /** Every probe the claim binds, in the order the vocabulary declares them. */
  probes: ProbeRan[];
  /** The service declaring it. */
  service: string;
  /** How far the claim has been shown. */
  shown: Shown;
}

/** One row a plugin adds to a register lemonfiber already runs. */
export interface Contributed {
  /** The point it is made at. */
  at: string;
  /** The check a remedy is for, where this is one. */
  for?: string | null;
  /** The identity it holds, namespaced with the plugin's id. */
  id: string;
  /** What it says, in one line. */
  says: string;
}

/**
 * What asking for a capability comes to.
 *
 * Carried as one word and its subject rather than as three shapes, so a reader of the
 * machine-readable form branches on `answer` and finds the rest where the word says.
 */
export type Filling = FillingBy | FillingContested | FillingUnfilled;

/** Exactly one candidate claims it, and it is what a wiring reaches. */
export interface FillingBy {
  answer: "by";
  /** The service that fills it. */
  service: string;
}

/**
 * More than one does. Refused until the operator chooses, and every one of them
 * is named — resolving it by install order, precedence or recency is the thing
 * this answer exists instead of.
 */
export interface FillingContested {
  answer: "contested";
  /** Every candidate, named. */
  claimants: string[];
}

/**
 * Nothing installed claims it, or everything that does has been refuted or is
 * unproven.
 */
export interface FillingUnfilled {
  answer: "unfilled";
}

/** The envelope carrying `plugin-claims`. */
export interface PluginClaimsEnvelope {
  api_version: number;
  data: Claimed;
  host?: string | null;
  job?: string | null;
  kind: "plugin-claims";
}

/** One probe a claim binds, and what running it against its recording came to. */
export interface ProbeRan {
  /** The probe the vocabulary declares, by name. */
  probe: string;
  /** What the recording said about it. */
  verdict: PluginVerdict;
}

/**
 * How far a claim has been shown.
 *
 * The four the vocabulary's own states name. `Claimed` is not a weaker
 * `Demonstrated`: it is what a declaration is before anything has asked the service,
 * which is a fact about this moment rather than about the service.
 */
export type Shown = "claimed" | "demonstrated" | "unproven" | "refuted";
