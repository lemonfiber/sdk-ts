/**
 * A read's query: the segments of its path a caller fills, and the parameters
 * sent after it.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import type { Reading } from "./envelope.js";
import type { Scalar } from "./generated/index.js";
import { misasked } from "./problem.js";

/**
 * What a query parameter may carry. A value that is `undefined` is not sent.
 *
 * A list is the same parameter given once for each of its values, in order
 * (`form=a&form=b`), which is how a command's flag given more than once is
 * written as a read. An empty list sends nothing, the same as `undefined`: a
 * flag given no times is a flag not given.
 */
export type Query = Record<string, Scalar | readonly Scalar[] | undefined>;

/**
 * A parameter's values, whether it was given one or a list of them.
 */
function listed(value: Scalar | readonly Scalar[]): readonly Scalar[] {
  return typeof value === "object" ? value : [value];
}

/**
 * Values a URL does not keep as a segment: `.` and `..` resolve to the path's
 * own folder or the one above it, and an empty one asks for the folder itself.
 */
const UNKEPT_SEGMENTS: ReadonlySet<string> = new Set(["", ".", ".."]);

/**
 * A read's path with each segment the caller fills written in, and the rest of
 * the query left to send as parameters.
 *
 * A segment is one value, written escaped so it stays one segment and cannot
 * reach a path beside the read's own. One not given, given as a list, or one a
 * URL would resolve away is `misasked` before anything is sent.
 */
export function filledIn(
  path: string,
  segments: readonly string[],
  query: Query,
): Reading<{ path: string; rest: Query }> {
  let written = path;

  for (const segment of segments) {
    const value = query[segment];
    const one = value === undefined || typeof value === "object" ? undefined : String(value);
    if (one === undefined || UNKEPT_SEGMENTS.has(one)) {
      return {
        ok: false,
        problem: misasked(
          `This read needs one \`${segment}\` it can send, and was not given one.`,
        ),
      };
    }
    const escaped = encodeURIComponent(one);
    written = written.replace(`{${segment}}`, () => escaped);
  }

  const rest = Object.fromEntries(
    Object.entries(query).filter(([key]) => !segments.includes(key)),
  );
  return { ok: true, value: { path: written, rest } };
}

/**
 * A query string, or nothing when there is nothing to ask for.
 *
 * The token is never among these: a credential in a URL reaches logs, history
 * and referrers.
 */
export function search(query: Query): string {
  const parts = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    for (const one of listed(value)) parts.append(key, String(one));
  }

  const text = parts.toString();
  return text === "" ? "" : `?${text}`;
}
