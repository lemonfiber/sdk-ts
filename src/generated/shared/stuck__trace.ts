// Generated from the lemonfiber contract. Do not edit.
// The shapes `stuck` and `trace` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * A stage in an item's journey, ordered from "nobody asked for it" to "playable". The
 * declaration order is the pipeline order, so one stage compares less than a later one.
 */
export type Stage = "not-monitored" | "monitored" | "searching" | "found" | "grabbed" | "downloading" | "downloaded" | "importing" | "imported" | "available";
