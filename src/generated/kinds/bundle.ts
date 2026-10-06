// Generated from the lemonfiber contract. Do not edit.
// The `bundle` envelope, and the shapes only `bundle` carries.
// Regenerate with `npm run contract:generate`.

/**
 * What a support request said: what a bundle holds, and where it is if it exists.
 *
 * One record with an absent path rather than two shapes, because the two answers
 * are the same answer at two moments: both list what goes in the file and say how
 * large it is, and only one of them has a file to point at. A caller reads whether
 * there is a path to know which it has.
 */
export interface Bundle {
  /** How large the file is, or would be. */
  bytes: number;
  /** Everything it holds, gathered, redacted and read back. */
  contents: Contents;
  /** Where it was written, or nothing where a run that writes nothing described it. */
  path?: string | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * Where it would be written, on the run that only describes one.
   *
   * The other half of what a description is for. What goes in the file and how
   * large it is answer *whether* to make it; where it lands answers *where to find
   * it*, and an operator deciding at a shell needs both at the one moment the
   * answer can still change what they do. Resolved by the same function the run
   * that writes resolves it with, so the path shown and the path written are one.
   *
   * Absent on a run that wrote one — `path` is then where it went — and absent on a
   * machine that would not say where lemonfiber keeps its own files, which is the
   * one destination of the three that needs that answer.
   */
  would_go?: string | null;
}

/** The envelope carrying `bundle`. */
export interface BundleEnvelope {
  api_version: number;
  data: Bundle;
  host?: string | null;
  kind: "bundle";
}

/** Everything gathered for a bundle, and everything that could not be. */
export interface Contents {
  /**
   * What could not be collected, named.
   *
   * Named rather than passed over: a bundle from a machine whose diagnostics will not
   * run is exactly the bundle worth having, and a gap nobody mentions reads as an
   * absence of trouble rather than as an absence of information.
   */
  missing: string[];
  /** The files, in the order a reader would want them. */
  pieces: Piece[];
  /** Where and when it came from. */
  taken: Taken;
  /** How it was made, and what its operator chose. */
  terms: Terms;
}

/**
 * Whether media filenames are shown as they are.
 *
 * Replaced unless asked otherwise. A library's contents are not a credential, but they
 * are the one thing in a bundle that says something about the person rather than about
 * the machine, and replacing them costs a diagnostic a reader can still follow — the
 * marks keep two mentions of one file recognisable as one file.
 *
 * Read from the bare flag a surface carries rather than from a name of its own,
 * because that is what both surfaces have: `--filenames` on a command line and a
 * `filenames` in a request body are one word that is there or is not. Which way
 * round it reads is decided here, once — a surface that read it the other way
 * round would put a library's contents in a file people post in public.
 */
export type Filenames = boolean;

/**
 * One file inside a bundle: the name it will carry, and what it holds.
 *
 * Held in memory rather than written as it is gathered, because everything is read back
 * before anything is written. A bundle that had already put one file on disk when it
 * found a credential in the next would have to be unwritten, and unwriting is the kind of
 * thing that half-works.
 */
export interface Piece {
  /** What it holds, already redacted. */
  body: string;
  /** What it is called inside the bundle. */
  name: string;
}

/**
 * What a reader needs to know before reading a word of the bundle.
 *
 * An operator pasting last week's bundle into this week's thread is the commonest way one
 * of those threads goes wrong, and nothing in the contents tells either of them.
 */
export interface Taken {
  /** When, as a service writes a moment. */
  at: string;
  /** The lemonfiber that wrote it. */
  lemonfiber: string;
  /** The stack it was written from. */
  stack: string;
}

/**
 * How a bundle was made: what was bounded, what was replaced, and what its operator asked
 * to have shown as it is.
 *
 * Carried in the bundle rather than known only to the command that wrote it, because the
 * person who reads one is usually not the person who chose any of this.
 */
export interface Terms {
  /** Whether media filenames were shown. */
  filenames: Filenames;
  /** The settings the operator asked to have shown as they are. */
  revealed: string[];
  /** How much of the logs was taken, said as it would be said aloud. */
  window: string;
}
