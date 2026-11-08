// Generated from the lemonfiber contract. Do not edit.
// The `watcher` envelope, and the shapes only `watcher` carries.
// Regenerate with `npm run contract:generate`.

/** What a monitor lemonfiber provisions covers, which its tag names. */
export type Covers = CoversService | CoversEntryPoint | CoversJob;

/** A household-facing entry point, by the id of the service it is. */
export interface CoversEntryPoint {
  "entry-point": string;
}

/** A job the stack runs on a schedule, by its id. */
export interface CoversJob {
  job: string;
}

/** A service of the stack, by its id. */
export interface CoversService {
  service: string;
}

/** A heartbeat's interval and grace, and its last check-in. */
export interface Heartbeat {
  /** The seconds between the check-ins it expects. */
  every_s: number;
  /** The seconds past its interval it waits before it alarms. */
  grace_s: number;
  /** When it last checked in, in seconds since the Unix epoch, where it ever has. */
  last_check_in?: number | null;
}

/** How a monitor checks what it watches. */
export type MonitorKind = "http" | "keyword" | "port" | "ping" | "dns" | "docker" | "heartbeat";

/** What a monitor was asked to watch, what it watches instead, and why. */
export interface Unconfigured {
  /** What it was asked to watch. */
  wanted: string;
  /** What it watches. */
  watches: string;
  /** Why, in the stack's words. */
  why: string;
}

/** Which path an entry point's monitor watches. */
export type WatchPath = "household" | "internal";

/** What a monitor sees. */
export type WatchState = "up" | "down" | "pending" | "paused" | "expected-down" | "not-reporting";

/** One monitor, and what it covers where lemonfiber made it. */
export interface WatchedTarget {
  /** Whether it is checking, rather than only defined. */
  active: boolean;
  /**
   * What it covers, by the record of what lemonfiber provisioned; absent for a monitor
   * lemonfiber did not make.
   */
  covers?: Covers | null;
  /** A heartbeat's interval, grace and last check-in. */
  heartbeat?: Heartbeat | null;
  /** How it checks. */
  kind: MonitorKind;
  /** When it last took a reading, in seconds since the Unix epoch, where it ever has. */
  last_reading?: number | null;
  /** Its own name in the watcher. */
  name: string;
  /** Which path an entry point's monitor watches. */
  path?: WatchPath | null;
  /** Since when, in seconds since the Unix epoch. */
  since: number;
  /** What it sees. */
  state: WatchState;
  /**
   * What it was asked to watch and what it watches instead, where it does not watch
   * what it should.
   */
  unconfigured?: Unconfigured | null;
}

/** The envelope carrying `watcher`. */
export interface WatcherEnvelope {
  api_version: number;
  data: WatcherReport;
  host?: string | null;
  job?: string | null;
  kind: "watcher";
}

/**
 * Which part watches the stack from outside it, whether it answers, and what each of its
 * monitors sees beside what it covers.
 */
export interface WatcherReport {
  /** Every monitor it holds, the operator's and lemonfiber's. */
  monitors?: WatchedTarget[];
  /** Whether the watcher answers. False is coverage nobody can see, never all clear. */
  reachable: boolean;
  /** When it was asked, in seconds since the Unix epoch. */
  read_at: number;
  /** Every critical service and household entry point no active monitor covers. */
  uncovered?: Covers[];
  /** Why it does not answer, where it does not. */
  unreachable_because?: string | null;
  /** The plugin filling `status.watch`, where one does. */
  watcher?: string | null;
}
