// Generated from the lemonfiber contract. Do not edit.
// The body `/api/notify/events` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What happened, as a service tells it. */
export interface NotifyEventsBody {
  /** Whether a problem the service raised about itself is cleared. */
  cleared?: boolean;
  /** Which of the four happenings it is. */
  event: NotifyHappened;
  /** The title's name, or the service's own words for a problem about itself. */
  name: string;
  /** What the service said went wrong, where something did. */
  reason?: string | null;
  /** The title it is about, by the service's own reference, where it is about one. */
  reference?: string | null;
}

/** One of the four happenings a service tells the core. */
export type NotifyHappened = "imported" | "failed" | "health" | "added";
