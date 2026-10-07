// Generated from the lemonfiber contract. Do not edit.
// The `adoption` envelope, and the shapes only `adoption` carries.
// Regenerate with `npm run contract:generate`.

import type { Stance } from "../shared/adoption__beside__config__import__replacement.js";
import type { CarryingReport } from "../shared/adoption__migration.js";

/** What adopting a setup already here came to, or would come to. */
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
  /** The project lemonfiber would manage, where exactly one could be adopted. */
  project?: string | null;
  /** Why nothing was done, where nothing was. */
  refusal?: string | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /** Where the act stands. */
  stance: Stance;
  /**
   * The services whose databases a newer version would upgrade, and whose data
   * therefore has to be backed up before anything opens it.
   */
  upgrades: CarryingReport[];
}

/** The envelope carrying `adoption`. */
export interface AdoptionEnvelope {
  api_version: number;
  data: AdoptReport;
  host?: string | null;
  job?: string | null;
  kind: "adoption";
}
