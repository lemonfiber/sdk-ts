/**
 * The contract artefact, held to everything the generator relies on.
 */
import { refuse } from "./refused.mjs";
import { pascal } from "./spelling.mjs";

/** The wire version this package implements. */
export const SPOKEN = 1;

/** Keywords that describe a schema without constraining what it matches. */
export const ANNOTATIONS = new Set(["description", "title", "default", "examples", "$comment"]);

/** A kind, as the core spells one: `front-door`. */
const KIND = /^[a-z][a-z0-9_-]*$/;

/** A problem code, as the core spells one: `ADMIT-4`. */
const CODE = /^[A-Z][A-Z0-9]*-\d+$/;

/** A registry name, as the core spells one: `NOT_ADMITTED`. */
const SCREAMING_SNAKE = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;

/** Whether a decoded JSON value is an object rather than an array or a scalar. */
export const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** By code point rather than by locale, so every machine writes the same order. */
export const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/**
 * Every reference in the artefact with a constraint sitting beside it.
 *
 * Draft-07 readers discard whatever accompanies a `$ref` and 2020-12 readers
 * apply both, so the shape means two different things to two readers.
 */
function* besideAReference(node, path) {
  if (Array.isArray(node)) {
    for (const [at, item] of node.entries()) yield* besideAReference(item, `${path}/${String(at)}`);
    return;
  }
  if (!isRecord(node)) return;
  const named = Object.keys(node);
  const constraints = named.filter((key) => key !== "$ref" && !ANNOTATIONS.has(key));
  if (named.includes("$ref") && constraints.length > 0) yield `${path} (${constraints.join(", ")})`;
  for (const [key, value] of Object.entries(node)) yield* besideAReference(value, `${path}/${key}`);
}

/** Refuses a version this package does not speak and a shape two readers read two ways. */
export function checked(artefact) {
  if (artefact.api_version !== SPOKEN) {
    refuse(
      `The vendored contract is api_version ${JSON.stringify(artefact.api_version)}, ` +
        `and this package implements ${String(SPOKEN)}. ` +
        "Sync a matching release, or implement the newer version first.",
    );
  }
  const ambiguous = [...besideAReference(kindsOf(artefact), "")];
  if (ambiguous.length > 0) {
    refuse(
      "The vendored contract puts a constraint beside a reference, and generating " +
        "would drop one of the two:\n  " +
        ambiguous.join("\n  "),
    );
  }
}

/** The artefact's kinds, by name, refusing an artefact describing none. */
export function kindsOf(artefact) {
  const kinds = artefact.kinds;
  if (!isRecord(kinds) || Object.keys(kinds).length === 0) {
    refuse("The vendored contract describes no kinds.");
  }
  const spelled = new Map();
  for (const kind of Object.keys(kinds).toSorted(byCodePoint)) {
    if (!KIND.test(kind)) {
      refuse(`The kind ${JSON.stringify(kind)} is not lowercase letters, digits, hyphens and underscores.`);
    }
    if (!isRecord(kinds[kind])) {
      refuse(`The kind \`${kind}\` is ${JSON.stringify(kinds[kind])}, which is not an envelope's schema.`);
    }
    const name = `${pascal(kind)}Envelope`;
    if (spelled.has(name)) {
      refuse(`The kinds \`${spelled.get(name)}\` and \`${kind}\` would both be written as \`${name}\`.`);
    }
    spelled.set(name, kind);
  }
  return kinds;
}

/** Each definition's name, to every kind whose definitions carry it. */
export function usersOf(kinds) {
  const users = new Map();
  for (const [kind, schema] of Object.entries(kinds)) {
    for (const name of Object.keys(schema.$defs ?? {})) {
      if (!users.has(name)) users.set(name, new Set());
      users.get(name).add(kind);
    }
  }
  return users;
}

/**
 * Everything wrong with one listed refusal, as lines naming its code.
 *
 * The status is one a refusal is answered with, so a 2xx or a 3xx listed here is
 * a listing that says a success refuses.
 */
function* wrongWith(code, entry) {
  if (!CODE.test(code)) yield `${JSON.stringify(code)}: not a code, which is a prefix and a number`;
  if (!isRecord(entry)) {
    yield `${code}: not an object`;
    return;
  }
  if (typeof entry.name !== "string" || !SCREAMING_SNAKE.test(entry.name))
    yield `${code}: name ${JSON.stringify(entry.name)} is not SCREAMING_SNAKE`;
  if (!Number.isInteger(entry.status) || entry.status < 400 || entry.status > 599)
    yield `${code}: status ${JSON.stringify(entry.status)} is not a refusal's status`;
  if (typeof entry.description !== "string" || entry.description.trim() === "")
    yield `${code}: description ${JSON.stringify(entry.description)} is not a sentence`;
}

/**
 * The codes a refusal may carry, as the contract lists them, or none.
 *
 * An artefact older than the list has no `refusals`, and reads as listing no code
 * rather than as an error, so a consumer compiles against every artefact.
 */
export function refusalsOf(artefact) {
  const listed = Object.hasOwn(artefact, "refusals") ? artefact.refusals : {};
  if (!isRecord(listed)) {
    refuse(
      `The vendored contract's refusals are ${JSON.stringify(listed)}, and they are ` +
        "an object keyed by code.",
    );
  }
  const codes = Object.keys(listed).toSorted(byCodePoint);
  const malformed = codes.flatMap((code) => [...wrongWith(code, listed[code])]);
  // One name under two codes leaves a caller looking a refusal up by name with two answers.
  const namedBy = new Map();
  for (const code of codes) {
    const name = listed[code]?.name;
    if (typeof name !== "string") continue;
    if (namedBy.has(name)) malformed.push(`${code}: name ${name} is also the name of ${namedBy.get(name)}`);
    else namedBy.set(name, code);
  }
  if (malformed.length > 0) {
    refuse(
      "The vendored contract lists a refusal this generator cannot write:\n  " + malformed.join("\n  "),
    );
  }
  return listed;
}

