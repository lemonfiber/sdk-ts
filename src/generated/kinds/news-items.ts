// Generated from the lemonfiber contract. Do not edit.
// The `news-items` envelope, and the shapes only `news-items` carries.
// Regenerate with `npm run contract:generate`.

import type { TitleKind, TitleUnit } from "../shared/askable__askable-kinds__asked__dashboard__household__news-items.js";
import type { NewsKind } from "../shared/news__news-items.js";

/** What a surface can mark as new, newest first within each kind. */
export interface News {
  /** The checks found wrong, the most recent onset first. */
  problems: NewsProblem[];
  /** What the household has asked for, the most recently asked first. */
  requests: NewsRequest[];
  /**
   * The kinds that could not be read.
   *
   * A kind named here has an empty list because nothing could be read, not because
   * nothing is there. A surface that took the empty list as everything there is
   * would mark all of it as new once it could be read again.
   */
  unread: NewsKind[];
  /** The releases in the record this build carries, newest first. */
  updates: NewsUpdate[];
}

/** The envelope carrying `news-items`. */
export interface NewsItemsEnvelope {
  api_version: number;
  data: News;
  host?: string | null;
  job?: string | null;
  kind: "news-items";
}

/** One check found wrong, by the check and when it went wrong. */
export interface NewsProblem {
  /** The check that raised it. */
  check: string;
  /**
   * When the stack first saw it wrong since it last saw it right, in whole seconds
   * since the epoch: the same moment the health summary names for it.
   */
  onset: string;
  /** What is wrong, in one line. */
  summary: string;
}

/** One request, by its reference. */
export interface NewsRequest {
  /** When it was asked for, where that is known. */
  asked?: string | null;
  /** Who asked for it, by the name the media server holds them under. */
  by: string;
  /** The kind of title it asks for, as the household list names it. */
  kind?: TitleKind | null;
  /**
   * The reference the household list names it with: the request service's number
   * (`42`), or `music-<n>` or `books-<n>` for an ask the core keeps.
   */
  request: string;
  /** What it is called, where a service has been told about it. */
  title?: string | null;
  /** What an ask for music or books asks for, as the household list names it. */
  unit?: TitleUnit | null;
}

/** One release, by its version. */
export interface NewsUpdate {
  /** What it set out to deliver, where the record says. */
  delivers?: string | null;
  /** The version, without the tag's leading letter. */
  version: string;
}
