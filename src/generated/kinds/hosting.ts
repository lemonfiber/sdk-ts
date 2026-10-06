// Generated from the lemonfiber contract. Do not edit.
// The `hosting` envelope, and the shapes only `hosting` carries.
// Regenerate with `npm run contract:generate`.

/** What one run of this command did to the machine. */
export interface Changed {
  /** Whether it installed it, rather than took it back. */
  installed: boolean;
  /** The command it acted on. */
  name: string;
  /** Whether this was a rehearsal, in which case nothing above happened. */
  rehearsed: boolean;
  /** Whether it started the command, which only installing does. */
  started: boolean;
  /** Everything it wrote or removed, so nothing goes unnamed in either direction. */
  touched: string[];
}

/** One long-running command, and what stands between it and this machine. */
export interface HostedCommand {
  /** How it is typed in a terminal, which is what hosting installs. */
  command: string;
  /** The service definition installed for it, where there is one. */
  definition?: string | null;
  /** What it does for as long as it runs, in one sentence. */
  guarantees: string;
  /** The program the definition names, where nothing is there any more. */
  missing?: string | null;
  /** lemonfiber's own name for it. */
  name: string;
  /** Where a hosted run writes the words it would have said on a terminal. */
  output?: string | null;
  /** The whole command line that definition runs. */
  runs?: string | null;
  /** What stands between it and the machine. */
  standing: Hosting;
}

/**
 * What stands between one long-running command and the machine.
 *
 * Written with hyphens because these are the words the operator reads and the
 * requirement names, and a reading that spelled them differently would be a
 * second vocabulary for one set of facts.
 */
export type Hosting = "not-hosted" | "hosted" | "installed-unverified" | "stopped" | "orphaned" | "unsupported";

/** The envelope carrying `hosting`. */
export interface HostingEnvelope {
  api_version: number;
  data: HostingReport;
  host?: string | null;
  kind: "hosting";
}

/**
 * What this machine keeps running on lemonfiber's behalf.
 *
 * Defaultable so a test can read one out of a `Result` without a branch it can
 * never take: a closure standing in for the impossible arm is a region no
 * passing run enters, and the coverage gate counts those.
 */
export interface HostingReport {
  /** What is true of this manager and worth knowing before it is relied on. */
  caveat?: string | null;
  /** What this run changed, where it was asked to change something. */
  changed?: Changed | null;
  /** Every long-running command there is, hosted or not. */
  commands: HostedCommand[];
  /** What to do instead, where lemonfiber cannot configure this platform. */
  instruction?: string | null;
  /** The service manager this platform has, or the absence of one. */
  manager: Manager;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
}

/**
 * The service manager a machine has, or the absence of one lemonfiber configures.
 *
 * The absence is the default, because a machine nobody has told is a machine
 * nothing is known about, and guessing at a manager is how a report comes to
 * claim a platform it never asked.
 */
export type Manager = "launchd" | "systemd" | "unsupported";