/** Why one entry of the actions a key may call cannot be written, one reason at a time. */
function* wrongWithAction(entry, at) {
  if (!isRecord(entry)) {
    yield `entry ${String(at)}: not an object`;
    return;
  }
  if (typeof entry.action !== "string" || !/^[a-z][a-z0-9-]*$/.test(entry.action))
    yield `entry ${String(at)}: action ${JSON.stringify(entry.action)} is not an action's name`;
  for (const flag of ["disturbs", "rehearsal", "idempotent"]) {
    if (typeof entry[flag] !== "boolean")
      yield `entry ${String(at)}: ${flag} ${JSON.stringify(entry[flag])} is not true or false`;
  }
}

/**
 * The actions an integration key may call, as the contract lists them, in its
 * order, or none.
 *
 * An artefact older than the list has no `key_callable`, and reads as listing no
 * action rather than as an error, so a consumer compiles against every artefact.
 */
export function keyCallableOf(artefact) {
  const listed = Object.hasOwn(artefact, "key_callable") ? artefact.key_callable : [];
  if (!Array.isArray(listed)) {
    refuse(
      `The vendored contract's key_callable is ${JSON.stringify(listed)}, and it is a list of actions.`,
    );
  }
  const malformed = listed.flatMap((entry, at) => [...wrongWithAction(entry, at)]);
  const seen = new Set();
  for (const entry of listed) {
    if (!isRecord(entry) || typeof entry.action !== "string") continue;
    if (seen.has(entry.action)) malformed.push(`${entry.action}: listed twice`);
    seen.add(entry.action);
  }
  if (malformed.length > 0) {
    refuse(
      "The vendored contract lists an action a key may call that this generator cannot write:\n  " +
        malformed.join("\n  "),
    );
  }
  return listed;
}

/** A read's path: segments under `/api`, a `{name}` segment standing for one the caller fills. */
const READ_PATH = /^\/api(?:\/(?:[a-z][a-z0-9-]*|\{[a-z]+\}))+$/;

/** A query parameter's name, as a command's flag is spelled. */
const PARAMETER = /^[a-z][a-z0-9_]*$/;

/** The name a read goes by: its path under `/api`, without the segments a caller fills. */
export const readNameOf = (path) =>
  path
    .slice("/api/".length)
    .split("/")
    .filter((segment) => !segment.startsWith("{"))
    .join("/");

/** Why one read cannot be written, one reason at a time. */
function* wrongWithRead(entry, at, kinds) {
  if (!isRecord(entry)) {
    yield `read ${String(at)}: not an object`;
    return;
  }
  const where = typeof entry.path === "string" ? entry.path : `read ${String(at)}`;
  if (typeof entry.path !== "string" || !READ_PATH.test(entry.path)) yield `${where}: path ${JSON.stringify(entry.path)} is not one under /api`;
  if (typeof entry.file !== "boolean") yield `${where}: file ${JSON.stringify(entry.file)} is not true or false`;
  if (!Array.isArray(entry.kinds) || entry.kinds.some((kind) => typeof kind !== "string" || !Object.hasOwn(kinds, kind))) {
    yield `${where}: kinds ${JSON.stringify(entry.kinds)} are not kinds the contract describes`;
  } else if ((entry.kinds.length === 0) !== (entry.file === true)) {
    yield `${where}: a read answers with a file or with kinds, and this one says ${JSON.stringify(entry.kinds)} with file ${String(entry.file)}`;
  }
  if (!Array.isArray(entry.parameters)) {
    yield `${where}: parameters ${JSON.stringify(entry.parameters)} are not a list`;
    return;
  }
  const named = new Set();
  for (const parameter of entry.parameters) {
    if (!isRecord(parameter) || typeof parameter.name !== "string" || !PARAMETER.test(parameter.name) || typeof parameter.repeatable !== "boolean") {
      yield `${where}: parameter ${JSON.stringify(parameter)} is not a name and whether it repeats`;
    } else if (named.has(parameter.name)) {
      yield `${where}: parameter ${parameter.name} is listed twice`;
    } else {
      named.add(parameter.name);
    }
  }
}

/**
 * The reads the web API serves, as the contract lists them, in its order, or none.
 *
 * An artefact older than the list has no `reads`, and reads as listing none
 * rather than as an error, so a consumer compiles against every artefact.
 */
export function readsOf(artefact, kinds) {
  const listed = Object.hasOwn(artefact, "reads") ? artefact.reads : [];
  if (!Array.isArray(listed)) {
    refuse(`The vendored contract's reads are ${JSON.stringify(listed)}, and they are a list.`);
  }
  const malformed = listed.flatMap((entry, at) => [...wrongWithRead(entry, at, kinds)]);
  const named = new Map();
  for (const entry of listed) {
    if (!isRecord(entry) || typeof entry.path !== "string" || !READ_PATH.test(entry.path)) continue;
    const name = readNameOf(entry.path);
    if (named.has(name)) malformed.push(`${entry.path}: goes by ${name}, as ${named.get(name)} does`);
    else named.set(name, entry.path);
  }
  if (malformed.length > 0) {
    refuse("The vendored contract lists a read this generator cannot write:\n  " + malformed.join("\n  "));
  }
  return listed;
}
