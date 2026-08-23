#!/usr/bin/env node
/**
 * Fetches a release's contract artefact and vendors it.
 *
 * The only step in this package that touches the network. Generation reads the
 * vendored copy, so a build never does.
 *
 * Spec: ARCH-R64, ARCH-R65.  Usage: `npm run contract:sync -- v0.9.0`
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VENDORED = join(ROOT, "contract", "web-api.contract.json");
const STAMP = join(ROOT, "contract", "VERSION");

const asset = (tag) =>
  `https://raw.githubusercontent.com/lemonfiber/lemonfiber/${tag}/contract/web-api.contract.json`;

const tag = process.argv[2];

if (tag === undefined || !/^v\d+\.\d+\.\d+$/.test(tag)) {
  console.error("contract:sync needs a release tag, e.g. `npm run contract:sync -- v0.9.0`");
  process.exit(1);
}

const answer = await fetch(asset(tag));

if (!answer.ok) {
  console.error(`lemonfiber ${tag} has no contract artefact (HTTP ${String(answer.status)}).`);
  process.exit(1);
}

const text = await answer.text();

/** A malformed artefact must not be vendored; the next generate would spread it. */
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  console.error(`what ${tag} served is not JSON.`);
  process.exit(1);
}

if (typeof parsed.api_version !== "number" || typeof parsed.kinds !== "object") {
  console.error(`what ${tag} served is not a contract artefact.`);
  process.exit(1);
}

await mkdir(dirname(VENDORED), { recursive: true });
await writeFile(VENDORED, text.endsWith("\n") ? text : `${text}\n`);
await writeFile(STAMP, `${tag}\n`);

const kinds = Object.keys(parsed.kinds);
console.log(
  `vendored ${tag}: api_version ${String(parsed.api_version)}, ${String(kinds.length)} kinds`,
);
console.log(`  ${kinds.join(", ")}`);
console.log("now run `npm run contract:generate` and commit both.");
