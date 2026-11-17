// Generated from the lemonfiber contract. Do not edit.
// What a member's surface may not show, as the contract publishes it.
// Regenerate with `npm run contract:generate`.

/** What a member's surface may not show. */
export interface HouseholdWords {
  /** Every service, engine and tunnel named, the bundle's parts with hyphens read as spaces. */
  readonly names: readonly string[];
  /** Every term for how the stack is built and run. */
  readonly terms: readonly string[];
  /** Every unit a size or a rate is written in. */
  readonly sizes: readonly string[];
  /** Texts a version, an address, a size or a rate makes unfit, each with what in it a member may not be shown. */
  readonly examples: readonly { readonly text: string; readonly names: string }[];
}

/** What a member's surface may not show, as the contract publishes it. */
export const HOUSEHOLD_WORDS: HouseholdWords = {
  names: [],
  terms: [],
  sizes: [],
  examples: [],
};
