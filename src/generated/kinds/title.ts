// Generated from the lemonfiber contract. Do not edit.
// The `title` envelope, and the shapes only `title` carries.
// Regenerate with `npm run contract:generate`.

import type { Medium } from "../shared/held__part-way__playing__title.js";
import type { Pinned } from "../shared/held__part-way__title.js";

/** One episode, with where it is served. */
export interface Episode {
  /** Where its backdrop is served, where it has one. */
  backdrop?: string | null;
  /** The certificate the door presents, which a client pins, beside any location. */
  door?: Pinned | null;
  /**
   * The identifier the server tells it apart by, which is what asking to play one
   * of them names.
   */
  id: string;
  /** Which of the kinds this product deals in it is. */
  medium: Medium;
  /** How long it runs, in whole minutes, where the server knows. */
  minutes?: number | null;
  /** Its number in the season, where it has one. */
  number?: number | null;
  /** What happens in it, where the server holds a description. */
  overview?: string | null;
  /** Where its poster is served, where it has one. */
  poster?: string | null;
  /** Where it streams from, where it plays. */
  stream_from?: string | null;
  /** What it is called, in the words the server holds it under. */
  title: string;
  /** Why no location is stated, where none is. */
  unlocated?: string | null;
  /**
   * The year it came out, where the server knows one. Absent rather than guessed:
   * two films share a title far more often than they share a title and a year.
   */
  year?: number | null;
}

/** One season of a series, with its episodes. */
export interface Season {
  /** Its episodes, in order, each with where it is served. */
  episodes: Episode[];
  /** What the server tells it apart by. */
  id: string;
  /** What it is called. */
  name: string;
  /** Its number in the series, where it has one. Specials often have none. */
  number?: number | null;
}

/**
 * What one title is, as a member's own account reads it.
 *
 * What a person deciding whether to watch it wants, and nothing about how it is
 * stored: no file, no container, no bitrate.
 */
export interface Title {
  /** Where its backdrop is served, where it has one. */
  backdrop?: string | null;
  /** The certificate it carries where the operator lives, where it carries one. */
  certificate?: string | null;
  /** The certificate the door presents, which a client pins, beside any location. */
  door?: Pinned | null;
  /** The genres the server files it under. */
  genres: string[];
  /**
   * The identifier the server tells it apart by, which is what asking to play one
   * of them names.
   */
  id: string;
  /** Which of the kinds this product deals in it is. */
  medium: Medium;
  /** How long it runs, in whole minutes, where the server knows. */
  minutes?: number | null;
  /** What it is about, where the server holds a description. */
  overview?: string | null;
  /** Where its poster is served, where it has one. */
  poster?: string | null;
  /** When it came out, as a calendar date, where the server knows. */
  released?: string | null;
  /** A series' seasons, each with its episodes, in order. Empty for anything else. */
  seasons: Season[];
  /** Where it streams from, where it plays. */
  stream_from?: string | null;
  /** What it is called, in the words the server holds it under. */
  title: string;
  /** Why no location is stated, where none is. */
  unlocated?: string | null;
  /**
   * The year it came out, where the server knows one. Absent rather than guessed:
   * two films share a title far more often than they share a title and a year.
   */
  year?: number | null;
}

/** The envelope carrying `title`. */
export interface TitleEnvelope {
  api_version: number;
  data: TitleReport;
  host?: string | null;
  job?: string | null;
  kind: "title";
}

/** One title, as the member it was asked for may see it. */
export interface TitleReport {
  /** The identifier the media server files them under. */
  id: string;
  /** The member this was asked for, by the name they are known by. */
  member: string;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
  /** The title, with where it and each of its episodes is served. */
  title?: Title | null;
}
