import { describe, expect, it } from "vitest";
import { SseParser } from "./sse.js";

describe("SseParser", () => {
  it("yields nothing until a blank line ends the event", () => {
    const parser = new SseParser();
    expect(parser.push("data: hello\n")).toEqual([]);
    expect(parser.push("\n")).toEqual([{ id: undefined, event: "message", data: "hello" }]);
  });

  it("reads id, event and data together", () => {
    const parser = new SseParser();
    const got = parser.push("id: 7\nevent: status\ndata: {}\n\n");
    expect(got).toEqual([{ id: "7", event: "status", data: "{}" }]);
  });

  it("defaults the event name when none is given", () => {
    const parser = new SseParser();
    expect(parser.push("data: x\n\n")[0]?.event).toBe("message");
  });

  it("joins repeated data lines with newlines", () => {
    const parser = new SseParser();
    expect(parser.push("data: one\ndata: two\n\n")[0]?.data).toBe("one\ntwo");
  });

  it("survives an event split across chunks", () => {
    const parser = new SseParser();
    expect(parser.push("id: 3\neve")).toEqual([]);
    expect(parser.push('nt: status\ndata: {"a":1}\n\n')).toEqual([
      { id: "3", event: "status", data: '{"a":1}' },
    ]);
  });

  it("returns several events from one chunk, in order", () => {
    const parser = new SseParser();
    const got = parser.push("data: one\n\ndata: two\n\n");
    expect(got.map((event) => event.data)).toEqual(["one", "two"]);
  });

  it("ignores comment lines", () => {
    const parser = new SseParser();
    expect(parser.push(": keep-alive\n\n")).toEqual([]);
    expect(parser.push(": ping\ndata: real\n\n")).toEqual([
      { id: undefined, event: "message", data: "real" },
    ]);
  });

  it.each([
    {
      what: "a field it does not know",
      wire: "retry: 500\ndata: x\n\n",
      data: "x",
    },
    { what: "a line with no colon", wire: "data\ndata: x\n\n", data: "\nx" },
  ])("reads $what the way the format says to", ({ wire, data }) => {
    const parser = new SseParser();
    expect(parser.push(wire)[0]?.data).toBe(data);
  });
  it("reads a value written with no space after the colon", () => {
    const parser = new SseParser();
    expect(parser.push("data:x\n\n")[0]?.data).toBe("x");
  });

  it("strips only the single optional space after the colon", () => {
    const parser = new SseParser();
    expect(parser.push(`data:${" ".repeat(2)}two spaces\n\n`)[0]?.data).toBe(" two spaces");
  });

  it("accepts carriage returns", () => {
    const parser = new SseParser();
    expect(parser.push("data: x\r\n\r\n")[0]?.data).toBe("x");
  });

  it("does not emit an event for a blank line with nothing gathered", () => {
    const parser = new SseParser();
    expect(parser.push("\n".repeat(3))).toEqual([]);
  });

  it("does not carry an id or event name into the next event", () => {
    const parser = new SseParser();
    parser.push("id: 1\nevent: status\ndata: a\n\n");
    expect(parser.push("data: b\n\n")).toEqual([
      { id: undefined, event: "message", data: "b" },
    ]);
  });
});
