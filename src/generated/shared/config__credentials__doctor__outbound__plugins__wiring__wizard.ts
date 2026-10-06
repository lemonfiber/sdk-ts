// Generated from the lemonfiber contract. Do not edit.
// The shapes `config`, `credentials`, `doctor`, `outbound`, `plugins`, `wiring` and `wizard` all carry.
// Regenerate with `npm run contract:generate`.

/**
 * Where a value in force came from.
 *
 * Published under a name of its own because the generated schema keys on the type's
 * bare name, and a second `Origin` in the crate would be merged with this one into a
 * single definition carrying the variants of both — a published contract saying a
 * credential may be *unknown* and a setting may be *service*, neither of which is
 * true, and neither of which the additive-only surface check would refuse.
 */
export type ValueOrigin = ValueOriginBundled | ValueOriginOperator | ValueOriginPlugin | ValueOriginUnknown | ValueOriginOverridden | ValueOriginOrphaned;

/** This build's own, out of what lemonfiber ships rather than out of a choice. */
export interface ValueOriginBundled {
  origin: "bundled";
}

/** The operator settled it, whether by answering for it or by editing it since. */
export interface ValueOriginOperator {
  origin: "operator";
}

/**
 * A plugin set it and is no longer installed, and the value is still in force.
 *
 * Only where the record of what is installed was read and does not hold that
 * plugin. A record that would not read cannot say a plugin is gone, so that is
 * an unknown rather than this.
 */
export interface ValueOriginOrphaned {
  /** Which plugin set it. */
  named: string;
  origin: "orphaned";
}

/**
 * An installed plugin set it over a value that was there before, and that value
 * is carried with it: what is in force and what it replaced are read together.
 */
export interface ValueOriginOverridden {
  /** Which plugin set what is in force. */
  named: string;
  origin: "overridden";
  /** What it replaced, and where that came from. */
  replaced: ValueReplaced;
}

/** A named plugin set it. */
export interface ValueOriginPlugin {
  /** Which one, so the thread back to it is a name rather than a search. */
  named: string;
  origin: "plugin";
}

/** It could not be established, and what stopped it. */
export interface ValueOriginUnknown {
  origin: "unknown";
  /**
   * What stopped it being established, so the gap reads as a reason rather
   * than as a shrug.
   */
  why: string;
}

/**
 * The value a plugin's change replaced, and where that value came from.
 *
 * Its own origin rather than assumed to be this build's default: before a plugin
 * set a value, the operator may have, or another plugin, and calling that value
 * *bundled* would tell somebody putting it back that they are returning to a
 * default when they are returning to a choice.
 */
export interface ValueReplaced {
  /**
   * Where the replaced value came from, read from the record of the change that
   * wrote it, and unknown where nothing recorded one.
   */
  from: ValueOrigin;
  /**
   * What it held, where there was a value and it may be shown. Nothing where nothing
   * was set — this build's default was in force — or where it is withheld.
   */
  value?: string | null;
  /**
   * Whether a value is withheld because the setting holds a credential. A replaced
   * credential is shown as sealed and never in clear, as the one in force is.
   */
  withheld: boolean;
}
