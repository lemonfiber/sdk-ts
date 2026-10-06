// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard`, `lifecycle` and `status` all carry.
// Regenerate with `npm run contract:generate`.

import type { Criticality } from "./catalogue__dashboard__lifecycle__status.js";

/** One service, as it stands. */
export interface Service {
  /** How much its absence costs, so a summary can weigh it. */
  criticality: Criticality;
  /**
   * The services it needs before it can work, as the manifest declares them.
   * Carried so a failure can be attributed to the thing underneath it rather
   * than counted as one more independent thing wrong.
   */
  depends_on: string[];
  /**
   * What it does for the operator, in the stack's own words.
   *
   * Carried on the service rather than looked up where it is shown, because this
   * is the one struct every surface reads: a listing, the machine-readable reply,
   * the web API and the terminal's panel all render this, and a description
   * fetched separately by each of them would be four chances to render three.
   *
   * The stack's words rather than lemonfiber's, for the reason its absence cost is:
   * a stack that adds a service should not need a lemonfiber release before it can
   * say what that service is for.
   */
  describes: string;
  /** How it exited, where it has exited. */
  exit?: number | null;
  /**
   * Every form it is running for, in the order the stack declares them.
   *
   * All of them rather than one, because a service two forms share is there for
   * both, and stopping one of them leaves it running for the other. Empty where no
   * form it belongs to is up: a service nobody's form holds is not missing from one.
   */
  forms: string[];
  /** The service's identifier, which is also its Compose service name. */
  id: string;
  /** What it is called in front of an operator. */
  name: string;
  /** The profile that declared it. */
  profile: string;
  /** What it is doing. */
  state: ServiceState;
}

/**
 * What one service is actually doing.
 *
 * Ordered from worst to best, so a form's condition is the minimum across its
 * services and needs no comparison table. The declaration order is therefore
 * load-bearing.
 */
export type ServiceState = "failed" | "crash-looping" | "unhealthy" | "absent" | "stopped" | "starting" | "running" | "healthy" | "host-managed";
