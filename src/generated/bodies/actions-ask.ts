// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/ask` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `ask` action is posted with. */
export interface ActionsAskBody {
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * The token a page of a member's search vouched for the title asked for with, handed
   * back as the page gave it.
   */
  found?: string | null;
  /**
   * The thing an action is about, by its id: the title or episode a player's progress
   * is on, by the identifier the shelf lists it under, the title a member asks for, by
   * the identifier their search listed it under, or the wake a phone confirms.
   */
  id?: string | null;
  /**
   * Whether the title asked for is a series, a film, music or books, as a page of a
   * member's search names it: `tv`, `movies`, `music` or `books`.
   */
  kind?: string | null;
  /** Who an action addressed to somebody in the household is for, as they sign in. */
  name?: string | null;
  /**
   * The seasons of a series asked for. None names every season not already here or
   * on its way.
   */
  seasons?: number[];
  /**
   * What is asked for within music or books, as a page of a member's search names
   * it: `album` or `artist`, `book`, `author` or `series`. Absent asks for an album
   * or a book.
   */
  unit?: string | null;
}
