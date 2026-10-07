/**
 * Generating the types from the artefact, and refusing an artefact that cannot be
 * read one way.
 */
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CODE, artefact, imported, kind, refusal, removed, sources, tree, written } from "./fixtures.mjs";
import { OUT, generate, run } from "./index.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const roots = [];
const held = async (whole) => {
  const root = await tree(whole);
  roots.push(root);
  return root;
};

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
  vi.restoreAllMocks();
});

const PROBLEM = {
  description: "Something that went wrong.",
  type: "object",
  properties: {
    cause: { anyOf: [{ $ref: "#/$defs/Problem" }, { type: "null" }] },
    code: { description: "The stable identifier.", $ref: "#/$defs/Code" },
    remedies: { type: "array", items: { type: "string" } },
    severity: {
      oneOf: [
        { type: "string", const: "advisory", description: "Informational." },
        { type: "string", const: "error" },
      ],
    },
  },
  required: ["code", "remedies", "severity"],
};

const PULL = { pull: kind({ type: "string" }) };

describe("the vendored artefact", () => {
  it("generates exactly what is committed", async () => {
    const whole = JSON.parse(await readFile(join(ROOT, "contract", "web-api.contract.json"), "utf8"));
    const stamp = (await readFile(join(ROOT, "contract", "VERSION"), "utf8")).trim();
    for (const [file, source] of generate(whole, stamp)) {
      expect(await readFile(join(ROOT, file), "utf8")).toBe(source);
    }
  });
});

