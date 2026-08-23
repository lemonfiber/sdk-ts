/**
 * The wire shape every reply carries.
 *
 * Spec: 20-architecture/contracts/web-api.md (ARCH-R46, ARCH-R55)
 */
import { CONTRACT_API_VERSION, type ByKind, type Kind } from "./generated/contract.js";
import { malformed, wrongVersion, type Problem } from "./problem.js";

/**
 * The wire version this package speaks, taken from the contract it generated
 * against rather than repeated here.
 */
export const API_VERSION = CONTRACT_API_VERSION;

export interface Envelope<T> {
  api_version: number;
  kind: string;
  data: T;
}

export type Reading<T> = { ok: true; value: T } | { ok: false; problem: Problem };

function isShaped(value: unknown): value is Envelope<unknown> {
  if (typeof value !== "object" || value === null) return false;
  const fields = value as Record<string, unknown>;
  return (
    typeof fields["api_version"] === "number" &&
    typeof fields["kind"] === "string" &&
    "data" in fields
  );
}

/**
 * Reads an envelope, refusing any wire version this package cannot speak for.
 */
export function read<T>(value: unknown): Reading<Envelope<T>> {
  if (!isShaped(value)) return { ok: false, problem: malformed() };
  if (value.api_version !== API_VERSION) {
    return { ok: false, problem: wrongVersion(API_VERSION, value.api_version) };
  }
  return { ok: true, value: value as Envelope<T> };
}

/**
 * Narrows an envelope to the generated shape for one kind.
 *
 * The only supported way to reach a payload: `data` differs by `kind`, and the
 * generated types are what know how.
 */
export function isKind<K extends Kind>(
  envelope: Envelope<unknown>,
  kind: K,
): envelope is Envelope<unknown> & ByKind[K] {
  return envelope.kind === kind;
}

/**
 * Parses JSON text into an envelope.
 */
export function parse<T>(text: string): Reading<Envelope<T>> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, problem: malformed() };
  }
  return read<T>(value);
}
