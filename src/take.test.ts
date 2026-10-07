import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { API_VERSION } from "./envelope.js";
import { TOKEN_HEADER } from "./credential.js";
import type { Bundle } from "./generated/index.js";
import { refused, unreachable } from "./problem.js";

/**
 * The first bytes of a gzip stream, then bytes no text decoding survives intact.
 */
const ARCHIVE = new Uint8Array([31, 139, 8, 0, 255, 254, 0, 128, 195, 40]);

const NAME = "lemonfiber-support-2026-09-28T10-00-00Z.tar.gz";

interface Seen {
  url: string;
  method: string;
  headers: Record<string, string>;
}

/**
 * What each reading of a reply's body was asked for, in order.
 */
type Read = ("text" | "blob")[];

/**
 * A `fetch` that records what it was asked and what of the reply was read, and
 * answers with `ARCHIVE` to a reading as bytes and `reply.text` to one as text.
 */
function handing(
  reply: { ok?: boolean; status?: number; text?: string },
  seen: Seen[] = [],
  read: Read = [],
): Sending {
  return (url, init) => {
    seen.push({ url, method: init.method, headers: init.headers });
    return Promise.resolve({
      ok: reply.ok ?? true,
      status: reply.status ?? 200,
      text: () => {
        read.push("text");
        return Promise.resolve(reply.text ?? "");
      },
      blob: () => {
        read.push("blob");
        return Promise.resolve(new Blob([ARCHIVE], { type: "application/gzip" }));
      },
    });
  };
}

const open = (sending: Sending) => {
  const got = Client.at({ url: "http://127.0.0.1:7777", token: "a-run-token", sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

/**
 * An `error` envelope carrying `summary`, as lemonfiber answers a read it refused.
 */
const wentWrong = (summary: string): string =>
  JSON.stringify({
    api_version: API_VERSION,
    kind: "error",
    data: {
      code: "NOT-HELD",
      summary,
      meaning: "A bundle asked for by name is one of the files this run wrote.",
      remedies: [],
      severity: "error",
      state: "actionable",
    },
  });

/**
 * The payload of a bundle the `support` action wrote, at `path`.
 */
const written = (path: string): Bundle & { path: string } => ({
  bytes: ARCHIVE.length,
  contents: {
    missing: [],
    pieces: [],
    taken: { at: "2026-09-28T10:00:00Z", lemonfiber: "0.9.0", stack: "1.4.0" },
    terms: { filenames: false, revealed: [], window: "last 2000 lines" },
  },
  path,
  rehearsed: false,
});

describe("take", () => {
  it("hands over the bytes that arrived, unchanged", async () => {
    const got = await open(handing({})).take(`bundle/${NAME}`);

    if (!got.ok) throw new Error(got.problem.message);
    expect(new Uint8Array(await got.value.arrayBuffer())).toEqual(ARCHIVE);
    expect(got.value.type).toBe("application/gzip");
  });

  it("reads a success as bytes and never as text", async () => {
    const read: Read = [];
    await open(handing({}, [], read)).take(`bundle/${NAME}`);

    expect(read).toEqual(["blob"]);
  });

  it("asks with the token in its header and accepts whatever the file is", async () => {
    const seen: Seen[] = [];
    await open(handing({}, seen)).take(`bundle/${NAME}`);

    expect(seen[0]?.method).toBe("GET");
    expect(seen[0]?.url).toBe(`http://127.0.0.1:7777/api/bundle/${NAME}`);
    expect(seen[0]?.headers[TOKEN_HEADER]).toBe("a-run-token");
    expect(seen[0]?.headers["Accept"]).toBe("*/*");
    expect(seen[0]?.url).not.toContain("a-run-token");
  });

  it("reports a request that never arrived", async () => {
    const refusing: Sending = () => Promise.reject(new Error("no route"));
    const got = await open(refusing).take(`bundle/${NAME}`);

    expect(got).toEqual({ ok: false, problem: unreachable() });
  });

  it("reports a reply whose bytes cannot be read", async () => {
    const broken: Sending = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
        blob: () => Promise.reject(new Error("the connection went away")),
      });
    const got = await open(broken).take(`bundle/${NAME}`);

    expect(got).toEqual({ ok: false, problem: unreachable() });
  });

  it("reports a reply that offers no way to read bytes", async () => {
    const textOnly: Sending = () =>
      Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve("") });
    const got = await open(textOnly).take(`bundle/${NAME}`);

    expect(got).toEqual({ ok: false, problem: unreachable() });
  });
});

