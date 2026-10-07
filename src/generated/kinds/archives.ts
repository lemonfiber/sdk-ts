// Generated from the lemonfiber contract. Do not edit.
// The `archives` envelope, and the shapes only `archives` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `archives`. */
export interface ArchivesEnvelope {
  api_version: number;
  data: Listing;
  host?: string | null;
  job?: string | null;
  kind: "archives";
}

/** The archives this machine has kept. */
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
