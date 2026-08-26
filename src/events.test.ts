import { describe, expect, it } from "vitest";
import { API_VERSION } from "./envelope.js";
import {
  follow,
  HEARTBEAT_MS,
  SILENCE_ALLOWED_MS,
  TOKEN_HEADER,
  type Arrival,
  type Fetching,
} from "./events.js";

/**
 * A stream that hands over `chunks` and then ends.
 */
function streaming(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let at = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = chunks[at];
      at += 1;
      if (chunk === undefined) controller.close();
      else controller.enqueue(encoder.encode(chunk));
    },
  });
}

/**
 * A stream that hands over `chunks` and then stays open, which is what a server
 * gathering on a tick does between snapshots.
 */
function holding(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let at = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = chunks[at];
      at += 1;
      if (chunk !== undefined) {
        controller.enqueue(encoder.encode(chunk));
        return;
      }
      return new Promise<void>(() => {
        // A server gathering on a tick never resolves this between snapshots.
      });
    },
  });
}

const sent = (kind: string, data: unknown, id?: string): string =>
  `${id === undefined ? "" : `id: ${id}\n`}event: ${kind}\ndata: ${JSON.stringify({
    api_version: API_VERSION,
    kind,
    data,
  })}\n\n`;

interface Seen {
  headers: Record<string, string>[];
}

/**
 * A `fetch` that serves each opening from `openings` in turn.
 */
function serving(openings: (string[] | null)[], seen: Seen): Fetching {
  let at = 0;
  return (_url, init) => {
    seen.headers.push(init.headers);
    const chunks = openings[at];
    at += 1;
    if (chunks === undefined || chunks === null) {
      return Promise.resolve({ ok: false, body: null });
    }
    return Promise.resolve({ ok: true, body: streaming(chunks) });
  };
}

/**
 * The first `count` arrivals, or fewer if the stream ends.
 */
async function take<T>(
  stream: AsyncGenerator<Arrival<T>>,
  count: number,
): Promise<Arrival<T>[]> {
  const got: Arrival<T>[] = [];
  for await (const arrival of stream) {
    got.push(arrival);
    if (got.length >= count) break;
  }
  return got;
}

const base = { url: "http://127.0.0.1:7777/api/events", token: "a-run-token" };

