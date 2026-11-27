// Generated from the lemonfiber contract. Do not edit.
// The `push-endpoints` envelope, and the shapes only `push-endpoints` carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";

/** One push endpoint as the listing shows it. */
export interface ListedPushEndpoint {
  /** The first sixteen lower-case hexadecimal digits of the SHA-256 of that address. */
  fingerprint: string;
  /** The host the address its distributor gave reaches. */
  host: string;
  /** The name it was registered under. */
  name: string;
  /** When it was registered. */
  registered: Instant;
}

/** Every push endpoint, and what became of a removal. */
export interface PushEndpointListing {
  /** In the order they were registered. */
  endpoints: ListedPushEndpoint[];
  /** Whether this was a rehearsal: what removing would come to, with nothing removed. */
  rehearsed: boolean;
  /** The endpoint this request removed, where it removed one. */
  removed?: string | null;
}

/** The envelope carrying `push-endpoints`. */
export interface PushEndpointsEnvelope {
  api_version: number;
  data: PushEndpointListing;
  host?: string | null;
  job?: string | null;
  kind: "push-endpoints";
}
