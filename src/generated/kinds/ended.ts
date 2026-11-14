// Generated from the lemonfiber contract. Do not edit.
// The `ended` envelope, and the shapes only `ended` carries.
// Regenerate with `npm run contract:generate`.

/** Work that ended before it finished: its name, what it was, and why it ended. */
export interface Ended {
  /** The action that was asked for, as it was named. */
  action: string;
  /** Why it ended. */
  ended: JobEnding;
  /** The name the work was answered with. */
  job: string;
}

/** The envelope carrying `ended`. */
export interface EndedEnvelope {
  api_version: number;
  data: Ended;
  host?: string | null;
  job?: string | null;
  kind: "ended";
}

/** Why work ended before it finished. */
export type JobEnding = "released" | "let-go" | "quiet";
