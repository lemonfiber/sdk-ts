/**
 * The generator's refusal, exercised as the command it is.
 *
 * The script derives its paths from its own location, so a copy of it inside a
 * temporary tree reads that tree's contract. The tree lives under the package
 * so node still resolves the generator's dependency.
 */
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATOR = join(ROOT, "scripts", "contract-generate.mjs");

let tree;

/** A contract with one kind, so only the version is ever what is wrong. */
const contract = (apiVersion) => ({
  api_version: apiVersion,
  kinds: {
    word: {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      properties: {
        api_version: { type: "integer" },
        kind: { type: "string" },
        data: { type: "object", properties: { word: { type: "string" } } },
      },
      required: ["api_version", "kind", "data"],
    },
  },
});

const run = () =>
  spawnSync(process.execPath, [join(tree, "scripts", "contract-generate.mjs")], {
    encoding: "utf8",
  });

const written = () => join(tree, "src", "generated", "contract.ts");

beforeEach(async () => {
  tree = await mkdtemp(join(ROOT, ".contract-test-"));
  await mkdir(join(tree, "scripts"), { recursive: true });
  await mkdir(join(tree, "contract"), { recursive: true });
  await cp(GENERATOR, join(tree, "scripts", "contract-generate.mjs"));
  await writeFile(join(tree, "contract", "VERSION"), "v9.9.9\n");
});

afterEach(async () => {
  await rm(tree, { recursive: true, force: true });
});

describe("generating from a contract this package does not implement", () => {
  it("refuses, and names both versions", async () => {
    await writeFile(
      join(tree, "contract", "web-api.contract.json"),
      JSON.stringify(contract(2)),
    );

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("2");
    expect(result.stderr).toContain("1");
  });

  it("writes nothing when it refuses", async () => {
    await writeFile(
      join(tree, "contract", "web-api.contract.json"),
      JSON.stringify(contract(2)),
    );

    run();

    expect(existsSync(written())).toBe(false);
  });

  it("writes when the version is the one it implements", async () => {
    await writeFile(
      join(tree, "contract", "web-api.contract.json"),
      JSON.stringify(contract(1)),
    );

    const result = run();

    expect(result.status).toBe(0);
    expect(existsSync(written())).toBe(true);
  });

  it("refuses a reference with a constraint beside it, and names where", async () => {
    const ambiguous = contract(1);
    ambiguous.kinds.word.$defs = { Word: { type: "object" } };
    ambiguous.kinds.word.properties.data = {
      $ref: "#/$defs/Word",
      properties: { kind: { const: "word" } },
      type: "object",
    };
    await writeFile(join(tree, "contract", "web-api.contract.json"), JSON.stringify(ambiguous));

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("/word/properties/data");
    expect(existsSync(written())).toBe(false);
  });

  it("accepts a reference described but not constrained", async () => {
    const described = contract(1);
    described.kinds.word.$defs = { Word: { type: "object" } };
    described.kinds.word.properties.data = {
      $ref: "#/$defs/Word",
      description: "The payload.",
    };
    await writeFile(join(tree, "contract", "web-api.contract.json"), JSON.stringify(described));

    const result = run();

    expect(result.status).toBe(0);
    expect(existsSync(written())).toBe(true);
  });

  it("refuses a contract describing no kinds", async () => {
    await writeFile(
      join(tree, "contract", "web-api.contract.json"),
      JSON.stringify({ api_version: 1, kinds: {} }),
    );

    const result = run();

    expect(result.status).toBe(1);
    expect(existsSync(written())).toBe(false);
  });
});
