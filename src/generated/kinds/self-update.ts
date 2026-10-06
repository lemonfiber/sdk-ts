// Generated from the lemonfiber contract. Do not edit.
// The `self-update` envelope, and the shapes only `self-update` carries.
// Regenerate with `npm run contract:generate`.

/**
 * How this copy of lemonfiber got onto the machine.
 *
 * Nothing known is the default. Every other answer is a claim about somebody's
 * machine, and a value that arrived by nobody filling it in has established none of
 * them.
 */
export type Installed = "homebrew" | "scoop" | "winget" | "cargo" | "distribution" | "installer" | "elsewhere" | "image" | "untellable";

/** The envelope carrying `self-update`. */
export interface SelfUpdateEnvelope {
  api_version: number;
  data: UpdateReport;
  host?: string | null;
  kind: "self-update";
}

/**
 * Where a copy of lemonfiber stands, in the words the specification uses.
 *
 * Nothing known is the default, and it is the right one: a report built before
 * anything has been read has not established that this copy is current, and a
 * default that said so would be a claim made by an empty value.
 */
export type SelfUpdateStanding = "current" | "update-available" | "managed-externally" | "check-failed";

/** Where this copy of lemonfiber stands, and what moving it would come to. */
export interface UpdateReport {
  /** What updating leaves alone, and what it needs afterwards. */
  afterwards: string;
  /** The version the operator asked to move to, where they asked for one. */
  asked?: string | null;
  /**
   * Where the running binary is, with any link followed, or nothing where this
   * machine would not say.
   *
   * The answer to which of several copies on a search path is the one that ran, so
   * a version somebody quotes can be attributed to a file rather than to a name.
   */
  at?: string | null;
  /** What a release brings besides the program, and when any of it is fetched. */
  carries: string;
  /**
   * What the version on offer says it changed, as its release page words it.
   *
   * The question an operator is actually weighing. Carried as the notes were
   * written rather than taken apart here, because what a surface does with them
   * is a surface's business — a terminal flattens them, a browser renders them,
   * and a script wants them as they came.
   */
  changed?: string | null;
  /** Exactly what to type, where there is something exact to type. */
  command?: string | null;
  /**
   * Whether the version named can read the configuration on this machine.
   *
   * Only where a version was named, since it is the question a downgrade asks and
   * nothing else does.
   */
  configuration?: string | null;
  /** How this copy got onto the machine. */
  installed: Installed;
  /**
   * Why there is nothing exact to type, where there is not; or, where typing the
   * command is not the whole of the move, what has to follow it.
   */
  instead?: string | null;
  /** The newest version released, where the check could read one. */
  offered?: string | null;
  /** The tool that owns this copy, where one does. */
  owner?: string | null;
  /**
   * Whether the directory holding the running binary can be written to.
   *
   * Nothing where it was not asked, which is every copy a package manager owns —
   * replacing one of those is that tool's business and not this one's. Asked by
   * trying rather than by reading permission bits, and reported rather than acted
   * on: a copy this operator cannot replace is a thing to say with the path, never
   * a reason to go looking for a way to become somebody else.
   */
  replaceable?: boolean | null;
  /** The version running now. */
  running: string;
  /** Which of the states this is. */
  standing: SelfUpdateStanding;
  /** Why availability could not be told, where it could not. */
  untold?: string | null;
}
