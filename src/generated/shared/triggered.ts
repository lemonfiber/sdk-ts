// Generated from the lemonfiber contract. Do not edit.
// The shapes `music` and `upgrade` both carry.
// Regenerate with `npm run contract:generate`.

/** What became of asking one service to re-search its existing content. */
export type Triggered = TriggeredStarted | TriggeredNotStarted | TriggeredFailed;

/** The service refused the command or could not be reached. */
export interface TriggeredFailed {
  /** The service's own account of why. */
  detail: string;
  state: "failed";
}

/**
 * The service had not finished starting — no key yet — so nothing was asked of
 * it; running the upgrade again once it is up will reach it.
 */
export interface TriggeredNotStarted {
  state: "not-started";
}

/** The re-search was accepted and now runs in the service's background. */
export interface TriggeredStarted {
  state: "started";
}
