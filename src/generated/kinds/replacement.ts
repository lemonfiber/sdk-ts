// Generated from the lemonfiber contract. Do not edit.
// The `replacement` envelope, and the shapes only `replacement` carries.
// Regenerate with `npm run contract:generate`.

import type { Stance } from "../shared/adoption__beside__config__import__replacement.js";

/** What standing in place of a setup already here came to, or would come to. */
export interface ReplaceReport {
  /**
   * What this offer names itself: the project and every service it would stop.
   *
   * The answer to it is this name, and nothing else is a yes to a replacement. Empty
   * where there is nothing to stand in place of, because there is nothing to agree to.
   */
  agreement: string;
  /** The project that would be stood in place of. */
  project?: string | null;
  /** Why nothing was stopped, where nothing was. */
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
  /** The services that would not stop and are still up. */
  still_running: string[];
  /** The services that were stopped. */
  stopped: string[];
  /** The services that would be stopped, by name. */
  would_stop: string[];
}

/** The envelope carrying `replacement`. */
export interface ReplacementEnvelope {
  api_version: number;
  data: ReplaceReport;
  host?: string | null;
  kind: "replacement";
}
