// Generated from the lemonfiber contract. Do not edit.
// The shapes `lifecycle`, `quality`, `reset` and `update` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * A stack file the operator edited, preserved rather than overwritten, with the
 * change an upgrade would make shown against it.
 */
export interface StackEdit {
  /**
   * The lines that differ between the operator's file and what lemonfiber would
   * write — theirs marked `-`, lemonfiber's `+`, the matching head and tail left
   * out. Empty where the two differ only in ways `lines` does not see.
   */
  diff: string;
  /** The file's path within the stack directory. */
  path: string;
}
