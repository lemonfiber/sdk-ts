/**
 * Generating every action the web API takes, and what the contract says of each.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { artefact, imported, kind, laidOut, refusal, removed, sources, tree } from "./fixtures.mjs";
import { generate } from "./index.mjs";
import { readArtefact } from "./vendored.mjs";

const roots = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
  vi.restoreAllMocks();
});

const PULL = { pull: kind({ type: "string" }) };

const LIST = { type: "array", items: { type: "string" }, default: [] };

/** One action as the core describes it: its arguments by name, those carrying the yes, and whether it rehearses. */
const described = (action, names, consent, rehearsal) => ({
  action,
  arguments: names.map((name) => ({ name, type: LIST })),
  consent,
  rehearsal,
});

const ACTIONS = {
  restart: described("restart", ["forms", "services", "offer"], ["offer"], true),
  diagnose: described("diagnose", ["only", "disruptive"], [], false),
  "downloads-pause": described("downloads-pause", ["offer"], ["offer"], true),
};

/** An action whose arguments reach a definition, and one with no default. */
const UNDO = {
  action: "undo",
  arguments: [
    { name: "at", type: { anyOf: [{ $ref: "#/$defs/Instant" }, { type: "null" }], default: null } },
    { name: "why", type: { type: "string", description: "Why it is undone." } },
  ],
  consent: [],
  rehearsal: true,
  $defs: { Instant: { description: "A moment.", type: "integer", minimum: 0 } },
};

