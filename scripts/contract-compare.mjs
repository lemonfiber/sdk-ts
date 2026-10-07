#!/usr/bin/env node
/**
 * Compares the copy of the contract under one tree's `contract/` with the copy
 * under another's, and says each way they differ.
 *
 * Exits 0 when they are the same contract, 1 when they differ, and 2 when either
 * copy cannot be read.
 *
 * Usage: `node scripts/contract-compare.mjs <vendored-tree> <served-tree>`
 */
import { resolve } from "node:path";
import { differences } from "./contract/compare.mjs";

const [ours, theirs] = process.argv.slice(2);

if (ours === undefined || theirs === undefined) {
  console.error("contract-compare needs two trees: the vendored one, then the served one.");
  process.exit(2);
}

let lines;
try {
  lines = await differences(resolve(ours), resolve(theirs));
} catch (error_) {
  console.error(
    `contract-compare: ${error_ instanceof Error ? error_.message : String(error_)}`,
  );
  process.exit(2);
}

for (const line of lines) console.log(line);
process.exitCode = lines.length === 0 ? 0 : 1;
