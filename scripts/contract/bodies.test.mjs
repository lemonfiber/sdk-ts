/**
 * Generating the body each route takes, the routes that take one, and the
 * shapes a body is the first to need.
 */
import { afterEach, describe, expect, it } from "vitest";
import { CODE, artefact, kind, refusal, removed, sources, tree } from "./fixtures.mjs";
import { generate } from "./index.mjs";
import { readArtefact } from "./vendored.mjs";

const DIALECT = "https://json-schema.org/draft/2020-12/schema";

const roots = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
});

const PROTOCOLS = {
  description: "Which download protocols the operator has accounts for.",
  type: "object",
  properties: { torrent: { type: "boolean" }, usenet: { type: "boolean" } },
  required: ["torrent", "usenet"],
};

const CHOICE = {
  oneOf: [
    { type: "string", const: "resume" },
    { type: "string", const: "start-over" },
  ],
};

/** An answer tagged by the question it belongs to, as the core writes one. */
const ANSWER = {
  $schema: DIALECT,
  title: "Answer",
  description: "One answer, tagged by the step it belongs to.",
  oneOf: [
    {
      type: "object",
      properties: { protocols: { $ref: "#/$defs/Protocols" } },
      additionalProperties: false,
      required: ["protocols"],
    },
    {
      type: "object",
      properties: {
        "service-user": {
          type: ["array", "null"],
          minItems: 2,
          maxItems: 2,
          prefixItems: [{ type: "integer" }, { type: "integer" }],
        },
      },
      additionalProperties: false,
      required: ["service-user"],
    },
    { type: "object", properties: { autostart: { type: "boolean" } }, additionalProperties: false, required: ["autostart"] },
  ],
  $defs: { Protocols: PROTOCOLS },
};

const RECOVERY = {
  $schema: DIALECT,
  title: "SetupRecovery",
  type: "object",
  properties: { choice: { description: "Which way out.", $ref: "#/$defs/Choice" } },
  additionalProperties: false,
  required: ["choice"],
  $defs: { Choice: CHOICE },
};

/** Two bodies, one sharing a definition with a kind. */
const WHOLE = artefact(
  {
    setup: { $schema: DIALECT, ...kind({ $ref: "#/$defs/Protocols" }, { Protocols: PROTOCOLS }) },
    pull: { $schema: DIALECT, ...kind({ type: "string" }) },
  },
  { bodies: { "/api/setup/answer": ANSWER, "/api/setup/recover": RECOVERY } },
);

describe("writing each route's body", () => {
  const written = sources(WHOLE);

  it("writes a body under its route's name, in a module of its own", () => {
    const answer = written.get("bodies/setup-answer.ts");
    expect(answer).toContain("// The body `/api/setup/answer` takes, and the shapes only it carries.");
    expect(answer).toContain("/** One answer, tagged by the step it belongs to. */");
    expect(answer).toContain("export type SetupAnswerBody = SetupAnswerBodyProtocols | SetupAnswerBodyServiceUser | SetupAnswerBodyAutostart;");
    expect(written.get("bodies/setup-recover.ts")).toContain('export type Choice = "resume" | "start-over";');
    expect(written.get("bodies/setup-recover.ts")).toContain("  choice: Choice;");
  });

  it("writes a shape a body and a kind both carry once, beside both", () => {
    expect(written.get("shared/body-setup-answer__setup.ts")).toContain("export interface Protocols {");
    expect(written.get("bodies/setup-answer.ts")).toContain(
      'import type { Protocols } from "../shared/body-setup-answer__setup.js";',
    );
    expect(written.get("kinds/setup.ts")).not.toContain("export interface Protocols");
  });

  it("names each variant holding one field for that field, and reads a list of fixed places as a tuple", () => {
    const answer = written.get("bodies/setup-answer.ts");
    expect(answer).toContain("export interface SetupAnswerBodyProtocols {\n  protocols: Protocols;\n}");
    expect(answer).toContain('  "service-user": [number, number] | null;');
  });

  it("lists every route that takes a body, and the body each takes", () => {
    const routes = written.get("body-routes.ts");
    expect(routes).toContain('import type { SetupAnswerBody, SetupRecoverBody } from "./bodies.js";');
    expect(routes).toContain('export type BodyRoute = "/api/setup/answer" | "/api/setup/recover";');
    expect(routes).toContain('  "/api/setup/answer": SetupAnswerBody;');
    expect(written.get("bodies.ts")).toContain('export * from "./bodies/setup-answer.js";');
    expect(written.get("index.ts")).toContain('export * from "./bodies.js";\nexport * from "./body-routes.js";');
  });

  it("writes an empty table, and no bodies at all, from a contract describing none", () => {
    const none = sources(artefact({ pull: kind({ type: "string" }) }));
    expect(none.get("body-routes.ts")).toContain("export type BodyRoute = never;");
    expect(none.get("body-routes.ts")).toContain("export type BodyOf = Record<BodyRoute, never>;");
    expect(none.has("bodies.ts")).toBe(false);
    expect(none.get("index.ts")).not.toContain("./bodies.js");
  });

  it("names variants for their place where two hold the same one field, or the field names nothing", () => {
    const twice = {
      title: "Twice",
      oneOf: [
        { type: "object", properties: { a: { type: "integer" } }, required: ["a"] },
        { type: "object", properties: { a: { type: "string" } }, required: ["a"] },
        { type: "object", properties: { b: { type: "string" } } },
        { type: "object", properties: { "--": { type: "string" } }, required: ["--"] },
      ],
    };
    const source = sources(artefact({ pull: kind({ type: "string" }) }, { bodies: { "/api/twice": twice } })).get("bodies/twice.ts");
    expect(source).toContain(
      "export type TwiceBody = TwiceBodyVariant1 | TwiceBodyVariant2 | TwiceBodyVariant3 | TwiceBodyVariant4;",
    );
  });

  it("reads bodies from the directory exactly as from the single file", async () => {
    const single = await tree(WHOLE);
    const split = await tree(WHOLE, { layout: "directory" });
    roots.push(single, split);
    const read = async (root) => {
      const { artefact: whole, stamp } = await readArtefact(root);
      return generate(whole, stamp);
    };
    expect(await read(split)).toEqual(await read(single));
  });
});

