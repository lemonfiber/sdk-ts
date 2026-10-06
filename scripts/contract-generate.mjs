#!/usr/bin/env node
/**
 * Writes `src/generated/` from the vendored contract; `scripts/contract/` does it.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "./contract/index.mjs";

process.exitCode = await run(join(dirname(fileURLToPath(import.meta.url)), ".."));
