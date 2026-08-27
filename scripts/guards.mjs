#!/usr/bin/env node
/**
Structural guards. Collects every violation, then exits non-zero.
*/
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const LINE_CAP = 550;

/**
Every file under `dir`, recursively.
*/
async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(path)));
    else found.push(path);
  }
  return found;
}

const failures = [];
const at = (line) => (line === null ? "" : `:${String(line)}`);
const fail = (file, line, message) =>
  failures.push(`${relative(ROOT, file)}${at(line)}  ${message}`);

/**
Markers that open an argument rather than state a fact.
*/
const REASONING =
  /^\s*(?:\/\/|\*|#)\s*(?:because|we |i |the reason|this is why|originally|it turns out|note that|arguably)/i;

/**
A requirement identifier, which belongs in a commit trailer and a pull request
rather than beside the code it once explained.
*/
const IDENTIFIER = /\b[A-Z][A-Z0-9]*-R\d+\b/;
const COMMENT = /^\s*(?:\/\/|\*|\/\*)/;

const files = (await walk(SRC)).filter((f) => !f.includes("/generated/"));

for (const file of files) {
  const text = await readFile(file, "utf8");
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    const at = index + 1;

    // A client library reaches whatever address its caller gives it, and no
    // address of its own.
    if (
      /https?:\/\//.test(line) &&
      !/^\s*(?:\/\/|\*)/.test(line) &&
      !file.endsWith(".test.ts")
    ) {
      fail(file, at, "a hardcoded address");
    }

    if (/eslint-disable/.test(line)) fail(file, at, "eslint-disable");
    if (/@ts-(?:ignore|expect-error|nocheck)/.test(line))
      fail(file, at, "TypeScript escape hatch");

    // Comments state facts. Reasoning belongs in an ADR.
    if (REASONING.test(line))
      fail(file, at, "reasoning in a comment — state the fact, argue in the ADR");

    if (COMMENT.test(line) && IDENTIFIER.test(line))
      fail(file, at, "a requirement identifier in a comment — cite it in the commit");
  });

  if (!file.endsWith(".test.ts") && lines.length > LINE_CAP) {
    fail(file, null, `${lines.length} lines, cap is ${LINE_CAP}`);
  }
}

// The scripts are not part of what ships, so the rules about addresses and
// shape do not reach them. The identifier rule does, and so does the one below.
const scripts = (await walk(join(ROOT, "scripts"))).filter((f) => f.endsWith(".mjs"));

/**
Ways a script could reach the network.
*/
const REACHES = /\bfetch\s*\(|\bnode:https?\b|\bhttps?:\/\//;

/**
The one script that may, and why.

Vendoring is the act of fetching: it takes the artefact from an exact revision
and writes it down beside the copy, which is the whole point of there being a
copy. Generating is the other half and reads what vendoring left — so a
generator that fetched would produce types from whatever the server happens to
serve today, which is not what this package was built against and not what its
consumers were told they had.
*/
const MAY_REACH = "contract-sync.mjs";

let sawGenerator = false;

for (const file of scripts) {
  const text = await readFile(file, "utf8");
  // A test names a URL as data — a `$schema` in a fixture is not a reach — and
  // the rule is about what generation does, not about what a test says.
  const vendoring = file.endsWith(MAY_REACH) || file.endsWith(".test.mjs");
  if (file.endsWith("contract-generate.mjs")) sawGenerator = true;
  text.split("\n").forEach((line, index) => {
    if (COMMENT.test(line) && IDENTIFIER.test(line))
      fail(file, index + 1, "a requirement identifier in a comment — cite it in the commit");
    if (!vendoring && !COMMENT.test(line) && REACHES.test(line))
      fail(file, index + 1, `reaches the network; only ${MAY_REACH} may`);
  });
}

// What this is reading, asserted before what it found. A generator that has been
// renamed leaves the rule above matching nothing, and the failure is silence: the
// guard goes on passing about a file it can no longer see.
if (!sawGenerator) fail(join(ROOT, "scripts"), null, "no generator here to hold offline");
if (!scripts.some((f) => f.endsWith(MAY_REACH)))
  fail(join(ROOT, "scripts"), null, `${MAY_REACH} is excepted and does not exist`);

if (failures.length > 0) {
  console.error(`guards: ${failures.length} violation(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`guards: clean (${files.length + scripts.length} files)`);
