// Generated from the lemonfiber contract. Do not edit.
// The `served` envelope, and the shapes only `served` carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";

/** What a certificate says about itself. */
export interface Described {
  /** What a phone pins: SHA-256 over the certificate's DER encoding, lower-case hex. */
  fingerprint: string;
  /** Who signed it, as an RFC 4514 string, cut where it is too long to show. */
  issuer: string;
  /** Whether the issuer was cut, being too long to show whole. */
  issuer_cut: boolean;
  /**
   * The names it is made out to, its subject alternative names, each whole; those too
   * many or too long to show, or not written as text, are left out.
   */
  names: string[];
  /**
   * How many of the names it is made out to are left out, being too many or too long to
   * show, or not written as text.
   */
  names_more: number;
  /** Whether it was signed by its own key under its own name. */
  self_signed: boolean;
  /** Who it is made out to, as an RFC 4514 string, cut where it is too long to show. */
  subject: string;
  /** Whether the subject was cut, being too long to show whole. */
  subject_cut: boolean;
  /** When it begins to hold. */
  valid_from: Instant;
  /** When it stops holding. */
  valid_until: Instant;
}

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
  /** The certificate it presents, as it describes itself, where the run is encrypted. */
  certificate?: Described | null;
  /** Whether it presents a certificate, rather than plain text. */
  encrypted: boolean;
  /**
   * The name a request has to carry beyond this machine, where the run is encrypted on
   * a network.
   */
  named?: string | null;
  /** Whether it is offered to the network, rather than to this machine alone. */
  network: boolean;
  /** The port it listens on. */
  port: number;
  /** Why where it is served could not be written down, where it could not. */
  unrecorded?: string | null;
}
