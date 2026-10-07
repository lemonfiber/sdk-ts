// Generated from the lemonfiber contract. Do not edit.
// The `version` envelope, and the shapes only `version` carries.
// Regenerate with `npm run contract:generate`.

import type { Notes } from "../shared/update__version.js";

/** The envelope carrying `version`. */
export interface VersionEnvelope {
  api_version: number;
  data: VersionReport;
  host?: string | null;
  job?: string | null;
  kind: "version";
}

/**
 * What versions are in play: the binary, the stack it operates, and what changed.
 *
 * The changelog is here rather than behind a request of its own because it answers
 * the second half of the same question. "Which version am I on" is asked by
 * somebody deciding whether to move, and what they need next is what the version
 * they are on actually brought — so every surface that already reaches this read
 * reaches both halves, and none of the three had to learn a new question.
 */
export interface VersionReport {
  /** The running binary's version. */
  binary: string;
  /** What this build's release changed, and every release there has been. */
  changelog: Notes;
  /** What the container engine reports, when it could be asked. */
  compose?: string | null;
  /** The version of the stack this build operates. */
  stack: string;
  /** The manifest schema generations this build reads. */
  supported_schema: number[];
}
