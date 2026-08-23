// Generated from the lemonfiber contract. Do not edit.
// Source: d2bf74b950a9f6fb73f2bcd60e2d8adf85337cd6  ·  api_version 1
// Regenerate with `npm run contract:generate`.

/**
 * The wrapper every machine-readable payload arrives in.
 */
export interface ErrorEnvelope {
  /**
   * The output contract's version.
   */
  api_version: number;
  data: Problem;
  /**
   * Which payload this is, so a consumer can branch before parsing `data`.
   */
  kind: string;
}
/**
 * The payload.
 */
export interface Problem {
  /**
   * The problem that produced this one, where several share a root.
   */
  cause?: Problem1 | null;
  /**
   * The stable identifier for this kind of problem.
   */
  code: string;
  /**
   * The underlying technical detail, available but never leading.
   */
  detail?: string | null;
  /**
   * What it means for the operator.
   */
  meaning: string;
  /**
   * What to do, most likely first.
   */
  remedies: Remedy[];
  /**
   * How much it matters.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * Where it stands with respect to being fixed.
   */
  state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
  /**
   * What happened, in one plain sentence.
   */
  summary: string;
}
/**
 * Something that went wrong, in the form an operator can act on.
 */
export interface Problem1 {
  /**
   * The problem that produced this one, where several share a root.
   */
  cause?: Problem1 | null;
  /**
   * The stable identifier for this kind of problem.
   */
  code: string;
  /**
   * The underlying technical detail, available but never leading.
   */
  detail?: string | null;
  /**
   * What it means for the operator.
   */
  meaning: string;
  /**
   * What to do, most likely first.
   */
  remedies: Remedy[];
  /**
   * How much it matters.
   */
  severity: "advisory" | "warning" | "error" | "critical";
  /**
   * Where it stands with respect to being fixed.
   */
  state: "actionable" | "guided" | "remediable" | "unknown" | "suppressed";
  /**
   * What happened, in one plain sentence.
   */
  summary: string;
}
/**
 * One thing the operator can do about a problem.
 */
export interface Remedy {
  /**
   * The action, phrased as something to do rather than something to know.
   */
  action: string;
  /**
   * Where to look, when that helps.
   */
  detail?: string | null;
}

/**
 * The wrapper every machine-readable payload arrives in.
 */
export interface LogEnvelope {
  /**
   * The output contract's version.
   */
  api_version: number;
  data: LogLine;
  /**
   * Which payload this is, so a consumer can branch before parsing `data`.
   */
  kind: string;
}
/**
 * The payload.
 */
export interface LogLine {
  /**
   * When the container itself says it wrote the line, where it said so.
   *
   * Kept verbatim and unparsed. Containers disagree with the host clock and
   * with each other, and the only defensible ordering is each container's own
   * account of itself — which a reader can only apply if it is carried
   * rather than replaced by an arrival time.
   */
  at?: string | null;
  /**
   * The line, without its trailing newline.
   */
  line: string;
  /**
   * The Compose service it came from.
   */
  service: string;
  /**
   * Which stream it arrived on.
   */
  stream: "stdout" | "stderr";
}

/**
 * The wrapper every machine-readable payload arrives in.
 */
export interface SetupEnvelope {
  /**
   * The output contract's version.
   */
  api_version: number;
  data: SetupReport;
  /**
   * Which payload this is, so a consumer can branch before parsing `data`.
   */
  kind: string;
}
/**
 * The payload.
 */
export interface SetupReport {
  /**
   * Where the library was put, where a location was chosen.
   */
  data_root?: string | null;
  /**
   * How the run ended.
   */
  outcome: "applied" | "abandoned" | "already-set-up";
  protocols: Protocols;
  /**
   * The user the services run as, as `uid:gid`, where one was set.
   */
  service_user?: string | null;
}
/**
 * Which ways of downloading the stack was set up for.
 */
export interface Protocols {
  /**
   * A VPN and torrent client are configured.
   */
  torrent: boolean;
  /**
   * A Usenet provider is configured.
   */
  usenet: boolean;
}

/**
 * One thing to do next.
 */
export type Next = "more-content" | "household" | "client-apps";
/**
 * What the import did with the finished download — the difference between one copy of a
 * file and two.
 */
export type Link = "hardlinked" | "copied";

/**
 * The wrapper every machine-readable payload arrives in.
 */
export interface WalkthroughEnvelope {
  /**
   * The output contract's version.
   */
  api_version: number;
  data: WalkthroughReport;
  /**
   * Which payload this is, so a consumer can branch before parsing `data`.
   */
  kind: string;
}
/**
 * The payload.
 */
