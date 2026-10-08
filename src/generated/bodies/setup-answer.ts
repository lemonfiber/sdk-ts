// Generated from the lemonfiber contract. Do not edit.
// The body `/api/setup/answer` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

import type { Protocols } from "../shared/body-setup-answer__setup.js";

/** How much an operator wants to be told. */
export type Appetite = "problems-only" | "with-completions" | "everything";

/**
 * An indexer credential the operator supplied, and whether it was proven.
 *
 * `validated` records whether the live test passed before this was kept — an
 * operator may proceed with one that could not be proven, and a later diagnosis
 * is owed the knowledge that it went in unverified rather than treating it as
 * good.
 */
export interface Indexer {
  /** The API key it authenticates with. */
  key: string;
  /** The indexer's API base URL. */
  url: string;
  /**
   * Whether a live test proved the key before it was kept.
   *
   * Defaulted when it is absent, so a surface submitting an answer states only
   * what was entered; what a test decided is not a caller's to assert.
   */
  validated?: boolean;
}

/**
 * How the operator wants their existing and downloaded media served, where they
 * want it served at all.
 */
export type Library = "none" | "jellyfin-docker" | "jellyfin-native";

/**
 * A Usenet provider login the operator supplied, and whether it was proven.
 *
 * Its password rides here the way the stack holds its other secrets; `validated`
 * records whether the live login took before it was kept, so a later diagnosis
 * knows an unproven one went in unverified.
 */
export interface Provider {
  /** The provider's hostname. */
  host: string;
  /** The account password. */
  pass: string;
  /** The port it answers NNTP on. */
  port: number;
  /** Whether to connect over TLS, as it must be to carry the password. */
  tls: boolean;
  /** The account username. */
  user: string;
  /**
   * Whether a live login proved the account before it was kept.
   *
   * Defaulted when it is absent, for the same reason the indexer's is.
   */
  validated?: boolean;
}

/**
 * One answer, tagged by the step it belongs to.
 *
 * Read back as well as built, because a surface that is not in this process
 * submits one: the tag is the step, so an answer names the question it belongs
 * to rather than arriving as a field a reader has to guess the meaning of.
 */
export type SetupAnswerBody = SetupAnswerBodyProtocols | SetupAnswerBodyVpn | SetupAnswerBodyDataLocation | SetupAnswerBodyCredentials | SetupAnswerBodyProvider | SetupAnswerBodyServiceUser | SetupAnswerBodyLibrary | SetupAnswerBodyNotifications | SetupAnswerBodyHousehold | SetupAnswerBodyAutostart;

/** Whether to start on boot. */
export interface SetupAnswerBodyAutostart {
  autostart: boolean;
}

/**
 * The indexer credential the operator settled on, or none where they entered
 * nothing.
 */
export interface SetupAnswerBodyCredentials {
  credentials: Indexer | null;
}

/** The data location. */
export interface SetupAnswerBodyDataLocation {
  "data-location": string;
}

/** Whether the household uses it. */
export interface SetupAnswerBodyHousehold {
  household: boolean;
}

/** How the library is served. */
export interface SetupAnswerBodyLibrary {
  library: Library;
}

/** How much the operator wants to be told about. */
export interface SetupAnswerBodyNotifications {
  notifications: Appetite;
}

/** The protocol choice. */
export interface SetupAnswerBodyProtocols {
  protocols: Protocols;
}

/**
 * The Usenet provider the operator settled on, or none where they entered
 * nothing.
 */
export interface SetupAnswerBodyProvider {
  provider: Provider | null;
}

/** The container user and group, or none where it is not needed. */
export interface SetupAnswerBodyServiceUser {
  "service-user": [number, number] | null;
}

/**
 * Whether a VPN carries the torrents, and where none does, that the operator
 * accepted what that means.
 */
export interface SetupAnswerBodyVpn {
  vpn: SetupVpn;
}

/**
 * Whether a VPN carries the torrent traffic, and where none does, that the
 * operator was told what that costs and chose to go on.
 *
 * Two states rather than a bool, because the second is not merely "no". Torrents
 * expose the home address to every peer, so going without is a decision the
 * operator has to make knowingly — and one a later run must not quietly re-ask,
 * nor a diagnosis mistake for an oversight. Recording the acceptance is what
 * makes it theirs.
 */
export type SetupVpn = "carrying" | "absent";
