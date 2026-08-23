/**
 * Where lemonfiber is, and the refusal to talk anywhere else.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { problem, type Problem } from "./problem.js";

/**
 * Whether a host is loopback without asking a resolver.
 *
 * A browser cannot resolve names, so a named host is judged by whether it is a
 * loopback name rather than by what it resolves to. The server's own `Host` and
 * `Origin` check is what catches a name pointed elsewhere.
 */
function isLoopbackHost(host: string): boolean {
  const bare = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;

  if (bare === "localhost" || bare.endsWith(".localhost")) return true;
  if (bare === "::1") return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(bare)) return true;

  return false;
}

export type Address = { ok: true; base: string } | { ok: false; problem: Problem };

/**
 * Reads a base address, refusing anything not on this machine.
 *
 * Credentials in the address are refused outright: this client sends its token
 * in a header, and an address carrying one has come from somewhere unexpected.
 */
export function address(given: string): Address {
  let url: URL;

  try {
    url = new URL(given);
  } catch {
    return { ok: false, problem: problem("refused", `“${given}” is not an address.`) };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return {
      ok: false,
      problem: problem("refused", `lemonfiber is reached over http, not ${url.protocol}`),
    };
  }

  if (url.username !== "" || url.password !== "" || url.search !== "" || url.hash !== "") {
    return {
      ok: false,
      problem: problem("refused", "That address carries more than an address."),
    };
  }

  if (!isLoopbackHost(url.hostname)) {
    return {
      ok: false,
      problem: problem(
        "refused",
        `lemonfiber runs on this machine, and “${url.hostname}” is somewhere else.`,
      ),
    };
  }

  return { ok: true, base: `${url.origin}${url.pathname.replace(/\/$/, "")}` };
}
