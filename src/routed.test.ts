import { describe, expect, it } from "vitest";
import { isRouted } from "./routed.setup.js";

describe("a request held to the routes the contract lists", () => {
  it("is routed at a listed method and a path filling each named segment once", () => {
    const here = "http://127.0.0.1:7777";
    expect(isRouted("DELETE", `${here}/api/keys/ha`)).toBe(true);
    expect(isRouted("GET", `${here}/api/status?form=a`)).toBe(true);
    expect(isRouted("POST", `${here}/api/keys/ha`)).toBe(false);
    expect(isRouted("DELETE", `${here}/api/keys`)).toBe(false);
    expect(isRouted("DELETE", `${here}/api/keys/ha/more`)).toBe(false);
  });
});
