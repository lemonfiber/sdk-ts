/**
 * Where each shape is written: one module per set of kinds carrying it, in parts
 * where one would outgrow the cap.
 *
 * A shape every carrier of which also carries what it names imports only from
 * modules carried by more kinds than its own, so the modules import one way. A
 * module over the cap becomes a module of parts written beside it, each part a
 * run of shapes that name one another, and each importing only from parts
 * before it.
 */
import { byCodePoint } from "./artefact.mjs";
import { index, lengthOf } from "./modules.mjs";
import { refuse } from "./refused.mjs";
import { moduleName } from "./spelling.mjs";
import { KINDS_MODULE, SHARED_MODULE } from "./tables.mjs";
import { refersTo } from "./writer.mjs";

/** Words as a list in prose, each in backticks: `a`, `b` and `c`. */
function ticked(words) {
  const quoted = [...words].toSorted(byCodePoint).map((word) => `\`${word}\``);
  return quoted.length === 1 ? quoted[0] : `${quoted.slice(0, -1).join(", ")} and ${quoted.at(-1)}`;
}

/** Which kinds carry a shape: only `a`, `a` and `b` both, or all of several. */
function carried(carriers) {
  if (carriers.size === 1) return `only ${ticked(carriers)} carries`;
  return `${ticked(carriers)} ${carriers.size === 2 ? "both" : "all"} carry`;
}

/** The module the shapes some kinds carry are written in. */
function pathOf(carriers) {
  const kinds = [...carriers].toSorted(byCodePoint).map((kind) => moduleName(kind));
  return kinds.length === 1 ? [...KINDS_MODULE, kinds[0]] : [...SHARED_MODULE, kinds.join("__")];
}

/**
 * Every shape by the module it is written in.
 *
 * A module name holds no underscore, so kinds joined by two of them name one set
 * of kinds and no other.
 */
function grouped(shapes) {
  const groups = new Map();
  for (const name of [...shapes.keys()].toSorted(byCodePoint)) {
    const shape = shapes.get(name);
    const key = pathOf(shape.carriers).join("/");
    if (!groups.has(key)) groups.set(key, { path: key.split("/"), carriers: shape.carriers, members: new Map() });
    groups.get(key).members.set(name, shape);
  }
  return groups;
}

/** Refuses a shape naming one that some of its own carriers do not carry. */
function checkCarried(shapes) {
  const known = new Set(shapes.keys());
  for (const name of [...known].toSorted(byCodePoint)) {
    const shape = shapes.get(name);
    for (const other of [...refersTo(shape, known)].toSorted(byCodePoint)) {
      const missing = [...shape.carriers].filter((kind) => !shapes.get(other).carriers.has(kind));
      if (missing.length > 0) {
        refuse(
          `\`${name}\`, which ${carried(shape.carriers)}, names \`${other}\`, which ` +
            `${ticked(missing)} does not define.`,
        );
      }
    }
  }
}

/**
 * The shapes as runs that name one another, each run after every run it names.
 *
 * Tarjan's algorithm over the names each shape gives, visited in name order, so
 * the same shapes always come out in the same runs and the same order.
 */
function components(members) {
  const known = new Set(members.keys());
  const names = [...known].toSorted(byCodePoint);
  const edges = new Map(names.map((name) => [name, [...refersTo(members.get(name), known)].toSorted(byCodePoint)]));
  const order = new Map();
  const low = new Map();
  const stack = [];
  const runs = [];
  const visit = (name) => {
    order.set(name, order.size);
    low.set(name, order.get(name));
    stack.push(name);
    for (const other of edges.get(name)) {
      if (!order.has(other)) {
        visit(other);
        low.set(name, Math.min(low.get(name), low.get(other)));
      } else if (stack.includes(other)) {
        low.set(name, Math.min(low.get(name), order.get(other)));
      }
    }
    if (low.get(name) === order.get(name)) {
      const run = [];
      while (run.at(-1) !== name) run.push(stack.pop());
      runs.push(run.toSorted(byCodePoint));
    }
  };
  for (const name of names) if (!order.has(name)) visit(name);
  return runs;
}

/** The module declaring `members`, importing what they name from where it is written. */
function moduleOf(path, summary, members, where) {
  const imports = new Map();
  const known = new Set(where.keys());
  for (const shape of members.values()) {
    for (const other of refersTo(shape, known)) {
      if (members.has(other)) continue;
      const target = where.get(other).join("/");
      if (!imports.has(target)) imports.set(target, new Set());
      imports.get(target).add(other);
    }
  }
  const body = [...members.keys()]
    .toSorted(byCodePoint)
    .flatMap((name, at) => [...(at === 0 ? [] : [""]), ...members.get(name).lines]);
  return { path, summary, imports, body };
}

/** Lays every shape out in modules, each within the cap. */
export class Layout {
  #cap;
  #where;

  constructor(shapes, cap) {
    checkCarried(shapes);
    this.#cap = cap;
    this.groups = grouped(shapes);
    this.#where = new Map();
    for (const group of this.groups.values()) {
      for (const name of group.members.keys()) this.#where.set(name, group.path);
    }
  }

  /** What the module of a group holds. */
  static holds(group) {
    return group.carriers.size === 1
      ? `The ${ticked(group.carriers)} envelope, and the shapes ${carried(group.carriers)}`
      : `The shapes ${carried(group.carriers)}`;
  }

  /** Every module the shapes are written in, splitting each that would outgrow the cap. */
  modules() {
    const written = [];
    for (const key of [...this.groups.keys()].toSorted(byCodePoint)) {
      const group = this.groups.get(key);
      const whole = moduleOf(group.path, `${Layout.holds(group)}.`, group.members, this.#where);
      if (lengthOf(whole) <= this.#cap) written.push(whole);
      else written.push(...this.#parts(group));
    }
    return written;
  }

  /** The module of parts a group becomes, each part a run of shapes within the cap. */
  #parts(group) {
    const where = new Map(this.#where);
    const done = [];
    let current = [];
    const part = (names) =>
      moduleOf(
        [...group.path, moduleName(names[0])],
        `Some of the shapes ${carried(group.carriers)}; \`${group.path.join("/")}\` gathers them all.`,
        new Map(names.map((name) => [name, group.members.get(name)])),
        where,
      );
    const close = () => {
      const finished = part(current);
      if (done.some((one) => one.path.join("/") === finished.path.join("/"))) {
        refuse(
          `Two parts of \`${group.path.join("/")}\` would both be written as \`${finished.path.join("/")}\`.`,
        );
      }
      done.push(finished);
      for (const name of current) where.set(name, finished.path);
    };
    for (const run of components(group.members)) {
      if (lengthOf(part([...current, ...run])) <= this.#cap) {
        current.push(...run);
        continue;
      }
      if (current.length > 0) close();
      const alone = lengthOf(part(run));
      if (alone > this.#cap) {
        const together = run.length > 1 ? " name one another and" : "";
        refuse(
          `${ticked(run)}, which ${carried(group.carriers)},${together} would hold ${String(alone)} ` +
            `lines as one module, over the ${String(this.#cap)} a module may hold.`,
        );
      }
      current = [...run];
    }
    close();
    const gathered = index(
      group.path,
      `${Layout.holds(group)}, gathered from its parts.`,
      done.map((one) => one.path),
    );
    return [gathered, ...done];
  }
}
