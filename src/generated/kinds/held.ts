// Generated from the lemonfiber contract. Do not edit.
// The `held` envelope, and the shapes only `held` carries.
// Regenerate with `npm run contract:generate`.

import type { Medium } from "../shared/held__playing.js";

/**
 * One thing the household holds, as a member is shown it.
 *
 * What a person recognises and nothing else. There is no file path, no container,
 * no bitrate and no library id: a member deciding what to watch is not choosing a
 * transcode, and a surface handed those would have to decide not to draw them.
 */
export interface Held {
  /**
   * The identifier the server tells it apart by, which is what asking to play one
   * of them names.
   */
  id: string;
  /** Which of the kinds this product deals in it is. */
  medium: Medium;
  /** What it is called, in the words the server holds it under. */
  title: string;
  /**
   * The year it came out, where the server knows one. Absent rather than guessed:
   * two films share a title far more often than they share a title and a year.
   */
  year?: number | null;
}

/** The envelope carrying `held`. */
export interface HeldEnvelope {
  api_version: number;
  data: HeldReport;
  host?: string | null;
  job?: string | null;
  kind: "held";
}

/** What one member can watch, and who they are. */
export interface HeldReport {
  /**
   * Whether the shelf could be read at all.
   *
   * An empty shelf and an unread one are different answers, and collapsing them
   * would tell a household they own nothing on the day the media server rebooted.
   * Anything that could not be read is said in `findings` and this goes false.
   */
  available: boolean;
  /**
   * What is worth saying about this shelf, in the words its reader would use.
   *
   * Always written, empty or not. A field the schema requires and the document
   * sometimes omits is one a reader has to guess about, and an empty list already
   * says the thing it would say: there is nothing to report about this shelf.
   */
  findings: string[];
  /** What they hold, newest first. */
  holdings: Held[];
  /** The identifier the media server files them under. */
  id: string;
  /** The member this was asked for, by the name they are known by. */
  member: string;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}
