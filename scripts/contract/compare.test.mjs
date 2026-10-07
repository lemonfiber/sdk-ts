/**
 * Comparing two copies of the contract in either layout, naming each file or
 * kind that differs.
 */
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { differences } from "./compare.mjs";
import { CODE, artefact, kind, laidOut, removed, tree } from "./fixtures.mjs";

const roots = [];
const held = async (whole, layout) => {
  const root = await tree(whole, { layout });
  roots.push(root);
  return root;
};

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
});

const WHOLE = artefact({ a: kind({ $ref: "#/$defs/Code" }, { Code: CODE }), b: kind({ type: "string" }) }, { reads: [] });

describe("comparing two single files", () => {
  it("finds none where they parse to the same document, however they are spelled", async () => {
    const spelled = await held(WHOLE, "single");
    await writeFile(join(spelled, "contract", "web-api.contract.json"), JSON.stringify(WHOLE, undefined, 2));
    expect(await differences(await held(WHOLE, "single"), spelled)).toEqual([]);
  });

  it("names the kinds one describes and the other does not", async () => {
    const fewer = artefact({ a: kind({ type: "string" }), c: kind({ type: "string" }) });
    expect(await differences(await held(fewer, "single"), await held(WHOLE, "single"))).toEqual([
      "kinds described by the server and not here: b",
      "kinds described here and not by the server: c",
    ]);
  });

  it("says a shape changed where the kinds are the same", async () => {
    const changed = artefact({ a: kind({ type: "integer" }), b: kind({ type: "string" }) });
    expect(await differences(await held(changed, "single"), await held(WHOLE, "single"))).toEqual([
      "the same kinds, described differently: a shape changed inside one of them",
    ]);
    expect(await differences(await held([], "single"), await held([1], "single"))).toEqual([
      "the same kinds, described differently: a shape changed inside one of them",
    ]);
  });
});

describe("comparing two directories", () => {
  it("finds none where every file parses to the same document", async () => {
    const spelled = await held(WHOLE, "directory");
    await writeFile(join(spelled, "contract", "web-api", "reads.json"), "[\n]\n");
    expect(await differences(await held(WHOLE, "directory"), spelled)).toEqual([]);
  });

  it("names every file one has and the other does not, and every file that differs", async () => {
    const ours = await held(WHOLE, "directory");
    await rm(join(ours, "contract", "web-api", "defs", "Code.json"));
    await laidOut(ours, new Map([["defs/Zed.json", CODE], ["kinds/b.json", kind({ type: "integer" })]]));
    await writeFile(join(ours, "contract", "web-api", "notes.txt"), "ours");
    const theirs = await held(WHOLE, "directory");
    await writeFile(join(theirs, "contract", "web-api", "notes.txt"), "theirs");
    expect(await differences(ours, theirs)).toEqual([
      "files the server has and this copy does not: defs/Code.json",
      "files this copy has and the server does not: defs/Zed.json",
      "files that differ: kinds/b.json, notes.txt",
    ]);
  });
});

describe("comparing two layouts", () => {
  it("says which layout each copy is in, in both directions", async () => {
    const single = await held(WHOLE, "single");
    const directory = await held(WHOLE, "directory");
    expect(await differences(single, directory)).toEqual([
      "the server publishes the directory contract/web-api/, and this copy is the single file contract/web-api.contract.json",
    ]);
    expect(await differences(directory, single)).toEqual([
      "the server publishes the single file contract/web-api.contract.json, and this copy is the directory contract/web-api/",
    ]);
  });

  it("refuses a tree holding no copy, naming the tree", async () => {
    const empty = await mkdtemp(join(tmpdir(), "sdk-ts-contract-"));
    roots.push(empty);
    await expect(differences(await held(WHOLE, "single"), empty)).rejects.toThrow(
      `in ${empty}, contract/ holds neither contract/web-api/index.json nor contract/web-api.contract.json.`,
    );
  });
});
