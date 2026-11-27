/**
What a reply comes to: narrowed to the kind its route answers with, refused, or
kept as bytes.

Spec: 20-architecture/contracts/web-api.md
*/
import type { Asking } from "./deadline.js";
import { isKind, type Envelope, type Reading } from "./envelope.js";
import type { ByKind, Kind } from "./generated/index.js";
import { unrecognised, type Problem } from "./problem.js";
import { refusalIn } from "./refusal.js";
import type { Answer } from "./sending.js";

/**
One request to the client's stack, read through the envelope: a read is asked
again before a passing failure is reported, anything else is asked once.
*/
export type Ask = (
  method: string,
  path: string,
  asking: Asking,
  body?: string,
  isARead?: boolean,
) => Promise<Reading<Envelope>>;

/**
An answer narrowed to the one kind its route answers with, or `unrecognised`
where it came back as another.
*/
export function answeredAs<K extends Kind>(
  answered: Reading<Envelope>,
  kind: K,
): Reading<ByKind[K]> {
  if (!answered.ok) return answered;
  return isKind(answered.value, kind)
    ? { ok: true, value: answered.value }
    : { ok: false, problem: unrecognised(answered.value.kind) };
}

/**
The problem a reply that was not a success is, its `Retry-After` included.
*/
export function refusalOf(answer: Answer, said: string): Problem {
  return refusalIn(answer.status, said, answer.headers?.get("Retry-After"));
}

/**
A reply's body as the bytes that arrived, or nothing where it cannot be read
as bytes.
*/
export async function blobOf(answer: Answer): Promise<Reading<Blob> | undefined> {
  const kept = await answer.blob?.();
  return kept && { ok: true, value: kept };
}