describe("generating the actions the web API takes", () => {
  it("writes an empty table from a contract that describes none", () => {
    const source = sources(artefact(PULL)).get("actions.ts");
    expect(source).toContain("export type ActionName = never;");
    expect(source).toContain("export const ACTIONS: Readonly<Record<ActionName, ActionDescribed>> = {};");
  });

  it("writes every action by name, with its arguments in the contract's order, its consent and its rehearsal, and a guard knowing only those", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { root, generated } = await imported(artefact(PULL, { actions: ACTIONS }));
    roots.push(root);
    expect(Object.keys(generated.ACTIONS)).toEqual(["diagnose", "downloads-pause", "restart"]);
    expect(generated.ACTIONS.restart).toEqual({ arguments: ["forms", "services", "offer"], consent: ["offer"], rehearsal: true });
    expect(generated.ACTIONS.diagnose).toEqual({ arguments: ["only", "disruptive"], consent: [], rehearsal: false });
    expect(generated.isActionName("downloads-pause")).toBe(true);
    expect(generated.isActionName("uninstall")).toBe(false);
    expect(generated.isActionName("toString")).toBe(false);
  });

  it("writes each action's body: an argument with no default required, `dry_run` where it rehearses, the definitions it reaches carried", () => {
    const files = sources(artefact(PULL, { actions: { ...ACTIONS, undo: UNDO } }));
    const body = files.get("bodies/actions-undo.ts");
    expect(body).toContain("/** What the `undo` action is posted with. */\nexport interface ActionsUndoBody {");
    expect(body).toContain("  at?: Instant | null;");
    expect(body).toContain("  dry_run?: boolean;");
    expect(body).toContain("  /** Why it is undone. */\n  why: string;");
    expect(body).toContain("export type Instant = number;");
    expect(files.get("bodies/actions-diagnose.ts")).not.toContain("dry_run");
    expect(files.get("actions.ts")).toContain('  "undo": ActionsUndoBody;');
    expect(files.get("body-routes.ts")).toContain('"/api/actions/undo": ActionsUndoBody;');
  });

  it("writes an empty map of arguments from a contract that describes no action", () => {
    expect(sources(artefact(PULL)).get("actions.ts")).toContain("export type ArgumentsOf = Record<ActionName, never>;");
  });

  it("refuses a body the contract describes for the route an action is posted to", () => {
    const bodies = { "/api/actions/restart": { type: "object", properties: { forms: { type: "string" } } } };
    expect(refusal(artefact(PULL, { actions: ACTIONS, bodies }))).toContain(
      "describes a body for /api/actions/restart, which the action `restart` is posted with",
    );
  });

  it("reads each action from its own file in the directory layout, with the definitions its arguments reach", async () => {
    const whole = artefact(PULL, { actions: { ...ACTIONS, undo: UNDO } });
    const root = await tree(whole, { layout: "directory" });
    roots.push(root);
    const { artefact: read } = await readArtefact(root);
    expect(read.actions.undo.$defs).toEqual(UNDO.$defs);
    expect(generate(read, "v1.0.0")).toEqual(generate(whole, "v1.0.0"));
  });

  it("refuses an action whose arguments reach definitions written in two dialects, naming both", async () => {
    const root = await tree(artefact(PULL), { layout: "directory" });
    roots.push(root);
    const at = (definition) => ({ name: definition.toLowerCase(), type: { $ref: `../defs/${definition}.json` } });
    await laidOut(
      root,
      new Map([
        ["index.json", { api_version: 1, kinds: {}, actions: { undo: "actions/undo.json" } }],
        ["actions/undo.json", { action: "undo", arguments: [at("Early"), at("Late")], consent: [], rehearsal: false }],
        ["defs/Early.json", { $schema: "https://json-schema.org/draft/2020-12/schema", type: "integer" }],
        ["defs/Late.json", { $schema: "http://json-schema.org/draft-07/schema#", type: "integer" }],
      ]),
    );
    let said = "";
    await readArtefact(root).catch((error_) => {
      said = error_.message;
    });
    expect(said).toContain("`undo`, which reaches it, reaches another in");
  });

  it.each([
    ["a list", []],
    ["a string", "restart"],
    ["null", null],
  ])("refuses actions that are %s", (_what, actions) => {
    expect(refusal(artefact(PULL, { actions }))).toContain("a map from each action's name to the action");
  });

  it("refuses actions the directory's index names as no map of files", async () => {
    const root = await tree(artefact(PULL, { actions: [] }), { layout: "directory" });
    roots.push(root);
    const { artefact: read } = await readArtefact(root);
    expect(refusal(read)).toContain("a map from each action's name to the action");
  });

  it.each([
    ["a name that is not an action's", { Restart: described("Restart", [], [], true) }, '"Restart": not an action\'s name'],
    ["an entry that is not an object", { restart: "restart" }, "restart: not an object"],
    ["an entry describing another action", { restart: described("down", [], [], true) }, 'restart: describes itself as "down"'],
    ["a rehearsal that is not true or false", { restart: { ...ACTIONS.restart, rehearsal: "yes" } }, "restart: rehearsal"],
    ["arguments that are not a list", { restart: { ...ACTIONS.restart, arguments: {} } }, "restart: arguments {} is not a list"],
    ["an argument that is not an object", { restart: { ...ACTIONS.restart, arguments: ["forms"] } }, "restart: argument 0 is not named"],
    ["an argument with no name", { restart: { ...ACTIONS.restart, arguments: [{ type: LIST }] } }, "restart: argument 0 is not named"],
    ["an argument named as no argument is", { restart: described("restart", ["Forms"], [], true) }, "restart: argument 0 is not named"],
    ["one argument listed twice", { restart: described("restart", ["forms", "forms"], [], true) }, "restart: argument forms is listed twice"],
    ["an argument with no schema for its type", { restart: { ...ACTIONS.restart, arguments: [{ name: "forms" }] } }, "restart: argument 0 has no schema"],
    ["the rehearsal listed as an argument", { restart: described("restart", ["dry_run"], [], true) }, "restart: argument dry_run is the rehearsal"],
    ["a consent that is not a list", { restart: { ...ACTIONS.restart, consent: "offer" } }, 'restart: consent "offer" is not a list'],
    ["a consent naming no argument", { restart: described("restart", ["forms"], ["offer"], true) }, 'restart: consent names "offer"'],
  ])("refuses %s, naming the action", (_what, actions, named) => {
    expect(refusal(artefact(PULL, { actions }))).toContain(named);
  });

  it("names every action that is wrong", () => {
    const said = refusal(
      artefact(PULL, { actions: { restart: { ...ACTIONS.restart, rehearsal: 1 }, down: described("down", ["Wait"], [], true) } }),
    );
    expect(said).toContain("down: argument 0");
    expect(said).toContain("restart: rehearsal");
  });
});
