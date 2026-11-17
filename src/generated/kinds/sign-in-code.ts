// Generated from the lemonfiber contract. Do not edit.
// The `sign-in-code` envelope, and the shapes only `sign-in-code` carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";

/** A code to sign in by, or the sign-in by a code still waiting. */
export interface SignInCode {
  /** Where the member approves the code, where one was just asked for. */
  approve_at?: string | null;
  /** The code the member enters where they approve it, where one was just asked for. */
  code?: string | null;
  /** When the code lapses. */
  lapses_at: Instant;
  /** The handle that finishes signing in by the code. */
  waiting: string;
}

/** The envelope carrying `sign-in-code`. */
export interface SignInCodeEnvelope {
  api_version: number;
  data: SignInCode;
  host?: string | null;
  job?: string | null;
  kind: "sign-in-code";
}
