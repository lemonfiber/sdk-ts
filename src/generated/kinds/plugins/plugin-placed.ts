// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `plugins` carries; `kinds/plugins` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { Api, ApiKind, Contribution, Expect, PluginAdapterOwner, PluginAsking, PluginChangedCheck, PluginDeclaration, PluginFailingAsDeclared, PluginReached, PluginRequest, PluginShape, ServiceFields } from "./api-kind.js";
import type { StepCame } from "../../shared/doctor__error__plugins.js";

/** One plugin's install, as it was decided. */
export interface PluginInstalled {
  /** Every adapter of lemonfiber's its own services name, each said to be lemonfiber's. */
  adapters?: PluginServiceAdapter[];
  /**
   * Every row it adds to a register lemonfiber already runs, as the install settled
   * them, so the doctor reads them off this record rather than off the plugin's files.
   * Defaulted for a register written before this field existed.
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
   * Every core capability its services fill, as the install settled them, core names
   * only, which is what a removal reads to say what would go unfilled. Defaulted for a
   * register written before the field existed, which reads as filling nothing.
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
  /** Every proof it declares that asks one of its services a question. */
  request_proofs?: PluginRequestProof[];
  /**
   * The commit it was installed at, where it came from a git source.
   *
   * The one commit the revision named at install resolved to, so what was installed
   * can be told from whatever that source serves now. Empty for a plugin installed
   * from a directory, which has no revision to name, and for a record written before
   * this was kept.
   */
  revision?: string;
  /** Every proof it declares that runs the image's own program. */
  run_proofs?: PluginRunProof[];
  /** What was placed, one entry per service the plugin declares. */
  services: PluginPlaced[];
  /**
   * What signed it: the key the catalogue index it was resolved through verified
   * against, named with its fingerprint; empty where nothing signed it.
   */
  signed?: string;
  /**
   * The digest of the plugin's tree it was installed from, `sha256:<hex>`; empty
   * where the tree could not be read whole, or the record predates it.
   */
  tree?: string;
  /** The plugin's own content version, as it stood when it was installed. */
  version: string;
}

/** One value a recipe could carry to one destination, as the operator agrees to it. */
export interface PluginPair {
  /**
   * What approving this pair is written as, on the command line and over the web,
   * where it carries the value to a host outside the stack or carries a release.
   * Absent on any other pair to a service in this stack, which takes nothing off the
   * machine or away from the service it came from, and asks for no approval.
   */
  approval?: string;
  /**
   * The service in this stack the released value was read from, where the pair
   * releases it. Absent on every other pair.
   */
  from?: string;
  /**
   * Whose value it is, as its input or the step that captures it says; empty where
   * neither does.
   */
  origin: string;
  /**
   * Why the value is carried away from the service it was read from, in the manifest's
   * own sentence, where the pair releases it. Absent on every other pair.
   */
  release?: string;
  /** Where it may be carried, by the name the manifest gives it. */
  to: string;
  /** What the value is called within the recipe. */
  value: string;
}

