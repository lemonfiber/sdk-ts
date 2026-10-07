// Generated from the lemonfiber contract. Do not edit.
// The `uninstall` envelope, and the shapes only `uninstall` carries.
// Regenerate with `npm run contract:generate`.

/** One download still coming down when the removal was asked for. */
export interface Coming {
  /** What it is, as the client names it. */
  name: string;
  /** How far along, from zero to a hundred. */
  progress: number;
}

/** Something beneath the data location that the stack did not put there. */
export interface Foreign {
  /**
   * The directory it is in, relative to the data location — or the file itself,
   * where it sits directly in the data location.
   */
  at: string;
  /** What they occupy. */
  bytes: number;
  /** How many files were found under it. */
  files: number;
}

/** One thing a removal reaches, said to be going or said to be kept. */
export interface Item {
  /**
   * What it occupies, where that is knowable. Absent for a container or a network,
   * whose room is the image's rather than their own.
   */
  bytes?: number | null;
  /**
   * Why it is being kept rather than removed, where it is being kept.
   *
   * `None` is the ordinary case: this line is going. A reason here is the whole of
   * how an image shared with another project, or a path this run could not
   * confirm, stays on the list without being taken.
   */
  kept?: string | null;
  /** What it is called — a container name, an image reference, or a full path. */
  name: string;
  /** Whether it holds a credential, so a report can say what destroying it destroys. */
  secret: boolean;
  /** Which of the four sorts of thing it is. */
  sort: Sort;
  /** What it is, in the operator's words. */
  what: string;
}

/** Something an uninstall leaves behind, and how to remove it by hand. */
export interface Outside {
  /** How to remove it on this platform, as the operator would type or do it. */
  by_hand: string;
  /**
   * Whether this machine was found to have it.
   *
   * A survey that could not look says nothing was found rather than that nothing
   * is there, which is why the entry is listed either way and this field carries
   * the difference.
   */
  found: boolean;
  /** What it is. */
  what: string;
  /** Why it is not lemonfiber's to take away. */
  why: string;
}

/** What sort of thing one line of a manifest is. */
export type Sort = "container" | "network" | "image" | "path";

/** Which of the four removals was asked for. */
export type Tier = "stop" | "services" | "configuration" | "media";

/** A removal, before or after it happened. */
export interface Uninstall {
  /** What removing would come to, or what it came to. */
  manifest: UninstallManifest;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** Whether anything was removed on this run. */
  removal: UninstallRemoval;
}

/** How much of a manifest was read and how much stood in for what could not be. */
export interface UninstallConfidence {
  /** Whether every source this tier needed answered. */
  complete: boolean;
  /**
   * What could not be read, each in the words of whatever refused.
   *
   * The point of the field: a manifest that is short says so and says why, rather
   * than reading as a machine with less on it than it has.
   */
  unread: string[];
}

/** The envelope carrying `uninstall`. */
export interface UninstallEnvelope {
  api_version: number;
  data: Uninstall;
  host?: string | null;
  job?: string | null;
  kind: "uninstall";
}

/** Something a removal could not take. */
export interface UninstallLeft {
  /** How to finish it by hand. */
  by_hand: string;
  /** What is still there. */
  name: string;
  /** What the machine said about it, verbatim. */
  why: string;
}

/** What removing would come to, shown before anything is removed. */
export interface UninstallManifest {
  /** What this reading names itself, so an answer says which reading it answered. */
  agreement: string;
  /** Whether a backup was offered before configuration is destroyed, and how. */
  backup?: string | null;
  /** What the lines that are going occupy, where that is knowable. */
  bytes: number;
  /** What is still coming down, which stopping would interrupt. */
  coming: Coming[];
  /** How much of this was read, and what could not be. */
  confidence: UninstallConfidence;
  /**
   * What is beneath the data location that the stack did not put there.
   *
   * Not a warning. While this is non-empty the data location is never removed as
   * one tree, and only the stack's own directories beneath it are offered.
   */
  foreign: Foreign[];
  /** Every line it reaches, each said to be going or said to be kept. */
  items: Item[];
  /** What it leaves alone, in the operator's words. */
  keeps: string;
  /** What lemonfiber cannot remove, each with how to remove it by hand. */
  outside: Outside[];
  /** What it takes, in the operator's words. */
  removes: string;
  /** Which removal this is. */
  tier: Tier;
  /**
   * Whether the data location is on a network share or a drive that unplugs.
   *
   * Said where it is, so removing across a mount an operator forgot was a mount is
   * something they read before agreeing rather than after.
   */
  volume?: string | null;
}

/**
 * Whether anything was removed on this run, and what became of it.
 *
 * Four states rather than the five a removal passes through. `removing` is the
 * interval between the last two and is said through the narrator as it happens — a
 * value returned at the end cannot be the state a run is in while it runs, and a
 * variant nothing could ever answer with would be a state that is documentation
 * pretending to be a value.
 */
export type UninstallRemoval = UninstallRemovalSurveyed | UninstallRemovalConfirmed | UninstallRemovalComplete | UninstallRemovalPartial;

/** Everything the manifest named as going is gone. */
export interface UninstallRemovalComplete {
  /** The credentials this destroyed, said rather than left to be inferred. */
  credentials: string[];
  /** What went, by the name the manifest gave it. */
  gone: string[];
  state: "complete";
}

/**
 * The tier and the manifest were agreed to, and this run changes nothing — the
 * state a rehearsal ends in.
 */
export interface UninstallRemovalConfirmed {
  state: "confirmed";
}

/**
 * Some of it could not be removed, and each of those is named with how to
 * finish it by hand.
 */
export interface UninstallRemovalPartial {
  /** The credentials this destroyed. */
  credentials: string[];
  /** What went, by the name the manifest gave it. */
  gone: string[];
  /** What is still there, and how to remove it. */
  left: UninstallLeft[];
  state: "partial";
}

/** Everything is enumerated with its size, and nothing has been removed. */
export interface UninstallRemovalSurveyed {
  state: "surveyed";
}
