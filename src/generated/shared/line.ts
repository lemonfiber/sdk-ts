// Generated from the lemonfiber contract. Do not edit.
// The shapes `step` and `walkthrough` both carry.
// Regenerate with `npm run contract:generate`.

/** One narrated line: a step, and what was specifically true of it. */
export interface Line {
  /**
   * What was specifically true — the evidence that makes the line worth reading
   * rather than a spinner. Empty where there is nothing particular to say.
   */
  detail: string;
  /** What it is doing, in plain language. */
  said: string;
  /** The step being narrated. */
  step: WalkthroughStep;
}

/** One step of the walk, ordered from picking something to watching it play. */
export type WalkthroughStep = "choosing" | "searching" | "grabbing" | "downloading" | "importing" | "scanning" | "available";
