// Generated from the lemonfiber contract. Do not edit.
// The shapes `askable` and `asked` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * What kind of title a member's search and ask name: a series, a film, music or books.
 *
 * The web surface's own name for what a member asks for, whose name an SDK already gives
 * to the kinds of envelope: the same words on the wire, under a name nothing else takes.
 */
export type TitleKind = "tv" | "movies" | "music" | "books";

/** What one title of music or books is, within its kind. */
export type TitleUnit = "album" | "artist" | "book" | "author" | "series";
