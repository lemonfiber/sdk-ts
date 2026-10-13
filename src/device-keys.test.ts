import { generateKeyPairSync, sign, verify } from "node:crypto";
import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { TOKEN_HEADER } from "./credential.js";
import { API_VERSION } from "./envelope.js";
import { base64url, signedText, type Mint } from "./keys.js";
import { unrecognised } from "./problem.js";

interface Seen {
  url: string;
  method: string;
  body: string | undefined;
  token: string | undefined;
}

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

const mint: Mint = { name: "den", scope: "act", purpose: "mcp" };

describe("bytes sent in a body", () => {
  it("are written in base64url with only the padding dropped", () => {
    expect(base64url(new Uint8Array([1]))).toBe("AQ");
    expect(base64url(new Uint8Array([251, 255]))).toBe("-_8");
    expect(base64url(new Uint8Array([0, 0, 23]))).toBe("AAAX");
    expect(base64url(new Uint8Array([]))).toBe("");
  });
});

describe("the device keys", () => {
  it("are registered with the public half and the attestation in base64url, and the password", async () => {
    const seen: Seen[] = [];
    const got = await open(answering("device-key", {}, seen)).registerDeviceKey({
      name: "pixel",
      publicKey: new Uint8Array([48, 255, 254]),
      attestation: { platform: "ios", object: "o2M" },
      password: "the operator's",
    });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/device-keys");
    expect(seen[0]?.method).toBe("POST");
    expect(JSON.parse(seen[0]?.body ?? "")).toStrictEqual({
      name: "pixel",
      public_key: "MP_-",
      attestation: { platform: "ios", object: "o2M" },
      password: "the operator's",
    });
    expect(got.ok).toBe(true);
  });

  it("are listed, and say an answer of another kind is not theirs", async () => {
    const seen: Seen[] = [];
    const listed = await open(answering("device-keys", {}, seen)).deviceKeys();
    expect(listed.ok).toBe(true);
    expect(seen[0]?.method).toBe("GET");
    expect(await open(answering("keys", {}, [])).deviceKeys()).toStrictEqual({
      ok: false,
      problem: unrecognised("keys"),
    });
  });

  it("are challenged and revoked by name, sent as one path segment", async () => {
    const seen: Seen[] = [];
    await open(answering("device-challenge", {}, seen)).deviceKeyChallenge("pixel/8");
    await open(answering("device-keys", {}, seen)).revokeDeviceKey("pixel 8");

    expect(seen.map(({ url, method }) => [method, url])).toStrictEqual([
      ["POST", "http://127.0.0.1:7777/api/device-keys/pixel%2F8/challenge"],
      ["DELETE", "http://127.0.0.1:7777/api/device-keys/pixel%208"],
    ]);
  });

  it("prove a mint with a signature over the text the stack verifies, and no password", async () => {
    const seen: Seen[] = [];
    const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
    const text = signedText(mint, "a-challenge", true) ?? "";
    const signature = base64url(sign("sha256", Buffer.from(text), privateKey));
    await open(answering("key-claim", {}, seen)).mintClaim({
      ...mint,
      device: "pixel",
      challenge: "a-challenge",
      signature,
    });
    const sent = JSON.parse(seen[0]?.body ?? "") as Record<string, unknown>;

    expect(text).toBe("lemonfiber-mint/1\na-challenge\nden\nact\nmcp\nclaim\n");
    expect(sent).not.toHaveProperty("password");
    expect(sent).toMatchObject({ device: "pixel", challenge: "a-challenge", claim: true });
    expect(signature).toMatch(/^[\w-]+$/u);
    expect(
      verify(
        "sha256",
        Buffer.from(text),
        publicKey,
        Buffer.from(String(sent["signature"]), "base64url"),
      ),
    ).toBe(true);
  });

  it("spell a key mint as key, and nothing for a part holding a line feed", () => {
    expect(signedText(mint, "c", false)).toBe("lemonfiber-mint/1\nc\nden\nact\nmcp\nkey\n");
    expect(signedText({ ...mint, name: "den\nact" }, "c", false)).toBeUndefined();
    expect(signedText(mint, "c\nden", false)).toBeUndefined();
  });
});
