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
      "/** The envelope carrying each kind, so a payload is typed by what it is. */",
      "export interface ByKind {",
      ...kinds.map((kind, at) => `  ${JSON.stringify(kind)}: ${envelopes[at]};`),
      "}",
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
