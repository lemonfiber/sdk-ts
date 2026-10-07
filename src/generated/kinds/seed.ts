// Generated from the lemonfiber contract. Do not edit.
// The `seed` envelope, and the shapes only `seed` carries.
// Regenerate with `npm run contract:generate`.

import type { UnsupportedReport } from "../shared/import__migration__seed__status__stuck.js";

/**
 * Whether a pass could assess drift — whether it had the record of what lemonfiber
 * last wrote to compare against.
 */
export type Assessment = "assessed" | "unassessable";

/** The envelope carrying `seed`. */
export interface SeedEnvelope {
  api_version: number;
  data: SeedReport;
  host?: string | null;
  job?: string | null;
  kind: "seed";
}

/** What a seed pass amounted to. */
export interface SeedReport {
  /** Whether drift could be assessed, or the expected-state record was lost. */
  assessment: Assessment;
  /**
   * Whether this pass only said what it would do.
   *
   * A flag rather than a second shape, because every connection above means the
   * same thing either way: what the service holds is what it holds, and what
   * lemonfiber would write is what it would write. What changes is that two of the
   * states are reachable only here, and that the last line of the report is an
   * instruction to run it for real rather than to run it again.
   */
  rehearsed: boolean;
  /**
   * Services this pass could not wire because it cannot speak to them, each with
   * why.
   *
   * Not wirings, because nothing was attempted and a wiring says how an attempt
   * turned out. Not absences either, which is the point: a pass that skipped a
   * service declaring an API shape this build does not speak and said nothing would
   * leave the operator who wrote that declaration no way to tell it from a service
   * lemonfiber had simply forgotten.
   */
  unsupported?: UnsupportedReport[];
  /** Every connection attempted, and how each turned out. */
  wirings: Wiring[];
}

/**
 * How serious a reported connection is.
 *
 * Drift is normal and usually the operator's own harmless edit, so it is reported
 * as information rather than a failure. It escalates to a warning only when the
 * drift breaks the stack — a root folder pointing where nothing exists, a download
 * client that no longer answers — and a warning that cannot be acted on is noise,
 * so a warning always names both what broke and what to do about it.
 */
export type SeedSeverity = SeedSeverityInformational | SeedSeverityWarning;

/**
 * Nothing is broken: the connection is settled, or its drift is the operator's
 * own edit that still works.
 */
export interface SeedSeverityInformational {
  severity: "informational";
}

/**
 * The connection breaks the stack. Both the breakage and a remediation are
 * named, because a warning the operator cannot act on is noise.
 */
export interface SeedSeverityWarning {
  /** What is broken, in the operator's terms. */
  breakage: string;
  /** What to do about it. */
  remediation: string;
  severity: "warning";
}

/** How one connection turned out after a seed pass. */
export type SeedState = SeedStateWired | SeedStateAlreadyWired | SeedStateDrifted | SeedStateStale | SeedStateConflicted | SeedStateAdopted | SeedStateUnmanaged | SeedStateWouldWire | SeedStateWouldAdopt | SeedStateObserved | SeedStateUnmatched | SeedStateSkipped | SeedStateFailed | SeedStateRefused;

/**
 * An operator's edit adopted as the accepted state, kept across seeds and
 * restores. Settled: lemonfiber leaves it as it is.
 */
export interface SeedStateAdopted {
  state: "adopted";
}

/** Present and correct; nothing was done. */
export interface SeedStateAlreadyWired {
  state: "already-wired";
}

/**
 * Both the service's value and lemonfiber's intent moved away from the
 * baseline. The conflict is presented — the value the operator set beside the
 * one lemonfiber would write — and the value left as it is; lemonfiber does not
 * resolve it on its own.
 *
 * Both values are shown in the report and serialized with it, so a
 * secret-bearing field must not report a conflict through this variant: a
 * conflict in a secret is to be reported without either value on show, and
 * wants a masked shape of its own rather than this one.
 */
export interface SeedStateConflicted {
  /** The value lemonfiber would write in its place. */
  ours: string;
  state: "conflicted";
  /**
   * The value the service now holds, as the operator set it; `None` where
   * they cleared it.
   */
  yours?: string | null;
}

/** Present but operator-changed; preserved. */
export interface SeedStateDrifted {
  state: "drifted";
}

/** Attempted and rejected, carrying the service's own words. */
export interface SeedStateFailed {
  /** What the service said. */
  detail: string;
  state: "failed";
}

