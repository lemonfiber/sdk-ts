#!/usr/bin/env node
/**
 * Fetches the contract artefact at one revision of lemonfiber and vendors it.
 *
 * The only step in this package that touches the network. Generation reads the
 * vendored copy, so a build never does.
 *
 * A revision is a release tag or a full commit hash. Both name one artefact,
 * so the vendored bytes can be checked against what that revision served.
 *
 * Usage: `npm run contract:sync -- v1.0.0`
 *        `npm run contract:sync -- d2bf74b950a9f6fb73f2bcd60e2d8adf85337cd6`
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VENDORED = join(ROOT, "contract", "web-api.contract.json");
const STAMP = join(ROOT, "contract", "VERSION");

const RELEASE_TAG = /^v\d+\.\d+\.\d+$/;
const COMMIT = /^[0-9a-f]{40}$/;

const asset = (revision) =>
  `https://raw.githubusercontent.com/lemonfiber/lemonfiber/${revision}/contract/web-api.contract.json`;

const revision = process.argv[2];

/** An abbreviated hash is refused: it names one artefact today and may not later. */
if (revision === undefined || !(RELEASE_TAG.test(revision) || COMMIT.test(revision))) {
  console.error(
    "contract:sync needs a release tag or a full 40-character commit hash,\n" +
      "e.g. `npm run contract:sync -- v1.0.0`",
  );
  process.exit(1);
}

const answer = await fetch(asset(revision));

if (!answer.ok) {
  console.error(
    `lemonfiber ${revision} has no contract artefact (HTTP ${String(answer.status)}).`,
  );
  process.exit(1);
}

const text = await answer.text();

/** A malformed artefact must not be vendored; the next generate would spread it. */
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  console.error(`what ${revision} served is not JSON.`);
  process.exit(1);
}

if (typeof parsed.api_version !== "number" || typeof parsed.kinds !== "object") {
  console.error(`what ${revision} served is not a contract artefact.`);
  process.exit(1);
}

await mkdir(dirname(VENDORED), { recursive: true });
await writeFile(VENDORED, text.endsWith("\n") ? text : `${text}\n`);
await writeFile(STAMP, `${revision}\n`);

const kinds = Object.keys(parsed.kinds);
console.log(
  `vendored ${revision}: api_version ${String(parsed.api_version)}, ${String(kinds.length)} kinds`,
);
console.log(`  ${kinds.join(", ")}`);
console.log("now run `npm run contract:generate` and commit both.");
