// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `plugins` carries; `kinds/plugins` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { DoctorVerdict, Finding } from "../../shared/doctor__plugins.js";

/**
 * How lemonfiber talks to a service when seeding.
 *
 * The same shape on a plugin's service as on the stack's own, which is what lets a
 * plugin name one of these adapters rather than supply one of its own.
 */
export interface Api {
  /** Where the credential comes from. */
  key_source: KeySource;
  /** Selects the client implementation. */
  kind: ApiKind;
  /** The file holding the credential, where one applies. */
  path?: string | null;
  /**
   * The major version of the service's HTTP API — the `/api/vN` path segment.
   *
   * Required for the `servarr` shape and read there, because that one shape
   * spans two versions (Sonarr and Radarr at v3, Lidarr and Prowlarr at v1),
   * so the version is data rather than a guess from a service's name. Absent
   * for the other kinds, whose one fixed version their client already knows.
   */
  version?: number | null;
}

/**
 * The API shapes lemonfiber knows how to speak.
 *
 * Four services share the `servarr` shape, which is what makes one client
 * enough for them. Bindery is its own kind deliberately: it is not a Servarr
 * application and Prowlarr's app sync does not reach it. Bazarr is its own for
 * the neighbouring reason: it is told about the \*arrs rather than being one of
 * them, in a form body a client of the shared shape could not send.
 */
export type ApiKind = "servarr" | "sabnzbd" | "qbittorrent" | "seerr" | "bindery" | "jellyfin" | "bazarr" | "audiobookshelf" | "nzbhydra2";

/**
 * A row in a register lemonfiber already runs.
 *
 * The fields beyond `at` and `id` are the row its point declares, and the point is
 * published — so the required set, the optional set, the closed sets and the bounds
 * are read from `extension-points.json` rather than restated here. What this type
 * fixes is that a contribution is declared in this block and nowhere else, and that
 * it carries nothing outside the union of the rows the published points take.
 */
export interface Contribution {
  /** What to do, in the imperative. */
  action?: string | null;
  /** A point the build publishes. One it does not is refused by name. */
  at: string;
  /** Which family a check is narrowed to. */
  category?: string | null;
  /** The technical half of a remedy, which must not lead. */
  detail?: string | null;
  /** What the answer must be. */
  expect?: Expect | null;
  /** Recordings the check fails on, each with the constraint that fails there and why. */
  expected?: PluginExpectedFailure[];
  /** The recorded response the check is proved against. */
  fixture?: string | null;
  /** The check a remedy is for, which must be one this same plugin declared. */
  for?: string | null;
  /** Namespaced with the declaring plugin's id, always. */
  id: string;
  /**
   * Method and path on the plugin's own service.
   *
   * There is no field for a host, so a check cannot be pointed at another service,
   * at the machine, or off it. A plugin wanting to say something about a service it
   * did not install is asking to speak for somebody else's software.
   */
  request?: PluginRequest | null;
  /** Which service the finding is about. Defaults to the plugin's own. */
  service?: string | null;
  /** How long a check may run, within the bounds the point declares. */
  timeout_s?: number | null;
  /** The one-line summary of what was checked. */
  title?: string | null;
  /** Why this is worth checking. */
  why?: string | null;
}

/**
 * What the answer has to be.
 *
 * A status is a claim about the network path rather than about the service: Docker
 * publishes a port by putting a proxy in front of it, and that proxy accepts a
 * connection before knowing whether anything inside is listening. So a status alone
 * is not evidence — except for a refusal, which is the one answer no port proxy can
 * produce.
 *
 * **A key of the four key-wise constraints is a place rather than a name.** A plain
 * name is a top-level member, and one beginning with `/` is a JSON Pointer, extended
 * with a step that picks an entry of a list by a field it holds. A flat name was enough while every service answered a flat object, and the
 * only thing it could say about a service that nests its payload was that the envelope
 * was there — which is a probe that passes by observing that something replied.
 */
