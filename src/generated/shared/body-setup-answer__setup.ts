// Generated from the lemonfiber contract. Do not edit.
// The shapes `/api/setup/answer` and `setup` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * Which download protocols the operator actually has accounts for.
 *
 * A form names both, because a form describes what it *does* rather than what
 * this operator has paid for. Narrowing happens afterwards, so a tunnel is
 * never started with credentials that were never supplied.
 */
export interface Protocols {
  /** A VPN and torrent client are configured. */
  torrent: boolean;
  /** A Usenet provider is configured. */
  usenet: boolean;
}
