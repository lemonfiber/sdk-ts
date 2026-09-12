// Generated from the lemonfiber contract. Do not edit.
// Source: 387f0c83c55614ac3839bb21e88dd0c3a2feb50f  ·  api_version 1
// Regenerate with `npm run contract:generate`.

/**
 * Which side of the household's day a moment falls on.
 */
export type Period = "active" | "quiet";
/**
 * Whether a client is fetching at all, where a cap made it a question.
 *
 * Apart from the limits above rather than folded in with them, because it answers
 * a different question and a client held to a crawl is not a client that stopped.
 * A word that named both would be the vocabulary this whole path exists to avoid.
 */
export type Pulling = "fetching" | "stopped";
/**
 * Where a month stands against a declared cap.
 */
export type Reached = "within" | "warning" | "exceeded";
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
 * What a service published to the local network is to the people in the house.
 */
export type Facing = "asking" | "watching" | "shelf" | "operators" | "carriage" | "unstated";
/**
 * Where one request stands, in the words the person who made it would use.
 *
 * Deliberately coarser than a [`crate::trace::Stage`]: a member does not need to know
 * that a release was grabbed but not imported, only that it is on its way. The trace is
 * where that detail stays, and a request names the item so it can be asked for.
 */
export type State2 = "waiting-for-approval" | "declined" | "failed" | "getting" | "partly-here" | "here" | "gone";
/**
 * What happens to what a household member asks for.
 *
 * Three, and they are the three the request service can actually be put into. A
 * household is in one of them because of two settings taken together — whether requests
 * arrive unseen, and whether a period limits how many — so the words here are a reading
 * of that pair rather than a fourth setting kept beside it.
 *
 * Choosing per person is not a fourth policy. It is one of these three chosen for one
 * member rather than for the house, which is why what a surface offers is a policy and,
 * separately, who it is for.
 */
