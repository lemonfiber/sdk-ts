// Generated from the lemonfiber contract. Do not edit.
// The `capabilities` envelope, and the shapes only `capabilities` carries.
// Regenerate with `npm run contract:generate`.

/** Every capability this stack has, by the path its request is served at. */
export interface Capabilities {
  /**
   * What each comes to for the credential that asked. A request this stack does
   * not have is absent rather than listed as anything.
   */
  capabilities: { [key: string]: CapabilityState };
  /** Whose credential asked. */
  scope: CredentialScope;
  /**
   * The stack's own identifier, the one pairing material carries, to every credential
   * alike: what tells two credentials apart from two stacks. Never the address or the
   * certificate, which re-pairing exists to change. Absent only where this machine
   * has nowhere to keep one.
   */
  stack?: string | null;
}

/** The envelope carrying `capabilities`. */
export interface CapabilitiesEnvelope {
  api_version: number;
  data: Capabilities;
  host?: string | null;
  job?: string | null;
  kind: "capabilities";
}

/** What one capability comes to for the credential that asked. */
export type CapabilityState = "available" | "unconfigured" | "unpermitted";

/**
 * Whose credential asked, as a client is told it.
 *
 * Said rather than left to be inferred from which requests are permitted: a client
 * guessing a member from a missing read would guess wrong the day that read moves.
 */
export type CredentialScope = "operator" | "read" | "act" | "member";
