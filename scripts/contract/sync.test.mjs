/**
 * Taking the contract out of an archive of one revision, in the layout that
 * revision publishes, and vendoring it in place of the copy before.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";
import { ArtefactRefused } from "./refused.mjs";
import { CODE, artefact, directory, kind, removed, tree } from "./fixtures.mjs";
import { taken, untarred, vendor } from "./sync.mjs";

const REVISION = "0123456789abcdef0123456789abcdef01234567";
const TOP = "lemonfiber-lemonfiber-0123456";

const roots = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => removed(root)));
});

/** One tar header: a name, a size and a type, the rest left as `git archive` leaves it. */
function header(name, size, type, prefix = "") {
  const block = Buffer.alloc(512);
  block.write(name, 0, 100, "utf8");
  block.write("0000644\0", 100);
  block.write(`${size.toString(8).padStart(11, "0")}\0`, 124);
  block.write(type, 156);
  block.write("ustar\0", 257);
  block.write("00", 263);
  block.write(prefix, 345, 155, "utf8");
  return block;
}

/** A record of a pax extended header: its own length, then `key=value` and a newline. */
function paxRecord(key, value) {
  const rest = ` ${key}=${value}\n`;
  let length = rest.length;
  while (`${String(length)}${rest}`.length !== length) length = `${String(length)}${rest}`.length;
  return `${String(length)}${rest}`;
}

