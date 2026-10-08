/**
 * The modules written from the artefact's lists rather than its schemas: the
 * kinds and the refusal codes.
 */
import { SPOKEN, bodyName, byCodePoint, readNameOf } from "./artefact.mjs";
import { pascal, property } from "./spelling.mjs";

/** Where each kind's envelope, and the shapes only it carries, are written. */
export const KINDS_MODULE = ["kinds"];

/** Where the shapes more than one kind carries are written. */
export const SHARED_MODULE = ["shared"];

/** Where each route's body, and the shapes only it carries, are written. */
export const BODIES_MODULE = ["bodies"];

/** The module naming every kind, and the envelope each one carries. */
export function envelopeModule(kinds) {
  const envelopes = kinds.map((kind) => `${pascal(kind)}Envelope`);
  return {
    path: ["envelope"],
    summary: "Every kind the server may send, and the envelope each one carries.",
    imports: new Map([[KINDS_MODULE.join("/"), new Set(envelopes)]]),
    body: [
      "/** The wire version these types were generated for. */",
      `export const CONTRACT_API_VERSION = ${String(SPOKEN)};`,
      "",
      "/** Every kind the server may send. */",
      `export type Kind = ${kinds.map((kind) => JSON.stringify(kind)).join(" | ")};`,
      "",
      "/** Every kind the server may send, in name order. */",
      "export const KINDS: readonly Kind[] = [",
      ...kinds.map((kind) => `  ${JSON.stringify(kind)},`),
      "];",
      "",
      "/** Whether a kind is one this package knows. */",
      "export const isKnownKind = (value: string): value is Kind => (KINDS as readonly string[]).includes(value);",
      "",
      "/** The envelope carrying each kind, so a payload is typed by what it is. */",
      "export interface ByKind {",
      ...kinds.map((kind, at) => `  ${JSON.stringify(kind)}: ${envelopes[at]};`),
      "}",
      "",
      "/** An envelope of any kind the server may send, told apart by its `kind`. */",
      "export type Envelope = ByKind[Kind];",
    ],
  };
}

/** The module of the reads the web API serves, by the name each goes by. */
export function readsModule(listed) {
  const documents = listed.filter((read) => !read.file);
  const files = listed.filter((read) => read.file);
  const entry = ({ path, parameters, kinds }) => {
    const taken = parameters.map(({ name, repeatable }) => `{ name: ${JSON.stringify(name)}, repeatable: ${String(repeatable)} }`);
    return `  ${JSON.stringify(readNameOf(path))}: { path: ${JSON.stringify(path)}, parameters: [${taken.join(", ")}], kinds: [${kinds.map((kind) => JSON.stringify(kind)).join(", ")}] },`;
  };
  const query = ({ path, parameters }) => {
    const fields = parameters.map(
      ({ name, repeatable }) => `${property(name)}?: ${repeatable ? "Scalar | readonly Scalar[]" : "Scalar"} | undefined`,
    );
    const shape = fields.length === 0 ? "Record<string, never>" : "{ " + fields.join("; ") + " }";
    return `  ${JSON.stringify(readNameOf(path))}: ${shape};`;
  };
  return {
    path: ["reads"],
    summary: "Every read the web API serves, by the name it goes by, and what each takes and answers with.",
    imports: new Map([["envelope", new Set(["ByKind"])]]),
    body: [
      "/** One value a query parameter carries. */",
      "export type Scalar = string | number | boolean;",
      "",
      "/** Every read answered with a document, by name: its path, the parameters it takes, and the kinds it answers with. */",
      ...(documents.length === 0
        ? ["export const READS = {} as const;"]
        : ["export const READS = {", ...documents.map((read) => entry(read)), "} as const;"]),
      "",
      "/** The name of a read answered with a document. */",
      "export type ReadName = keyof typeof READS;",
      "",
      "/** What each read takes: a repeatable parameter as one value or a list, any other as one value, and nothing sent for undefined. */",
      "export interface ReadQuery {",
      ...documents.map((read) => query(read)),
      "}",
      "",
      "/** The envelope a read answers with, of whichever kind the contract lists for it. */",
      "export type ReadAnswer<N extends ReadName> = ByKind[(typeof READS)[N][\"kinds\"][number]];",
      "",
      "/** Every read answered with a file, by name, and its path. */",
      ...(files.length === 0
        ? ["export const FILES = {} as const;"]
        : ["export const FILES = {", ...files.map(({ path }) => `  ${JSON.stringify(readNameOf(path))}: { path: ${JSON.stringify(path)} },`), "} as const;"]),
    ],
  };
}