describe("writing a shape", () => {
  it("writes an object as an interface with its required and optional fields", () => {
    const source = sources(artefact({ error: kind({ $ref: "#/$defs/Problem" }, { Problem: PROBLEM, Code: CODE }) })).get("kinds/error.ts");
    expect(source).toContain("/** Something that went wrong. */\nexport interface Problem {");
    expect(source).toContain("  cause?: Problem | null;");
    expect(source).toContain("  /** The stable identifier. */\n  code: Code;");
    expect(source).toContain("  remedies: string[];");
    expect(source).toContain('  severity: "advisory" | "error";');
    expect(source).toContain("/**\n * A stable identifier.\n *\n * Never recycled.\n */\nexport type Code = string;");
  });

  it("narrows each envelope's kind to the kind it carries", () => {
    const source = sources(artefact({ "front-door": kind({ type: "string" }) })).get("kinds/front-door.ts");
    expect(source).toContain('/** The envelope carrying `front-door`. */\nexport interface FrontDoorEnvelope {');
    expect(source).toContain('  kind: "front-door";');
    expect(source).toContain("  host?: string | null;");
  });

  it("names each variant of a tagged union for its tag", () => {
    const scope = {
      description: "How much a backup covers.",
      oneOf: [
        { description: "Everything.", type: "object", properties: { scope: { const: "whole_stack" } }, required: ["scope"] },
        { type: "object", properties: { scope: { const: "service" }, name: { type: "string" } }, required: ["scope", "name"] },
      ],
    };
    const source = sources(artefact({ backup: kind({ $ref: "#/$defs/Scope" }, { Scope: scope }) })).get("kinds/backup.ts");
    expect(source).toContain("export type Scope = ScopeWholeStack | ScopeService;");
    expect(source).toContain("/** Everything. */\nexport interface ScopeWholeStack {");
    expect(source).toContain('  scope: "service";');
  });

  it("names untagged variants for their place, and a tag naming nothing for its place too", () => {
    const either = {
      oneOf: [
        { type: "string", const: "nothing" },
        { type: "object", properties: { a: { type: "integer" } }, required: ["a"] },
        { type: "object", properties: { b: { type: "number" } } },
        { $ref: "#/$defs/Code" },
      ],
    };
    const tagged = {
      oneOf: [
        { type: "object", properties: { t: { const: "--" } }, required: ["t"] },
        { type: "object", properties: { t: { const: "two" } }, required: ["t"] },
      ],
    };
    const source = sources(
      artefact({ word: kind({ $ref: "#/$defs/Either" }, { Either: either, Tagged: tagged, Code: CODE }) }),
    ).get("kinds/word.ts");
    expect(source).toContain('export type Either = "nothing" | EitherVariant2 | EitherVariant3 | Code;');
    expect(source).toContain("export type Tagged = TaggedVariant1 | TaggedTwo;");
  });

  it("names inline objects, items and values after where they sit, and quotes a key it must", () => {
    const report = {
      type: "object",
      properties: {
        inner: { type: "object", properties: { x: { type: "boolean" } }, required: ["x"] },
        maybe: { type: ["object", "null"], properties: { y: { type: "null" } } },
        counts: { type: "object", additionalProperties: { type: "integer" } },
        rows: { type: "array", items: { type: "object", properties: { z: { type: "string" } } } },
        either: { type: "array", items: { type: ["string", "null"] } },
        mixed: { anyOf: [{ type: "integer" }, { type: "boolean" }, { type: "string" }] },
        pick: { enum: ["a", 1, true] },
        flag: { const: false },
        "at-time": { type: "integer" },
        empty: { type: "object", properties: {} },
      },
      required: ["inner", "counts", "rows"],
    };
    const source = sources(artefact({ status: kind({ $ref: "#/$defs/Report" }, { Report: report }) })).get("kinds/status.ts");
    expect(source).toContain("  inner: ReportInner;");
    expect(source).toContain("  maybe?: ReportMaybe | null;");
    expect(source).toContain("  counts: { [key: string]: number };");
    expect(source).toContain("  rows: ReportRowsItem[];");
    expect(source).toContain("  either?: (string | null)[];");
    expect(source).toContain("  mixed?: number | boolean | string;");
    expect(source).toContain('  pick?: "a" | 1 | true;');
    expect(source).toContain("  flag?: false;");
    expect(source).toContain('  "at-time"?: number;');
    expect(source).toContain("export interface ReportEmpty {\n}");
  });

  it("writes a definition two kinds carry alike once", () => {
    const files = sources(
      artefact({ a: kind({ $ref: "#/$defs/Code" }, { Code: CODE }), b: kind({ $ref: "#/$defs/Code" }, { Code: CODE }) }),
    );
    expect([...files.values()].filter((source) => source.includes("export type Code ="))).toHaveLength(1);
  });

  it("writes a description so that it reads back as written and closes nothing", () => {
    const said = "ends a comment */ and goes on";
    const source = sources(artefact({ pull: kind({ $ref: "#/$defs/Said" }, { Said: { description: said, type: "string" } }) })).get("kinds/pull.ts");
    expect(source).toContain(String.raw`/** ends a comment *\/ and goes on */`);
  });
});

