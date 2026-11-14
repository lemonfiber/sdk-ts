// Generated from the lemonfiber contract. Do not edit.
// The `plugin-recording` envelope, and the shapes only `plugin-recording` carries.
// Regenerate with `npm run contract:generate`.

import type { Violation } from "../shared/plugin-claims__plugin-conformance__plugin-recording.js";

/** A service none of whose recordings was written, and why. */
export interface Failed {
  /** The last lines its container wrote, scrubbed and with nothing a terminal obeys. */
  log: string[];
  /** The service. */
  service: string;
  /** The step it failed at. */
  step: string;
  /** Why. */
  why: string;
}

/** The envelope carrying `plugin-recording`. */
export interface PluginRecordingEnvelope {
  api_version: number;
  data: Recorded;
  host?: string | null;
  job?: string | null;
  kind: "plugin-recording";
}

/** Every recording a plugin's manifest names, taken again. */
export interface Recorded {
  /** Each service whose recordings were not taken. */
  failed: Failed[];
  /**
   * Whether every recording was written or reproduced, each with a note, and each no
   * case asked removed.
   */
  holds: boolean;
  /** The plugin's id. */
  id: string;
  /** Each recording, in the order the manifest names them. */
  recordings: RecordingTaken[];
  /** Everything this build refuses about the manifest; nothing is taken where any is. */
  refusals: Violation[];
}

/** One recording a manifest names, and what taking it came to. */
export interface RecordingTaken {
  /** The recording it names. */
  fixture?: string | null;
  /** What names it: a proof, a claim's probe or a contributed check. */
  named: string;
  /** What taking it came to. */
  took: Took;
}

/** What taking one recording came to. */
export type Took = TookWritten | TookUnnoted | TookReproduced | TookUnreproduced | TookOverran | TookUnrecorded | TookRemoved | TookUnasked | TookLeft;

/**
 * The recording is of a case reaching a host outside the stack, which a run holding
 * recordings to what it takes again leaves as recorded rather than reaching.
 */
export interface TookLeft {
  /** The host the case reaches. */
  host: string;
  outcome: "left";
}

/** The run was still going at its limit, so there is nothing to record. */
export interface TookOverran {
  outcome: "overran";
  /** The limit, in seconds. */
  seconds: number;
}

/** The recording answers no case that was asked, so it was removed. */
export interface TookRemoved {
  outcome: "removed";
}

/** The recording already held what was taken, byte for byte. */
export interface TookReproduced {
  outcome: "reproduced";
}

/**
 * The recording answers no case that was asked, and is left as it was because the
 * run writes nothing.
 */
export interface TookUnasked {
  outcome: "unasked";
}

/** The recording was written with an empty note, which its author has to write. */
export interface TookUnnoted {
  outcome: "unnoted";
}

/** Nothing was taken, or there is nowhere to write what was. */
export interface TookUnrecorded {
  outcome: "unrecorded";
  /** Why. */
  why: string;
}

/**
 * The recording holds another result for the same image and arguments, so it is
 * refused and left as it was.
 */
export interface TookUnreproduced {
  outcome: "unreproduced";
  /** What differs. */
  why: string;
}

/** The recording was written. */
export interface TookWritten {
  outcome: "written";
}
