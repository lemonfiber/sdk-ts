// Generated from the lemonfiber contract. Do not edit.
// The `tuned` envelope, and the shapes only `tuned` carries.
// Regenerate with `npm run contract:generate`.

import type { Obstacle } from "../shared/obstacle.js";

/** The envelope carrying `tuned`. */
export interface TunedEnvelope {
  api_version: number;
  data: TunedReport;
  host?: string | null;
  job?: string | null;
  kind: "tuned";
}

/**
 * A channel's live stream opened for a member, where its bytes are served at the
 * guarded front door, each on a pass for that live stream and that member.
 */
export interface TunedReport {
  /** The channel, by the identifier the channels list gives it. */
  channel: string;
  /** Where the tuner's own stream is served, carrying its pass. */
  direct?: string | null;
  /**
   * SHA-256 over the certificate the door presents, lower-case hex, which a client
   * pins.
   */
  fingerprint?: string | null;
  /**
   * When the passes lapse, in whole seconds since the Unix epoch. A client asks for
   * new ones before then.
   */
  lapses?: number | null;
  /** The member it is opened for, by the name they are known by. */
  member: string;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
  /** The live stream a renewal or a stop names. */
  stream?: string | null;
  /** Where a transcoded playlist of it is served, carrying its pass. */
  transcoded?: string | null;
  /** Why nothing is located, where nothing is. */
  unlocated?: Obstacle | null;
}
