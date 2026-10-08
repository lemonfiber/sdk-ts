// Generated from the lemonfiber contract. Do not edit.
// Every route that takes a body, and the type of the body each takes.
// Regenerate with `npm run contract:generate`.

import type { KeysBody, SessionBody, SetupAnswerBody, SetupRecoverBody } from "./bodies.js";

/** Every route that takes a body. */
export type BodyRoute = "/api/keys" | "/api/session" | "/api/setup/answer" | "/api/setup/recover";

/** Every route that takes a body, in path order. */
export const BODY_ROUTES: readonly BodyRoute[] = [
  "/api/keys",
  "/api/session",
  "/api/setup/answer",
  "/api/setup/recover",
];

/** The body each route takes, so what is sent is typed by where it goes. */
export interface BodyOf {
  "/api/keys": KeysBody;
  "/api/session": SessionBody;
  "/api/setup/answer": SetupAnswerBody;
  "/api/setup/recover": SetupRecoverBody;
}
