/**
 * How the artefact's words are spelled in TypeScript: names, modules, comments
 * and literals.
 */
import { refuse } from "./refused.mjs";

/** PascalCase, so `front-door` becomes `FrontDoor` and `whole_stack` `WholeStack`. */
export const pascal = (text) =>
  text
    .split(/[^A-Za-z0-9]+/)
    .filter((part) => part !== "")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

/** Where a word begins inside a PascalCase name: `ValueOrigin` splits before `Origin`. */
const WORD_START = /(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g;

/** A kind or a PascalCase name as a module: `front-door` and `FrontDoor` are both `front-door`. */
export const moduleName = (word) => word.replaceAll(WORD_START, "-").replaceAll("_", "-").toLowerCase();

/** Whether a key can be written as a property name without quotes. */
const isPropertyName = (key) => /^[A-Za-z_$][\w$]*$/.test(key);

/** A key as a property is written: bare where it can be, quoted where it cannot. */
export const property = (key) => (isPropertyName(key) ? key : JSON.stringify(key));

/**
 * A description as a doc comment that reads back as the same text.
 *
 * A star followed by a slash in the text would close the comment, so each one is
 * written with a backslash between the two.
 */
export function comment(text, indent) {
  const lines = text.trim().replaceAll("*/", String.raw`*\/`).split("\n");
  if (lines.length === 1) return [`${indent}/** ${lines[0]} */`];
  return [
    `${indent}/**`,
    ...lines.map((line) => (line === "" ? `${indent} *` : `${indent} * ${line}`)),
    `${indent} */`,
  ];
}

/** A JSON value as the TypeScript literal type it is. */
export function literal(value) {
  if (typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (Number.isInteger(value)) return String(value);
  return refuse(`a constant of ${JSON.stringify(value)} has no TypeScript literal`);
}
