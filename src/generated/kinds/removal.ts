// Generated from the lemonfiber contract. Do not edit.
// The `removal` envelope, and the shapes only `removal` carries.
// Regenerate with `npm run contract:generate`.

/**
 * What removing somebody costs, and what it did.
 *
 * Read before anything is written: the whole point of the unconfirmed run is that every
 * figure here is knowable without removing anybody.
 */
export interface HouseholdRemoval {
  /**
   * Whether the request service holds an account for them at all.
   *
   * False where they never signed in there, which is nothing to revoke rather than a
   * revocation that failed.
   */
  "asks-through-the-request-service": boolean;
  /** Whether it was carried out, or only described pending confirmation. */
  confirmed: boolean;
  /** What could not be done, and anything else worth the operator's attention. */
  findings: string[];
  /**
   * The name their account is held under, as the media server spells it rather than
   * as the operator typed it.
   */
  name: string;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * How many of their requests go with them.
   *
   * **They are destroyed, not reassigned.** The request service removes them by hand
   * so that a title still waiting goes back to being unrequested rather than pointing
   * at nobody — so this is a count of things that will stop existing.
   */
  requests: number;
  /** How far it got. */
  revoked: Revoked;
}

/** The envelope carrying `removal`. */
export interface RemovalEnvelope {
  api_version: number;
  data: HouseholdRemoval;
  host?: string | null;
  job?: string | null;
  kind: "removal";
}

/**
 * How far a removal got, across the two services a household member exists on.
 *
 * The media server is removed first and the request service second, because the
 * request service authenticates *through* the media server — so once the first is gone
 * they can do nothing either way, and a failure at the second leaves an account that
 * cannot sign in rather than somebody who can still watch.
 */
export type Revoked = "everywhere" | "media-server-only" | "nothing";
