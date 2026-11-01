// Generated from the lemonfiber contract. Do not edit.
// The shapes `lifecycle`, `plugins`, `reset`, `settings`, `substitution` and `update` all carry.
// Regenerate with `npm run contract:generate`.

/** A move in place this run took, or tried to take and could not. */
export interface StackMoveTaken {
  /** The plugin the bundle installs. */
  plugin: string;
  /** The stack's own service it took, or would have taken, the place of. */
  service: string;
  /** Whether the plugin now runs in the service's place. */
  taken: boolean;
  /** Why it was not taken, where it was not. */
  why?: string | null;
}
