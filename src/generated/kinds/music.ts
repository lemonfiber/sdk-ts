// Generated from the lemonfiber contract. Do not edit.
// The `music` envelope, and the shapes only `music` carries.
// Regenerate with `npm run contract:generate`.

import type { Disposition, MusicChoice } from "../shared/music__quality.js";
import type { Triggered } from "../shared/music__upgrade.js";

/** The envelope carrying `music`. */
export interface MusicEnvelope {
  api_version: number;
  data: MusicReport;
  host?: string | null;
  job?: string | null;
  kind: "music";
}

/**
 * What choosing an audio format for music did: the choice, whether it was recorded
 * or only rehearsed, and — once recorded — what became of applying it to the music
 * service.
 *
 * Music has no resolution and no community profile to lean on, so unlike a resolution
 * preset the choice is carried straight to the service through its API. The choice is
 * still recorded first, so it is remembered even when the service cannot be reached.
 */
export interface MusicReport {
  /** The format chosen, what it means, and what it costs. */
  choice: MusicChoice;
  /** Whether the choice was recorded, or only rehearsed. */
  disposition: Disposition;
  /**
   * What became of applying it to the music service, or `None` for a rehearsal
   * that applied nothing.
   */
  outcome?: Triggered | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}
