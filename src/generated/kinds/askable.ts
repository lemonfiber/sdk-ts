// Generated from the lemonfiber contract. Do not edit.
// The `askable` envelope, and the shapes only `askable` carries.
// Regenerate with `npm run contract:generate`.

import type { TitleKind } from "../shared/askable__asked.js";
import type { MemberAsking } from "../shared/askable__dashboard__household.js";

/** One title a member's search found. */
export interface Askable {
  /** The id it is asked for by. */
  id: string;
  /** Whether it is a series or a film. */
  kind: TitleKind;
  /** Where it stands in the house. */
  stands: Stands;
  /** What it is called. */
  title: string;
  /** The year it came out, where that is known. */
  year?: number | null;
}

/** The envelope carrying `askable`. */
export interface AskableEnvelope {
  api_version: number;
  data: AskableReport;
  host?: string | null;
  job?: string | null;
  kind: "askable";
}

/** One page of what a member's search found, under their limits. */
export interface AskableReport {
  /** Whether what they ask for waits for whoever runs the house, as one sentence. */
  approval: string;
  /** What the member may ask for: what their period allows and has left of each kind. */
  asking: MemberAsking;
  /** The kinds of title the house can fetch now, which are the kinds searched. */
  kinds: TitleKind[];
  /** The member the search was made for, by the name they are known by. */
  member: string;
  /** Where the next page begins, absent on the last. */
  next?: string | null;
  /** The words searched for, trimmed. */
  term: string;
  /** The titles on this page, in the order they were found. */
  titles: Askable[];
}

/** Where a title a member's search found stands in the house. */
export type Stands = "here" | "partly-here" | "on-its-way" | "askable";
