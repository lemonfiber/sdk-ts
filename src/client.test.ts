import { describe, expect, it, vi } from "vitest";
import { Client, type Sending } from "./client.js";
import { refusalIn } from "./refusal.js";
import { API_VERSION } from "./envelope.js";
import { TOKEN_HEADER } from "./credential.js";
import type { ReadQuery, RefusalCode } from "./generated/index.js";
import { refused, tooMany, unreachable, unrecognised } from "./problem.js";

// The vendored contract may list no refusal codes, so these tests read against a
// list of their own, in the shape the generator writes one.
vi.mock("./generated/index.js", async (importOriginal) => {
  const generated = await importOriginal<Record<string, unknown>>();
  const listed: Record<string, { name: string; status: number; description: string }> = {
    "ADMIT-4": {
      name: "NOT_ADMITTED",
      status: 403,
      description: "Raised when a request carried no token or session this run admits.",
    },
    "ADMIT-6": {
      name: "NOT_YOURS",
      status: 403,
      description: "Raised when the account asking may not ask for this.",
    },
    "ADMIT-8": {
      name: "NOT_THE_PASSWORD",
      status: 401,
      description: "Raised when the password offered is not the one.",
    },
    "ADMIT-9": {
      name: "TOO_MANY_ATTEMPTS",
      status: 429,
      description: "Raised when too many wrong passwords were offered lately.",
    },
    "STACK-1": {
      name: "STACK_UNREADABLE",
      status: 500,
      description: "Raised when a stack directory holds no readable manifest.",
    },
    "READ-2": {
      name: "NOTHING_BY_THAT_NAME",
      status: 404,
      description: "Raised when a read named something this product does not have.",
    },
  };
  return {
    ...generated,
    REFUSAL_CODES: listed,
    isRefusalCode: (value: string): value is RefusalCode => Object.hasOwn(listed, value),
  };
});

/**
 * An `error` envelope carrying `data`, as lemonfiber answers a command that ran
 * and failed.
 */
const wentWrong = (data: Record<string, unknown>): string =>
  JSON.stringify({ api_version: API_VERSION, kind: "error", data });

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
    expect(got).toMatchObject({ ok: false, problem: { kind: "configuration" } });
  });

  it.each([
    ["empty", "", "is empty"],
    ["only spaces", " ".repeat(3), "is empty"],
    ["carrying a space", "a token", "cannot carry"],
    ["carrying a line break", "a-token\nX-Other: 1", "cannot carry"],
    ["carrying a character outside ASCII", "tokén", "cannot carry"],
  ])("refuses a token that is %s as configuration", (_n, token, said) => {
    const got = Client.at({ url: "http://127.0.0.1:7777", token, sending: answering({}, []) });
    expect(got).toMatchObject({ ok: false, problem: { kind: "configuration" } });
    expect(got.ok ? "" : got.problem.message).toContain(said);
  });

  it("opens with a token of visible characters", () => {
    const got = Client.at({
      url: "http://127.0.0.1:7777",
      token: "a-run-token_0~!",
      sending: answering({}, []),
    });
    expect(got.ok).toBe(true);
  });
});

