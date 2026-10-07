// Generated from the lemonfiber contract. Do not edit.
// The `news` envelope, and the shapes only `news` carries.
// Regenerate with `npm run contract:generate`.

import type { NewsKind } from "../shared/news__news-items.js";

/**
 * The newest of each kind, by what names them and nothing else.
 *
 * What the event stream says. A surface marks a tab from it without reading the
 * items, and reads [`News`] on the screen that lists them.
 */
export interface Newest {
  /** The checks most recently found wrong, each with its onset. */
  problems: NewsCheck[];
  /** The numbers of the household's newest requests. */
  requests: number[];
  /** The kinds that could not be read, as [`News::unread`] names them. */
  unread: NewsKind[];
  /** The versions of the newest releases in the record this build carries. */
  updates: string[];
}

/** A check found wrong, by the check and when it went wrong. */
export interface NewsCheck {
  /** The check that raised it. */
  check: string;
  /**
   * When the stack first saw it wrong since it last saw it right, in whole seconds
   * since the epoch.
   */
  onset: string;
}

/** The envelope carrying `news`. */
export interface NewsEnvelope {
  api_version: number;
  data: Newest;
  host?: string | null;
  job?: string | null;
  kind: "news";
}
