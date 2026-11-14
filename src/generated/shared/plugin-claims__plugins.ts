// Generated from the lemonfiber contract. Do not edit.
// The shapes `plugin-claims` and `plugins` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * A kind of constraint an expectation can put on a body.
 *
 * The same vocabulary a proof's expectation and a contributed check's use, so that
 * "a status alone is not evidence" is one rule rather than three. Read as well as
 * written: a declaration that an assertion fails on a recording names the one of these
 * that fails there.
 */
export type PluginConstraint = "status" | "json" | "json_has_keys" | "json_types" | "json_at_least" | "json_array_min" | "json_is_absent" | "content_type" | "body_starts_with" | "exit" | "stdout_starts_with";

/**
 * What the verdicts in a report were reached against.
 *
 * One value, because one is all this build can produce: nothing here asks a service
 * anything. It is a field rather than a sentence for the reason a verdict is one — a
 * reader handed `demonstrated` has nothing else in the document to tell a recording
 * that answered from a service that did, and the weaker of those two claims must not
 * be readable as the stronger. The prose says it on the page; this says it to
 * whatever consumes the report: an author's own CI, a catalogue, anything counting
 * passes. Naming the axis now is what made the second kind of evidence a change the
 * compiler walked somebody through rather than one they had to remember.
 */
export type PluginEvidence = "recordings" | "service";

/** One recording an assertion fails on as its manifest declares. */
export interface PluginFailingAsDeclared {
  /** The constraint of the expectation that fails there. */
  constraint: PluginConstraint;
  /** The recording. */
  fixture: string;
  /** What the recording held there. */
  held: string;
  /** Where within that constraint, for one that looks at places. */
  place?: string | null;
  /** Why the manifest says this recording is one the assertion fails on. */
  reason: string;
}

/** What one assertion came to, whatever answered it. */
export type PluginVerdict = PluginVerdictPassed | PluginVerdictFailed | PluginVerdictUnproven | PluginVerdictFailingAsDeclared | PluginVerdictOpen;

/** It does not, in every way it does not. */
export interface PluginVerdictFailed {
  /** Every way the recorded answer is not the declared one. */
  faults: string[];
  outcome: "failed";
}

/**
 * It fails on the recordings its manifest declares it fails on, on the constraint
 * each declaration names and on nothing else, and holds on every other recording it
 * was run against.
 *
 * Apart from passed and from failed, and counted as neither. The assertion does not
 * hold there, so a pass would say the opposite of what the recording shows; and the
 * failure is the one its author described and gave a reason for, so it does not
 * fail the run. Only ever reached against recordings: the live service is held to
 * the expectation as it is written.
 */
export interface PluginVerdictFailingAsDeclared {
  /** Each declared recording, what it held, and why it is one the assertion fails on. */
  declared: PluginFailingAsDeclared[];
  outcome: "failing-as-declared";
}

/**
 * The part an adapter claims is left open, because nobody entered the code its claim
 * takes: whoever reaches it first can claim it.
 *
 * Apart from passed and from failed, and counted as neither: the adapter holds to its
 * contract, and the part is not yet the household's. Only ever reached against the
 * live service, by an install's or a re-proof's claim.
 */
export interface PluginVerdictOpen {
  outcome: "open";
  /** The part, and the code its claim takes. */
  why: string;
}

/** The recording answers what the binding declares. */
export interface PluginVerdictPassed {
  outcome: "passed";
}

/** It could not be run, and so established nothing either way. */
export interface PluginVerdictUnproven {
  outcome: "unproven";
  /** What stopped it being run. */
  why: string;
}
