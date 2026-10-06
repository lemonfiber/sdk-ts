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
}

/** The envelope carrying `capabilities`. */
export interface CapabilitiesEnvelope {
  api_version: number;
  data: Capabilities;
  host?: string | null;
  kind: "capabilities";
}

/** What one capability comes to for the credential that asked. */
export type CapabilityState = "available" | "unconfigured" | "unpermitted";
