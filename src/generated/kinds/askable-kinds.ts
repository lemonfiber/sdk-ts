// Generated from the lemonfiber contract. Do not edit.
// The `askable-kinds` envelope, and the shapes only `askable-kinds` carries.
// Regenerate with `npm run contract:generate`.

import type { TitleKind, TitleUnit } from "../shared/askable__askable-kinds__asked.js";

/** One kind a member may ask for now, with the units it is asked for in. */
export interface AskableKind {
  /** The kind. */
  kind: TitleKind;
  /** The units a title of it is asked for in, none for series and films. */
  units: TitleUnit[];
}

/** The envelope carrying `askable-kinds`. */
export interface AskableKindsEnvelope {
  api_version: number;
  data: AskableKindsReport;
  host?: string | null;
  job?: string | null;
  kind: "askable-kinds";
}

/** Which kinds a member may ask for now. */
export interface AskableKindsReport {
  /** Each kind they may ask for now, series first. */
  kinds: AskableKind[];
  /** The member asked about, by the name they are known by. */
  member: string;
}
