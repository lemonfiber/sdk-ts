// Generated from the lemonfiber contract. Do not edit.
// The shapes `backup` and `restore` both carry.
// Regenerate with `npm run contract:generate`.

import type { Tree } from "./tree.js";

/**
 * How much of the stack a backup covers.
 *
 * Whole-stack is the common case, but restoring one service is often what is
 * actually wanted — one curator's configuration mangled while the rest is fine —
 * so the scope is recorded in the archive and honoured on the way back.
 */
export type Scope = ScopeWholeStack | ScopeService | ScopeExisting;

/**
 * An existing setup's own configuration, at the host paths it keeps it in.
 *
 * The one scope whose sources are not lemonfiber's layout. A capture taken
 * before a takeover has to cover the tree that is already there — lemonfiber's
 * own holds nothing worth protecting until the takeover has happened — so the
 * host path each tree was read from is recorded here, in the manifest, rather
 * than inferred from a layout that does not describe it.
 *
 * Recording those paths is also what makes putting one back an ordinary
 * extraction the operator performs deliberately, rather than something
 * lemonfiber does on their behalf into a tree it does not manage.
 */
export interface ScopeExisting {
  /** The Compose project the capture was taken from. */
  project: string;
  scope: "existing";
  /** The host trees captured, in the order the survey reported them. */
  trees: Tree[];
}

/** One named service's configuration alone. */
export interface ScopeService {
  /** The service whose configuration this covers. */
  name: string;
  scope: "service";
}

/** Every service's configuration, plus lemonfiber's own and the stack. */
export interface ScopeWholeStack {
  scope: "whole_stack";
}