/** A gzipped tar archive of entries: `[path, contents, type?, prefix?]`. */
function archive(entries) {
  const blocks = [];
  for (const [path, contents = "", type = "0", prefix = ""] of entries) {
    const body = Buffer.from(contents);
    blocks.push(header(path, body.length, type, prefix), body, Buffer.alloc((512 - (body.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks));
}

/** The archive of a revision holding `files` under `contract/`. */
const revisionOf = (files) =>
  archive([
    ["pax_global_header", paxRecord("comment", REVISION), "g"],
    [`${TOP}/`, "", "5"],
    [`${TOP}/README.md`, "# lemonfiber\n"],
    ...[...files].map(([path, value]) => [`${TOP}/contract/${path}`, typeof value === "string" ? value : JSON.stringify(value)]),
  ]);

/** The directory layout of an artefact, by path under `contract/`. */
const directoryOf = (whole) => new Map([...directory(whole)].map(([file, value]) => [`web-api/${file}`, value]));

/** The sentence taking `archived` is refused with. */
function refusal(archived) {
  let said;
  try {
    taken(untarred(archived), REVISION);
  } catch (error_) {
    expect(error_).toBeInstanceOf(ArtefactRefused);
    said = error_.message;
  }
  expect(said).toBeDefined();
  return said;
}

const WHOLE = artefact({ a: kind({ $ref: "#/$defs/Code" }, { Code: CODE }) }, { reads: [] });

describe("reading an archive", () => {
  it("reads regular files by path, a long path from a pax or GNU header and a ustar prefix, and passes over the rest", () => {
    const long = `${TOP}/contract/web-api/defs/${"L".repeat(120)}.json`;
    const files = untarred(
      archive([
        ["pax_global_header", paxRecord("comment", REVISION), "g"],
        [`${TOP}/`, "", "5"],
        ["PaxHeader", `${paxRecord("mtime", "1")}${paxRecord("path", long)}`, "x"],
        ["truncated-name", "{}"],
        ["././@LongLink", `${TOP}/gnu/${"G".repeat(120)}`, "L"],
        ["truncated-too", "gnu"],
        ["web-api/index.json", "prefixed", "0", `${TOP}/contract`],
        ["PaxHeader", paxRecord("mtime", "1"), "x"],
        [`${TOP}/named.json`, "{}"],
        [`${TOP}/link`, "", "2"],
      ]),
    );
    expect([...files.keys()]).toEqual([long, `${TOP}/gnu/${"G".repeat(120)}`, `${TOP}/contract/web-api/index.json`, `${TOP}/named.json`]);
    expect(files.get(`${TOP}/contract/web-api/index.json`).toString()).toBe("prefixed");
  });

  it("refuses what is not gzip, an archive cut short and a malformed pax header", () => {
    expect(() => untarred(Buffer.from("plain"))).toThrow(/^the archive is not gzip: /);
    const whole = gunzipSync(archive([["a", "x".repeat(2000)]]));
    expect(() => untarred(gzipSync(whole.subarray(0, 1024)))).toThrow("the archive is cut short or holds a malformed header.");
    expect(() => untarred(archive([["PaxHeader", "x path=y\n", "x"]]))).toThrow("the archive holds a malformed pax header.");
  });
});

describe("taking the contract", () => {
  it("takes every file of the directory where the revision holds an index, and leaves a sibling directory alone", () => {
    const files = directoryOf(WHOLE);
    files.set("web-api-surface/index.json", {});
    files.set("web-api.contract.json", WHOLE);
    const contract = taken(untarred(revisionOf(files)), REVISION);
    expect(contract.layout).toBe("web-api");
    expect([...contract.files.keys()].toSorted()).toEqual([
      "web-api/defs/Code.json",
      "web-api/index.json",
      "web-api/kinds/a.json",
      "web-api/reads.json",
    ]);
    expect(contract.apiVersion).toBe(1);
    expect(contract.kinds).toEqual(["a"]);
  });

  it("takes the single file where the revision holds no directory, ending it with a newline", () => {
    const contract = taken(untarred(revisionOf(new Map([["web-api.contract.json", WHOLE]]))), REVISION);
    expect(contract.layout).toBe("web-api.contract.json");
    expect(contract.files.get("web-api.contract.json").toString()).toBe(`${JSON.stringify(WHOLE)}\n`);
    const ended = taken(untarred(revisionOf(new Map([["web-api.contract.json", `${JSON.stringify(WHOLE)}\n`]]))), REVISION);
    expect(ended.files.get("web-api.contract.json").toString()).toBe(`${JSON.stringify(WHOLE)}\n`);
  });

  it("refuses a revision holding no contract, and a single file that is not one", () => {
    expect(refusal(revisionOf(new Map()))).toBe(
      `lemonfiber ${REVISION} holds neither contract/web-api/index.json nor contract/web-api.contract.json.`,
    );
    expect(refusal(revisionOf(new Map([["web-api.contract.json", "{"]])))).toBe(`what ${REVISION} holds at contract/web-api.contract.json is not JSON.`);
    expect(refusal(revisionOf(new Map([["web-api.contract.json", { kinds: {} }]])))).toBe(
      `what ${REVISION} holds at contract/web-api.contract.json is not a contract artefact.`,
    );
  });

  it("refuses a directory with no index, an index that is not one, and one naming a file the directory does not hold", () => {
    const files = directoryOf(WHOLE);
    files.delete("web-api/index.json");
    expect(refusal(revisionOf(files))).toBe(`what ${REVISION} holds at contract/web-api/ has no index.json.`);
    expect(refusal(revisionOf(new Map([["web-api/index.json", { api_version: 1 }]])))).toBe(
      `what ${REVISION} holds at contract/web-api/index.json is not a contract index.`,
    );
    const missing = directoryOf(WHOLE);
    missing.delete("web-api/reads.json");
    missing.set("web-api/index.json", { ...missing.get("web-api/index.json"), kinds: { a: "kinds/a.json", b: "../b.json" } });
    expect(refusal(revisionOf(missing))).toBe(
      `contract/web-api/index.json at ${REVISION} names files it does not hold: "../b.json", "reads.json".`,
    );
  });

  it("refuses a file in the directory that is not JSON, and a path leaving it", () => {
    const files = directoryOf(WHOLE);
    files.set("web-api/defs/Broken.json", "{");
    expect(refusal(revisionOf(files))).toBe(`what ${REVISION} holds at contract/web-api/defs/Broken.json is not JSON.`);
    const leaving = archive([[`${TOP}/contract/web-api/../escape.json`, "{}"]]);
    expect(refusal(leaving)).toBe(`what ${REVISION} holds names "${TOP}/contract/web-api/../escape.json", which leaves contract/web-api/.`);
  });
});

describe("vendoring", () => {
  /** Every file under a tree's `contract/`, by path. */
  const vendored = async (root) =>
    (await readdir(join(root, "contract"), { recursive: true, withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => join(entry.parentPath, entry.name).slice(join(root, "contract").length + 1))
      .toSorted();

  it("replaces a single file with the directory, and a directory with what the revision holds now", async () => {
    const root = await tree(WHOLE);
    roots.push(root);
    await vendor(root, taken(untarred(revisionOf(directoryOf(WHOLE))), REVISION), REVISION);
    expect(await vendored(root)).toEqual(["VERSION", "web-api/defs/Code.json", "web-api/index.json", "web-api/kinds/a.json", "web-api/reads.json"]);
    expect(await readFile(join(root, "contract", "VERSION"), "utf8")).toBe(`${REVISION}\n`);
    const fewer = artefact({ a: kind({ type: "string" }) });
    await vendor(root, taken(untarred(revisionOf(directoryOf(fewer))), REVISION), REVISION);
    expect(await vendored(root)).toEqual(["VERSION", "web-api/index.json", "web-api/kinds/a.json"]);
  });

  it("replaces a directory with the single file, into a tree with no contract yet", async () => {
    const root = await tree(WHOLE, { layout: "directory" });
    roots.push(root);
    await vendor(root, taken(untarred(revisionOf(new Map([["web-api.contract.json", WHOLE]]))), REVISION), REVISION);
    expect(await vendored(root)).toEqual(["VERSION", "web-api.contract.json"]);
    const empty = join(root, "elsewhere");
    await mkdir(empty);
    await writeFile(join(empty, "README.md"), "");
    await vendor(empty, taken(untarred(revisionOf(new Map([["web-api.contract.json", WHOLE]]))), REVISION), REVISION);
    expect(existsSync(join(empty, "contract", "web-api.contract.json"))).toBe(true);
  });
});
