// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `plugins` carries; `kinds/plugins` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { PluginInstall, PluginInstalled, PluginRemoval, PluginSource, PluginSubstituted, PluginUpdate } from "./plugin-recipe.js";

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

/** The envelope carrying `plugins`. */
export interface PluginsEnvelope {
  api_version: number;
  data: PluginInstalls;
  host?: string | null;
  kind: "plugins";
}
