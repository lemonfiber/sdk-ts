// Generated from the lemonfiber contract. Do not edit.
// The `migration` envelope, and the shapes only `migration` carries.
// Regenerate with `npm run contract:generate`.

import type { CarryingReport } from "../shared/adoption__migration.js";
import type { MovedReport } from "../shared/beside__migration.js";
import type { UnsupportedReport } from "../shared/import__migration__seed__status__stuck.js";
import type { ConflictReport } from "../shared/lifecycle__migration.js";

/** What an existing layout costs, where it cannot hold a hardlink. */
export interface LinkingReport {
  /** Why they cannot, naming the filesystems it is about. */
  because: string;
  /** What that costs, in room rather than in adjectives. */
  cost: string;
  /** The filesystems the existing setup keeps its data on. */
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
  /** What would fix it, offered. */
  remedy: string;
}

/** The envelope carrying `migration`. */
export interface MigrationEnvelope {
  api_version: number;
  data: MigrationReport;
  host?: string | null;
  kind: "migration";
}

/** What is already on this machine, before anything is proposed. */
export interface MigrationReport {
  /** Where each service would listen to run beside the existing setup. */
  beside: MovedReport[];
  /** What adopting each recognised service would come to, by service name. */
  carrying: CarryingReport[];
  /** Ports wanted by lemonfiber that an existing service already holds. */
  conflicts: ConflictReport[];
  /**
   * What the existing layout costs where it cannot hold a hardlink, absent where
   * it can.
   */
  linking?: LinkingReport | null;
  /** What may be done about what was found, least destructive first. */
  modes: ModeReport[];
  /** What no migration carries across, whatever mode it runs in. */
  not_carried: UnsupportedReport[];
  /**
   * Whether the engine answered at all.
   *
   * False means the survey found nothing because it could not look, which is a
   * different answer from finding nothing, and the only one that must never be
   * read as an empty machine.
   */
  read: boolean;
  /** Existing projects, by project name. */
  standing: StandingReport[];
  /** What was found and cannot be adopted. */
  unsupported: UnsupportedReport[];
}

/** One thing an operator may do about a setup already here. */
export interface ModeReport {
  /** Whether carrying it out stops or alters what is already running. */
  disturbs: boolean;
  /** The word an operator types for it. */
  mode: string;
  /** Whether it is offered already chosen. Only adopting is. */
  preselected: boolean;
  /** What choosing it would come to, in the operator's terms. */
  what: string;
}

/** One container of somebody else's stack, as the engine reports it. */
export interface OccupantReport {
  /** Whether lemonfiber knows this service and could take it over as it stands. */
  adoptable: boolean;
  /** Every host port it publishes, lowest first. */
  ports: number[];
  /** Whether it is running now, as against present but stopped. */
  running: boolean;
  /** The Compose service name it answers to. */
  service: string;
}

/** One Compose project on this machine that is not lemonfiber's. */
export interface StandingReport {
  /** The Compose project name. */
  project: string;
  /** Its containers, by service name. */
  services: OccupantReport[];
}
