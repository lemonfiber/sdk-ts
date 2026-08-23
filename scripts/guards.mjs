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
const fail = (file, line, message) =>
  failures.push(`${relative(ROOT, file)}${line === null ? "" : `:${line}`}  ${message}`);

/**
Markers that open an argument rather than state a fact.
*/
const REASONING =
  /^\s*(?:\/\/|\*|#)\s*(?:because|we |i |the reason|this is why|originally|it turns out|note that|arguably)/i;

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
  });

  if (!file.endsWith(".test.ts") && lines.length > LINE_CAP) {
    fail(file, null, `${lines.length} lines, cap is ${LINE_CAP}`);
  }
}

if (failures.length > 0) {
  console.error(`guards: ${failures.length} violation(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`guards: clean (${files.length} files)`);
