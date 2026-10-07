// Generated from the lemonfiber contract. Do not edit.
// The `restore` envelope, and the shapes only `restore` carries.
// Regenerate with `npm run contract:generate`.

import type { Scope } from "../shared/backup__restore.js";

/**
 * The record written inside an archive, and read back to decide a restore.
 *
 * Everything a restore needs to know before it overwrites anything: what made
 * the archive, when, what data root it was taken against, what it covers, whether
 * it is sensitive, and the contents to list. Round-trips through JSON so the same
 * value the capture wrote is the value the restore reads.
 */
export interface BackupManifest {
  /** When it was taken. Opaque here; the surface stamps it from the clock. */
  created_at: string;
  /** The data root it was taken against, to notice a restore to a different one. */
  data_root: string;
  /** What is inside, for a listing shown before anything is overwritten. */
  members: Member[];
  /** The lemonfiber version that wrote it, checked against the one restoring. */
  product_version: string;
  /** The archive format, checked before anything inside is trusted. */
  schema: number;
  /** What it covers. */
  scope: Scope;
  /** Whether it carries credentials, and so must be handled as sensitive. */
  sensitive: boolean;
}

/** One entry in an archive's contents listing. */
export interface Member {
  /** Where it sits inside the archive. */
  archive_path: string;
  /** What it is, in the operator's terms. */
  label: string;
}

/** What a restore would do, shown before anything is overwritten. */
export interface Preview {
  /**
   * What this listing is, so consent given for it can name which listing it read.
   *
   * Carried on every listing rather than only on the ones that would re-point
   * something: a surface that has to look for it is a surface that can fail to
   * find it, and a restore that would overwrite the same configuration in place
   * is still one somebody may agree to.
   */
  agreement: string;
  /** Whether the archive is old enough that a compatibility warning applies. */
  downgrade: boolean;
  /** The archive's own account of itself — its scope, version and contents. */
  manifest: BackupManifest;
  /** The data-root difference, where the archive was taken against another one. */
  relocation?: Relocation | null;
}

/**
 * A restore whose archive was taken against a different data root than the one
 * configured now, so its stored paths would land where nothing exists.
 */
export interface Relocation {
  /** The data root configured now. */
  now: string;
  /** The data root the archive was taken against. */
  was: string;
}

/**
 * What a restore said: what it would overwrite, and whether it did.
 *
 * The listing is present either way, and that is the point of the shape. It is not
 * a separate request a surface may or may not make — it is the half of a restore
 * that happens before anything is overwritten, so every answer carries it and an
 * answer that overwrote nothing is one whose `done` is absent.
 */
export interface Restoration {
  /** What was put back, or nothing where nothing was. */
  done?: RestoreReport | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * What the archive holds and what restoring it would come to, read before
   * anything was touched.
   */
  would: Preview;
}

/** The envelope carrying `restore`. */
export interface RestoreEnvelope {
  api_version: number;
  data: Restoration;
  host?: string | null;
  job?: string | null;
  kind: "restore";
}

/** What a restore did. */
export interface RestoreReport {
  /** The lemonfiber version the archive was written by. */
  from_version: string;
  /** The data root that was re-pointed, where the restore accepted one. */
  relocated?: Relocation | null;
  /** What was restored. */
  scope: Scope;
}
