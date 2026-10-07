/**
 * Reading the vendored copy in either layout, and refusing a directory whose
 * references resolve to no definition.
 */
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CODE, artefact, directory, kind, laidOut, removed, tree } from "./fixtures.mjs";
import { OUT, generate, run } from "./index.mjs";
import { readArtefact } from "./vendored.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIALECT = "https://json-schema.org/draft/2020-12/schema";

const roots = [];
const held = async (whole, layout = "directory") => {
  const root = await tree(whole, { layout });
  roots.push(root);
  return root;
};

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
  vi.restoreAllMocks();
});

/** Every file generating the copy under `root` writes. */
const generated = async (root) => {
  const { artefact: whole, stamp } = await readArtefact(root);
  return generate(whole, stamp);
};

/** What `run` says when it refuses the copy under `root`, having written nothing. */
const refused = async (root) => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  expect(await run(root)).toBe(1);
  expect(existsSync(join(root, OUT))).toBe(false);
  return String(vi.mocked(console.error).mock.lastCall?.[0]).replace("contract:generate: refused, and nothing was written. ", "");
};

const PROBLEM = {
  description: "Something that went wrong.",
  type: "object",
  properties: { code: { $ref: "#/$defs/Code" }, cause: { anyOf: [{ $ref: "#/$defs/Problem" }, { type: "null" }] } },
  required: ["code"],
};

const WHOLE = artefact(
  {
    error: { $schema: DIALECT, ...kind({ $ref: "#/$defs/Problem" }, { Problem: PROBLEM, Code: CODE }) },
    status: { $schema: DIALECT, ...kind({ $ref: "#/$defs/Code" }, { Code: CODE }) },
    pull: { $schema: DIALECT, ...kind({ type: "string" }) },
  },
  {
    refusals: { "READ-1": { name: "NOT_FOUND", status: 404, description: "Absent." } },
    keyCallable: [{ action: "stop", disturbs: true, rehearsal: false, idempotent: true }],
    reads: [{ path: "/api/status", file: false, kinds: ["status"], parameters: [] }],
  },
);

describe("reading either layout", () => {
  it("generates from the vendored contract as a directory exactly what it generates as one file", async () => {
    const { artefact: whole } = await readArtefact(ROOT);
    const single = await held(whole, "single");
    const split = await held(whole);
    expect(await generated(split)).toEqual(await generated(single));
  }, 30_000);

  it("generates from a directory exactly what the single file generates, the lists included", async () => {
    const files = await generated(await held(WHOLE));
    expect(files).toEqual(await generated(await held(WHOLE, "single")));
    expect(files.get(`${OUT}/shared/error__status.ts`)).toContain("export type Code = string;");
    expect(files.get(`${OUT}/refusals.ts`)).toContain('"READ-1"');
  });

  it("reads a directory whose index names no list as listing none", async () => {
    const { artefact: whole } = await readArtefact(await held(artefact({ pull: kind({ type: "string" }) })));
    expect(Object.keys(whole)).toEqual(["api_version", "kinds"]);
  });

  it("holds a directory to the guards the single file is held to", async () => {
    expect(await refused(await held(artefact({ pull: kind({ type: "string" }) }, { version: 2 })))).toContain(
      "api_version 2, and this package implements 1",
    );
    const beside = { type: "object", properties: { v: { $ref: "#/$defs/Code", type: "string" } } };
    expect(await refused(await held(artefact({ a: kind({ $ref: "#/$defs/R" }, { R: beside, Code: CODE }) })))).toContain(
      "/a/$defs/R/properties/v (type)",
    );
    expect(await refused(await held(artefact({ a: kind({ $ref: "#/$defs/Kind" }, { Kind: CODE }) })))).toContain(
      "`Kind`, defined by `a`, takes a name this generator writes itself",
    );
    const none = await held({ api_version: 1, kinds: {} });
    expect(await refused(none)).toBe("The vendored contract describes no kinds.");
    await laidOut(none, new Map([["index.json", { api_version: 1 }]]));
    expect(await refused(none)).toBe("The vendored contract describes no kinds.");
  });
});

