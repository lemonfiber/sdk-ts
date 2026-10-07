/**
 * Artefacts written as the core writes them, generated into a tree of their own.
 */
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { expect } from "vitest";
import { ArtefactRefused, OUT, generate, run } from "./index.mjs";

export const CODE = { description: "A stable identifier.\n\nNever recycled.", type: "string" };

/** One kind's envelope schema, as the core writes one. */
export function kind(data, definitions) {
  const schema = {
    title: "Envelope",
    description: "The wrapper every machine-readable payload arrives in.",
    type: "object",
    properties: {
      api_version: { type: "integer", format: "uint32", minimum: 0 },
      data,
      host: { type: ["string", "null"] },
      kind: { type: "string" },
    },
    required: ["api_version", "kind", "data"],
  };
  if (definitions !== undefined) schema.$defs = definitions;
  return schema;
}

/** A whole artefact describing these kinds, and the refusals, key-callable actions and reads where given. */
export function artefact(kinds, { refusals, keyCallable, reads, version = 1 } = {}) {
  return {
    api_version: version,
    kinds,
    ...(refusals !== undefined && { refusals }),
    ...(keyCallable !== undefined && { key_callable: keyCallable }),
    ...(reads !== undefined && { reads }),
  };
}

/** A schema with every `#/$defs/<Name>` reference spelled as `spell` spells the name. */
const respelled = (node, spell) =>
  JSON.parse(JSON.stringify(node), (key, value) =>
    key === "$ref" && typeof value === "string" && value.startsWith("#/$defs/") ? spell(value.slice("#/$defs/".length)) : value,
  );

/**
 * An artefact as the files of the directory layout, by path under `contract/web-api/`.
 *
 * Each kind's definitions become files under `defs/` in the kind's dialect, and
 * every reference a path to one.
 */
export function directory(whole) {
  const files = new Map();
  const index = { api_version: whole.api_version, kinds: {} };
  for (const [name, schema] of Object.entries(whole.kinds)) {
    const { $defs, ...envelope } = schema;
    index.kinds[name] = `kinds/${name}.json`;
    files.set(index.kinds[name], respelled(envelope, (defined) => `../defs/${defined}.json`));
    for (const [defined, definition] of Object.entries($defs ?? {})) {
      const dialect = schema.$schema === undefined ? {} : { $schema: schema.$schema };
      files.set(`defs/${defined}.json`, { ...dialect, ...respelled(definition, (other) => `${other}.json`) });
    }
  }
  for (const [list, file] of [["key_callable", "key-callable.json"], ["reads", "reads.json"], ["refusals", "refusals.json"]]) {
    if (!Object.hasOwn(whole, list)) continue;
    index[list] = file;
    files.set(file, whole[list]);
  }
  files.set("index.json", index);
  return files;
}

/** Writes `files` under the tree's `contract/web-api/`, each as JSON. */
export async function laidOut(root, files) {
  await Promise.all(
    [...files].map(async ([file, value]) => {
      await mkdir(dirname(join(root, "contract", "web-api", file)), { recursive: true });
      await writeFile(join(root, "contract", "web-api", file), JSON.stringify(value));
    }),
  );
}

/**
 * A fresh tree to generate into, holding a vendored artefact and the revision it
 * came from: as the single file, or as the directory when `layout` says so.
 */
export async function tree(whole, { layout = "single" } = {}) {
  const root = await mkdtemp(join(tmpdir(), "sdk-ts-contract-"));
  await mkdir(join(root, "contract"));
  if (layout === "directory") await laidOut(root, directory(whole));
  else await writeFile(join(root, "contract", "web-api.contract.json"), JSON.stringify(whole));
  await writeFile(join(root, "contract", "VERSION"), "v1.0.0\n");
  return root;
}

/** Lets a tree go. */
export const removed = (root) => rm(root, { recursive: true, force: true });

/** What generation wrote at `path` beneath the generated tree under `root`. */
export const written = (root, path) => readFile(join(root, OUT, path), "utf8");

/** The source of every file generating `whole` writes, by path beneath the generated tree. */
export function sources(whole, options) {
  const files = generate(whole, "v1.0.0", options);
  return new Map([...files].map(([file, source]) => [file.slice(OUT.length + 1), source]));
}

/** The sentence generation refuses an artefact with. */
export function refusal(whole, options) {
  let said;
  try {
    generate(whole, "v1.0.0", options);
  } catch (error_) {
    expect(error_).toBeInstanceOf(ArtefactRefused);
    said = error_.message;
  }
  expect(said).toBeDefined();
  return said;
}

/** Generates `whole` into a fresh tree and imports the index written there. */
export async function imported(whole) {
  const root = await tree(whole);
  expect(await run(root)).toBe(0);
  return { root, generated: await import(join(root, OUT, "index.ts")) };
}
