import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { TOKEN_HEADER } from "./credential.js";
import { API_VERSION, isKind } from "./envelope.js";
import { unrecognised } from "./problem.js";

interface Seen {
  url: string;
  method: string;
  body: string | undefined;
  token: string | undefined;
}

const example = (kind: string): string =>
  readFileSync(
    new URL(`../contract/web-api/examples/kinds/${kind}.json`, import.meta.url),
    "utf8",
  );

function answering(said: string, seen: Seen[], status = 200): Sending {
  return (url, init) => {
    seen.push({ url, method: init.method, body: init.body, token: init.headers[TOKEN_HEADER] });
    return Promise.resolve({
      ok: status < 300,
      status,
      text: () => Promise.resolve(said),
    });
  };
}

const open = (sending: Sending): Client => {
  const got = Client.at({ url: "http://127.0.0.1:7777", token: "a-run-token", sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

const asked = (seen: Seen[]) => seen.map(({ method, url }) => [method, url]);

describe("the push endpoints", () => {
  it("are listed as the contract's example lists them, with the whole address", async () => {
    const seen: Seen[] = [];
    const listed = await open(answering(example("push-endpoints"), seen)).pushEndpoints.list();

    expect(asked(seen)).toStrictEqual([["GET", "http://127.0.0.1:7777/api/push-endpoints"]]);
    expect(seen[0]?.token).toBe("a-run-token");
    expect(listed.ok && listed.value.data.endpoints).toStrictEqual([
      {
        endpoint: "https://push.example/send/a-phone",
        name: "a-phone",
        registered: 1_893_456_000,
      },
    ]);
  });

  it("are registered with the name, the address, the key and the secret", async () => {
    const seen: Seen[] = [];
    const registering = {
      name: "a-phone",
      endpoint: "https://push.example/send/a-phone",
      p256dh: "BNc",
      auth: "tBH",
    };
    const got = await open(answering(example("push-endpoint"), seen)).pushEndpoints.register(
      registering,
    );

    expect(asked(seen)).toStrictEqual([["POST", "http://127.0.0.1:7777/api/push-endpoints"]]);
    expect(JSON.parse(seen[0]?.body ?? "")).toStrictEqual(registering);
    expect(got.ok && got.value.data.name).toBe("a-phone");
  });

  it("are removed by name, sent as one path segment, and say an answer of another kind is not theirs", async () => {
    const seen: Seen[] = [];
    const removed = await open(answering(example("push-endpoints"), seen)).pushEndpoints.remove(
      "a phone/2",
    );

    expect(asked(seen)).toStrictEqual([
      ["DELETE", "http://127.0.0.1:7777/api/push-endpoints/a%20phone%2F2"],
    ]);
    expect(removed.ok).toBe(true);
    expect(
      await open(answering(example("push-endpoint"), [])).pushEndpoints.list(),
    ).toStrictEqual({ ok: false, problem: unrecognised("push-endpoint") });
  });
});

describe("the capabilities", () => {
  it("are read as the contract's example says them, scoped to the credential", async () => {
    const seen: Seen[] = [];
    const got = await open(answering(example("capabilities"), seen)).capabilities();

    expect(asked(seen)).toStrictEqual([["GET", "http://127.0.0.1:7777/api/capabilities"]]);
    expect(got.ok && got.value.data.capabilities["/api/actions/accept"]).toBe("available");
    expect(got.ok && got.value.data.scope).toBe(
      (JSON.parse(example("capabilities")) as { data: { scope: string } }).data.scope,
    );
  });
});

describe("a job", () => {
  it("is asked about by name, still going as the accepting reply said", async () => {
    const seen: Seen[] = [];
    const got = await open(answering(example("job"), seen, 202)).jobs.about("6162636465666768");

    expect(asked(seen)).toStrictEqual([
      ["GET", "http://127.0.0.1:7777/api/jobs/6162636465666768"],
    ]);
    expect(got.ok && isKind(got.value, "job")).toBe(true);
  });

  it("is released by name, sent as one path segment, and answered as ended", async () => {
    const seen: Seen[] = [];
    const got = await open(answering(example("ended"), seen)).jobs.release("a job/1");

    expect(asked(seen)).toStrictEqual([
      ["DELETE", "http://127.0.0.1:7777/api/jobs/a%20job%2F1"],
    ]);
    expect(got.ok && isKind(got.value, "ended") && got.value.data.ended).toBe("released");
  });

  it("is forgotten by name, sent as one path segment, and answered as asking would be", async () => {
    const seen: Seen[] = [];
    const got = await open(answering(example("job"), seen, 202)).jobs.forget("a job/1");

    expect(asked(seen)).toStrictEqual([
      ["POST", "http://127.0.0.1:7777/api/jobs/a%20job%2F1/forget"],
    ]);
    expect(got.ok && isKind(got.value, "job")).toBe(true);
  });

  it("is missing where this run never issued its name", async () => {
    const said = "No work in this run goes by that name.";
    const refused = JSON.stringify({
      api_version: API_VERSION,
      kind: "error",
      data: {
        code: "ASK-7",
        summary: said,
        meaning: "A job was asked about that this run did not start.",
        remedies: [],
        severity: "error",
        state: "actionable",
      },
    });
    const got = await open(answering(refused, [], 404)).jobs.release("gone");

    expect(got).toMatchObject({ ok: false, problem: { kind: "missing", message: said } });
  });
});

describe("a name a caller hands over", () => {
  it.each([
    ["a slash", "../a/b", "..%2Fa%2Fb"],
    ["a percent", "50%", "50%25"],
    ["a question mark", "a?b=c", "a%3Fb%3Dc"],
    ["a hash", "a#b", "a%23b"],
  ])("holding %s is sent as one path segment", async (_, name, segment) => {
    const seen: Seen[] = [];
    const client = open(answering(example("job"), seen, 202));
    await client.jobs.forget(name);
    await client.pushEndpoints.remove(name);

    expect(asked(seen)).toStrictEqual([
      ["POST", `http://127.0.0.1:7777/api/jobs/${segment}/forget`],
      ["DELETE", `http://127.0.0.1:7777/api/push-endpoints/${segment}`],
    ]);
  });

  it.each([[""], ["."], [".."]])("%j is refused, and nothing is sent", async (name) => {
    const seen: Seen[] = [];
    const client = open(answering(example("job"), seen));
    const calls = [
      () => client.jobs.about(name),
      () => client.jobs.release(name),
      () => client.jobs.forget(name),
      () => client.revoke(name),
      () => client.deviceKeyChallenge(name),
      () => client.revokeDeviceKey(name),
      () => client.pushEndpoints.remove(name),
      () => client.bundle(name),
    ];
    for (const call of calls) {
      expect(await call()).toMatchObject({ ok: false, problem: { kind: "misasked" } });
    }
    expect(seen).toStrictEqual([]);
  });
});