/**
 * An area the operator declared unmanaged. Nothing was read from the service and
 * nothing was written to it, and the reason they gave is carried so a report says
 * whose decision it was.
 *
 * Apart from [`Self::Unmanaged`], which lemonfiber *infers* from a value it has
 * no record of having written, and which it adopts as the baseline so that later
 * runs recognise it. This one is a decision somebody wrote down, and it holds
 * whether or not lemonfiber would have had anything to say — nothing is adopted,
 * because adopting would be the first half of managing it again.
 */
export interface SeedStateObserved {
  /** Why the operator said to leave it alone, in their own words. */
  reason: string;
  state: "observed";
}

/**
 * Refused by lemonfiber's own policy, carrying the reason a re-run will not
 * resolve — such as two \*arrs pointed at one root folder, or a service that
 * does not serve the API version this build speaks. Either way nothing it
 * names was written, whether it was refused before the write or the write
 * itself found nothing to land in.
 */
export interface SeedStateRefused {
  /** Why it was refused, in lemonfiber's own words. */
  reason: string;
  state: "refused";
}

/** Prerequisite unavailable; a later run will complete it. */
export interface SeedStateSkipped {
  /** Why it could not be attempted. */
  reason: string;
  state: "skipped";
}

/**
 * Present and still lemonfiber's own value, but behind lemonfiber's intent —
 * it should be brought up to date. Reported until an update path applies it,
 * and never overwritten in the meantime.
 */
export interface SeedStateStale {
  state: "stale";
}

/**
 * A value the service already held that lemonfiber never wrote — the operator's
 * own, pre-existing. Adopted as the baseline this run rather than reported as
 * drift, so an existing setup is taken on instead of flagged wholesale. Its
 * value is not shown, so a secret among the adopted is never put on display.
 */
export interface SeedStateUnmanaged {
  state: "unmanaged";
}

/**
 * Something on this machine fills what a service asks for, and nothing lemonfiber
 * does connects the two — the filler names no adapter, or none lemonfiber pairs with
 * what the asker speaks.
 *
 * Settled, because no run changes it: the stack, or what is installed, has to. Said
 * rather than left out, because a filler nothing reaches and a filler lemonfiber
 * forgot would otherwise read the same, and the operator who installed one to stand
 * in for another is the one who needs to know which.
 */
export interface SeedStateUnmatched {
  /** What fills it, what asked, and why nothing connects them. */
  reason: string;
  state: "unmatched";
}

/** Written and read back. */
export interface SeedStateWired {
  state: "wired";
}

/**
 * An operator's own value a real run would take on as the accepted state, and
 * this one did not.
 *
 * Apart from [`Self::WouldWire`] because it is the other direction: nothing would
 * be written to the service at all, and what would move is lemonfiber's record of
 * what it expects. Its value is not shown, exactly as [`Self::Unmanaged`] does not
 * show one, so a secret among the adopted is never put on display by a question.
 */
export interface SeedStateWouldAdopt {
  state: "would-adopt";
}

/**
 * Not there, or not at what lemonfiber would have it be, and this run only said
 * so.
 *
 * The one outcome a pass that writes nothing can reach where a pass that writes
 * would have written. What a real run would leave the service holding sits beside
 * what it holds now, because a report saying a connection would be made without
 * saying what it would be made *to* is a count rather than an account — and a
 * count is what an operator asking for a rehearsal already has.
 *
 * Both values are serialized, so a secret-bearing field must not report through
 * this variant carrying one. It does not have to: `ours` is absent exactly where
 * a real run would generate the value rather than read it, which is the only
 * place a credential arises — the torrent client's web UI password and the media
 * server's admin account. A value minted to describe a rehearsal is a secret that
 * exists because somebody asked a question, and it would then have to be kept or
 * thrown away.
 *
 * `yours` is absent where the service holds nothing, and where this run could not
 * ask without writing — reading the household's telling means signing in as the
 * owner, and a session is state on somebody else's service.
 */
export interface SeedStateWouldWire {
  /**
   * What a real run would leave it holding, or `None` where that value would be
   * generated rather than read.
   */
  ours?: string | null;
  state: "would-wire";
  /**
   * What the service holds now, or `None` where it holds nothing or could not
   * be asked.
   */
  yours?: string | null;
}

/** One connection, and how it turned out. */
export interface Wiring {
  /** What was being connected, such as `SABnzbd into Sonarr`. */
  connection: string;
  /**
   * How serious the outcome is — information by default, a warning where the
   * connection breaks the stack.
   */
  severity: SeedSeverity;
  /** How it turned out. */
  state: SeedState;
}