describe("refusing what cannot be read one way", () => {
  it.each([
    [{ not: {} }, "uses not, which this generator does not read"],
    [true, "is true, which is not a schema this generator reads"],
    [{ description: "?" }, "declares no type"],
    [{ type: "array" }, "is an array that says nothing of its items"],
    [{ type: "object" }, "is an object that says nothing of its fields"],
    [{ type: "tuple" }, 'is of type "tuple"'],
    [{ const: [1] }, "a constant of [1] has no TypeScript literal"],
  ])("refuses %j rather than guess", (schema, said) => {
    expect(refusal(artefact({ a: kind(schema, {}) }))).toContain(said);
  });

  it.each(["Kind", "ByKind", "CONTRACT_API_VERSION", "RefusalCode", "REFUSAL_CODES", "isRefusalCode", "AEnvelope"])(
    "refuses a definition named %s, which this generator writes, naming its kind",
    (name) => {
      const said = refusal(artefact({ a: kind({ $ref: `#/$defs/${name}` }, { [name]: CODE }) }));
      expect(said).toContain(`\`${name}\`, defined by \`a\`, takes a name this generator writes itself`);
    },
  );

  it("accepts a definition whose name only contains one of them", () => {
    const files = sources(artefact({ a: kind({ $ref: "#/$defs/ProblemKind" }, { ProblemKind: CODE, ByKindness: CODE }) }));
    expect(files.get("kinds/a.ts")).toContain("export type ByKindness = string;");
  });

  it.each(["lower", "Not-A-Name"])("refuses a definition named %s, which no type can carry", (name) => {
    expect(refusal(artefact({ a: kind({ $ref: `#/$defs/${name}` }, { [name]: CODE }) }))).toContain(
      `\`${name}\`, defined by \`a\`, is not a name a TypeScript type can carry`,
    );
  });

  it("refuses one name for two shapes, and an inline name another shape or the generator holds", () => {
    expect(
      refusal(artefact({ a: kind({ $ref: "#/$defs/Code" }, { Code: CODE }), b: kind({ $ref: "#/$defs/Code" }, { Code: { type: "integer" } }) })),
    ).toContain("`Code` is defined by `a` and by `b` as two different shapes");
    const report = { type: "object", properties: { inner: { type: "object", properties: {} } } };
    expect(refusal(artefact({ a: kind({ $ref: "#/$defs/Report" }, { Report: report, ReportInner: CODE }) }))).toContain(
      "would both be written as `ReportInner`",
    );
    const listing = { type: "object", properties: { code: { type: "object", properties: {} } } };
    expect(refusal(artefact({ a: kind({ $ref: "#/$defs/Refusal" }, { Refusal: listing }) }))).toContain(
      "would be written as `RefusalCode`, which here names the union of every code a refusal may carry",
    );
  });

  it.each(["api_version", "kind", "data"])("refuses an envelope that does not require %s", (missing) => {
    const schema = kind({ type: "string" });
    schema.required = schema.required.filter((field) => field !== missing);
    expect(refusal(artefact({ a: schema }))).toContain(`does not require \`${missing}\``);
  });

  it.each(["Pull", "1pull", "pull door"])("refuses a kind spelled %j", (name) => {
    expect(refusal(artefact({ [name]: kind({ type: "string" }) }))).toContain("is not lowercase letters");
  });

  it("refuses two kinds written as one envelope, a contract describing no kinds and a kind that is no schema", () => {
    expect(refusal(artefact({ "front-door": kind({ type: "string" }), front_door: kind({ type: "string" }) }))).toBe(
      "The kinds `front-door` and `front_door` would both be written as `FrontDoorEnvelope`.",
    );
    expect(refusal({ api_version: 1, kinds: {} })).toBe("The vendored contract describes no kinds.");
    expect(refusal(artefact({ pull: 3 }))).toContain("The kind `pull` is 3");
  });

  it("refuses a constraint beside a reference, naming where, and accepts a described one", () => {
    const beside = { type: "object", properties: { v: { $ref: "#/$defs/Code", type: "string" } } };
    expect(refusal(artefact({ a: kind({ $ref: "#/$defs/R" }, { R: beside, Code: CODE }) }))).toContain(
      "/a/$defs/R/properties/v (type)",
    );
    const described = { type: "object", properties: { v: { $ref: "#/$defs/Code", description: "d" } } };
    expect(sources(artefact({ a: kind({ $ref: "#/$defs/R" }, { R: described, Code: CODE }) })).has("kinds/a.ts")).toBe(true);
  });

  it("refuses a version it does not implement, naming both, and writes nothing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const root = await held(artefact(PULL, { version: 2 }));
    expect(await run(root)).toBe(1);
    expect(existsSync(join(root, OUT))).toBe(false);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("api_version 2, and this package implements 1"));
  });

  it.each([
    ["the envelope of `a` property `data` refers to other.json#/x, outside the definitions beside it.", kind({ $ref: "other.json#/x" })],
    ["the envelope of `a` property `data` refers to #/$defs/Missing, which `a` does not define.", kind({ $ref: "#/$defs/Missing" })],
    [
      "`Problem`, defined by `a` property `code` refers to #/$defs/Code, which `a` does not define.",
      kind({ $ref: "#/$defs/Problem" }, { Problem: PROBLEM }),
    ],
  ])("refuses a reference it cannot resolve, naming it and where it sits, and writes nothing: %s", async (said, schema) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const root = await held(artefact({ a: schema }));
    expect(await run(root)).toBe(1);
    expect(existsSync(join(root, OUT))).toBe(false);
    expect(console.error).toHaveBeenCalledWith(`contract:generate: refused, and nothing was written. ${said}`);
  });

  it("refuses an artefact it cannot read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const root = await held(artefact(PULL));
    await writeFile(join(root, "contract", "web-api.contract.json"), "[");
    expect(await run(root)).toBe(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("could not be read"));
  });
});