describe("refusing a body that cannot be written one way", () => {
  const pull = { pull: kind({ type: "string" }) };
  const plain = { type: "object", properties: { name: { type: "string" } } };

  it("refuses bodies that are not keyed by route, a route outside the API and a body that is no schema", () => {
    expect(refusal(artefact(pull, { bodies: [] }))).toBe(
      "The vendored contract's bodies are [], and they are an object keyed by route.",
    );
    expect(refusal(artefact(pull, { bodies: { "/setup": plain } }))).toBe('The body route "/setup" is not a path under /api/.');
    expect(refusal(artefact(pull, { bodies: { "/api/setup": 3 } }))).toBe(
      "The body of `/api/setup` is 3, which is not a schema.",
    );
  });

  it("refuses two routes written as one name, and a body named as one of its own definitions", () => {
    expect(refusal(artefact(pull, { bodies: { "/api/setup/answer": plain, "/api/setup-answer": plain } }))).toBe(
      "The bodies of `/api/setup-answer` and `/api/setup/answer` would both be written as `SetupAnswerBody`.",
    );
    const own = { ...plain, $defs: { KeysBody: CODE } };
    expect(refusal(artefact(pull, { bodies: { "/api/keys": own } }))).toBe(
      "The body of `/api/keys` is written as `KeysBody`, which also names one of its definitions.",
    );
  });

  it("refuses a constraint beside a reference in a body, and a tuple of no fixed length", () => {
    const beside = { type: "object", properties: { v: { $ref: "#/$defs/Code", type: "string" } }, $defs: { Code: CODE } };
    expect(refusal(artefact(pull, { bodies: { "/api/v": beside } }))).toContain("//api/v/properties/v (type)");
    const open = { type: "object", properties: { at: { type: "array", minItems: 1, prefixItems: [{ type: "integer" }] } } };
    expect(refusal(artefact(pull, { bodies: { "/api/at": open } }))).toContain(
      "is an array of places whose length is not fixed at the places it describes.",
    );
  });

  it("refuses a kind and a body whose shapes would be written in one module", () => {
    const other = { type: "integer" };
    const kinds = {
      "body-keys": kind({ $ref: "#/$defs/Code" }, { Code: CODE }),
      wizard: kind({ $ref: "#/$defs/Code" }, { Code: CODE, Other: other }),
    };
    const bodies = { "/api/keys": { type: "object", properties: { o: { $ref: "#/$defs/Other" } }, $defs: { Other: other } } };
    expect(refusal(artefact(kinds, { bodies }))).toContain("would both be written in `shared/body-keys__wizard`.");
  });
});
