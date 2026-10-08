// Generated from the lemonfiber contract. Do not edit.
// The `dashboard` envelope, and the shapes only `dashboard` carries.
// Regenerate with `npm run contract:generate`.

import type { Alert } from "../shared/alert__dashboard.js";
import type { ProblemSeverity } from "../shared/alert__dashboard__doctor__error__plugins.js";
import type { FrontDoorReport } from "../shared/dashboard__front-door.js";
import type { HouseholdReport } from "../shared/dashboard__household.js";
import type { Service } from "../shared/dashboard__lifecycle__status.js";

/** One thing that is wrong, as the expanded summary lists it. */
export interface Affected {
  /** The check that raised it. */
  check: string;
  /** What is also wrong because of this, counted with it rather than again. */
  downstream: string[];
  /**
   * How the service it is about exited, where it has and the engine said.
   *
   * The technical half of what happened, kept out of the summary so the plain
   * words lead, and here for whoever wants the code.
   */
  exit?: number | null;
  /**
   * What it costs the operator. The line expands to items an operator can act
   * on, and an item that states only the event leaves the judgement it was
   * supposed to save them.
   */
  meaning: string;
  /**
   * When the stack first saw it wrong since it last saw it right, in whole
   * seconds since the epoch.
   *
   * The condition's own stamp, kept between runs, so every surface that reports
   * the check names the same moment and a restart does not make an old fault new.
   */
  onset: string;
  /** What to do about it, most likely first. */
  remedies: string[];
  /** How bad it is. */
  severity: ProblemSeverity;
  /** What is wrong, in one line. */
  summary: string;
}

/** The envelope carrying `dashboard`. */
export interface DashboardEnvelope {
  api_version: number;
  data: Snapshot;
  host?: string | null;
  job?: string | null;
  kind: "dashboard";
}

/**
 * Which protocol a transfer is moving over, since the same download reads
 * differently on each — a Usenet download has no peers, a torrent has no server.
 */
export type DashboardProtocol = "usenet" | "torrent";

/**
 * A figure a source reports, kept apart from the two ways it can be missing.
 *
 * Zero is a value a source gave; stale is the last value a source that has since
 * gone quiet gave; unknown is a source that never answered at all. Collapsing any
 * two of them sends an operator after the wrong problem — a stalled download and
 * a dashboard that simply stopped polling look identical only if the code lets
 * them.
 */
export type DashboardReading = DashboardReadingKnown | DashboardReadingStale | DashboardReadingUnknown;

/**
 * The source answered this refresh with a value — which may legitimately be
 * zero.
 */
export interface DashboardReadingKnown {
  reading: "known";
  value: number;
}

/** The source did not answer this refresh; this is the last value it gave. */
export interface DashboardReadingStale {
  reading: "stale";
  value: number;
}

/** The source has never answered, so nothing can be said about it. */
export interface DashboardReadingUnknown {
  reading: "unknown";
}

export interface Duration {
  nanos: number;
  secs: number;
}

/**
 * Whether imports are hardlinking or copying — the difference between an import
 * that is free and one that doubles the disk it uses.
 */
export type Hardlink = "linking" | "copying" | "unknown";

/**
 * What the stack amounts to.
 *
 * Ordered from best to worst, so the worst of several is a `max` and there is no
 * second place to encode the ranking.
 */
export type HealthStanding = "healthy" | "stopped" | "unconfigured" | "advisory" | "degraded" | "broken" | "critical" | "unknown";

