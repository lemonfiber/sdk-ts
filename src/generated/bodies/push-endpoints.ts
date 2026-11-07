// Generated from the lemonfiber contract. Do not edit.
// The body `/api/push-endpoints` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What a registration is asked with. */
export interface PushEndpointsBody {
  /** The phone's `WebPush` secret, in base64url. */
  auth: string;
  /** The `https` address the phone's `UnifiedPush` distributor gave. */
  endpoint: string;
  /** What to call it: lower-case letters, digits, dots, dashes and underscores. */
  name: string;
  /** The phone's `WebPush` public key, in base64url. */
  p256dh: string;
}
