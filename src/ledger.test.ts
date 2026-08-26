import { describe, expect, it } from "vitest";
import { Ledger } from "./ledger.js";

describe("Ledger", () => {
  it("has nothing before anything arrives", () => {
    const ledger = new Ledger();
    expect(ledger.size).toBe(0);
    expect(ledger.held("status", 0)).toBeUndefined();
    expect(ledger.quietForMs(1000)).toBeUndefined();
    expect(ledger.all(0)).toEqual([]);
  });

  it("reports a value that just arrived as live", () => {
    const ledger = new Ledger();
    ledger.record("status", { free: 412 }, 1000);

    expect(ledger.held("status", 1000)).toEqual({
      at: "live",
      kind: "status",
      data: { free: 412 },
    });
    expect(ledger.size).toBe(1);
  });

  it("keeps the last value per kind rather than accumulating", () => {
    const ledger = new Ledger();
    ledger.record("status", { free: 412 }, 1000);
    ledger.record("status", { free: 400 }, 2000);

    expect(ledger.size).toBe(1);
    expect(ledger.held("status", 2000)).toMatchObject({ data: { free: 400 } });
  });

  it("counts the silence since the last arrival", () => {
    const ledger = new Ledger();
    ledger.record("status", 1, 1000);
    expect(ledger.quietForMs(4500)).toBe(3500);
  });

  // The server breaks a silence with a comment line, which carries no value and
  // names no kind. Counting only what holds a value leaves a stream that has been
  // speaking all along looking as silent as one that died.
  it("counts a beat as the stream speaking without holding anything for it", () => {
    const ledger = new Ledger();
    ledger.record("status", 1, 1000);
    ledger.spoke(4000);

    expect(ledger.quietForMs(4500)).toBe(500);
    expect(ledger.all(4500)).toEqual([{ at: "live", kind: "status", data: 1 }]);
    expect(ledger.size).toBe(1);
  });

  it("starts the clock on a beat where nothing has ever been held", () => {
    const ledger = new Ledger();
    ledger.spoke(4000);
    expect(ledger.quietForMs(4500)).toBe(500);
  });

  // A value gathered before a gap is stale whatever the transport says.
  it("keeps a cooled value but stops calling it current", () => {
    const ledger = new Ledger();
    ledger.record("status", { free: 412 }, 1000);
    ledger.cool();

    expect(ledger.held("status", 6000)).toEqual({
      at: "stale",
      kind: "status",
      data: { free: 412 },
      quietForMs: 5000,
    });
  });

  it("makes a cooled value live again when a fresh one arrives", () => {
    const ledger = new Ledger();
    ledger.record("status", { free: 412 }, 1000);
    ledger.cool();
    ledger.record("status", { free: 390 }, 9000);

    expect(ledger.held("status", 9000)).toEqual({
      at: "live",
      kind: "status",
      data: { free: 390 },
    });
  });

  it("cools every kind, not only the one that stopped", () => {
    const ledger = new Ledger();
    ledger.record("status", 1, 1000);
    ledger.record("services", 2, 1000);
    ledger.cool();

    expect(ledger.all(2000).every((held) => held.at === "stale")).toBe(true);
    expect(ledger.all(2000)).toHaveLength(2);
  });

  it("cooling nothing is harmless", () => {
    const ledger = new Ledger();
    ledger.cool();
    expect(ledger.all(0)).toEqual([]);
  });

  it("returns what is held in the order it was first recorded", () => {
    const ledger = new Ledger();
    ledger.record("status", 1, 1000);
    ledger.record("services", 2, 1100);
    ledger.record("status", 3, 1200);

    expect(ledger.all(1200).map((held) => held.kind)).toEqual(["status", "services"]);
  });
});

describe("Ledger.cooled", () => {
  it("gives everything held with how long since each arrived", () => {
    const ledger = new Ledger();
    ledger.record("status", { free: 412 }, 1000);
    ledger.record("services", 9, 2000);
    ledger.cool();

    expect(ledger.cooled(5000)).toEqual([
      { kind: "status", data: { free: 412 }, quietForMs: 4000 },
      { kind: "services", data: 9, quietForMs: 3000 },
    ]);
  });

  it("gives nothing when nothing is held", () => {
    expect(new Ledger().cooled(0)).toEqual([]);
  });
});