describe("generating the refusal codes", () => {
  const listed = (name, status, description = "Raised when the request was refused.") => ({ name, status, description });

  it("writes an empty list from a contract that lists none", () => {
    const source = sources(artefact(PULL)).get("refusals.ts");
    expect(source).toContain("export type RefusalCode = never;");
    expect(source).toContain("> = {};");
  });

  it("writes every code the contract lists, with what it says of each, and a guard knowing only those", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const refusals = {
      "ADMIT-6": listed("NOT_YOURS", 403, "Raised when the account may not ask for this."),
      "ADMIT-4": listed("NOT_ADMITTED", 403),
      "READ-1": listed("NOT_HERE", 404),
    };
    const { root, generated } = await imported(artefact(PULL, { refusals }));
    roots.push(root);
    expect(Object.keys(generated.REFUSAL_CODES)).toEqual(["ADMIT-4", "ADMIT-6", "READ-1"]);
    expect(generated.REFUSAL_CODES["ADMIT-6"]).toEqual(refusals["ADMIT-6"]);
    expect(generated.isRefusalCode("ADMIT-4")).toBe(true);
    expect(generated.isRefusalCode("ADMIT-5")).toBe(false);
    expect(generated.isRefusalCode("toString")).toBe(false);
    expect(generated.CONTRACT_API_VERSION).toBe(1);
    expect(await written(root, "refusals.ts")).toContain('export type RefusalCode = "ADMIT-4" | "ADMIT-6" | "READ-1";');
    expect(await written(root, "index.ts")).toContain("// Source: v1.0.0  ·  api_version 1");
  });

  it.each([
    ["a list", []],
    ["a string", "ADMIT-4"],
    ["null", null],
  ])("refuses refusals that are %s", (_what, refusals) => {
    expect(refusal(artefact(PULL, { refusals }))).toContain("keyed by code");
  });

  it.each([
    ["a refusal that is not an object", { "ADMIT-4": "NOT_ADMITTED" }, "ADMIT-4: not an object"],
    ["a name not in SCREAMING_SNAKE", { "ADMIT-4": listed("notAdmitted", 403) }, "ADMIT-4: name"],
    ["no name", { "ADMIT-4": { status: 403, description: "Raised." } }, "ADMIT-4: name"],
    ["a status that is a success", { "ADMIT-4": listed("NOT_ADMITTED", 200) }, "ADMIT-4: status"],
    ["a status that is not a number", { "ADMIT-4": listed("NOT_ADMITTED", "403") }, "ADMIT-4: status"],
    ["a status past any refusal", { "ADMIT-4": listed("NOT_ADMITTED", 600) }, "ADMIT-4: status"],
    ["an empty description", { "ADMIT-4": listed("NOT_ADMITTED", 403, " ") }, "ADMIT-4: description"],
    ["an empty code", { "": listed("NOT_ADMITTED", 403) }, '"": not a code'],
    ["a code with no number", { ADMIT: listed("NOT_ADMITTED", 403) }, '"ADMIT": not a code'],
    [
      "a code that would set a prototype",
      JSON.parse('{"__proto__": {"name": "NOT_ADMITTED", "status": 403, "description": "x"}}'),
      '"__proto__": not a code',
    ],
  ])("refuses %s, naming the code", (_what, refusals, named) => {
    expect(refusal(artefact(PULL, { refusals }))).toContain(named);
  });

  it("names every refusal that is wrong, and one name under two codes", () => {
    const said = refusal(artefact(PULL, { refusals: { "ADMIT-4": listed("admitted", 403), "ADMIT-5": listed("ELSEWHERE", 99) } }));
    expect(said).toContain("ADMIT-4: name");
    expect(said).toContain("ADMIT-5: status");
    expect(
      refusal(artefact(PULL, { refusals: { "ADMIT-4": listed("NOT_ADMITTED", 403), "ADMIT-5": listed("NOT_ADMITTED", 403) } })),
    ).toContain("ADMIT-5: name NOT_ADMITTED is also the name of ADMIT-4");
  });

  it("says where it came from when the artefact names no revision", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const root = await held(artefact(PULL));
    await rm(join(root, "contract", "VERSION"));
    expect(await run(root)).toBe(0);
    expect(await written(root, "index.ts")).toContain("// Source: unknown");
  });
});

