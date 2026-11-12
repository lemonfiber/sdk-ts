// Generated from the lemonfiber contract. Do not edit.
// The shapes `askable`, `askable-kinds` and `asked` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * What kind of title a curator files, a member asks for and a media server holds: a
 * series, a film, music or books.
 */
export type TitleKind = "tv" | "movies" | "music" | "books";

/** What one title of music or books is, within its kind. */
export type TitleUnit = "album" | "artist" | "book" | "author" | "series";
