// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `plugins` carries; `kinds/plugins` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { ApiKind, Contribution, PluginAdapterOwner, PluginChange, PluginChangedCheck, PluginDeclaration, PluginEvidence, PluginFailingAsDeclared, PluginOverriding, PluginPair, PluginPlaced, PluginStepAdapter } from "./api-kind.js";
import type { StepCame } from "../../shared/doctor__error__plugins.js";
import type { UndoReversal } from "../../shared/plugins__undo.js";

/**
 * What an install came to, and what it took to get there.
 *
 * **The three lists below are stated whether the run wrote anything or not, and that
 * is the whole of what makes a rehearsal worth running.** A rehearsal that reported
 * less than the real run would be a preview of a different operation; one that
 * reported it from code of its own would be a second derivation free to disagree
 * with the one that acts. So they are filled in one place, from the manifest and from
 * the very list of writes the install is carried out from, and the surface says them
 * in whichever tense `recorded` calls for.
 */
export interface PluginInstall {
  /**
   * What those verdicts were reached against, or nothing where none were reached.
   *
   * Carried rather than assumed, because the two kinds of evidence are not the
   * same claim: an author's read asks the recordings a plugin ships, and an
   * install asks the service running on this machine. The weaker must not be
   * readable as the stronger, and a reader handed a verdict has nothing else in
   * the document to tell them apart.
   */
  against?: PluginEvidence | null;
  /** Every change it makes to the machine, in the order it makes them. */
  changes: PluginChange[];
  /**
   * Every ask of the stack's the install leaves contested that is not contested
   * now, as it would then stand.
   *
   * A plugin's service that claims what the stack asks for is a candidate like any
   * other, so installing it leaves the ask refused until somebody chooses — which is
   * a change to what the stack does, and stated with the rest before it happens.
   */
  contests: WiringContest[];
  /**
   * Every bundled thing the plugin declares it will change.
   *
   * The full extent rather than a sample of it: a manifest may change a bundled
   * setting only through a recipe, and a recipe reaching one no `[[override]]`
   * names is refused before anything is written.
   */
  overrides: PluginOverriding[];
  /**
   * Every proof that has to hold before the plugin is installed, and on a run
   * that asked them, what each came to.
   */
  proofs: PluginProving[];
  /**
   * Every install recipe the act ran, in order, with what each step came to; an
   * empty list where none ran, which is every rehearsal and every plugin declaring no
   * install recipe.
   *
   * A recipe that did not hold ends the act with a problem carrying the same account,
   * so this is the account of recipes that held.
   */
  recipes_ran: PluginRecipeRan[];
  /** Whether it was written down. A rehearsal leaves this false. */
  recorded: boolean;
  /**
   * What putting the install back came to, where something failed and it was.
   *
   * The rollback layer's own report rather than a shape of this verb's: what went
   * back, and what did not with the reason each is still standing. Absent on a run
   * that had nothing to put back, which is both a rehearsal and an install that
   * held.
   */
  reversed?: UndoReversal | null;
  /**
   * What the stack's own checks made of the install, or nothing on a run that
   * asked them nothing.
   *
   * The other half of what an install has to establish, and the half a plugin
   * cannot establish for itself: its proofs say the plugin works, and this says the
   * stack still does. Absent on a rehearsal, which writes nothing and so has
   * nothing to hold a reading against.
   */
  verified?: PluginVerification | null;
  /** What the install settled, said whether or not it was written down. */
  would: PluginInstalled;
}