describe("generating the actions a key may call", () => {
  const callable = (action, disturbs, rehearsal, idempotent = false) => ({ action, disturbs, rehearsal, idempotent });

  it("writes an empty list from a contract that lists none", () => {
    const source = sources(artefact(PULL)).get("key-callable.ts");
    expect(source).toContain("export type KeyCallableAction = never;");
    expect(source).toContain("export const KEY_CALLABLE: Readonly<Record<KeyCallableAction, KeyCallable>> = {};");
  });

  it("writes every action in the order the contract lists them, with what it says of each, and a guard knowing only those", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const keyCallable = [callable("restart", true, true), callable("diagnose", true, false), callable("downloads-pause", false, true, true)];
    const { root, generated } = await imported(artefact(PULL, { keyCallable }));
    roots.push(root);
    expect(Object.keys(generated.KEY_CALLABLE)).toEqual(["restart", "diagnose", "downloads-pause"]);
    expect(generated.KEY_CALLABLE.diagnose).toEqual({ disturbs: true, rehearsal: false, idempotent: false });
    expect(generated.KEY_CALLABLE["downloads-pause"]).toEqual({ disturbs: false, rehearsal: true, idempotent: true });
    expect(generated.isKeyCallable("restart")).toBe(true);
    expect(generated.isKeyCallable("uninstall")).toBe(false);
    expect(generated.isKeyCallable("toString")).toBe(false);
    expect(await written(root, "key-callable.ts")).toContain(
      'export type KeyCallableAction = "restart" | "diagnose" | "downloads-pause";',
    );
  });

  it.each([
    ["an object", {}],
    ["a string", "restart"],
    ["null", null],
  ])("refuses a key_callable that is %s", (_what, keyCallable) => {
    expect(refusal(artefact(PULL, { keyCallable }))).toContain("a list of actions");
  });

  it.each([
    ["an entry that is not an object", ["restart"], "entry 0: not an object"],
    ["an action that is not a name", [callable("Restart", true, true)], "entry 0: action"],
    ["no action", [{ disturbs: true, rehearsal: true, idempotent: false }], "entry 0: action"],
    ["an idempotent that is not true or false", [{ action: "restart", disturbs: true, rehearsal: true, idempotent: "no" }], "entry 0: idempotent"],
    ["no word on whether it is safe to repeat", [{ action: "restart", disturbs: true, rehearsal: true }], "entry 0: idempotent"],
    ["a disturbs that is not true or false", [callable("restart", "yes", true)], "entry 0: disturbs"],
    ["a rehearsal that is not true or false", [callable("restart", true, 1)], "entry 0: rehearsal"],
    ["one action listed twice", [callable("restart", true, true), callable("restart", true, false)], "restart: listed twice"],
  ])("refuses %s, naming the entry", (_what, keyCallable, named) => {
    expect(refusal(artefact(PULL, { keyCallable }))).toContain(named);
  });

  it("refuses a definition taking a name this generator writes for the actions a key may call", () => {
    expect(refusal(artefact({ pull: kind({ $ref: "#/$defs/KeyCallable" }, { KeyCallable: { type: "string" } }) }))).toContain(
      "what the contract says of one action a key may call",
    );
  });
});

