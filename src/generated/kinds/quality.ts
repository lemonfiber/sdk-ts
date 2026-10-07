// Generated from the lemonfiber contract. Do not edit.
// The `quality` envelope, and the shapes only `quality` carries.
// Regenerate with `npm run contract:generate`.

import type { StackEdit } from "../shared/lifecycle__quality__reset__update.js";
import type { Disposition, MusicChoice } from "../shared/music__quality.js";

/**
 * One preset in force, and what it means for the media it applies to — the
 * operator's question answered in their own terms, with no scoring vocabulary.
 */
export interface PresetChoice {
  /** What it means, in the operator's terms rather than the tool's. */
  means: string;
  /**
   * Whether this host would have to transcode it in software — the caution
   * stated before a choice a household cannot smoothly play.
   */
  needs_transcoding_here: boolean;
  /** The preset's plain-language name. */
  preset: string;
  /** The resolution and encode it targets. */
  resolution: string;
  /** What this applies to: `everything`, or a specific media type. */
  scope: string;
  /** Roughly how much disk an hour of it takes. */
  size_per_hour: string;
  /** What playback costs, in plain terms. */
  transcoding: string;
}

/** The envelope carrying `quality`. */
export interface QualityEnvelope {
  api_version: number;
  data: QualityReport;
  host?: string | null;
  job?: string | null;
  kind: "quality";
}

/**
 * The operator's quality choice, what each preset means, and what the command
 * did with it.
 */
export interface QualityReport {
  /** The global choice first, then each media type set apart from it. */
  choices: PresetChoice[];
  /**
   * Whether the Recyclarr config has been hand-edited since lemonfiber wrote it —
   * the `customised` state, in which the preset is no longer authoritative until
   * it is deliberately re-asserted. For a reapply, whether an edit was overwritten.
   */
  customised: boolean;
  /** What became of the choice. */
  disposition: Disposition;
  /**
   * The audio-format choice for music, where one is set — media that has no
   * resolution, so it is reported apart from the resolution presets rather than
   * forced into their shape.
   */
  music?: MusicChoice | null;
  /**
   * The hand-edited config a reapply replaced — or, rehearsed, would replace — with
   * the diff of what goes against what lands in its place.
   *
   * Absent everywhere else, and absent for a reapply over a config already in
   * lemonfiber's own hand. Consent given against a yes-or-no is consent to
   * something the operator was never shown: they know a file they edited is about
   * to go, and not which of their lines is in it. The lines are masked the way
   * every stack-file diff is, so a key that drifted is named without its value.
   */
  overwritten?: StackEdit | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}
