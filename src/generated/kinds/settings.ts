// Generated from the lemonfiber contract. Do not edit.
// The `settings` envelope, and the shapes only `settings` carries.
// Regenerate with `npm run contract:generate`.

import type { Unvetted } from "../shared/lifecycle__plugins__settings__substitution__update.js";
import type { Waiting } from "../shared/plugins__settings__status.js";

/** One value a setting accepts. */
export interface Choosable {
  /**
   * The values of other settings under which it is a choice: each setting with the
   * values it has to hold one of, and none where it always is.
   */
  needs: { [key: string]: string[] };
  /** Whether it is a choice now. */
  open: boolean;
  /** The value. */
  value: string;
}

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
  /** Whether those settings hold what it needs now. */
  met: boolean;
  /**
   * The values of other settings under which the variable is written: each setting
   * with the values it has to hold one of.
   */
  needs: { [key: string]: string[] };
  /** The service. */
  service: string;
  /** The variable it is read into. */
  variable: string;
}

/** Where a secret's value came from. */
export type SecretFrom = "operator" | "recipe" | "granted" | "minted";

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

/** A change to one or more settings, made in one act. */
export interface SettingChange {
  /** What this reading names itself, part by part. */
  agreement: string;
  /** Whether it was written. */
  applied: boolean;
  /** Every service whose entry the change regenerates. */
  regenerates: string[];
  /** Every running service the change restarts. */
  restarts: string[];
  /** Each setting the act moves, in name order. */
  settings: SettingMove[];
  /**
   * Every service held back that the change starts, having given the last thing it
   * waited for.
   */
  starts: string[];
  /** Why the services it restarts were not restarted, where they were not. */
  unrestarted?: string | null;
  /** The services held back once the change is made, each with what it waits for. */
  waiting: Waiting[];
}

/** One setting a change moves. */
export interface SettingMove {
  /** What moving it costs, where it costs anything. */
  consequence?: string | null;
  /** The setting. */
  setting: string;
  /** What it is to hold, or nothing where it is cleared. */
  value?: string | null;
  /** What it holds now. */
  was?: string | null;
}

/** One setting. */
export interface SettingRead {
  /** Every value it accepts, where its manifest declares them. */
  choices?: Choosable[] | null;
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
  /**
   * The services held back until the operator gives what they need to start, each
   * with what it waits for, as status names them.
   */
  waiting: Waiting[];
}
