import { describe, expect, it } from "vitest";
import { address } from "./address.js";

describe("address", () => {
  it.each([
    ["http://127.0.0.1:7777", "http://127.0.0.1:7777"],
    ["http://127.0.0.1:7777/", "http://127.0.0.1:7777"],
    ["http://localhost:7777", "http://localhost:7777"],
    ["http://[::1]:7777", "http://[::1]:7777"],
    ["http://127.1.2.3:9000", "http://127.1.2.3:9000"],
    ["https://localhost:7777", "https://localhost:7777"],
    ["http://lemonfiber.localhost:7777", "http://lemonfiber.localhost:7777"],
  ])("accepts %s", (given, expected) => {
    const got = address(given);
    expect(got.ok).toBe(true);
    if (!got.ok) return;
    expect(got.base).toBe(expected);
  });

  it("keeps a path prefix but drops its trailing slash", () => {
    const got = address("http://127.0.0.1:7777/lemonfiber/");
    expect(got.ok).toBe(true);
    if (!got.ok) return;
    expect(got.base).toBe("http://127.0.0.1:7777/lemonfiber");
  });

  it.each([
    ["a public name", "http://example.com:7777"],
    ["a private address", "http://192.168.1.10:7777"],
    ["every interface", "http://0.0.0.0:7777"],
    ["a near miss", "http://127.example.com:7777"],
    ["loopback mapped into IPv6", "http://[::ffff:127.0.0.1]:7777"],
  ])("refuses %s", (_name, given) => {
    expect(address(given)).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });

  it("refuses something that is not an address at all", () => {
    expect(address("not an address")).toMatchObject({
      ok: false,
      problem: { kind: "refused" },
    });
  });

  it.each([
    ["a scheme it does not speak", "ftp://127.0.0.1:7777"],
    ["a websocket scheme", "ws://127.0.0.1:7777"],
  ])("refuses %s", (_name, given) => {
    expect(address(given)).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });

  it.each([
    ["credentials", "http://user:pass@127.0.0.1:7777"],
    ["a query string", "http://127.0.0.1:7777?token=secret"],
    ["a fragment", "http://127.0.0.1:7777#somewhere"],
  ])("refuses an address carrying %s", (_name, given) => {
    expect(address(given)).toMatchObject({ ok: false, problem: { kind: "refused" } });
  });
});