describe("generating the reads", () => {
  const read = (path, kinds, parameters = [], file = false) => ({ path, parameters, kinds, file });
  const repeating = (name) => ({ name, repeatable: true });
  const once = (name) => ({ name, repeatable: false });

  it("writes empty tables from a contract that lists no reads", () => {
    const source = sources(artefact(PULL)).get("reads.ts");
    expect(source).toContain("export const READS = {} as const;");
    expect(source).toContain("export const FILES = {} as const;");
  });

  it("writes each read under the name it goes by, with what it takes and answers with", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const reads = [
      read("/api/pull", ["pull"], [repeating("form"), once("most")]),
      read("/api/front-door", ["pull"]),
      read("/api/bundle/{name}", [], [], true),
    ];
    const { root, generated } = await imported(artefact(PULL, { reads }));
    roots.push(root);
    expect(Object.keys(generated.READS)).toEqual(["pull", "front-door"]);
    expect(generated.READS.pull).toEqual({ path: "/api/pull", parameters: [repeating("form"), once("most")], kinds: ["pull"] });
    expect(generated.FILES).toEqual({ bundle: { path: "/api/bundle/{name}" } });
    const source = await written(root, "reads.ts");
    expect(source).toContain('"pull": { form?: Scalar | readonly Scalar[] | undefined; most?: Scalar | undefined };');
    expect(source).toContain('"front-door": Record<string, never>;');
  });

  it.each([
    ["an object", {}],
    ["a string", "/api/pull"],
  ])("refuses reads that are %s", (_what, reads) => {
    expect(refusal(artefact(PULL, { reads }))).toContain("they are a list");
  });

  it.each([
    ["a read that is not an object", ["/api/pull"], "read 0: not an object"],
    ["a path outside /api", [read("/pull", ["pull"])], "/pull: path"],
    ["no path", [{ parameters: [], kinds: ["pull"], file: false }], "read 0: path"],
    ["a kind the contract does not describe", [read("/api/pull", ["push"])], "/api/pull: kinds"],
    ["kinds that are not a list", [read("/api/pull", "pull")], "/api/pull: kinds"],
    ["a file with kinds", [read("/api/pull", ["pull"], [], true)], "answers with a file or with kinds"],
    ["no file and no kinds", [read("/api/pull", [])], "answers with a file or with kinds"],
    ["a file that is not true or false", [read("/api/pull", ["pull"], [], "no")], "/api/pull: file"],
    ["parameters that are not a list", [read("/api/pull", ["pull"], {})], "parameters {} are not a list"],
    ["a parameter with no name", [read("/api/pull", ["pull"], [{ repeatable: true }])], "is not a name and whether it repeats"],
    ["a parameter that does not say whether it repeats", [read("/api/pull", ["pull"], [{ name: "form" }])], "is not a name and whether it repeats"],
    ["a parameter listed twice", [read("/api/pull", ["pull"], [once("form"), repeating("form")])], "parameter form is listed twice"],
    ["two reads going by one name", [read("/api/pull", ["pull"]), read("/api/pull/{name}", ["pull"])], "goes by pull, as /api/pull does"],
  ])("refuses %s, naming the read", (_what, reads, named) => {
    expect(refusal(artefact(PULL, { reads }))).toContain(named);
  });
});

