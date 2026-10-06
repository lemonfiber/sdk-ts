/**
 * Turns the artefact's schemas into TypeScript declarations, each held by the
 * kinds that carry it.
 */
import { ANNOTATIONS, byCodePoint, isRecord } from "./artefact.mjs";
import { refuse } from "./refused.mjs";
import { comment, literal, pascal, property } from "./spelling.mjs";

/** Keywords that narrow a value without changing the TypeScript type it is. */
const NARROWING = new Set([
  "$defs",
  "$schema",
  "additionalProperties",
  "exclusiveMaximum",
  "exclusiveMinimum",
  "format",
  "maxItems",
  "maxLength",
  "maximum",
  "minItems",
  "minLength",
  "minimum",
  "pattern",
  "required",
  "uniqueItems",
]);

/** Every keyword this generator reads. Any other is refused rather than dropped. */
const UNDERSTOOD = new Set([
  ...ANNOTATIONS,
  ...NARROWING,
  "type",
  "properties",
  "items",
  "oneOf",
  "anyOf",
  "const",
  "enum",
  "$ref",
]);

/** A definition's name, as the artefact spells one. */
const DEFINITION = /^[A-Z]\w*$/;

/** A reference to a definition beside the one making it. */
const REFERENCE = /^#\/\$defs\/([^/]+)$/;

/** The TypeScript type of each JSON type that holds no other value. */
const PRIMITIVES = new Map([
  ["string", "string"],
  ["integer", "number"],
  ["number", "number"],
  ["boolean", "boolean"],
  ["null", "null"],
]);

/** What every envelope requires. */
const ENVELOPE_FIELDS = ["api_version", "kind", "data"];

/** Names this generator writes itself, and what each one means here. */
const OWNED = new Map([
  ["Kind", "the union of every kind the server may send"],
  ["ByKind", "the envelope each kind carries"],
  ["CONTRACT_API_VERSION", "the wire version these types were generated for"],
  ["RefusalCode", "the union of every code a refusal may carry"],
  ["REFUSAL_CODES", "what the contract says of each refusal code"],
  ["isRefusalCode", "whether a code is one the contract lists"],
]);

/** A string literal inside an annotation, which names a value rather than a type. */
const QUOTED = /"(?:[^"\\]|\\.)*"/g;

/** Every name an annotation refers to, leaving out what its string literals spell. */
const namesIn = (annotation) =>
  new Set(annotation.replaceAll(QUOTED, "").match(/\b[A-Za-z_]\w*\b/g) ?? []);

/** Every other declaration of `known` a shape names. */
export function refersTo(shape, known) {
  const named = new Set();
  for (const annotation of shape.annotations) {
    for (const name of namesIn(annotation)) {
      if (name !== shape.name && known.has(name)) named.add(name);
    }
  }
  return named;
}

/** An annotation as an array's items are written: a union in parentheses. */
const asItems = (annotation) => (annotation.includes(" | ") ? `(${annotation})[]` : `${annotation}[]`);

/** The `type` keyword as a list, empty where there is none. */
const typesOf = (node) => {
  if (node.type === undefined) return [];
  return Array.isArray(node.type) ? node.type.map(String) : [node.type];
};

/** Whether a schema is an object with properties and nothing beside it. */
const isObject = (node) => {
  const declared = typesOf(node);
  return declared.length === 1 && declared[0] === "object" && "properties" in node;
};

/** The lines of an interface, each field with its description. */
function interfaceLines(name, description, fields) {
  const lines = description === undefined ? [] : comment(description, "");
  lines.push(`export interface ${name} {`);
  for (const field of fields) {
    if (field.description !== undefined) lines.push(...comment(field.description, "  "));
    lines.push(`  ${property(field.key)}${field.needed ? "" : "?"}: ${field.annotation};`);
  }
  lines.push("}");
  return lines;
}

export class Writer {
  /** Each definition's name, to every kind whose definitions carry it. */
  #users;
  /** Each definition already written: the kind carrying it and its canonical JSON. */
  #shared = new Map();
  /** The definitions being written, innermost last. */
  #within = [];

  constructor(users) {
    this.#users = users;
    this.owned = new Map(OWNED);
    this.shapes = new Map();
    this.kind = "";
    this.definitions = {};
  }

