// Generated from the lemonfiber contract. Do not edit.
// The `playing` envelope, and the shapes only `playing` carries.
// Regenerate with `npm run contract:generate`.

import type { Medium } from "../shared/held__playing.js";

/**
 * Somebody watching something now, as the media server lists the session.
 *
 * Who and what, and where: what a household recognises about somebody watching. No
 * stream, no bitrate and no transcode reason, because a member is not choosing one and
 * a surface handed those would have to decide not to draw them.
 */
export interface Playback {
  /** What the device it plays on calls itself. */
  device: string;
  /** The episode's number within its season, where the server numbers one. */
  episode?: number | null;
  /** Which of the kinds this product deals in it is. An episode is of a series. */
  medium: Medium;
  /** The name the account is known by. */
  member: string;
  /** The identifier the server files the account under. */
  member_id: string;
  /** Whether it is paused rather than playing. */
  paused: boolean;
  /** The season an episode is in, where the server numbers one. */
  season?: number | null;
  /** The series an episode belongs to, where it is one. */
  series?: string | null;
  /**
   * What is playing, in the words the server holds it under: an episode's own name
   * where it is an episode.
   */
  title: string;
}

/** The envelope carrying `playing`. */
export interface PlayingEnvelope {
  api_version: number;
  data: PlayingReport;
  host?: string | null;
  job?: string | null;
  kind: "playing";
}

/** What is playing now, and whose sessions were asked about. */
export interface PlayingReport {
  /**
   * Whether the media server could be asked at all.
   *
   * Nobody watching and a server that would not say are different answers, and
   * collapsing them would report a quiet house on the day the media server was down.
   * Anything that could not be read is said in `findings` and this goes false.
   */
  available: boolean;
  /**
   * What is worth saying about this reading, in the words its reader would use.
   *
   * Always written, empty or not, so a reader never has to guess what an absent
   * field means.
   */
  findings: string[];
  /**
   * The member this was narrowed to, by the name they are known by, or empty where
   * it is every session in the house.
   */
  member: string;
  /**
   * Every session playing something, in the order the media server lists them. How
   * many are playing is how many these are, rather than a count kept beside them.
   */
  sessions: Playback[];
}
