/**
 * The vendored copy under `contract/`, in either layout the core publishes, read
 * into the one document the generator reads.
 *
 * The single file `web-api.contract.json` is that document. The directory
 * `web-api/` holds an index naming every other file, one file per kind, one per
 * request body, and one per definition under `defs/`, each `$ref` a path
 * resolved against the file it appears in. Read, each kind and each body
 * carries the definitions it reaches as its own `$defs`, every reference
 * spelled `#/$defs/<Name>`, which is the single file's shape, so both layouts
 * of one contract generate the same files.
 */
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, posix } from "node:path";
import { byCodePoint, isRecord } from "./artefact.mjs";
import { refuse } from "./refused.mjs";

/** Where the copy and its pin sit, relative to the repository. */
export const CONTRACT = "contract";

/** The scratch tree, relative to the repository, that the server's copy is taken into to compare against. */
export const SERVED = ".contract-served";

/** The pin: the revision the copy was taken from. */
export const STAMP = "VERSION";

/** The contract as one document. */
export const SINGLE = "web-api.contract.json";

/** The contract as a directory of documents. */
export const DIRECTORY = "web-api";

/** The document in the directory that names every other. */
export const INDEX = "index.json";

/** Where the index names the file of each body a route takes, by the route. */
export const BODIES = "bodies";

/** The lists the index names a file for, each under the key the single document carries it by. */
export const LISTS = ["key_callable", "reads", "refusals"];

/** What the generated files say they came from when the pin is missing. */
const UNKNOWN = "unknown";

/** A definition's file, relative to the directory: `defs/Remedy.json` holds `Remedy`. */
const DEFINITION_FILE = /^defs\/([^/]+)\.json$/;

/** Whether a path inside the directory stays there: relative, spelled plainly, never `..`. */
export const staysPut = (path) =>
  typeof path === "string" &&
  !["", "."].includes(path) &&
  !posix.isAbsolute(path) &&
  posix.normalize(path) === path &&
  !path.split("/").includes("..");

/** A file of the directory as a person reads it, from the repository. */
export const shown = (file) => `${CONTRACT}/${DIRECTORY}/${file}`;

/**
 * Which layout the copy under `root` is in, refusing a tree holding neither and
 * one holding both.
 */
export function layoutOf(root, fail = refuse) {
  const directory = existsSync(join(root, CONTRACT, DIRECTORY, INDEX));
  const single = existsSync(join(root, CONTRACT, SINGLE));
  if (directory && single) {
    fail(
      `${CONTRACT}/ holds both ${shown(INDEX)} and ${CONTRACT}/${SINGLE}, and a copy is one ` +
        "or the other. Sync again, which keeps one.",
    );
  }
  if (!directory && !single) {
    fail(`${CONTRACT}/ holds neither ${shown(INDEX)} nor ${CONTRACT}/${SINGLE}.`);
  }
  return directory ? DIRECTORY : SINGLE;
}

/**
 * One document of the copy, refusing one that cannot be read as JSON.
 *
 * Read synchronously: a directory is hundreds of small files, read one after
 * another as references reach them.
 */
function document(path, named) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error_) {
    return refuse(`${named} could not be read: ${String(error_)}`);
  }
}

/** Every `$ref` beneath a schema. */
function* referencesIn(node) {
  if (Array.isArray(node)) {
    for (const item of node) yield* referencesIn(item);
    return;
  }
  if (!isRecord(node)) return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "$ref") yield value;
    else yield* referencesIn(value);
  }
}

/** A schema with every `$ref` spelled as `respell` spells it. */
function respelled(node, respell) {
  if (Array.isArray(node)) return node.map((item) => respelled(item, respell));
  if (!isRecord(node)) return node;
  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [key, key === "$ref" ? respell(value) : respelled(value, respell)]),
  );
}

/**
 * The definition a reference in `from` names, or none.
 *
 * A reference is a relative path, resolved against `from`, to a file directly
 * under `defs/`, with nothing after the file's name.
 */
function resolved(from, reference) {
  if (typeof reference !== "string" || posix.isAbsolute(reference)) return undefined;
  const path = posix.normalize(posix.join(posix.dirname(from), reference));
  return DEFINITION_FILE.exec(path)?.[1];
}

/** Reads the directory under `root` file by file, holding each definition once. */
class Directory {
  #root;
  /** Each definition read: its schema respelled, the dialect it names, and the names it refers to. */
  #definitions = new Map();

  constructor(root) {
    this.#root = root;
  }

