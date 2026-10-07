// Generated from the lemonfiber contract. Do not edit.
// The `job` envelope, and the shapes only `job` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `job`. */
export interface JobEnvelope {
  api_version: number;
  data: Started;
  host?: string | null;
  job?: string | null;
  kind: "job";
}

/**
 * Work that outlives the request that started it: its name, and what it was.
 *
 * The action is carried beside the name because a client holding several has to
 * tell them apart, and asking it to remember which name it gave which request is
 * asking it to keep a second copy of what this already knows.
 */
export interface Started {
  /** The action that was asked for, as it was named. */
  action: string;
  /** The name to ask what became of this work by. */
  job: string;
}
