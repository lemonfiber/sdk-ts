// Generated from the lemonfiber contract. Do not edit.
// The shapes `plugins` and `undo` both carry.
// Regenerate with `npm run contract:generate`.

/**
 * What an undo does.
 *
 * Tagged by what it does rather than by the field it sits in, so a reader parsing
 * one branches on a word rather than on which keys are present.
 */
export type Action = ActionRemove | ActionRestore | ActionDelete | ActionWithdraw | ActionRewind | ActionRepin | ActionReconfigure | ActionRevoke | ActionReinstate;

/** Remove a path that was created. */
export interface ActionDelete {
  does: "delete";
  /** The path to remove. */
  path: string;
}

/**
 * Put one field of a service's own resource back to what it held.
 *
 * The only reversal that needs the service itself: the value lives inside it,
 * and nothing on the host can write it. A reversal that cannot reach the
 * service says so rather than reporting the field restored.
 */
export interface ActionReconfigure {
  does: "reconfigure";
  /** The field to put back. */
  field: string;
  /** The identifier to change. */
  id: string;
  /** The kind of resource. */
  resource: string;
  /** What to put back, or `None` where it held nothing. */
  value?: string | null;
}

/**
 * Make a revoked key good again.
 *
 * Worked out so the record of a revoke has a reversal to name, and never carried
 * out: a key is revoked because something should stop holding it, and reinstating
 * it would hand back what the revoke took away. Whatever still needs a key is
 * minted a new one.
 */
export interface ActionReinstate {
  does: "reinstate";
  /** The key's name. */
  name: string;
}

/** Remove the resource that was created. */
export interface ActionRemove {
  does: "remove";
  /** The identifier to remove. */
  id: string;
  /** The kind of resource. */
  resource: string;
}

/**
 * Pin a service back to the version it was standing on.
 *
 * The one reversal nothing in this product carries out. Which version runs is
 * decided by the materialised stack and by what Compose was told to start, and
 * a reversal of settings and files reaches neither — so this is worked out,
 * reported, and left for the operator rather than attempted.
 */
export interface ActionRepin {
  /**
   * The version this run moved it to, which has to still be the one running
   * for putting the old one back to be putting anything back.
   */
  current: string;
  does: "repin";
  /** The version to put back. */
  previous: string;
}

/** Restore a value, or remove it where there was none before (`None`). */
export interface ActionRestore {
  does: "restore";
  /** The setting to restore. */
  key: string;
  /** What to restore it to, or `None` to remove it. */
  value?: string | null;
  /**
   * What lemonfiber put there, which has to still be there for putting the
   * old value back to be putting anything back.
   *
   * Carried so that a reversal can ask whether it is undoing its own work.
   * Without it a reversal knows only what it would like the setting to say,
   * and a setting the operator has since chosen for themselves reads exactly
   * like one nobody has touched.
   */
  wrote: string;
}

/** Revoke the key a mint made. */
export interface ActionRevoke {
  does: "revoke";
  /** The key's name. */
  name: string;
}

/**
 * Write a file back to what it held before lemonfiber wrote over it.
 *
 * Only where it still holds what was written. One written since is somebody
 * else's work now, and is left exactly as it is.
 */
export interface ActionRewind {
  does: "rewind";
  /** The file to write back. */
  path: string;
  /** What to write back into it. */
  previous: string;
  /**
   * The checksum of what lemonfiber wrote, which has to still be what is there
   * for writing the old text back to be undoing lemonfiber's own work.
   */
  written: number;
}

/**
 * Take a region lemonfiber wrote back out of the file it was written into.
 *
 * Only where the region is still what was written. One that was edited since, or
 * whose markers were, is somebody else's work now, and is left exactly as it is.
 */
export interface ActionWithdraw {
  does: "withdraw";
  /**
   * The same file beneath the stack directory, as the record of what lemonfiber
   * materialised names it.
   */
  key: string;
  /** Whose region it is, as its markers name it. */
  owner: string;
  /** The file the region is in. */
  path: string;
  /**
   * The checksum of what was written between the markers, which has to still be
   * what is there for taking it out to be taking out lemonfiber's own work.
   */
  written: number;
}

/** A single reversal, for the surface to carry out. */
export interface Undo {
  /** What reversing it does. */
  action: Action;
  /** The service or file to reverse it against. */
  target: string;
}

/** One change a reversal did not put back, and why it did not. */
export interface UndoLeft {
  /** Why it is still standing, in the operator's terms. */
  because: string;
  /** What the change was against — a service, or lemonfiber's own environment file. */
  target: string;
}

/** What putting one change back means beyond the change itself. */
export interface UndoNoted {
  /** What goes back, what does not go with it, and what to do instead. */
  because: string;
  /** What the change was against. */
  target: string;
}

/**
 * What putting a run back came to.
 *
 * A report rather than a bare list, because it is what an envelope carries and an
 * envelope carries a document. Two lists, and the second is the one that matters when
 * it is not empty: what went back, and what did not with the reason it did not.
 */
export interface UndoReversal {
  /**
   * What was not put back, each with the reason it was not.
   *
   * A reversal an operator asked for by name has to say what it did *not* do. Five
   * changes asked back and three carried out is a machine in a state nobody has been
   * told about, and "some of it worked" is the sentence that makes somebody go
   * looking by hand. Empty where everything went back, which is the common case.
   *
   * On a run that only said what it would do, this is what it cannot promise: a
   * change that goes back through the service that made it goes back only where that
   * service is answering, and a rehearsal has not asked one.
   */
  left: UndoLeft[];
  /**
   * What putting these changes back means beyond the changes themselves.
   *
   * Empty on almost every run. What lands here is a change the judgement can put
   * back in full and that still leaves something behind — the one in force today
   * being a setting that re-points where data lives, which goes back while the
   * library stays exactly where it was moved to.
   *
   * Neither list above can carry it. It did not fail to go back, so it is not what
   * was left; and reporting only that it went back would send an operator looking
   * for their files at an address that no longer names them.
   */
  noted?: UndoNoted[];
  /**
   * Whether this run only said what it would put back.
   *
   * A flag rather than a second shape, because the two lists mean the same thing
   * either way and a caller reading them should read one document. What changes is
   * the tense a surface says them in.
   */
  rehearsed: boolean;
  /**
   * What was put back, in the order it was — or, on a run that only said what it
   * would do, what would go back.
   */
  reversed: Undo[];
}