/** The module of the actions an integration key may call, and what the contract says of each. */
export function keyCallableModule(listed) {
  const union = listed.length === 0 ? "never" : listed.map(({ action }) => JSON.stringify(action)).join(" | ");
  const entries = listed.map(
    ({ action, disturbs, rehearsal, idempotent }) =>
      `  ${JSON.stringify(action)}: { disturbs: ${String(disturbs)}, rehearsal: ${String(rehearsal)}, idempotent: ${String(idempotent)} },`,
  );
  return {
    path: ["key-callable"],
    summary: "Every action an integration key may call, and what the contract says of each.",
    imports: new Map(),
    body: [
      "/** Every action a key may call; any other is refused to a key, naming its scope. */",
      `export type KeyCallableAction = ${union};`,
      "",
      "/** What the contract says of one action a key may call. */",
      "export interface KeyCallable {",
      "  /** Whether calling it disturbs the running system. */",
      "  readonly disturbs: boolean;",
      "  /** Whether it takes `dry_run`, so it can be rehearsed before the real call is offered. */",
      "  readonly rehearsal: boolean;",
      "  /** Whether calling it again with the same arguments leaves the stack as calling it once did. */",
      "  readonly idempotent: boolean;",
      "}",
      "",
      "/** What the contract says of each action a key may call, in the order it lists them. */",
      ...(listed.length === 0
        ? ["export const KEY_CALLABLE: Readonly<Record<KeyCallableAction, KeyCallable>> = {};"]
        : ["export const KEY_CALLABLE: Readonly<Record<KeyCallableAction, KeyCallable>> = {", ...entries, "};"]),
      "",
      "/** Whether an action is one the contract says a key may call. */",
      "export const isKeyCallable = (value: string): value is KeyCallableAction =>",
      "  Object.hasOwn(KEY_CALLABLE, value);",
    ],
  };
}

/** The module of the refusal codes the contract lists, and what it says of each. */
export function refusalsModule(listed) {
  const codes = Object.keys(listed).toSorted(byCodePoint);
  const union = codes.length === 0 ? "never" : codes.map((code) => JSON.stringify(code)).join(" | ");
  const entries = codes.map((code) => {
    const { name, status, description } = listed[code];
    return `  ${JSON.stringify(code)}: { name: ${JSON.stringify(name)}, status: ${String(status)}, description: ${JSON.stringify(description)} },`;
  });
  return {
    path: ["refusals"],
    summary: "Every code the contract lists a refusal as carrying, and what it says of each.",
    imports: new Map(),
    body: [
      "/** Every code a refusal may carry. */",
      `export type RefusalCode = ${union};`,
      "",
      "/** Each refusal code's name in the core's registry, the status it is answered with, and the registry's line about it. */",
      "export const REFUSAL_CODES: Readonly<",
      "  Record<RefusalCode, { readonly name: string; readonly status: number; readonly description: string }>",
      ...(codes.length === 0 ? ["> = {};"] : ["> = {", ...entries, "};"]),
      "",
      "/** Whether a code is one the contract lists as a refusal's. */",
      "export const isRefusalCode = (value: string): value is RefusalCode =>",
      "  Object.hasOwn(REFUSAL_CODES, value);",
    ],
  };
}

/**
 * The module of the routes that take a body, and the type of the body each
 * takes, imported from where `whereIs` says the type is written.
 */
export function bodyRoutesModule(bodies, whereIs) {
  const routes = Object.keys(bodies).toSorted(byCodePoint);
  const union = routes.length === 0 ? "never" : routes.map((route) => JSON.stringify(route)).join(" | ");
  const imports = new Map();
  for (const route of routes) {
    const from = whereIs(bodyName(route))[0];
    if (!imports.has(from)) imports.set(from, new Set());
    imports.get(from).add(bodyName(route));
  }
  return {
    path: ["body-routes"],
    summary: "Every route that takes a body, and the type of the body each takes.",
    imports,
    body: [
      "/** Every route that takes a body. */",
      `export type BodyRoute = ${union};`,
      "",
      "/** Every route that takes a body, in path order. */",
      "export const BODY_ROUTES: readonly BodyRoute[] = [",
      ...routes.map((route) => `  ${JSON.stringify(route)},`),
      "];",
      "",
      "/** The body each route takes, so what is sent is typed by where it goes. */",
      ...(routes.length === 0
        ? ["export type BodyOf = Record<BodyRoute, never>;"]
        : ["export interface BodyOf {", ...routes.map((route) => `  ${JSON.stringify(route)}: ${bodyName(route)};`), "}"]),
    ],
  };
}
