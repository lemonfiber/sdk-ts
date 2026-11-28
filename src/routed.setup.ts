/**
Every request a test's client sends is held to the routes the contract lists:
a call at a method or a path the contract does not give fails the test that
makes it, so a call the client gains is one the contract serves.

Spec: 20-architecture/contracts/web-api.md
*/
import { beforeEach, vi } from "vitest";
import type { Client } from "./client.js";
import { ROUTES } from "./generated/routes.js";

/**
Whether the contract lists a route at `method` whose path `url` fills, one
segment for each `{name}`.
*/
export const isRouted = (method: string, url: string): boolean => {
  const asked = new URL(url).pathname.split("/");
  return ROUTES.some(
    (route) =>
      route.method === method &&
      route.path.split("/").length === asked.length &&
      route.path.split("/").every((part, at) => part === asked[at] || part.startsWith("{")),
  );
};

/**
How each test file's client is opened before its requests are held to the
routes, kept so a second test's hold wraps the first opener and not the hold.
The client is imported once the test file has set up its own modules, so a
module it mocks is the one the client it opens is built on.
*/
const openers = new WeakMap<object, (typeof Client)["at"]>();

beforeEach(async () => {
  const { Client: opened } = await import("./client.js");
  const open = openers.get(opened) ?? opened.at.bind(opened);
  openers.set(opened, open);
  vi.spyOn(opened, "at").mockImplementation((options) =>
    open({
      ...options,
      sending: (url, init) => {
        if (!isRouted(init.method, url))
          throw new Error(`${init.method} ${url} is no route the contract lists`);
        return options.sending(url, init);
      },
    }),
  );
});
