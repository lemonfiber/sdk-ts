// Generated from the lemonfiber contract. Do not edit.
// The shapes `plugin-claims`, `plugin-conformance` and `plugin-recording` all carry.
// Regenerate with `npm run contract:generate`.

/** One thing a manifest got wrong, and where. */
export interface Violation {
  /** Which declaration it is about, in the manifest's own terms. */
  location: string;
  /** What is wrong with it. */
  message: string;
}
