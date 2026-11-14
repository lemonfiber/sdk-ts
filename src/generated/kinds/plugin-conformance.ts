// Generated from the lemonfiber contract. Do not edit.
// The `plugin-conformance` envelope, and the shapes only `plugin-conformance` carries.
// Regenerate with `npm run contract:generate`.

import type { Violation } from "../shared/plugin-claims__plugin-conformance__plugin-recording.js";

/** What a plugin's recordings say about the contracts its adapters speak. */
export interface Conformed {
  /** Every case of every contract an adapter speaks, as its recording answered it. */
  cases: Judged[];
  /** Whether nothing is refused and every case passed. */
  conforms: boolean;
  /** The plugin's id. */
  id: string;
  /** Everything the manifest is refused for, which no recording can make up for. */
  refusals: Violation[];
}

/** One case, as its recording answered it. */
export interface Judged {
  /** The case. */
  case: string;
  /** The contract it is a case of, as `capability@major`. */
  contract: string;
  /** Where its recording is, beneath the plugin's source. */
  recording: string;
  /** What it came to. */
  verdict: Verdict;
}

/** The envelope carrying `plugin-conformance`. */
export interface PluginConformanceEnvelope {
  api_version: number;
  data: Conformed;
  host?: string | null;
  job?: string | null;
  kind: "plugin-conformance";
}

/** What one case's recording came to. */
export type Verdict = VerdictPassed | VerdictFailed | VerdictUnrecorded | VerdictUnproven;

/** It is not, in every way it is not. */
export interface VerdictFailed {
  /** Every way the recorded answer is outside the case. */
  faults: string[];
  outcome: "failed";
}

/** The recorded answer is one the contract declares for the case. */
export interface VerdictPassed {
  outcome: "passed";
}

/** A recording is there and could not be judged, so it established nothing. */
export interface VerdictUnproven {
  outcome: "unproven";
  /** What stopped it being judged. */
  why: string;
}

/** No recording of the case is there. */
export interface VerdictUnrecorded {
  outcome: "unrecorded";
}
