// Generated from the lemonfiber contract. Do not edit.
// The shapes `walkthrough` and `walkthrough-offer` both carry.
// Regenerate with `npm run contract:generate`.

/** Why a walkthrough could not go on. */
export type Reason = "no-indexers" | "indexers-failed" | "nothing-matched" | "none-met-the-preset" | "tunnel-down" | "not-grabbed" | "stalled" | "import-failed" | "no-media-server" | "not-visible";

/** Which walkthrough this stack is offered. */
export type Shape = "pipeline" | "library-only";
