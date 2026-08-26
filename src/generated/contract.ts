// Generated from the lemonfiber contract. Do not edit.
// Source: b837d173b77f0217217124f0116a45530fad5a63  ·  api_version 1
// Regenerate with `npm run contract:generate`.

/**
 * A panel's content, or the reason its source could not fill it.
 *
 * The difference between "this panel is up to date" and "this panel's source is
 * unreachable" is the whole of degrading honestly: an unavailable panel says so,
 * in its own words, rather than showing stale data as current or blank data as
 * zero — and the panels beside it stay live.
 */
export type Panel =
  | {
      data: Vpn;
      panel: "ready";
    }
  | {
      data: {
        /**
         * Why the panel could not be filled, in the operator's terms.
         */
        reason: string;
      };
      panel: "unavailable";
    };
/**
 * Where one request stands, in the words the person who made it would use.
 *
 * Deliberately coarser than a [`crate::trace::Stage`]: a member does not need to know
 * that a release was grabbed but not imported, only that it is on its way. The trace is
 * where that detail stays, and a request names the item so it can be asked for.
 */
export type HouseholdState =
  "waiting-for-approval" | "declined" | "failed" | "getting" | "partly-here" | "here" | "gone";
/**
 * What a whole set of services amounts to.
 */
export type Condition = "inactive" | "degraded" | "partial" | "active";
/**
 * What became of asking one service to re-search its existing content.
 */
export type Triggered =
  | {
      state: "started";
    }
  | {
      state: "not-started";
    }
  | {
      /**
       * The service's own account of why.
       */
      detail: string;
      state: "failed";
    };
/**
 * One thing to do next.
 */
export type Next = "more-content" | "household" | "client-apps";
/**
 * What the import did with the finished download — the difference between one copy of a
 * file and two.
 */
export type Link = "hardlinked" | "copied";
/**
 * What proving a credential against its live service established — never the
 * input, only the outcome.
 *
 * Read back as well as built. A surface that is not in this process asks setup to
 * prove a credential and is told what came of it, so the four outcomes are tagged
 * by name rather than distinguished by which field is present — the same reason an
 * answer carries the step it belongs to.
 */
export type Validation =
  | {
      /**
       * The observed fact — what the service did, not that it merely answered.
       */
      observed: string;
      outcome: "valid";
    }
  | {
      /**
       * What the service said, in terms the operator can act on.
       */
      detail: string;
      outcome: "rejected";
    }
  | {
      /**
       * Why nothing usable came back.
       */
      detail: string;
      outcome: "unreachable";
    }
  | {
      /**
       * What it can no longer do, and why where the service says.
       */
      detail: string;
      outcome: "degraded";
    };
/**
 * A step of setup, in the order the operator meets it.
 *
 * Some steps only inform (they detect and state, and the operator acknowledges);
 * others ask a question whose answer the wizard records. The apply-and-onward
 * steps — writing config, pulling images, wiring services — are not modelled
 * here yet: they arrive with the features they drive, and this machine covers
 * the read-only phase that precedes them.
 */
export type WizardStep =
  | "welcome"
  | "preflight"
  | "prerequisites"
  | "protocols"
  | "vpn"
  | "data-location"
  | "credentials"
  | "provider"
  | "service-user"
  | "library"
  | "household"
  | "notifications"
  | "autostart"
  | "review";