  /** One file of the directory, by its path relative to it, refusing a path leaving it. */
  read(file) {
    if (!staysPut(file)) {
      refuse(`${shown(INDEX)} names ${JSON.stringify(file)}, which is not a file in ${shown("")}.`);
    }
    return document(join(this.#root, CONTRACT, DIRECTORY, file), shown(file));
  }

  /** Every definition `schema` in `from` refers to, refusing a reference resolving to none. */
  #referred(from, schema) {
    const names = new Set();
    for (const reference of referencesIn(schema)) {
      const name = resolved(from, reference);
      if (name === undefined || !existsSync(join(this.#root, CONTRACT, DIRECTORY, "defs", `${name}.json`))) {
        refuse(
          `${shown(from)} refers to ${JSON.stringify(reference)}, which resolves to no definition ` +
            `in ${shown("defs/")}.`,
        );
      }
      names.add(name);
    }
    return names;
  }

  /** A schema in `from` with every reference spelled as one to a definition beside it. */
  static #beside(from, schema) {
    return respelled(schema, (reference) => `#/$defs/${resolved(from, reference)}`);
  }

  /** A definition by name, read the first time it is reached. */
  #definition(name) {
    if (!this.#definitions.has(name)) {
      const from = `defs/${name}.json`;
      const schema = this.read(from);
      const referred = this.#referred(from, schema);
      if (isRecord(schema)) {
        const { $schema: dialect, ...rest } = schema;
        this.#definitions.set(name, { schema: Directory.#beside(from, rest), dialect, referred });
      } else {
        this.#definitions.set(name, { schema, dialect: undefined, referred });
      }
    }
    return this.#definitions.get(name);
  }

  /**
   * A kind's envelope or a route's body, carrying every definition it reaches as
   * its own `$defs`.
   */
  schema(named, file) {
    const schema = this.read(file);
    if (!isRecord(schema)) return schema;
    if (Object.hasOwn(schema, "$defs")) {
      refuse(`${shown(file)} carries $defs, and every definition is a file in ${shown("defs/")}.`);
    }
    const reached = new Map();
    const pending = [...this.#referred(file, schema)];
    while (pending.length > 0) {
      const name = pending.pop();
      if (reached.has(name)) continue;
      const definition = this.#definition(name);
      if (definition.dialect !== undefined && definition.dialect !== schema.$schema) {
        const where = shown(`defs/${name}.json`);
        const reaching = schema.$schema === undefined ? "names none" : `is written in ${JSON.stringify(schema.$schema)}`;
        refuse(`${where} is written in ${JSON.stringify(definition.dialect)}, and \`${named}\`, which reaches it, ${reaching}.`);
      }
      reached.set(name, definition.schema);
      pending.push(...definition.referred);
    }
    const envelope = Directory.#beside(file, schema);
    if (reached.size === 0) return envelope;
    const names = [...reached.keys()].toSorted(byCodePoint);
    return { ...envelope, $defs: Object.fromEntries(names.map((name) => [name, reached.get(name)])) };
  }
}

/** The directory under `root`, as the single document it describes. */
function readDirectory(root) {
  const directory = new Directory(root);
  const index = document(join(root, CONTRACT, DIRECTORY, INDEX), shown(INDEX));
  if (!isRecord(index)) refuse(`${shown(INDEX)} is not an object.`);
  const artefact = { api_version: index.api_version };
  if (isRecord(index.kinds)) {
    const kinds = [];
    for (const kind of Object.keys(index.kinds).toSorted(byCodePoint)) {
      kinds.push([kind, directory.schema(kind, index.kinds[kind])]);
    }
    artefact.kinds = Object.fromEntries(kinds);
  } else {
    artefact.kinds = index.kinds;
  }
  if (isRecord(index[BODIES])) {
    const bodies = Object.keys(index[BODIES])
      .toSorted(byCodePoint)
      .map((route) => [route, directory.schema(route, index[BODIES][route])]);
    artefact[BODIES] = Object.fromEntries(bodies);
  } else if (Object.hasOwn(index, BODIES)) {
    artefact[BODIES] = index[BODIES];
  }
  for (const list of LISTS) {
    if (Object.hasOwn(index, list)) artefact[list] = directory.read(index[list]);
  }
  return artefact;
}

/** The single document under `root`. */
function readSingle(root) {
  const artefact = document(join(root, CONTRACT, SINGLE), `${CONTRACT}/${SINGLE}`);
  if (!isRecord(artefact)) refuse(`${CONTRACT}/${SINGLE} is not an object.`);
  return artefact;
}

/** The copy under `root` as the document the generator reads, and the revision it was taken from. */
export async function readArtefact(root) {
  const stamp = (await readFile(join(root, CONTRACT, STAMP), "utf8").catch(() => UNKNOWN)).trim();
  const artefact = layoutOf(root) === DIRECTORY ? readDirectory(root) : readSingle(root);
  return { artefact, stamp };
}
