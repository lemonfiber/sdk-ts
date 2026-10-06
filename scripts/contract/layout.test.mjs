/**
 * Which module each generated type is written in, and the cap no module outgrows.
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CODE, artefact, kind, refusal, removed, sources, tree } from "./fixtures.mjs";
import { OUT, run } from "./index.mjs";
import { linesIn } from "../line-cap.mjs";

const SHARED = {
  description: "Carried by more than one kind.",
  type: "object",
  properties: { code: { $ref: "#/$defs/Code" } },
  required: ["code"],
};
const OWN = { description: "Carried by one kind.", type: "object", properties: { at: { type: "integer" } } };

/** An object schema whose description runs to many lines, naming `refers` as its fields. */
const long = (name, ...refers) => ({
  description: Array.from({ length: 12 }, (_, line) => `${name} says one more thing on line ${String(line)}.`).join("\n"),
  type: "object",
  properties: Object.fromEntries(refers.map((other) => [other.toLowerCase(), { $ref: `#/$defs/${other}` }])),
});

const roots = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
  vi.restoreAllMocks();
});

describe("placing each type", () => {
  it("writes a kind's own types in its module and shared ones in a module of their carriers", () => {
    const files = sources(
      artefact({
        a: kind({ $ref: "#/$defs/Shared" }, { Shared: SHARED, Code: CODE, Own: OWN }),
        b: kind({ $ref: "#/$defs/Shared" }, { Shared: SHARED, Code: CODE }),
      }),
    );
    expect(files.get("kinds/a.ts")).toContain("export interface AEnvelope {");
    expect(files.get("kinds/a.ts")).toContain("export interface Own {");
    expect(files.get("kinds/a.ts")).toContain('import type { Shared } from "../shared/a__b.js";');
    expect(files.get("shared/a__b.ts")).toContain("// The shapes `a` and `b` both carry.");
    expect(files.get("kinds.ts")).toContain('export * from "./kinds/a.js";');
    expect(files.get("index.ts")).toContain('export * from "./shared.js";');
    expect(files.get("envelope.ts")).toContain('import type { AEnvelope, BEnvelope } from "./kinds.js";');
    expect(files.get("envelope.ts")).toContain('export type Kind = "a" | "b";');
  });

  it("writes the types three kinds carry in a module naming all three, and no shared index where nothing is shared", () => {
    const files = sources(artefact(Object.fromEntries(["a", "b", "c"].map((one) => [one, kind({ $ref: "#/$defs/Code" }, { Code: CODE })]))));
    expect(files.get("shared/a__b__c.ts")).toContain("// The shapes `a`, `b` and `c` all carry.");
    expect(sources(artefact({ pull: kind({ type: "string" }) })).has("shared.ts")).toBe(false);
  });
});

describe("holding every module to the cap", () => {
  it("writes a module over the cap as parts beside it, each importing only from parts before it", () => {
    const definitions = {
      First: long("First"),
      Second: long("Second", "First"),
      Third: long("Third", "Second"),
      Fourth: long("Fourth", "Third", "First"),
    };
    const files = sources(artefact({ big: kind({ $ref: "#/$defs/Fourth" }, definitions) }), { cap: 70 });
    const parts = [...files.keys()].filter((file) => file.startsWith("kinds/big/")).sort();
    expect(parts.length).toBeGreaterThan(1);
    for (const file of files.keys()) expect(linesIn(files.get(file))).toBeLessThanOrEqual(70);
    expect(files.get("kinds/big.ts")).toContain("gathered from its parts.");
    expect(files.get("kinds/big.ts")).toContain('export * from "./big/first.js";');
    const fourth = parts.find((file) => files.get(file).includes("export interface Fourth"));
    expect(files.get(fourth)).toMatch(/import type \{ [^}]*Third[^}]* \} from "\.\/\w+\.js";|export interface Third/);
  });

  it("writes types that fit together in one part", () => {
    const small = { type: "object", properties: { n: { type: "integer" } } };
    const files = sources(artefact({ big: kind({ $ref: "#/$defs/Huge" }, { Huge: long("Huge"), Little: small, Tiny: small }) }), { cap: 30 });
    const holding = [...files.entries()].filter(([file]) => file.startsWith("kinds/big/"));
    expect(holding.length).toBeGreaterThan(1);
    const little = holding.filter(([, source]) => source.includes("export interface Little"));
    const tiny = holding.filter(([, source]) => source.includes("export interface Tiny"));
    expect(little).toEqual(tiny);
  });

  it("refuses types naming one another past the cap, naming them and their kind", () => {
    const said = refusal(artefact({ big: kind({ $ref: "#/$defs/Ping" }, { Ping: long("Ping", "Pong"), Pong: long("Pong", "Ping") }) }), { cap: 30 });
    expect(said).toMatch(/^`Ping` and `Pong`, which only `big` carries, name one another and would hold \d+ lines as one module, over the 30 a module may hold\.$/);
  });

  it("refuses one type past the cap, naming it and its kind", () => {
    expect(refusal(artefact({ big: kind({ $ref: "#/$defs/Ping" }, { Ping: long("Ping") }) }), { cap: 12 })).toMatch(
      /^`Ping`, which only `big` carries, would hold \d+ lines/,
    );
  });

  it("refuses a list past the cap, naming its module", () => {
    const refusals = Object.fromEntries(
      Array.from({ length: 40 }, (_, at) => [`READ-${String(at)}`, { name: `NUMBER_${String(at)}`, status: 404, description: "Raised." }]),
    );
    expect(refusal(artefact({ pull: kind({ type: "string" }) }, { refusals }), { cap: 40 })).toMatch(
      /^src\/generated\/refusals\.ts would hold \d+ lines, over the 40 a module may hold\.$/,
    );
  });

  it("refuses two parts written under one name", () => {
    expect(refusal(artefact({ a: kind({ $ref: "#/$defs/AB" }, { AB: long("AB"), Ab: long("Ab") }) }), { cap: 24 })).toBe(
      "Two parts of `kinds/a` would both be written as `kinds/a/ab`.",
    );
  });
});

describe("refusing a layout that would not import one way", () => {
  it("refuses a type naming one some of its carriers lack", () => {
    expect(
      refusal(
        artefact({
          a: kind({ $ref: "#/$defs/Shared" }, { Shared: SHARED, Code: CODE }),
          b: kind({ $ref: "#/$defs/Shared" }, { Shared: SHARED }),
        }),
      ),
    ).toBe("`Shared`, which `a` and `b` both carry, names `Code`, which `b` does not define.");
  });
});

describe("writing the tree", () => {
  it("replaces what an earlier generation wrote", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const root = await tree(artefact({ pull: kind({ type: "string" }) }));
    roots.push(root);
    await mkdir(join(root, OUT, "kinds"), { recursive: true });
    await writeFile(join(root, OUT, "kinds", "gone.ts"), "");
    expect(await run(root)).toBe(0);
    expect(existsSync(join(root, OUT, "kinds", "gone.ts"))).toBe(false);
    expect(existsSync(join(root, OUT, "kinds", "pull.ts"))).toBe(true);
  });
});
