// Generated from the lemonfiber contract. Do not edit.
// The `import` envelope, and the shapes only `import` carries.
// Regenerate with `npm run contract:generate`.

import type { Stance } from "../shared/adoption__beside__config__import__replacement.js";
import type { UnsupportedReport } from "../shared/import__migration__seed__status__stuck.js";

/** The envelope carrying `import`. */
export interface ImportEnvelope {
  api_version: number;
  data: ImportReport;
  host?: string | null;
  job?: string | null;
  kind: "import";
}

/** What copying an operator's own records across came to, or would come to. */
export interface ImportReport {
  /** What was carried across. */
  carried: RecordReport[];
  /** What could not be carried, and why. */
  not_carried: UnsupportedReport[];
  /** The project the records were read from. */
  project?: string | null;
  /** Why nothing was carried, where nothing was. */
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
  /** What would be, where nothing has been yet. */
  would_carry: RecordReport[];
}

/** One record carried across, or that would be. */
export interface RecordReport {
  /** What kind of record it is, in the plural a person reads. */
  kind: string;
  /** What it is called. */
  name: string;
  /** The service it belongs to. */
  service: string;
}
