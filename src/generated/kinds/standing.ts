// Generated from the lemonfiber contract. Do not edit.
// The `standing` envelope, and the shapes only `standing` carries.
// Regenerate with `npm run contract:generate`.

/** What the web API composes its routes and its answers from. */
export interface StackStanding {
  /** Whether household members may mint keys for themselves. */
  members_mint: boolean;
  /**
   * The stack's own identifier, the one pairing material carries; absent where this
   * machine has nowhere to keep one.
   */
  stack?: string | null;
  /** Each setting a command is refused without that is off on this machine. */
  switched_off: string[];
  /** Whether a way to be told is configured. */
  told: boolean;
  /** Whether a phone's push endpoint is waiting to be woken. */
  waiting: boolean;
}

/** The envelope carrying `standing`. */
export interface StandingEnvelope {
  api_version: number;
  data: StackStanding;
  host?: string | null;
  job?: string | null;
  kind: "standing";
}
