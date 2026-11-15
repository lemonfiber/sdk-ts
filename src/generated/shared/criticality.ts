// Generated from the lemonfiber contract. Do not edit.
// The shapes `catalogue`, `dashboard`, `lifecycle` and `status` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * How much a service's absence costs.
 *
 * Serialisable as well as readable, because it reaches an operator: a status
 * report that says a service is down without saying whether that matters
 * leaves them to guess, and the manifest already holds the answer.
 */
export type Criticality = "critical" | "core" | "important" | "enhancing" | "optional";