export interface WalkthroughReport {
  /**
   * Whether what was asked for was already here, and so was not acquired again.
   */
  already_here: boolean;
  /**
   * Where it leaves the operator, where it worked.
   */
  handover?: Handover | null;
  /**
   * Whether the download was handed to the background rather than waited out.
   */
  in_background: boolean;
  /**
   * What it walked, where it got as far as choosing something.
   */
  item?: string | null;
  /**
   * Every line it said, in order — the same lines the operator watched arrive, kept so
   * a machine-readable run is not a silent one.
   */
  lines: Line[];
  /**
   * What the import did with the file, where it got that far.
   */
  link?: Link | null;
  /**
   * What it set out to prove, said so the operator knows what they watched.
   */
  proves: string;
  /**
   * Which walk this was.
   */
  shape: "pipeline" | "library-only";
  /**
   * Where it ended up.
   */
  state:
    | "offered"
    | "skipped"
    | "searching"
    | "grabbing"
    | "downloading"
    | "importing"
    | "complete"
    | "failed"
    | "abandoned";
  /**
   * Where and why it stopped, where it did.
   */
  stopped?: Stopped | null;
  /**
   * What could have been walked instead, where nothing was chosen — the safe first
   * attempts, so an operator with an empty library is not left guessing.
   */
  suggestions: string[];
}
/**
 * Where a finished walkthrough leaves the operator.
 */
export interface Handover {
  /**
   * What to do next, in order.
   */
  next: Next[];
}
/**
 * One narrated line: a step, and what was specifically true of it.
 */
export interface Line {
  /**
   * What was specifically true — the evidence that makes the line worth reading
   * rather than a spinner. Empty where there is nothing particular to say.
   */
  detail: string;
  /**
   * What it is doing, in plain language.
   */
  said: string;
  /**
   * The step being narrated.
   */
  step: "choosing" | "searching" | "grabbing" | "downloading" | "importing" | "scanning" | "available";
}
/**
 * A walkthrough that stopped: where, why, what the services were saying, and what to do.
 */
export interface Stopped {
  /**
   * What the services involved were saying at the time, shown inline rather than left
   * for the operator to go and find — a fault report they have to research is a fault
   * report they abandon.
   */
  logs: string[];
  /**
   * Why.
   */
  reason:
    | "no-indexers"
    | "indexers-failed"
    | "nothing-matched"
    | "none-met-the-preset"
    | "tunnel-down"
    | "not-grabbed"
    | "stalled"
    | "import-failed"
    | "no-media-server"
    | "not-visible";
  /**
   * The one thing to try.
   */
  remedy: string;
  /**
   * The step it stopped at.
   */
  step: "choosing" | "searching" | "grabbing" | "downloading" | "importing" | "scanning" | "available";
}

/**
 * The wrapper every machine-readable payload arrives in.
 */
export interface WatchEnvelope {
  /**
   * The output contract's version.
   */
  api_version: number;
  data: SupervisionReport;
  /**
   * Which payload this is, so a consumer can branch before parsing `data`.
   */
  kind: string;
}
/**
 * The payload.
 */
export interface SupervisionReport {
  /**
   * The forms that were being watched, and are now stopped.
   */
  forms: string[];
  /**
   * Why the watch ended: the data root vanished, or a different volume took
   * its place.
   */
  reason: string;
  /**
   * Whether stopping the services succeeded.
   */
  stopped: boolean;
}

/**
 * The wrapper every machine-readable payload arrives in.
 */
export interface WordEnvelope {
  /**
   * The output contract's version.
   */
  api_version: number;
  data: Term;
  /**
   * Which payload this is, so a consumer can branch before parsing `data`.
   */
  kind: string;
}
/**
 * The payload.
 */
export interface Term {
  /**
   * What other services in this stack call the same thing.
   *
   * Sonarr and `SABnzbd` do not agree on words, and an operator moving between
   * their screens should not have to work out that two of them are one.
   */
  also_called: string[];
  /**
   * More, for somebody who asks — never needed in order to act.
   */
  deep?: string | null;
  /**
   * One sentence: what it is for and what it costs or gains.
   *
   * Enough to act on. Somebody who reads only this should not be stuck.
   */
  short: string;
  /**
   * The word as it appears in the interface.
   */
  word: string;
}

/** Every kind the server may send. */
export type Kind = "error" | "log" | "setup" | "walkthrough" | "watch" | "word";

/** The envelope carrying each kind, so a payload is typed by what it is. */
export interface ByKind {
  "error": ErrorEnvelope;
  "log": LogEnvelope;
  "setup": SetupEnvelope;
  "walkthrough": WalkthroughEnvelope;
  "watch": WatchEnvelope;
  "word": WordEnvelope;
}

/** The wire version these types were generated for. */
export const CONTRACT_API_VERSION = 1;
