// Generated from the lemonfiber contract. Do not edit.
// Every route that takes a body, and the type of the body each takes.
// Regenerate with `npm run contract:generate`.

import type { DeviceKeysBody, KeysBody, KeysClaimBody, SessionBody, SetupAnswerBody, SetupRecoverBody } from "./bodies.js";

/** Every route that takes a body. */
export type BodyRoute = "/api/device-keys" | "/api/keys" | "/api/keys/claim" | "/api/session" | "/api/setup/answer" | "/api/setup/recover";

/** Every route that takes a body, in path order. */
export const BODY_ROUTES: readonly BodyRoute[] = [
  "/api/device-keys",
  "/api/keys",
  "/api/keys/claim",
  "/api/session",
  "/api/setup/answer",
  "/api/setup/recover",
];

/** The body each route takes, so what is sent is typed by where it goes. */
export interface BodyOf {
  "/api/device-keys": DeviceKeysBody;
  "/api/keys": KeysBody;
  "/api/keys/claim": KeysClaimBody;
  "/api/session": SessionBody;
  "/api/setup/answer": SetupAnswerBody;
  "/api/setup/recover": SetupRecoverBody;
}
