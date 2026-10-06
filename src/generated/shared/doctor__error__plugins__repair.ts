// Generated from the lemonfiber contract. Do not edit.
// The shapes `doctor`, `error`, `plugins` and `repair` all carry.
// Regenerate with `npm run contract:generate`.

/** One thing the operator can do about a problem. */
export interface Remedy {
  /** The action, phrased as something to do rather than something to know. */
  action: string;
  /** Where to look, when that helps. */
  detail?: string | null;
}