/** One service of an installed plugin, as it was placed. */
export interface PluginPlaced {
  /**
   * The adapter of lemonfiber's its manifest names, which only a part the bundle
   * assembles is reached through. A record read from the register holds none, whatever
   * an older one carried: an installed plugin is reached over the contracts it speaks.
   */
  api?: Api | null;
  /** Every capability it asks for. */
  asks?: PluginAsking[];
  /** What it asks for there, where it says. */
  asks_for?: string | null;
  /**
   * Where inside the container its one configuration directory is mounted.
   *
   * Resolved rather than optional. The record answers where the directory is, and
   * a run that re-derived the fallback would answer for a container it did not
   * write the day that fallback moved.
   */
  config_path: string;
  /**
   * The line its dashboard entry shows beside it: the one its wiring names, or what
   * the plugin says it does for the operator.
   */
  description?: string;
  /** The digest that fixes what runs. */
  digest: string;
  /** Its container fields beyond those above. */
  fields?: ServiceFields;
  /** The service of the same plugin it stands in front of, as an adapter. */
  fronts?: string | null;
  /** The path it answers over HTTP to say it is up, where its health is asked that way. */
  health?: string | null;
  /** Whether its wiring hid it from the dashboard. */
  hidden?: boolean;
  /** The icon its dashboard entry shows, where its wiring names one. */
  icon?: string | null;
  /** The registry path, carrying no pin of its own. */
  image: string;
  /** The port it answers on inside the stack's network, where it declared one. */
  listens?: number | null;
  /**
   * The media it files, in the stack manifest's vocabulary, which decides what it
   * comes to in each service that asks for what it provides; none in an older record.
   */
  media_types?: string[];
  /**
   * What it is called, for a reader, which is what its dashboard entry is listed as;
   * a record written before this was kept lists it by its id.
   */
  name?: string;
  /** The API it answers the stack's other services in, where it names one. */
  native?: string | null;
  /**
   * Networks an older record named for it. Nothing reads them: each service's place on
   * the networks is derived with the project, and a record written now holds none.
   */
  networks?: string[];
  /**
   * Every core capability this one service fills, which is what makes it a candidate
   * when the stack asks for one.
   *
   * Per service rather than read off the plugin's whole list, because a wiring
   * reaches a service and not a plugin: of a plugin's two services, the one that
   * fills a capability is the one an ask for it would reach. Defaulted for a record
   * written before this was kept, which reads as filling nothing — a service nothing
   * is wired to, rather than one wired to on a guess.
   */
  provides?: string[];
  /** How it is reached, or nothing where it has no listener. */
  reached?: PluginReached | null;
  /** Where it reaches outside the machine, where it says. */
  reaches?: string | null;
  /** The stack's own service it moves in place of, where it names one. */
  replaces?: string | null;
  /** The service's id, which is the name its container is written under. */
  service: string;
  /** The privileged shape lemonfiber writes for it, where it took one. */
  shape?: PluginShape | null;
  /** Each capability contract it answers as an adapter, as `capability@major`. */
  speaks?: string[];
  /** The digest of the starting files kept for its run proofs, where it has any. */
  starting?: string | null;
  /** The readable name that digest went by when it was installed. */
  tag: string;
  /** Whether the library is mounted for it. */
  takes_data: boolean;
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

/**
 * One proof that asks one of the plugin's services a question, kept so the doctor can ask
 * it again without the plugin's source.
 */
export interface PluginRequestProof {
  /** What the answer must be. */
  expect: Expect;
  /** The proof's id. */
  proof: string;
  /** What it asks. */
  request: PluginRequest;
  /** The service it asks. */
  service: string;
  /** What it establishes, in one line. */
  title: string;
  /** Why it is worth asserting. */
  why: string;
}

/** A run of the image's own program, as a proof declares it. */
export interface PluginRun {
  /**
   * Each argument handed to the image's entrypoint, one string each: one to 64, each at
   * most 4096 bytes and none holding a NUL.
   */
  args: string[];
  /** How long the run may take, from 1 to 120 seconds. Default 30. */
  timeout_s?: number | null;
}

/**
 * One proof that runs the image's own program, kept so the doctor and a later proof can
 * run it again without the plugin's source.
 */
export interface PluginRunProof {
  /** What the run must come to. */
  expect: Expect;
  /** The proof's id. */
  proof: string;
  /** What the image's own program is handed. */
  run: PluginRun;
  /** The service whose image it runs. */
  service: string;
  /** What it establishes, in one line. */
  title: string;
  /** Why it is worth asserting. */
  why: string;
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

/** The adapter a call reaches its destination through. */
export interface PluginStepAdapter {
  /** Which of lemonfiber's adapters it is. */
  kind: ApiKind;
  /** Whose it is, which is lemonfiber's. */
  owner: PluginAdapterOwner;
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

/** One service taking a privileged shape, as the reading states it. */
export interface PluginTaking {
  /** What approving it is written as, apart from the offer. */
  approval: string;
  /** The devices it is given. */
  devices: string[];
  /** The kernel capabilities it is given. */
  grants: string[];
  /** The service taking it. */
  service: string;
  /** The shape it takes. */
  shape: PluginShape;
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
