import { describe, expect, it } from "vitest";
import {
  malformed,
  problem,
  refused,
  streamLost,
  unreachable,
  wrongVersion,
} from "./problem.js";

const every = [
  unreachable(),
  refused(),
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
