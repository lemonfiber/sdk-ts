// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard`, `doctor`, `error` and `plugins` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * How much a problem matters.
 *
 * Four levels, deliberately. More would not be applied consistently, and
 * inconsistent severity is worse than coarse severity.
 */
export type ProblemSeverity = "advisory" | "warning" | "error" | "critical";
