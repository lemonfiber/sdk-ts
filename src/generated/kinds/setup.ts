// Generated from the lemonfiber contract. Do not edit.
// The `setup` envelope, and the shapes only `setup` carries.
// Regenerate with `npm run contract:generate`.

/**
 * Which download protocols the operator actually has accounts for.
 *
 * A form names both, because a form describes what it *does* rather than what
 * this operator has paid for. Narrowing happens afterwards, so a tunnel is
 * never started with credentials that were never supplied.
 */
export interface Protocols {
  /** A VPN and torrent client are configured. */
  torrent: boolean;
  /** A Usenet provider is configured. */
  usenet: boolean;
}

/** The envelope carrying `setup`. */
export interface SetupEnvelope {
  api_version: number;
  data: SetupReport;
  host?: string | null;
  job?: string | null;
  kind: "setup";
}

/** How a setup run ended. */
export type SetupOutcome = "applied" | "abandoned" | "already-set-up";

/**
 * What a setup run came to, and what it settled on.
 *
 * **Deliberately not the settings themselves.** Setup writes an indexer key and a
 * service password among them, and a report a script can read is a report a script
 * can log — into a file, a CI transcript, somebody's terminal history. So this says
 * what was *decided* and never what was *entered*, and the fields are chosen one at
 * a time rather than by serialising a struct that might later gain a secret.
 *
 * The indexer's address is left out for that reason rather than because it is
 * itself a secret: it is entered beside its key, and the two travel together in
 * every place an operator copies them from.
 */
export interface SetupReport {
  /** Where the library was put, where a location was chosen. */
  data_root?: string | null;
  /** How the run ended. */
  outcome: SetupOutcome;
  /** Which ways of downloading the stack was set up for. */
  protocols: Protocols;
  /** The user the services run as, as `uid:gid`, where one was set. */
  service_user?: string | null;
}
