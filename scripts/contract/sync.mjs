/**
 * Takes the contract out of an archive of one lemonfiber revision and vendors it
 * under `contract/`, in the layout that revision publishes.
 *
 * Nothing here touches the network: `contract-sync.mjs` fetches the archive and
 * hands it over. Everything is checked before anything is written, so a refused
 * archive leaves the copy as it was.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { gunzipSync } from "node:zlib";
import { isRecord } from "./artefact.mjs";
import { refuse } from "./refused.mjs";
import { BODIES, CONTRACT, DIRECTORY, INDEX, LISTS, SINGLE, STAMP, shown, staysPut } from "./vendored.mjs";

/** The size of a tar block, which every header and every file's padding is a whole number of. */
const BLOCK = 512;

/** A header's text field: the bytes up to the first NUL. */
const field = (header, start, length) => {
  const bytes = header.subarray(start, start + length);
  const end = bytes.indexOf(0);
  return bytes.subarray(0, end === -1 ? length : end).toString("utf8");
};

/** The `path` record of a pax extended header, where it carries one. */
function paxPath(body) {
  let at = 0;
  while (at < body.length) {
    const space = body.indexOf(0x20, at);
    const length = Number.parseInt(body.subarray(at, space).toString("utf8"), 10);
    if (space === -1 || !Number.isInteger(length) || length <= 0) refuse("the archive holds a malformed pax header.");
    const record = body.subarray(space + 1, at + length - 1).toString("utf8");
    if (record.startsWith("path=")) return record.slice("path=".length);
    at += length;
  }
  return undefined;
}

/**
 * Every regular file in a gzipped tar archive, by its path.
 *
 * Reads the ustar headers `git archive` writes, the pax headers that carry a
 * long path, and the GNU long-name header; everything that is not a regular file
 * is passed over.
 */
export function untarred(gzipped) {
  let archive;
  try {
    archive = gunzipSync(gzipped);
  } catch (error_) {
    return refuse(`the archive is not gzip: ${String(error_)}`);
  }
  const files = new Map();
  let longName;
  let at = 0;
  while (at + BLOCK <= archive.length) {
    const header = archive.subarray(at, at + BLOCK);
    if (header.every((byte) => byte === 0)) break;
    const size = Number.parseInt(field(header, 124, 12).trim(), 8);
    if (!Number.isInteger(size) || size < 0 || at + BLOCK + size > archive.length) {
      refuse("the archive is cut short or holds a malformed header.");
    }
    const body = archive.subarray(at + BLOCK, at + BLOCK + size);
    const type = field(header, 156, 1);
    const prefix = field(header, 345, 155);
    const named = prefix === "" ? field(header, 0, 100) : `${prefix}/${field(header, 0, 100)}`;
    if (type === "x") longName = paxPath(body);
    else if (type === "L") longName = field(body, 0, body.length);
    else if (type !== "g") {
      if (type === "0" || type === "") files.set(longName ?? named, Buffer.from(body));
      longName = undefined;
    }
    at += BLOCK + Math.ceil(size / BLOCK) * BLOCK;
  }
  return files;
}

/** A file as JSON, refusing one that is not. */
function parsed(bytes, named, revision) {
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch {
    return refuse(`what ${revision} holds at ${named} is not JSON.`);
  }
}

/**
 * The contract one revision holds, as the files to write under `contract/`, the
 * layout it is in and what it describes.
 *
 * A revision holding `contract/web-api/index.json` publishes the directory, and
 * every file under `contract/web-api/` is taken. One holding only
 * `contract/web-api.contract.json` publishes the single document.
 */
export function taken(archived, revision) {
  const directory = new Map();
  let single;
  for (const [path, bytes] of archived) {
    const inside = /^[^/]+\/contract\/(.+)$/.exec(path)?.[1];
    if (inside === undefined) continue;
    if (inside === SINGLE) single = bytes;
    if (!inside.startsWith(`${DIRECTORY}/`)) continue;
    const file = inside.slice(DIRECTORY.length + 1);
    if (!staysPut(file)) refuse(`what ${revision} holds names ${JSON.stringify(path)}, which leaves ${shown("")}.`);
    directory.set(file, bytes);
  }
  if (directory.size > 0) return takenDirectory(directory, revision);
  if (single === undefined) {
    refuse(`lemonfiber ${revision} holds neither ${shown(INDEX)} nor ${CONTRACT}/${SINGLE}.`);
  }
  const artefact = parsed(single, `${CONTRACT}/${SINGLE}`, revision);
  if (!isRecord(artefact) || typeof artefact.api_version !== "number" || !isRecord(artefact.kinds)) {
    refuse(`what ${revision} holds at ${CONTRACT}/${SINGLE} is not a contract artefact.`);
  }
  const text = single.toString("utf8");
  return {
    layout: SINGLE,
    files: new Map([[SINGLE, Buffer.from(text.endsWith("\n") ? text : `${text}\n`)]]),
    apiVersion: artefact.api_version,
    kinds: Object.keys(artefact.kinds),
  };
}

/** The directory one revision holds, refusing one without an index or missing a file the index names. */
function takenDirectory(directory, revision) {
  if (!directory.has(INDEX)) refuse(`what ${revision} holds at ${shown("")} has no ${INDEX}.`);
  for (const [file, bytes] of directory) parsed(bytes, shown(file), revision);
  const index = parsed(directory.get(INDEX), shown(INDEX), revision);
  if (!isRecord(index) || typeof index.api_version !== "number" || !isRecord(index.kinds)) {
    refuse(`what ${revision} holds at ${shown(INDEX)} is not a contract index.`);
  }
  const named = [
    ...Object.values(index.kinds),
    ...(isRecord(index[BODIES]) ? Object.values(index[BODIES]) : []),
    ...LISTS.filter((list) => Object.hasOwn(index, list)).map((list) => index[list]),
  ];
  const missing = named.filter((file) => !staysPut(file) || !directory.has(file));
  if (missing.length > 0) {
    refuse(`${shown(INDEX)} at ${revision} names files it does not hold: ${missing.map((file) => JSON.stringify(file)).join(", ")}.`);
  }
  return {
    layout: DIRECTORY,
    files: new Map([...directory].map(([file, bytes]) => [`${DIRECTORY}/${file}`, bytes])),
    apiVersion: index.api_version,
    kinds: Object.keys(index.kinds),
  };
}

/**
 * Writes what was taken under `root`'s `contract/`, with the revision it came
 * from, removing the copy it replaces in either layout.
 */
export async function vendor(root, contract, revision) {
  const under = join(root, CONTRACT);
  await mkdir(under, { recursive: true });
  await rm(join(under, DIRECTORY), { recursive: true, force: true });
  await rm(join(under, SINGLE), { force: true });
  await Promise.all(
    [...contract.files].map(async ([file, bytes]) => {
      await mkdir(dirname(join(under, file)), { recursive: true });
      await writeFile(join(under, file), bytes);
    }),
  );
  await writeFile(join(under, STAMP), `${revision}\n`);
}
