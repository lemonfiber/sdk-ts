// Generated from the lemonfiber contract. Do not edit.
// The `admission` envelope, and the shapes only `admission` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `admission`. */
export interface AdmissionEnvelope {
  api_version: number;
  data: Admitted;
  host?: string | null;
  job?: string | null;
  kind: "admission";
}

/**
 * A session opened, and the moment it stops being one.
 *
 * The ending is carried rather than left for a client to work out, because a client
 * that guessed would be a second opinion about who is admitted — and the two would
 * disagree on the day somebody's clock is wrong.
 */
export interface Admitted {
  /**
   * The household member this session is for, where it is a member's.
   *
   * **Absent is the operator**, which is the whole of the discriminator. A second
   * field naming which kind of person this is could disagree with this one, and
   * the day they disagreed a client would have to choose which to believe.
   */
  member?: string | null;
  /** The member's display name as the media server holds it, where it is a member's. */
  name?: string | null;
  /** The secret this session is carried by, sent in the header the per-run token is. */
  token: string;
  /** When it stops being one, written as every other instant this product writes. */
  until: string;
}
