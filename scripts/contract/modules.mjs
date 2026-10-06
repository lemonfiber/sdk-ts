/**
 * One generated module: where it sits, what it imports and what it declares.
 */
import { dirname, posix } from "node:path";
import { linesIn } from "../line-cap.mjs";
import { byCodePoint } from "./artefact.mjs";

/** Where the generated modules are written, relative to the repository. */
export const OUT = "src/generated";

/** The file a module path is written as: `["kinds", "status"]` is `src/generated/kinds/status.ts`. */
export const fileOf = (path) => `${OUT}/${path.join("/")}.ts`;

/** How a module at `from` spells the module at `to` in an import. */
function specifier(from, to) {
  const spelled = posix.relative(dirname(fileOf(from)), fileOf(to)).replace(/\.ts$/, ".js");
  return spelled.startsWith(".") ? spelled : `./${spelled}`;
}

/** How many lines a module holds as written. */
export const lengthOf = (module) => linesIn(sourceOf(module));

/** A module's source as written. */
export function sourceOf(module) {
  const lines = [
    "// Generated from the lemonfiber contract. Do not edit.",
    ...module.summary.split("\n").map((line) => `// ${line}`),
    "// Regenerate with `npm run contract:generate`.",
    "",
  ];
  for (const [target, names] of [...module.imports].toSorted(([a], [b]) => byCodePoint(a, b))) {
    lines.push(`import type { ${[...names].toSorted(byCodePoint).join(", ")} } from "${specifier(module.path, target.split("/"))}";`);
  }
  if (module.imports.size > 0) lines.push("");
  lines.push(...module.body);
  return `${lines.join("\n")}\n`;
}

/** A module handing on every name each of its members declares. */
export const index = (path, summary, members) => ({
  path,
  summary,
  imports: new Map(),
  body: members.map((member) => `export * from "${specifier(path, member)}";`),
});
