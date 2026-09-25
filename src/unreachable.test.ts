import { describe, expect, it } from "vitest";
import { Client } from "./client.js";
import { follow } from "./events.js";
import { unreachable } from "./problem.js";

/**
 * An address on this machine that nothing listens on.
 *
 * Port 1 is TCPMUX, which neither a developer machine nor a CI runner serves, so a
 * connection to it is refused at once rather than waited on.
 */
const NOTHING_LISTENS = "http://127.0.0.1:1";

/**
 * A client asking that address through the platform's own `fetch`.
 */
function askingNothing(): Client {
  const opened = Client.at({ url: NOTHING_LISTENS, token: "a-run-token", sending: fetch });
  if (!opened.ok) throw new Error(opened.problem.message);
  return opened.client;
}

// The platform's `fetch` rejects a refused connection with a `TypeError` rather
// than answering, and every call that sends reads that as lemonfiber not
// answering: the kind `sdk-php` raises as `Unreachable`.
describe("an address nothing listens on, asked through the platform's fetch", () => {
  it("answers a read with lemonfiber not answering", async () => {
    expect(await askingNothing().read("status")).toEqual({ ok: false, problem: unreachable() });
  });

  it("answers an action with lemonfiber not answering", async () => {
    expect(await askingNothing().act("restart")).toEqual({ ok: false, problem: unreachable() });
  });

  it("answers live updates with a stream lost for want of an answer", async () => {
    const stream = follow({
      url: `${NOTHING_LISTENS}/api/events`,
      token: "a-run-token",
      fetching: fetch,
    });

    expect(await stream.next()).toEqual({
      done: false,
      value: { at: "lost", problem: unreachable() },
    });
    expect(await stream.next()).toEqual({ done: true, value: undefined });
  });
});