  /** The kinds carrying what is being written now: the innermost definition's, or the kind's own. */
  #carriers() {
    return this.#within.length > 0
      ? this.#users.get(this.#within.at(-1))
      : new Set([this.kind]);
  }

  /** Records one declaration, refusing a name something else holds. */
  #claim(name, origin, lines, annotations) {
    if (this.owned.has(name)) {
      refuse(`${origin} would be written as \`${name}\`, which here names ${this.owned.get(name)}.`);
    }
    if (this.shapes.has(name)) {
      refuse(`${origin} and ${this.shapes.get(name).origin} would both be written as \`${name}\`.`);
    }
    this.shapes.set(name, { name, origin, lines, carriers: this.#carriers(), annotations });
    return name;
  }

  /** The name a definition is written under, writing it the first time. */
  definition(name) {
    if (this.owned.has(name)) {
      refuse(
        `\`${name}\`, defined by \`${this.kind}\`, takes a name this generator writes itself — ` +
          `here it names ${this.owned.get(name)}. Rename the definition in the contract.`,
      );
    }
    if (!DEFINITION.test(name)) {
      refuse(`\`${name}\`, defined by \`${this.kind}\`, is not a name a TypeScript type can carry.`);
    }
    if (!Object.hasOwn(this.definitions, name)) {
      refuse(`\`${this.kind}\` refers to \`${name}\`, which it does not define.`);
    }
    const schema = this.definitions[name];
    const canonical = JSON.stringify(sortedKeys(schema));
    const held = this.#shared.get(name);
    if (held !== undefined) {
      if (held.canonical !== canonical) {
        refuse(
          `\`${name}\` is defined by \`${held.kind}\` and by \`${this.kind}\` as two different ` +
            "shapes, and one name would have to describe both.",
        );
      }
      return name;
    }
    this.#shared.set(name, { kind: this.kind, canonical });
    this.#within.push(name);
    this.#declare(name, schema, `\`${name}\`, defined by \`${this.kind}\``);
    this.#within.pop();
    return name;
  }

  /** Writes one named declaration: an interface for an object, an alias otherwise. */
  #declare(name, schema, origin) {
    const node = this.#node(schema, origin);
    if (isObject(node)) {
      this.#interface(name, node, origin);
      return;
    }
    const annotation = this.#annotation(node, name, origin);
    const lines = typeof node.description === "string" ? comment(node.description, "") : [];
    lines.push(`export type ${name} = ${annotation};`);
    this.#claim(name, origin, lines, [annotation]);
  }

  /** A schema as an object, refusing one this generator does not read. */
  #node(schema, origin) {
    if (!isRecord(schema)) {
      refuse(`${origin} is ${JSON.stringify(schema)}, which is not a schema this generator reads.`);
    }
    const unread = Object.keys(schema)
      .filter((key) => !UNDERSTOOD.has(key))
      .toSorted(byCodePoint);
    if (unread.length > 0) {
      refuse(`${origin} uses ${unread.join(", ")}, which this generator does not read.`);
    }
    return schema;
  }

  /** Writes an object schema as an interface. */
  #interface(name, node, origin) {
    const fields = this.#fieldsOf(name, node, origin);
    const description = typeof node.description === "string" ? node.description : undefined;
    this.#claim(
      name,
      origin,
      interfaceLines(name, description, fields),
      fields.map((field) => field.annotation),
    );
  }

  /** The fields an object schema declares, in name order. */
  #fieldsOf(name, node, origin) {
    const required = new Set(node.required ?? []);
    return Object.keys(node.properties)
      .toSorted(byCodePoint)
      .map((key) => {
        const where = `${origin} property \`${key}\``;
        const prop = this.#node(node.properties[key], where);
        return {
          key,
          annotation: this.#annotation(prop, name + pascal(key), where),
          needed: required.has(key),
          description: typeof prop.description === "string" ? prop.description : undefined,
        };
      });
  }

  /** The type a schema describes, naming any object it holds inline after `name`. */
  #annotation(node, name, origin) {
    if (node.$ref !== undefined) {
      const matched = REFERENCE.exec(String(node.$ref));
      if (matched === null) refuse(`${origin} refers to ${node.$ref}, outside the definitions beside it.`);
      return this.definition(matched[1]);
    }
    if ("const" in node) return literal(node.const);
    if ("enum" in node) return node.enum.map((value) => literal(value)).join(" | ");
    for (const combinator of ["oneOf", "anyOf"]) {
      if (combinator in node) return this.#union(node[combinator], name, `${origin} ${combinator}`);
    }
    const declared = typesOf(node);
    if (declared.length === 0) {
      refuse(`${origin} declares no type, and a type this generator guessed would be a lie.`);
    }
    return declared.map((one) => this.#oneType(one, node, name, origin)).join(" | ");
  }

  /** The type of one entry of a `type` list. */
  #oneType(one, node, name, origin) {
    if (PRIMITIVES.has(one)) return PRIMITIVES.get(one);
    if (one === "array") {
      if (node.items === undefined) refuse(`${origin} is an array that says nothing of its items.`);
      const where = `${origin} items`;
      return asItems(this.#annotation(this.#node(node.items, where), `${name}Item`, where));
    }
    if (one === "object") {
      if ("properties" in node) {
        this.#interface(name, node, origin);
        return name;
      }
      if (isRecord(node.additionalProperties)) {
        const where = `${origin} values`;
        const value = this.#annotation(this.#node(node.additionalProperties, where), `${name}Value`, where);
        return `{ [key: string]: ${value} }`;
      }
      refuse(`${origin} is an object that says nothing of its fields.`);
    }
    return refuse(`${origin} is of type ${JSON.stringify(one)}, which this generator does not read.`);
  }

  /** The union a `oneOf` or `anyOf` describes, each object variant named for its tag. */
  #union(variants, name, origin) {
    const nodes = variants.map((variant, at) => this.#node(variant, `${origin}/${String(at)}`));
    const tag = tagOf(nodes);
    const constants = [];
    const members = [];
    for (const [at, variant] of nodes.entries()) {
      const declared = typesOf(variant);
      if ("const" in variant && (declared.length === 0 || (declared.length === 1 && declared[0] === "string"))) {
        constants.push(literal(variant.const));
        continue;
      }
      members.push(this.#annotation(variant, name + label(variant, tag, at), `${origin}/${String(at)}`));
    }
    return [...new Set([...constants, ...members])].join(" | ");
  }

  /** Writes the envelope carrying the kind being written, its `kind` narrowed to that kind. */
  envelope(schema) {
    const name = `${pascal(this.kind)}Envelope`;
    const origin = `the envelope of \`${this.kind}\``;
    const properties = isRecord(schema.properties) ? schema.properties : {};
    const required = new Set(schema.required ?? []);
    for (const needed of ENVELOPE_FIELDS) {
      if (!(needed in properties) || !required.has(needed)) {
        refuse(`${origin} does not require \`${needed}\`, which every envelope carries.`);
      }
    }
    const fields = Object.keys(properties)
      .toSorted(byCodePoint)
      .map((key) => ({
        key,
        annotation:
          key === "kind"
            ? JSON.stringify(this.kind)
            : this.#annotation(
                this.#node(properties[key], `${origin} property \`${key}\``),
                pascal(this.kind) + pascal(key),
                `${origin} property \`${key}\``,
              ),
        needed: required.has(key),
        description: undefined,
      }));
    this.shapes.set(name, {
      name,
      origin,
      lines: interfaceLines(name, `The envelope carrying \`${this.kind}\`.`, fields),
      carriers: new Set([this.kind]),
      annotations: fields.map((field) => field.annotation),
    });
  }
}

/** A JSON value with every object's keys in order, so two spellings of one shape compare equal. */
function sortedKeys(value) {
  if (Array.isArray(value)) return value.map((item) => sortedKeys(item));
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .toSorted(byCodePoint)
      .map((key) => [key, sortedKeys(value[key])]),
  );
}

/** The property every object variant carries as a constant, where there is one. */
function tagOf(variants) {
  let common;
  for (const variant of variants) {
    if (!isObject(variant)) continue;
    const constant = new Set(
      Object.entries(variant.properties)
        .filter(([, prop]) => isRecord(prop) && "const" in prop)
        .map(([key]) => key),
    );
    common = common === undefined ? constant : new Set([...common].filter((key) => constant.has(key)));
  }
  return common === undefined || common.size === 0 ? undefined : [...common].toSorted(byCodePoint)[0];
}

/** What a variant is called after its union: its tag's value, or its place. */
function label(variant, tag, at) {
  if (tag !== undefined && isObject(variant)) {
    const named = pascal(String(variant.properties[tag].const));
    if (/^[A-Za-z_]\w*$/.test(named)) return named;
  }
  return `Variant${String(at + 1)}`;
}
