// Generated from the lemonfiber contract. Do not edit.
// The `part-way` envelope, and the shapes only `part-way` carries.
// Regenerate with `npm run contract:generate`.

import type { Medium } from "../shared/medium.js";
import type { Obstacle } from "../shared/obstacle.js";
import type { Pinned } from "../shared/pinned.js";

/** Something a member was part-way through, and how far. */
export interface PartWay {
  /** Where its backdrop is served, where it has one. */
  backdrop?: string | null;
  /** The certificate the door presents, which a client pins, beside any location. */
  door?: Pinned | null;
  /**
   * The identifier the server tells it apart by, which is what asking to play one
   * of them names.
   */
  id: string;
  /** How long it runs, in whole seconds, where the server knows. */
  length?: number | null;
  /** Which of the kinds this product deals in it is. */
  medium: Medium;
  /** How far in they got, in whole seconds. */
  position: number;
  /** Where its poster is served, where it has one. */
  poster?: string | null;
  /** Where it streams from, where it plays. */
  stream_from?: string | null;
  /** What it is called, in the words the server holds it under. */
  title: string;
  /** Why no location is stated, where none is, by the code that names it. */
  unlocated?: Obstacle | null;
  /**
   * The year it came out, where the server knows one. Absent rather than guessed:
   * two films share a title far more often than they share a title and a year.
   */
  year?: number | null;
}

/** The envelope carrying `part-way`. */
export interface PartWayEnvelope {
  api_version: number;
  data: PartWayReport;
  host?: string | null;
  job?: string | null;
  kind: "part-way";
}

/** What one member was part-way through, most recent first. */
export interface PartWayReport {
  /**
   * Whether it could be read at all. An empty list and an unread one are different
   * answers, and what could not be read is said in `findings`.
   */
  available: boolean;
  /** What stood in the way of this read, each by the code that names it. */
  findings: Obstacle[];
  /** The identifier the media server files them under. */
  id: string;
  /** The member this was asked for, by the name they are known by. */
  member: string;
  /** Each title or episode, how far in, and where it is served. */
  part_way: PartWay[];
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
}