export type Policy = "trusted" | "within-a-limit" | "everything-waits";
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
  admission: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Admitted;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  adoption: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: AdoptReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  alerts: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: AlertReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
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
  bandwidth: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: BandwidthSharing;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  beside: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: BesideReport;
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
  clients: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: Guidance;
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
    data: ConfigConfigReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  credentials: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: CredentialsInventory;
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
  "front-door": {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: FrontDoorFrontDoorReport;
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
  history: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: HistoryReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  hosting: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: HostingReport;
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
  import: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: ImportReport;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  invitation: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: InvitationInvitation;
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
  migration: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: MigrationReport;
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
  outbound: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: OutboundLeaving;
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
  removal: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: HouseholdRemoval;
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
  replacement: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: ReplaceReport;
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
  "self-update": {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: SelfUpdateUpdateReport;
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
  space: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: SpaceReckoning;
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
  "stop-seeding": {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: StopSeedingLetting;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  stored: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: StoredStored;
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
    data: UndoReversal;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  uninstall: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: UninstallUninstall;
    /**
     * Which payload this is, so a consumer can branch before parsing `data`.
     */
    kind: string;
  };
  /**
   * The wrapper every machine-readable payload arrives in.
   */
  update: {
    /**
     * The output contract's version.
     */
    api_version: number;
    data: UpdateReport;
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
    data: VersionVersionReport;
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
export interface Admitted {
  /**
   * The secret this session is carried by, sent in the header the per-run token is.
   */
  token: string;
  /**
   * When it stops being one, written as every other instant this product writes.
   */
  until: string;
}
/**
 * The payload.
 */
export interface AdoptReport {
  /**
   * The host paths those services keep their data in, so a backup can be taken of
   * exactly the right thing.
   */
  back_up: string[];
  /**
   * Where the capture of those paths was written, once one has been taken.
   *
   * Absent on a rehearsal, which captures nothing, and absent where the setup
   * mounted nothing worth capturing. Present on an adoption that went through,
   * because an operator told a backup was taken is owed the path to it.
   */
  backed_up?: string | null;
  /**
   * The project lemonfiber would manage, where exactly one could be adopted.
   */
  project?: string | null;
  /**
   * Why nothing was done, where nothing was.
   */
  refusal?: string | null;
  /**
   * Where the act stands.
   */
  stance: "unchanged" | "pending" | "blocked" | "applied";
  /**
   * The services whose databases a newer version would upgrade, and whose data
   * therefore has to be backed up before anything opens it.
   */
  upgrades: CarryingReport[];
}
/**
 * What adopting one existing service would come to.
 */
export interface CarryingReport {
  /**
   * Whether its database must be backed up before lemonfiber opens it.
   */
  backup_first: boolean;
  /**
   * What that means for this service's data, in the operator's terms.
   */
  because: string;
  /**
   * The version standing here now.
   */
  existing: string;
  /**
   * The version lemonfiber pins.
   */
  ours: string;
  /**
   * Whether lemonfiber will not do this at all.
   */
  refused: boolean;
  /**
   * The service, by the name lemonfiber runs it under.
   */
  service: string;
  /**
   * Which of the two is the later, in one word.
   */
  verdict: string;
}
/**
 * The payload.
 */
export interface AlertReport {
  /**
   * Whether this call changed the answer.
   */
  changed: boolean;
  /**
   * Events set apart from the preset, quietest name first.
   */
  exceptions: ExceptionReport[];
  /**
   * What that preset means, in the operator's terms.
   */
  means: string;
  /**
   * The preset in force for events with no exception of their own.
   */
  preset: string;
  /**
   * Whether it only reported what it would have written.
   */
  rehearsed: boolean;
}
/**
 * One event kind the operator set apart from the preset.
 */
export interface ExceptionReport {
  /**
   * The kind of event, by the name a finding gives it.
   */
  kind: string;
  /**
   * Whether it is heard about, whatever the preset would say.
   */
  wanted: boolean;
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
      }
    | {
        /**
         * The Compose project the capture was taken from.
         */
        project: string;
        scope: "existing";
        /**
         * The host trees captured, in the order the survey reported them.
         */
        trees: Tree[];
      };
  /**
   * Whether it carries credentials, and so must be handled as sensitive.
   */
  sensitive: boolean;
}
/**
 * One host tree captured from a setup lemonfiber does not manage.
 *
 * Both halves are needed to find it again: the archive path says where it sits
 * inside the archive, and the host path says where it was read from. Nothing
 * derives the second from the first, because a tree outside lemonfiber's layout
 * has no layout to derive it from.
 */
export interface Tree {
  /**
   * Where it sits inside the archive.
   */
  archive_path: string;
  /**
   * Where it was read from, on the machine whose setup was taken over.
   */
  host_path: string;
}
/**
 * The payload.
 */
export interface BandwidthSharing {
  /**
   * What a spent cap is doing to the figures above, where one is spent.
   */
  acting?: string | null;
  /**
   * Whether this run wrote the limits to the clients or only read them.
   */
  applied: boolean;
  /**
   * The monthly cap, where one was declared.
   */
  cap?: Cap | null;
  /**
   * What the line was measured to carry.
   */
  capacity?: Capacity | null;
  /**
   * What is worth knowing about that reading before trusting it.
   */
  cautions: string[];
  /**
   * What each download client was asked and what it is doing about it.
   */
  clients: BandwidthHolding[];
  down: BandwidthReading;
  /**
   * What that means for the household.
   */
  means: string;
  /**
   * What the stack itself moved this month.
   */
  metered?: Metered | null;
  /**
   * What throttling the upload costs, where an upload limit is in force.
   */
  ratio?: string | null;
  /**
   * Where the month stands against it.
   */
  reached?: Reached | null;
  /**
   * The override, where one is running or has just run out.
   */
  respite:
    | {
        standing: "none";
      }
    | {
        seconds: number;
        standing: "in-force";
      }
    | {
        seconds: number;
        standing: "expired";
      };
  /**
   * What the override amounts to, in words.
   */
  respite_says?: string | null;
  /**
   * Where the line stands.
   */
  restraint:
    "unlimited" | "limited" | "scheduled-active" | "scheduled-quiet" | "overridden" | "cap-warning" | "cap-exceeded";
  /**
   * The household's hours, where any were declared.
   */
  rhythm?: Rhythm | null;
  /**
   * What is outside every limit here.
   */
  untouched: string[];
  up: BandwidthReading1;
  /**
   * The zone the clients read those hours in, where the stack says.
   */
  zone?: string | null;
}
/**
 * A monthly allowance, and what to do at the end of it.
 */
export interface Cap {
  /**
   * What happens when it is reached, chosen when the cap was declared.
   */
  exceeded: "pause" | "throttle" | "continue";
  /**
   * The allowance, in bytes.
   */
  monthly: number;
}
/**
 * What the line was measured to carry.
 */
export interface Capacity {
  /**
   * Bytes a second down.
   */
  down: number;
  /**
   * Where the figure came from.
   */
  source: "declared" | "observed";
  /**
   * When it was taken, in seconds since the epoch.
   */
  taken: number;
  /**
   * Whether the path it was measured over goes through the VPN tunnel.
   */
  through_tunnel: boolean;
  /**
   * Bytes a second up.
   *
   * Measured apart from the download, because a home connection is asymmetric
   * and a single figure for both would make every upload share far larger than
   * the operator meant.
   */
  up: number;
}
/**
 * One download client, and what became of the limits it was given.
 */
export interface BandwidthHolding {
  /**
   * What it said.
   */
  answer:
    | {
        answered: "held";
        down: BandwidthHeld;
        /**
         * Which side of the household's day it says it is on, where it keeps the
         * hours itself.
         */
        period?: Period | null;
        up: BandwidthHeld1;
      }
    | {
        answered: "silent";
        /**
         * What went wrong, in the words of whatever refused.
         */
        said: string;
      };
  /**
   * The client, by the name the stack knows it under.
   */
  client: string;
  /**
   * Whether it is fetching at all, where a declared cap made that a question.
   *
   * Absent on a stack with no cap rather than assumed to be fetching: asking
   * every client whether it has stopped, on a stack where nothing would ever
   * stop it, is traffic spent on a figure nothing would act on.
   */
  pulling?: Pulling | null;
}
/**
 * What became of the download limit.
 */
export interface BandwidthHeld {
  /**
   * What it reports as in force.
   */
  accepted?: number | null;
  /**
   * What it was asked to hold to, in bytes a second, where anything was.
   */
  asked?: number | null;
  /**
   * What it is moving right now, where it reported a figure.
   */
  moving?: number | null;
  /**
   * What that adds up to.
   */
  verdict: "unasked" | "nothing-to-limit" | "holding" | "ignored" | "overrunning";
}
/**
 * And of the upload one.
 */
export interface BandwidthHeld1 {
  /**
   * What it reports as in force.
   */
  accepted?: number | null;
  /**
   * What it was asked to hold to, in bytes a second, where anything was.
   */
  asked?: number | null;
  /**
   * What it is moving right now, where it reported a figure.
   */
  moving?: number | null;
  /**
   * What that adds up to.
   */
  verdict: "unasked" | "nothing-to-limit" | "holding" | "ignored" | "overrunning";
}
/**
 * The download limit.
 */
export interface BandwidthReading {
  /**
   * The limit as it was expressed.
   */
  limit:
    | {
        as: "unlimited";
      }
    | {
        as: "share";
        at: number;
      }
    | {
        as: "absolute";
        at: number;
      };
  /**
   * What it comes to against the measured line.
   */
  resolved:
    | {
        is: "unlimited";
      }
    | {
        bytes_per_second: number;
        is: "at";
      }
    | {
        is: "unmeasured";
      };
  /**
   * The limit and the line it was measured against, in one sentence.
   *
   * Carried rather than left to each surface, so the rule that a share is never
   * shown without the figure it is a share of is kept in one place instead of
   * three.
   */
  says: string;
}
/**
 * What the stack itself moved in a calendar month, and what that leaves out.
 */
export interface Metered {
  /**
   * Bytes pulled down, as far as the clients count them.
   */
  down: number;
  /**
   * What this count does not include, always said.
   */
  excludes: string;
  /**
   * What is known to be missing from the count itself, where anything is.
   */
  incomplete: string[];
  /**
   * The month, as the client that dated the figures dates them.
   */
  month: string;
  /**
   * Bytes given back.
   */
  up: number;
}
/**
 * The hours the household is awake, declared once for every download client.
 */
export interface Rhythm {
  /**
   * When the household's day starts.
   */
  from: string;
  /**
   * When it ends, which may be the next morning.
   */
  to: string;
}
/**
 * The upload limit, which is declared apart and defaults lower.
 */
export interface BandwidthReading1 {
  /**
   * The limit as it was expressed.
   */
  limit:
    | {
        as: "unlimited";
      }
    | {
        as: "share";
        at: number;
      }
    | {
        as: "absolute";
        at: number;
      };
  /**
   * What it comes to against the measured line.
   */
  resolved:
    | {
        is: "unlimited";
      }
    | {
        bytes_per_second: number;
        is: "at";
      }
    | {
        is: "unmeasured";
      };
  /**
   * The limit and the line it was measured against, in one sentence.
   *
   * Carried rather than left to each surface, so the rule that a share is never
   * shown without the figure it is a share of is kept in one place instead of
   * three.
   */
  says: string;
}
/**
 * The payload.
 */
export interface BesideReport {
  /**
   * Where each service would listen instead, lowest original port first.
   */
  ports: MovedReport[];
  /**
   * Why nothing was written, where nothing was.
   */
  refusal?: string | null;
  /**
   * Where the act stands.
   */
  stance: "unchanged" | "pending" | "blocked" | "applied";
  /**
   * Where the Compose file that says so was written.
   */
  written?: string | null;
}
/**
 * Where one service would listen to run beside what is already here.
 */
export interface MovedReport {
  /**
   * The port it would ordinarily take.
   */
  from: number;
  /**
   * The lemonfiber service being moved.
   */
  service: string;
  /**
   * The port it would take instead.
   */
  to: number;
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
export interface Guidance {
  /**
   * Every device, in the order somebody is likely to be holding one.
   */
  devices: Device[];
  /**
   * What this will not do for them.
   */
  nothing_is_installed: string;
  /**
   * True of every device, said once.
   */
  only_at_home: string;
  /**
   * Why playback here is likely to struggle before any app is chosen, or `None`
   * where the preset in force asks for nothing this platform cannot serve.
   *
   * Absent far more often than present, and it must be: a caution shown to
   * everybody says nothing about anybody's machine, and a reader who meets one
   * every time stops reading it.
   */
  straining?: Straining | null;
  /**
   * What to do when it does not work, keyed by the symptom.
   */
  trouble: Trouble[];
}
/**
 * A kind of device somebody in the house might watch on.
 */
export interface Device {
  /**
   * What is worth knowing before starting, where anything is.
   */
  caution?: string | null;
  /**
   * What to use on it.
   */
  client: string;
  /**
   * What somebody would call the device they are holding.
   */
  device: string;
  /**
   * What to do instead where this is a bad device to be stuck with.
   */
  instead?: string | null;
  /**
   * How well served it is.
   */
  support: "good" | "workable" | "poor" | "fallback";
}
/**
 * Why playback here is likely to struggle, whatever app the household installs.
 *
 * Present only where the preset in force asks for transcoding this platform cannot
 * do in hardware. It belongs to the guidance rather than to any one device: the
 * preset and the platform decide it between them, and every device in the table
 * meets it.
 */
export interface Straining {
  /**
   * What that preset asks of this machine, and what playback does where this
   * machine cannot give it.
   */
  caution: string;
  /**
   * What makes it stop.
   */
  instead: string;
  /**
   * The preset in force, under the name it was chosen by.
   */
  preset: string;
}
/**
 * Something somebody reports, and what is likely behind it.
 *
 * Keyed by the symptom rather than the cause: the person asking has the symptom,
 * and which cause it is is the thing they cannot yet say.
 */
export interface Trouble {
  /**
   * What is likely behind it, most likely first.
   */
  causes: Cause[];
  /**
   * What somebody says is happening, in their words.
   */
  symptom: string;
}
/**
 * One thing that could be behind a symptom, and how to tell it from the others.
 */
export interface Cause {
  /**
   * What is wrong.
   */
  because: string;
  /**
   * What to do about it.
   */
  fix: string;
  /**
   * How to tell this cause from the others under the same symptom.
   */
  tell: string;
}
/**
 * The payload.
 */
export interface ConfigConfigReport {
  /**
   * Whether this command changed, or would change, a setting.
   */
  changed: boolean;
  /**
   * What this change costs, where making it decides something with a
   * consequence — moving the library, turning port forwarding off, or naming a
   * front door. Stated for a change that is only staged as well as one that
   * landed, since the moment before it happens is the moment it is worth reading.
   * Absent for a read, and for a change to a setting nobody catalogued a cost for.
   */
  consequence?: string | null;
  /**
   * Whether this was a rehearsal, so a change that `changed` reports was one
   * that *would* be made rather than one that was.
   */
  rehearsed: boolean;
  /**
   * The difference between the configuration in force and the one proposed, and
   * where that proposal stands: applied, staged for a confirmation, turned away,
   * or nothing to do. Absent for a read, which proposes nothing.
   */
  review?: ConfigReview | null;
  /**
   * The settings asked about — one for a lookup, all of them for a listing.
   */
  settings: SettingReport[];
}
/**
 * A proposed change, read against what is in force, and where it stands.
 */
export interface ConfigReview {
  change: ConfigChange;
  findings?: Findings;
  /**
   * What proving the replacement credential came to, where one was proven.
   *
   * A replacement is proven against its live service before the credential it
   * replaces is discarded, so this is present for exactly those settings and
   * absent everywhere else.
   */
  proof?: Validation | null;
  /**
   * Why nothing was written, where nothing was and the reason is not simply that
   * somebody has yet to say yes.
   */
  refusal?: string | null;
  /**
   * Where the proposal stands.
   */
  stance: "unchanged" | "pending" | "blocked" | "applied";
}
/**
 * The difference, as it would be applied.
 */
export interface ConfigChange {
  /**
   * Whether applying it is cheap or consequential.
   */
  cost: "cheap" | "consequential";
  /**
   * What it holds now, withheld where it is a credential, and absent where the
   * setting holds nothing yet.
   */
  from?: string | null;
  /**
   * The setting the change names.
   */
  key: string;
  /**
   * What it would hold, withheld the same way.
   */
  to: string;
}
/**
 * What the change comes to on this machine, beyond the value it changes.
 *
 * Filled by whoever went and asked — the services where they file, the clients
 * what they are fetching — and empty on every change that comes to nothing
 * beyond its value. Carried on a staged proposal as well as an applied one: a
 * review that withheld this until after the yes would be asking for a yes to
 * something unstated.
 */
export interface Findings {
  /**
   * What is still coming down, where a reduction would interrupt it.
   */
  active: Active[];
  /**
   * The hand-edit found in the configuration file, where one was found.
   */
  edited?: Edited | null;
  /**
   * What this change leaves exactly as it is, said in full — because an operator
   * dropping a way of downloading is weighing whether they lose what they built
   * with it.
   */
  keeps: string[];
  /**
   * The library paths the services hold, and what moving the data location does
   * to each. Empty for every change that does not move it.
   */
  library: LibraryPath[];
  /**
   * What this change newly asks the operator for, in the order they meet it.
   */
  opens: Opening[];
  /**
   * What this change stops running, by service name.
   */
  stops: string[];
}
/**
 * One download still coming down when a reduction was asked for.
 */
export interface Active {
  /**
   * What it is, as the client names it.
   */
  name: string;
  /**
   * How far along, from zero to a hundred.
   */
  progress: number;
  /**
   * Which client has it.
   */
  protocol: string;
}
/**
 * A setting changed outside lemonfiber since it last wrote one.
 *
 * Both sides, so the operator chooses between them rather than being told one of
 * them lost. Values a listing withholds are withheld here too — a report a script
 * can log must not be the one place a password is printed.
 */
export interface Edited {
  /**
   * What the file holds now.
   */
  found: string;
  /**
   * Whether either value was withheld rather than shown.
   */
  secret: boolean;
  /**
   * What lemonfiber last wrote there.
   */
  wrote: string;
}
/**
 * One library path a service files into, and what moving the data location does
 * to it.
 */
export interface LibraryPath {
  /**
   * Why it does or does not, in the operator's terms.
   */
  because: string;
  /**
   * Whether the library at this path survives the move.
   */
  carried: boolean;
  /**
   * The host directory it would resolve to after the move, where the move can
   * resolve it at all.
   */
  host?: string | null;
  /**
   * The path as that service holds it, which is a path inside its container.
   */
  path: string;
  /**
   * The service holding it.
   */
  service: string;
}
/**
 * One thing a way of downloading newly asks the operator for.
 *
 * What is opened and nothing beside it: an operator adding Usenet is shown the
 * Usenet provider and the settings its login is kept in, and never the tunnel,
 * which they neither need nor asked about.
 */
export interface Opening {
  /**
   * Why this protocol needs it.
   */
  because: string;
  /**
   * The setting its answer is kept in, where it is kept in one. Absent for an
   * account the operator has to go and obtain, which no setting holds.
   */
  setting?: string | null;
  /**
   * What it is, in the operator's terms.
   */
  what: string;
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
export interface CredentialsInventory {
  /**
   * Every credential, whether or not it is present.
   */
  held: CredentialsHeld[];
  protection: Protection;
  /**
   * One value, where one was asked for.
   */
  revealed?: Revealed | null;
  /**
   * What became of a rotation, where one was asked for.
   */
  rotated?: CredentialsRotation | null;
}
/**
 * One credential, described without being disclosed.
 *
 * There is deliberately no value here, and no field a value could be put in later
 * without the change being visible in review.
 */
export interface CredentialsHeld {
  /**
   * What is worth saying about this one, where anything is.
   */
  advisory?: string | null;
  /**
   * Everything that authenticates with it. Named individually, because a
   * consumer left off this list is a consumer a rotation would silently strand.
   */
  consumers: string[];
  /**
   * A short likeness of the value, for telling two copies apart in a report.
   *
   * Absent where there is no value to take one of. Never reversible and never a
   * proof — see [`fingerprint`].
   */
  fingerprint?: string | null;
  /**
   * Where the value lives, as a path or a description of one.
   */
  location: string;
  /**
   * What it is, in the operator's words — `qBittorrent web UI password`.
   */
  name: string;
  /**
   * Who produced it.
   */
  origin: "operator" | "service" | "lemonfiber";
  /**
   * The setting it is recorded under, which is a name and never a value.
   */
  setting: string;
  /**
   * Where it stands.
   */
  state: "absent" | "active" | "stale" | "invalid" | "rotating" | "superseded";
}
/**
 * What keeping them in files does and does not protect against.
 */
export interface Protection {
  /**
   * What it protects against.
   */
  against: string[];
  /**
   * What it does not protect against.
   */
  not_against: string[];
  /**
   * What the storage is, before any claim about it.
   */
  summary: string;
}
/**
 * One stored value, handed back because the operator asked for it and said so.
 *
 * Separate from [`Held`] rather than a field on it, so that the inventory cannot
 * carry a value by accident: a surface that renders the inventory has nothing to
 * render, whatever it does.
 */
export interface Revealed {
  /**
   * Which credential this is.
   */
  name: string;
  /**
   * The value, present only where the ask was confirmed.
   */
  value?: string | null;
  /**
   * What the operator is told before it appears, whether or not it appears.
   */
  warning: string;
}
/**
 * What one rotation came to.
 */
export interface CredentialsRotation {
  /**
   * Every consumer, and how far the rotation reached it.
   */
  consumers: CredentialsPropagation[];
  /**
   * Which credential was to be replaced.
   */
  credential: string;
  /**
   * What became of the replacement.
   */
  settled:
    | {
        /**
         * What the service did while proving it — an observation, never the value.
         */
        observed: string;
        settled: "replaced";
      }
    | {
        /**
         * What the service said, with any credential in it withheld.
         */
        detail: string;
        settled: "refused";
      }
    | {
        /**
         * Why nothing could be concluded.
         */
        detail: string;
        settled: "unproven";
      }
    | {
        /**
         * The names that would have been accepted.
         */
        known: string[];
        settled: "unknown";
      }
    | {
        /**
         * Where a replacement comes from, and what to do once it exists.
         */
        detail: string;
        settled: "elsewhere";
      };
}
/**
 * One consumer, and how far the rotation reached it.
 */
export interface CredentialsPropagation {
  /**
   * What authenticates with the credential.
   */
  consumer: string;
  /**
   * How far the rotation reached it.
   */
  reach:
    | {
        reach: "updated";
      }
    | {
        /**
         * What still has to happen, written as the command that does it.
         */
        detail: string;
        reach: "pending";
      }
    | {
        /**
         * Why it could not be.
         */
        detail: string;
        reach: "failed";
      };
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
  /**
   * The one address to hand somebody who lives here.
   *
   * On the screen rather than only behind a question, because the operator who
   * needs it is not the one who thought to ask: they have just been asked "what
   * do I open?" by somebody in the next room. Built from the same reading as the
   * panels beside it, so the screen and `front-door` cannot name different doors.
   */
  door:
    | {
        data: DashboardFrontDoorReport;
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
  health: DashboardSummary;
  /**
   * What the household has asked for that is not moving.
   *
   * On the screen rather than only behind a question, for the reason the door
   * beside it is: a request waiting on a decision or failed after one is waiting
   * on the operator, and an operator who has to think to ask is one who finds out
   * when somebody comes to complain.
   */
  household:
    | {
        data: DashboardHouseholdReport;
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
        data: DashboardStorage;
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
 * The household's one front door: which service it is, where it stands, and what
 * else they can reach that is not it.
 */
export interface DashboardFrontDoorReport {
  /**
   * The address to hand them, read from this machine at the moment of asking
   * rather than remembered. Absent where there is no door, and where there is
   * one on a machine that will say neither what it is called nor where it is.
   */
  address?: Address | null;
  /**
   * Everything else the household can reach, and why none of it is the door.
   */
  beside: DashboardBeside[];
  /**
   * How this came to be the door: worked out from what the stack declares, named
   * by the operator, or named by them and refused.
   *
   * Carried as a state rather than left to the sentence beneath it, for the reason
   * the standing is: an operator whose setting was refused reads the sentence, and
   * a browser, a script or a dashboard reads this.
   */
  chosen:
    | {
        chosen: "derived";
      }
    | {
        chosen: "named";
        door: string;
      }
    | {
        chosen: "refused";
        door: Refusal;
      };
  /**
   * What that service is to them. Absent for the same reason.
   */
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
  /**
   * Where the front door stands.
   */
  standing: "established" | "library-only" | "unreachable" | "stranded" | "none";
}
/**
 * Where the front door is reached, and what is worth knowing about the address.
 */
export interface Address {
  /**
   * What is worth knowing about the address itself, where anything is. Absent
   * for one that keeps working on its own.
   */
  caution?: string | null;
  /**
   * The whole address, as it would be typed or followed.
   */
  url: string;
}
/**
 * A service the household can reach that is not the front door, and why it is not.
 *
 * Carried rather than left out, because the decision is the useful part: an operator
 * who can see that the index over every service was considered and refused has been
 * told something, where one shown a single name has only been given an answer.
 */
export interface DashboardBeside {
  /**
   * Why it is not somewhere to begin.
   */
  because: string;
  /**
   * What it is to the household.
   */
  facing: "asking" | "watching" | "shelf" | "operators" | "carriage" | "unstated";
  /**
   * The service, by the name it shows itself under.
   */
  service: string;
}
/**
 * A named front door that is not one, and why it is not.
 */
export interface Refusal {
  /**
   * Why this stack will not send a household there.
   */
  because: string;
  /**
   * What the operator recorded, as they wrote it.
   */
  named: string;
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
 * Who is in the household, what each may watch, and what each has asked for.
 */
export interface DashboardHouseholdReport {
  /**
   * What that policy allows in a period, in the words a household says it in.
   *
   * Absent where nothing limits the household, which is not the same as a policy
   * that could not be read: that one leaves [`Self::policy`] absent too.
   */
  allows?: string | null;
  /**
   * Whether the household could be read at all. A false here is why the list is
   * empty, and keeps an unread record from being mistaken for an empty house — the
   * same honesty a trace keeps about a silence it did not hear.
   */
  available: boolean;
  /**
   * What the limits on this household are and are not, where anybody carries one.
   *
   * Absent on a household nobody has limited, because there is no claim to be modest
   * about. Present the moment there is one, because a parent who has set a limit is
   * exactly the reader who might take it for a lock.
   */
  filtering?: string | null;
  /**
   * What could not be read, and anything else worth the operator's attention.
   */
  findings: string[];
  /**
   * Everybody the media server holds an account for, in name order — including
   * those who have never asked for anything, and the invitations nobody has taken
   * up yet.
   */
  members: DashboardHouseholdMember[];
  /**
   * What happens to what the household asks for where nobody chose otherwise for
   * one person. Absent where the request service could not be asked.
   */
  policy?: Policy | null;
}
/**
 * One household member: who they are, what they may watch, when they were last
 * seen, and everything they have asked for.
 */
export interface DashboardHouseholdMember {
  access: MemberAccess;
  /**
   * What they may ask for, and what their period has left of it.
   *
   * Absent where the request service holds no account for them, and where it could
   * not be asked — an unread answer is not an unlimited member, and reporting one as
   * the other would tell an operator their quota was never applied.
   */
  asking?: DashboardMemberAsking | null;
  /**
   * Whether somebody has set a password on the account. False is an invitation
   * nobody has taken up rather than a member who is not here.
   */
  claimed: boolean;
  /**
   * When the media server last saw them, as it timestamps it. Absent where nobody
   * has ever signed in, which is exactly the unclaimed invitations.
   */
  last_seen?: string | null;
  /**
   * The member, by the name their account is held under.
   */
  name: string;
  /**
   * What they asked for, newest first.
   */
  requests: DashboardMemberRequest[];
  /**
   * What this member would be told, in the words they would read it in.
   *
   * Everything a household member is owed at the moment of asking and cannot be
   * shown where they ask: what happens to what they ask for, what their period has
   * left and when it makes room, roughly what a thing costs before they choose one,
   * what is still waiting on an answer, and what was refused and why. Written to
   * them rather than about them, so it can be handed over as it stands.
   *
   * Empty where there is nothing to tell them — a member the request service holds
   * no account for has no standing to report and nothing waiting.
   */
  to_hand_over: string[];
}
/**
 * What they may watch.
 */
export interface MemberAccess {
  /**
   * Whether the account administers the media server.
   */
  administrator: boolean;
  /**
   * The highest rating they may watch, where the operator set a limit.
   */
  age_limit?: number | null;
  /**
   * Whether the account is switched off — held, but unable to sign in.
   */
  disabled: boolean;
  /**
   * Every library, rather than a chosen few. The ordinary case.
   */
  every_library: boolean;
  /**
   * The libraries they may watch where it is not every one, by the names the
   * operator gave them — or by the server's identifiers where the library list
   * could not be read, which a finding says.
   */
  libraries: string[];
  /**
   * What that limit comes to in the certificates this media server names, in the
   * operator's own country. Absent where no limit is set.
   */
  rated?: Rated | null;
  /**
   * What they are held to, in one word — including where what they may watch and
   * what they may ask for disagree.
   */
  restriction: "unrestricted" | "rating-limited" | "library-limited" | "both" | "inconsistent";
  /**
   * What becomes of content the media server has no rating for.
   *
   * Said either way, because an unexplained absence is the thing this answers: a
   * restricted member missing half the library is either this setting or a defect,
   * and an operator cannot tell which from silence.
   */
  unrated: "held-back" | "let-through";
}
/**
 * What one age limit comes to, in the certificates named for it.
 *
 * Both sides, because either alone misleads. What is allowed without what is held
 * back reads as a limit that stops nothing; what is held back without what is allowed
 * reads as a limit that stops everything.
 */
export interface Rated {
  /**
   * The certificates at the highest age this limit still lets through.
   *
   * Empty where the table names nothing at or below the limit, which is a limit
   * that lets nothing rated through at all.
   */
  allows: string[];
  /**
   * Whether these came from lemonfiber's own mapping because the media server's
   * table named no certificates.
   *
   * Carried rather than hidden: a certificate said to be this household's when it
   * is this program's is the kind of claim a parent would act on.
   */
  fell_back: boolean;
  /**
   * The certificates at the lowest age this limit holds back.
   *
   * Empty where the table names nothing above the limit, which is a limit that
   * holds nothing rated back at all.
   */
  holds_back: string[];
}
/**
 * What one member may ask for, where the request service could be asked.
 *
 * Both counts, because the service keeps them apart and folding them would report a
 * household as within its limit while the half that matters is spent: television is
 * counted a season at a time, so one ask for a six-season series spends six.
 */
export interface DashboardMemberAsking {
  films: Counted;
  /**
   * When the count next lets go of something, so one more becomes possible.
   *
   * Absent where nothing limits them, and where the request service's own dates
   * could not be read — an invented one would be a promise about a day on which
   * nothing happens. The period is a window that rolls rather than a month that
   * ends, so this is the moment their earliest counted request ages out.
   */
  frees_up?: string | null;
  /**
   * What happens to what they ask for.
   */
  policy: "trusted" | "within-a-limit" | "everything-waits";
  /**
   * Where they stand against what their period allows, taken over both counts.
   */
  standing: "unlimited" | "within-quota" | "near-quota" | "quota-exhausted";
  television: Counted1;
}
/**
 * Films, counted one to a request.
 */
export interface Counted {
  /**
   * How many the period allows. Absent where nothing limits them, which is a
   * different answer from a limit of nought.
   */
  limit?: number | null;
  /**
   * How long the period is, in the words a household says it in — absent where
   * the count runs from the beginning rather than over a window.
   */
  period?: string | null;
  /**
   * How many more they may ask for. Absent where nothing limits them.
   */
  remaining?: number | null;
  /**
   * How many the period has already counted against them.
   */
  used: number;
}
/**
 * Television, counted one to a season.
 */
export interface Counted1 {
  /**
   * How many the period allows. Absent where nothing limits them, which is a
   * different answer from a limit of nought.
   */
  limit?: number | null;
  /**
   * How long the period is, in the words a household says it in — absent where
   * the count runs from the beginning rather than over a window.
   */
  period?: string | null;
  /**
   * How many more they may ask for. Absent where nothing limits them.
   */
  remaining?: number | null;
  /**
   * How many the period has already counted against them.
   */
  used: number;
}
/**
 * One thing a household member asked for, and where it stands in their words.
 */
export interface DashboardMemberRequest {
  /**
   * About how much room it will want, at the quality in force.
   *
   * A guess and labelled as one — see [`crate::asking::Estimate`]. Absent where the
   * request service names a kind this build does not know, since there is nothing to
   * guess the length of.
   */
  estimate?: Estimate | null;
  /**
   * The number the request service files it under, which is how one is named again
   * when somebody rules on it.
   */
  id: number;
  /**
   * What kind of thing it is — a series, a film — in the household's own words.
   * Absent where the request service names a kind this build does not know.
   */
  media?: string | null;
  /**
   * Why it was turned down, where it was turned down from here.
   *
   * **The request service keeps none**, so this is lemonfiber's own record and is
   * said to be — a reason presented as delivered would end the operator's job at
   * exactly the point it begins. Absent on a request nobody has refused, and on one
   * refused in the request service itself, where there are no words to report and
   * inventing some would put them in somebody's mouth.
   *
   * Whether the words were carried to the person who asked is the record's own
   * `told`, which is why the two travel together: what an operator does next turns
   * on it, and a reason read without it is a reason of unknown standing.
   */
  refused?: Refused | null;
  /**
   * Where the request stands, or absent where the request service reports a status
   * this build does not know rather than guessing it into the nearest word.
   */
  state?: State2 | null;
  /**
   * What it is called, where the service filing it has been told about it and its
   * library could be read. Absent for a request no service holds yet — one still
   * awaiting approval has been handed to nobody, so there is no title to find.
   */
  title?: string | null;
  /**
   * How many whole days it has been waiting on somebody, where it is waiting at all
   * and the service's own date could be read.
   *
   * Only on the ones nobody has ruled on. A request already answered has not been
   * waiting since it was made, and a figure beside one would be counting the wrong
   * thing.
   */
  waiting_days?: number | null;
}
/**
 * About how much room one request will want.
 *
 * Carried as a number and a word rather than as a rendered string, so a surface can
 * put it in a column and still say what it is. The word is not decoration: a figure
 * with nothing hedging it is a promise, and this cannot keep one.
 */
export interface Estimate {
  /**
   * About how many bytes it will take.
   */
  bytes: number;
  /**
   * Whether this was measured. Always false — nothing here has measured anything,
   * and the field is present so that a surface rendering it cannot forget to say so.
   */
  measured: boolean;
}
/**
 * What was said when one request was turned down.
 */
export interface Refused {
  /**
   * When it was turned down, so somebody reading it later knows which answer this
   * was rather than assuming it is the newest.
   *
   * Absent where the machine's clock could not be written as a date, which is a
   * refusal worth keeping the words of and not worth losing them over.
   */
  at?: string | null;
  /**
   * Whether nobody ruled on it and the period the household agreed to closed it,
   * rather than an operator turning it down.
   *
   * The words are then this program's own, which is why the two are told apart here
   * and not left to be read off the sentence: an operator scanning for what happened
   * while they were away is looking for exactly the ones nobody answered, and a
   * member is owed the difference between having been refused and having run out.
   *
   * Absent from every record written before a household could arrange this, which is
   * the right reading of them — they are all somebody's own refusals.
   */
  expired?: boolean;
  /**
   * Why, in the words it was turned down in.
   */
  reason: string;
  /**
   * Whether the words have been carried to whoever asked, and where to.
   *
   * Absent until the one attempt has been made. **This is what makes a second one
   * impossible rather than unlikely**: carrying happens only where this is absent,
   * and it is written whether anything was reached or not — so a member with nowhere
   * to send to is asked about once, and a household is never told the same thing
   * twice by a run that happened to be started twice.
   */
  told?: Passed | null;
}
/**
 * Where a refusal's words were carried, and when.
 */
export interface Passed {
  /**
   * When the attempt was made, absent where the clock could not be written down.
   */
  at?: string | null;
  /**
   * The services they reached, by the names the member knows them by. Empty where
   * there was nowhere this could send.
   */
  to: string[];
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
export interface DashboardStorage {
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
export interface FrontDoorFrontDoorReport {
  /**
   * The address to hand them, read from this machine at the moment of asking
   * rather than remembered. Absent where there is no door, and where there is
   * one on a machine that will say neither what it is called nor where it is.
   */
  address?: Address | null;
  /**
   * Everything else the household can reach, and why none of it is the door.
   */
  beside: FrontDoorBeside[];
  /**
   * How this came to be the door: worked out from what the stack declares, named
   * by the operator, or named by them and refused.
   *
   * Carried as a state rather than left to the sentence beneath it, for the reason
   * the standing is: an operator whose setting was refused reads the sentence, and
   * a browser, a script or a dashboard reads this.
   */
  chosen:
    | {
        chosen: "derived";
      }
    | {
        chosen: "named";
        door: string;
      }
    | {
        chosen: "refused";
        door: Refusal;
      };
  /**
   * What that service is to them. Absent for the same reason.
   */
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
  /**
   * Where the front door stands.
   */
  standing: "established" | "library-only" | "unreachable" | "stranded" | "none";
}
/**
 * A service the household can reach that is not the front door, and why it is not.
 *
 * Carried rather than left out, because the decision is the useful part: an operator
 * who can see that the index over every service was considered and refused has been
 * told something, where one shown a single name has only been given an answer.
 */
export interface FrontDoorBeside {
  /**
   * Why it is not somewhere to begin.
   */
  because: string;
  /**
   * What a service published to the local network is to the people in the house.
   */
  facing: "asking" | "watching" | "shelf" | "operators" | "carriage" | "unstated";
  /**
   * The service, by the name it shows itself under.
   */
  service: string;
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
export interface HistoryReport {
  /**
   * The changes, newest first.
   */
  changes: ChangeReport[];
  /**
   * How far back the record goes, in the operator's terms.
   *
   * Stated rather than left to be inferred from the oldest entry: a record that has
   * been trimmed and one that has always been short look identical from the entries
   * alone, and only one of them means something is missing.
   */
  horizon: string;
}
/**
 * One change lemonfiber made, and whether it could be put back.
 */
export interface ChangeReport {
  /**
   * How many changes that one operation made, this one among them.
   *
   * An operation is the unit an operator agreed to, and undoing half of one leaves a
   * machine in a state nobody chose — so what a single line would take with it is on
   * the line rather than left to be counted off the list.
   */
  alongside: number;
  /**
   * When it was made.
   */
  at: string;
  /**
   * Why it could not go further, where it could not.
   */
  because?: string | null;
  /**
   * What it did, in the operator's terms.
   */
  did: string;
  /**
   * What to do instead, where there is something.
   */
  instead?: string | null;
  /**
   * The operation that made it — a seed, a reconfigure, an applied fix — so a
   * history reads as what happened rather than as bare diffs.
   */
  operation: string;
  /**
   * How far it could be put back: `whole`, `partial`, or `none`.
   */
  reversal: string;
  /**
   * What it was made to.
   */
  target: string;
}
/**
 * The payload.
 */
export interface HostingReport {
  /**
   * What is true of this manager and worth knowing before it is relied on.
   */
  caveat?: string | null;
  /**
   * What this run changed, where it was asked to change something.
   */
  changed?: Changed | null;
  /**
   * Every long-running command there is, hosted or not.
   */
  commands: HostedCommand[];
  /**
   * What to do instead, where lemonfiber cannot configure this platform.
   */
  instruction?: string | null;
  /**
   * The service manager this platform has, or the absence of one.
   */
  manager: "launchd" | "systemd" | "unsupported";
}
/**
 * What one run of this command did to the machine.
 */
export interface Changed {
  /**
   * Whether it installed it, rather than took it back.
   */
  installed: boolean;
  /**
   * The command it acted on.
   */
  name: string;
  /**
   * Whether this was a rehearsal, in which case nothing above happened.
   */
  rehearsed: boolean;
  /**
   * Whether it started the command, which only installing does.
   */
  started: boolean;
  /**
   * Everything it wrote or removed, so nothing goes unnamed in either direction.
   */
  touched: string[];
}
/**
 * One long-running command, and what stands between it and this machine.
 */
export interface HostedCommand {
  /**
   * How it is typed in a terminal, which is what hosting installs.
   */
  command: string;
  /**
   * The service definition installed for it, where there is one.
   */
  definition?: string | null;
  /**
   * What it does for as long as it runs, in one sentence.
   */
  guarantees: string;
  /**
   * The program the definition names, where nothing is there any more.
   */
  missing?: string | null;
  /**
   * lemonfiber's own name for it.
   */
  name: string;
  /**
   * Where a hosted run writes the words it would have said on a terminal.
   */
  output?: string | null;
  /**
   * The whole command line that definition runs.
   */
  runs?: string | null;
  /**
   * What stands between it and the machine.
   */
  standing: "not-hosted" | "hosted" | "installed-unverified" | "stopped" | "orphaned" | "unsupported";
}
/**
 * The payload.
 */
export interface HouseholdHouseholdReport {
  /**
   * What that policy allows in a period, in the words a household says it in.
   *
   * Absent where nothing limits the household, which is not the same as a policy
   * that could not be read: that one leaves [`Self::policy`] absent too.
   */
  allows?: string | null;
  /**
   * Whether the household could be read at all. A false here is why the list is
   * empty, and keeps an unread record from being mistaken for an empty house — the
   * same honesty a trace keeps about a silence it did not hear.
   */
  available: boolean;
  /**
   * What the limits on this household are and are not, where anybody carries one.
   *
   * Absent on a household nobody has limited, because there is no claim to be modest
   * about. Present the moment there is one, because a parent who has set a limit is
   * exactly the reader who might take it for a lock.
   */
  filtering?: string | null;
  /**
   * What could not be read, and anything else worth the operator's attention.
   */
  findings: string[];
  /**
   * Everybody the media server holds an account for, in name order — including
   * those who have never asked for anything, and the invitations nobody has taken
   * up yet.
   */
  members: HouseholdHouseholdMember[];
  /**
   * What happens to what the household asks for where nobody chose otherwise for
   * one person. Absent where the request service could not be asked.
   */
  policy?: Policy | null;
}
/**
 * One household member: who they are, what they may watch, when they were last
 * seen, and everything they have asked for.
 */
export interface HouseholdHouseholdMember {
  access: MemberAccess1;
  /**
   * What they may ask for, and what their period has left of it.
   *
   * Absent where the request service holds no account for them, and where it could
   * not be asked — an unread answer is not an unlimited member, and reporting one as
   * the other would tell an operator their quota was never applied.
   */
  asking?: HouseholdMemberAsking | null;
  /**
   * Whether somebody has set a password on the account. False is an invitation
   * nobody has taken up rather than a member who is not here.
   */
  claimed: boolean;
  /**
   * When the media server last saw them, as it timestamps it. Absent where nobody
   * has ever signed in, which is exactly the unclaimed invitations.
   */
  last_seen?: string | null;
  /**
   * The member, by the name their account is held under.
   */
  name: string;
  /**
   * What they asked for, newest first.
   */
  requests: HouseholdMemberRequest[];
  /**
   * What this member would be told, in the words they would read it in.
   *
   * Everything a household member is owed at the moment of asking and cannot be
   * shown where they ask: what happens to what they ask for, what their period has
   * left and when it makes room, roughly what a thing costs before they choose one,
   * what is still waiting on an answer, and what was refused and why. Written to
   * them rather than about them, so it can be handed over as it stands.
   *
   * Empty where there is nothing to tell them — a member the request service holds
   * no account for has no standing to report and nothing waiting.
   */
  to_hand_over: string[];
}
/**
 * What they may watch.
 */
export interface MemberAccess1 {
  /**
   * Whether the account administers the media server.
   */
  administrator: boolean;
  /**
   * The highest rating they may watch, where the operator set a limit.
   */
  age_limit?: number | null;
  /**
   * Whether the account is switched off — held, but unable to sign in.
   */
  disabled: boolean;
  /**
   * Every library, rather than a chosen few. The ordinary case.
   */
  every_library: boolean;
  /**
   * The libraries they may watch where it is not every one, by the names the
   * operator gave them — or by the server's identifiers where the library list
   * could not be read, which a finding says.
   */
  libraries: string[];
  /**
   * What that limit comes to in the certificates this media server names, in the
   * operator's own country. Absent where no limit is set.
   */
  rated?: Rated | null;
  /**
   * What they are held to, in one word — including where what they may watch and
   * what they may ask for disagree.
   */
  restriction: "unrestricted" | "rating-limited" | "library-limited" | "both" | "inconsistent";
  /**
   * What becomes of content the media server has no rating for.
   *
   * Said either way, because an unexplained absence is the thing this answers: a
   * restricted member missing half the library is either this setting or a defect,
   * and an operator cannot tell which from silence.
   */
  unrated: "held-back" | "let-through";
}
/**
 * What one member may ask for, where the request service could be asked.
 *
 * Both counts, because the service keeps them apart and folding them would report a
 * household as within its limit while the half that matters is spent: television is
 * counted a season at a time, so one ask for a six-season series spends six.
 */
export interface HouseholdMemberAsking {
  films: Counted2;
  /**
   * When the count next lets go of something, so one more becomes possible.
   *
   * Absent where nothing limits them, and where the request service's own dates
   * could not be read — an invented one would be a promise about a day on which
   * nothing happens. The period is a window that rolls rather than a month that
   * ends, so this is the moment their earliest counted request ages out.
   */
  frees_up?: string | null;
  /**
   * What happens to what a household member asks for.
   *
   * Three, and they are the three the request service can actually be put into. A
   * household is in one of them because of two settings taken together — whether requests
   * arrive unseen, and whether a period limits how many — so the words here are a reading
   * of that pair rather than a fourth setting kept beside it.
   *
   * Choosing per person is not a fourth policy. It is one of these three chosen for one
   * member rather than for the house, which is why what a surface offers is a policy and,
   * separately, who it is for.
   */
  policy: "trusted" | "within-a-limit" | "everything-waits";
  /**
   * Where they stand against what their period allows, taken over both counts.
   */
  standing: "unlimited" | "within-quota" | "near-quota" | "quota-exhausted";
  television: Counted3;
}
/**
 * Films, counted one to a request.
 */
export interface Counted2 {
  /**
   * How many the period allows. Absent where nothing limits them, which is a
   * different answer from a limit of nought.
   */
  limit?: number | null;
  /**
   * How long the period is, in the words a household says it in — absent where
   * the count runs from the beginning rather than over a window.
   */
  period?: string | null;
  /**
   * How many more they may ask for. Absent where nothing limits them.
   */
  remaining?: number | null;
  /**
   * How many the period has already counted against them.
   */
  used: number;
}
/**
 * Television, counted one to a season.
 */
export interface Counted3 {
  /**
   * How many the period allows. Absent where nothing limits them, which is a
   * different answer from a limit of nought.
   */
  limit?: number | null;
  /**
   * How long the period is, in the words a household says it in — absent where
   * the count runs from the beginning rather than over a window.
   */
  period?: string | null;
  /**
   * How many more they may ask for. Absent where nothing limits them.
   */
  remaining?: number | null;
  /**
   * How many the period has already counted against them.
   */
  used: number;
}
/**
 * One thing a household member asked for, and where it stands in their words.
 */
export interface HouseholdMemberRequest {
  /**
   * About how much room it will want, at the quality in force.
   *
   * A guess and labelled as one — see [`crate::asking::Estimate`]. Absent where the
   * request service names a kind this build does not know, since there is nothing to
   * guess the length of.
   */
  estimate?: Estimate | null;
  /**
   * The number the request service files it under, which is how one is named again
   * when somebody rules on it.
   */
  id: number;
  /**
   * What kind of thing it is — a series, a film — in the household's own words.
   * Absent where the request service names a kind this build does not know.
   */
  media?: string | null;
  /**
   * Why it was turned down, where it was turned down from here.
   *
   * **The request service keeps none**, so this is lemonfiber's own record and is
   * said to be — a reason presented as delivered would end the operator's job at
   * exactly the point it begins. Absent on a request nobody has refused, and on one
   * refused in the request service itself, where there are no words to report and
   * inventing some would put them in somebody's mouth.
   *
   * Whether the words were carried to the person who asked is the record's own
   * `told`, which is why the two travel together: what an operator does next turns
   * on it, and a reason read without it is a reason of unknown standing.
   */
  refused?: Refused | null;
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
  /**
   * How many whole days it has been waiting on somebody, where it is waiting at all
   * and the service's own date could be read.
   *
   * Only on the ones nobody has ruled on. A request already answered has not been
   * waiting since it was made, and a figure beside one would be counting the wrong
   * thing.
   */
  waiting_days?: number | null;
}
/**
 * The payload.
 */
export interface ImportReport {
  /**
   * What was carried across.
   */
  carried: RecordReport[];
  /**
   * What could not be carried, and why.
   */
  not_carried: UnsupportedReport[];
  /**
   * The project the records were read from.
   */
  project?: string | null;
  /**
   * Why nothing was carried, where nothing was.
   */
  refusal?: string | null;
  /**
   * Where the act stands.
   */
  stance: "unchanged" | "pending" | "blocked" | "applied";
  /**
   * What would be, where nothing has been yet.
   */
  would_carry: RecordReport[];
}
/**
 * One record carried across, or that would be.
 */
export interface RecordReport {
  /**
   * What kind of record it is, in the plural a person reads.
   */
  kind: string;
  /**
   * What it is called.
   */
  name: string;
  /**
   * The service it belongs to.
   */
  service: string;
}
/**
 * Something found that lemonfiber cannot take over, named rather than passed over.
 */
export interface UnsupportedReport {
  /**
   * Why it cannot be adopted, in the operator's terms.
   */
  because: string;
  /**
   * What was found, by the name the engine gives it.
   */
  what: string;
}
/**
 * The payload.
 */
export interface InvitationInvitation {
  /**
   * The one address to send them.
   *
   * Where a *person* reaches the media server: built from what this machine is
   * called on the network, not from either of the hosts the stack wires itself
   * with — those resolve only on this machine or inside the stack, and an
   * invitation carrying one sends somebody an address that cannot open.
   */
  address: string;
  /**
   * What this offer wrote on the account, where it wrote anything.
   */
  applied?: InvitationApplied | null;
  /**
   * What is worth knowing about the address itself, where anything is.
   *
   * An address that is a number is one a router can hand elsewhere, so a bookmark
   * made from it stops working with nothing here having changed. Carried on the
   * invitation because that is the copy somebody keeps.
   */
  caution?: string | null;
  /**
   * How many hours it stands before it is withdrawn.
   *
   * Counted from when it was *offered*, which for an account whose password was
   * taken off is the moment of the reset rather than when the account was made.
   * What happens at the end is withdrawal, and withdrawal removes the account.
   */
  hours: number;
  /**
   * Whether the request service knows about the household yet.
   *
   * Separate from `standing`, which is about the media-server account alone. The
   * two can disagree — an account made while the request service was unreachable
   * is `Made` and `NotYet` — and that disagreement is the state this reports.
   */
  linked: "made" | "not-yet" | "not-tried";
  /**
   * The name they sign in as.
   */
  name: string;
  /**
   * Whether the account was made, or only described.
   *
   * A rehearsal can say the whole answer without writing any of it — the name is
   * the one asked for, the address is the stack's, and what has run out has just
   * been read — so the only thing separating it from the real run is this.
   */
  rehearsed: boolean;
  /**
   * What was found where this was going.
   */
  standing: "made" | "waiting" | "joined" | "reset";
  /**
   * Invitations nobody claimed in time, taken back on the way past.
   *
   * Reported rather than done quietly: an operator who invited somebody last
   * week and hears nothing would otherwise have no way to learn the account is
   * gone. On a rehearsal these are the ones that *would* be taken back.
   */
  withdrawn: string[];
}
/**
 * What an invitation wrote on the account, in the household's own words.
 *
 * **Said back so an absence later is explicable.** A member held to a rating who
 * cannot find half the library is either this working or a defect, and an operator
 * with nothing on record cannot tell which. So the limit, the libraries, what happened
 * to content the media server has no rating for, and whether the request service was
 * held to the same decision all travel back on the answer that applied them.
 *
 * Absent where the offer set nothing at all, which is not the same as an offer that
 * set no restrictions: naming neither a library nor a limit is saying nothing about
 * access, and nothing is what gets written.
 *
 * Serialised in the field names the household read uses for the same facts, rather
 * than in the invitation's own spelling: one setting named two ways across two shapes
 * is two shapes a client has to be told are about the same thing.
 */
export interface InvitationApplied {
  /**
   * What a limit here is, and what it is not.
   *
   * Carried on the answer rather than left to a document, because the reader who
   * most needs it is the parent who has just set one.
   */
  filtering: string;
  /**
   * The libraries they may open, as the operator named them. Empty is every one.
   */
  libraries: string[];
  /**
   * How far up the ratings they may watch, in the words and the certificates this
   * media server names in the operator's own country. Absent where no limit was set.
   */
  limit?: string | null;
  /**
   * Whether the request service was held to the same decision.
   *
   * The same three answers a link carries, and for the same reason: what somebody
   * may *ask for* is a second service's business, and that service can be down while
   * the media server is not. `NotTried` here is a service with no account for them
   * yet — nothing to hold rather than a failure to hold something.
   */
  requesting: "made" | "not-yet" | "not-tried";
  /**
   * What becomes of content the media server has no rating for.
   *
   * Held back by default on somebody being narrowed, because a rating limit cannot
   * decide about a thing that carries no rating. The cost is real and is why this is
   * reported rather than assumed: some legitimate content becomes invisible to them.
   */
  unrated: "held-back" | "let-through";
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
export interface MigrationReport {
  /**
   * Where each service would listen to run beside the existing setup.
   */
  beside: MovedReport[];
  /**
   * What adopting each recognised service would come to, by service name.
   */
  carrying: CarryingReport[];
  /**
   * Ports wanted by lemonfiber that an existing service already holds.
   */
  conflicts: ConflictReport[];
  /**
   * What the existing layout costs where it cannot hold a hardlink, absent where
   * it can.
   */
  linking?: LinkingReport | null;
  /**
   * What may be done about what was found, least destructive first.
   */
  modes: ModeReport[];
  /**
   * What no migration carries across, whatever mode it runs in.
   */
  not_carried: UnsupportedReport[];
  /**
   * Whether the engine answered at all.
   *
   * False means the survey found nothing because it could not look, which is a
   * different answer from finding nothing, and the only one that must never be
   * read as an empty machine.
   */
  read: boolean;
  /**
   * Existing projects, by project name.
   */
  standing: StandingReport[];
  /**
   * What was found and cannot be adopted.
   */
  unsupported: UnsupportedReport[];
}
/**
 * A port lemonfiber wants for a service that something else already answers on.
 */
export interface ConflictReport {
  /**
   * The project already holding it.
   */
  held_by: string;
  /**
   * The host port both want.
   */
  port: number;
  /**
   * The lemonfiber service that would publish it.
   */
  wanted_by: string;
}
/**
 * What an existing layout costs, where it cannot hold a hardlink.
 */
export interface LinkingReport {
  /**
   * Why they cannot, naming the filesystems it is about.
   */
  because: string;
  /**
   * What that costs, in room rather than in adjectives.
   */
  cost: string;
  /**
   * The filesystems the existing setup keeps its data on.
   */
  filesystems: string[];
  /**
   * Whether lemonfiber will do it. Always false: the layout and the library in it
   * are the operator's, and correctness does not outrank their data.
   */
  forced: boolean;
  /**
   * Whether imports can be hardlinks across this layout. False whenever this is
   * reported at all, since a layout that links is not reported.
   */
  links: boolean;
  /**
   * What would fix it, offered.
   */
  remedy: string;
}
/**
 * One thing an operator may do about a setup already here.
 */
export interface ModeReport {
  /**
   * Whether carrying it out stops or alters what is already running.
   */
  disturbs: boolean;
  /**
   * The word an operator types for it.
   */
  mode: string;
  /**
   * Whether it is offered already chosen. Only adopting is.
   */
  preselected: boolean;
  /**
   * What choosing it would come to, in the operator's terms.
   */
  what: string;
}
/**
 * One Compose project on this machine that is not lemonfiber's.
 */
export interface StandingReport {
  /**
   * The Compose project name.
   */
  project: string;
  /**
   * Its containers, by service name.
   */
  services: OccupantReport[];
}
/**
 * One container of somebody else's stack, as the engine reports it.
 */
export interface OccupantReport {
  /**
   * Whether lemonfiber knows this service and could take it over as it stands.
   */
  adoptable: boolean;
  /**
   * Every host port it publishes, lowest first.
   */
  ports: number[];
  /**
   * Whether it is running now, as against present but stopped.
   */
  running: boolean;
  /**
   * The Compose service name it answers to.
   */
  service: string;
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
export interface OutboundLeaving {
  /**
   * Every request lemonfiber makes on its own account, in a fixed order.
   */
  ours: OutboundOutbound[];
  /**
   * The requests made by services this stack runs, attributed to them.
   */
  theirs: Elsewhere[];
}
/**
 * One request lemonfiber makes, where it goes, and what refusing it costs.
 */
export interface OutboundOutbound {
  /**
   * Whether this machine's settings allow it.
   */
  allowed: boolean;
  /**
   * What stops working once it is off.
   */
  cost: string;
  /**
   * Where it goes as this machine is configured. Empty where nothing is
   * configured to reach, which is not the same as switched off.
   */
  destination: string[];
  /**
   * Why lemonfiber asks.
   */
  purpose: string;
  /**
   * Which request this is.
   */
  reach: "registry" | "guides" | "echo" | "indexer" | "usenet" | "household" | "updates";
  /**
   * Exactly what travels in the request.
   */
  sends: string;
  /**
   * The setting that switches it off.
   */
  switch: string;
}
/**
 * A request one of the stack's services makes, which is not lemonfiber's.
 */
export interface Elsewhere {
  /**
   * Where its requests go, in the terms an operator would recognise.
   */
  destination: string;
  /**
   * What it asks for.
   */
  purpose: string;
  /**
   * The service, by the id the stack declares it under.
   */
  service: string;
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
export interface HouseholdRemoval {
  /**
   * Whether the request service holds an account for them at all.
   *
   * False where they never signed in there, which is nothing to revoke rather than a
   * revocation that failed.
   */
  "asks-through-the-request-service": boolean;
  /**
   * Whether it was carried out, or only described pending confirmation.
   */
  confirmed: boolean;
  /**
   * What could not be done, and anything else worth the operator's attention.
   */
  findings: string[];
  /**
   * The name their account is held under, as the media server spells it rather than
   * as the operator typed it.
   */
  name: string;
  /**
   * How many of their requests go with them.
   *
   * **They are destroyed, not reassigned.** The request service removes them by hand
   * so that a title still waiting goes back to being unrequested rather than pointing
   * at nobody — so this is a count of things that will stop existing.
   */
  requests: number;
  /**
   * How far it got.
   */
  revoked: "everywhere" | "media-server-only" | "nothing";
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
export interface ReplaceReport {
  /**
   * The project that would be stood in place of.
   */
  project?: string | null;
  /**
   * Why nothing was stopped, where nothing was.
   */
  refusal?: string | null;
  /**
   * Where the act stands.
   */
  stance: "unchanged" | "pending" | "blocked" | "applied";
  /**
   * The services that would not stop and are still up.
   */
  still_running: string[];
  /**
   * The services that were stopped.
   */
  stopped: string[];
  /**
   * The services that would be stopped, by name.
   */
  would_stop: string[];
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
  would: RestorePreview;
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
      }
    | {
        /**
         * The Compose project the capture was taken from.
         */
        project: string;
        scope: "existing";
        /**
         * The host trees captured, in the order the survey reported them.
         */
        trees: Tree[];
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
export interface RestorePreview {
  /**
   * What this listing is, so consent given for it can name which listing it read.
   *
   * Carried on every listing rather than only on the ones that would re-point
   * something: a surface that has to look for it is a surface that can fail to
   * find it, and a restore that would overwrite the same configuration in place
   * is still one somebody may agree to.
   */
  agreement: string;
  /**
   * Whether the archive is old enough that a compatibility warning applies.
   */
  downgrade: boolean;
  manifest: RestoreManifest;
  /**
   * The data-root difference, where the archive was taken against another one.
   */
  relocation?: Relocation | null;
}
/**
 * The archive's own account of itself — its scope, version and contents.
 */
export interface RestoreManifest {
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
      }
    | {
        /**
         * The Compose project the capture was taken from.
         */
        project: string;
        scope: "existing";
        /**
         * The host trees captured, in the order the survey reported them.
         */
        trees: Tree[];
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
export interface SelfUpdateUpdateReport {
  /**
   * What updating leaves alone, and what it needs afterwards.
   */
  afterwards: string;
  /**
   * The version the operator asked to move to, where they asked for one.
   */
  asked?: string | null;
  /**
   * Where the running binary is, with any link followed, or nothing where this
   * machine would not say.
   *
   * The answer to which of several copies on a search path is the one that ran, so
   * a version somebody quotes can be attributed to a file rather than to a name.
   */
  at?: string | null;
  /**
   * What a release brings besides the program, and when any of it is fetched.
   */
  carries: string;
  /**
   * Exactly what to type, where there is something exact to type.
   */
  command?: string | null;
  /**
   * Whether the version named can read the configuration on this machine.
   *
   * Only where a version was named, since it is the question a downgrade asks and
   * nothing else does.
   */
  configuration?: string | null;
  /**
   * How this copy got onto the machine.
   */
  installed: "homebrew" | "scoop" | "winget" | "cargo" | "distribution" | "installer" | "elsewhere" | "untellable";
  /**
   * Why there is nothing exact to type, where there is not.
   */
  instead?: string | null;
  /**
   * The newest version released, where the check could read one.
   */
  offered?: string | null;
  /**
   * The tool that owns this copy, where one does.
   */
  owner?: string | null;
  /**
   * Whether the directory holding the running binary can be written to.
   *
   * Nothing where it was not asked, which is every copy a package manager owns —
   * replacing one of those is that tool's business and not this one's. Asked by
   * trying rather than by reading permission bits, and reported rather than acted
   * on: a copy this operator cannot replace is a thing to say with the path, never
   * a reason to go looking for a way to become somebody else.
   */
  replaceable?: boolean | null;
  /**
   * The version running now.
   */
  running: string;
  /**
   * Which of the states this is.
   */
  standing: "current" | "update-available" | "managed-externally" | "check-failed";
  /**
   * Why availability could not be told, where it could not.
   */
  untold?: string | null;
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
export interface SpaceReckoning {
  /**
   * What this offer names itself, so an answer to it can say which offer it was
   * answering.
   */
  agreement: string;
  /**
   * The completed downloads, each with where it stands and what removing it
   * would cost.
   */
  candidates: SpaceCandidate[];
  /**
   * Where the room went, one line per tree plus the services' own files, and
   * one line for what is committed but has not landed yet.
   */
  consumption: SpaceConsumption[];
  /**
   * Whether new acquisitions are halted to keep the services writable.
   */
  halted: boolean;
  /**
   * The imports that stopped part-way, with what is on disk for each.
   */
  interrupted: Interrupted[];
  /**
   * Where the stack stands, which is where its worst volume stands.
   */
  level: "unknown" | "ample" | "advisory" | "warning" | "critical" | "exhausted";
  /**
   * The files far enough out of line with the rest to be worth pointing at.
   */
  outsized: Outsized[];
  /**
   * What of that room could be got back, and what each would cost.
   *
   * A second reading of bytes already counted above rather than more of them: a
   * seeding torrent's file is in the tree it lives in *and* here. Summing the
   * two lists together would double what is on the disk, which is the mistake
   * this whole module is arranged to avoid.
   */
  reclaimable: SpaceConsumption[];
  /**
   * What became of a confirmed cleanup, where one was asked for.
   */
  reclaimed?: SpaceReclaimed | null;
  /**
   * The volumes watched. Either filling stops the stack, so both are reported
   * whether or not they are the same drive.
   */
  volumes: Volume[];
}
/**
 * One completed download, and what reclaiming it would come to.
 */
export interface SpaceCandidate {
  /**
   * What it occupies.
   */
  bytes: number;
  /**
   * What removing it costs, where it costs anything.
   */
  consequence?: string | null;
  /**
   * What both sides call it.
   */
  name: string;
  /**
   * Where it stands.
   */
  standing:
    | {
        standing: "never_imported";
      }
    | {
        /**
         * What it has uploaded against what it downloaded, in hundredths, as the
         * client reports it.
         *
         * A whole number rather than a fraction because every report this product
         * makes is compared for equality somewhere, and a fraction cannot be —
         * two figures a client would call the same would not be. The hundredth is
         * finer than any decision made on a ratio.
         */
        ratio: number;
        standing: "seeding";
      }
    | {
        standing: "left_alone";
      };
}
/**
 * One line of the accounting.
 */
export interface SpaceConsumption {
  /**
   * What it is about.
   */
  category:
    | {
        name: string;
        of: "tree";
      }
    | {
        of: "landing";
      }
    | {
        of: "seeding";
      }
    | {
        of: "orphaned";
      }
    | {
        of: "extracted";
      }
    | {
        of: "services";
      }
    | {
        of: "unmanaged";
      };
  /**
   * What getting it back would cost.
   */
  reclaim:
    | "by_losing_content"
    | "in_progress"
    | "at_the_cost_of_ratio"
    | "the_easy_win"
    | "already_have_it"
    | "marginally"
    | "you_said_not";
  tally: Tally;
}
/**
 * What it occupies, counted both ways.
 */
export interface Tally {
  /**
   * How many names were counted.
   */
  files: number;
  /**
   * The bytes the names add up to — what this would take with nothing shared.
   */
  logical: number;
  /**
   * The bytes the underlying files add up to — what the volume has actually
   * lost to them.
   */
  physical: number;
  /**
   * How many of those names pointed at a file already counted.
   */
  shared: number;
}
/**
 * An import that stopped part-way, in the words of whatever stopped it.
 */
export interface Interrupted {
  /**
   * What the service calls it.
   */
  name: string;
  /**
   * What is on disk for it already, where the walk could find it.
   */
  partial: number;
  /**
   * What the service said, verbatim.
   */
  said: string;
}
/**
 * One file far larger than the rest.
 */
export interface Outsized {
  /**
   * What it occupies.
   */
  bytes: number;
  /**
   * Where it is.
   */
  path: string;
  /**
   * How many times the middle file of this walk it is.
   */
  times_typical: number;
}
/**
 * What became of a confirmed cleanup.
 */
export interface SpaceReclaimed {
  /**
   * What they occupied.
   */
  bytes: number;
  /**
   * The paths that were taken.
   */
  gone: string[];
  /**
   * What could not be taken, and what the platform said about it.
   */
  left: SpaceLeft[];
}
/**
 * Something a cleanup could not take.
 */
export interface SpaceLeft {
  /**
   * Where it is.
   */
  at: string;
  /**
   * What the platform said, verbatim.
   */
  why: string;
}
/**
 * One volume, as one run measured it.
 */
export interface Volume {
  /**
   * The path that was measured.
   */
  at: string;
  /**
   * The bytes already committed to landing here.
   */
  committed: number;
  /**
   * Bytes free, or nothing where the volume could not be read.
   */
  free?: number | null;
  /**
   * Where it stands.
   */
  level: "unknown" | "ample" | "advisory" | "warning" | "critical" | "exhausted";
  /**
   * The effective limit — the mount's own size, which on a dataset given a
   * quota is the quota rather than the device beneath it.
   */
  limit?: number | null;
  /**
   * Where the volume holding it is mounted, which is what the limit belongs to.
   */
  point: string;
  /**
   * What would be free once the committed content has landed.
   */
  projected?: number | null;
  /**
   * What the reading is worth.
   */
  reading:
    | {
        as: "live";
      }
    | {
        as: "as_of";
        at: number;
      };
  /**
   * Which of the two this is.
   */
  role: "data" | "services";
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
export interface StopSeedingLetting {
  /**
   * What this offer names itself, so an answer to it can say which offer it
   * answered.
   */
  agreement: string;
  download: StopSeedingCandidate;
  /**
   * What goes with it, carried rather than left for a surface to remember.
   */
  goes: string;
  /**
   * What became of an answered offer, and nothing where the offer is all this is.
   */
  gone?: Gone | null;
}
/**
 * The download, in the same words the account names it in: where it stands, what
 * it occupies, and what removing it costs.
 */
export interface StopSeedingCandidate {
  /**
   * What it occupies.
   */
  bytes: number;
  /**
   * What removing it costs, where it costs anything.
   */
  consequence?: string | null;
  /**
   * What both sides call it.
   */
  name: string;
  /**
   * Where it stands.
   */
  standing:
    | {
        standing: "never_imported";
      }
    | {
        /**
         * What it has uploaded against what it downloaded, in hundredths, as the
         * client reports it.
         *
         * A whole number rather than a fraction because every report this product
         * makes is compared for equality somewhere, and a fraction cannot be —
         * two figures a client would call the same would not be. The hundredth is
         * finer than any decision made on a ratio.
         */
        ratio: number;
        standing: "seeding";
      }
    | {
        standing: "left_alone";
      };
}
/**
 * What became of a download the client was asked to let go.
 */
export interface Gone {
  /**
   * What it occupied, as the client reported it.
   */
  bytes: number;
  /**
   * What the client is no longer holding.
   */
  name: string;
  /**
   * Whether this was a rehearsal, which asks the client for nothing.
   */
  rehearsed: boolean;
}
/**
 * The payload.
 */
export interface StoredStored {
  /**
   * What is on this machine that is not lemonfiber's to keep or remove.
   */
  beside: StoredBeside[];
  /**
   * Each thing kept, configuration first and then what can be made again.
   */
  kept: Kept[];
  /**
   * Whether this run removed any of it.
   */
  removal:
    | {
        state: "not-asked";
      }
    | {
        state: "unconfirmed";
      }
    | {
        /**
         * The directories that are gone.
         */
        gone: string[];
        /**
         * What could not be removed, each with the reason.
         */
        left: StoredLeft[];
        state: "done";
      };
  /**
   * The two directories all of it lives under.
   */
  roots: Root[];
}
/**
 * Something on this machine that lemonfiber neither keeps nor removes.
 */
export interface StoredBeside {
  /**
   * What it is.
   */
  what: string;
  /**
   * Whose it is, and why it is not lemonfiber's to take away.
   */
  why: string;
}
/**
 * One thing lemonfiber keeps on this machine.
 */
export interface Kept {
  /**
   * Where it is, in full.
   */
  at: string;
  /**
   * Whether it holds a credential, which is what decides how carefully a copy of
   * it has to be treated.
   */
  secret: boolean;
  /**
   * What it is, in the operator's words.
   */
  what: string;
  /**
   * Why it is kept.
   */
  why: string;
}
/**
 * Something a removal could not take away.
 */
export interface StoredLeft {
  /**
   * The path that is still there.
   */
  at: string;
  /**
   * What the machine said about it, so it can be finished by hand.
   */
  why: string;
}
/**
 * A directory everything lemonfiber keeps sits under.
 */
export interface Root {
  /**
   * The directory itself.
   */
  at: string;
  /**
   * What lives under it, and what losing it would cost.
   */
  what: string;
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
export interface UndoReversal {
  /**
   * What was not put back, each with the reason it was not.
   *
   * A reversal an operator asked for by name has to say what it did *not* do. Five
   * changes asked back and three carried out is a machine in a state nobody has been
   * told about, and "some of it worked" is the sentence that makes somebody go
   * looking by hand. Empty where everything went back, which is the common case.
   */
  left: UndoLeft[];
  /**
   * What was put back, in the order it was.
   */
  reversed: Undo[];
}
/**
 * One change a reversal did not put back, and why it did not.
 */
export interface UndoLeft {
  /**
   * Why it is still standing, in the operator's terms.
   */
  because: string;
  /**
   * What the change was against — a service, or lemonfiber's own environment file.
   */
  target: string;
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
        /**
         * What lemonfiber put there, which has to still be there for putting the
         * old value back to be putting anything back.
         *
         * Carried so that a reversal can ask whether it is undoing its own work.
         * Without it a reversal knows only what it would like the setting to say,
         * and a setting the operator has since chosen for themselves reads exactly
         * like one nobody has touched.
         */
        wrote: string;
      }
    | {
        does: "delete";
        /**
         * The path to remove.
         */
        path: string;
      }
    | {
        /**
         * The version this run moved it to, which has to still be the one running
         * for putting the old one back to be putting anything back.
         */
        current: string;
        does: "repin";
        /**
         * The version to put back.
         */
        previous: string;
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
export interface UninstallUninstall {
  manifest: UninstallManifest;
  /**
   * Whether anything was removed on this run.
   */
  removal:
    | {
        state: "surveyed";
      }
    | {
        state: "confirmed";
      }
    | {
        /**
         * The credentials this destroyed, said rather than left to be inferred.
         */
        credentials: string[];
        /**
         * What went, by the name the manifest gave it.
         */
        gone: string[];
        state: "complete";
      }
    | {
        /**
         * The credentials this destroyed.
         */
        credentials: string[];
        /**
         * What went, by the name the manifest gave it.
         */
        gone: string[];
        /**
         * What is still there, and how to remove it.
         */
        left: UninstallLeft[];
        state: "partial";
      };
}
/**
 * What removing would come to, or what it came to.
 */
export interface UninstallManifest {
  /**
   * What this reading names itself, so an answer says which reading it answered.
   */
  agreement: string;
  /**
   * Whether a backup was offered before configuration is destroyed, and how.
   */
  backup?: string | null;
  /**
   * What the lines that are going occupy, where that is knowable.
   */
  bytes: number;
  /**
   * What is still coming down, which stopping would interrupt.
   */
  coming: Coming[];
  confidence: UninstallConfidence;
  /**
   * What is beneath the data location that the stack did not put there.
   *
   * Not a warning. While this is non-empty the data location is never removed as
   * one tree, and only the stack's own directories beneath it are offered.
   */
  foreign: Foreign[];
  /**
   * Every line it reaches, each said to be going or said to be kept.
   */
  items: Item[];
  /**
   * What it leaves alone, in the operator's words.
   */
  keeps: string;
  /**
   * What lemonfiber cannot remove, each with how to remove it by hand.
   */
  outside: Outside[];
  /**
   * What it takes, in the operator's words.
   */
  removes: string;
  /**
   * Which removal this is.
   */
  tier: "stop" | "services" | "configuration" | "media";
  /**
   * Whether the data location is on a network share or a drive that unplugs.
   *
   * Said where it is, so removing across a mount an operator forgot was a mount is
   * something they read before agreeing rather than after.
   */
  volume?: string | null;
}
/**
 * One download still coming down when the removal was asked for.
 */
export interface Coming {
  /**
   * What it is, as the client names it.
   */
  name: string;
  /**
   * How far along, from zero to a hundred.
   */
  progress: number;
}
/**
 * How much of this was read, and what could not be.
 */
export interface UninstallConfidence {
  /**
   * Whether every source this tier needed answered.
   */
  complete: boolean;
  /**
   * What could not be read, each in the words of whatever refused.
   *
   * The point of the field: a manifest that is short says so and says why, rather
   * than reading as a machine with less on it than it has.
   */
  unread: string[];
}
/**
 * Something beneath the data location that the stack did not put there.
 */
export interface Foreign {
  /**
   * The directory it is in, relative to the data location — or the file itself,
   * where it sits directly in the data location.
   */
  at: string;
  /**
   * What they occupy.
   */
  bytes: number;
  /**
   * How many files were found under it.
   */
  files: number;
}
/**
 * One thing a removal reaches, said to be going or said to be kept.
 */
export interface Item {
  /**
   * What it occupies, where that is knowable. Absent for a container or a network,
   * whose room is the image's rather than their own.
   */
  bytes?: number | null;
  /**
   * Why it is being kept rather than removed, where it is being kept.
   *
   * `None` is the ordinary case: this line is going. A reason here is the whole of
   * how an image shared with another project, or a path this run could not
   * confirm, stays on the list without being taken.
   */
  kept?: string | null;
  /**
   * What it is called — a container name, an image reference, or a full path.
   */
  name: string;
  /**
   * Whether it holds a credential, so a report can say what destroying it destroys.
   */
  secret: boolean;
  /**
   * Which of the four sorts of thing it is.
   */
  sort: "container" | "network" | "image" | "path";
  /**
   * What it is, in the operator's words.
   */
  what: string;
}
/**
 * Something an uninstall leaves behind, and how to remove it by hand.
 */
export interface Outside {
  /**
   * How to remove it on this platform, as the operator would type or do it.
   */
  by_hand: string;
  /**
   * Whether this machine was found to have it.
   *
   * A survey that could not look says nothing was found rather than that nothing
   * is there, which is why the entry is listed either way and this field carries
   * the difference.
   */
  found: boolean;
  /**
   * What it is.
   */
  what: string;
  /**
   * Why it is not lemonfiber's to take away.
   */
  why: string;
}
/**
 * Something a removal could not take.
 */
export interface UninstallLeft {
  /**
   * How to finish it by hand.
   */
  by_hand: string;
  /**
   * What is still there.
   */
  name: string;
  /**
   * What the machine said about it, verbatim.
   */
  why: string;
}
/**
 * The payload.
 */
export interface UpdateReport {
  /**
   * What became of each service the run reached, in the order it reached them.
   */
  applied: UpdateApplied[];
  /**
   * Where the backup taken before anything moved was written.
   */
  backup?: string | null;
  /**
   * What would move, and what taking each step means.
   */
  changes: UpdateChange[];
  /**
   * Whether the steps were agreed to, or only shown.
   */
  confirmed: boolean;
  /**
   * Why the stack is not as the run found it, where it is not.
   *
   * Two runs end that way and an operator has the same thing to do about either:
   * one that met a service which would not come back and stopped there, and one
   * where every step succeeded and the stack would not start again afterwards.
   * The second is not a failure of the update — `state` still says `Updated`,
   * because it is — but the stack came down for the capture and something has to
   * say that it is still down.
   */
  halted?: string | null;
  /**
   * What the download clients are still working on, named so an operator can
   * tell whether the thing they have been waiting for is among them.
   */
  in_flight: string[];
  /**
   * Stack files the operator had edited, left as they set them rather than
   * overwritten with this build's own, each with the change that was held back.
   */
  stack_edits: StackEdit[];
  /**
   * The one word the run comes to.
   */
  state: "current" | "updates-available" | "updated" | "partial" | "failed";
}
/**
 * What one service's update came to.
 */
export interface UpdateApplied {
  /**
   * What went wrong, where anything did.
   */
  detail?: string | null;
  /**
   * How it ended.
   */
  ending: "updated" | "not-fetched" | "not-started" | "not-reached";
  /**
   * The version it was standing on before the run.
   */
  from: string;
  /**
   * How it could be put back, given how it ended.
   */
  reversal: "rollback" | "restore";
  /**
   * The service it is about.
   */
  service: string;
  /**
   * The version the run was moving it to.
   */
  to: string;
}
/**
 * What updating one service would change.
 */
export interface UpdateChange {
  /**
   * What the step means, in the words an operator decides on.
   */
  because: string;
  /**
   * The version it is standing on now.
   */
  current: string;
  /**
   * Whether taking it is a step nothing walks back.
   */
  irreversible: boolean;
  /**
   * How large the step between them is.
   */
  jump: "major" | "minor" | "patch" | "untellable";
  /**
   * Whether lemonfiber refuses to take it at all.
   */
  refused: boolean;
  /**
   * The service, by its manifest id, which is also its Compose service name.
   */
  service: string;
  /**
   * The version this build pins for it.
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
export interface VersionVersionReport {
  /**
   * The running binary's version.
   */
  binary: string;
  changelog: VersionNotes;
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
 * What this build's release changed, and every release there has been.
 */
export interface VersionNotes {
  /**
   * Every release the record holds, newest first.
   */
  releases: VersionSummary[];
  /**
   * What each requirement the running release cites is, and where it is defined.
   */
  requirements: {
    [k: string]: Requirement;
  };
  /**
   * What the running version changed, where the record holds its release.
   */
  running?: Release | null;
  /**
   * Whether the record describes what this build could have shipped.
   */
  state: "current" | "pending" | "stale";
}
/**
 * One release as a listing shows it: everything but what it changed.
 *
 * Kept apart from [`Release`] rather than being it with the entries left out,
 * because the two are read for different things. A listing answers which releases
 * there have been and which of them was taken back; only the one being read needs
 * to carry every line of what it changed.
 */
export interface VersionSummary {
  /**
   * What it set out to deliver.
   */
  delivers?: string | null;
  /**
   * The version this one patched, where it is a patch.
   */
  patches?: string | null;
  /**
   * The day it was published, where the record of it says.
   */
  released_on?: string | null;
  /**
   * Whether anything in it is a change an operator would notice.
   */
  user_facing: boolean;
  /**
   * The version.
   */
  version: string;
  /**
   * Why it was withdrawn, where it was.
   */
  withdrawn?: string | null;
}
/**
 * One requirement, and every release that shipped something citing it.
 */
export interface Requirement {
  /**
   * The feature it belongs to, in words.
   */
  feature: string;
  /**
   * Every version that shipped something citing it, newest first.
   */
  shipped_in: string[];
  /**
   * Where it is defined, unless it has since been withdrawn.
   */
  url?: string | null;
  /**
   * Whether it was withdrawn after it shipped.
   */
  withdrawn?: boolean;
}
/**
 * One release, and everything the record holds about it.
 */
export interface Release {
  /**
   * The version whose goals this tag carried, where that is not its own.
   */
  carried?: string | null;
  /**
   * What it set out to deliver, in the words the version was staged under.
   */
  delivers?: string | null;
  /**
   * The changes, gathered by what kind of change each is.
   */
  groups: Group[];
  /**
   * The version this one patched, where it is a patch.
   */
  patches?: string | null;
  /**
   * The day it was published, where the record of it says.
   */
  released_on?: string | null;
  /**
   * The tag it was cut from.
   */
  tag: string;
  /**
   * Whether anything in it is a change an operator would notice.
   */
  user_facing: boolean;
  /**
   * The version, without the tag's leading letter.
   */
  version: string;
  /**
   * Why it was withdrawn, where it was.
   */
  withdrawn?: string | null;
}
/**
 * The entries of one kind, under the name an operator reads them by.
 */
export interface Group {
  /**
   * The changes, in the order they were made.
   */
  entries: Entry[];
  /**
   * What this group of changes is: new, fixed, faster, or maintenance.
   */
  title: string;
}
/**
 * One change, as a reader meets it.
 */
export interface Entry {
  /**
   * Where it was reviewed, where it was reviewed anywhere.
   */
  reference?: string | null;
  /**
   * The requirements it served, which are the link rather than the headline.
   */
  requirements: string[];
  /**
   * What changed, in the words it was written in.
   */
  summary: string;
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

/** The envelope carrying `admission`. */
export type AdmissionEnvelope = Contract["admission"];

/** The envelope carrying `adoption`. */
export type AdoptionEnvelope = Contract["adoption"];

/** The envelope carrying `alerts`. */
export type AlertsEnvelope = Contract["alerts"];

/** The envelope carrying `archives`. */
export type ArchivesEnvelope = Contract["archives"];

/** The envelope carrying `backup`. */
export type BackupEnvelope = Contract["backup"];

/** The envelope carrying `bandwidth`. */
export type BandwidthEnvelope = Contract["bandwidth"];

/** The envelope carrying `beside`. */
export type BesideEnvelope = Contract["beside"];

/** The envelope carrying `bundle`. */
export type BundleEnvelope = Contract["bundle"];

/** The envelope carrying `clients`. */
export type ClientsEnvelope = Contract["clients"];

/** The envelope carrying `config`. */
export type ConfigEnvelope = Contract["config"];

/** The envelope carrying `credentials`. */
export type CredentialsEnvelope = Contract["credentials"];

/** The envelope carrying `dashboard`. */
export type DashboardEnvelope = Contract["dashboard"];

/** The envelope carrying `doctor`. */
export type DoctorEnvelope = Contract["doctor"];

/** The envelope carrying `error`. */
export type ErrorEnvelope = Contract["error"];

/** The envelope carrying `forms`. */
export type FormsEnvelope = Contract["forms"];

/** The envelope carrying `front-door`. */
export type FrontDoorEnvelope = Contract["front-door"];

/** The envelope carrying `glossary`. */
export type GlossaryEnvelope = Contract["glossary"];

/** The envelope carrying `history`. */
export type HistoryEnvelope = Contract["history"];

/** The envelope carrying `hosting`. */
export type HostingEnvelope = Contract["hosting"];

/** The envelope carrying `household`. */
export type HouseholdEnvelope = Contract["household"];

/** The envelope carrying `import`. */
export type ImportEnvelope = Contract["import"];

/** The envelope carrying `invitation`. */
export type InvitationEnvelope = Contract["invitation"];

/** The envelope carrying `job`. */
export type JobEnvelope = Contract["job"];

/** The envelope carrying `lifecycle`. */
export type LifecycleEnvelope = Contract["lifecycle"];

/** The envelope carrying `log`. */
export type LogEnvelope = Contract["log"];

/** The envelope carrying `migration`. */
export type MigrationEnvelope = Contract["migration"];

/** The envelope carrying `music`. */
export type MusicEnvelope = Contract["music"];

/** The envelope carrying `outbound`. */
export type OutboundEnvelope = Contract["outbound"];

/** The envelope carrying `preview`. */
export type PreviewEnvelope = Contract["preview"];

/** The envelope carrying `pull`. */
export type PullEnvelope = Contract["pull"];

/** The envelope carrying `quality`. */
export type QualityEnvelope = Contract["quality"];

/** The envelope carrying `removal`. */
export type RemovalEnvelope = Contract["removal"];

/** The envelope carrying `repair`. */
export type RepairEnvelope = Contract["repair"];

/** The envelope carrying `replacement`. */
export type ReplacementEnvelope = Contract["replacement"];

/** The envelope carrying `reset`. */
export type ResetEnvelope = Contract["reset"];

/** The envelope carrying `restore`. */
export type RestoreEnvelope = Contract["restore"];

/** The envelope carrying `seed`. */
export type SeedEnvelope = Contract["seed"];

/** The envelope carrying `self-update`. */
export type SelfUpdateEnvelope = Contract["self-update"];

/** The envelope carrying `setup`. */
export type SetupEnvelope = Contract["setup"];

/** The envelope carrying `space`. */
export type SpaceEnvelope = Contract["space"];

/** The envelope carrying `start`. */
export type StartEnvelope = Contract["start"];

/** The envelope carrying `status`. */
export type StatusEnvelope = Contract["status"];

/** The envelope carrying `step`. */
export type StepEnvelope = Contract["step"];

/** The envelope carrying `stop-seeding`. */
export type StopSeedingEnvelope = Contract["stop-seeding"];

/** The envelope carrying `stored`. */
export type StoredEnvelope = Contract["stored"];

/** The envelope carrying `stuck`. */
export type StuckEnvelope = Contract["stuck"];

/** The envelope carrying `trace`. */
export type TraceEnvelope = Contract["trace"];

/** The envelope carrying `undo`. */
export type UndoEnvelope = Contract["undo"];

/** The envelope carrying `uninstall`. */
export type UninstallEnvelope = Contract["uninstall"];

/** The envelope carrying `update`. */
export type UpdateEnvelope = Contract["update"];

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
export type Kind = "admission" | "adoption" | "alerts" | "archives" | "backup" | "bandwidth" | "beside" | "bundle" | "clients" | "config" | "credentials" | "dashboard" | "doctor" | "error" | "forms" | "front-door" | "glossary" | "history" | "hosting" | "household" | "import" | "invitation" | "job" | "lifecycle" | "log" | "migration" | "music" | "outbound" | "preview" | "pull" | "quality" | "removal" | "repair" | "replacement" | "reset" | "restore" | "seed" | "self-update" | "setup" | "space" | "start" | "status" | "step" | "stop-seeding" | "stored" | "stuck" | "trace" | "undo" | "uninstall" | "update" | "upgrade" | "version" | "walkthrough" | "watch" | "wizard" | "word";

/** The envelope carrying each kind, so a payload is typed by what it is. */
export interface ByKind {
  "admission": AdmissionEnvelope;
  "adoption": AdoptionEnvelope;
  "alerts": AlertsEnvelope;
  "archives": ArchivesEnvelope;
  "backup": BackupEnvelope;
  "bandwidth": BandwidthEnvelope;
  "beside": BesideEnvelope;
  "bundle": BundleEnvelope;
  "clients": ClientsEnvelope;
  "config": ConfigEnvelope;
  "credentials": CredentialsEnvelope;
  "dashboard": DashboardEnvelope;
  "doctor": DoctorEnvelope;
  "error": ErrorEnvelope;
  "forms": FormsEnvelope;
  "front-door": FrontDoorEnvelope;
  "glossary": GlossaryEnvelope;
  "history": HistoryEnvelope;
  "hosting": HostingEnvelope;
  "household": HouseholdEnvelope;
  "import": ImportEnvelope;
  "invitation": InvitationEnvelope;
  "job": JobEnvelope;
  "lifecycle": LifecycleEnvelope;
  "log": LogEnvelope;
  "migration": MigrationEnvelope;
  "music": MusicEnvelope;
  "outbound": OutboundEnvelope;
  "preview": PreviewEnvelope;
  "pull": PullEnvelope;
  "quality": QualityEnvelope;
  "removal": RemovalEnvelope;
  "repair": RepairEnvelope;
  "replacement": ReplacementEnvelope;
  "reset": ResetEnvelope;
  "restore": RestoreEnvelope;
  "seed": SeedEnvelope;
  "self-update": SelfUpdateEnvelope;
  "setup": SetupEnvelope;
  "space": SpaceEnvelope;
  "start": StartEnvelope;
  "status": StatusEnvelope;
  "step": StepEnvelope;
  "stop-seeding": StopSeedingEnvelope;
  "stored": StoredEnvelope;
  "stuck": StuckEnvelope;
  "trace": TraceEnvelope;
  "undo": UndoEnvelope;
  "uninstall": UninstallEnvelope;
  "update": UpdateEnvelope;
  "upgrade": UpgradeEnvelope;
  "version": VersionEnvelope;
  "walkthrough": WalkthroughEnvelope;
  "watch": WatchEnvelope;
  "wizard": WizardEnvelope;
  "word": WordEnvelope;
}

/** The wire version these types were generated for. */
export const CONTRACT_API_VERSION = 1;
