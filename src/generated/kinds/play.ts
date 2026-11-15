// Generated from the lemonfiber contract. Do not edit.
// The `play` envelope, and the shapes only `play` carries.
// Regenerate with `npm run contract:generate`.

import type { Obstacle } from "../shared/obstacle.js";

/** The envelope carrying `play`. */
export interface PlayEnvelope {
  api_version: number;
  data: PlayReport;
  host?: string | null;
  job?: string | null;
  kind: "play";
}

/**
 * Where one title plays from in a member's browser, at the stack's front door, on a
 * pass sealing a session on their own account.
 */
export interface PlayReport {
  /** The title or episode, by the identifier the shelf lists it under. */
  id: string;
  /**
   * When the pass lapses, in whole seconds since the Unix epoch. A browser hands it
   * back for a new one before then.
   */
  lapses?: number | null;
  /** The member it plays as, by the name they are known by. */
  member: string;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
  /** The playlist it plays from at the front door, carrying its pass. */
  stream_from?: string | null;
  /** Why nothing is located, where nothing is. */
  unlocated?: Obstacle | null;
}
