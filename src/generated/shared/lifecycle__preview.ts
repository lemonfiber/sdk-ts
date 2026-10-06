// Generated from the lemonfiber contract. Do not edit.
// The shapes `lifecycle` and `preview` both carry.
// Regenerate with `npm run contract:generate`.

import type { Filtered, StackProtocol } from "./lifecycle__preview__status.js";

/**
 * A profile left out of a closure, and what it would have needed.
 *
 * The provider travels with the profile because a name on its own sends the
 * operator looking for a fault. What they have is a stack not configured for
 * one of the two ways of downloading, which is a sentence rather than a word.
 */
export interface Dropped {
  /** The provider it cannot run without. */
  needs: StackProtocol;
  /** The profile that will not run. */
  profile: string;
}

/**
 * The memory the stack estimates a set of services needs.
 *
 * An estimate by name as well as by description, because a figure read as a
 * measurement is one an operator believes and acts on. It is the sum of what each
 * service declares; nothing here has looked at anything running.
 */
export interface Footprint {
  /** The sum of the estimates the services declare, in MiB. */
  estimated_mib: number;
  /** The services that declare no estimate, and so are not in the sum. */
  unestimated: string[];
}

/**
 * What will be run, and what was left out.
 *
 * Serialisable because it is an answer in its own right: asking what a form
 * would do is a question a script asks as readily as a person, and the plan a
 * lifecycle report carries is this same value rather than a retelling of it.
 */
export interface Plan {
  /** Profiles the closure asked for that the configuration does not support. */
  dropped: Dropped[];
  /**
   * The services those profiles hold, each with what it needed and who asked.
   *
   * The same answer as [`Self::dropped`], a service at a time. A surface showing what
   * did not start shows services, and one holding its own copy of which service sits
   * in which profile would be a second copy of the stack's vocabulary.
   */
  filtered: Filtered[];
  /** What the stack estimates the services that would start need. */
  footprint: Footprint;
  /** The forms the operator named, in the order they named them. */
  forms: string[];
  /** The profiles to activate, sorted so the command is reproducible. */
  profiles: string[];
  /**
   * Which of [`Self::services`] are already running, where a form's introspection
   * asked the engine.
   *
   * Starting a form leaves what is already running as it is, so a running service
   * is not one the start would bring up. Absent where nothing asked, which is every
   * plan but a preview's; `null` where the engine would not say, which is never said
   * as nothing running.
   */
  running?: string[] | null;
  /**
   * The services those profiles start, in the order the stack declares them.
   *
   * A service belongs to exactly one profile, so a service two named forms
   * both reach is here once. That is a property of the manifest rather than
   * of a pass over this list: the union is over profiles, and a service
   * appearing twice is not a state this can hold.
   */
  services: string[];
}
