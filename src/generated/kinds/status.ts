// Generated from the lemonfiber contract. Do not edit.
// The `status` envelope, and the shapes only `status` carries.
// Regenerate with `npm run contract:generate`.

import type { Service, ServiceState } from "../shared/dashboard__lifecycle__status.js";
import type { UnsupportedReport } from "../shared/import__migration__seed__status__stuck.js";
import type { Filtered } from "../shared/lifecycle__preview__status.js";
import type { Condition } from "../shared/lifecycle__status.js";

/**
 * What an operation with no bound on it is waiting for.
 *
 * A case rather than a sentence, so what an operation is waiting for is a value
 * something can be asked about. The words are built from it in one place below;
 * a phrase carried here instead would be a phrase every later surface had to
 * parse back into the fact it came from.
 */
export type Awaiting = "downloads";

/**
 * What acting on this stack would take away, one answer per way of acting.
 *
 * Named by the situation rather than by the verb, because the verb has two
 * spellings: the command line stops named services with `stop` and the HTTP
 * surface spells that same operation `down`. These bytes are what both surfaces
 * answer with, so a table keyed by verb would be right for one caller and wrong
 * for the other. A field each caller maps its own word onto is right for both.
 *
 * Carried on the status reading because a surface deciding whether to stop
 * something has already read that, and because none of these lengths depends on
 * what the stack is currently doing — they are the clocks the run is held to,
 * which is a property of the configuration. A second read to learn a length is
 * a read a surface would skip, and then it would estimate.
 */
export interface Disturbances {
  /** Restarting services. */
  restarting: TakesAway;
  /** Bringing services up, whether a whole form or named services inside one. */
  starting: TakesAway;
  /** Taking services down, interrupting anything still arriving. */
  stopping: TakesAway;
  /**
   * Taking the stack down once everything still arriving has landed.
   *
   * Whole forms only: stopping named services has no such wait to ask for,
   * and a caller that asks for both at once is refused.
   */
  stopping_after_downloads: TakesAway;
  /** Changing the running set, which stops whatever falls outside the new one. */
  switching: TakesAway;
}

/** The envelope carrying `status`. */
export interface StatusEnvelope {
  api_version: number;
  data: StatusReport;
  host?: string | null;
  kind: "status";
}

/** What each service is doing, and what that adds up to. */
export interface StatusReport {
  /**
   * The forms the running services are up for, in the order the stack declares them.
   *
   * Read from the whole stack whichever forms were asked about. A form counts while
   * every service it holds has been started and none has been stopped, and one
   * wholly inside a broader form that counts is left out. Each service names the ones
   * it is running for.
   */
  active_forms: string[];
  /**
   * What the services amount to, as one word.
   *
   * For the whole stack, counted over what the active forms hold and whatever else
   * is there, so a stack running part of itself on purpose reads as active. With no
   * form up, and for the forms asked about, counted over every service listed.
   */
  condition: Condition;
  /**
   * How long each way of acting on these services takes them away for.
   *
   * Here so that a surface can say it before it asks the operator to confirm,
   * which is the only moment saying it is any use.
   */
  disturbs: Disturbances;
  /**
   * What those forms left out for want of a configured provider, service by service.
   *
   * Beside the services rather than among them: a service filtered out is the
   * configuration being honoured, not a service that did not start.
   */
  filtered: Filtered[];
  /** The forms asked about; empty means the whole stack was. */
  forms: string[];
  /**
   * Each service, worst first.
   *
   * A service the active forms filtered out is listed only while it is there; one
   * that is not is in `filtered` and nowhere else.
   */
  services: Service[];
  /**
   * The containers running under this project that the stack never declared.
   *
   * Kept apart from the services rather than mixed in with them, because what is
   * known about each is different: a service has a profile, a criticality and a
   * description, and one of these has a name and a state and nothing else. Shown
   * all the same — something running under this project's name that lemonfiber did
   * not put there is the operator's business whether or not lemonfiber understands
   * it.
   */
  undeclared: Undeclared[];
  /**
   * Services that are running and operable like any other, and that lemonfiber
   * cannot offer the features needing to know what they are — each with why.
   *
   * Empty for the stack this build ships. It fills in for a stack the operator
   * maintains, where a declaration can name an API and leave out the part that
   * makes it addressable: such a service starts, stops and reports its state
   * exactly as the others do, and every feature that would have spoken to it used
   * to do nothing and say nothing. Here rather than on the service's own row,
   * because it is a statement about what this build can do rather than about how
   * the service is faring.
   */
  unsupported?: UnsupportedReport[];
}

/**
 * How long one way of acting on the stack takes something away for.
 *
 * Two cases rather than a length and a flag, because *no bound* is not a long
 * bound and a surface offered a number plus a "really, though?" beside it will
 * show the number. A reader that handles both arms has said both things; one
 * that handles only the first does not compile.
 */
export type TakesAway = TakesAwayBounded | TakesAwayOpenEnded;

/** It ends, and this is the longest the run is held to. */
export interface TakesAwayBounded {
  bound: "bounded";
  /**
   * The length, in seconds.
   *
   * Seconds rather than the engine's own duration shape, because every
   * caller of this turns it into a sentence and none of them wants
   * nanoseconds to do it.
   */
  seconds: number;
}

/** Nothing bounds it, and this is what it is waiting for. */
export interface TakesAwayOpenEnded {
  bound: "open-ended";
  /** What has to happen before it ends. */
  until: Awaiting;
}

/**
 * A container running under this project that the stack description never declared.
 *
 * Its own type rather than a [`Service`] with the fields left blank. A service
 * carries a profile and a criticality, and there is no honest value for either here:
 * filling them in would have lemonfiber asserting how much something matters when
 * the only thing it knows about it is that it exists.
 */
export interface Undeclared {
  /** What it does for the operator — which is exactly what is not known. */
  describes: string;
  /** The Compose service name the engine reports it under. */
  id: string;
  /** What it is doing, read the same way a declared service's state is. */
  state: ServiceState;
}
