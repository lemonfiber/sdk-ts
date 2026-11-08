// Generated from the lemonfiber contract. Do not edit.
// The `queue` envelope, and the shapes only `queue` carries.
// Regenerate with `npm run contract:generate`.

/** One of the three acts a run takes on an item that struck out. */
export type Act = "remove" | "blocklist" | "search";

/** What became of one act. */
export type ActOutcome = "done" | "would" | "refused" | "fell-back";

/** One act as a run took it. */
export interface ActTaken {
  /** The act. */
  act: Act;
  /** What was done in its place, where something weaker was. */
  instead?: Act | null;
  /** What became of it. */
  outcome: ActOutcome;
  /** Why, where it was refused or fell back. */
  why?: string | null;
}

/** One run: a pass that could act. */
export interface HealRun {
  /** When, in seconds since the Unix epoch. */
  at: number;
  /** Every item it acted on, or would have. */
  items?: Healed[];
  /** Whether it was a rehearsal, which acted on nothing. */
  rehearsed: boolean;
}

/** One item a run acted on. */
export interface Healed {
  /** Each act, in the order they were taken. */
  acts: ActTaken[];
  /** The release, by its name in the client. */
  release: string;
  /** The curator it was queued with, or the client holding it where none was. */
  service: string;
  /** The title it was for, where a curator held it. */
  title?: string | null;
  /** Why it was acted on. */
  why: string;
}

/** Whether healing acts. */
export type HealingSwitch = "on" | "off";

/** The envelope carrying `queue`. */
export interface QueueEnvelope {
  api_version: number;
  data: QueueHealth;
  host?: string | null;
  job?: string | null;
  kind: "queue";
}

/**
 * Whether healing acts, the strikes and grace it acts after, every unhealthy item of the
 * latest pass, what could not be reached, and the newest runs.
 */
export interface QueueHealth {
  /**
   * When the latest pass classified the queue, in seconds since the Unix epoch, where
   * one ever has.
   */
  classified_at?: number | null;
  /** How long a newly added download is left alone, in seconds. */
  grace_s: number;
  /** Whether healing acts, or only classifies. */
  healing: HealingSwitch;
  /** Whether the list may be short, because something could not be read. */
  incomplete: boolean;
  /** Every unhealthy item the latest pass found; a healthy one is left out. */
  items?: Wedged[];
  /**
   * Where a download client files a curator's downloads outside the curator's folder,
   * which nothing is acted on past.
   */
  mismatch?: string | null;
  /** Whether this answer is a run that only said what it would do. */
  rehearsed: boolean;
  /** The newest runs first, each a pass that could act, rehearsed or not. */
  runs?: HealRun[];
  /** How many consecutive passes flag an item for one reason before it is acted on. */
  strikes_needed: number;
  /** Every curator or download client the latest pass could not reach or verify. */
  unreachable?: Unreached[];
}

/** A curator or download client a pass could not reach or verify. */
export interface Unreached {
  /** The service, by its id. */
  service: string;
  /** Why, in words. */
  why: string;
}

/** Why a download is unhealthy. */
export type Wedge = "stalled" | "slow" | "failed" | "stuck-on-metadata" | "orphaned";

/** One unhealthy item, as the latest pass found it. */
export interface Wedged {
  /** When it was added, in seconds since the Unix epoch, where anything says. */
  added_at?: number | null;
  /** Why it is unhealthy. */
  class: Wedge;
  /** Until when it is left alone as newly added, where it still is. */
  in_grace_until?: number | null;
  /** What the next run would do to it, where healing is on. */
  next?: Act[] | null;
  /** The release, by its name in the client. */
  release: string;
  /** The curator it is queued with, or the client holding it where none is. */
  service: string;
  /** How many consecutive passes have flagged it for this reason. */
  strikes: number;
  /** The title it is for, where a curator holds it. */
  title?: string | null;
  /** Why, in words. */
  why: string;
}
