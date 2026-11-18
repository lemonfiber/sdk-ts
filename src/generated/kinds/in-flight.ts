// Generated from the lemonfiber contract. Do not edit.
// The `in-flight` envelope, and the shapes only `in-flight` carries.
// Regenerate with `npm run contract:generate`.

import type { DashboardProtocol } from "../shared/dashboard-protocol.js";

/** The envelope carrying `in-flight`. */
export interface InFlightEnvelope {
  api_version: number;
  data: InFlightReport;
  host?: string | null;
  job?: string | null;
  kind: "in-flight";
}

/** What is still coming down inside the forms a teardown would stop. */
export interface InFlightReport {
  /** Each download still coming down, with how far it has got. */
  downloads: Unfinished[];
}

/**
 * One download a teardown would interrupt.
 *
 * Carries the protocol as well as the name, because "still downloading" is only
 * half of what an operator needs — the other half is which client to go and look in,
 * and a stack running both has two places it could be.
 */
export interface Unfinished {
  /** What it is, as the client names it. */
  name: string;
  /** How far along, from zero to a hundred. */
  progress: number;
  /** Which client has it. */
  protocol: DashboardProtocol;
}