export interface Expect {
  /** What the body must begin with, where it is not JSON. */
  body_starts_with?: string | null;
  /** A substring of the content type the answer was served as. */
  content_type?: string | null;
  /** Places the answer must carry, each with the exact value it must hold. */
  json?: { [key: string]: Expected } | null;
  /**
   * The answer read as an array, with at least this many entries.
   *
   * A catalogue is very often a list rather than an object, and none of the
   * object-shaped constraints can say anything about one.
   */
  json_array_min?: number | null;
  /** Places the answer must carry, each with a number it must not be below. */
  json_at_least?: { [key: string]: number } | null;
  /** Places the answer must carry, whatever they hold. */
  json_has_keys?: string[] | null;
  /**
   * The answer did not parse as JSON at all.
   *
   * Which is what a service that serves its application shell for every path it does
   * not implement answers — and the reason a status alone proves nothing against
   * one: the shell comes back `200` whether the API behind it exists or not, so what
   * has to be said is that the body was *not* a document.
   */
  json_is_absent?: boolean | null;
  /** Places the answer must carry, each with the kind of value it must be. */
  json_types?: { [key: string]: ExpectedKind } | null;
  /** The status the answer must carry. */
  status?: number | null;
}

/**
 * Exactly what a place must hold.
 *
 * Three kinds and no nesting: a flag that must be set, a number that must match, or a
 * word. A value deeper than this is asking about a document rather than about a claim
 * — and where the thing worth asserting is deeper *in* the answer, the key reaches it
 * rather than the value growing to match.
 */
export type Expected = boolean | number | string;

/**
 * The kind of value a key must hold.
 *
 * Five, and closed. A name outside them is one no runner could evaluate, and an
 * assertion nothing evaluates is a proof that silently checks less than it says —
 * which is worse than one that fails.
 *
 * Named for what it is the kind *of*, rather than `Kind`, because this is published
 * and whoever generates from it flattens every definition into one scope. `Kind` is
 * the one name there a generator is certain to want for itself: every envelope this
 * contract describes is keyed by its `kind`, so the union of them is a `Kind` too, and
 * two of them in one module is a definition nothing can be compiled against.
 */
export type ExpectedKind = "bool" | "int" | "str" | "list" | "dict";

/** Where a service's credential comes from. */
export type KeySource = "config-xml" | "config-ini" | "config-json" | "config-yaml" | "api-settings" | "generated" | "none";

/**
 * Whose an adapter is.
 *
 * One answer, and the field exists so that the answer is on the wire: an adapter a
 * plugin could bring would be code a stranger wrote running with lemonfiber's
 * authority, which nothing here can load.
 */
export type PluginAdapterOwner = "lemonfiber";

/** One capability a placed service asks for. */
export interface PluginAsking {
  /** The core capability asked for. */
  capability: string;
  /** Whether every service that fills it is reached rather than one. */
  each?: boolean;
}

/**
 * One change installing a plugin makes to the machine.
 *
 * A path and what goes at it, which is the whole of what an install touches. Two of
 * them can be edits to a file the stack already has — the proxy's and the
 * dashboard's — and those say so, as a region, so an operator reading the account
 * knows which of their files the install writes into.
 */
export interface PluginChange {
  /**
   * Where it lands, in full.
   *
   * In full rather than relative to the stack, because *what is this about to do
   * to my machine* is answered by a path somebody can go and look at — and a
   * relative one is right about a directory the reader has to work out for
   * themselves.
   */
  path: string;
  /** What lands there. */
  puts: PluginPuts;
}

/** One check that stands differently after an install than it did before. */
export interface PluginChangedCheck {
  /**
   * How the same check read before the install, or nothing where it was not
   * raised at all.
   *
   * Absent means the check produced no finding beforehand, which is read as it
   * holding: a finding no longer raised is a fault no longer there, and the same
   * rule read backwards is that one not yet raised was not yet a fault.
   */
  before?: DoctorVerdict | null;
  /**
   * The check as it reads now, with everything the diagnosis says about it.
   *
   * The finding itself rather than a summary of it, because what an operator does
   * next is read the remedy, the service's own output and what else is causing it
   * — and a second, thinner shape of the same fact is where those stop arriving.
   */
  now: Finding;
}

/**
 * A kind of constraint an expectation can put on a body.
 *
 * The same vocabulary a proof's expectation and a contributed check's use, so that
 * "a status alone is not evidence" is one rule rather than three. Read as well as
 * written: a declaration that an assertion fails on a recording names the one of these
 * that fails there.
 */
export type PluginConstraint = "status" | "json" | "json_has_keys" | "json_types" | "json_at_least" | "json_array_min" | "json_is_absent" | "content_type" | "body_starts_with";

