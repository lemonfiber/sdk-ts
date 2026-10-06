// Generated from the lemonfiber contract. Do not edit.
// The shapes `music` and `quality` both carry.
// Regenerate with `npm run contract:generate`.

/** What a quality command did to the stored choice. */
export type Disposition = "shown" | "recorded" | "rehearsed" | "held" | "reapplied" | "would-reapply";

/**
 * One audio-format choice in force, for media that has no resolution — the same
 * question as a [`PresetChoice`], answered in format terms rather than resolution.
 */
export interface MusicChoice {
  /** The format's plain-language name. */
  format: string;
  /** What it means, in the operator's terms. */
  means: string;
  /** The practical caveat worth knowing — playing it, or finding it. */
  note: string;
  /** What this applies to — `music`. */
  scope: string;
  /** Roughly how much disk an hour of it takes. */
  size_per_hour: string;
  /** The audio format it targets, in plain terms. */
  targets: string;
}
