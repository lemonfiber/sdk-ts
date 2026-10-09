import { describe, expect, it } from "vitest";
import { Client, type Minting, type Sending } from "./client.js";
import { TOKEN_HEADER } from "./credential.js";
import { API_VERSION } from "./envelope.js";
import { unrecognised } from "./problem.js";

interface Seen {
  url: string;
  method: string;
  body: string | undefined;
  token: string | undefined;
}

/**
A `fetch` that records what it was asked and answers with one envelope.
*/
function answering(kind: string, data: unknown, seen: Seen[]): Sending {
  return (url, init) => {
    seen.push({ url, method: init.method, body: init.body, token: init.headers[TOKEN_HEADER] });
    return Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ api_version: API_VERSION, kind, data })),
    });
  };
}

const open = (sending: Sending): Client => {
  const got = Client.at({ url: "http://127.0.0.1:7777", token: "a-run-token", sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

const listing = {
  keys: [
    {
      name: "home",
      scope: "read",
      purpose: "home-assistant",
      state: "active",
      minted: "1790000000",
      member_minted: false,
    },
  ],
  purposes: "What each key is for is the minter's own word.",
  rehearsed: false,
};

const minted = {
  name: "home",
  scope: "read",
  purpose: "home-assistant",
  secret: "lfk_once",
  pin: "sha256:ab12",
  address: "https://192.0.2.10:7777",
};

const minting: Minting = {
  name: "home",
  scope: "read",
  purpose: "home-assistant",
  password: "the operator's",
};

describe("the integration keys", () => {
  it("are listed from the keys route, with the token as a header", async () => {
    const seen: Seen[] = [];
    const got = await open(answering("keys", listing, seen)).keys();

    expect(seen[0]).toStrictEqual({
      url: "http://127.0.0.1:7777/api/keys",
      method: "GET",
      body: undefined,
      token: "a-run-token",
    });
    expect(got).toStrictEqual({
      ok: true,
      value: { api_version: API_VERSION, kind: "keys", data: listing },
    });
  });

  it("are minted with the password in the body, and the secret comes back once", async () => {
    const seen: Seen[] = [];
    const got = await open(answering("minted-key", minted, seen)).mint(minting);

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/keys");
    expect(seen[0]?.method).toBe("POST");
    expect(seen[0]?.body).toBe(JSON.stringify(minting));
    expect(got.ok && got.value.data.secret).toBe("lfk_once");
  });

  it("are revoked by name, sent as one path segment", async () => {
    const seen: Seen[] = [];
    const got = await open(answering("keys", listing, seen)).revoke("home/assistant");

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/keys/home%2Fassistant");
    expect(seen[0]?.method).toBe("DELETE");
    expect(got.ok).toBe(true);
  });

  it("say an answer of another kind is not theirs", async () => {
    const got = await open(answering("word", "hello", [])).mint(minting);
    expect(got).toStrictEqual({ ok: false, problem: unrecognised("word") });
  });

  it("pass a refusal on as it was read", async () => {
    const said = "A key named `home` already exists.";
    const sending: Sending = () =>
      Promise.resolve({ ok: false, status: 400, text: () => Promise.resolve(said) });
    const got = await open(sending).mint(minting);
    expect(got.ok).toBe(false);
    expect(!got.ok && got.problem.message).toBe(said);
  });
});
