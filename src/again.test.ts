import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Client, type Sending } from "./client.js";
import { API_VERSION } from "./envelope.js";
import { follow, type Fetching } from "./events.js";

/**
A `fetch` that answers with each status in turn, counting how often it was asked.
*/
function answeringInTurn(statuses: number[], asked: { count: number }): Sending {
  return () => {
    const status = statuses[asked.count] ?? 200;
    asked.count += 1;
    return Promise.resolve({
      ok: status < 400,
      status,
      text: () =>
        Promise.resolve(
          JSON.stringify({ api_version: API_VERSION, kind: "word", data: "hello" }),
        ),
    });
  };
}

const client = (sending: Sending) => {
  const got = Client.at({ url: "http://127.0.0.1:7777", token: "a-run-token", sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

/**
Waits out every pause the retries take, then hands back what was asked.
*/
async function settled<T>(asking: Promise<T>): Promise<T> {
  await vi.runAllTimersAsync();
  return asking;
}

describe("a read", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([502, 503, 504])(
    "is asked again where a gateway answered %i, and takes the answer that came",
    async (status) => {
      const asked = { count: 0 };
      const got = await settled(client(answeringInTurn([status, 200], asked)).read("explain"));

      expect(got).toMatchObject({ ok: true });
      expect(asked.count).toBe(2);
    },
  );

  it("is asked three times in all, then reports the last answer", async () => {
    const asked = { count: 0 };
    const got = await settled(
      client(answeringInTurn([503, 503, 503, 200], asked)).read("explain"),
    );

    expect(got).toMatchObject({ ok: false });
    expect(asked.count).toBe(3);
  });

  it("is asked again where nothing arrived", async () => {
    let count = 0;
    const silentOnce: Sending = () => {
      count += 1;
      return count === 1
        ? Promise.reject(new Error("no route"))
        : answeringInTurn([200], { count: 0 })("", {
            method: "GET",
            headers: {},
            redirect: "error",
            signal: new AbortController().signal,
          });
    };
    const got = await settled(client(silentOnce).read("explain"));

    expect(got).toMatchObject({ ok: true });
    expect(count).toBe(2);
  });

  it.each([400, 401, 403, 404, 409, 500])(
    "takes lemonfiber's own %i on the first answer",
    async (status) => {
      const asked = { count: 0 };
      const got = await settled(client(answeringInTurn([status, 200], asked)).read("explain"));

      expect(got).toMatchObject({ ok: false });
      expect(asked.count).toBe(1);
    },
  );
});

describe("an action", () => {
  it("is never asked again, whatever answered it", async () => {
    const asked = { count: 0 };
    const got = await client(answeringInTurn([503, 202], asked)).act("restart");

    expect(got).toMatchObject({ ok: false });
    expect(asked.count).toBe(1);
  });
});

describe("opening the stream", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is asked again where a gateway could not reach lemonfiber", async () => {
    let count = 0;
    const fetching: Fetching = () => {
      count += 1;
      return Promise.resolve({ ok: false, status: 503, body: null });
    };
    const following = follow({
      url: "http://127.0.0.1:7777/api/events",
      token: "a-run-token",
      fetching,
      reconnectsAllowed: 0,
    });

    const first = await settled(following.next());

    expect(first.value).toMatchObject({ at: "lost" });
    expect(count).toBe(3);
  });
});
