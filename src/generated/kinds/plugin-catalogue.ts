// Generated from the lemonfiber contract. Do not edit.
// The `plugin-catalogue` envelope, and the shapes only `plugin-catalogue` carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";

/** Why the catalogue's index was not read. */
export interface CatalogueFailure {
  /** The problem code an install by name would be refused with. */
  code: string;
  /** What went wrong, in one line. */
  summary: string;
}

/** One plugin the catalogue offers. */
export interface CataloguedPlugin {
  /** What it does, in its author's words. */
  description: string;
  /** The plugin's id, which is the name it is installed by. */
  id: string;
  /** The version installed on this machine. Absent where it is not installed. */
  installed?: InstalledVersion | null;
  /** What it calls itself. */
  name: string;
  /** The version the catalogue reviewed. */
  version: string;
  /** What the household is without it. */
  without_it: string;
}

/** The version of a catalogued plugin installed here, against the catalogue's. */
export interface InstalledVersion {
  /** Whether the catalogue's version is above it by semver. */
  newer: boolean;
  /** The version installed. */
  version: string;
}

/** The envelope carrying `plugin-catalogue`. */
export interface PluginCatalogueEnvelope {
  api_version: number;
  data: PluginCatalogueReport;
  host?: string | null;
  job?: string | null;
  kind: "plugin-catalogue";
}

/** What the catalogue offers, or why it was not read. */
export interface PluginCatalogueReport {
  /** Every plugin the verified index offers, by id; empty where it was not read. */
  entries: CataloguedPlugin[];
  /** Why the index could not be read. Present where it failed. */
  failure?: CatalogueFailure | null;
  /** When the index listed was published. Present where it was read. */
  published?: Instant | null;
  /** Which release of the catalogue the index listed is. Present where it was read. */
  serial?: number | null;
  /**
   * The setting that keeps the catalogue from being asked, and how to let it be.
   * Present where it is switched off.
   */
  setting?: ReachSetting | null;
  /** Whether the catalogue was read, switched off, or could not be read. */
  state: PluginCatalogueState;
  /**
   * How many entries the index holds that could not be listed, for lacking a fact an
   * entry carries. Present where it was read.
   */
  unreadable?: number | null;
}

/** Whether the catalogue was read. */
export type PluginCatalogueState = "listed" | "off" | "failed";

/** A setting that keeps a request from being made, and the change that lets it be. */
export interface ReachSetting {
  /** The action that writes it. */
  action: SettingWrite;
  /** The setting. */
  key: string;
  /** The value that lets the request be made. */
  value: string;
}

/** The action a setting is written with. */
export type SettingWrite = "config-set";
