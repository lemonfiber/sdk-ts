// Generated from the lemonfiber contract. Do not edit.
// The `served` envelope, and the shapes only `served` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `served`. */
export interface ServedEnvelope {
  api_version: number;
  data: ServedReport;
  host?: string | null;
  job?: string | null;
  kind: "served";
}

/** What a run serving the surface presents, answers to and wrote down. */
export interface ServedReport {
  /** What a phone pins for the certificate presented, where the run is encrypted. */
  fingerprint?: string | null;
  /**
   * The name a request has to carry beyond this machine, where the run is encrypted on
   * a network.
   */
  named?: string | null;
  /** Why where it is served could not be written down, where it could not. */
  unrecorded?: string | null;
}
