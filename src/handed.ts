/**
What a read answered with a file hands over.

Spec: 20-architecture/contracts/web-api.md
*/
import type { Bundle } from "./generated/index.js";
import type { Problem } from "./problem.js";

/**
A file lemonfiber handed over, or why it did not.

The file is kept as it arrived, bytes and type both, so a browser can offer it
as a download without decoding it first.

A refusal carries the body it arrived with, whole, as `said`. `problem` is the
reading `refusalIn` gives every other request; `said` is what that reading
leaves out — every field of an error envelope beyond its summary, and the
sentence a turned-away request was answered with, which `refused` never
carries. It is absent where nothing arrived to carry.
*/
export type Handed = { ok: true; value: Blob } | { ok: false; problem: Problem; said?: string };

/**
Where a support bundle was written, as the `support` action's `bundle` payload
says. The payload itself is one, once its `path` is known to be there.

Only a written one: a payload without a `path` described a bundle and wrote
none, so there is no file to ask for.
*/
export interface Written {
  path: NonNullable<Bundle["path"]>;
}

/**
The file a path names: whatever follows its last separator, of either kind.
*/
export function lastSegment(path: string): string {
  return path.slice(Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\")) + 1);
}
