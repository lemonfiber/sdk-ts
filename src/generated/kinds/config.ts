// Generated from the lemonfiber contract. Do not edit.
// The `config` envelope, and the shapes only `config` carries.
// Regenerate with `npm run contract:generate`.

import type { Stance } from "../shared/adoption__beside__config__import__replacement.js";
import type { SettingReport, Validation } from "../shared/config__wizard.js";

/** One download still coming down when a reduction was asked for. */
export interface Active {
  /** What it is, as the client names it. */
  name: string;
  /** How far along, from zero to a hundred. */
  progress: number;
  /** Which client has it. */
  protocol: string;
}

/**
 * The difference between the configuration in force and the one proposed.
 *
 * One setting, because one call changes one setting. What makes it a diff rather than
 * a value is `from`: an operator deciding whether to go ahead is deciding between two
 * things, and a report that showed only the new one would be asking them to remember
 * the old one correctly.
 */
export interface ConfigChange {
  /** Whether applying it is cheap or consequential. */
  cost: Cost;
  /**
   * What it holds now, withheld where it is a credential, and absent where the
   * setting holds nothing yet.
   */
  from?: string | null;
  /** The setting the change names. */
  key: string;
  /** What it would hold, withheld the same way. */
  to: string;
}

/** The envelope carrying `config`. */
export interface ConfigEnvelope {
  api_version: number;
  data: ConfigReport;
  host?: string | null;
  job?: string | null;
  kind: "config";
}

/** The answer to a configuration command. */
export interface ConfigReport {
  /** Whether this command changed, or would change, a setting. */
  changed: boolean;
  /**
   * What this change costs, where making it decides something with a
   * consequence — moving the library, turning port forwarding off, or naming a
   * front door. Stated for a change that is only staged as well as one that
   * landed, since the moment before it happens is the moment it is worth reading.
   * Absent for a read, and for a change to a setting nobody catalogued a cost for.
   */
  consequence?: string | null;
  /**
   * Whether this was a rehearsal, so a change that `changed` reports was one
   * that *would* be made rather than one that was.
   */
  rehearsed: boolean;
  /**
   * The difference between the configuration in force and the one proposed, and
   * where that proposal stands: applied, staged for a confirmation, turned away,
   * or nothing to do. Absent for a read, which proposes nothing.
   */
  review?: Review | null;
  /** The settings asked about — one for a lookup, all of them for a listing. */
  settings: SettingReport[];
}

/** What changing a decision costs. */
export type Cost = "cheap" | "consequential";

/**
 * A setting changed outside lemonfiber since it last wrote one.
 *
 * Both sides, so the operator chooses between them rather than being told one of
 * them lost. Values a listing withholds are withheld here too — a report a script
 * can log must not be the one place a password is printed.
 */
export interface Edited {
  /** What the file holds now. */
  found: string;
  /** Whether either value was withheld rather than shown. */
  secret: boolean;
  /** What lemonfiber last wrote there. */
  wrote: string;
}

/**
 * What a proposed change comes to on this machine.
 *
 * Empty on every change that comes to nothing beyond its value, which is most of
 * them: a report full of empty lists about a timezone would teach the operator to
 * skip the one that matters.
 */
export interface Findings {
  /** What is still coming down, where a reduction would interrupt it. */
  active: Active[];
  /** The hand-edit found in the configuration file, where one was found. */
  edited?: Edited | null;
  /**
   * What this change leaves exactly as it is, said in full — because an operator
   * dropping a way of downloading is weighing whether they lose what they built
   * with it.
   */
  keeps: string[];
  /**
   * The library paths the services hold, and what moving the data location does
   * to each. Empty for every change that does not move it.
   */
  library: LibraryPath[];
  /** What this change newly asks the operator for, in the order they meet it. */
  opens: Opening[];
  /** What this change stops running, by service name. */
  stops: string[];
}

/**
 * One library path a service files into, and what moving the data location does
 * to it.
 */
export interface LibraryPath {
  /** Why it does or does not, in the operator's terms. */
  because: string;
  /** Whether the library at this path survives the move. */
  carried: boolean;
  /**
   * The host directory it would resolve to after the move, where the move can
   * resolve it at all.
   */
  host?: string | null;
  /** The path as that service holds it, which is a path inside its container. */
  path: string;
  /** The service holding it. */
  service: string;
}

/**
 * One thing a way of downloading newly asks the operator for.
 *
 * What is opened and nothing beside it: an operator adding Usenet is shown the
 * Usenet provider and the settings its login is kept in, and never the tunnel,
 * which they neither need nor asked about.
 */
export interface Opening {
  /** Why this protocol needs it. */
  because: string;
  /**
   * The setting its answer is kept in, where it is kept in one. Absent for an
   * account the operator has to go and obtain, which no setting holds.
   */
  setting?: string | null;
  /** What it is, in the operator's terms. */
  what: string;
}

/** A proposed change, read against what is in force, and where it stands. */
export interface Review {
  /** The difference, as it would be applied. */
  change: ConfigChange;
  /**
   * What the change comes to on this machine, beyond the value it changes.
   *
   * Filled by whoever went and asked — the services where they file, the clients
   * what they are fetching — and empty on every change that comes to nothing
   * beyond its value. Carried on a staged proposal as well as an applied one: a
   * review that withheld this until after the yes would be asking for a yes to
   * something unstated.
   */
  findings?: Findings;
  /**
   * What proving the replacement credential came to, where one was proven.
   *
   * A replacement is proven against its live service before the credential it
   * replaces is discarded, so this is present for exactly those settings and
   * absent everywhere else.
   */
  proof?: Validation | null;
  /**
   * Why nothing was written, where nothing was and the reason is not simply that
   * somebody has yet to say yes.
   */
  refusal?: string | null;
  /** Where the proposal stands. */
  stance: Stance;
}