/** One plugin's install, as it was decided. */
export interface PluginInstalled {
  /** Every adapter of lemonfiber's its own services name, each said to be lemonfiber's. */
  adapters?: PluginServiceAdapter[];
  /**
   * Every row it adds to a register lemonfiber already runs, as the install
   * settled them.
   *
   * Kept here rather than read back off the plugin's own files, for the reason
   * everything else on this record is: the author's directory may be gone the
   * moment an install is done, and a doctor run a month later is a question about
   * this machine rather than about a document. This record is the one answer, so a
   * row that runs is a row that was declared at install and has not changed under
   * anybody since.
   *
   * Defaulted for a register written before this field existed, which reads as a
   * plugin that contributes nothing — the same answer a plugin that contributes
   * nothing gets, and the only one that can be given about a record that does not
   * say.
   */
  contributions?: Contribution[];
  /**
   * What the plugin declared about itself: where it is published, whether it was
   * reviewed, what it claims, what it may change, where it may reach and what it
   * will hold.
   */
  declared?: PluginDeclaration;
  /** What it does for the operator, in its author's words. Absent alike. */
  description?: string | null;
  /**
   * The source it was installed from, as the operator named it.
   *
   * Empty for a record written before this was kept. A rehearsal's account carries
   * the source it was asked about, because that is what it would record.
   */
  from?: string;
  /**
   * When it was installed, as the record stamps every change: whole seconds since
   * the epoch.
   *
   * The install's own stamp, the one its changes are journalled under, so the
   * listing and the history name the same moment. Empty where the record predates
   * it; a rehearsal's account carries the moment it was asked, which is the stamp
   * the install would have run under.
   */
  installed_at?: string;
  /** The SHA-256 of the manifest it was installed from, in lower-case hexadecimal. */
  manifest?: string;
  /**
   * What the plugin calls itself, for a person to read.
   *
   * Absent on a record written before it was kept, and never filled in from the id:
   * a name is the author's, and one made up here would be lemonfiber's.
   */
  name?: string | null;
  /** The plugin's id: the name it is installed and journalled under. */
  plugin: string;
  /**
   * Every core capability its services fill, as the install settled them.
   *
   * Core names only. A capability of the plugin's own is namespaced, nothing asks
   * for it, and it is inert by design — so a removal that named one as about to go
   * unfilled would be warning about something nothing was reaching for.
   *
   * Kept for the question a removal has to answer before it happens: what this
   * machine would have nothing filling once the plugin is off it. Asking the
   * manifest would be asking a file that may be gone.
   *
   * Defaulted for a register written before the field existed, which reads as a
   * plugin that fills nothing — the answer that names no capability rather than the
   * one that invents one.
   */
  provides?: string[];
  /**
   * Every recipe it declares: each call in order with the adapter it reaches through,
   * and every value that could leave for somewhere else.
   *
   * Empty for a plugin that declares none and for a record written before these were
   * kept, so a list is always there to read.
   */
  recipes?: PluginRecipe[];
  /**
   * The commit it was installed at, where it came from a git source.
   *
   * The one commit the revision named at install resolved to, so what was installed
   * can be told from whatever that source serves now. Empty for a plugin installed
   * from a directory, which has no revision to name, and for a record written before
   * this was kept.
   */
  revision?: string;
  /** What was placed, one entry per service the plugin declares. */
  services: PluginPlaced[];
  /**
   * What signed it: the key the catalogue index it was resolved through verified
   * against, named with its fingerprint; empty where nothing signed it.
   */
  signed?: string;
  /** The plugin's own content version, as it stood when it was installed. */
  version: string;
}

/** One answer a plugin's adapter gave outside a contract it speaks. */
export interface PluginNonconforming {
  /** When it answered so, as RFC 3339. */
  at: string;
  /** The capability it was asked as. */
  capability: string;
  /** The operation it was asked. */
  operation: string;
  /** The plugin whose adapter answered. */
  plugin: string;
  /** What was outside the contract. */
  why: string;
}

/** One proof that has to hold before a plugin is reported installed. */
export interface PluginProving {
  /** What it asks, as the method and the path it is asked at. */
  asks: string;
  /**
   * What asking it came to, or nothing where it was not asked.
   *
   * Absent on a rehearsal, which asks nothing. That is a different fact from a
   * proof that was asked and established nothing, and the two must not read alike:
   * one is an account of what would happen, the other is a service that did not
   * answer.
   */
  came_to?: PluginVerdict | null;
  /** What it establishes, in one line. */
  establishes: string;
  /**
   * Which of the plugin's services it asks, where the manifest settles that.
   *
   * Nothing where it does not, which is a manifest the reader has already refused
   * — carried as an absence rather than as a guess, so that a report built from a
   * manifest nobody held to the reader says *this was not settled* instead of
   * naming whichever service came first.
   */
  of?: string | null;
  /** The proof's id, which its verdict is reported against. */
  proof: string;
  /** Why it is worth asserting. */
  why: string;
}

/** One recipe, as an operator agrees to what it does. */
export interface PluginRecipe {
  /** The recipe's id within the plugin. */
  id: string;
  /** Every value it could carry, and where to. */
  pairs: PluginPair[];
  /** Every call, in the order the recipe makes them. */
  steps: PluginStep[];
  /** What it accomplishes, in one line. */
  title: string;
  /** Why it is worth running. */
  why: string;
}

