import { describe, expect, it } from "vitest";
import { ACTIONS, isActionName } from "./index.js";

describe("the actions the web API takes", () => {
  it("knows every action the contract describes, with what it says of each", () => {
    for (const action of Object.keys(ACTIONS)) expect(isActionName(action)).toBe(true);
    expect(ACTIONS["downloads-pause"]).toEqual({
      arguments: ["offer"],
      consent: ["offer"],
      rehearsal: true,
    });
  });

  it("knows no other", () => {
    expect(isActionName("retry-import")).toBe(false);
    expect(isActionName("toString")).toBe(false);
  });
});
