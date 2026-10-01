import { createServer as createHttpServer, type Server as HttpServer } from "node:http";
import { createServer as createTcpServer, type Server as TcpServer } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { Client } from "./client.js";
import { API_VERSION } from "./envelope.js";
import { follow, TOKEN_HEADER, type Arrival, type Fetching } from "./events.js";
import { problem, unreachable } from "./problem.js";

/**
 * The token the stack printed, and nowhere else is meant to see.
 */
const TOKEN = "the-stacks-own-token";

/**
 * Everything a test opened, so each one is closed however the test ends.
 */
const opened: (HttpServer | TcpServer)[] = [];

afterEach(async () => {
  await Promise.all(
    opened.splice(0).map(
      (server) =>
        new Promise<void>((done) => {
          server.close(() => {
            done();
          });
        }),
    ),
  );
});

/**
 * Where a server is listening, once it is.
 */
async function portOf(server: HttpServer | TcpServer, host: string): Promise<number> {
  opened.push(server);
  await new Promise<void>((done) => {
    server.listen(0, host, done);
  });
  const bound = server.address();
  if (bound === null || typeof bound === "string") throw new Error("the server took no port");
  return bound.port;
}

/**
 * Somewhere that is not the stack, counting every connection made to it.
 *
 * A connection is counted before anything is read from it, so a request that
 * reached it by any scheme at all is one it has counted.
 */
interface Elsewhere {
  url: string;
  connections: () => number;
}

async function elsewhere(scheme: "http" | "https", host: string): Promise<Elsewhere> {
  let connections = 0;
  const server = createTcpServer((socket) => {
    connections += 1;
    socket.destroy();
  });
  const port = await portOf(server, host);
  const named = host.includes(":") ? `[${host}]` : host;

  return {
    url: `${scheme}://${named}:${String(port)}/api/events`,
    connections: () => connections,
  };
}

/**
 * A stack, and the token each request it was sent carried.
 */
interface Pointing {
  base: string;
  tokens: (string | undefined)[];
}

async function stackPointingAt(location: string): Promise<Pointing> {
  const tokens: (string | undefined)[] = [];
  const server = createHttpServer((request, response) => {
    const token = request.headers[TOKEN_HEADER.toLowerCase()];
    tokens.push(typeof token === "string" ? token : undefined);
    response.writeHead(302, { Location: location });
    response.end();
  });
  const port = await portOf(server, "127.0.0.1");

  return { base: `http://127.0.0.1:${String(port)}`, tokens };
}

/**
 * A stack answering the stream with one status and then ending it.
 */
async function stackStreaming(): Promise<Pointing> {
  const tokens: (string | undefined)[] = [];
  const server = createHttpServer((request, response) => {
    const token = request.headers[TOKEN_HEADER.toLowerCase()];
    tokens.push(typeof token === "string" ? token : undefined);
    response.writeHead(200, { "Content-Type": "text/event-stream" });
    response.end(
      `id: 1\nevent: status\ndata: ${JSON.stringify({ api_version: API_VERSION, kind: "status", data: { free: 1 } })}\n\n`,
    );
  });
  const port = await portOf(server, "127.0.0.1");

  return { base: `http://127.0.0.1:${String(port)}`, tokens };
}

/**
 * The platform's own `fetch`, which is what a browser and Node both hand in.
 */
const fetching: Fetching = (url, init) => fetch(url, init);

const firstOf = async <T>(
  stream: AsyncGenerator<Arrival<T>>,
): Promise<Arrival<T> | undefined> => {
  const step = await stream.next();
  await stream.return(undefined);
  return step.done === true ? undefined : step.value;
};

const somewhereElse: [string, () => Promise<Elsewhere>][] = [
  ["another port", () => elsewhere("http", "127.0.0.1")],
  ["another host", () => elsewhere("http", "::1")],
  ["another scheme", () => elsewhere("https", "127.0.0.1")],
];

describe("an answer pointing away from the stack", () => {
  it.each(somewhereElse)("is not followed to %s by a read", async (_, making) => {
    const target = await making();
    const stack = await stackPointingAt(target.url);
    const opened = Client.at({ url: stack.base, token: TOKEN, sending: fetch });
    if (!opened.ok) throw new Error(opened.problem.message);

    expect(await opened.client.read("status")).toEqual({ ok: false, problem: unreachable() });
    // A refused redirect arrives as nothing, which a read asks again, so the
    // stack may be asked more than once. Every asking went to the stack.
    expect(new Set(stack.tokens)).toEqual(new Set([TOKEN]));
    expect(target.connections()).toBe(0);
  });

  it.each(somewhereElse)("is not followed to %s by live updates", async (_, making) => {
    const target = await making();
    const stack = await stackPointingAt(target.url);

    const first = await firstOf(
      follow({ url: `${stack.base}/api/events`, token: TOKEN, fetching, reconnectsAllowed: 0 }),
    );

    expect(first).toEqual({ at: "lost", problem: unreachable() });
    // A refused redirect arrives as nothing, which a read asks again, so the
    // stack may be asked more than once. Every asking went to the stack.
    expect(new Set(stack.tokens)).toEqual(new Set([TOKEN]));
    expect(target.connections()).toBe(0);
  });
});

describe("live updates at an address", () => {
  it("reach the stack at the address they were given, carrying its token", async () => {
    const stack = await stackStreaming();

    const first = await firstOf(
      follow<{ free: number }>({ url: `${stack.base}/api/events`, token: TOKEN, fetching }),
    );

    expect(first).toEqual({ at: "live", kind: "status", data: { free: 1 } });
    expect(stack.tokens).toEqual([TOKEN]);
  });

  it.each([
    [
      "on another machine",
      "http://example.com:7777/api/events",
      "“example.com” is somewhere else",
    ],
    [
      "on another private address",
      "http://192.168.1.10:7777/api/events",
      "“192.168.1.10” is somewhere else",
    ],
    ["over another scheme", "ftp://127.0.0.1:7777/api/events", "not ftp:"],
    [
      "carrying sign-in details",
      "http://someone:secret@127.0.0.1:7777/api/events",
      "more than an address",
    ],
    ["carrying a query", "http://127.0.0.1:7777/api/events?token=x", "more than an address"],
    ["that is not an address", "not an address", "is not an address"],
  ])("are refused %s, and nothing is sent", async (_, url, said) => {
    const asked: string[] = [];
    const recording: Fetching = (to) => {
      asked.push(to);
      return Promise.resolve({ ok: false, status: 404, body: null });
    };

    const stream = follow({ url, token: TOKEN, fetching: recording });
    const first = await stream.next();

    expect(first).toMatchObject({
      done: false,
      value: { at: "lost", problem: { kind: "refused" } },
    });
    expect(first.value?.at === "lost" ? first.value.problem.message : "").toContain(said);
    expect(await stream.next()).toEqual({ done: true, value: undefined });
    expect(asked).toEqual([]);
  });

  it("say which address was refused in the words a client being opened would", async () => {
    const url = "http://example.com:7777/api/events";

    expect(await firstOf(follow({ url, token: TOKEN, fetching }))).toEqual({
      at: "lost",
      problem: problem(
        "refused",
        "lemonfiber runs on this machine, and “example.com” is somewhere else.",
      ),
    });
    expect(Client.at({ url, token: TOKEN, sending: fetch })).toEqual({
      ok: false,
      problem: problem(
        "refused",
        "lemonfiber runs on this machine, and “example.com” is somewhere else.",
      ),
    });
  });
});
