import { describe, expect, it } from "vitest";
import { API_VERSION, isKind, parse, read } from "./envelope.js";
import { CONTRACT_API_VERSION, type ByKind } from "./generated/contract.js";

const good = { api_version: API_VERSION, kind: "status", data: { free: 412 } };

describe("read", () => {
  it("accepts an envelope this package speaks", () => {
    const got = read<{ free: number }>(good);
    expect(got).toEqual({ ok: true, value: good });
  });

  it("accepts data that is null, since absent and null differ", () => {
    const got = read({ api_version: API_VERSION, kind: "status", data: null });
    expect(got.ok).toBe(true);
  });

  it.each([
    ["null", null],
    ["a string", "status"],
    ["a number", 7],
    ["an array", []],
  ])("refuses %s", (_name, value) => {
    const got = read(value);
    expect(got).toMatchObject({ ok: false, problem: { kind: "malformed" } });
  });

  it.each([
    ["no api_version", { kind: "status", data: {} }],
    ["no kind", { api_version: API_VERSION, data: {} }],
    ["no data", { api_version: API_VERSION, kind: "status" }],
    ["a non-numeric api_version", { api_version: "1", kind: "status", data: {} }],
    ["a non-string kind", { api_version: API_VERSION, kind: 1, data: {} }],
  ])("refuses an envelope with %s", (_name, value) => {
    expect(read(value)).toMatchObject({ ok: false, problem: { kind: "malformed" } });
  });

  // Name both versions, render nothing.
  it("refuses a wire version it cannot speak, naming both", () => {
    const got = read({ ...good, api_version: API_VERSION + 1 });
    expect(got.ok).toBe(false);
    if (got.ok) return;
    expect(got.problem.kind).toBe("version");
    expect(got.problem.message).toContain(String(API_VERSION));
    expect(got.problem.message).toContain(String(API_VERSION + 1));
  });
});

describe("parse", () => {
  it("reads an envelope out of JSON text", () => {
    expect(parse<{ free: number }>(JSON.stringify(good))).toEqual({ ok: true, value: good });
  });

  it("refuses text that is not JSON", () => {
    expect(parse("not json at all")).toMatchObject({
      ok: false,
      problem: { kind: "malformed" },
    });
  });

  it("refuses JSON that is not an envelope", () => {
    expect(parse('{"hello":true}')).toMatchObject({
      ok: false,
      problem: { kind: "malformed" },
    });
  });
});

describe("isKind", () => {
  it("narrows an envelope to the kind it names", () => {
    const envelope = { api_version: API_VERSION, kind: "word", data: "anything" };
    const got = read<unknown>(envelope);

    expect(got.ok).toBe(true);
    if (!got.ok) return;
    expect(isKind(got.value, "word")).toBe(true);
  });

  it("refuses an envelope carrying a different kind", () => {
    const envelope = { api_version: API_VERSION, kind: "log", data: "anything" };
    const got = read<unknown>(envelope);

    expect(got.ok).toBe(true);
    if (!got.ok) return;
    expect(isKind(got.value, "word")).toBe(false);
  });

  it("narrows a hand-off to the report it carries", () => {
    const report: ByKind["handoff"]["data"] = {
      name: "sam",
      address: "http://192.168.1.20:8096",
      state: "ready",
      quick_connect: true,
      rehearsed: false,
      steps: ["Open Findroid", "Scan the code"],
      sessions: [{ client: "Jellyfin Web", device: "Firefox", last_seen: null }],
      clients: [
        {
          client: "Findroid",
          code: "http://192.168.1.20:8096",
          deep_link: false,
          device: "Android phone",
          open_source: true,
        },
      ],
    };
    const got = read<unknown>({ api_version: API_VERSION, kind: "handoff", data: report });

    expect(got.ok).toBe(true);
    if (!got.ok) return;
    expect(isKind(got.value, "handoff")).toBe(true);
    if (!isKind(got.value, "handoff")) return;
    expect(got.value.data.state).toBe("ready");
    expect(got.value.data.clients.map((client) => [client.code, client.deep_link])).toEqual([
      ["http://192.168.1.20:8096", false],
    ]);
  });

  it("carries whether a device's app is open source, and the link that opens it", () => {
    const device: ByKind["clients"]["data"]["devices"][number] = {
      client: "Swiftfin",
      device: "iPhone",
      support: "good",
      open_source: true,
      deep_link: "swiftfin://connect?server={address}",
    };
    const got = read<unknown>({
      api_version: API_VERSION,
      kind: "clients",
      data: { devices: [device], nothing_is_installed: "", only_at_home: "", trouble: [] },
    });

    expect(got.ok).toBe(true);
    if (!got.ok) return;
    expect(isKind(got.value, "clients")).toBe(true);
    if (!isKind(got.value, "clients")) return;
    expect(got.value.data.devices[0]).toMatchObject({
      open_source: true,
      deep_link: "swiftfin://connect?server={address}",
    });
  });
});

describe("API_VERSION", () => {
  it("is the version the generated contract was written for", () => {
    expect(API_VERSION).toBe(CONTRACT_API_VERSION);
  });
});
