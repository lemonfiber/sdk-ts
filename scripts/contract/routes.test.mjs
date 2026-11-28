/**
 * Generating every route the web API serves, and refusing a route the
 * generator cannot write.
 */
import { describe, expect, it } from "vitest";
import { artefact, kind, refusal, sources } from "./fixtures.mjs";

const PULL = { pull: kind({ type: "string" }) };

const routed = (method, path, { body = false, kinds = ["pull"] } = {}) => ({ method, path, body, kinds });

describe("writing every route", () => {
  it("lists each route in the contract's order with its method, path, body and kinds", () => {
    const listed = [routed("DELETE", "/api/keys/{name}", { body: true }), routed("GET", "/api/bundle/{name}", { kinds: [] })];
    const routes = sources({ ...artefact(PULL), routes: listed }).get("routes.ts");
    expect(routes).toContain('  readonly method: "GET" | "POST" | "DELETE";');
    expect(routes).toContain(
      'export const ROUTES: readonly Route[] = [\n  { method: "DELETE", path: "/api/keys/{name}", body: true, kinds: ["pull"] },\n  { method: "GET", path: "/api/bundle/{name}", body: false, kinds: [] },\n];',
    );
  });

  it("lists none from a contract older than the list", () => {
    expect(sources(artefact(PULL)).get("routes.ts")).toContain("export const ROUTES: readonly Route[] = [];");
  });
});

describe("refusing a route that cannot be written", () => {
  it.each([
    [{}, "The vendored contract's routes are {}, and they are a list."],
    [[3], "route 0: not an object"],
    [[routed("PATCH", "/api/keys")], 'route 0: method "PATCH" is not one of GET, POST, DELETE'],
    [[routed("GET", "/keys")], 'route 0: path "/keys" is not one under /api'],
    [[routed("GET", "/api/keys", { body: "no" })], 'route 0: body "no" is not true or false'],
    [[routed("GET", "/api/keys", { kinds: "pull" })], 'route 0: kinds "pull" is not a list of kinds'],
    [[routed("GET", "/api/keys", { kinds: ["start"] })], "route 0: answers with start, which the contract describes no kind as"],
    [[{ ...routed("GET", "/api/keys"), more: 1 }], "route 0: carries more, which this generator does not read"],
    [[routed("GET", "/api/keys"), routed("GET", "/api/keys")], "GET /api/keys is listed twice"],
  ])("refuses %j", (routes, said) => {
    expect(refusal({ ...artefact(PULL), routes })).toContain(said);
  });
});
