// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard` and `in-flight` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * Which protocol a transfer is moving over, since the same download reads
 * differently on each — a Usenet download has no peers, a torrent has no server.
 */
export type DashboardProtocol = "usenet" | "torrent";
