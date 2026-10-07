/**
 * What differs between two copies of the contract, each under a tree's
 * `contract/`, in whichever layout each is in.
 *
 * Two single files are equal when they parse to the same document. Two
 * directories are equal when they hold the same files and each file parses to the
 * same document in both. A single file and a directory always differ.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { byCodePoint, isRecord } from "./artefact.mjs";
import { refuse } from "./refused.mjs";
import { CONTRACT, DIRECTORY, SINGLE, layoutOf } from "./vendored.mjs";

/** A layout as a person reads it. */
const LAYOUTS = new Map([
  [DIRECTORY, `the directory ${CONTRACT}/${DIRECTORY}/`],
  [SINGLE, `the single file ${CONTRACT}/${SINGLE}`],
]);

/** A file as JSON, or as its bytes where it is not JSON. */
async function contents(path) {
  const bytes = await readFile(path);
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch {
    return bytes;
  }
}

/** Every file under a copy's directory, by its path relative to it. */
async function filesUnder(root) {
  const under = join(root, CONTRACT, DIRECTORY);
  const entries = await readdir(under, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(under, join(entry.parentPath, entry.name)))
    .toSorted(byCodePoint);
}

/** A list as a line ends it. */
const listed = (names) => names.join(", ");

/** What differs between two single files. */
async function singleDifferences(ours, theirs) {
  const vendored = await contents(join(ours, CONTRACT, SINGLE));
  const served = await contents(join(theirs, CONTRACT, SINGLE));
  if (isDeepStrictEqual(vendored, served)) return [];
  const kinds = (artefact) => new Set(Object.keys(isRecord(artefact) && isRecord(artefact.kinds) ? artefact.kinds : {}));
  const mine = kinds(vendored);
  const yours = kinds(served);
  const missing = [...yours].filter((kind) => !mine.has(kind)).toSorted(byCodePoint);
  const extra = [...mine].filter((kind) => !yours.has(kind)).toSorted(byCodePoint);
  const lines = [];
  if (missing.length > 0) lines.push(`kinds described by the server and not here: ${listed(missing)}`);
  if (extra.length > 0) lines.push(`kinds described here and not by the server: ${listed(extra)}`);
  if (lines.length === 0) lines.push("the same kinds, described differently: a shape changed inside one of them");
  return lines;
}

/** What differs between two directories, naming every file. */
async function directoryDifferences(ours, theirs) {
  const mine = await filesUnder(ours);
  const yours = await filesUnder(theirs);
  const held = new Set(mine);
  const served = new Set(yours);
  const missing = yours.filter((file) => !held.has(file));
  const extra = mine.filter((file) => !served.has(file));
  const shared = mine.filter((one) => served.has(one));
  const same = await Promise.all(
    shared.map(async (file) =>
      isDeepStrictEqual(
        await contents(join(ours, CONTRACT, DIRECTORY, file)),
        await contents(join(theirs, CONTRACT, DIRECTORY, file)),
      ),
    ),
  );
  const changed = shared.filter((_, at) => !same[at]);
  const lines = [];
  if (missing.length > 0) lines.push(`files the server has and this copy does not: ${listed(missing)}`);
  if (extra.length > 0) lines.push(`files this copy has and the server does not: ${listed(extra)}`);
  if (changed.length > 0) lines.push(`files that differ: ${listed(changed)}`);
  return lines;
}

/**
 * Each way the copy under `ours` differs from the one under `theirs`, as lines;
 * none when they are the same contract.
 */
export async function differences(ours, theirs) {
  const layout = (root) => layoutOf(root, (message) => refuse(`in ${root}, ${message}`));
  const vendored = layout(ours);
  const served = layout(theirs);
  if (vendored !== served) {
    return [`the server publishes ${LAYOUTS.get(served)}, and this copy is ${LAYOUTS.get(vendored)}`];
  }
  return vendored === DIRECTORY ? directoryDifferences(ours, theirs) : singleDifferences(ours, theirs);
}
