// Generated from the lemonfiber contract. Do not edit.
// The `pausing` envelope, and the shapes only `pausing` carries.
// Regenerate with `npm run contract:generate`.

import type { Pulling } from "../shared/bandwidth__pausing.js";

/** What one download client said about being paused or resumed. */
export interface PausedClient {
  /** The client, by the name the stack knows it under. */
  client: string;
  /**
   * What it read back after it was asked. Absent on a rehearsal, which asks nothing,
   * and where the client could not be reached.
   */
  now?: Pulling | null;
  /** Why it could not be reached, in its own words where it gave any. */
  unreached?: string | null;
  /** Whether it was fetching before it was asked, where it said. */
  was?: Pulling | null;
}

/** Which of the two was asked for. */
export type Pausing = "pause" | "resume";

/** The envelope carrying `pausing`. */
export interface PausingEnvelope {
  api_version: number;
  data: PausingReport;
  host?: string | null;
  job?: string | null;
  kind: "pausing";
}

/** What pausing or resuming every download client came to. */
export interface PausingReport {
  /** Which of the two was asked for. */
  asked: Pausing;
  /**
   * What a resume runs into where a spent cap had stopped the clients: they are let
   * go as asked, and the cap stops them again the next time the line is checked.
   */
  caution?: string | null;
  /** Every download client the stack runs, in the order the stack declares them. */
  clients: PausedClient[];
  /**
   * The offer this answers: every client and what it said it was doing before it was
   * asked anything, named so that a request carrying it back acts on those clients
   * in those states or is refused.
   */
  offer: string;
  /**
   * Whether this was a rehearsal: what each client is doing now, with nothing asked
   * of any of them.
   */
  rehearsed: boolean;
}
