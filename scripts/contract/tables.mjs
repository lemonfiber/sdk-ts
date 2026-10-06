/**
 * The modules written from the artefact's lists rather than its schemas: the
 * kinds and the refusal codes.
 */
import { SPOKEN, byCodePoint } from "./artefact.mjs";
import { pascal } from "./spelling.mjs";

/** Where each kind's envelope, and the shapes only it carries, are written. */
export const KINDS_MODULE = ["kinds"];

/** Where the shapes more than one kind carries are written. */
export const SHARED_MODULE = ["shared"];

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
