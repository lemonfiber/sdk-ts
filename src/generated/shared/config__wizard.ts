// Generated from the lemonfiber contract. Do not edit.
// The shapes `config` and `wizard` both carry.
// Regenerate with `npm run contract:generate`.

import type { ValueOrigin } from "./config__credentials__doctor__outbound__plugins__wiring__wizard.js";

/** One setting, as it is safe to show. */
export interface SettingReport {
  /** The setting's name. */
  key: string;
  /**
   * Where the value came from, beside the value rather than behind a second
   * request — reading a setting and reading what put it there are one act.
   */
  origin: ValueOrigin;
  /** Whether the value was withheld. */
  secret: boolean;
  /** Its value, or a note that it is set and withheld. */
  value: string;
}

/**
 * What proving a credential against its live service established — never the
 * input, only the outcome.
 *
 * Read back as well as built. A surface that is not in this process asks setup to
 * prove a credential and is told what came of it, so the four outcomes are tagged
 * by name rather than distinguished by which field is present — the same reason an
 * answer carries the step it belongs to.
 */
export type Validation = ValidationValid | ValidationRejected | ValidationUnreachable | ValidationDegraded;

/**
 * It authenticated, but cannot do the job it is for — exhausted, limited, or
 * otherwise unable.
 */
export interface ValidationDegraded {
  /** What it can no longer do, and why where the service says. */
  detail: string;
  outcome: "degraded";
}

/** The service answered and refused: the credential is wrong for it. */
export interface ValidationRejected {
  /** What the service said, in terms the operator can act on. */
  detail: string;
  outcome: "rejected";
}

/** Nothing usable answered, so nothing can be concluded about the credential. */
export interface ValidationUnreachable {
  /** Why nothing usable came back. */
  detail: string;
  outcome: "unreachable";
}

/** Proven working, carrying the capability observed while proving it. */
export interface ValidationValid {
  /** The observed fact — what the service did, not that it merely answered. */
  observed: string;
  outcome: "valid";
}