describe("a refusal on the way to a file", () => {
  it("reads it as every other refusal is read, and keeps the whole body", async () => {
    const said = "`nope.tar.gz` is not one of the bundles kept here";
    const body = wentWrong(said);
    const got = await open(handing({ ok: false, status: 404, text: body })).take(
      "bundle/nope.tar.gz",
    );

    expect(got).toEqual({ ok: false, problem: { kind: "missing", message: said }, said: body });
  });

  it("reads a refusal as text and never as bytes", async () => {
    const read: Read = [];
    await open(handing({ ok: false, status: 404, text: wentWrong("gone") }, [], read)).take(
      "bundle/nope.tar.gz",
    );

    expect(read).toEqual(["text"]);
  });

  // `refused` carries no sentence, and a turned-away request has one worth
  // reading: a member is told the bundle is not theirs to ask for, which is not
  // the key.
  it("keeps the key's remedy and the sentence it was turned away with", async () => {
    const said = "This is not something this account may ask for.";
    const got = await open(handing({ ok: false, status: 403, text: said })).take(
      `bundle/${NAME}`,
    );

    expect(got).toEqual({ ok: false, problem: refused(), said });
  });

  it("does not pass off a page from something in front of lemonfiber as its words", async () => {
    const page = "<html><head><title>502 Bad Gateway</title></head><body>nginx</body></html>";
    const got = await open(handing({ ok: false, status: 502, text: page })).take(
      `bundle/${NAME}`,
    );

    expect(got).toEqual({ ok: false, problem: unreachable(), said: page });
  });

  it("reports a refusal whose body cannot be read as not answering", async () => {
    const broken: Sending = () =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.reject(new Error("the connection went away")),
      });
    const got = await open(broken).take(`bundle/${NAME}`);

    expect(got).toEqual({ ok: false, problem: unreachable() });
  });
});

describe("bundle", () => {
  it("asks by the name it was written under and hands over what arrived", async () => {
    const seen: Seen[] = [];
    const got = await open(handing({}, seen)).bundle(NAME);

    expect(seen[0]?.url).toBe(`http://127.0.0.1:7777/api/bundle/${NAME}`);
    if (!got.ok) throw new Error(got.problem.message);
    expect(new Uint8Array(await got.value.arrayBuffer())).toEqual(ARCHIVE);
  });

  it.each([
    ["a POSIX path", `/home/op/.config/lemonfiber/bundles/${NAME}`],
    ["a path on Windows", `C:\\Users\\op\\AppData\\lemonfiber\\bundles\\${NAME}`],
  ])("asks by the name that ends %s", async (_what, path) => {
    const seen: Seen[] = [];
    await open(handing({}, seen)).bundle(written(path));

    expect(seen[0]?.url).toBe(`http://127.0.0.1:7777/api/bundle/${NAME}`);
  });

  it("sends a name carrying a path as one segment, for lemonfiber to refuse", async () => {
    const seen: Seen[] = [];
    await open(handing({}, seen)).bundle("../../etc/passwd");

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/bundle/..%2F..%2Fetc%2Fpasswd");
  });
});

// The path every caller already had is the one this must not have moved.
describe("the text path beside it", () => {
  it("reads an envelope as text, never as bytes, and asks for JSON", async () => {
    const seen: Seen[] = [];
    const read: Read = [];
    const envelope = JSON.stringify({ api_version: API_VERSION, kind: "word", data: "hello" });
    const got = await open(handing({ text: envelope }, seen, read)).read("explain");

    expect(got).toEqual({
      ok: true,
      value: { api_version: API_VERSION, kind: "word", data: "hello" },
    });
    expect(read).toEqual(["text"]);
    expect(seen[0]?.headers["Accept"]).toBe("application/json");
  });

  it("still carries no body for a turned-away request", async () => {
    const said = "This is not something this account may ask for.";
    const got = await open(handing({ ok: false, status: 403, text: said })).read("status");

    expect(got).toEqual({ ok: false, problem: refused() });
  });
});
