// Generated from the lemonfiber contract. Do not edit.
// The `outbound` envelope, and the shapes only `outbound` carries.
// Regenerate with `npm run contract:generate`.

import type { ValueOrigin } from "../shared/config__credentials__doctor__outbound__plugins__wiring__wizard.js";

/** A request one of the stack's services makes, which is not lemonfiber's. */
export interface Elsewhere {
  /**
   * Where its requests go, in the terms an operator would recognise.
   *
   * Empty means it reaches nothing, which is an answer. It never means *and we
   * do not know*: that is [`Self::recorded`], and the two must not be read as one
   * — an unknown service rendered as an empty destination would be this product
   * claiming nothing leaves the machine on the strength of having no idea.
   */
  destination: string;
  /**
   * Whose request it is: the stack's own, or an installed plugin's, named.
   *
   * A column in this account rather than an account of its own, because what leaves
   * this machine is one question however many parties are asking it.
   */
  origin: ValueOrigin;
  /** What it asks for. */
  purpose: string;
  /**
   * Whether lemonfiber ships a record of what this service reaches.
   *
   * False for a service that arrived in the stack after this build was made, or
   * from an operator's own fork. It is listed anyway, because the alternative —
   * leaving it out — is a privacy inventory that is complete-looking and short,
   * and a reader counting the services on their machine against the ones on this
   * list is the reader this surface exists for.
   */
  recorded: boolean;
  /** The service, by the id the stack declares it under. */
  service: string;
}

/** Everything that leaves this machine: lemonfiber's own requests, and the stack's. */
export interface Leaving {
  /** Every request lemonfiber makes on its own account, in a fixed order. */
  ours: Outbound[];
  /** The requests made by services this stack runs, attributed to them. */
  theirs: Elsewhere[];
}

/** One request lemonfiber makes, where it goes, and what refusing it costs. */
export interface Outbound {
  /** Whether this machine's settings allow it. */
  allowed: boolean;
  /** What stops working once it is off. */
  cost: string;
  /**
   * Where it goes as this machine is configured. Empty where nothing is
   * configured to reach, which is not the same as switched off.
   */
  destination: string[];
  /** Why lemonfiber asks. */
  purpose: string;
  /** Which request this is. */
  reach: OutboundReach;
  /** Exactly what travels in the request. */
  sends: string;
  /** The setting that switches it off. */
  switch: string;
}

/** The envelope carrying `outbound`. */
export interface OutboundEnvelope {
  api_version: number;
  data: Leaving;
  host?: string | null;
  kind: "outbound";
}

/**
 * One of the requests lemonfiber makes on its own account.
 *
 * Nine, and the closed set is the claim. A tenth is a decision somebody makes by
 * adding a variant here and answering four questions about it, rather than one
 * that happens by somebody building a request.
 *
 * The sixth is the one that carries somebody's words rather than a credential or a
 * name, and it was added deliberately and late: five of these prove or fetch
 * something and could say what travels in a phrase, and this one travels to a
 * person. What that costs is the same four answers as the rest, and one more thing
 * the others do not owe — it is the only entry whose destination is somebody else's
 * choice, so the list names the two services it can reach and the sender is handed
 * them rather than holding addresses of its own.
 *
 * The seventh is the only one this program makes about *itself*, and the one most easily
 * left off a list of what this program reaches. What it costs to allow is the shortest
 * answer on the list: it carries nothing at all, so the only thing switching it off
 * keeps from anybody is the knowledge that a version came out.
 *
 * The eighth goes where the operator points it and nowhere else: a plugin's git
 * source, named at install. It is the only entry whose destination nobody chose in
 * advance, which is why it is made only when somebody names one.
 *
 * The ninth goes to one place this build names, and only when an operator installs a
 * plugin by name: the catalogue's newest release, for its index and the signature over
 * it.
 */
export type OutboundReach = "registry" | "guides" | "echo" | "indexer" | "usenet" | "household" | "updates" | "plugin-source" | "catalogue";
