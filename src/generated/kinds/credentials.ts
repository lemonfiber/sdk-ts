// Generated from the lemonfiber contract. Do not edit.
// The `credentials` envelope, and the shapes only `credentials` carries.
// Regenerate with `npm run contract:generate`.

import type { ValueOrigin } from "../shared/config__credentials__doctor__outbound__plugins__wiring__wizard.js";

/**
 * One credential, described without being disclosed.
 *
 * There is deliberately no value here, and no field a value could be put in later
 * without the change being visible in review.
 */
export interface CredentialHeld {
  /** What is worth saying about this one, where anything is. */
  advisory?: string | null;
  /**
   * Everything that authenticates with it. Named individually, because a
   * consumer left off this list is a consumer a rotation would silently strand.
   */
  consumers: string[];
  /**
   * A short likeness of the value, for telling two copies apart in a report.
   *
   * Absent where there is no value to take one of. Never reversible and never a
   * proof — see [`fingerprint`].
   */
  fingerprint?: string | null;
  /**
   * Whose line it is: the stack's own, or an installed plugin's, named.
   *
   * A different question from who produced it. A plugin's secret is minted by the
   * service it belongs to like any other, and what the operator needs to know as well
   * is that the service is one a plugin brought.
   */
  from: ValueOrigin;
  /** Where the value lives, as a path or a description of one. */
  location: string;
  /** What it is, in the operator's words — `qBittorrent web UI password`. */
  name: string;
  /** Who produced it. */
  origin: Origin;
  /** The setting it is recorded under, which is a name and never a value. */
  setting: string;
  /** Where it stands. */
  state: CredentialState;
}

/** How far a rotation reached one consumer. */
export type CredentialReach = CredentialReachUpdated | CredentialReachPending | CredentialReachFailed;

/**
 * It could not be updated. Named rather than dropped, because a consumer left
 * holding the old value is the failure this list exists to surface.
 */
export interface CredentialReachFailed {
  /** Why it could not be. */
  detail: string;
  reach: "failed";
}

/**
 * It will hold the replacement once one more thing happens, and that thing is
 * named. A consumer reading the value out of a container's environment has it
 * fixed at the moment the container was created, so recording a new one is
 * only half of reaching it.
 */
export interface CredentialReachPending {
  /** What still has to happen, written as the command that does it. */
  detail: string;
  reach: "pending";
}

/** It now holds the replacement. */
export interface CredentialReachUpdated {
  reach: "updated";
}

/**
 * Where a credential stands, as far as lemonfiber can tell without spending it.
 *
 * Six states rather than a boolean because the operator's next move differs for
 * each: an absent credential is one to supply, a stale one is one to prove, an
 * invalid one is one to replace, and the two rotation states exist so a run
 * interrupted half-way through a replacement is legible rather than mysterious.
 */
export type CredentialState = "absent" | "active" | "stale" | "invalid" | "rotating" | "superseded";

/** The envelope carrying `credentials`. */
export interface CredentialsEnvelope {
  api_version: number;
  data: Inventory;
  host?: string | null;
  kind: "credentials";
}

/**
 * The whole answer to a question about credentials.
 *
 * Every ask answers with the inventory as it now stands, and adds what became of
 * whatever else was asked for. An operator who has just rotated something wants to
 * see the inventory that rotation produced, not a receipt they have to go and check
 * against one.
 */
export interface Inventory {
  /** Every credential, whether or not it is present. */
  held: CredentialHeld[];
  /** What keeping them in files does and does not protect against. */
  protection: Protection;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** One value, where one was asked for. */
  revealed?: Revealed | null;
  /** What became of a rotation, where one was asked for. */
  rotated?: Rotation | null;
}

/** Who produced a credential, which decides what can be done about it. */
export type Origin = "operator" | "service" | "lemonfiber";

/** One consumer, and how far the rotation reached it. */
export interface Propagation {
  /** What authenticates with the credential. */
  consumer: string;
  /** How far the rotation reached it. */
  reach: CredentialReach;
}

