#!/usr/bin/env node
/**
 * Writes this package's types from the vendored contract.
 *
 * Offline and deterministic: same artefact in, same file out, so CI can
 * regenerate and fail on any difference.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VENDORED = join(ROOT, "contract", "web-api.contract.json");
const STAMP = join(ROOT, "contract", "VERSION");
const OUT = join(ROOT, "src", "generated", "contract.ts");

/** The wire version this package implements. */
const SPOKEN = 1;

const stop = (message) => {
  console.error(message);
  process.exit(1);
};

const artefact = JSON.parse(await readFile(VENDORED, "utf8")).valueOf();
const stamp = (await readFile(STAMP, "utf8").catch(() => "unknown\n")).trim();

/**
 * Refuses a version this package does not implement, naming both.
 *
 * Generating anyway would emit types that compile and lie.
 */
if (artefact.api_version !== SPOKEN) {
  stop(
    `The vendored contract is api_version ${String(artefact.api_version)}, ` +
      `and this package implements ${String(SPOKEN)}. ` +
      `Sync a matching release, or implement the newer version first.`,
  );
}

const kinds = Object.keys(artefact.kinds).sort();

if (kinds.length === 0) stop("The vendored contract describes no kinds.");

/** PascalCase, so `walkthrough` becomes `Walkthrough`. */
const typeName = (kind) =>
  kind
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const parts = [
  "// Generated from the lemonfiber contract. Do not edit.",
  `// Source: ${stamp}  ·  api_version ${String(artefact.api_version)}`,
  "// Regenerate with `npm run contract:generate`.",
  "",
];

for (const kind of kinds) {
  // The schema's own `title` would name every kind's envelope `Envelope`, so
  // six kinds would emit six colliding declarations. The kind names it instead.
  const { title: _ignored, ...schema } = artefact.kinds[kind];

  const compiled = await compile(schema, `${typeName(kind)}Envelope`, {
    bannerComment: "",
    additionalProperties: false,
    style: { singleQuote: false },
  });
  parts.push(compiled.trim(), "");
}

parts.push(
  "/** Every kind the server may send. */",
  `export type Kind = ${kinds.map((k) => `"${k}"`).join(" | ")};`,
  "",
  "/** The envelope carrying each kind, so a payload is typed by what it is. */",
  "export interface ByKind {",
  ...kinds.map((k) => `  ${JSON.stringify(k)}: ${typeName(k)}Envelope;`),
  "}",
  "",
  "/** The wire version these types were generated for. */",
  `export const CONTRACT_API_VERSION = ${String(artefact.api_version)};`,
  "",
);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, parts.join("\n"));

console.log(`generated ${kinds.length} kinds from ${stamp} -> src/generated/contract.ts`);
