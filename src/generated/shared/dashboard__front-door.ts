// Generated from the lemonfiber contract. Do not edit.
// The shapes `dashboard` and `front-door` both carry.
// Regenerate with `npm run contract:generate`.

/** Where the front door is reached, and what is worth knowing about the address. */
export interface Address {
  /**
   * What is worth knowing about the address itself, where anything is. Absent
   * for one that keeps working on its own.
   */
  caution?: string | null;
  /** The whole address, as it would be typed or followed. */
  url: string;
}

/** How the front door came to be the one it is. */
export type Chosen = ChosenDerived | ChosenNamed | ChosenRefused;

/**
 * Worked out from what the stack declares, which is what a stack whose
 * operator has named nothing answers.
 */
export interface ChosenDerived {
  chosen: "derived";
}

/**
 * Named by the operator, by the id the stack declares it under, and it is the
 * door.
 */
export interface ChosenNamed {
  chosen: "named";
  door: string;
}

/**
 * Named by the operator and refused. The worked-out door stands, and this
 * carries what was named and why it is not it.
 */
export interface ChosenRefused {
  chosen: "refused";
  door: Refusal;
}

/** What a service published to the local network is to the people in the house. */
export type Facing = "asking" | "watching" | "shelf" | "operators" | "carriage" | "unstated";

/**
 * A service the household can reach that is not the front door, and why it is not.
 *
 * Carried rather than left out, because the decision is the useful part: an operator
 * who can see that the index over every service was considered and refused has been
 * told something, where one shown a single name has only been given an answer.
 */
export interface FrontDoorBeside {
  /**
   * The address to hand somebody for this service, read from this machine at the
   * moment of asking rather than remembered.
   *
   * **Carried because not-the-door is not nowhere.** A household member wanting to
   * watch something, or to ask for something, wants the service that faces them —
   * and which of the two happens to be the front door is an operator's
   * arrangement, not an answer to their question. Without this a surface can hand
   * them only whichever one the door turned out to be, and say nothing at all
   * about the other.
   *
   * Absent where the stack declares no port for it, for the reason the door's own
   * address is absent then: an address with no port on it is one a browser answers
   * with a refusal, and the manifest is where a port is declared.
   */
  address?: Address | null;
  /** Why it is not somewhere to begin. */
  because: string;
  /** What it is to the household. */
  facing: Facing;
  /** The service, by the name it shows itself under. */
  service: string;
}

/**
 * The household's one front door: which service it is, where it stands, and what
 * else they can reach that is not it.
 */
export interface FrontDoorReport {
  /**
   * The address to hand them, read from this machine at the moment of asking
   * rather than remembered. Absent where there is no door, and where there is
   * one on a machine that will say neither what it is called nor where it is.
   */
  address?: Address | null;
  /** Everything else the household can reach, and why none of it is the door. */
  beside: FrontDoorBeside[];
  /**
   * How this came to be the door: worked out from what the stack declares, named
   * by the operator, or named by them and refused.
   *
   * Carried as a state rather than left to the sentence beneath it, for the reason
   * the standing is: an operator whose setting was refused reads the sentence, and
   * a browser, a script or a dashboard reads this.
   */
  chosen: Chosen;
  /** What that service is to them. Absent for the same reason. */
  facing?: Facing | null;
  /**
   * What this comes to, in the words an operator would say it in — including,
   * where there is no door, that there is none.
   */
  meaning: string;
  /**
   * The service the household begins at, by the name it shows itself under.
   * Absent where this stack publishes nothing they could begin at.
   */
  service?: string | null;
  /** Where the front door stands. */
  standing: FrontDoorStanding;
}

/** Where the household's one front door stands. */
export type FrontDoorStanding = "established" | "library-only" | "unreachable" | "stranded" | "none";

/** A named front door that is not one, and why it is not. */
export interface Refusal {
  /** Why this stack will not send a household there. */
  because: string;
  /** What the operator recorded, as they wrote it. */
  named: string;
}