/** What a plugin declared about itself, as its install read it. */
export interface PluginDeclaration {
  /**
   * Every capability it claims, core and its own, in the order it declares them.
   *
   * Apart from what its services fill: a claim is what it says it can do and has to
   * demonstrate, and a capability of its own is claimed without anything asking for
   * it.
   */
  claims?: string[];
  /** The licence it is distributed under. */
  license?: string;
  /** Every bundled setting it declares it may change. */
  overrides?: PluginOverriding[];
  /**
   * Every destination a recipe of its could reach that is not one of its own
   * services: a service of this stack's, or a name outside it.
   *
   * Recorded as declared rather than sorted into the two here, because which names
   * are this stack's is a question about the stack, and the stack a record is read
   * against is the one on the machine when it is read.
   */
  reaches?: string[];
  /**
   * Whether anybody reviewed it before it was installed.
   *
   * True for a plugin installed by name through a catalogue index whose signature
   * verified, and false for every install from a source an operator named. Carried
   * rather than left implicit, because an unreviewed plugin is to be said to be one
   * for as long as it is installed.
   */
  reviewed?: boolean;
  /** Every credential it says it will hold. */
  secrets?: PluginSecret[];
  /** Where its source is published, as the plugin names it. */
  upstream?: string;
}

/** The one verdict a declaration may name. */
export type PluginDeclaredVerdict = "fails";

/**
 * What the verdicts in a report were reached against.
 *
 * One value, because one is all this build can produce: nothing here asks a service
 * anything. It is a field rather than a sentence for the reason a verdict is one — a
 * reader handed `demonstrated` has nothing else in the document to tell a recording
 * that answered from a service that did, and the weaker of those two claims must not
 * be readable as the stronger. The prose says it on the page; this says it to
 * whatever consumes the report: an author's own CI, a catalogue, anything counting
 * passes. Naming the axis now is what made the second kind of evidence a change the
 * compiler walked somebody through rather than one they had to remember.
 */
export type PluginEvidence = "recordings" | "service";

/**
 * A recording an assertion fails on, the one constraint of its expectation that fails
 * there, and why.
 *
 * For an assertion whose passing state nobody can record, such as a check that a server
 * has an owner where claiming one needs an account the plugin's CI does not hold: the
 * state it exists to find can be recorded, and the declaration says which constraint
 * tells the two states apart. It changes the verdict on that recording and on nothing
 * else — the live service and every other recording are held to the expectation as it
 * is written.
 *
 * It names a constraint rather than only a recording, because a recording that began
 * failing for another reason — a truncated file, an error recorded by mistake — would
 * otherwise read as failing as declared, excusing a failure nobody had looked at.
 */
export interface PluginExpectedFailure {
  /** The key of the expectation that fails on the recording, and one it carries. */
  constraint: PluginConstraint;
  /** The recording the assertion fails on. It may be the assertion's own `fixture`. */
  fixture: string;
  /**
   * Where within that constraint it fails, written exactly as the expectation writes
   * it. Present for a key-wise constraint and absent for one about the whole answer.
   */
  place?: string | null;
  /**
   * Why this recording is one the assertion fails on. Reported with the verdict every
   * time.
   */
  reason: string;
  /**
   * `fails`, and nothing else: passing is what the expectation already says, and
   * could-not-run is never excused.
   */
  verdict: PluginDeclaredVerdict;
}

/** One recording an assertion fails on as its manifest declares. */
export interface PluginFailingAsDeclared {
  /** The constraint of the expectation that fails there. */
  constraint: PluginConstraint;
  /** The recording. */
  fixture: string;
  /** What the recording held there. */
  held: string;
  /** Where within that constraint, for one that looks at places. */
  place?: string | null;
  /** Why the manifest says this recording is one the assertion fails on. */
  reason: string;
}

