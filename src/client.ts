/**
 * Asking lemonfiber for something, and telling it to do something.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { address } from "./address.js";
import { parse, type Envelope, type Reading } from "./envelope.js";
import { TOKEN_HEADER } from "./events.js";
import { refused, unreachable, type Problem } from "./problem.js";

/**
 * What a query parameter may carry. A value that is `undefined` is not sent.
 */
export type Query = Record<string, string | number | boolean | undefined>;

/**
 * The slice of `fetch` this needs, so a test can supply its own.
 */
export type Sending = (
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string },
) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;

export interface Talking {
  /**
   * Where lemonfiber is listening, as it printed the address.
   */
  url: string;
  /**
   * The token lemonfiber printed when it started serving.
   */
  token: string;
  sending: Sending;
}

export type Opened = { ok: true; client: Client } | { ok: false; problem: Problem };

/**
 * Talks to one running lemonfiber.
 *
 * Every reply is read through the envelope, so a version this package cannot
 * speak is refused rather than half-understood.
 */
export class Client {
  readonly #base: string;
  readonly #token: string;
  readonly #sending: Sending;

  private constructor(base: string, token: string, sending: Sending) {
    this.#base = base;
    this.#token = token;
    this.#sending = sending;
  }

  /**
   * Opens a client, refusing an address that is not on this machine.
   */
  static at(options: Talking): Opened {
    const where = address(options.url);
    if (!where.ok) return { ok: false, problem: where.problem };

    if (options.token.trim() === "") {
      return {
        ok: false,
        problem: refused(),
      };
    }

    return { ok: true, client: new Client(where.base, options.token, options.sending) };
  }

  /**
   * Asks for what a command would print under `--json`.
   */
  async read<T>(endpoint: string, query: Query = {}): Promise<Reading<Envelope<T>>> {
    return this.#ask<T>("GET", `/api/${endpoint}${search(query)}`);
  }

  /**
   * Tells lemonfiber to do something the command line could also do.
   */
  async act<T>(
    name: string,
    body: Record<string, unknown> = {},
  ): Promise<Reading<Envelope<T>>> {
    return this.#ask<T>("POST", `/api/actions/${name}`, JSON.stringify(body));
  }

  async #ask<T>(method: string, path: string, body?: string): Promise<Reading<Envelope<T>>> {
    const headers: Record<string, string> = {
      [TOKEN_HEADER]: this.#token,
      Accept: "application/json",
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let answer;
    try {
      answer = await this.#sending(`${this.#base}${path}`, {
        method,
        headers,
        ...(body !== undefined && { body }),
      });
    } catch {
      return { ok: false, problem: unreachable() };
    }

    if (!answer.ok) {
      // 403, not 401: lemonfiber answers a bad token with the status that does not
      // invite a browser to prompt for credentials it has no way to supply. Reading
      // 401 here meant a rejected key arrived as "cannot reach it", so a page that
      // should have asked for the key again reported the server down instead.
      return { ok: false, problem: wasTurnedAway(answer.status) ? refused() : unreachable() };
    }

    try {
      return parse<T>(await answer.text());
    } catch {
      return { ok: false, problem: unreachable() };
    }
  }
}

/**
 * Whether a status is lemonfiber saying the key is wrong.
 *
 * Both are read: 403 is what it answers with, and 401 is what a proxy in front of
 * it may answer with instead.
 */
const wasTurnedAway = (status: number): boolean => status === 403 || status === 401;

/**
 * A query string, or nothing when there is nothing to ask for.
 *
 * The token is never among these: a credential in a URL reaches logs, history
 * and referrers.
 */
function search(query: Query): string {
  const parts = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) parts.set(key, String(value));
  }

  const text = parts.toString();
  return text === "" ? "" : `?${text}`;
}
