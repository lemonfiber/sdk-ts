// Generated from the lemonfiber contract. Do not edit.
// The `space` envelope, and the shapes only `space` carries.
// Regenerate with `npm run contract:generate`.

import type { Candidate } from "../shared/space__stop-seeding.js";

/** One line of the accounting. */
export interface Consumption {
  /** What it is about. */
  category: SpaceCategory;
  /** What getting it back would cost. */
  reclaim: Reclaim;
  /** What it occupies, counted both ways. */
  tally: Tally;
}

/** How much a reading can be relied on. */
export type Freshness = FreshnessLive | FreshnessAsOf;

/**
 * Read across a network share, which answers with what it was last told —
 * carrying the moment it was taken, in seconds since the epoch, so a figure
 * nobody can refresh is at least dated.
 */
export interface FreshnessAsOf {
  as: "as_of";
  at: number;
}

/** Read off a local disk, so it is true as of now. */
export interface FreshnessLive {
  as: "live";
}

/** An import that stopped part-way, in the words of whatever stopped it. */
export interface Interrupted {
  /** What the service calls it. */
  name: string;
  /** What is on disk for it already, where the walk could find it. */
  partial: number;
  /** What the service said, verbatim. */
  said: string;
}

/** Where a volume stands. */
export type Level = "unknown" | "ample" | "advisory" | "warning" | "critical" | "exhausted";

/** One file far larger than the rest. */
export interface Outsized {
  /** What it occupies. */
  bytes: number;
  /** Where it is. */
  path: string;
  /** How many times the middle file of this walk it is. */
  times_typical: number;
}

/** Where the disk stands, what is on it, and what could be got back. */
export interface Reckoning {
  /**
   * What this offer names itself, so an answer to it can say which offer it was
   * answering. The answer is this name, and nothing else is a yes to a cleanup.
   */
  agreement: string;
  /**
   * The completed downloads, each with where it stands and what removing it
   * would cost.
   */
  candidates: Candidate[];
  /**
   * Where the room went, one line per tree plus the services' own files, and
   * one line for what is committed but has not landed yet.
   */
  consumption: Consumption[];
  /** Whether new acquisitions are halted to keep the services writable. */
  halted: boolean;
  /** The imports that stopped part-way, with what is on disk for each. */
  interrupted: Interrupted[];
  /** Where the stack stands, which is where its worst volume stands. */
  level: Level;
  /** The files far enough out of line with the rest to be worth pointing at. */
  outsized: Outsized[];
  /**
   * What of that room could be got back, and what each would cost.
   *
   * A second reading of bytes already counted above rather than more of them: a
   * seeding torrent's file is in the tree it lives in *and* here. Summing the
   * two lists together would double what is on the disk, which is the mistake
   * this whole module is arranged to avoid.
   */
  reclaimable: Consumption[];
  /** What became of an answered cleanup, where the offer was answered. */
  reclaimed?: Reclaimed | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * The volumes watched. Either filling stops the stack, so both are reported
   * whether or not they are the same drive.
   */
  volumes: Volume[];
}

/** What getting a line's room back costs. */
export type Reclaim = "by_losing_content" | "in_progress" | "at_the_cost_of_ratio" | "the_easy_win" | "already_have_it" | "marginally" | "you_said_not";

/** What became of an answered cleanup. */
export interface Reclaimed {
  /** What they occupied. */
  bytes: number;
  /** The paths that were taken, or would have been in a rehearsal. */
  gone: string[];
  /** What could not be taken, and what the platform said about it. */
  left: SpaceLeft[];
  /**
   * Whether this was a rehearsal. Rehearsed, `gone` and `bytes` are what would have
   * been taken and nothing was: no room was freed.
   */
  rehearsed: boolean;
}

/** Which of the two volumes a reading is about. */
export type Role = "data" | "services";

/** What one line of the accounting is about. */
export type SpaceCategory = SpaceCategoryTree | SpaceCategoryLanding | SpaceCategorySeeding | SpaceCategoryOrphaned | SpaceCategoryExtracted | SpaceCategoryServices | SpaceCategoryUnmanaged;

/** Archives whose extracted contents sit beside them. */
export interface SpaceCategoryExtracted {
  of: "extracted";
}

/** What the download clients still have to write. */
export interface SpaceCategoryLanding {
  of: "landing";
}

/** Downloads on disk that no service ever took. */
export interface SpaceCategoryOrphaned {
  of: "orphaned";
}

/** Completed downloads the client is still seeding. */
export interface SpaceCategorySeeding {
  of: "seeding";
}

/** The services' own configuration and databases. */
export interface SpaceCategoryServices {
  of: "services";
}

/**
 * One directory beneath the data root, named as the operator named it.
 *
 * Per directory rather than one figure for the library, because several
 * libraries commonly share a volume and "the library is large" tells nobody
 * which of them is growing.
 */
export interface SpaceCategoryTree {
  name: string;
  of: "tree";
}

/** What the operator said to leave alone. */
export interface SpaceCategoryUnmanaged {
  of: "unmanaged";
}

/** The envelope carrying `space`. */
export interface SpaceEnvelope {
  api_version: number;
  data: Reckoning;
  host?: string | null;
  kind: "space";
}

/** Something a cleanup could not take. */
export interface SpaceLeft {
  /** Where it is. */
  at: string;
  /** What the platform said, verbatim. */
  why: string;
}

/** What a set of files occupies, counted both ways. */
export interface Tally {
  /** How many names were counted. */
  files: number;
  /** The bytes the names add up to — what this would take with nothing shared. */
  logical: number;
  /**
   * The bytes the underlying files add up to — what the volume has actually
   * lost to them.
   */
  physical: number;
  /** How many of those names pointed at a file already counted. */
  shared: number;
}

/** One volume, as one run measured it. */
export interface Volume {
  /** The path that was measured. */
  at: string;
  /** The bytes already committed to landing here. */
  committed: number;
  /** Bytes free, or nothing where the volume could not be read. */
  free?: number | null;
  /** Where it stands. */
  level: Level;
  /**
   * The effective limit — the mount's own size, which on a dataset given a
   * quota is the quota rather than the device beneath it.
   */
  limit?: number | null;
  /** Where the volume holding it is mounted, which is what the limit belongs to. */
  point: string;
  /** What would be free once the committed content has landed. */
  projected?: number | null;
  /** What the reading is worth. */
  reading: Freshness;
  /** Which of the two this is. */
  role: Role;
}
