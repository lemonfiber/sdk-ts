import { describe, expect, it } from "vitest";
import { isKeyCallable, KEY_CALLABLE } from "./index.js";

describe("the actions a key may call", () => {
  it("knows every action the contract lists as callable by a key", () => {
    for (const action of Object.keys(KEY_CALLABLE)) expect(isKeyCallable(action)).toBe(true);
  });

  it("knows no other", () => {
    expect(isKeyCallable("not-an-action")).toBe(false);
    expect(isKeyCallable("toString")).toBe(false);
  });
});