describe("follow", () => {
  // A server that gathers on a tick holds the connection open between snapshots,
  // so an opening that never ends is the ordinary case rather than the edge one.
  it("hands over an arrival before the opening has ended", async () => {
    const following = follow<{ free: number }>({
      ...base,
      fetching: () =>
        Promise.resolve({ ok: true, body: holding([sent("status", { free: 7 })]) }),
      reconnectsAllowed: 0,
    });

    const first = await following.next();
    await following.return(undefined);

    expect(first.done).toBe(false);
    expect(first.value).toEqual({ at: "live", kind: "status", data: { free: 7 } });
  });

  it("hands over what arrives", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(
      follow<{ free: number }>({
        ...base,
        fetching: serving([[sent("status", { free: 412 })]], seen),
        reconnectsAllowed: 0,
      }),
      1,
    );

    expect(got[0]).toEqual({ at: "live", kind: "status", data: { free: 412 } });
  });

  // The token is a header, never a query parameter.
  it("sends the token in its header", async () => {
    const seen: Seen = { headers: [] };
    await take(
      follow({ ...base, fetching: serving([[sent("status", 1)]], seen), reconnectsAllowed: 0 }),
      1,
    );

    expect(seen.headers[0]?.[TOKEN_HEADER]).toBe("a-run-token");
    expect(seen.headers[0]?.["Accept"]).toBe("text/event-stream");
    expect(JSON.stringify(seen.headers[0])).not.toContain("?");
  });

  it("reads several events out of one opening", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(
      follow({
        ...base,
        fetching: serving([[sent("status", 1), sent("services", 2)]], seen),
        reconnectsAllowed: 0,
      }),
      2,
    );

    expect(got.map((a) => (a.at === "live" ? a.kind : a.at))).toEqual(["status", "services"]);
  });

  it("reads an event split across two chunks", async () => {
    const seen: Seen = { headers: [] };
    const whole = sent("status", { free: 412 });
    const got = await take(
      follow<{ free: number }>({
        ...base,
        fetching: serving([[whole.slice(0, 20), whole.slice(20)]], seen),
        reconnectsAllowed: 0,
      }),
      1,
    );

    expect(got[0]).toMatchObject({ at: "live", data: { free: 412 } });
  });

  it("reports a stream it cannot open, and stops", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(follow({ ...base, fetching: serving([null], seen) }), 5);

    expect(got).toEqual([
      { at: "lost", problem: expect.objectContaining({ kind: "unreachable" }) },
    ]);
  });

  it("reports an unreadable event but keeps reading", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(
      follow({
        ...base,
        fetching: serving([["data: not json\n\n", sent("status", 1)]], seen),
        reconnectsAllowed: 0,
      }),
      2,
    );

    expect(got[0]).toMatchObject({ at: "lost", problem: { kind: "malformed" } });
    expect(got[1]).toMatchObject({ at: "live", kind: "status" });
  });

  it("refuses an envelope from a version it cannot speak", async () => {
    const seen: Seen = { headers: [] };
    const wrong = `data: ${JSON.stringify({ api_version: API_VERSION + 1, kind: "status", data: 1 })}\n\n`;
    const got = await take(
      follow({ ...base, fetching: serving([[wrong]], seen), reconnectsAllowed: 0 }),
      1,
    );

    expect(got[0]).toMatchObject({ at: "lost", problem: { kind: "version" } });
  });

  // Silence is a break, and what survives it is stale. A stream that has gone
  // quiet says nothing at all, so what ends the wait is the wait itself — nothing
  // arrives to prompt a reading of the clock.
  it("calls the stream broken once silence outlasts what is allowed", async () => {
    const got = await take(
      follow<{ free: number }>({
        ...base,
        fetching: () =>
          Promise.resolve({ ok: true, body: holding([sent("status", { free: 412 })]) }),
        silenceAllowedMs: 5,
        reconnectsAllowed: 0,
      }),
      3,
    );

    expect(got[0]).toMatchObject({ at: "live", kind: "status" });
    expect(got[1]).toMatchObject({ at: "lost", problem: { kind: "stream" } });
    expect(got[2]).toMatchObject({ at: "stale", kind: "status", data: { free: 412 } });
  });

  // What the server sends when it has nothing to say is a comment line and
  // nothing else. Counting only envelopes as arrivals reads a stream that has
  // been speaking every fifteen seconds as one that stopped after thirty.
  it("takes the beat a silence is broken with as the stream still speaking", async () => {
    let clock = 0;
    const beating = [
      sent("status", { free: 7 }),
      ": beat\n\n",
      ": beat\n\n",
      ": beat\n\n",
      sent("status", { free: 6 }),
    ];

    const got = await take(
      follow<{ free: number }>({
        ...base,
        fetching: () => Promise.resolve({ ok: true, body: holding(beating) }),
        now: () => {
          clock += HEARTBEAT_MS;
          return clock;
        },
        silenceAllowedMs: SILENCE_ALLOWED_MS,
        reconnectsAllowed: 0,
      }),
      2,
    );

    expect(got[0]).toEqual({ at: "live", kind: "status", data: { free: 7 } });
    expect(got[1]).toEqual({ at: "live", kind: "status", data: { free: 6 } });
  });

  it("does not present what it held before a break as current", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(
      follow<number>({
        ...base,
        fetching: serving([[sent("status", 1)]], seen),
        reconnectsAllowed: 0,
      }),
      3,
    );

    const afterBreak = got.slice(2);
    expect(afterBreak.every((a) => a.at !== "live")).toBe(true);
  });

  // Resumption sends the last id seen.
  it("resumes from the last event it saw", async () => {
    const seen: Seen = { headers: [] };
    await take(
      follow({
        ...base,
        fetching: serving([[sent("status", 1, "7")], [sent("status", 2, "8")]], seen),
        reconnectsAllowed: 1,
      }),
      4,
    );

    expect(seen.headers[0]?.["Last-Event-ID"]).toBeUndefined();
    expect(seen.headers[1]?.["Last-Event-ID"]).toBe("7");
  });

  it("gives up once it has reopened as often as it is allowed", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(
      follow({
        ...base,
        fetching: serving(
          [[sent("status", 1)], [sent("status", 2)], [sent("status", 3)]],
          seen,
        ),
        reconnectsAllowed: 1,
      }),
      50,
    );

    expect(seen.headers).toHaveLength(2);
    expect(got.filter((a) => a.at === "live")).toHaveLength(2);
  });

  it("stops when it is told to", async () => {
    const seen: Seen = { headers: [] };
    const gate = new AbortController();
    gate.abort();

    const got = await take(
      follow({
        ...base,
        fetching: serving([[sent("status", 1)], [sent("status", 2)]], seen),
        signal: gate.signal,
      }),
      50,
    );

    expect(seen.headers).toHaveLength(1);
    expect(got.filter((a) => a.at === "live")).toHaveLength(1);
  });

  it("survives a reader that throws mid-stream", async () => {
    const seen: Seen = { headers: [] };
    const failing: Fetching = (_url, init) => {
      seen.headers.push(init.headers);
      return Promise.resolve({
        ok: true,
        body: new ReadableStream<Uint8Array>({
          pull() {
            throw new Error("the connection went away");
          },
        }),
      });
    };

    const got = await take(follow({ ...base, fetching: failing, reconnectsAllowed: 0 }), 2);
    expect(got[0]).toMatchObject({ at: "lost", problem: { kind: "stream" } });
  });

  it("treats a rejected request as a stream it cannot open", async () => {
    const refusing: Fetching = () => Promise.reject(new Error("refused"));
    const got = await take(follow({ ...base, fetching: refusing }), 2);

    expect(got[0]).toMatchObject({ at: "lost", problem: { kind: "unreachable" } });
  });

  it("uses the real clock and limits when none are given", async () => {
    const seen: Seen = { headers: [] };
    const got = await take(
      follow({ ...base, fetching: serving([[sent("status", 1)]], seen) }),
      1,
    );

    expect(got[0]).toMatchObject({ at: "live" });
  });
});