describe("read", () => {
  it("asks the endpoint named after the command", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("status");

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/status");
    expect(seen[0]?.method).toBe("GET");
  });

  // The token is a header, never a URL.
  it("sends the token in its header and nowhere else", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("held", { member: "ada" });

    expect(seen[0]?.headers[TOKEN_HEADER]).toBe("a-run-token");
    expect(seen[0]?.url).not.toContain("a-run-token");
  });

  it("turns arguments into query parameters", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("held", { most: 50, defaults: true, member: "ada" });

    expect(seen[0]?.url).toContain("most=50");
    expect(seen[0]?.url).toContain("defaults=true");
    expect(seen[0]?.url).toContain("member=ada");
  });

  // A command's flag given more than once is the same parameter repeated, which is
  // what the server reads as a list.
  it("repeats a parameter once for each value in a list, in order", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("forms", { form: ["library", "watch"] });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/forms?form=library&form=watch");
  });

  it("sends a list of one as the parameter given once", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("forms", { form: ["library"] });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/forms?form=library");
  });

  // A flag given no times is a flag not given; `form=` would be one form with
  // an empty name.
  it("sends nothing for an empty list", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("forms", { form: [] });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/forms");
  });

  it("escapes every value in a list on its own", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("forms", { form: ["a b", "c&d=e"] });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/forms?form=a+b&form=c%26d%3De");
  });

  it("writes numbers and booleans in a list as it writes them alone", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("forms", { form: [5, true] });

    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/forms?form=5&form=true");
  });

  it("leaves out an argument that was not given", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("held", { most: undefined, member: "ada" });

    expect(seen[0]?.url).not.toContain("most");
    expect(seen[0]?.url).toContain("member=ada");
  });

  it("asks for nothing extra when there is nothing to ask", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("status");
    expect(seen[0]?.url).not.toContain("?");
  });

  it("reads the envelope out of the reply", async () => {
    const got = await open(answering({}, [])).read("explain");
    expect(got).toMatchObject({ ok: true, value: { kind: "word", data: "hello" } });
  });

  it("asks for a read at the path the contract lists for it", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("front-door");
    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/front-door");
  });

  it("writes a segment the caller fills into the path, and the rest as parameters", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("held/{id}", { id: "tt0111161", member: "ada" });
    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/held/tt0111161?member=ada");
  });

  // An identifier with a slash in it is still one title, not a path beside it.
  it("escapes a segment so it stays one segment", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("held/{id}", { id: "a/b?c#d" });
    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/held/a%2Fb%3Fc%23d");
  });

  it("writes a number as a segment as it writes it alone", async () => {
    const seen: Seen[] = [];
    await open(answering({}, seen)).read("held/{id}", { id: 42 });
    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/held/42");
  });

  // `.` and `..` are resolved by the URL rather than sent, so they would ask
  // for another path; nothing would ask for the list instead of one title.
  it.each([
    ["not given", {}],
    ["given as nothing", { id: undefined }],
    ["given as a list", { id: ["a", "b"] }],
    ["empty", { id: "" }],
    ["the path's own folder", { id: "." }],
    ["the folder above it", { id: ".." }],
  ])("asks nothing for a segment %s, and says which", async (_what, query) => {
    const seen: Seen[] = [];
    const got = await open(answering({}, seen)).read(
      "held/{id}",
      query as ReadQuery["held/{id}"],
    );
    expect(got).toEqual({
      ok: false,
      problem: {
        kind: "misasked",
        message: "This read needs one `id` it can send, and was not given one.",
      },
    });
    expect(seen).toEqual([]);
  });

  it("refuses an answer of a kind the contract does not list for the read", async () => {
    const got = await open(answering({}, [])).read("status");
    expect(got).toEqual({ ok: false, problem: unrecognised("word") });
  });

  it("refuses a reply this package cannot speak for", async () => {
    const wrong = JSON.stringify({ api_version: API_VERSION + 1, kind: "word", data: "x" });
    const got = await open(answering({ text: wrong }, [])).read("explain");
    expect(got).toMatchObject({ ok: false, problem: { kind: "version" } });
  });

  // 403 is what lemonfiber answers a bad token with — it says so in `serve.rs`:
  // 401 invites a browser to prompt for credentials it has no way to supply. The
  // fixture used to send 401, which the binary never sends, so this passed while a
  // rejected key arrived at a real page as "cannot reach it".
  it("reports the refusal lemonfiber actually sends as one", async () => {
    const got = await open(answering({ ok: false, status: 403 }, [])).read("status");
    expect(got).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });

  it("reports a refusal from something in front of it as one too", async () => {
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

  it("hands the caller the sentence a read was refused with", async () => {
    const said = "That is not a group of checks lemonfiber knows.";
    const got = await open(answering({ ok: false, status: 400, text: said }, [])).read(
      "checks",
      {
        only: "nope",
      },
    );

    expect(got).toEqual({ ok: false, problem: { kind: "misasked", message: said } });
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

// The defect these exist for. lemonfiber answers a refused action with a plain
// sentence saying what was wrong with the request, and that sentence used to be
// dropped: a caller got "lemonfiber is not answering" for a request lemonfiber
// had just answered in words. A test that the call failed would have passed
// throughout, so each of these asserts the sentence itself.
describe("a refusal the caller can read", () => {
  it.each([
    [
      "an action lemonfiber does not offer",
      404,
      "missing",
      "There is no action named `retry-imprt`. This surface offers what the command line offers, and nothing else.",
    ],
    [
      "an argument that was not given",
      400,
      "misasked",
      "The action `config-set` needs `key`, which was not given.",
    ],
    [
      "an argument naming nothing",
      400,
      "misasked",
      "The `preset` given is not one this stack knows: `platnum` — try balanced, high or maximum.",
    ],
  ])("says lemonfiber's own words about %s", async (_what, status, kind, said) => {
    const got = await open(answering({ ok: false, status, text: said }, [])).act("config-set");

    expect(got).toEqual({ ok: false, problem: { kind, message: said } });
  });

  it("says the summary of a command that ran and failed", async () => {
    const said = "Sonarr would not accept the API key this stack holds for it.";
    const envelope = wentWrong({
      code: "service-refused-key",
      summary: said,
      meaning: "Sonarr is running but will not answer for this stack.",
      remedies: [],
      severity: "error",
      state: "actionable",
    });

    const got = await open(answering({ ok: false, status: 500, text: envelope }, [])).act(
      "check-everything",
    );

    expect(got).toEqual({ ok: false, problem: { kind: "failed", message: said } });
  });

  // The key is what a page can do something about; either sentence lemonfiber
  // says here names a symptom of it.
  it("keeps the key's remedy when lemonfiber turns the request away", async () => {
    const said = "This request carried no token, or not this run's.";
    const got = await open(answering({ ok: false, status: 403, text: said }, [])).act("pull");

    expect(got).toEqual({ ok: false, problem: refused() });
  });

  it("does not pass off a page from something in front of lemonfiber as its words", async () => {
    const page = "<html><head><title>502 Bad Gateway</title></head><body>nginx</body></html>";
    const got = await open(answering({ ok: false, status: 502, text: page }, [])).act("pull");

    expect(got).toEqual({
      ok: false,
      problem: { kind: "unreachable", message: expect.any(String) },
    });
  });

  it("reports a failure that said nothing as not answering", async () => {
    const got = await open(answering({ ok: false, status: 500, text: " ".repeat(3) }, [])).act(
      "pull",
    );

    expect(got).toMatchObject({ ok: false, problem: { kind: "unreachable" } });
  });

  it.each([
    ["carries no summary", {}],
    ["carries a summary that is not a sentence", { summary: 7 }],
    ["carries a summary of nothing", { summary: " ".repeat(3) }],
  ])("says nothing for an error envelope that %s", async (_what, data) => {
    const got = await open(
      answering({ ok: false, status: 500, text: wentWrong(data) }, []),
    ).act("pull");

    expect(got).toMatchObject({ ok: false, problem: { kind: "unreachable" } });
  });
});

// What a read could not say before. A word this product does not explain, a form
// no stack declares and a container engine that is not answering were one answer,
// so a caller holding all three had to word a message true of every one of them.
describe("a refusal the caller can tell apart", () => {
  /**
   * The refusal a read carries, in the envelope machine-readable output gives it.
   */
  const said = "`kubernetes` is not one of the words this product explains";
  const entry = wentWrong({
    code: "WORD-1",
    summary: said,
    meaning: "What is explained here is this ecosystem's own vocabulary.",
    remedies: [],
    severity: "error",
    state: "actionable",
  });

  it("reports a name lemonfiber does not have as missing", async () => {
    const got = await open(answering({ ok: false, status: 404, text: entry }, [])).read(
      "explain",
      { word: "kubernetes" },
    );

    expect(got).toEqual({ ok: false, problem: { kind: "missing", message: said } });
  });

  it("does not report a failure of lemonfiber's own as missing", async () => {
    const broke = "The container engine is not answering.";
    const got = await open(
      answering({ ok: false, status: 500, text: wentWrong({ summary: broke }) }, []),
    ).read("status");

    expect(got).toEqual({ ok: false, problem: { kind: "failed", message: broke } });
  });

  // The defect this was written for. A console reading `refused` sends the
  // operator to rotate a key, so a stopped container engine arriving under that
  // kind asked for a credential that was never the problem while the thing that
  // was went unsaid.
  it("does not report a failure of lemonfiber's own as the key being wrong", async () => {
    const broke = "The container engine is not answering.";
    const got = await open(
      answering({ ok: false, status: 500, text: wentWrong({ summary: broke }) }, []),
    ).read("status");

    expect(got).toMatchObject({ ok: false, problem: { kind: "failed" } });
    expect(got).not.toMatchObject({ problem: { kind: refused().kind } });
  });

  // A status this package does not recognise says nothing about the key either.
  // Reading it as one would send an operator after a credential on the word of a
  // status nothing here claims to understand.
  it("reads a status it does not recognise as the answering, not as the key", async () => {
    const said = "Sonarr would not answer.";
    const got = await open(
      answering({ ok: false, status: 503, text: wentWrong({ summary: said }) }, []),
    ).read("status");

    expect(got).toEqual({ ok: false, problem: { kind: "failed", message: said } });
  });

  it("reports a request lemonfiber cannot answer as asked as neither", async () => {
    const needs = "The action `config-set` needs `key`, which was not given.";
    const got = await open(answering({ ok: false, status: 400, text: needs }, [])).act(
      "config-set",
    );

    expect(got).toEqual({ ok: false, problem: { kind: "misasked", message: needs } });
  });

  // A status alone is not lemonfiber saying anything. Whatever stands in front of
  // it answers 404 for a path it does not route, and its page is not this
  // product's account of what there is.
  it("does not pass off a page from something in front of it as a name it has", async () => {
    const page = "<html><head><title>404 Not Found</title></head><body>nginx</body></html>";
    const got = await open(answering({ ok: false, status: 404, text: page }, [])).read(
      "explain",
      { word: "kubernetes" },
    );

    expect(got).toMatchObject({ ok: false, problem: { kind: "unreachable" } });
  });

  // The key is what a page can do something about, and it is not one of these.
  it("keeps a rejected key a refusal and nothing else", async () => {
    const got = await open(answering({ ok: false, status: 403, text: "no" }, [])).read(
      "explain",
      { word: "hardlink" },
    );

    expect(got).toEqual({ ok: false, problem: refused() });
  });
});

// A caller whose answer is not one document reads the status itself, and reads it
// through this rather than through a second copy of which status means which kind.
describe("refusalIn", () => {
  it.each([
    [403, "no", "refused"],
    [404, "There is no action named `retry-imprt`.", "missing"],
    [400, "The action `config-set` needs `key`, which was not given.", "misasked"],
    [405, "That endpoint is not asked with DELETE.", "misasked"],
    [409, "A restart is already running on this stack.", "busy"],
    [429, "Too many wrong passwords lately.", "too-many"],
    [500, "The container engine is not answering.", "failed"],
    [503, "Sonarr would not answer.", "failed"],
  ])("reads a %s carrying words as %s", (status, said, kind) => {
    expect(refusalIn(status, said).kind).toBe(kind);
  });

  it("gives the same reading a read of one document gets", async () => {
    const said = "The container engine is not answering.";
    const got = await open(answering({ ok: false, status: 500, text: said }, [])).read(
      "status",
    );

    expect(got).toEqual({ ok: false, problem: refusalIn(500, said) });
  });

  it("reports an answer holding no sentence as not answering", () => {
    expect(refusalIn(500, " ".repeat(3))).toEqual(unreachable());
  });

  it("carries how long is left where too many attempts said so in seconds", () => {
    const said = "Too many wrong passwords lately.";

    expect(refusalIn(429, said, "30")).toEqual(tooMany(said, 30));
    expect(refusalIn(429, said, " 7 ")).toEqual(tooMany(said, 7));
    expect(refusalIn(429, said, "Wed, 21 Oct 2026 07:28:00 GMT")).toEqual(tooMany(said));
    expect(refusalIn(429, said, null)).toEqual(tooMany(said));
    expect(refusalIn(429, said)).toEqual({ kind: "too-many", message: said });
  });

  it("reads Retry-After off the reply a read was refused with", async () => {
    const said = "Too many wrong passwords lately.";
    const sending: Sending = () =>
      Promise.resolve({
        ok: false,
        status: 429,
        text: () => Promise.resolve(said),
        headers: { get: (name: string) => (name === "Retry-After" ? "12" : null) },
      });

    expect(await open(sending).read("status")).toEqual({
      ok: false,
      problem: tooMany(said, 12),
    });
  });
});

// A status groups refusals and the code tells them apart. Four different facts
// share 403, and only one of them is the key.
describe("a refusal that names why", () => {
  /**
   * The `error` envelope lemonfiber refuses with, naming `code`.
   */
  const refusing = (code: unknown, summary?: string): string =>
    wentWrong({
      code,
      ...(summary !== undefined && { summary }),
      meaning: "The request was not answered.",
      remedies: [],
      severity: "error",
      state: "actionable",
    });

  const turnedAway = (status: number, text: string) =>
    open(answering({ ok: false, status, text }, [])).read("status");

  it("reads the key's code as the key, and carries the code", async () => {
    const got = await turnedAway(403, refusing("ADMIT-4", "This run does not admit you."));

    expect(got).toEqual({ ok: false, problem: { ...refused(), code: "ADMIT-4" } });
  });

  it("reads any other code it turned a request away with as declined, in its words", async () => {
    const said = "That library belongs to another account.";
    const got = await turnedAway(403, refusing("ADMIT-6", said));

    expect(got).toEqual({
      ok: false,
      problem: { kind: "declined", message: said, code: "ADMIT-6" },
    });
  });

  it("reads a wrong password as declined, not as the key", async () => {
    const said = "That is not the password.";
    const got = await turnedAway(401, refusing("ADMIT-8", said));

    expect(got).toEqual({
      ok: false,
      problem: { kind: "declined", message: said, code: "ADMIT-8" },
    });
  });

  it("reads a code the contract does not list by its status alone", async () => {
    const got = await turnedAway(403, refusing("ADMIT-99", "Something new is wrong."));

    expect(got).toEqual({ ok: false, problem: refused() });
  });

  it("reads a turned-away request that said nothing else as the key", async () => {
    const got = await turnedAway(403, "This request carried no token, or not this run's.");

    expect(got).toEqual({ ok: false, problem: refused() });
  });

  it("reads a listed code with no sentence beside it by its status alone", async () => {
    const got = await turnedAway(403, refusing("ADMIT-6"));

    expect(got).toEqual({ ok: false, problem: refused() });
  });

  it("reads a code that is not a string as none", async () => {
    const got = await turnedAway(403, refusing(6, "That library belongs to another account."));

    expect(got).toEqual({ ok: false, problem: refused() });
  });

  it("carries the code on a name lemonfiber does not have", async () => {
    const said = "`kubernetes` is not one of the words this product explains";
    const got = await turnedAway(404, refusing("READ-2", said));

    expect(got).toEqual({
      ok: false,
      problem: { kind: "missing", message: said, code: "READ-2" },
    });
  });

  it("reads too many attempts as `too-many`, carrying the code", async () => {
    const said = "Too many wrong passwords. Wait a minute and try again.";
    const got = await turnedAway(429, refusing("ADMIT-9", said));

    expect(got).toEqual({
      ok: false,
      problem: { kind: "too-many", message: said, code: "ADMIT-9" },
    });
  });

  it("keeps every other status's reading, carrying the code", async () => {
    const said = "The stack directory holds no readable manifest.";
    const got = await turnedAway(500, refusing("STACK-1", said));

    expect(got).toEqual({
      ok: false,
      problem: { kind: "failed", message: said, code: "STACK-1" },
    });
  });

  it.each([
    [403, refused()],
    [500, unreachable()],
  ])("reads an error envelope carrying no payload at %s by its status", (status, problem) => {
    const empty = JSON.stringify({ api_version: API_VERSION, kind: "error", data: null });

    expect(refusalIn(status, empty)).toEqual(problem);
  });
});
