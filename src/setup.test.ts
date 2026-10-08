import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { TOKEN_HEADER } from "./credential.js";
import { API_VERSION } from "./envelope.js";
import type { SetupAnswerBody } from "./generated/index.js";
import { unrecognised } from "./problem.js";

interface Seen {
  url: string;
  method: string;
  body: string | undefined;
  token: string | undefined;
}

/**
A `fetch` that records what it was asked and answers with one envelope, as
many times as it is asked.
*/
function answering(kind: string, data: unknown, seen: Seen[], status = 200): Sending {
  return (url, init) => {
    seen.push({ url, method: init.method, body: init.body, token: init.headers[TOKEN_HEADER] });
    return Promise.resolve({
      ok: status < 400,
      status,
      text: () => Promise.resolve(JSON.stringify({ api_version: API_VERSION, kind, data })),
    });
  };
}

const open = (sending: Sending): Client => {
  const got = Client.at({ url: "http://127.0.0.1:7777", token: "a-run-token", sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

/**
Where setup stands, as lemonfiber says it; the client hands it on whole.
*/
const standing = { step: "protocols", answers: {} };

const answer: SetupAnswerBody = { protocols: { torrent: true, usenet: false } };

describe("walking setup", () => {
  it("asks where setup stands, with the token as a header and nothing sent", async () => {
    const seen: Seen[] = [];
    const got = await open(answering("wizard", standing, seen)).setup();

    expect(seen).toStrictEqual([
      {
        url: "http://127.0.0.1:7777/api/setup",
        method: "GET",
        body: undefined,
        token: "a-run-token",
      },
    ]);
    expect(got).toStrictEqual({
      ok: true,
      value: { api_version: API_VERSION, kind: "wizard", data: standing },
    });
  });

  it("sends an answer as the body, tagged by the question it answers", async () => {
    const seen: Seen[] = [];
    const got = await open(answering("wizard", standing, seen)).setupAnswer(answer);

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/setup/answer");
    expect(seen[0]?.method).toBe("POST");
    expect(seen[0]?.body).toBe('{"protocols":{"torrent":true,"usenet":false}}');
    expect(got.ok).toBe(true);
  });

  it.each([
    ["setupNext", "/api/setup/next"],
    ["setupBack", "/api/setup/back"],
    ["setupApply", "/api/setup/apply"],
  ] as const)("takes %s at its own route, sending nothing", async (step, path) => {
    const seen: Seen[] = [];
    const got = await open(answering("wizard", standing, seen))[step]();

    expect(seen).toStrictEqual([
      {
        url: `http://127.0.0.1:7777${path}`,
        method: "POST",
        body: undefined,
        token: "a-run-token",
      },
    ]);
    expect(got.ok).toBe(true);
  });

  it("sends the way out of an interrupted apply as a named choice", async () => {
    const seen: Seen[] = [];
    await open(answering("wizard", standing, seen)).setupRecover("roll-back");

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/setup/recover");
    expect(seen[0]?.body).toBe('{"choice":"roll-back"}');
  });

  it("says an answer of another kind is not where setup stands", async () => {
    const got = await open(answering("word", "hello", [])).setupApply();
    expect(got).toStrictEqual({ ok: false, problem: unrecognised("word") });
  });

  // A step changes what setup has written, so a passing failure is reported
  // rather than sent again.
  it("asks a step once, and passes its refusal on as it was read", async () => {
    const seen: Seen[] = [];
    const said = { code: "SETUP-3", message: "Setup is not on that question." };
    const got = await open(answering("error", said, seen, 409)).setupNext();

    expect(seen).toHaveLength(1);
    expect(got.ok).toBe(false);
  });
});
