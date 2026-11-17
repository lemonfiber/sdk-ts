// Generated from the lemonfiber contract. Do not edit.
// The body `/api/session/code` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What a caller sends to the door: nothing to ask for a code, the handle to finish one. */
export interface SessionCodeBody {
  /** The handle a code was answered with, where this finishes signing in by it. */
  waiting?: string | null;
}
