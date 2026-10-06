/**
 * The wire shape every reply carries.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import {
  CONTRACT_API_VERSION,
  isKnownKind,
  type ByKind,
  type Envelope,
  type Kind,
} from "./generated/index.js";
import { malformed, unrecognised, wrongVersion, type Problem } from "./problem.js";

export type { Envelope } from "./generated/index.js";

/**
 * The wire version this package speaks, taken from the contract it generated
 * against rather than repeated here.
 */
export const API_VERSION = CONTRACT_API_VERSION;

export type Reading<T> = { ok: true; value: T } | { ok: false; problem: Problem };

/**
 * The fields every envelope carries, before its kind is known to be one this
 * package reads.
 */
interface Shaped {
  api_version: number;
  kind: string;
  data: unknown;
}

function isShaped(value: unknown): value is Shaped {
  if (typeof value !== "object" || value === null) return false;
  const fields = value as Record<string, unknown>;
  return (
    typeof fields["api_version"] === "number" &&
    typeof fields["kind"] === "string" &&
    "data" in fields
  );
}

/**
 * Reads an envelope, refusing any wire version this package cannot speak for
 * and any kind it does not know.
 *
 * The kind names the payload; the payload itself is not checked against the
 * shape the contract gives it.
 */
export function readEnvelope(value: unknown): Reading<Envelope> {
  if (!isShaped(value)) return { ok: false, problem: malformed() };
  if (value.api_version !== API_VERSION) {
    return { ok: false, problem: wrongVersion(API_VERSION, value.api_version) };
  }
  if (!isKnownKind(value.kind)) return { ok: false, problem: unrecognised(value.kind) };
  return { ok: true, value: value as Envelope };
}

/**
 * Narrows an envelope to the generated shape for one kind.
 */
export function isKind<K extends Kind>(envelope: Envelope, kind: K): envelope is ByKind[K] {
  return envelope.kind === kind;
}

/**
 * Parses JSON text into an envelope.
 */
export function parse(text: string): Reading<Envelope> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, problem: malformed() };
  }
  return readEnvelope(value);
}
