/** The report of each entry point a built tree exports. */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { declarations } from "./compare.mjs";
import { entriesOf, reportsOf } from "./reports.mjs";

/** How long API Extractor may take to compile a tree, under a machine running the whole suite. */
const COMPILING_MS = 60_000;

const roots = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

/** A built tree of a package exporting these entry points, each declaring what `dist` holds for it. */
async function built(exports, dist) {
  const root = await mkdtemp(join(tmpdir(), "sdk-ts-built-"));
  roots.push(root);
  await mkdir(join(root, "dist"));
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({ name: "@lemonfiber/sdk-ts", version: "0.0.0", type: "module", exports }),
  );
  await Promise.all(
    Object.entries(dist).map(([file, text]) => writeFile(join(root, "dist", file), text)),
  );
  return root;
}

describe("the reports of a built tree", () => {
  it("names each entry point that declares types by the specifier a consumer imports", async () => {
    const root = await built(
      {
        ".": { types: "./dist/index.d.mts" },
        "./contract": { types: "./dist/contract.d.mts" },
        "./package.json": "./package.json",
      },
      {},
    );
    expect(entriesOf(root)).toEqual([
      { specifier: "@lemonfiber/sdk-ts", types: "./dist/index.d.mts" },
      { specifier: "@lemonfiber/sdk-ts/contract", types: "./dist/contract.d.mts" },
    ]);
  });

  it(
    "reports what each entry point exports, a declaration it reaches through another file included",
    async () => {
      const root = await built(
        {
          ".": { types: "./dist/index.d.mts" },
          "./contract": { types: "./dist/contract.d.mts" },
        },
        {
          "index.d.mts":
            'import { Code } from "./shared.mjs";\nexport interface Problem {\n  code: Code;\n}\n',
          "contract.d.mts": 'export type { Code } from "./shared.mjs";\n',
          "shared.d.mts": 'export type Code = "READ-1" | "READ-2";\n',
        },
      );
      const reports = reportsOf(root);
      expect([...reports.keys()]).toEqual([
        "@lemonfiber/sdk-ts",
        "@lemonfiber/sdk-ts/contract",
      ]);
      expect(declarations(reports.get("@lemonfiber/sdk-ts")).get("Problem").members).toEqual(
        new Map([["code", "code: Code;"]]),
      );
      expect(
        declarations(reports.get("@lemonfiber/sdk-ts/contract")).get("Code").union,
      ).toEqual(new Set(['"READ-1"', '"READ-2"']));
    },
    COMPILING_MS,
  );

  it(
    "refuses a whole surface reaching a name no entry point exports, since no report shows it change, and reads any other",
    async () => {
      const root = await built(
        { ".": { types: "./dist/index.d.mts" } },
        {
          "index.d.mts":
            'import { Code } from "./shared.mjs";\nexport interface Problem {\n  code: Code;\n}\n',
          "shared.d.mts": 'export type Code = "READ-1";\n',
        },
      );
      expect([...reportsOf(root).keys()]).toEqual(["@lemonfiber/sdk-ts"]);
      expect(() => reportsOf(root, { whole: true })).toThrow(
        "the entry points reach `Code`, which none of them exports, so no report shows a change to it",
      );
    },
    COMPILING_MS,
  );

  it(
    "refuses an entry point whose declarations do not compile",
    async () => {
      const root = await built(
        { ".": { types: "./dist/index.d.mts" } },
        { "index.d.mts": "export interface Problem {\n  code: Missing;\n}\n" },
      );
      expect(() => reportsOf(root)).toThrow(
        /^API Extractor could not read \.\/dist\/index\.d\.mts under /,
      );
    },
    COMPILING_MS,
  );
});