/** What one recipe came to. */
export interface PluginRecipeRan {
  /** Whether every step it made came to what it should. */
  held: boolean;
  /** The recipe's id. */
  recipe: string;
  /** Every step it declares, in order, with what each came to. */
  steps: PluginStepRan[];
  /** Why it did not, where it did not. */
  why?: string | null;
}

/** What taking a plugin off the machine came to, or would come to. */
export interface PluginRemoval {
  /**
   * Every service that stops when it goes, named before any of them does.
   *
   * By service rather than by plugin, because a service is what an operator notices
   * stopping: a plugin that brought two containers takes two things away, and the
   * plugin's name alone would not say which of the addresses they use goes quiet.
   * None of them comes back — a removal is not a restart — which is why this is
   * stated before the run rather than discovered after it.
   */
  interrupts: string[];
  /**
   * Every capability that would have nothing filling it afterwards.
   *
   * Stated before it happens rather than reported after, which is the requirement
   * and also the only useful order: an operator told afterwards that their requests
   * no longer reach anything has been informed rather than asked.
   */
  leaves: PluginUnfilled[];
  /** The plugin this is about. */
  plugin: string;
  /**
   * Whether the record of what is installed was written without it.
   *
   * False on a rehearsal and on a run that got as far as putting the files back and
   * no further, which are two different machines and are told apart by what the
   * reversal says rather than by a second flag here.
   */
  removed: boolean;
  /**
   * What putting its changes back came to, or would come to.
   *
   * The rollback layer's own report rather than a shape of this verb's: a removal is
   * a reversal with a name on it, and an account of its own would be a second
   * description of the same work.
   */
  went_back: UndoReversal;
}

/** What asking an installed plugin's adapters again came to. */
export interface PluginReproof {
  /** Whether its adapters were asked, rather than only said to be. */
  asked: boolean;
  /**
   * Whether every answer kept against the plugin was cleared, which a proof that did
   * not hold never does.
   */
  cleared: boolean;
  /** Every answer kept against the plugin when it was proved, which a pass clears. */
  kept: PluginNonconforming[];
  /** The plugin proved. */
  plugin: string;
  /** Each proof asked, or that would be asked, with what it came to. */
  proofs: PluginProving[];
}

/** Where an update did not hold: what putting the version it replaced back came to. */
export interface PluginRestored {
  /** Whether everything its record says it placed is on the machine again. */
  placed: boolean;
  /**
   * Whether its containers are running again.
   *
   * Apart from `placed`, because the two fail differently: a document that would not
   * land is a disk, and a container that would not start is the engine — and an
   * operator fixes them in different places.
   */
  running: boolean;
  /** The version put back, which is the one the record still names. */
  version: string;
}

/** One adapter of lemonfiber's that one of the plugin's own services names. */
export interface PluginServiceAdapter {
  /** Which of lemonfiber's adapters it is. */
  kind: ApiKind;
  /** Whose it is, which is lemonfiber's. */
  owner: PluginAdapterOwner;
  /** The service that names it. */
  service: string;
}

/** Whether one installed plugin's source can still be fetched. */
export interface PluginSource {
  /** The source the record says it came from. */
  from: string;
  /** The plugin, by its id. */
  plugin: string;
  /** What asking it came to. */
  standing: PluginSourceStanding;
}

/**
 * What asking a plugin's source came to.
 *
 * **Unreachable is not untrusted.** A plugin whose source has gone keeps running as it
 * was installed; what it loses is the way to a newer version, and that is said now
 * rather than found out at the next update.
 */
export type PluginSourceStanding = PluginSourceStandingReachable | PluginSourceStandingUnreachable | PluginSourceStandingUnasked;

/** It answered, so the plugin can be updated from it. */
export interface PluginSourceStandingReachable {
  standing: "reachable";
}

/** Nothing was asked, so nothing is known either way. */
export interface PluginSourceStandingUnasked {
  standing: "unasked";
  /** Why nothing was asked. */
  why: string;
}

/** It did not answer, or is no longer there, so the plugin cannot be updated from it. */
export interface PluginSourceStandingUnreachable {
  standing: "unreachable";
  /** What asking it said. */
  why: string;
}

