import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { callFor, DEFAULT_TIMEOUT_MS, within } from "./deadline.js";
import { API_VERSION } from "./envelope.js";
import { outOfTime, stopped } from "./problem.js";

/**
 * A reply lemonfiber would give to a read of a word.
 */
const AN_ENVELOPE = JSON.stringify({ api_version: API_VERSION, kind: "word", data: "hello" });

/**
 * A promise nothing ever settles.
 */
const never = <T>(): Promise<T> =>
  new Promise<T>(() => {
    // Neither resolved nor rejected, as a peer that never answers leaves it.
  });

/**
 * A `sending` that never answers and ignores the signal it is given.
 */
const deaf: Sending = () => never();

/**
 * A `sending` that answers at once, keeping the signal each request carried.
 */
function answering(
  reply: { status?: number; text?: () => Promise<string>; blob?: () => Promise<Blob> },
  signals: AbortSignal[] = [],
): Sending {
  return (_url, init) => {
    signals.push(init.signal);
    const status = reply.status ?? 200;
    return Promise.resolve({
      ok: status < 400,
      status,
      text: reply.text ?? (() => Promise.resolve(AN_ENVELOPE)),
      ...(reply.blob !== undefined && { blob: reply.blob }),
    });
  };
}

const open = (sending: Sending, timeoutMs?: number) => {
  const got = Client.at({
    url: "http://127.0.0.1:7777",
    token: "a-run-token",
    sending,
    ...(timeoutMs !== undefined && { timeoutMs }),
  });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

describe("a call's deadline", () => {
  it("ends a read nothing answers once the client's wait is over", async () => {
    expect(await open(deaf, 30).read("status")).toEqual({ ok: false, problem: outOfTime(30) });
  });

  it("ends an action nothing answers once its wait is over", async () => {
    expect(await open(deaf, 30).act("restart")).toEqual({ ok: false, problem: outOfTime(30) });
  });

  it("ends the reading of a body that never finishes arriving", async () => {
    const stalled = answering({ text: never });
    expect(await open(stalled, 30).read("status")).toEqual({
      ok: false,
      problem: outOfTime(30),
    });
  });

  it("takes the wait a call gives in place of the client's", async () => {
    const got = await open(deaf, 60_000).read("status", {}, { timeoutMs: 30 });
    expect(got).toEqual({ ok: false, problem: outOfTime(30) });
  });

  it("hands every request the call's signal, raised when the wait runs out", async () => {
    const signals: AbortSignal[] = [];
    await open(answering({}, signals), 30).read("status");
    expect(signals).toHaveLength(1);
    expect(signals[0]?.aborted).toBe(false);
  });

  it("asks a read again only while the wait has room for the pause before it", async () => {
    let asked = 0;
    const gatewayDown: Sending = (...given) => {
      asked += 1;
      return answering({ status: 503 })(...given);
    };

    const got = await open(gatewayDown, 30).read("status");

    expect(asked).toBe(1);
    expect(got).toEqual({ ok: false, problem: outOfTime(30) });
  });

  it("asks no third time where the longer pause before it would outlast the wait", async () => {
    let asked = 0;
    const gatewayDown: Sending = (...given) => {
      asked += 1;
      return answering({ status: 503 })(...given);
    };

    const got = await open(gatewayDown, 400).read("status");

    expect(asked).toBe(2);
    expect(got).toEqual({ ok: false, problem: outOfTime(400) });
  });

  it("waits for an answer that comes within the wait", async () => {
    const got = await open(answering({}), 1000).read("explain", { word: "hello" });
    expect(got).toMatchObject({ ok: true, value: { kind: "word", data: "hello" } });
  });

  it("waits ten seconds where nothing says otherwise", () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(10_000);
  });
});

describe("a call its caller stops", () => {
  it("ends where the caller raises its signal before an answer comes", async () => {
    const stopping = new AbortController();
    const asking = open(deaf).read("status", {}, { signal: stopping.signal });
    stopping.abort();
    expect(await asking).toEqual({ ok: false, problem: stopped() });
  });

  it("ends at once where the caller had already stopped it", async () => {
    const stopping = new AbortController();
    stopping.abort();
    expect(await open(answering({})).read("status", {}, { signal: stopping.signal })).toEqual({
      ok: false,
      problem: stopped(),
    });
  });
});

describe("a file under a deadline", () => {
  const bytes = () => Promise.resolve(new Blob(["archive"]));

  it("ends a file nothing answers for once the wait is over", async () => {
    expect(await open(deaf, 30).take("bundle/x")).toEqual({
      ok: false,
      problem: outOfTime(30),
    });
  });

  it("ends a file whose bytes never finish arriving", async () => {
    expect(await open(answering({ blob: never }), 30).bundle("x")).toEqual({
      ok: false,
      problem: outOfTime(30),
    });
  });

  it("ends a refusal whose body never finishes arriving", async () => {
    expect(await open(answering({ status: 404, text: never }), 30).take("bundle/x")).toEqual({
      ok: false,
      problem: outOfTime(30),
    });
  });

  it("takes the wait a call gives for a file", async () => {
    const got = await open(answering({ blob: bytes }), 30).bundle("x", { timeoutMs: 1000 });
    expect(got.ok).toBe(true);
  });
});

describe("a wait that is not one", () => {
  it.each([0, -1, NaN, Infinity])(
    "refuses a client waiting %s milliseconds as configuration",
    (timeoutMs) => {
      const got = Client.at({
        url: "http://127.0.0.1:7777",
        token: "a-run-token",
        sending: deaf,
        timeoutMs,
      });
      expect(got).toMatchObject({ ok: false, problem: { kind: "configuration" } });
    },
  );

  it("refuses a call waiting no time, and sends nothing", async () => {
    const signals: AbortSignal[] = [];
    const client = open(answering({}, signals));

    expect(await client.read("status", {}, { timeoutMs: 0 })).toMatchObject({
      ok: false,
      problem: { kind: "configuration" },
    });
    expect(await client.take("bundle/x", { timeoutMs: -5 })).toMatchObject({
      ok: false,
      problem: { kind: "configuration" },
    });
    expect(signals).toEqual([]);
  });
});

describe("within", () => {
  it("hands back what the work came to", async () => {
    expect(await within(Promise.resolve(7), new AbortController().signal)).toBe(7);
  });

  it("hands back nothing where the work fails", async () => {
    const failed = Promise.reject<number>(new Error("no"));
    expect(await within(failed, new AbortController().signal)).toBeUndefined();
  });
});

describe("callFor", () => {
  it("says nothing ended a call that was let go of in time", () => {
    const call = callFor(1000);
    call.release();
    expect(call.ended()).toBeUndefined();
    expect(call.signal.aborted).toBe(false);
  });

  it("keeps the first reason a call ended for", async () => {
    const stopping = new AbortController();
    const call = callFor(1, stopping.signal);
    await new Promise((resume) => {
      setTimeout(resume, 20);
    });
    stopping.abort();
    expect(call.ended()).toEqual(outOfTime(1));
    call.release();
  });

  it("stops listening to the caller once the call is let go of", () => {
    const stopping = new AbortController();
    const call = callFor(1000, stopping.signal);
    call.release();
    stopping.abort();
    expect(call.ended()).toBeUndefined();
  });
});

describe("outOfTime", () => {
  it("names the wait in whole seconds, and never as none", () => {
    expect(outOfTime(10_000).message).toContain("within 10 seconds");
    expect(outOfTime(1400).message).toContain("within 1 seconds");
    expect(outOfTime(30).message).toContain("within 1 seconds");
    expect(outOfTime(2600).message).toContain("within 3 seconds");
  });
});