export interface Contract {
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  archives: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Listing;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  backup: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: BackupReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  bundle: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Bundle;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  config: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: ConfigReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  dashboard: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: DashboardSnapshot;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  doctor: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: DoctorDoctorReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  error: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: ErrorProblem;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  forms: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: FormsReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  glossary: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Vocabulary;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  household: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: HouseholdHouseholdReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  job: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Started;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  lifecycle: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: LifecycleLifecycleReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  log: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: LogLine;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  music: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: MusicReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  preview: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: PreviewPlan;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  pull: {
    /**
     * The output contract's version.
     */
    api_version: number;
    /**
     * The payload.
     */
    data: string;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  quality: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: QualityReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  repair: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: RepairReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  reset: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: ResetReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  restore: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: RestoreRestoration;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  seed: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: SeedReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  setup: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: SetupReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  start: {
    /**
     * The output contract's version.
     */
    api_version: number;
    /**
     * The payload.
     */
    data: string;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  status: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: StatusStatusReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  step: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: StepLine;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  stuck: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: StuckReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  trace: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: TraceTraceReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  undo: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Reversal;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  upgrade: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: UpgradeReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  version: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: VersionReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  walkthrough: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: WalkthroughWalkthroughReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  watch: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: SupervisionReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  wizard: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: WizardWizardReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  word: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Term1;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
}
/**
 * The payload.
 */
export interface Listing {
  /**
   * Each one by the name it was written under, newest first.
   *
   * The name is the whole of what another surface needs: it is what a restore
   * asks for, and it carries the moment the archive was taken and what it
   * covers, because that is how a capture names one.
   */
  archives: string[];
}
/**
 * The payload.
 */
export interface BackupReport {
  /**
   * Where the archive was written.
   */
  path: string;
  /**
   * The older backups retention pruned, oldest first.
   */
  pruned: string[];
  /**
   * What the backup covers.
   */
  scope:
    | {
        scope: "whole_stack";
      }
    | {
        /**
         * The service whose configuration this covers.
         */
        name: string;
        scope: "service";
      };
  /**
   * Whether it carries credentials, and so must be handled as sensitive.
   */
  sensitive: boolean;
}
/**
 * The payload.
 */
export interface Bundle {
  /**
   * How large the file is, or would be.
   */
  bytes: number;
  contents: Contents;
  /**
   * Where it was written, or nothing where a run that writes nothing described it.
   */
  path?: string | null;
}
/**
 * Everything it holds, gathered, redacted and read back.
 */
export interface Contents {
  /**
   * What could not be collected, named.
   *
   * Named rather than passed over: a bundle from a machine whose diagnostics will not
   * run is exactly the bundle worth having, and a gap nobody mentions reads as an
   * absence of trouble rather than as an absence of information.
   */
  missing: string[];
  /**
   * The files, in the order a reader would want them.
   */
  pieces: Piece[];
  taken: Taken;
  terms: Terms;
}
/**
 * One file inside a bundle: the name it will carry, and what it holds.
 *
 * Held in memory rather than written as it is gathered, because everything is read back
 * before anything is written. A bundle that had already put one file on disk when it
 * found a credential in the next would have to be unwritten, and unwriting is the kind of
 * thing that half-works.
 */
export interface Piece {
  /**
   * What it holds, already redacted.
   */
  body: string;
  /**
   * What it is called inside the bundle.
   */
  name: string;
}
/**
 * Where and when it came from.
 */
export interface Taken {
  /**
   * When, as a service writes a moment.
   */
  at: string;
  /**
   * The lemonfiber that wrote it.
   */
  lemonfiber: string;
  /**
   * The stack it was written from.
   */
  stack: string;
}
/**
 * How it was made, and what its operator chose.
 */
export interface Terms {
  /**
   * Whether media filenames were shown.
   */
  filenames: boolean;
  /**
   * The settings the operator asked to have shown as they are.
   */
  revealed: string[];
  /**
   * How much of the logs was taken, said as it would be said aloud.
   */
  window: string;
}
/**
 * The payload.
 */
export interface ConfigReport {
  /**
   * Whether this command changed, or would change, a setting.
   */
  changed: boolean;
  /**
   * What this change costs, where making it decided something with a
   * consequence — turning port forwarding off, or moving to a provider while it
   * is off. Absent for every other change, and for a rehearsal, which decided
   * nothing.
   */
  consequence?: string | null;
  /**
   * Whether this was a rehearsal, so a change that `changed` reports was one
   * that *would* be made rather than one that was.
   */
  rehearsed: boolean;
  /**
   * The settings asked about — one for a lookup, all of them for a listing.
   */
  settings: SettingReport[];
}
/**
 * One setting, as it is safe to show.
 */
export interface SettingReport {
  /**
   * The setting's name.
   */
  key: string;
  /**
   * Whether the value was withheld.
   */
  secret: boolean;
  /**
   * Its value, or a note that it is set and withheld.
   */
  value: string;
}
/**
 * The payload.
 */
export interface DashboardSnapshot {
  /**
   * What the operator has been told, newest first: what is owed them where a
   * channel is refusing, then what has already been said.
   */
  alerts: DashboardAlert[];
  health: DashboardSummary;
  /**
   * The per-service queues.
   */
  queue:
    | {
        data: Queue[];
        panel: "ready";
      }
    | {
        data: {
          /**
           * Why the panel could not be filled, in the operator's terms.
           */
          reason: string;
        };
        panel: "unavailable";
      };
  /**
   * Every service and what it is doing.
   */
  services:
    | {
        data: DashboardService[];
        panel: "ready";
      }
    | {
        data: {
          /**
           * Why the panel could not be filled, in the operator's terms.
           */
          reason: string;
        };
        panel: "unavailable";
      };
  /**
   * The storage picture.
   */
  storage:
    | {
        data: Storage;
        panel: "ready";
      }
    | {
        data: {
          /**
           * Why the panel could not be filled, in the operator's terms.
           */
          reason: string;
        };
        panel: "unavailable";
      };
  /**
   * What in the pipeline has stopped, worst first — assessed across the
   * download clients and the \*arrs together, because the failure that matters
   * most is invisible inside either.
   */
  stuck: Stuck[];
  /**
   * Whether the screen itself can be trusted to be current.
   */
  telemetry: "live" | "degraded" | "disconnected" | "no-stack" | "unconfigured";
  /**
   * The active transfers.
   */
  transfers:
    | {
        data: DashboardTransfer[];
        panel: "ready";
      }
    | {
        data: {
          /**
           * Why the panel could not be filled, in the operator's terms.
           */
          reason: string;
        };
        panel: "unavailable";
      };
  /**
   * The VPN, or `None` where no VPN is configured and the panel is omitted
   * rather than shown permanently red.
   */
  vpn?: Panel | null;
}
/**
 * One interruption: what happened, which way, and how much it matters.
 */
export interface DashboardAlert {
  /**
   * Every check this alert speaks for, the first being [`Self::check`]. More
   * than one where the same event was grouped across several services.
   */
  affected: string[];
  /**
   * The check this came from, so an alert and its condition cannot drift apart.
   * Where several were grouped, the first of them.
   */
  check: string;
  /**
   * What kind of event it is, shared by every instance of it.
   */
  kind: string;
  /**
   * Which way it went.
   */
  moment: "onset" | "resolved";
  /**
   * What to do about it, most likely first. An alert that says what happened
   * and not what to do is a notification, which is a different and worse thing.
   */
  remedies: string[];
  /**
   * How much it matters. A resolution takes the severity of what resolved,
   * because "the critical thing is over" is itself worth the attention the
   * critical thing had.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * What happened, in the words the condition was raised with.
   */
  summary: string;
}
/**
 * The one-line health summary — the same computation every other surface
 * uses, so no two of them can grade the same stack differently.
 *
 * Always present, unlike the panels: a stack that could not be reached has a
 * summary, and it says `unknown`. An absent summary would leave the operator
 * to infer health from a blank space, which is the one reading this must never
 * be open to.
 */
export interface DashboardSummary {
  /**
   * Everything that is wrong, worst first, so the line expands to the affected
   * items and their remedies rather than to a number nobody can act on.
   */
  affected: DashboardAffected[];
  /**
   * The one word.
   */
  standing: "healthy" | "stopped" | "unconfigured" | "advisory" | "degraded" | "broken" | "critical" | "unknown";
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
 * One thing that is wrong, as the expanded summary lists it.
 */
export interface DashboardAffected {
  /**
   * The check that raised it.
   */
  check: string;
  /**
   * What is also wrong because of this, counted with it rather than again.
   */
  downstream: string[];
  /**
   * What to do about it, most likely first.
   */
  remedies: string[];
  /**
   * How bad it is.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * What is wrong, in one line.
   */
  summary: string;
}
/**
 * One `*arr`'s queue, and how much of it is stuck.
 */
export interface Queue {
  /**
   * How many items are queued.
   */
  depth: number;
  /**
   * The service whose queue this is.
   */
  service: string;
  /**
   * How many of them are stuck rather than progressing.
   */
  stuck: number;
}
/**
 * One service, as it stands.
 */
export interface DashboardService {
  /**
   * How much its absence costs, so a summary can weigh it.
   */
  criticality: "critical" | "core" | "important" | "enhancing" | "optional";
  /**
   * The services it needs before it can work, as the manifest declares them.
   * Carried so a failure can be attributed to the thing underneath it rather
   * than counted as one more independent thing wrong.
   */
  depends_on: string[];
  /**
   * How it exited, where it has exited.
   */
  exit?: number | null;
  /**
   * The service's identifier, which is also its Compose service name.
   */
  id: string;
  /**
   * What it is called in front of an operator.
   */
  name: string;
  /**
   * The profile that declared it.
   */
  profile: string;
  /**
   * What it is doing.
   */
  state:
    | "failed"
    | "crash-looping"
    | "unhealthy"
    | "absent"
    | "stopped"
    | "starting"
    | "running"
    | "healthy"
    | "host-managed";
}
/**
 * The storage picture: what is free, when it runs out, and whether imports link.
 */
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
  free:
    | {
        reading: "known";
        value: number;
      }
    | {
        reading: "stale";
        value: number;
      }
    | {
        reading: "unknown";
      };
  /**
   * Whether imports are linking or copying.
   */
  hardlink: "linking" | "copying" | "unknown";
}
export interface Duration {
  nanos: number;
  secs: number;
}
/**
 * One thing that is wrong, and why.
 */
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
  /**
   * Which item — or, where several share one cause, that cause.
   */
  name: string;
  /**
   * What is wrong with it.
   */
  stall:
    | "redownload-loop"
    | "repeated-import-failure"
    | "completed-not-imported"
    | "orphaned"
    | "stalled-download"
    | "waiting-indefinitely"
    | "slow";
}
/**
 * One active download, as the dashboard shows it.
 */
export interface DashboardTransfer {
  /**
   * The time left, or `None` where it is stalled and there is none to give.
   */
  eta?: Duration | null;
  /**
   * What is being downloaded.
   */
  name: string;
  /**
   * How far along, as a percentage from zero to a hundred.
   */
  progress: number;
  /**
   * How it is being downloaded.
   */
  protocol: "usenet" | "torrent";
  /**
   * The current speed in bytes per second — a [`Reading`], because a genuine
   * zero (stalled) and a source that has gone quiet mean opposite things here,
   * and this is the very figure that difference is about.
   */
  speed:
    | {
        reading: "known";
        value: number;
      }
    | {
        reading: "stale";
        value: number;
      }
    | {
        reading: "unknown";
      };
}
/**
 * What the VPN is doing, and whether the download client is actually behind it.
 */
export interface Vpn {
  /**
   * The country that address is in.
   */
  country: string;
  /**
   * Whether the download client's own egress address matches the tunnel's —
   * the one thing that proves traffic is genuinely leaving through it.
   */
  egress_matches: boolean;
  /**
   * The tunnel's exit address as the outside world sees it.
   */
  exit_ip: string;
  /**
   * The port the provider forwards, where forwarding is on.
   */
  forwarded_port?: number | null;
}
/**
 * The payload.
 */
export interface DoctorDoctorReport {
  /**
   * Each finding, in the order the checks produced them.
   */
  findings: DoctorFinding[];
  /**
   * What the findings amount to, as one word.
   */
  overall: "healthy" | "degraded" | "broken" | "unknown";
}
/**
 * One thing a check established, and how it turned out.
 */
export interface DoctorFinding {
  /**
   * The family this belongs to.
   */
  category:
    "environment" | "storage" | "network" | "vpn" | "credentials" | "services" | "providers" | "queue" | "config";
  /**
   * The check whose finding explains this one, where another does.
   *
   * Set after the run rather than by the check itself: a check is independent
   * by construction and cannot see what any other found, which is a property
   * worth keeping.
   */
  caused_by?: string | null;
  /**
   * A stable identifier for the thing checked, such as `vpn.egress-match`.
   */
  check: string;
  /**
   * What the service said for itself, lately.
   *
   * Carried on the finding rather than left for the operator to go and fetch,
   * because the explanation is almost always in it: a check can say a service is
   * not answering, and only the service can say why. Absent where the finding is
   * not about a service, where the service is fine, or where the engine would not
   * say — an empty section would be a promise of evidence that is not there.
   *
   * Set after the run, like [`Self::caused_by`], since reading a service's output
   * is not the check's own business and a check that did it would be doing two
   * things.
   */
  said?: string | null;
  /**
   * The service this is about, where it is about one.
   *
   * Absent for the checks that are about the machine rather than about
   * something running on it — the environment, the filesystem, the operator's
   * own choices. Carried so that one service's trouble can be attributed to
   * the service underneath it rather than counted as one more independent
   * thing wrong.
   */
  service?: string | null;
  /**
   * The one-line summary of what was checked.
   */
  title: string;
  /**
   * How it turned out.
   */
  verdict:
    | {
        /**
         * What was observed, where stating it helps — an address, a port.
         */
        note?: string | null;
        outcome: "pass";
      }
    | {
        /**
         * The problem that produced this one, where several share a root.
         */
        cause?: DoctorProblem | null;
        /**
         * The stable identifier for this kind of problem.
         */
        code: string;
        /**
         * The underlying technical detail, available but never leading.
         */
        detail?: string | null;
        /**
         * What it means for the operator.
         */
        meaning: string;
        outcome: "warn";
        /**
         * What to do, most likely first.
         */
        remedies: Remedy[];
        /**
         * How much it matters.
         */
        severity: "advisory" | "warning" | "error" | "critical";
        /**
         * Where it stands with respect to being fixed.
         */
        state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
        /**
         * What happened, in one plain sentence.
         */
        summary: string;
      }
    | {
        /**
         * The problem that produced this one, where several share a root.
         */
        cause?: DoctorProblem | null;
        /**
         * The stable identifier for this kind of problem.
         */
        code: string;
        /**
         * The underlying technical detail, available but never leading.
         */
        detail?: string | null;
        /**
         * What it means for the operator.
         */
        meaning: string;
        outcome: "fail";
        /**
         * What to do, most likely first.
         */
        remedies: Remedy[];
        /**
         * How much it matters.
         */
        severity: "advisory" | "warning" | "error" | "critical";
        /**
         * Where it stands with respect to being fixed.
         */
        state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
        /**
         * What happened, in one plain sentence.
         */
        summary: string;
      }
    | {
        outcome: "unverified";
        /**
         * Why it could not be determined.
         */
        reason: string;
        remedy: Remedy1;
      }
    | {
        outcome: "skipped";
        /**
         * Why the check did not apply.
         */
        reason: string;
      };
}
/**
 * Something that went wrong, in the form an operator can act on.
 */
export interface DoctorProblem {
  /**
   * The problem that produced this one, where several share a root.
   */
  cause?: DoctorProblem | null;
  /**
   * The stable identifier for this kind of problem.
   */
  code: string;
  /**
   * The underlying technical detail, available but never leading.
   */
  detail?: string | null;
  /**
   * What it means for the operator.
   */
  meaning: string;
  /**
   * What to do, most likely first.
   */
  remedies: Remedy[];
  /**
   * How much it matters.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * Where it stands with respect to being fixed.
   */
  state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
  /**
   * What happened, in one plain sentence.
   */
  summary: string;
}
/**
 * One thing the operator can do about a problem.
 */
export interface Remedy {
  /**
   * The action, phrased as something to do rather than something to know.
   */
  action: string;
  /**
   * Where to look, when that helps.
   */
  detail?: string | null;
}
/**
 * One thing the operator can do about a problem.
 */
export interface Remedy1 {
  /**
   * The action, phrased as something to do rather than something to know.
   */
  action: string;
  /**
   * Where to look, when that helps.
   */
  detail?: string | null;
}
/**
 * The payload.
 */
export interface ErrorProblem {
  /**
   * The problem that produced this one, where several share a root.
   */
  cause?: ErrorProblem1 | null;
  /**
   * The stable identifier for this kind of problem.
   */
  code: string;
  /**
   * The underlying technical detail, available but never leading.
   */
  detail?: string | null;
  /**
   * What it means for the operator.
   */
  meaning: string;
  /**
   * What to do, most likely first.
   */
  remedies: Remedy[];
  /**
   * How much it matters.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * Where it stands with respect to being fixed.
   */
  state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
  /**
   * What happened, in one plain sentence.
   */
  summary: string;
}
/**
 * Something that went wrong, in the form an operator can act on.
 */
export interface ErrorProblem1 {
  /**
   * The problem that produced this one, where several share a root.
   */
  cause?: ErrorProblem1 | null;
  /**
   * The stable identifier for this kind of problem.
   */
  code: string;
  /**
   * The underlying technical detail, available but never leading.
   */
  detail?: string | null;
  /**
   * What it means for the operator.
   */
  meaning: string;
  /**
   * What to do, most likely first.
   */
  remedies: Remedy[];
  /**
   * How much it matters.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * Where it stands with respect to being fixed.
   */
  state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
  /**
   * What happened, in one plain sentence.
   */
  summary: string;
}
/**
 * The payload.
 */
export interface FormsReport {
  /**
   * The forms, in the order the stack declares them.
   */
  forms: FormReport[];
}
/**
 * One form the stack declares, as a listing shows it.
 *
 * The manifest's own words rather than lemonfiber's: forms come from the stack, so a
 * stack of somebody's own names and describes them however it likes, and a listing that
 * paraphrased would be describing a different stack from the one being run.
 */
export interface FormReport {
  /**
   * Whether it can be started alongside another form.
   *
   * Worth saying in the listing rather than only when a combination is refused: an
   * operator choosing between two forms is exactly who needs to know they are a choice.
   */
  composable: boolean;
  /**
   * What it is for, in one line.
   */
  description: string;
  /**
   * What to type to start it.
   */
  id: string;
  /**
   * What it is called.
   */
  name: string;
}
/**
 * The payload.
 */
export interface Vocabulary {
  /**
   * The words, in the order somebody meets them.
   */
  words: Term[];
}
/**
 * A word this product uses, and what somebody meeting it needs to know.
 */
export interface Term {
  /**
   * What other services in this stack call the same thing.
   *
   * Sonarr and `SABnzbd` do not agree on words, and an operator moving between
   * their screens should not have to work out that two of them are one.
   */
  also_called: string[];
  /**
   * More, for somebody who asks — never needed in order to act.
   */
  deep?: string | null;
  /**
   * One sentence: what it is for and what it costs or gains.
   *
   * Enough to act on. Somebody who reads only this should not be stuck.
   */
  short: string;
  /**
   * The word as it appears in the interface.
   */
  word: string;
}
/**
 * The payload.
 */
export interface HouseholdHouseholdReport {
  /**
   * Whether the requests were read at all. A false here is why the list is empty, and
   * keeps an unread record from being mistaken for a household that has asked for
   * nothing — the same honesty a trace keeps about a silence it did not hear.
   */
  available: boolean;
  /**
   * What could not be read, and anything else worth the operator's attention.
   */
  findings: string[];
  /**
   * The members who have asked for something, in name order.
   */
  members: HouseholdHouseholdMember[];
}
/**
 * One household member and everything they have asked for.
 */
export interface HouseholdHouseholdMember {
  /**
   * The member, by the name the request service shows them under.
   */
  name: string;
  /**
   * What they asked for, newest first.
   */
  requests: HouseholdMemberRequest[];
}
/**
 * One thing a household member asked for, and where it stands in their words.
 */
export interface HouseholdMemberRequest {
  /**
   * What kind of thing it is — a series, a film — in the household's own words.
   * Absent where the request service names a kind this build does not know.
   */
  media?: string | null;
  /**
   * Where the request stands, or absent where the request service reports a status
   * this build does not know rather than guessing it into the nearest word.
   */
  state?: HouseholdState | null;
  /**
   * What it is called, where the service filing it has been told about it and its
   * library could be read. Absent for a request no service holds yet — one still
   * awaiting approval has been handed to nobody, so there is no title to find.
   */
  title?: string | null;
}
/**
 * The payload.
 */
export interface Started {
  /**
   * The action that was asked for, as it was named.
   */
  action: string;
  /**
   * The name to ask what became of this work by.
   */
  job: string;
}
/**
 * The payload.
 */
export interface LifecycleLifecycleReport {
  /**
   * The Compose subcommand that was run.
   */
  action: string;
  /**
   * The exact command, so what happened is never a matter of trust.
   */
  command: string[];
  /**
   * What those services amount to, as one word.
   */
  condition?: Condition | null;
  /**
   * What starting the stack did about the VPN's forwarded port, where it did
   * anything. Absent in the ordinary case — the client was already on it, or
   * there is no tunnel to forward through — and a sentence where the client was
   * moved, or could not be.
   */
  forwarding?: string | null;
  plan: LifecyclePlan;
  /**
   * Whether this was a rehearsal.
   */
  rehearsed: boolean;
  /**
   * What each service ended up doing, where the action waited to find out.
   *
   * Empty for actions that do not wait. Stopping is finished when Compose
   * says it is, and surveying afterwards would only report the absence it
   * was asked to produce.
   */
  services: LifecycleService[];
  /**
   * Stack files the operator has edited, left as they set them rather than
   * overwritten with lemonfiber's own. Empty in the ordinary case; a named entry
   * warns that an upgrade would change a file they changed, and shows the diff.
   */
  stack_edits: StackEdit[];
  /**
   * The exit status, absent for a rehearsal or a signalled process.
   */
  status?: number | null;
  /**
   * What narrowing moved, where the command was a switch. Absent for every
   * other action, which is what tells a reader that nothing was left running
   * on purpose.
   */
  switched?: Switched | null;
}
/**
 * What the named forms came to: the profiles, the services they hold, and
 * what the configuration left out.
 *
 * The resolved plan itself rather than a copy of its parts, because it is
 * stated to the operator before the command runs and read out of the
 * report afterwards — two accounts of one run, and a second shape for it
 * would be a way for them to differ.
 */
export interface LifecyclePlan {
  /**
   * Profiles the closure asked for that the configuration does not support.
   */
  dropped: LifecycleDropped[];
  /**
   * The forms the operator named, in the order they named them.
   */
  forms: string[];
  /**
   * The profiles to activate, sorted so the command is reproducible.
   */
  profiles: string[];
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
/**
 * A profile left out of a closure, and what it would have needed.
 *
 * The provider travels with the profile because a name on its own sends the
 * operator looking for a fault. What they have is a stack not configured for
 * one of the two ways of downloading, which is a sentence rather than a word.
 */
export interface LifecycleDropped {
  /**
   * The provider it cannot run without.
   */
  needs: "usenet" | "torrent";
  /**
   * The profile that will not run.
   */
  profile: string;
}
/**
 * One service, as it stands.
 */
export interface LifecycleService {
  /**
   * How much its absence costs, so a summary can weigh it.
   */
  criticality: "critical" | "core" | "important" | "enhancing" | "optional";
  /**
   * The services it needs before it can work, as the manifest declares them.
   * Carried so a failure can be attributed to the thing underneath it rather
   * than counted as one more independent thing wrong.
   */
  depends_on: string[];
  /**
   * How it exited, where it has exited.
   */
  exit?: number | null;
  /**
   * The service's identifier, which is also its Compose service name.
   */
  id: string;
  /**
   * What it is called in front of an operator.
   */
  name: string;
  /**
   * The profile that declared it.
   */
  profile: string;
  /**
   * What it is doing.
   */
  state:
    | "failed"
    | "crash-looping"
    | "unhealthy"
    | "absent"
    | "stopped"
    | "starting"
    | "running"
    | "healthy"
    | "host-managed";
}
/**
 * A stack file the operator edited, preserved rather than overwritten, with the
 * change an upgrade would make shown against it.
 */
export interface StackEdit {
  /**
   * The lines that differ between the operator's file and what lemonfiber would
   * write — theirs marked `-`, lemonfiber's `+`, the matching head and tail left
   * out. Empty where the two differ only in ways `lines` does not see.
   */
  diff: string;
  /**
   * The file's path within the stack directory.
   */
  path: string;
}
/**
 * What narrowing the active set moved.
 *
 * Three lists rather than a before and an after, because the operator's question
 * is not "what is running now" — they can ask that — but "what did that do". The
 * middle list is the one that makes the verb worth having: it is the promise that
 * a download in flight was not interrupted to change the shape of the stack
 * around it.
 */
export interface Switched {
  /**
   * Left running: the new closure holds them too, so nothing here asked them to
   * stop. Not a promise that nothing touched them — Compose recreates a container
   * whose configuration changed — but a promise that narrowing did not.
   */
  kept: string[];
  /**
   * Started, because the new closure holds them and they were not up.
   */
  started: string[];
  /**
   * The exact Compose invocation that stopped what fell outside, so a switch is
   * no more a matter of trust than any other action. Absent where nothing had
   * to stop.
   */
  stop_command?: string[] | null;
  /**
   * Stopped, because the new closure does not hold them.
   */
  stopped: string[];
}
/**
 * The payload.
 */
export interface LogLine {
  /**
   * When the container itself says it wrote the line, where it said so.
   *
   * Kept verbatim and unparsed. Containers disagree with the host clock and
   * with each other, and the only defensible ordering is each container's own
   * account of itself — which a reader can only apply if it is carried
   * rather than replaced by an arrival time.
   */
  at?: string | null;
  /**
   * The line, without its trailing newline.
   */
  line: string;
  /**
   * The Compose service it came from.
   */
  service: string;
  /**
   * Which stream it arrived on.
   */
  stream: "stdout" | "stderr";
}
/**
 * The payload.
 */
export interface MusicReport {
  choice: MusicChoice;
  /**
   * Whether the choice was recorded, or only rehearsed.
   */
  disposition: "shown" | "recorded" | "rehearsed" | "held" | "reapplied" | "would-reapply";
  /**
   * What became of applying it to the music service, or `None` for a rehearsal
   * that applied nothing.
   */
  outcome?: Triggered | null;
}
/**
 * The format chosen, what it means, and what it costs.
 */
export interface MusicChoice {
  /**
   * The format's plain-language name.
   */
  format: string;
  /**
   * What it means, in the operator's terms.
   */
  means: string;
  /**
   * The practical caveat worth knowing — playing it, or finding it.
   */
  note: string;
  /**
   * What this applies to — `music`.
   */
  scope: string;
  /**
   * Roughly how much disk an hour of it takes.
   */
  size_per_hour: string;
  /**
   * The audio format it targets, in plain terms.
   */
  targets: string;
}
/**
 * The payload.
 */
export interface PreviewPlan {
  /**
   * Profiles the closure asked for that the configuration does not support.
   */
  dropped: PreviewDropped[];
  /**
   * The forms the operator named, in the order they named them.
   */
  forms: string[];
  /**
   * The profiles to activate, sorted so the command is reproducible.
   */
  profiles: string[];
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
/**
 * A profile left out of a closure, and what it would have needed.
 *
 * The provider travels with the profile because a name on its own sends the
 * operator looking for a fault. What they have is a stack not configured for
 * one of the two ways of downloading, which is a sentence rather than a word.
 */
export interface PreviewDropped {
  /**
   * The provider it cannot run without.
   */
  needs: "usenet" | "torrent";
  /**
   * The profile that will not run.
   */
  profile: string;
}
/**
 * The payload.
 */
export interface QualityReport {
  /**
   * The global choice first, then each media type set apart from it.
   */
  choices: PresetChoice[];
  /**
   * Whether the Recyclarr config has been hand-edited since lemonfiber wrote it —
   * the `customised` state, in which the preset is no longer authoritative until
   * it is deliberately re-asserted. For a reapply, whether an edit was overwritten.
   */
  customised: boolean;
  /**
   * What became of the choice.
   */
  disposition: "shown" | "recorded" | "rehearsed" | "held" | "reapplied" | "would-reapply";
  /**
   * The audio-format choice for music, where one is set — media that has no
   * resolution, so it is reported apart from the resolution presets rather than
   * forced into their shape.
   */
  music?: MusicChoice1 | null;
}
/**
 * One preset in force, and what it means for the media it applies to — the
 * operator's question answered in their own terms, with no scoring vocabulary.
 */
export interface PresetChoice {
  /**
   * What it means, in the operator's terms rather than the tool's.
   */
  means: string;
  /**
   * Whether this host would have to transcode it in software — the caution
   * stated before a choice a household cannot smoothly play.
   */
  needs_transcoding_here: boolean;
  /**
   * The preset's plain-language name.
   */
  preset: string;
  /**
   * The resolution and encode it targets.
   */
  resolution: string;
  /**
   * What this applies to: `everything`, or a specific media type.
   */
  scope: string;
  /**
   * Roughly how much disk an hour of it takes.
   */
  size_per_hour: string;
  /**
   * What playback costs, in plain terms.
   */
  transcoding: string;
}
/**
 * One audio-format choice in force, for media that has no resolution — the same
 * question as a [`PresetChoice`], answered in format terms rather than resolution.
 */
export interface MusicChoice1 {
  /**
   * The format's plain-language name.
   */
  format: string;
  /**
   * What it means, in the operator's terms.
   */
  means: string;
  /**
   * The practical caveat worth knowing — playing it, or finding it.
   */
  note: string;
  /**
   * What this applies to — `music`.
   */
  scope: string;
  /**
   * Roughly how much disk an hour of it takes.
   */
  size_per_hour: string;
  /**
   * The audio format it targets, in plain terms.
   */
  targets: string;
}
/**
 * The payload.
 */
export interface RepairReport {
  /**
   * Whether this run was allowed to act at all.
   */
  acted: boolean;
  /**
   * What this offer is, so consent given for it can name which offer it read.
   *
   * Carried on every report rather than only on the ones that offer something: a
   * surface that has to look for it is a surface that can fail to find it, and an
   * offer of nothing is still an offer somebody may agree to nothing of.
   */
  agreement: string;
  /**
   * What has been tried too often to keep offering.
   *
   * Said rather than passed over. A repair that quietly stopped being offered leaves
   * the operator watching a fault nobody mentions any more, which is worse than being
   * told plainly that this is past what lemonfiber can work out.
   */
  beyond: Beyond[];
  /**
   * What was carried out, in the order it was.
   */
  mended: RepairMended[];
  /**
   * What could be put right, whether or not it was.
   */
  offered: Repair1[];
}
/**
 * A repair that has run out of chances, and where to go instead.
 */
export interface Beyond {
  /**
   * The check whose fault has outlasted every attempt at it.
   */
  check: string;
  remedy: Remedy2;
}
/**
 * One thing the operator can do about a problem.
 */
export interface Remedy2 {
  /**
   * The action, phrased as something to do rather than something to know.
   */
  action: string;
  /**
   * Where to look, when that helps.
   */
  detail?: string | null;
}
/**
 * One repair, and what became of it.
 */
export interface RepairMended {
  /**
   * How it turned out, once the check was asked again.
   */
  outcome:
    | {
        outcome: "fixed";
      }
    | {
        outcome: "fix_failed";
      }
    | {
        /**
         * What the machine is now in, said plainly.
         */
        leaving: string;
        outcome: "stopped";
      }
    | {
        outcome: "declined";
      }
    | {
        outcome: "would_overwrite";
      };
  repair: Repair;
}
/**
 * What was proposed.
 */
export interface Repair {
  /**
   * The check whose finding this answers, as the finding names it.
   */
  check: string;
  /**
   * What it would do, in the words the operator will read before confirming.
   */
  does: string;
  /**
   * What else changes if it does.
   *
   * Stated before it is confirmed and never afterwards, because an effect an operator
   * learns about after the fact is not something they agreed to. Empty where a repair
   * touches nothing but the thing it names.
   */
  effects: string[];
  /**
   * Whether carrying it out is recorded well enough to be undone.
   *
   * A repair that cannot be reversed is still worth offering — restarting a container
   * is not undoable and is usually right — but the operator confirming one deserves to
   * know which kind they are agreeing to.
   */
  reversible: boolean;
}
/**
 * One repair lemonfiber could carry out.
 */
export interface Repair1 {
  /**
   * The check whose finding this answers, as the finding names it.
   */
  check: string;
  /**
   * What it would do, in the words the operator will read before confirming.
   */
  does: string;
  /**
   * What else changes if it does.
   *
   * Stated before it is confirmed and never afterwards, because an effect an operator
   * learns about after the fact is not something they agreed to. Empty where a repair
   * touches nothing but the thing it names.
   */
  effects: string[];
  /**
   * Whether carrying it out is recorded well enough to be undone.
   *
   * A repair that cannot be reversed is still worth offering — restarting a container
   * is not undoable and is usually right — but the operator confirming one deserves to
   * know which kind they are agreeing to.
   */
  reversible: boolean;
}
/**
 * The payload.
 */
export interface ResetReport {
  /**
   * Whether the reset was carried out, or only previewed pending confirmation.
   */
  confirmed: boolean;
  /**
   * The operator's edits that were reverted — or, unconfirmed, that a reset would
   * revert — each with the diff of what is lost against what lemonfiber restores.
   */
  reverted: StackEdit[];
  /**
   * The service connections whose drifted value was reverted to lemonfiber's — or,
   * unconfirmed, would be — each named as it reads in a seed report.
   */
  reverted_connections: string[];
}
/**
 * The payload.
 */
export interface RestoreRestoration {
  /**
   * What was put back, or nothing where nothing was.
   */
  done?: RestoreReport | null;
  would: Preview;
}
/**
 * What a restore did.
 */
export interface RestoreReport {
  /**
   * The lemonfiber version the archive was written by.
   */
  from_version: string;
  /**
   * The data root that was re-pointed, where the restore accepted one.
   */
  relocated?: Relocation | null;
  /**
   * What was restored.
   */
  scope:
    | {
        scope: "whole_stack";
      }
    | {
        /**
         * The service whose configuration this covers.
         */
        name: string;
        scope: "service";
      };
}
/**
 * A restore whose archive was taken against a different data root than the one
 * configured now, so its stored paths would land where nothing exists.
 */
export interface Relocation {
  /**
   * The data root configured now.
   */
  now: string;
  /**
   * The data root the archive was taken against.
   */
  was: string;
}
/**
 * What the archive holds and what restoring it would come to, read before
 * anything was touched.
 */
export interface Preview {
  /**
   * Whether the archive is old enough that a compatibility warning applies.
   */
  downgrade: boolean;
  manifest: Manifest;
  /**
   * The data-root difference, where the archive was taken against another one.
   */
  relocation?: Relocation | null;
}
/**
 * The archive's own account of itself — its scope, version and contents.
 */
export interface Manifest {
  /**
   * When it was taken. Opaque here; the surface stamps it from the clock.
   */
  created_at: string;
  /**
   * The data root it was taken against, to notice a restore to a different one.
   */
  data_root: string;
  /**
   * What is inside, for a listing shown before anything is overwritten.
   */
  members: Member[];
  /**
   * The lemonfiber version that wrote it, checked against the one restoring.
   */
  product_version: string;
  /**
   * The archive format, checked before anything inside is trusted.
   */
  schema: number;
  /**
   * What it covers.
   */
  scope:
    | {
        scope: "whole_stack";
      }
    | {
        /**
         * The service whose configuration this covers.
         */
        name: string;
        scope: "service";
      };
  /**
   * Whether it carries credentials, and so must be handled as sensitive.
   */
  sensitive: boolean;
}
/**
 * One entry in an archive's contents listing.
 */
export interface Member {
  /**
   * Where it sits inside the archive.
   */
  archive_path: string;
  /**
   * What it is, in the operator's terms.
   */
  label: string;
}
/**
 * The payload.
 */
export interface SeedReport {
  /**
   * Whether drift could be assessed, or the expected-state record was lost.
   */
  assessment: "assessed" | "unassessable";
  /**
   * Every connection attempted, and how each turned out.
   */
  wirings: SeedWiring[];
}
/**
 * One connection, and how it turned out.
 */
export interface SeedWiring {
  /**
   * What was being connected, such as `SABnzbd into Sonarr`.
   */
  connection: string;
  /**
   * How serious the outcome is — information by default, a warning where the
   * connection breaks the stack.
   */
  severity:
    | {
        severity: "informational";
      }
    | {
        /**
         * What is broken, in the operator's terms.
         */
        breakage: string;
        /**
         * What to do about it.
         */
        remediation: string;
        severity: "warning";
      };
  /**
   * How it turned out.
   */
  state:
    | {
        state: "wired";
      }
    | {
        state: "already-wired";
      }
    | {
        state: "drifted";
      }
    | {
        state: "stale";
      }
    | {
        /**
         * The value lemonfiber would write in its place.
         */
        ours: string;
        state: "conflicted";
        /**
         * The value the service now holds, as the operator set it; `None` where
         * they cleared it.
         */
        yours?: string | null;
      }
    | {
        state: "adopted";
      }
    | {
        state: "unmanaged";
      }
    | {
        /**
         * Why it could not be attempted.
         */
        reason: string;
        state: "skipped";
      }
    | {
        /**
         * What the service said.
         */
        detail: string;
        state: "failed";
      }
    | {
        /**
         * Why it was refused, in lemonfiber's own words.
         */
        reason: string;
        state: "refused";
      };
}
/**
 * The payload.
 */
export interface SetupReport {
  /**
   * Where the library was put, where a location was chosen.
   */
  data_root?: string | null;
  /**
   * How the run ended.
   */
  outcome: "applied" | "abandoned" | "already-set-up";
  protocols: Protocols;
  /**
   * The user the services run as, as `uid:gid`, where one was set.
   */
  service_user?: string | null;
}
/**
 * Which ways of downloading the stack was set up for.
 */
export interface Protocols {
  /**
   * A VPN and torrent client are configured.
   */
  torrent: boolean;
  /**
   * A Usenet provider is configured.
   */
  usenet: boolean;
}
/**
 * The payload.
 */
export interface StatusStatusReport {
  /**
   * What a whole set of services amounts to.
   */
  condition: "inactive" | "degraded" | "partial" | "active";
  /**
   * The forms asked about; empty means the whole stack was.
   */
  forms: string[];
  /**
   * Each service, worst first.
   */
  services: StatusService[];
}
/**
 * One service, as it stands.
 */
export interface StatusService {
  /**
   * How much its absence costs, so a summary can weigh it.
   */
  criticality: "critical" | "core" | "important" | "enhancing" | "optional";
  /**
   * The services it needs before it can work, as the manifest declares them.
   * Carried so a failure can be attributed to the thing underneath it rather
   * than counted as one more independent thing wrong.
   */
  depends_on: string[];
  /**
   * How it exited, where it has exited.
   */
  exit?: number | null;
  /**
   * The service's identifier, which is also its Compose service name.
   */
  id: string;
  /**
   * What it is called in front of an operator.
   */
  name: string;
  /**
   * The profile that declared it.
   */
  profile: string;
  /**
   * What it is doing.
   */
  state:
    | "failed"
    | "crash-looping"
    | "unhealthy"
    | "absent"
    | "stopped"
    | "starting"
    | "running"
    | "healthy"
    | "host-managed";
}
/**
 * The payload.
 */
export interface StepLine {
  /**
   * What was specifically true — the evidence that makes the line worth reading
   * rather than a spinner. Empty where there is nothing particular to say.
   */
  detail: string;
  /**
   * What it is doing, in plain language.
   */
  said: string;
  /**
   * The step being narrated.
   */
  step: "choosing" | "searching" | "grabbing" | "downloading" | "importing" | "scanning" | "available";
}
/**
 * The payload.
 */
export interface StuckReport {
  /**
   * Whether an \*arr's queue could not be read, so the list may be short — reported
   * rather than read as "nothing stuck", the same honesty a trace keeps.
   */
  incomplete: boolean;
  /**
   * The stuck items, each linkable to its trace.
   */
  items: StuckEntry[];
}
/**
 * One stuck item queue health found, named so it links straight to its own trace.
 */
export interface StuckEntry {
  /**
   * The \*arr whose queue is holding it.
   */
  service: string;
  /**
   * The stage its download is stuck at.
   */
  stage:
    | "not-monitored"
    | "monitored"
    | "searching"
    | "found"
    | "grabbed"
    | "downloading"
    | "downloaded"
    | "importing"
    | "imported"
    | "available";
  /**
   * The item's title — the term a `trace` searches by.
   */
  title: string;
}
/**
 * The payload.
 */
export interface TraceTraceReport {
  /**
   * How sure the trace is of the item it followed.
   */
  confidence: "certain" | "uncertain";
  /**
   * How much of the item is actually here, season by season — present for an item
   * made of parts, absent for a film, which is the whole item and has none.
   *
   * The furthest stage alone cannot answer this: a series is "imported" the moment one
   * episode lands, which reads as done while the rest are missing.
   */
  coverage?: Coverage | null;
  /**
   * Disagreements between the services about this item, each in plain language — a
   * media server holding what no service is monitoring, and the like. Orthogonal to
   * the linear pipeline: not where the item got to, but where two services' views of
   * it contradict, surfaced rather than silently reconciled.
   */
  findings: string[];
  /**
   * The furthest stage the item reached.
   */
  furthest:
    | "not-monitored"
    | "monitored"
    | "searching"
    | "found"
    | "grabbed"
    | "downloading"
    | "downloaded"
    | "importing"
    | "imported"
    | "available";
  /**
   * The notable events in its history, oldest first — the grabs, failed downloads,
   * imports and removals. Repeated attempts show here as the pattern they are, which
   * the single furthest stage cannot.
   */
  history: TraceTraceMoment[];
  /**
   * The term the item was searched for by.
   */
  item: string;
  /**
   * Whether a monitored item matched the term at all — a false here is itself the
   * answer: nobody asked for it.
   */
  matched: boolean;
  /**
   * The stages it passed through, in order.
   */
  stages: TraceStage[];
  /**
   * Why it stopped, where it plainly has — or absent where it is progressing or done.
   */
  stall?: string | null;
}
/**
 * How much of a traced series is here, season by season — the aggregate that turns a
 * single furthest stage into an answer about the whole. The counts are of parts someone
 * asked for; what nobody asked for is reported beside them, never folded in.
 */
export interface Coverage {
  /**
   * How many wanted parts are here, across every season.
   */
  have: number;
  /**
   * Each season, in order.
   */
  seasons: SeasonCoverage[];
  /**
   * How many parts nobody asked for, across every season.
   */
  unmonitored: number;
  /**
   * How many parts were asked for, across every season.
   */
  wanted: number;
}
/**
 * How much of one season is actually here, and what is outstanding — the season-level
 * answer, which for a series is the one an operator can act on.
 */
export interface SeasonCoverage {
  /**
   * How many of the wanted parts are here.
   */
  have: number;
  /**
   * The wanted parts that are not here yet, each carrying the stage it rests at, so
   * one that stalled is told apart from one still downloading.
   */
  outstanding: Part[];
  /**
   * The season number. Season zero is where a service files specials.
   */
  season: number;
  /**
   * How many parts nobody asked for — unmonitored and not on disk.
   */
  unmonitored: number;
  /**
   * How many parts were asked for, or are already here — the denominator. Parts
   * nobody asked for are counted separately rather than inflating this, so a season
   * with every wanted episode present reads as complete even where specials are not.
   */
  wanted: number;
}
/**
 * One part of a traced item — an episode of a series. A film has no parts: the item is
 * the whole, and a trace of it says all there is to say. A series does not, which is the
 * gap this closes: "the show is imported" is true the moment one episode lands, and reads
 * as done while nine are still missing.
 */
export interface Part {
  /**
   * Its number within that season.
   */
  number: number;
  /**
   * Which season it belongs to.
   */
  season: number;
  /**
   * How far this one part got, on the same scale as the item as a whole.
   */
  stage:
    | "not-monitored"
    | "monitored"
    | "searching"
    | "found"
    | "grabbed"
    | "downloading"
    | "downloaded"
    | "importing"
    | "imported"
    | "available";
  /**
   * Its title, as a person would name it.
   */
  title: string;
}
/**
 * One moment in a traced item's history: what happened and when. Where [`TraceStage`]
 * is the linear progress, this is the log an \*arr kept — the grabs, the failed
 * downloads, the import and any later removal — so a repeated attempt is seen as the
 * pattern it is rather than flattened to a single furthest stage.
 */
export interface TraceTraceMoment {
  /**
   * When the service reported it.
   */
  at: string;
  /**
   * What happened.
   */
  outcome: "grabbed" | "download-failed" | "imported" | "removed";
}
/**
 * One stage a traced item reached, named as the operator would read it: the stage,
 * the service that recorded it, and when.
 */
export interface TraceStage {
  /**
   * When it happened, as the service reported it — absent for a stage inferred
   * rather than timed, such as being monitored.
   */
  at?: string | null;
  /**
   * The service that recorded it.
   */
  service: string;
  /**
   * The stage reached.
   */
  stage:
    | "not-monitored"
    | "monitored"
    | "searching"
    | "found"
    | "grabbed"
    | "downloading"
    | "downloaded"
    | "importing"
    | "imported"
    | "available";
}
/**
 * The payload.
 */
export interface Reversal {
  /**
   * What was put back, in the order it was.
   */
  reversed: Undo[];
}
/**
 * A single reversal, for the surface to carry out.
 */
export interface Undo {
  /**
   * What reversing it does.
   */
  action:
    | {
        does: "remove";
        /**
         * The identifier to remove.
         */
        id: string;
        /**
         * The kind of resource.
         */
        resource: string;
      }
    | {
        does: "restore";
        /**
         * The setting to restore.
         */
        key: string;
        /**
         * What to restore it to, or `None` to remove it.
         */
        value?: string | null;
      }
    | {
        does: "delete";
        /**
         * The path to remove.
         */
        path: string;
      }
    | {
        does: "reconfigure";
        /**
         * The field to put back.
         */
        field: string;
        /**
         * The identifier to change.
         */
        id: string;
        /**
         * The kind of resource.
         */
        resource: string;
        /**
         * What to put back, or `None` where it held nothing.
         */
        value?: string | null;
      };
  /**
   * The service or file to reverse it against.
   */
  target: string;
}
/**
 * The payload.
 */
export interface UpgradeReport {
  /**
   * Whether the operator confirmed; without it nothing was triggered, only the
   * cost stated.
   */
  confirmed: boolean;
  /**
   * Per media type: its preset, that preset's cost, and — confirmed — the outcome.
   */
  media: UpgradeMedia[];
}
/**
 * One media type an upgrade covers: its chosen quality, that quality's cost, and —
 * once confirmed — what became of asking its service to re-search.
 *
 * Reported per media type rather than as one figure, because each type carries its
 * own preset and so its own cost: film at maximum and television at space-saving are
 * upgraded to different bars, and a single number would misstate one of them.
 */
export interface UpgradeMedia {
  /**
   * The media type — `tv` or `movies`.
   */
  media_type: string;
  /**
   * What became of the re-search, or `None` where the upgrade was not confirmed
   * and only the cost was stated.
   */
  outcome?: Triggered | null;
  /**
   * The preset in force for it.
   */
  preset: string;
  /**
   * Roughly what an hour of it costs at that preset.
   */
  size_per_hour: string;
}
/**
 * The payload.
 */
export interface VersionReport {
  /**
   * The running binary's version.
   */
  binary: string;
  /**
   * What the container engine reports, when it could be asked.
   */
  compose?: string | null;
  /**
   * The version of the stack this build operates.
   */
  stack: string;
  /**
   * The manifest schema generations this build reads.
   */
  supported_schema: number[];
}
/**
 * The payload.
 */
export interface WalkthroughWalkthroughReport {
  /**
   * Whether what was asked for was already here, and so was not acquired again.
   */
  already_here: boolean;
  /**
   * Where it leaves the operator, where it worked.
   */
  handover?: Handover | null;
  /**
   * Whether the download was handed to the background rather than waited out.
   */
  in_background: boolean;
  /**
   * What it walked, where it got as far as choosing something.
   */
  item?: string | null;
  /**
   * Every line it said, in order — the same lines the operator watched arrive, kept so
   * a machine-readable run is not a silent one.
   */
  lines: WalkthroughLine[];
  /**
   * What the import did with the file, where it got that far.
   */
  link?: Link | null;
  /**
   * What it set out to prove, said so the operator knows what they watched.
   */
  proves: string;
  /**
   * Which walk this was.
   */
  shape: "pipeline" | "library-only";
  /**
   * Where it ended up.
   */
  state:
    | "offered"
    | "skipped"
    | "searching"
    | "grabbing"
    | "downloading"
    | "importing"
    | "complete"
    | "failed"
    | "abandoned";
  /**
   * Where and why it stopped, where it did.
   */
  stopped?: WalkthroughStopped | null;
  /**
   * What could have been walked instead, where nothing was chosen — the safe first
   * attempts, so an operator with an empty library is not left guessing.
   */
  suggestions: string[];
}
/**
 * Where a finished walkthrough leaves the operator.
 */
export interface Handover {
  /**
   * What to do next, in order.
   */
  next: Next[];
}
/**
 * One narrated line: a step, and what was specifically true of it.
 */
export interface WalkthroughLine {
  /**
   * What was specifically true — the evidence that makes the line worth reading
   * rather than a spinner. Empty where there is nothing particular to say.
   */
  detail: string;
  /**
   * What it is doing, in plain language.
   */
  said: string;
  /**
   * The step being narrated.
   */
  step: "choosing" | "searching" | "grabbing" | "downloading" | "importing" | "scanning" | "available";
}
/**
 * A walkthrough that stopped: where, why, what the services were saying, and what to do.
 */
export interface WalkthroughStopped {
  /**
   * What the services involved were saying at the time, shown inline rather than left
   * for the operator to go and find — a fault report they have to research is a fault
   * report they abandon.
   */
  logs: string[];
  /**
   * Why.
   */
  reason:
    | "no-indexers"
    | "indexers-failed"
    | "nothing-matched"
    | "none-met-the-preset"
    | "tunnel-down"
    | "not-grabbed"
    | "stalled"
    | "import-failed"
    | "no-media-server"
    | "not-visible";
  /**
   * The one thing to try.
   */
  remedy: string;
  /**
   * The step it stopped at.
   */
  step: "choosing" | "searching" | "grabbing" | "downloading" | "importing" | "scanning" | "available";
}
/**
 * The payload.
 */
export interface SupervisionReport {
  /**
   * The forms that were being watched, and are now stopped.
   */
  forms: string[];
  /**
   * Why the watch ended: the data root vanished, or a different volume took
   * its place.
   */
  reason: string;
  /**
   * Whether stopping the services succeeded.
   */
  stopped: boolean;
}
/**
 * The payload.
 */
export interface WizardWizardReport {
  /**
   * Whether that step asks a question, as opposed to only informing.
   */
  asks: boolean;
  /**
   * The step the operator is on.
   */
  at:
    | "welcome"
    | "preflight"
    | "prerequisites"
    | "protocols"
    | "vpn"
    | "data-location"
    | "credentials"
    | "provider"
    | "service-user"
    | "library"
    | "household"
    | "notifications"
    | "autostart"
    | "review";
  /**
   * Whether this machine has setup left to do. False once configuration
   * exists and nothing is part-way through, which is when a surface directs
   * the operator to reconfiguration instead of asking the first question again.
   */
  offered: boolean;
  /**
   * Where this run stands in its lifecycle. `applying` read back here means an
   * apply stopped part-way, because an apply that is still running is one this
   * answer is waiting on.
   */
  phase: "in-progress" | "reviewing" | "applying" | "applied";
  /**
   * What applying will write, in the order it will be written, with any value
   * nobody has argued for showing withheld.
   */
  plan: SettingReport[];
  /**
   * What proving the credential just given came to, where one was given.
   *
   * Setup tests an indexer key and a Usenet login against their live services as
   * they are entered, and this is what the service answered — never what was
   * entered. Absent for every other answer, and for a step that gave none.
   */
  proof?: Validation | null;
  /**
   * Whether every applicable question is answered, so the plan can be applied.
   */
  ready_for_review: boolean;
  /**
   * Every question that applies on this machine and has no answer yet, in the
   * order they are put.
   */
  unanswered: WizardStep[];
  /**
   * What an apply that stopped part-way had already written, each said plainly.
   *
   * The partial state a recovery is chosen about, so whoever chooses has seen it.
   * Empty for every other phase, and empty too for an apply that stopped before
   * it wrote anything.
   */
  written: string[];
}
/**
 * A word this product uses, and what somebody meeting it needs to know.
 */
export interface Term1 {
  /**
   * What other services in this stack call the same thing.
   *
   * Sonarr and `SABnzbd` do not agree on words, and an operator moving between
   * their screens should not have to work out that two of them are one.
   */
  also_called: string[];
  /**
   * More, for somebody who asks — never needed in order to act.
   */
  deep?: string | null;
  /**
   * One sentence: what it is for and what it costs or gains.
   *
   * Enough to act on. Somebody who reads only this should not be stuck.
   */
  short: string;
  /**
   * The word as it appears in the interface.
   */
  word: string;
}

/** The envelope carrying `archives`. */
export type ArchivesEnvelope = Contract["archives"];

/** The envelope carrying `backup`. */
export type BackupEnvelope = Contract["backup"];

/** The envelope carrying `bundle`. */
export type BundleEnvelope = Contract["bundle"];

/** The envelope carrying `config`. */
export type ConfigEnvelope = Contract["config"];

/** The envelope carrying `dashboard`. */
export type DashboardEnvelope = Contract["dashboard"];

/** The envelope carrying `doctor`. */
export type DoctorEnvelope = Contract["doctor"];

/** The envelope carrying `error`. */
export type ErrorEnvelope = Contract["error"];

/** The envelope carrying `forms`. */
export type FormsEnvelope = Contract["forms"];

/** The envelope carrying `glossary`. */
export type GlossaryEnvelope = Contract["glossary"];

/** The envelope carrying `household`. */
export type HouseholdEnvelope = Contract["household"];

/** The envelope carrying `job`. */
export type JobEnvelope = Contract["job"];

/** The envelope carrying `lifecycle`. */
export type LifecycleEnvelope = Contract["lifecycle"];

/** The envelope carrying `log`. */
export type LogEnvelope = Contract["log"];

/** The envelope carrying `music`. */
export type MusicEnvelope = Contract["music"];

/** The envelope carrying `preview`. */
export type PreviewEnvelope = Contract["preview"];

/** The envelope carrying `pull`. */
export type PullEnvelope = Contract["pull"];

/** The envelope carrying `quality`. */
export type QualityEnvelope = Contract["quality"];

/** The envelope carrying `repair`. */
export type RepairEnvelope = Contract["repair"];

/** The envelope carrying `reset`. */
export type ResetEnvelope = Contract["reset"];

/** The envelope carrying `restore`. */
export type RestoreEnvelope = Contract["restore"];

/** The envelope carrying `seed`. */
export type SeedEnvelope = Contract["seed"];

/** The envelope carrying `setup`. */
export type SetupEnvelope = Contract["setup"];

/** The envelope carrying `start`. */
export type StartEnvelope = Contract["start"];

/** The envelope carrying `status`. */
export type StatusEnvelope = Contract["status"];

/** The envelope carrying `step`. */
export type StepEnvelope = Contract["step"];

/** The envelope carrying `stuck`. */
export type StuckEnvelope = Contract["stuck"];

/** The envelope carrying `trace`. */
export type TraceEnvelope = Contract["trace"];

/** The envelope carrying `undo`. */
export type UndoEnvelope = Contract["undo"];

/** The envelope carrying `upgrade`. */
export type UpgradeEnvelope = Contract["upgrade"];

/** The envelope carrying `version`. */
export type VersionEnvelope = Contract["version"];

/** The envelope carrying `walkthrough`. */
export type WalkthroughEnvelope = Contract["walkthrough"];

/** The envelope carrying `watch`. */
export type WatchEnvelope = Contract["watch"];

/** The envelope carrying `wizard`. */
export type WizardEnvelope = Contract["wizard"];

/** The envelope carrying `word`. */
export type WordEnvelope = Contract["word"];

/** Every kind the server may send. */
export type Kind = "archives" | "backup" | "bundle" | "config" | "dashboard" | "doctor" | "error" | "forms" | "glossary" | "household" | "job" | "lifecycle" | "log" | "music" | "preview" | "pull" | "quality" | "repair" | "reset" | "restore" | "seed" | "setup" | "start" | "status" | "step" | "stuck" | "trace" | "undo" | "upgrade" | "version" | "walkthrough" | "watch" | "wizard" | "word";

/** The envelope carrying each kind, so a payload is typed by what it is. */
export interface ByKind {
  "archives": ArchivesEnvelope;
  "backup": BackupEnvelope;
  "bundle": BundleEnvelope;
  "config": ConfigEnvelope;
  "dashboard": DashboardEnvelope;
  "doctor": DoctorEnvelope;
  "error": ErrorEnvelope;
  "forms": FormsEnvelope;
  "glossary": GlossaryEnvelope;
  "household": HouseholdEnvelope;
  "job": JobEnvelope;
  "lifecycle": LifecycleEnvelope;
  "log": LogEnvelope;
  "music": MusicEnvelope;
  "preview": PreviewEnvelope;
  "pull": PullEnvelope;
  "quality": QualityEnvelope;
  "repair": RepairEnvelope;
  "reset": ResetEnvelope;
  "restore": RestoreEnvelope;
  "seed": SeedEnvelope;
  "setup": SetupEnvelope;
  "start": StartEnvelope;
  "status": StatusEnvelope;
  "step": StepEnvelope;
  "stuck": StuckEnvelope;
  "trace": TraceEnvelope;
  "undo": UndoEnvelope;
  "upgrade": UpgradeEnvelope;
  "version": VersionEnvelope;
  "walkthrough": WalkthroughEnvelope;
  "watch": WatchEnvelope;
  "wizard": WizardEnvelope;
  "word": WordEnvelope;
}

/** The wire version these types were generated for. */
export const CONTRACT_API_VERSION = 1;
