// Generated from the lemonfiber contract. Do not edit.
// The `stored` envelope, and the shapes only `stored` carries.
// Regenerate with `npm run contract:generate`.

/** One thing lemonfiber keeps on this machine. */
export interface Kept {
  /** Where it is, in full. */
  at: string;
  /**
   * Whether it holds a credential, which is what decides how carefully a copy of
   * it has to be treated.
   */
  secret: boolean;
  /** What it is, in the operator's words. */
  what: string;
  /** Why it is kept. */
  why: string;
}

/** A directory everything lemonfiber keeps sits under. */
export interface Root {
  /** The directory itself. */
  at: string;
  /** What lives under it, and what losing it would cost. */
  what: string;
}

/** Everything lemonfiber keeps on this machine, and what became of it. */
export interface Stored {
  /** What is on this machine that is not lemonfiber's to keep or remove. */
  beside: StoredBeside[];
  /** Each thing kept, configuration first and then what can be made again. */
  kept: Kept[];
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** Whether this run removed any of it. */
  removal: StoredRemoval;
  /** The two directories all of it lives under. */
  roots: Root[];
}

/** Something on this machine that lemonfiber neither keeps nor removes. */
export interface StoredBeside {
  /** What it is. */
  what: string;
  /** Whose it is, and why it is not lemonfiber's to take away. */
  why: string;
}

/** The envelope carrying `stored`. */
export interface StoredEnvelope {
  api_version: number;
  data: Stored;
  host?: string | null;
  job?: string | null;
  kind: "stored";
}

/** Something a removal could not take away. */
export interface StoredLeft {
  /** The path that is still there. */
  at: string;
  /** What the machine said about it, so it can be finished by hand. */
  why: string;
}

/** Whether anything was removed on this run, and what became of it. */
export type StoredRemoval = StoredRemovalNotAsked | StoredRemovalUnconfirmed | StoredRemovalDone;

/** Carried out. */
export interface StoredRemovalDone {
  /** The directories that are gone. */
  gone: string[];
  /** What could not be removed, each with the reason. */
  left: StoredLeft[];
  state: "done";
}

/** Nobody asked. This is a listing. */
export interface StoredRemovalNotAsked {
  state: "not-asked";
}

/** Asked for without the agreement it takes, so nothing was touched. */
export interface StoredRemovalUnconfirmed {
  state: "unconfirmed";
}
