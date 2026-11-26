// Generated from the lemonfiber contract. Do not edit.
// The shapes `askable`, `dashboard`, `household` and `invitation` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * What happens to what a household member asks for.
 *
 * Three, and they are the three the request service can actually be put into. A
 * household is in one of them because of two settings taken together — whether requests
 * arrive unseen, and whether a period limits how many — so the words here are a reading
 * of that pair rather than a fourth setting kept beside it.
 *
 * Choosing per person is not a fourth policy. It is one of these three chosen for one
 * member rather than for the house, which is why what a surface offers is a policy and,
 * separately, who it is for.
 */
export type Policy = "trusted" | "within-a-limit" | "everything-waits";
