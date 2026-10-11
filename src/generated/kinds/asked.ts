// Generated from the lemonfiber contract. Do not edit.
// The `asked` envelope, and the shapes only `asked` carries.
// Regenerate with `npm run contract:generate`.

import type { TitleKind } from "../shared/askable__asked.js";

/** The envelope carrying `asked`. */
export interface AskedEnvelope {
  api_version: number;
  data: AskedReport;
  host?: string | null;
  job?: string | null;
  kind: "asked";
}

/** What asking for one title came to, or would come to under a rehearsal. */
export interface AskedReport {
  /** Whether it is a series or a film. */
  kind: TitleKind;
  /** What is left of the member's allowance once it is counted. */
  leaves: LeftAfter;
  /** The member it was asked for, by the name they are known by. */
  member: string;
  /** What it came to. */
  outcome: Became;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
  /**
   * Whether the title has come out yet. One that has not is asked for, and arrives
   * once it is out.
   */
  released: boolean;
  /** All of it, in one household sentence. */
  said: string;
  /** The seasons asked for, none for a film. */
  seasons: number[];
  /** The id of the title asked for. */
  title: string;
}

/** What asking for a title came to. */
export type Became = "asked" | "waiting" | "on-its-way";

/**
 * What is left of a member's allowance once an ask is counted, for each kind a limit
 * holds them to.
 */
export interface LeftAfter {
  /** Films still to ask for, absent where nothing limits them. */
  films?: number | null;
  /** Seasons of television still to ask for, absent where nothing limits them. */
  television?: number | null;
}