/** One bundled thing a plugin declares it will change. */
export interface PluginOverriding {
  /** Which bundled setting it changes. */
  setting: string;
  /** What changing it is for. */
  why: string;
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
   * The adapter lemonfiber reaches it through, where the plugin named one.
   *
   * Defaulted for a record written before this was kept, which reads as naming
   * none: a service operated generically, as it was when installed.
   */
  api?: Api | null;
  /** Every capability it asks for. */
  asks?: PluginAsking[];
  /**
   * Where inside the container its one configuration directory is mounted.
   *
   * Resolved rather than optional. The record answers where the directory is, and
   * a run that re-derived the fallback would answer for a container it did not
   * write the day that fallback moved.
   */
  config_path: string;
  /**
   * What the plugin says it does for the operator, which is what its dashboard entry
   * says beside it.
   */
  description?: string;
  /** The digest that fixes what runs. */
  digest: string;
  /** The service of the same plugin it stands in front of, as an adapter. */
  fronts?: string | null;
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
  /**
   * The stack's own networks it joins beside the default one, because a stack service
   * it stands in for is on them.
   *
   * Settled at install from the stack it was installed beside and written down, so
   * the container lemonfiber writes for it stays a function of this record alone.
   * Defaulted for a record written before this was kept, which reads as joining none
   * and staying on the default network.
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
  /** The service's id, which is the name its container is written under. */
  service: string;
  /** The privileged shape lemonfiber writes for it, where it took one. */
  shape?: PluginShape | null;
  /** Each capability contract it answers as an adapter, as `capability@major`. */
  speaks?: string[];
  /** The readable name that digest went by when it was installed. */
  tag: string;
  /** Whether the library is mounted for it. */
  takes_data: boolean;
}

/** What an install puts at one path. */
export type PluginPuts = "directory" | "document" | "key" | "region";

/**
 * How an installed service is reached, where it is reached at all.
 *
 * The tier is the arm, so the label a tier earns lives only in the arm entitled to
 * one. Only a household service is proxied — the bundled policy is that an admin
 * surface does not get a name on the household network — and a record able to carry
 * a loopback service with a hostname would be a record able to describe the thing
 * that policy exists to prevent.
 *
 * **The group is on both arms, and that is not an oversight.** Only the proxy is
 * the household tier's alone; the bundled dashboard carries an entry for an
 * operator surface too, with the address it links to rendered from the tier — nine
 * of the shipped stack's own entries point at this machine. A record that kept the
 * group for the wider tier alone would leave a loopback service off the panel its
 * bundled neighbours are on.
 *
 * A tier and never an address, either way: lemonfiber renders one from the other
 * exactly as it does for a bundled service, so the two-tier policy stays a property
 * of the system rather than a request a plugin made.
 */
export type PluginReached = PluginReachedLoopback | PluginReachedHousehold;

/** From the household, through the stack's own proxy, at this label. */
export interface PluginReachedHousehold {
  /** The group on the bundled dashboard, where the manifest named one. */
  group?: string | null;
  /** The single label in front of the operator's domain. */
  hostname: string;
  /** The port the service listens on. */
  port: number;
  tier: "household";
}

/** From this machine and nowhere else. No route, and no label to route to. */
export interface PluginReachedLoopback {
  /** The group on the bundled dashboard, where the manifest named one. */
  group?: string | null;
  /** The port the service listens on. */
  port: number;
  tier: "loopback";
}

/**
 * What is asked, and where.
 *
 * Three fields and no more, and the third is the one worth explaining. A service that
 * answers XML unless a caller asks for JSON cannot satisfy a capability whose probe
 * requires a JSON assertion, and until this field there was nowhere to ask: Plex
 * answers `text/xml` at every path, including the one its health probe uses, unless
 * the request carries `Accept: application/json`.
 *
 * **It is one media type and not a header map, and the difference is the point.** A
 * probe declares who it is asked as, and `none` on every `guarded` probe has meant what
 * it says partly because nothing could be presented. A map of headers would make that a
 * convention a reviewer has to hold — any service may name its credential header
 * whatever it likes, so no list of refused names could ever be closed — where one named
 * field keeps it a property of the format. A probe still cannot present anything,
 * because there is nowhere to write it.
 */
export interface PluginRequest {
  /**
   * The one representation the answer is asked for, as a media type.
   *
   * Absent where the service needs no asking, which is most of them.
   */
  accept?: string | null;
  /** The HTTP method. */
  method: string;
  /** The path on the service being asked. */
  path: string;
}

/** One credential a plugin says it will hold, without a value and with no place for one. */
export interface PluginSecret {
  /** What the value is, within the plugin. */
  id: string;
  /** Whose credential it is. */
  of: string;
  /** What holding it is for. */
  why: string;
}

/** A privileged shape lemonfiber writes for a plugin's service. */
export type PluginShape = "egress-guard";

/** The adapter a call reaches its destination through. */
export interface PluginStepAdapter {
  /** Which of lemonfiber's adapters it is. */
  kind: ApiKind;
  /** Whose it is, which is lemonfiber's. */
  owner: PluginAdapterOwner;
}
