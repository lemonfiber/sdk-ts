// Generated from the lemonfiber contract. Do not edit.
// The `certificate` envelope, and the shapes only `certificate` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `certificate`. */
export interface CertificateEnvelope {
  api_version: number;
  data: CertificateReport;
  host?: string | null;
  job?: string | null;
  kind: "certificate";
}

/** What asking for the certificate to be replaced came to. */
export interface CertificateReport {
  /** What replacing it means for every phone already paired. */
  consequence: string;
  /**
   * What a phone would pin now: the new certificate where it was replaced, the one
   * kept where it was not, and nothing where none has been made.
   */
  fingerprint?: string | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * Whether it was replaced. Unconfirmed, it is not, and what replacing it costs is
   * what is said.
   */
  replaced: boolean;
}
