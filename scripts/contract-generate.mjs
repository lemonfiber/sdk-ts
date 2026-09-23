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

/** Keywords that describe a schema without constraining what it matches. */
const ANNOTATIONS = new Set(["description", "title", "default", "examples"]);

/**
 * Every reference in the artefact with a constraint sitting beside it.
 *
 * Draft-07 readers discard whatever accompanies a `$ref` and 2020-12 readers
 * apply both, so the shape means two different things to two readers. This
 * generator is one of them: it keeps the constraint and drops the reference,
 * which turns a variant carrying a whole payload into a type carrying only its
 * tag, and the result compiles.
 */
function* besideAReference(node, path) {
  if (Array.isArray(node)) {
    for (const [at, item] of node.entries())
      yield* besideAReference(item, `${path}/${String(at)}`);
    return;
  }
  if (node === null || typeof node !== "object") return;
  const named = Object.keys(node);
  const constraints = named.filter((key) => key !== "$ref" && !ANNOTATIONS.has(key));
  if (named.includes("$ref") && constraints.length > 0) {
    yield `${path} (${constraints.join(", ")})`;
  }
  for (const [key, value] of Object.entries(node))
    yield* besideAReference(value, `${path}/${key}`);
}

const ambiguous = [...besideAReference(artefact.kinds, "")];

if (ambiguous.length > 0) {
  stop(
    "The vendored contract puts a constraint beside a reference, and generating " +
      "would drop one of the two:\n  " +
      ambiguous.join("\n  "),
  );
}

// By code point, not by locale. This order is the order of the declarations in
// a file that is committed and diffed, so it has to be the same on every machine
// that regenerates it — and `localeCompare` is the one comparison that is not.
const kinds = Object.keys(artefact.kinds).sort((a, b) => (a < b ? -1 : 1));

if (kinds.length === 0) stop("The vendored contract describes no kinds.");

/** PascalCase, so `walkthrough` becomes `Walkthrough`. */
const typeName = (kind) =>
  kind
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

/** The `Kind` union, as one line of source. */
const quoted = (names) =>
  `export type Kind = ${names.map((name) => JSON.stringify(name)).join(" | ")};`;

const parts = [
  "// Generated from the lemonfiber contract. Do not edit.",
  `// Source: ${stamp}  ·  api_version ${String(artefact.api_version)}`,
  "// Regenerate with `npm run contract:generate`.",
  "",
];

const definitionsOf = (kind) => artefact.kinds[kind].$defs ?? {};

/**
 * The names this file writes itself, and what each one means here.
 *
 * Every definition hoisted out of a kind's `$defs` lands in this module's one
 * scope, beside these four and one `…Envelope` per kind. Nothing coordinates
 * the two authorities writing into it — the contract names its definitions and
 * this generator names its own — so a definition taking one of these names is
 * emitted twice under it.
 */
const OWNED = new Map([
  ["Contract", "the object every kind hangs off"],
  ["Kind", "the union of every kind the server may send"],
  ["ByKind", "the envelope each kind carries"],
  ["CONTRACT_API_VERSION", "the wire version these types were generated for"],
  ...kinds.map((kind) => [`${typeName(kind)}Envelope`, `the envelope carrying \`${kind}\``]),
]);

const taken = kinds.flatMap((kind) =>
  Object.keys(definitionsOf(kind))
    .filter((name) => OWNED.has(name))
    .map((name) => `${name}, defined by \`${kind}\` — here it names ${OWNED.get(name)}`),
);

/**
 * Refuses a name the contract and this generator both claim, naming both.
 *
 * `a_definition_name_describes_one_shape` is the producer's rule, and this is
 * where the generated file is held to it rather than assuming it. Emitting both
 * is worse than refusing: `tsc` reports a duplicate identifier in a file nobody
 * edits, the union becomes an error type, and every use of it downstream fails
 * for a reason none of those errors mentions. One rename is the fix and none of
 * the errors asks for it.
 *
 * The name moves in the contract rather than here. All five are this package's
 * published surface — `Kind` and `ByKind` are what a caller writes
 * `<K extends Kind>` against — so moving one of them instead would break every
 * caller to spare the producer a rename.
 */
if (taken.length > 0) {
  stop(
    "The vendored contract defines a type under a name this generator writes " +
      "itself, and emitting both would put two shapes under one name:\n  " +
      taken.join("\n  ") +
      "\n\nRename the definition in the contract.",
  );
}

/**
 * Every kind compiled together, rather than one at a time.
 *
 * Compiled separately, a definition two kinds both carry is emitted once per
 * kind — a duplicate identifier, and the result does not build. Compiled
 * together the generator sees every name at once.
 */
const shared = {};
const carried = {};

for (const kind of kinds) {
  // The schema's own `title` would name every kind's envelope `Envelope`; the
  // property name carries the kind instead. Its definitions are hoisted to the
  // one shared set, so they do not travel with the body either.
  const body = Object.fromEntries(
    Object.entries(artefact.kinds[kind]).filter(
      ([named]) => named !== "title" && named !== "$defs",
    ),
  );

  // Under the name the artefact gives it, with nothing added. This used to
  // prefix every name two kinds described differently, because `State` was
  // eight shapes across eleven kinds and sharing them by name handed one kind
  // another's. The producer names each type for itself now and holds itself to
  // it — `a_definition_name_describes_one_shape` — so a name is a type again
  // and the same name twice is the same definition twice.
  for (const [name, definition] of Object.entries(definitionsOf(kind))) {
    shared[name] = definition;
  }
  carried[kind] = body;
}

parts.push(
  (
    await compile(
      {
        title: "Contract",
        type: "object",
        properties: carried,
        required: kinds,
        additionalProperties: false,
        $defs: shared,
      },
      "Contract",
      { bannerComment: "", additionalProperties: false, style: { singleQuote: false } },
    )
  ).trim(),
  "",
);

/** The envelope each kind carries, under the name this package has always used. */
for (const kind of kinds) {
  parts.push(
    `/** The envelope carrying \`${kind}\`. */`,
    `export type ${typeName(kind)}Envelope = Contract[${JSON.stringify(kind)}];`,
    "",
  );
}

parts.push(
  "/** Every kind the server may send. */",
  quoted(kinds),
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