/**
 * The honest account of what the credential store protects against.
 *
 * Two lists and a sentence, carried as data rather than printed here, so the API
 * serves the same words the terminal prints and neither can drift into a claim the
 * other does not make.
 */
export interface Protection {
  /** What it protects against. */
  against: string[];
  /** What it does not protect against. */
  not_against: string[];
  /** What the storage is, before any claim about it. */
  summary: string;
}

/**
 * One stored value, handed back because the operator asked for it and said so.
 *
 * Separate from [`Held`] rather than a field on it, so that the inventory cannot
 * carry a value by accident: a surface that renders the inventory has nothing to
 * render, whatever it does.
 */
export interface Revealed {
  /** Which credential this is. */
  name: string;
  /** The value, present only where the ask was confirmed. */
  value?: string | null;
  /** What the operator is told before it appears, whether or not it appears. */
  warning: string;
}

/** What one rotation came to. */
export interface Rotation {
  /** Every consumer, and how far the rotation reached it. */
  consumers: Propagation[];
  /** Which credential was to be replaced. */
  credential: string;
  /** What became of the replacement. */
  settled: Settled;
}

/** What became of a rotation. */
export type Settled = SettledReplaced | SettledRefused | SettledUnproven | SettledReplacedUnproven | SettledRehearsed | SettledUnknown | SettledElsewhere;

/**
 * A replacement for this one does not come from here.
 *
 * Either the operator's provider issued it, in which case inventing one would
 * produce a credential no service has ever heard of; or the service that holds
 * it offers no way to change it in place. Either way what is owed is a
 * sentence saying where a replacement does come from, not an attempt.
 */
export interface SettledElsewhere {
  /** Where a replacement comes from, and what to do once it exists. */
  detail: string;
  settled: "elsewhere";
}

/** The service answered and refused the replacement. Nothing was changed. */
export interface SettledRefused {
  /** What the service said, with any credential in it withheld. */
  detail: string;
  settled: "refused";
}

/**
 * Nothing was attempted, because this run only said what a rotation would do.
 *
 * Its own outcome rather than one of the refusals above, because it is not a
 * refusal: nothing went wrong, and what an operator is being told is what would
 * happen if they ran it again meaning it. Carrying its own three fields rather
 * than one sentence, because "it would rotate the qBittorrent password" is not a
 * report — where the value lives is what would be written over, and what is owed
 * afterwards is the half nobody finds out about until a consumer stops working.
 *
 * No value appears here and none is generated to put here. A replacement minted
 * to describe a rotation is a secret that exists because somebody asked a
 * question, and it would then have to be kept or thrown away — and one thrown
 * away may be one the service has already taken.
 */
export interface SettledRehearsed {
  /** What would still need doing before every consumer held the replacement. */
  afterwards: string[];
  /** What a real run would do, step by step, in lemonfiber's own words. */
  detail: string;
  /** Where the value that would be replaced is kept. */
  location: string;
  settled: "rehearsed";
}

/** The replacement was proven and is now the value in force. */
export interface SettledReplaced {
  /** What the service did while proving it — an observation, never the value. */
  observed: string;
  settled: "replaced";
}

/**
 * The service replaced the credential itself, and the replacement did not answer.
 *
 * The one way of not landing that keeps nothing: a service asked to replace its
 * own key drops the old one the moment it makes the new one, so there is no order
 * that proves first. What is owed is the command that hands the new one out once
 * the service answers.
 */
export interface SettledReplacedUnproven {
  /** What did not answer, and what to run once it does. */
  detail: string;
  settled: "replaced-unproven";
}

/** Nothing in this stack holds a credential by that name. */
export interface SettledUnknown {
  /** The names that would have been accepted. */
  known: string[];
  settled: "unknown";
}

/**
 * Nothing usable answered, so the replacement could not be proven. Nothing
 * was changed, because an unproven replacement is not a better one.
 */
export interface SettledUnproven {
  /** Why nothing could be concluded. */
  detail: string;
  settled: "unproven";
}
