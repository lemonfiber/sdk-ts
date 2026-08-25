import { describe, expect, it } from "vitest";
import {
  failed,
  malformed,
  misasked,
  missing,
  problem,
  refused,
  streamLost,
  unreachable,
  wrongVersion,
} from "./problem.js";

const every = [
  unreachable(),
  refused(),
  missing("`kubernetes` is not one of the words this product explains"),
  misasked("The `only` given is not a group of checks this stack knows."),
  failed("The container engine is not running, so nothing could be asked of it."),
  malformed(),
  wrongVersion(1, 2),
  streamLost(30_000),
  problem("stream", "anything"),
];

describe("problem", () => {
  it("carries the kind and message it was given", () => {
    expect(problem("refused", "no")).toEqual({ kind: "refused", message: "no" });
  });

  it.each(every.map((p) => [p.kind, p] as const))(
    "%s reads as a sentence, not a status code",
    (_kind, p) => {
      expect(p.message.length).toBeGreaterThan(0);
      expect(p.message).not.toMatch(/\b[45]\d{2}\b/);
      expect(p.message).not.toMatch(/undefined|null|\[object/);
    },
  );

  it("names the key, which is the only thing a refusal is about", () => {
    expect(refused().message).toContain("reopen it from the address lemonfiber printed");
  });

  // None of them invents a sentence. Each is built from what lemonfiber said and
  // from nothing else, so there is no wording here to keep in step with the
  // binary's.
  it.each([
    ["missing", missing, "`kubernetes` is not one of the words this product explains"],
    ["misasked", misasked, "The action `config-set` needs `key`, which was not given."],
    ["failed", failed, "The container engine is not running, so nothing could be asked of it."],
  ])("%s says lemonfiber's own words", (kind, build, said) => {
    expect(build(said)).toEqual({ kind, message: said });
  });

  // The distinction the console reads. A key is the one thing a page can put
  // right by asking for a new one, and it is the only thing this kind means.
  it("says nothing about the key when lemonfiber's own answering failed", () => {
    const broke = "The container engine is not running, so nothing could be asked of it.";
    expect(failed(broke).message).not.toContain("key");
    expect(failed(broke).kind).not.toBe(refused().kind);
  });

  it("names both versions when they disagree", () => {
    const message = wrongVersion(1, 4).message;
    expect(message).toContain("1");
    expect(message).toContain("4");
  });

  it("says how long the stream has been silent, in seconds", () => {
    expect(streamLost(30_000).message).toContain("30 seconds");
  });

  it("rounds an awkward silence rather than showing a fraction", () => {
    expect(streamLost(31_400).message).toContain("31 seconds");
  });
});
