#!/usr/bin/env node
/**
 * Fetches the contract at one revision of lemonfiber and vendors it.
 *
 * The only step in this package that touches the network. Generation reads the
 * vendored copy, so a build never does.
 *
 * A revision is a release tag or a full commit hash. Both name one artefact,
 * so the vendored bytes can be checked against what that revision served. The
 * archive of that revision is fetched whole, and the contract is taken from it in
 * the layout it is in there: the directory `contract/web-api/`, or the single
 * file `contract/web-api.contract.json`.
 *
 * The copy goes into this repository's `contract/`. With `--served` it goes into
 * `contract/` under `.contract-served/` instead, which is how the drift check and
 * the bump take the server's copy to compare against. The destination is one of
 * those two and never a path from the command line, so nothing outside them is
 * written or removed.
 *
 * Usage: `npm run contract:sync -- v1.0.0`
 *        `npm run contract:sync -- d2bf74b950a9f6fb73f2bcd60e2d8adf85337cd6`
 *        `node scripts/contract-sync.mjs <revision> --served`
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ArtefactRefused } from "./contract/refused.mjs";
import { taken, untarred, vendor } from "./contract/sync.mjs";
import { DIRECTORY, SERVED } from "./contract/vendored.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const RELEASE_TAG = /^v\d+\.\d+\.\d+$/;
const COMMIT = /^[0-9a-f]{40}$/;

/** The archive of one revision. It is served directly, so a redirect is refused rather than followed. */
const archive = (revision) =>
  `https://codeload.github.com/lemonfiber/lemonfiber/tar.gz/${revision}`;

const [asked = "", where, ...rest] = process.argv.slice(2);

if ((where !== undefined && where !== "--served") || rest.length > 0) {
  console.error(
    "contract:sync takes a revision, and `--served` after it to vendor into .contract-served/.",
  );
  process.exit(1);
}

const into = where === undefined ? ROOT : join(ROOT, SERVED);

/** An abbreviated hash is refused: it names one artefact today and may not later. */
const matched = RELEASE_TAG.exec(asked) ?? COMMIT.exec(asked);
if (matched === null) {
  console.error(
    "contract:sync needs a release tag or a full 40-character commit hash,\n" +
      "e.g. `npm run contract:sync -- v1.0.0`",
  );
  process.exit(1);
}

// What travels on is the matched text rather than the argument: it can only be a
// release tag or forty hex characters, which is what makes it safe to put in a
// URL, a file and a log line.
const revision = matched[0];

let answer;
try {
  answer = await fetch(archive(revision), { redirect: "error" });
} catch (error_) {
  console.error(`lemonfiber ${revision} could not be fetched: ${String(error_)}`);
  process.exit(1);
}

if (!answer.ok) {
  console.error(`lemonfiber ${revision} has no archive (HTTP ${String(answer.status)}).`);
  process.exit(1);
}

/** A malformed artefact must not be vendored; the next generate would spread it. */
let contract;
try {
  contract = taken(untarred(Buffer.from(await answer.arrayBuffer())), revision);
} catch (error_) {
  if (!(error_ instanceof ArtefactRefused)) throw error_;
  console.error(`contract:sync: refused, and nothing was written. ${error_.message}`);
  process.exit(1);
}

await vendor(into, contract, revision);

const layout =
  contract.layout === DIRECTORY
    ? `contract/${DIRECTORY}/, ${String(contract.files.size)} files`
    : "one file";
console.log(
  `vendored ${revision} as ${layout}: api_version ${String(contract.apiVersion)}, ${String(contract.kinds.length)} kinds`,
);
console.log(`  ${contract.kinds.join(", ")}`);
if (into === ROOT) console.log("now run `npm run contract:generate` and commit both.");
