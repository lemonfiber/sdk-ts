// Generated from the lemonfiber contract. Do not edit.
// The `trace` envelope, and the shapes only `trace` carries.
// Regenerate with `npm run contract:generate`.

import type { Stage } from "../shared/stuck__trace.js";

/**
 * How much of a traced series is here, season by season — the aggregate that turns a
 * single furthest stage into an answer about the whole. The counts are of parts someone
 * asked for; what nobody asked for is reported beside them, never folded in.
 */
export interface Coverage {
  /** How many wanted parts are here, across every season. */
  have: number;
  /** Each season, in order. */
  seasons: SeasonCoverage[];
  /** How many parts nobody asked for, across every season. */
  unmonitored: number;
  /** How many parts were asked for, across every season. */
  wanted: number;
}

/**
 * One part of a traced item — an episode of a series. A film has no parts: the item is
 * the whole, and a trace of it says all there is to say. A series does not, which is the
 * gap this closes: "the show is imported" is true the moment one episode lands, and reads
 * as done while nine are still missing.
 */
export interface Part {
  /** Its number within that season. */
  number: number;
  /** Which season it belongs to. */
  season: number;
  /** How far this one part got, on the same scale as the item as a whole. */
  stage: Stage;
  /** Its title, as a person would name it. */
  title: string;
}

/**
 * How much of one season is actually here, and what is outstanding — the season-level
 * answer, which for a series is the one an operator can act on.
 */
export interface SeasonCoverage {
  /** How many of the wanted parts are here. */
  have: number;
  /**
   * The wanted parts that are not here yet, each carrying the stage it rests at, so
   * one that stalled is told apart from one still downloading.
   */
  outstanding: Part[];
  /** The season number. Season zero is where a service files specials. */
  season: number;
  /** How many parts nobody asked for — unmonitored and not on disk. */
  unmonitored: number;
  /**
   * How many parts were asked for, or are already here — the denominator. Parts
   * nobody asked for are counted separately rather than inflating this, so a season
   * with every wanted episode present reads as complete even where specials are not.
   */
  wanted: number;
}

/**
 * How sure the correlation behind a trace is — a release renamed between services can
 * only be matched fuzzily, and a guess presented as fact is worse than a marked one.
 */
export type TraceConfidence = "certain" | "uncertain";

/** The envelope carrying `trace`. */
export interface TraceEnvelope {
  api_version: number;
  data: TraceReport;
  host?: string | null;
  job?: string | null;
  kind: "trace";
}

/**
 * One moment in a traced item's history: what happened and when. Where [`TraceStage`]
 * is the linear progress, this is the log an \*arr kept — the grabs, the failed
 * downloads, the import and any later removal — so a repeated attempt is seen as the
 * pattern it is rather than flattened to a single furthest stage.
 */
export interface TraceMoment {
  /** When the service reported it. */
  at: string;
  /** What happened. */
  outcome: TraceOutcome;
}

/**
 * A notable thing that happened to an item, as an \*arr's history records it. Where the
 * furthest stage answers "how far did it get?", the sequence of outcomes answers "what
 * has been tried?" — a release grabbed more than once, a download that failed and was
 * tried again, a file imported and later removed. Repeated failed grabs are a pattern
 * worth seeing, not something a single furthest-stage reading can show.
 */
export type TraceOutcome = "grabbed" | "download-failed" | "imported" | "removed";

/**
 * Where one item is in the pipeline: how far it got, why it stopped if it did, and the
 * stages it passed through — the answer to "where is my show?".
 */
export interface TraceReport {
  /** How sure the trace is of the item it followed. */
  confidence: TraceConfidence;
  /**
   * How much of the item is actually here, season by season — present for an item
   * made of parts, absent for a film, which is the whole item and has none.
   *
   * The furthest stage alone cannot answer this: a series is "imported" the moment one
   * episode lands, which reads as done while the rest are missing.
   */
  coverage?: Coverage | null;
  /**
   * Disagreements between the services about this item, each in plain language — a
   * media server holding what no service is monitoring, and the like. Orthogonal to
   * the linear pipeline: not where the item got to, but where two services' views of
   * it contradict, surfaced rather than silently reconciled.
   */
  findings: string[];
  /** The furthest stage the item reached. */
  furthest: Stage;
  /**
   * The notable events in its history, oldest first — the grabs, failed downloads,
   * imports and removals. Repeated attempts show here as the pattern they are, which
   * the single furthest stage cannot.
   */
  history: TraceMoment[];
  /** The term the item was searched for by. */
  item: string;
  /**
   * Whether a monitored item matched the term at all — a false here is itself the
   * answer: nobody asked for it.
   */
  matched: boolean;
  /** The stages it passed through, in order. */
  stages: TraceStage[];
  /** Why it stopped, where it plainly has — or absent where it is progressing or done. */
  stall?: string | null;
}

/**
 * One stage a traced item reached, named as the operator would read it: the stage,
 * the service that recorded it, and when.
 */
export interface TraceStage {
  /**
   * When it happened, as the service reported it — absent for a stage inferred
   * rather than timed, such as being monitored.
   */
  at?: string | null;
  /** The service that recorded it. */
  service: string;
  /** The stage reached. */
  stage: Stage;
}
