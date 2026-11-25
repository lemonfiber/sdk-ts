// Generated from the lemonfiber contract. Do not edit.
// The shapes `backup`, `copying` and `restore` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * One host tree captured from a setup lemonfiber does not manage.
 *
 * Both halves are needed to find it again: the archive path says where it sits
 * inside the archive, and the host path says where it was read from. Nothing
 * derives the second from the first, because a tree outside lemonfiber's layout
 * has no layout to derive it from.
 */
export interface Tree {
  /** Where it sits inside the archive. */
  archive_path: string;
  /** Where it was read from, on the machine whose setup was taken over. */
  host_path: string;
}
