/** Reading the commit lemonfiber-web pins this package at. */
import { describe, expect, it } from "vitest";
import { pinIn, pinnedBy } from "./pin.mjs";

const NAME = "@lemonfiber/sdk-ts";
const COMMIT = "162952039f7406fff7cafab99067ddb394301194";

describe("the pin", () => {
  it("reads a full commit from the dependencies or the development dependencies", () => {
    expect(
      pinIn({ dependencies: { [NAME]: `github:lemonfiber/sdk-ts#${COMMIT}` } }, NAME),
    ).toBe(COMMIT);
    expect(pinIn({ devDependencies: { [NAME]: `lemonfiber/sdk-ts#${COMMIT}` } }, NAME)).toBe(
      COMMIT,
    );
  });

  it.each([
    ["no pin", {}, "undefined"],
    [
      "a branch",
      { dependencies: { [NAME]: "github:lemonfiber/sdk-ts#main" } },
      '"github:lemonfiber/sdk-ts#main"',
    ],
    [
      "a short commit",
      { dependencies: { [NAME]: "github:lemonfiber/sdk-ts#1629520" } },
      '"github:lemonfiber/sdk-ts#1629520"',
    ],
    [
      "another repository",
      { dependencies: { [NAME]: `github:someone/sdk-ts#${COMMIT}` } },
      `"github:someone/sdk-ts#${COMMIT}"`,
    ],
  ])("refuses %s, naming what it found", (_what, manifest, found) => {
    expect(() => pinIn(manifest, NAME)).toThrow(
      `lemonfiber/lemonfiber-web's package.json pins ${NAME} at ${found}, which names no full commit`,
    );
  });

  it("asks GitHub for the manifest, with the token where one is given, and refuses an answer that is not one", async () => {
    const asked = [];
    const answering = (ok, body) => async (url, init) => {
      asked.push([url, init.headers.Authorization]);
      return { ok, status: ok ? 200 : 404, json: async () => body };
    };
    const manifest = { dependencies: { [NAME]: `github:lemonfiber/sdk-ts#${COMMIT}` } };
    expect(await pinnedBy(NAME, "secret", answering(true, manifest))).toBe(COMMIT);
    expect(await pinnedBy(NAME, undefined, answering(true, manifest))).toBe(COMMIT);
    await expect(pinnedBy(NAME, undefined, answering(false, {}))).rejects.toThrow(
      "package.json answered 404",
    );
    expect(asked).toEqual([
      [
        "https://api.github.com/repos/lemonfiber/lemonfiber-web/contents/package.json",
        "Bearer secret",
      ],
      [
        "https://api.github.com/repos/lemonfiber/lemonfiber-web/contents/package.json",
        undefined,
      ],
      [
        "https://api.github.com/repos/lemonfiber/lemonfiber-web/contents/package.json",
        undefined,
      ],
    ]);
  });
});
