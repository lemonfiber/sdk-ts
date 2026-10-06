// Generated from the lemonfiber contract. Do not edit.
// The shapes `glossary` and `word` both carry.
// Regenerate with `npm run contract:generate`.

/** A word this product uses, and what somebody meeting it needs to know. */
export interface Term {
  /**
   * What other services in this stack call the same thing.
   *
   * Sonarr and `SABnzbd` do not agree on words, and an operator moving between
   * their screens should not have to work out that two of them are one.
   */
  also_called: string[];
  /** More, for somebody who asks — never needed in order to act. */
  deep?: string | null;
  /**
   * The other forms this product itself writes the word in, where a state or a
   * stage is named by one — `grabbed` for `grab`, `seeding` for `seed`.
   *
   * Apart from [`Self::also_called`], which is another service's word and one this
   * product must never write as its own. These are this product's own words, and a
   * surface explaining a word it was sent looks for the word it was sent here, so
   * that nothing on the far side has to guess which term an inflection belongs to.
   */
  forms: string[];
  /**
   * One sentence: what it is for and what it costs or gains.
   *
   * Enough to act on. Somebody who reads only this should not be stuck.
   */
  short: string;
  /** The word as it appears in the interface. */
  word: string;
}
