// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `dashboard` carries; `kinds/dashboard` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { HealthSummary, PanelArray_of_Downloader, PanelArray_of_Queue, PanelArray_of_Service, PanelArray_of_Transfer, PanelFrontDoorReport, PanelHouseholdReport, PanelStorage, PanelVpn, Stuck, Telemetry } from "./affected.js";
import type { Alert } from "../../shared/alert.js";
import type { ScheduledService } from "../../shared/run-health.js";

/** The envelope carrying `dashboard`. */
export interface DashboardEnvelope {
  api_version: number;
  data: Snapshot;
  host?: string | null;
  job?: string | null;
  kind: "dashboard";
}

/**
 * Everything the dashboard shows at one moment.
 *
 * Each source's panel is filled or marked unavailable on its own, so one dead
 * source degrades one region rather than the screen. The surface builds this from
 * what it gathered; the standing is read from the same facts so it cannot
 * disagree with the panels.
 */
export interface Snapshot {
  /**
   * What the operator has been told, newest first: what is owed them where a
   * channel is refusing, then what has already been said.
   */
  alerts: Alert[];
  /**
   * The one address to hand somebody who lives here.
   *
   * On the screen rather than only behind a question, because the operator who
   * needs it is not the one who thought to ask: they have just been asked "what
   * do I open?" by somebody in the next room. Built from the same reading as the
   * panels beside it, so the screen and `front-door` cannot name different doors.
   */
  door: PanelFrontDoorReport;
  /** Every download client the stack runs, and whether each is paused. */
  downloaders: PanelArray_of_Downloader;
  /**
   * The one-line health summary — the same computation every other surface
   * uses, so no two of them can grade the same stack differently.
   *
   * Always present, unlike the panels: a stack that could not be reached has a
   * summary, and it says `unknown`. An absent summary would leave the operator
   * to infer health from a blank space, which is the one reading this must never
   * be open to.
   */
  health: HealthSummary;
  /**
   * What the household has asked for that is not moving.
   *
   * On the screen rather than only behind a question, for the reason the door
   * beside it is: a request waiting on a decision or failed after one is waiting
   * on the operator, and an operator who has to think to ask is one who finds out
   * when somebody comes to complain.
   */
  household: PanelHouseholdReport;
  /** The per-service queues. */
  queue: PanelArray_of_Queue;
  /** Each run-and-exit service, with how its last run ended. */
  scheduled: ScheduledService[];
  /** Every service and what it is doing. */
  services: PanelArray_of_Service;
  /** The storage picture. */
  storage: PanelStorage;
  /**
   * What in the pipeline has stopped, worst first — assessed across the
   * download clients and the curators together, because the failure that matters
   * most is invisible inside either.
   */
  stuck: Stuck[];
  /** Whether the screen itself can be trusted to be current. */
  telemetry: Telemetry;
  /** The active transfers. */
  transfers: PanelArray_of_Transfer;
  /**
   * The VPN, or `None` where no VPN is configured and the panel is omitted
   * rather than shown permanently red.
   */
  vpn?: PanelVpn | null;
}
