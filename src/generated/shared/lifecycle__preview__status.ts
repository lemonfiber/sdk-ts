// Generated from the lemonfiber contract. Do not edit.
// The shapes `lifecycle`, `preview` and `status` all carry.
// Regenerate with `npm run contract:generate`.

/** A service a closure asked for that the configuration leaves out, and why. */
export interface Filtered {
  /** The forms that asked for it, in the order the stack declares them. */
  forms: string[];
  /** The service's identifier. */
  id: string;
  /** What it is called in front of an operator. */
  name: string;
  /** The provider it cannot run without. */
  needs: StackProtocol;
  /** The profile it belongs to, which is what the configuration leaves out. */
  profile: string;
}

/**
 * A download provider a profile can depend on.
 *
 * Serialisable as well as readable, for the same reason [`Criticality`] is: it
 * reaches an operator. A profile left out of a closure is only half reported
 * without the provider it wanted.
 */
export type StackProtocol = "usenet" | "torrent";
