// Generated from the lemonfiber contract. Do not edit.
// The `stop-seeding` envelope, and the shapes only `stop-seeding` carries.
// Regenerate with `npm run contract:generate`.

import type { Candidate } from "../shared/space__stop-seeding.js";

/** What became of a download the client was asked to let go. */
export interface Gone {
  /** What it occupied, as the client reported it. */
  bytes: number;
  /** What the client is no longer holding. */
  name: string;
  /** Whether this was a rehearsal, which asks the client for nothing. */
  rehearsed: boolean;
}

/** One completed download, what letting it go would cost, and what became of it. */
export interface Letting {
  /**
   * What this offer names itself, so an answer to it can say which offer it
   * answered.
   */
  agreement: string;
  /**
   * The download, in the same words the account names it in: where it stands, what
   * it occupies, and what removing it costs.
   */
  download: Candidate;
  /** What goes with it, carried rather than left for a surface to remember. */
  goes: string;
  /** What became of an answered offer, and nothing where the offer is all this is. */
  gone?: Gone | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}

/** The envelope carrying `stop-seeding`. */
export interface StopSeedingEnvelope {
  api_version: number;
  data: Letting;
  host?: string | null;
  kind: "stop-seeding";
}