/** One call a recipe makes, in the order it makes them. */
export interface PluginStep {
  /**
   * The adapter the destination is reached through, or nothing where it is a name
   * outside the stack, which no adapter of lemonfiber's speaks to.
   */
  adapter?: PluginStepAdapter | null;
  /** The step's id within its recipe. */
  id: string;
  /** The HTTP method it calls with. */
  method: string;
  /** The path it calls. */
  path: string;
  /**
   * Where it calls: a service of this stack's or the plugin's own, or a name outside
   * both, as the manifest wrote it. Never a resolved address.
   */
  to: string;
}

/** What one step came to. */
export interface PluginStepRan {
  /** What it came to. */
  came: StepCame;
  /**
   * Whether it reached somewhere other than this plugin's own services, which an
   * install going back cannot undo.
   */
  landed: boolean;
  /** The status its last answer carried, where anything answered. */
  status?: number | null;
  /** The step's id. */
  step: string;
  /** Where it calls, by the name the manifest gives it. */
  to: string;
  /** How many times it was made. */
  tries: number;
  /** Why it came to what it did, where that wants saying. */
  why?: string | null;
}

/**
 * A capability the operator chose one of a plugin's services to fill.
 *
 * The only way anything a plugin brought comes to fill what the stack asks for in
 * place of the stack's own: a plugin cannot choose, and wiring by name is not
 * something a plugin can introduce. So what a plugin substituted is what the operator
 * substituted with it, and it is read off the recorded choices rather than off the
 * plugin.
 */
export interface PluginSubstituted {
  /** The capability it fills. */
  capability: string;
  /** The plugin whose service it is. */
  plugin: string;
  /** The service chosen. */
  service: string;
}

/** A capability that would have nothing filling it. */
export interface PluginUnfilled {
  /** The core name nothing would fill. */
  capability: string;
  /**
   * The plugin that is filling it now, which is the one going.
   *
   * Named rather than left to the reader, because the sentence an operator has to
   * act on is *this is the only thing filling it* and a capability on its own does
   * not say that.
   */
  filled_by: string;
}

/** What one assertion came to, whatever answered it. */
export type PluginVerdict = PluginVerdictPassed | PluginVerdictFailed | PluginVerdictUnproven | PluginVerdictFailingAsDeclared;

/** It does not, in every way it does not. */
export interface PluginVerdictFailed {
  /** Every way the recorded answer is not the declared one. */
  faults: string[];
  outcome: "failed";
}

/**
 * It fails on the recordings its manifest declares it fails on, on the constraint
 * each declaration names and on nothing else, and holds on every other recording it
 * was run against.
 *
 * Apart from passed and from failed, and counted as neither. The assertion does not
 * hold there, so a pass would say the opposite of what the recording shows; and the
 * failure is the one its author described and gave a reason for, so it does not
 * fail the run. Only ever reached against recordings: the live service is held to
 * the expectation as it is written.
 */
export interface PluginVerdictFailingAsDeclared {
  /** Each declared recording, what it held, and why it is one the assertion fails on. */
  declared: PluginFailingAsDeclared[];
  outcome: "failing-as-declared";
}

/** The recording answers what the binding declares. */
export interface PluginVerdictPassed {
  outcome: "passed";
}

/** It could not be run, and so established nothing either way. */
export interface PluginVerdictUnproven {
  outcome: "unproven";
  /** What stopped it being run. */
  why: string;
}

/** What the stack's own checks made of an install. */
export interface PluginVerification {
  /**
   * Every check this install made worse.
   *
   * Empty is the answer an install needs, and it is the common one. What is here
   * is what takes the install back.
   */
  broke: PluginChangedCheck[];
  /**
   * Every check nothing could be concluded about across the two readings.
   *
   * Reported and never acted on. *I could not tell* is not *it is still broken*,
   * and an install reversed because a check could not reach a provider it also
   * could not reach an hour ago would be punishing a plugin for the weather. It is
   * said out loud rather than dropped, because the assurance an operator thought
   * they had is the thing that went.
   */
  unsettled: PluginChangedCheck[];
}

/**
 * An ask several services claim and nothing has chosen between, so it reaches
 * nothing.
 */
export interface WiringContest {
  /** The service that asked. */
  by: string;
  /** What it asked for. */
  capability: string;
  /** Every claimant, named — a plugin's with the plugin beside it. */
  claimants: string[];
}