/** The one-line summary, and what it expands to. */
export interface HealthSummary {
  /**
   * Everything that is wrong, worst first, so the line expands to the affected
   * items and their remedies rather than to a number nobody can act on.
   */
  affected: Affected[];
  /** The one word. */
  standing: HealthStanding;
  /**
   * How many things are wrong — root causes, counted once each, so a disk that
   * filled and the nine imports that then failed is one thing and not ten.
   */
  wanting_attention: number;
  /**
   * The worst thing, named, so the line says something rather than only
   * grading. Absent where nothing is wrong.
   */
  worst?: string | null;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelArray_of_Queue = PanelArray_of_QueueReady | PanelArray_of_QueueUnavailable;

/** The source answered; here is the panel. */
export interface PanelArray_of_QueueReady {
  data: Queue[];
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelArray_of_QueueUnavailable {
  data: PanelArray_of_QueueUnavailableData;
  panel: "unavailable";
}

export interface PanelArray_of_QueueUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelArray_of_Service = PanelArray_of_ServiceReady | PanelArray_of_ServiceUnavailable;

/** The source answered; here is the panel. */
export interface PanelArray_of_ServiceReady {
  data: Service[];
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelArray_of_ServiceUnavailable {
  data: PanelArray_of_ServiceUnavailableData;
  panel: "unavailable";
}

export interface PanelArray_of_ServiceUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelArray_of_Transfer = PanelArray_of_TransferReady | PanelArray_of_TransferUnavailable;

/** The source answered; here is the panel. */
export interface PanelArray_of_TransferReady {
  data: Transfer[];
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelArray_of_TransferUnavailable {
  data: PanelArray_of_TransferUnavailableData;
  panel: "unavailable";
}

export interface PanelArray_of_TransferUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelFrontDoorReport = PanelFrontDoorReportReady | PanelFrontDoorReportUnavailable;

/** The source answered; here is the panel. */
export interface PanelFrontDoorReportReady {
  data: FrontDoorReport;
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelFrontDoorReportUnavailable {
  data: PanelFrontDoorReportUnavailableData;
  panel: "unavailable";
}

export interface PanelFrontDoorReportUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelHouseholdReport = PanelHouseholdReportReady | PanelHouseholdReportUnavailable;

/** The source answered; here is the panel. */
export interface PanelHouseholdReportReady {
  data: HouseholdReport;
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelHouseholdReportUnavailable {
  data: PanelHouseholdReportUnavailableData;
  panel: "unavailable";
}

export interface PanelHouseholdReportUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelStorage = PanelStorageReady | PanelStorageUnavailable;

/** The source answered; here is the panel. */
export interface PanelStorageReady {
  data: Storage;
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelStorageUnavailable {
  data: PanelStorageUnavailableData;
  panel: "unavailable";
}

export interface PanelStorageUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type PanelVpn = PanelVpnReady | PanelVpnUnavailable;

/** The source answered; here is the panel. */
export interface PanelVpnReady {
  data: Vpn;
  panel: "ready";
}

/** The source could not be reached, for this stated reason. */
export interface PanelVpnUnavailable {
  data: PanelVpnUnavailableData;
  panel: "unavailable";
}

export interface PanelVpnUnavailableData {
  /** Why the panel could not be filled, in the operator's terms. */
  reason: string;
}

/** One `*arr`'s queue, and how much of it is stuck. */
export interface Queue {
  /** How many items are queued. */
  depth: number;
  /** The service whose queue this is. */
  service: string;
  /** How many of them are stuck rather than progressing. */
  stuck: number;
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
  /** Every service and what it is doing. */
  services: PanelArray_of_Service;
  /** The storage picture. */
  storage: PanelStorage;
  /**
   * What in the pipeline has stopped, worst first — assessed across the
   * download clients and the \*arrs together, because the failure that matters
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

/**
 * Why an item is not moving.
 *
 * Ordered by how much of the operator's attention each deserves, worst first, so
 * a summary that leads with the worst category needs no second ranking.
 */
export type Stall = "redownload-loop" | "repeated-import-failure" | "completed-not-imported" | "orphaned" | "stalled-download" | "waiting-indefinitely" | "slow";

/** The storage picture: what is free, when it runs out, and whether imports link. */
export interface Storage {
  /**
   * The time until the disk fills at the current rate of the queue draining
   * onto it, or `None` where it is not projected to fill.
   */
  exhaustion?: Duration | null;
  /**
   * Bytes free on the data volume — a [`Reading`], since a volume that could
   * not be read this refresh must not render as zero free.
   */
  free: DashboardReading;
  /** Whether imports are linking or copying. */
  hardlink: Hardlink;
}

/** One thing that is wrong, and why. */
export interface Stuck {
  /**
   * What the service said was blocking it, in its own words, where it said
   * anything. A permission denial from an import log is worth more than any
   * interpretation of it, and it is the difference between "stuck" and
   * something an operator can fix.
   */
  blocking?: string | null;
  /**
   * How long it has been that way, in seconds — what turns "stuck" into a
   * sentence an operator can weigh.
   */
  held_for: number;
  /**
   * How many items this stands for. One in the ordinary case; more where they
   * share a cause and the cause is what is wrong — twenty downloads stopped by
   * a full disk are one thing to fix, and twenty alerts about it are how an
   * operator learns to mute the queue check.
   */
  items: number;
  /** Which item — or, where several share one cause, that cause. */
  name: string;
  /** What is wrong with it. */
  stall: Stall;
}

/**
 * How the screen itself is doing, which is a different question from how the
 * stack is doing.
 *
 * The stack's own verdict is [`crate::health::Standing`]; this is only whether the
 * picture can be trusted to be current. Kept apart because they disagree in both
 * directions: a healthy stack can be shown through half-failing telemetry, and a
 * perfectly refreshing screen can be reporting a stack that is on fire.
 */
export type Telemetry = "live" | "degraded" | "disconnected" | "no-stack" | "unconfigured";

/** One active download, as the dashboard shows it. */
export interface Transfer {
  /** The time left, or `None` where it is stalled and there is none to give. */
  eta?: Duration | null;
  /** What is being downloaded. */
  name: string;
  /** How far along, as a percentage from zero to a hundred. */
  progress: number;
  /** How it is being downloaded. */
  protocol: DashboardProtocol;
  /**
   * The current speed in bytes per second — a [`Reading`], because a genuine
   * zero (stalled) and a source that has gone quiet mean opposite things here,
   * and this is the very figure that difference is about.
   */
  speed: DashboardReading;
}

/** What the VPN is doing, and whether the download client is actually behind it. */
export interface Vpn {
  /** The country that address is in. */
  country: string;
  /**
   * Whether the download client's own egress address matches the tunnel's —
   * the one thing that proves traffic is genuinely leaving through it.
   */
  egress_matches: boolean;
  /** The tunnel's exit address as the outside world sees it. */
  exit_ip: string;
  /** The port the provider forwards, where forwarding is on. */
  forwarded_port?: number | null;
}
