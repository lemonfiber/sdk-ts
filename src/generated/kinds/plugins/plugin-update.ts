// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `plugins` carries; `kinds/plugins` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { PluginInstall, PluginInstalled, PluginNonconforming, PluginRemoval, PluginReproof, PluginRestored, PluginSource, PluginSubstituted } from "./plugin-step.js";
import type { UndoReversal } from "../../shared/plugins__undo.js";

/**
 * What is installed, and what installing one came to.
 *
 * One answer for the reading and for the verb, because they are one question: an
 * operator who has just installed something wants to see it among what they had, and
 * a rehearsal that showed only the new entry would not say what it is joining.
 */
export interface PluginInstalls {
  /**
   * What this run's reading names itself, so an answer to it can say which reading
   * it answered; nothing on the reading of what is installed, which offers nothing.
   *
   * Named part by part, so an answer refused because something moved is told which
   * part did.
   */
  agreement?: string | null;
  /**
   * What this run's install came to, or nothing where it only read.
   *
   * Boxed for the reason the update is: it carries a whole account, and every other
   * run's report would otherwise be as large as the one run that installs.
   */
  install?: PluginInstall | null;
  /**
   * Every plugin the record holds.
   *
   * What it holds, rather than what it would hold: a rehearsal wrote nothing, so
   * what it settled is in `install` and not here. A listing that counted it
   * would report an install that did not happen.
   */
  installed: PluginInstalled[];
  /**
   * Every answer an installed plugin's adapter gave outside its contract, kept until a
   * proof it passes clears it: the plugin fills none of those capabilities meanwhile.
   *
   * Filled on the reading of what is installed, as `substituted` is.
   */
  nonconforming?: PluginNonconforming[];
  /** What proving a plugin again came to, or nothing where nothing was proved. */
  proof?: PluginReproof | null;
  /**
   * Whether this was a rehearsal: what would have happened, with none of it done.
   *
   * Said in a field of its own so that a rehearsal is never told from the real run by
   * its wording alone.
   */
  rehearsed: boolean;
  /**
   * What this run's removal came to, or nothing where it removed nothing.
   *
   * Beside the install rather than in place of it, and never both at once: an
   * install and a removal are two verbs with two accounts, and a field that held
   * whichever happened would make a reader ask which one this was before they could
   * read it.
   */
  removal?: PluginRemoval | null;
  /**
   * Whether each installed plugin's source can still be fetched, asked now.
   *
   * Filled on the reading of what is installed and nowhere else, for the reason
   * `substituted` is: it is the one read an operator makes of what each plugin is
   * doing, and the one moment this machine asks anybody where a plugin came from. A
   * run that installs, updates or removes one leaves it empty.
   */
  sources?: PluginSource[];
  /**
   * Every capability the operator chose an installed plugin's service to fill.
   *
   * Filled on the reading of what is installed, which is the one read of what each
   * plugin is doing; a run that installs, updates or removes one leaves it empty,
   * because none of them changes a choice.
   */
  substituted?: PluginSubstituted[];
  /**
   * What this run's update came to, or nothing where it updated nothing.
   *
   * A third field rather than an install and a removal filled in together, for the
   * reason those two are apart: an update is one operation with one account.
   *
   * Boxed because it carries a whole install's account beside the reversal, and
   * every other run's report would otherwise be as large as the one run that updates.
   */
  update?: PluginUpdate | null;
}

/**
 * What updating a plugin came to, or would come to, as one account.
 *
 * **One account, because it is one operation.** An update is the version installed
 * going back and another coming on, and a report that gave those as a removal and an
 * install side by side would invite reading them as two things that might each have
 * happened. What an operator has to be able to read off this is which version the
 * machine is on, and there are exactly two answers: the new one, where
 * `install.recorded` is true, or the one it replaced, which `restored` says the state
 * of.
 */
export interface PluginUpdate {
  /** The version the record named before this run. */
  from: string;
  /**
   * The new version's own account: what it writes, what it has to prove, what it
   * proved and what the stack's checks made of it — the same one an install gives,
   * because it is the same work. `recorded` is whether the update holds.
   */
  install: PluginInstall;
  /**
   * Every service of the installed version that stops, named before any of them
   * does.
   */
  interrupts: string[];
  /** The plugin this is about. */
  plugin: string;
  /**
   * Where the update did not hold, what putting the version it replaced back came
   * to. Absent on a rehearsal and on an update that held.
   */
  restored?: PluginRestored | null;
  /**
   * What stopped the new version before its proofs could be asked, where something
   * did: a write that would not land, a container that would not start, or a record
   * that could not be written. A proof or a check that did not hold is in `install`.
   */
  stopped?: string | null;
  /** The version this run installs, or would. */
  to: string;
  /**
   * What putting the installed version's changes back came to, or would come to.
   *
   * Where the plugin's own configuration directory holds what its service wrote, it
   * is named here as still standing, which on an update is the point: the new
   * version is started against the same directory, and an update that took it would
   * be a reinstall that lost everything the old one knew.
   */
  went_back: UndoReversal;
}

/** The envelope carrying `plugins`. */
export interface PluginsEnvelope {
  api_version: number;
  data: PluginInstalls;
  host?: string | null;
  job?: string | null;
  kind: "plugins";
}
