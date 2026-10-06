// Generated from the lemonfiber contract. Do not edit.
// The shapes `space` and `stop-seeding` both carry.
// Regenerate with `npm run contract:generate`.

/** One completed download, and what reclaiming it would come to. */
export interface Candidate {
  /** What it occupies. */
  bytes: number;
  /** What removing it costs, where it costs anything. */
  consequence?: string | null;
  /** What both sides call it. */
  name: string;
  /** Where it stands. */
  standing: SeedingStanding;
}

/** Where one completed download stands. */
export type SeedingStanding = SeedingStandingNeverImported | SeedingStandingSeeding | SeedingStandingLeftAlone;

/** The operator asked for this one to be left alone. */
export interface SeedingStandingLeftAlone {
  standing: "left_alone";
}

/**
 * Nothing ever linked it into a library: it was never imported, and removing
 * it loses nothing.
 */
export interface SeedingStandingNeverImported {
  standing: "never_imported";
}

/**
 * It was imported and is still seeding, so removing it has a consequence
 * outside this machine.
 */
export interface SeedingStandingSeeding {
  /**
   * What it has uploaded against what it downloaded, in hundredths, as the
   * client reports it.
   *
   * A whole number rather than a fraction because every report this product
   * makes is compared for equality somewhere, and a fraction cannot be —
   * two figures a client would call the same would not be. The hundredth is
   * finer than any decision made on a ratio.
   */
  ratio: number;
  standing: "seeding";
}
