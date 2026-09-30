/**
 * The generator's refusal, exercised as the command it is.
 *
 * The script derives its paths from its own location, so a copy of it inside a
 * temporary tree reads that tree's contract. The tree lives under the package
 * so node still resolves the generator's dependency.
 */
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
  it("refuses a definition under a name this generator writes, and names both", async () => {
    // Two shapes under one name. Emitted, `tsc` reports a duplicate identifier
    // in a file nobody edits, the union becomes an error type, and every use of
    // it downstream fails for a reason none of those errors mentions.
    const collides = contract(1);
    collides.kinds.word.$defs = { Kind: { type: "string", enum: ["bool", "int"] } };
    await writeFile(join(tree, "contract", "web-api.contract.json"), JSON.stringify(collides));

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Kind");
    // The kind it came from, because the contract is one file of sixty-two and
    // a refusal naming only the type leaves somebody grepping for it.
    expect(result.stderr).toContain("word");
    expect(existsSync(written())).toBe(false);
  });

  it("refuses a definition named for an envelope this generator writes", async () => {
    // The per-kind half of the same set. `WordEnvelope` is written for the kind
    // `word`, so it is reserved by the contract's own list of kinds rather than
    // by a constant, and a contract that grows a kind grows this set with it.
    const collides = contract(1);
    collides.kinds.word.$defs = { WordEnvelope: { type: "object" } };
    await writeFile(join(tree, "contract", "web-api.contract.json"), JSON.stringify(collides));

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("WordEnvelope");
    expect(existsSync(written())).toBe(false);
  });

  it("accepts a definition whose name only contains one of them", async () => {
    // The control. `ProblemKind` is not `Kind`, and a check on substrings would
    // refuse most of the contract's vocabulary to catch one name — every
    // `…Kind`, every `…Contract`, and every type ending in `Envelope` that is
    // not an envelope this file writes.
    const nearby = contract(1);
    nearby.kinds.word.$defs = {
      ProblemKind: { type: "string" },
      ByKindness: { type: "object" },
    };
    await writeFile(join(tree, "contract", "web-api.contract.json"), JSON.stringify(nearby));

    const result = run();

    expect(result.status).toBe(0);
    expect(existsSync(written())).toBe(true);
  });
});

/** The one kind every contract here carries, beside the refusals it lists. */
const listing = (refusals) => ({ ...contract(1), refusals });

/** A refusal as the contract lists one. */
const refusal = (name, status, description = "Raised when the request was refused.") => ({
  name,
  status,
  description,
});

const writeContract = (body) =>
  writeFile(join(tree, "contract", "web-api.contract.json"), JSON.stringify(body));

describe("generating the refusal codes", () => {
  it("writes an empty list from a contract that lists none", async () => {
    await writeContract(contract(1));

    const result = run();
    const source = await readFile(written(), "utf8");

    expect(result.status).toBe(0);
    expect(source).toContain("export type RefusalCode = never;");
    expect(source).toContain("> = {};");
  });

  it("writes every code the contract lists, with what it says of each", async () => {
    await writeContract(
      listing({
        "ADMIT-6": refusal("NOT_YOURS", 403, "Raised when the account may not ask for this."),
        "ADMIT-4": refusal("NOT_ADMITTED", 403),
        "READ-1": refusal("NOT_HERE", 404),
      }),
    );

    const result = run();
    const generated = await import(written());

    expect(result.status).toBe(0);
    expect(Object.keys(generated.REFUSAL_CODES)).toEqual(["ADMIT-4", "ADMIT-6", "READ-1"]);
    expect(generated.REFUSAL_CODES["ADMIT-6"]).toEqual(
      refusal("NOT_YOURS", 403, "Raised when the account may not ask for this."),
    );
    expect(await readFile(written(), "utf8")).toContain(
      'export type RefusalCode = "ADMIT-4" | "ADMIT-6" | "READ-1";',
    );
  });

  it("writes a guard that knows the listed codes and no others", async () => {
    await writeContract(listing({ "ADMIT-4": refusal("NOT_ADMITTED", 403) }));

    run();
    const { isRefusalCode } = await import(written());

    expect(isRefusalCode("ADMIT-4")).toBe(true);
    expect(isRefusalCode("ADMIT-5")).toBe(false);
    expect(isRefusalCode("toString")).toBe(false);
  });

  it.each([
    ["a list", []],
    ["a string", "ADMIT-4"],
    ["null", null],
  ])("refuses refusals that are %s, and writes nothing", async (_what, refusals) => {
    await writeContract(listing(refusals));

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("keyed by code");
    expect(existsSync(written())).toBe(false);
  });

  it.each([
    [
      "a refusal that is not an object",
      { "ADMIT-4": "NOT_ADMITTED" },
      "ADMIT-4: not an object",
    ],
    [
      "a name not in SCREAMING_SNAKE",
      { "ADMIT-4": refusal("notAdmitted", 403) },
      "ADMIT-4: name",
    ],
    ["no name", { "ADMIT-4": { status: 403, description: "Raised." } }, "ADMIT-4: name"],
    [
      "a status that is a success",
      { "ADMIT-4": refusal("NOT_ADMITTED", 200) },
      "ADMIT-4: status",
    ],
    [
      "a status that is not a number",
      { "ADMIT-4": refusal("NOT_ADMITTED", "403") },
      "ADMIT-4: status",
    ],
    [
      "a status past any refusal",
      { "ADMIT-4": refusal("NOT_ADMITTED", 600) },
      "ADMIT-4: status",
    ],
    [
      "an empty description",
      { "ADMIT-4": refusal("NOT_ADMITTED", 403, " ") },
      "ADMIT-4: description",
    ],
    ["an empty code", { "": refusal("NOT_ADMITTED", 403) }, '"": not a code'],
    [
      "a code padded with spaces",
      { " ADMIT-4": refusal("NOT_ADMITTED", 403) },
      '" ADMIT-4": not a code',
    ],
    ["a code with no number", { ADMIT: refusal("NOT_ADMITTED", 403) }, '"ADMIT": not a code'],
    [
      "a code that would set a prototype",
      JSON.parse('{"__proto__": {"name": "NOT_ADMITTED", "status": 403, "description": "x"}}'),
      '"__proto__": not a code',
    ],
  ])("refuses %s, naming the code", async (_what, refusals, named) => {
    await writeContract(listing(refusals));

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(named);
    expect(existsSync(written())).toBe(false);
  });

  it("names every refusal that is wrong, not only the first", async () => {
    await writeContract(
      listing({ "ADMIT-4": refusal("admitted", 403), "ADMIT-5": refusal("ELSEWHERE", 99) }),
    );

    const result = run();

    expect(result.stderr).toContain("ADMIT-4: name");
    expect(result.stderr).toContain("ADMIT-5: status");
  });

  it("refuses one name under two codes, naming both", async () => {
    await writeContract(
      listing({
        "ADMIT-4": refusal("NOT_ADMITTED", 403),
        "ADMIT-5": refusal("NOT_ADMITTED", 403),
      }),
    );

    const result = run();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("ADMIT-5: name NOT_ADMITTED is also the name of ADMIT-4");
    expect(existsSync(written())).toBe(false);
  });

  it.each(["RefusalCode", "REFUSAL_CODES", "isRefusalCode"])(
    "refuses a definition named %s, which this generator writes",
    async (name) => {
      const collides = contract(1);
      collides.kinds.word.$defs = { [name]: { type: "object" } };
      await writeContract(collides);

      const result = run();

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(name);
      expect(existsSync(written())).toBe(false);
    },
  );
});
