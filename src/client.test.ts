import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { API_VERSION } from "./envelope.js";
import { TOKEN_HEADER } from "./events.js";

interface Seen {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | undefined;
}

/**
 * A `fetch` that records what it was asked and answers with `reply`.
 */
function answering(
  reply: { ok?: boolean; status?: number; text?: string },
  seen: Seen[],
): Sending {
  return (url, init) => {
    seen.push({ url, method: init.method, headers: init.headers, body: init.body });
    return Promise.resolve({
      ok: reply.ok ?? true,
      status: reply.status ?? 200,
      text: () =>
        Promise.resolve(
          reply.text ??
            JSON.stringify({ api_version: API_VERSION, kind: "word", data: "hello" }),
        ),
    });
  };
}

const open = (sending: Sending, url = "http://127.0.0.1:7777", token = "a-run-token") => {
  const got = Client.at({ url, token, sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

describe("Client.at", () => {
  it("refuses an address that is not on this machine", () => {
    const got = Client.at({
      url: "http://example.com",
      token: "t",
      sending: answering({}, []),
    });
    expect(got).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });

  it.each([
    ["empty", ""],
    ["only spaces", " ".repeat(3)],
  ])("refuses a token that is %s", (_n, token) => {
    const got = Client.at({ url: "http://127.0.0.1:7777", token, sending: answering({}, []) });
    expect(got).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });
});

describe("read", () => {
  it("asks the endpoint named after the command", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("status");

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/status");
    expect(seen[0]?.method).toBe("GET");
  });

  // ARCH-R52 / ARCH-R59: the token is a header, never a URL.
  it("sends the token in its header and nowhere else", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("status", { since: "yesterday" });

    expect(seen[0]?.headers[TOKEN_HEADER]).toBe("a-run-token");
    expect(seen[0]?.url).not.toContain("a-run-token");
  });

  it("turns arguments into query parameters", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("logs", { tail: 50, follow: true, service: "sonarr" });

    expect(seen[0]?.url).toContain("tail=50");
    expect(seen[0]?.url).toContain("follow=true");
    expect(seen[0]?.url).toContain("service=sonarr");
  });

  it("leaves out an argument that was not given", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("logs", { tail: undefined, service: "sonarr" });

    expect(seen[0]?.url).not.toContain("tail");
    expect(seen[0]?.url).toContain("service=sonarr");
  });

  it("asks for nothing extra when there is nothing to ask", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("status");
    expect(seen[0]?.url).not.toContain("?");
  });

  it("reads the envelope out of the reply", async () => {
    const got = await open(answering({}, [])).read<string>("word");
    expect(got).toMatchObject({ ok: true, value: { kind: "word", data: "hello" } });
  });

  it("refuses a reply this package cannot speak for", async () => {
    const wrong = JSON.stringify({ api_version: API_VERSION + 1, kind: "word", data: "x" });
    const got = await open(answering({ text: wrong }, [])).read("word");
    expect(got).toMatchObject({ ok: false, problem: { kind: "version" } });
  });

  it("reports a refusal as one", async () => {
    const got = await open(answering({ ok: false, status: 401 }, [])).read("status");
    expect(got).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });

  it("reports any other failure as not answering", async () => {
    const got = await open(answering({ ok: false, status: 500 }, [])).read("status");
    expect(got).toMatchObject({ ok: false, problem: { kind: "unreachable" } });
  });

  it("reports a request that never arrived", async () => {
    const refusing: Sending = () => Promise.reject(new Error("no route"));
    const got = await open(refusing).read("status");
    expect(got).toMatchObject({ ok: false, problem: { kind: "unreachable" } });
  });

  it("reports a reply whose body cannot be read", async () => {
    const broken: Sending = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.reject(new Error("the connection went away")),
      });
    const got = await open(broken).read("status");
    expect(got).toMatchObject({ ok: false, problem: { kind: "unreachable" } });
  });
});

describe("act", () => {
  it("posts to the action named after the command", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).act("retry-import", { item: "S03E04" });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/actions/retry-import");
    expect(seen[0]?.method).toBe("POST");
    expect(seen[0]?.headers["Content-Type"]).toBe("application/json");
    expect(seen[0]?.body).toBe(JSON.stringify({ item: "S03E04" }));
  });

  it("posts an empty body when there is nothing to say", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).act("check-everything");
    expect(seen[0]?.body).toBe("{}");
  });

  it("carries the token too", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).act("retry-import");
    expect(seen[0]?.headers[TOKEN_HEADER]).toBe("a-run-token");
  });
});
