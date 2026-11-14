// Generated from the lemonfiber contract. Do not edit.
// The `settled` envelope, and the shapes only `settled` carries.
// Regenerate with `npm run contract:generate`.

import type { Protocols } from "../shared/body-setup-answer__settled__setup.js";

/** The user and group the stack's services run as. */
export interface ServiceUser {
  /** Where the two come from. */
  from: UserFrom;
  /** The group id. */
  gid: number;
  /** The user id. */
  uid: number;
}

/** Whether this stack is set up. */
export type SetUp = "none" | "part-way" | "done";

/** The envelope carrying `settled`. */
export interface SettledEnvelope {
  api_version: number;
  data: SettledReport;
  host?: string | null;
  job?: string | null;
  kind: "settled";
}

/**
 * What setup settled, read from the configuration as it stands, and whether this stack
 * is set up.
 */
export interface SettledReport {
  /**
   * Where the library is kept, a path on this machine or an NFS export as `DATA_ROOT`
   * names it, or nothing where no data root is configured.
   */
  data_root?: string | null;
  /** Which ways of downloading are configured. */
  protocols: Protocols;
  /** The user and group the stack's services run as. */
  service_user: ServiceUser;
  /** Whether this stack is set up. */
  setup: SetUp;
}

/** Where the user the services run as comes from. */
export type UserFrom = "set" | "part-set" | "stack-owner";
