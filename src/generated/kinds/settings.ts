// Generated from the lemonfiber contract. Do not edit.
// The `settings` envelope, and the shapes only `settings` carries.
// Regenerate with `npm run contract:generate`.

import type { Unvetted } from "../shared/lifecycle__plugins__settings__update.js";

/** Whose a setting or a secret is. */
export type Owner = OwnerCore | OwnerNamespace;

/** The core's. */
export interface OwnerCore {
  of: "core";
}

/** A plugin's, or a stack service's, by its namespace. */
export interface OwnerNamespace {
  /** The namespace. */
  namespace: string;
  of: "namespace";
}

/** One service reading a setting or a secret. */
export interface Reader {
  /** What the service's manifest declares while no value is recorded. */
  default?: string | null;
  /** The service. */
  service: string;
  /** The variable it is read into. */
  variable: string;
}

/** Where a secret's value came from. */
export type SecretFrom = "operator" | "recipe" | "granted";

/** One secret, without its value. */
export interface SecretRead {
  /** Where its value came from, where one is held or granted. */
  from?: SecretFrom | null;
  /** Whether a value is held. */
  held: boolean;
  /** Its name. */
  name: string;
  /** Each service that reads it. */
  readers: Reader[];
  /** Whose it is. */
  whose: Owner;
}

/** A change to one setting. */
export interface SettingChange {
  /** What this reading names itself, part by part. */
  agreement: string;
  /** Whether it was written. */
  applied: boolean;
  /** What the change costs, where it costs anything. */
  consequence?: string | null;
  /** Every service whose entry the change regenerates. */
  regenerates: string[];
  /** Every running service the change restarts. */
  restarts: string[];
  /** The setting. */
  setting: string;
  /** Why the services it restarts were not restarted, where they were not. */
  unrestarted?: string | null;
  /** What it is to hold, or nothing where it is cleared. */
  value?: string | null;
  /** What it holds now. */
  was?: string | null;
}

/** One setting. */
export interface SettingRead {
  /** The environment file's key it is held under, where it is held there. */
  environment?: string | null;
  /** Its name. */
  name: string;
  /** Each service that reads it. */
  readers: Reader[];
  /** The operator's value, where one is recorded. */
  value?: string | null;
  /** Whose it is. */
  whose: Owner;
}

/** The envelope carrying `settings`. */
export interface SettingsEnvelope {
  api_version: number;
  data: SettingsReport;
  host?: string | null;
  job?: string | null;
  kind: "settings";
}

/** Every setting and secret the stack's services read, and what changing a setting came to. */
export interface SettingsReport {
  /** The change asked for, where one was. */
  change?: SettingChange | null;
  /** Whether this was a rehearsal. */
  rehearsed: boolean;
  /** Every secret a service's environment names, in name order, never with its value. */
  secrets: SecretRead[];
  /** Every setting, in name order. */
  settings: SettingRead[];
  /**
   * The operator's overlay and every service it changes, where there is one: merged
   * over the project this run would start, and held to nothing lemonfiber vets.
   */
  unvetted?: Unvetted | null;
}
