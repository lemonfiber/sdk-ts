// Generated from the lemonfiber contract. Do not edit.
// The `stack` envelope, and the shapes only `stack` carries.
// Regenerate with `npm run contract:generate`.

/** How any action is run without a question being put. */
export interface NonInteractive {
  /** The words an action is run with, as the command line takes them. */
  form: string;
}

/** The envelope carrying `stack`. */
export interface StackEnvelope {
  api_version: number;
  data: StackReport;
  host?: string | null;
  job?: string | null;
  kind: "stack";
}

/**
 * A part of the stack that the plain Compose words alone do not bring up as lemonfiber
 * does, and why.
 */
export interface StackException {
  /** Why, in the operator's words. */
  because: string;
  /** The part, by its id. */
  part: string;
}

/** How this stack runs without lemonfiber. */
export interface StackReport {
  /** The `.env` file beside it. */
  env: string;
  /**
   * Every part the words alone do not bring up as lemonfiber does. Empty where there
   * is none.
   */
  exceptions: StackException[];
  /** How any action is run without a question being put. */
  non_interactive: NonInteractive;
  /**
   * The `docker compose` words that bring the stack up with no lemonfiber running, as
   * lemonfiber's own start would run them.
   */
  plain_up: string[];
  /** The directory the Compose project is written to. */
  project: string;
  /** Whether this machine runs the stack this build ships or the operator's own. */
  source: StackSource;
}

/** Which stack this machine runs. */
export type StackSource = "bundled" | StackSourceOwn;

/** The operator's own stack directory, by its path. */
export interface StackSourceOwn {
  own: string;
}
