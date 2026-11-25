// Generated from the lemonfiber contract. Do not edit.
// The `copying` envelope, and the shapes only `copying` carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";
import type { Tree } from "../shared/tree.js";

/** What a running copy copies, as its reading names it. */
export type CopiedScope = CopiedScopeWholeStack | CopiedScopeService | CopiedScopeExisting;

/** An existing setup's own configuration. */
export interface CopiedScopeExisting {
  /** The Compose project it copies, to the operator alone. */
  project?: string | null;
  scope: "existing";
  /** The host trees it copies, to the operator alone. */
  trees?: Tree[] | null;
}

/** One named service's configuration alone. */
export interface CopiedScopeService {
  /** The service whose configuration it copies. */
  name: string;
  scope: "service";
}

/** Every service's configuration, plus lemonfiber's own and the stack. */
export interface CopiedScopeWholeStack {
  scope: "whole_stack";
}

/** Whether a copy is a backup or a restore. */
export type CopyWhat = "backup" | "restore";

/** The envelope carrying `copying`. */
export interface CopyingEnvelope {
  api_version: number;
  data: CopyingReport;
  host?: string | null;
  job?: string | null;
  kind: "copying";
}

/** The backup or restore running on this machine now, or none. */
export interface CopyingReport {
  /** The copy running now, or none. */
  running?: RunningCopy | null;
}

/** A backup or restore running now. */
export type RunningCopy = RunningCopyWorking | RunningCopyPaced | RunningCopyStalled;

/** Held to the operator's limit. */
export interface RunningCopyPaced {
  /** The name an accepting reply gave the work, where one did. */
  job?: string | null;
  /** The limit, in bytes a second. */
  limit: number;
  /** The area being written now, named. */
  part: string;
  /** What it copies. */
  scope: CopiedScope;
  /** When it started. */
  started: Instant;
  state: "paced";
  /** Whether it is a backup or a restore. */
  what: CopyWhat;
  /** The bytes it will write. */
  whole: number;
  /** The bytes written so far. */
  written: number;
}

/** Nothing written for the minutes the operator's setting holds. */
export interface RunningCopyStalled {
  /** The name an accepting reply gave the work, where one did. */
  job?: string | null;
  /** The area being written now, named. */
  part: string;
  /** What it copies. */
  scope: CopiedScope;
  /** When it started. */
  started: Instant;
  state: "stalled";
  /** Whether it is a backup or a restore. */
  what: CopyWhat;
  /** The bytes it will write. */
  whole: number;
  /** The bytes written so far. */
  written: number;
  /** The instant it last wrote. */
  wrote: Instant;
}

/** Writing as fast as it can. */
export interface RunningCopyWorking {
  /** The name an accepting reply gave the work, where one did. */
  job?: string | null;
  /** The area being written now, named. */
  part: string;
  /** What it copies. */
  scope: CopiedScope;
  /** When it started. */
  started: Instant;
  state: "working";
  /** Whether it is a backup or a restore. */
  what: CopyWhat;
  /** The bytes it will write. */
  whole: number;
  /** The bytes written so far. */
  written: number;
}
