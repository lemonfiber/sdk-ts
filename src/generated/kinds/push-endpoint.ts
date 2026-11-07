// Generated from the lemonfiber contract. Do not edit.
// The `push-endpoint` envelope, and the shapes only `push-endpoint` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `push-endpoint`. */
export interface PushEndpointEnvelope {
  api_version: number;
  data: RegisteredPushEndpoint;
  host?: string | null;
  job?: string | null;
  kind: "push-endpoint";
}

/** A push endpoint registered. */
export interface RegisteredPushEndpoint {
  /** The `https` address its distributor gave. */
  endpoint: string;
  /** The name it was registered under. */
  name: string;
  /** When it was registered. */
  registered: string;
  /** Whether this was a rehearsal: what registering would come to, with nothing kept. */
  rehearsed: boolean;
}