describe("refusing a reference that resolves to no definition", () => {
  /** A directory whose kind `a` refers from `data` with `reference`, beside the definitions given. */
  const referring = async (reference, definitions = {}) => {
    const root = await held(artefact({ a: kind({ type: "string" }) }));
    const files = directory(artefact({ a: kind({ type: "string" }) }));
    const envelope = files.get("kinds/a.json");
    envelope.properties.data = { $ref: reference };
    for (const [name, schema] of Object.entries(definitions)) files.set(`defs/${name}.json`, schema);
    await laidOut(root, files);
    return root;
  };

  it.each([
    ["#/$defs/Code", "a fragment"],
    ["../defs/Missing.json", "a definition with no file"],
    ["Code.json", "a path resolving beside the kind rather than under defs/"],
    ["../../VERSION", "a path leaving the directory"],
    ["https://example.com/defs/Code.json", "an address"],
    ["/defs/Code.json", "an absolute path"],
  ])("refuses %s (%s), naming it and the file, and writes nothing", async (reference) => {
    expect(await refused(await referring(reference, { Code: CODE }))).toBe(
      `contract/web-api/kinds/a.json refers to ${JSON.stringify(reference)}, which resolves to no definition in contract/web-api/defs/.`,
    );
  });

  it.each([
    ["Code.json", {}],
    ["/Code.json", { Code: CODE }],
    ["Code.json#/properties/x", { Code: CODE }],
  ])(
    "refuses %s inside a definition, naming the definition's file",
    async (reference, beside) => {
      const problem = { type: "object", properties: { code: { $ref: reference } } };
      expect(await refused(await referring("../defs/Problem.json", { Problem: problem, ...beside }))).toBe(
        `contract/web-api/defs/Problem.json refers to ${JSON.stringify(reference)}, which resolves to no definition in contract/web-api/defs/.`,
      );
    },
  );

  it("resolves a reference against the definition it appears in", async () => {
    const problem = { type: "object", properties: { code: { $ref: "Code.json" } } };
    const { artefact: whole } = await readArtefact(await referring("../defs/Problem.json", { Problem: problem, Code: CODE }));
    expect(whole.kinds.a.properties.data).toEqual({ $ref: "#/$defs/Problem" });
    expect(whole.kinds.a.$defs).toEqual({ Code: CODE, Problem: { type: "object", properties: { code: { $ref: "#/$defs/Code" } } } });
  });

  it("refuses a reference that is not a string", async () => {
    expect(await refused(await referring(7))).toBe(
      "contract/web-api/kinds/a.json refers to 7, which resolves to no definition in contract/web-api/defs/.",
    );
  });
});

describe("refusing a directory that cannot be read one way", () => {
  it("refuses a tree holding both layouts, and one holding neither", async () => {
    const root = await held(artefact({ pull: kind({ type: "string" }) }));
    await writeFile(join(root, "contract", "web-api.contract.json"), "{}");
    expect(await refused(root)).toBe(
      "contract/ holds both contract/web-api/index.json and contract/web-api.contract.json, and a copy is one or the other. Sync again, which keeps one.",
    );
    await rm(join(root, "contract"), { recursive: true });
    await mkdir(join(root, "contract"));
    expect(await refused(root)).toBe("contract/ holds neither contract/web-api/index.json nor contract/web-api.contract.json.");
  });

  it("refuses a single file that is not an object", async () => {
    expect(await refused(await held([], "single"))).toBe("contract/web-api.contract.json is not an object.");
  });

  it("refuses a kind carrying its own definitions", async () => {
    const root = await held(artefact({ a: kind({ type: "string" }) }));
    await laidOut(root, new Map([["kinds/a.json", kind({ type: "string" }, { Code: CODE })]]));
    expect(await refused(root)).toBe("contract/web-api/kinds/a.json carries $defs, and every definition is a file in contract/web-api/defs/.");
  });

  it("refuses a definition in a dialect other than its kind's", async () => {
    const root = await held(artefact({ a: { $schema: DIALECT, ...kind({ $ref: "#/$defs/Code" }, { Code: CODE }) } }));
    await laidOut(root, new Map([["defs/Code.json", { $schema: "http://json-schema.org/draft-07/schema#", ...CODE }]]));
    expect(await refused(root)).toBe(
      `contract/web-api/defs/Code.json is written in "http://json-schema.org/draft-07/schema#", and \`a\`, which reaches it, is written in "${DIALECT}".`,
    );
  });

  it("refuses a definition naming a dialect its kind does not name", async () => {
    const root = await held(artefact({ a: kind({ $ref: "#/$defs/Code" }, { Code: CODE }) }));
    await laidOut(root, new Map([["defs/Code.json", { $schema: DIALECT, ...CODE }]]));
    expect(await refused(root)).toBe(`contract/web-api/defs/Code.json is written in "${DIALECT}", and \`a\`, which reaches it, names none.`);
  });

  it("refuses an index that is not an object, and one naming a file outside the directory", async () => {
    const root = await held(artefact({ a: kind({ type: "string" }) }));
    await laidOut(root, new Map([["index.json", []]]));
    expect(await refused(root)).toBe("contract/web-api/index.json is not an object.");
    for (const file of ["../VERSION", 3, ""]) {
      await laidOut(root, new Map([["index.json", { api_version: 1, kinds: { a: file } }]]));
      expect(await refused(root)).toBe(
        `contract/web-api/index.json names ${JSON.stringify(file)}, which is not a file in contract/web-api/.`,
      );
    }
  });

  it("refuses a file it cannot read, naming it", async () => {
    const root = await held(artefact({ a: kind({ type: "string" }) }, { reads: [] }));
    await rm(join(root, "contract", "web-api", "reads.json"));
    expect(await refused(root)).toMatch(/^contract\/web-api\/reads\.json could not be read: /);
  });

  it("hands a kind or a definition that is no schema to the guards that name it", async () => {
    const root = await held(artefact({ a: kind({ $ref: "#/$defs/Code" }, { Code: CODE }) }));
    await laidOut(root, new Map([["defs/Code.json", 3]]));
    expect(await refused(root)).toContain("`Code`, defined by `a` is 3, which is not a schema this generator reads.");
    await laidOut(root, new Map([["kinds/a.json", 3]]));
    expect(await refused(root)).toBe("The kind `a` is 3, which is not an envelope's schema.");
  });
});
