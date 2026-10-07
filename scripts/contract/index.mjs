/**
 * Writes `src/generated/` from the vendored contract artefact.
 *
 * Offline and deterministic: the same artefact in gives the same files out, so CI
 * regenerates and fails on any difference. Generation reads the copy under
 * `contract/`, in either layout, and `contract/VERSION`, and nothing else, and
 * writes nothing when it refuses the artefact. No module holds more lines than
 * `LINE_CAP`: a module that would is written as a module of parts.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { LINE_CAP, linesIn } from "../line-cap.mjs";
import { byCodePoint, checked, keyCallableOf, kindsOf, readsOf, refusalsOf, usersOf } from "./artefact.mjs";
import { Layout } from "./layout.mjs";
import { OUT, fileOf, index, sourceOf } from "./modules.mjs";
import { ArtefactRefused, refuse } from "./refused.mjs";
import { pascal } from "./spelling.mjs";
import { KINDS_MODULE, SHARED_MODULE, envelopeModule, keyCallableModule, readsModule, refusalsModule } from "./tables.mjs";
import { readArtefact } from "./vendored.mjs";
import { Writer } from "./writer.mjs";

export { ArtefactRefused } from "./refused.mjs";

/** What the generated tree says of itself to whoever opens it. */
const README = `# Generated

Written by \`npm run contract:generate\` from the contract vendored under \`contract/\`.

Never edit anything here by hand. A change belongs in the Rust types the
contract is generated from; everything downstream follows from that.

Each kind's envelope and the types only it carries are one module under
\`kinds/\`, the types several kinds carry are one module per set of kinds under
\`shared/\`, and \`envelope.ts\`, \`reads.ts\`, \`refusals.ts\` and \`key-callable.ts\`
hold the kinds, the reads, the refusal codes and the actions an integration key may
call. No module holds more lines than the guards allow a source file; one that
would is written as parts beside it. \`index.ts\` hands on every name.
`;
export { OUT } from "./modules.mjs";

/**
 * Every generated file's path and source, or the refusal thrown.
 *
 * `cap` is the most lines a module may hold.
 */
export function generate(artefact, stamp, { cap = LINE_CAP } = {}) {
  checked(artefact);
  const kinds = kindsOf(artefact);
  const refusals = refusalsOf(artefact);
  const keyCallable = keyCallableOf(artefact);
  const reads = readsOf(artefact, kinds);
  const writer = new Writer(usersOf(kinds));
  const names = Object.keys(kinds).toSorted(byCodePoint);
  for (const kind of names) writer.owned.set(`${pascal(kind)}Envelope`, `the envelope carrying \`${kind}\``);
  for (const kind of names) {
    writer.kind = kind;
    writer.definitions = kinds[kind].$defs ?? {};
    for (const name of Object.keys(writer.definitions).toSorted(byCodePoint)) writer.definition(name);
    writer.envelope(kinds[kind]);
  }
  const layout = new Layout(writer.shapes, cap);
  const modules = layout.modules();
  const groups = [...layout.groups.values()].map((group) => group.path);
  const under = (top) => groups.filter((path) => path[0] === top[0]).toSorted((a, b) => byCodePoint(a.join("/"), b.join("/")));
  const members = [["envelope"], ["key-callable"], KINDS_MODULE, ["reads"], ["refusals"]];
  modules.push(
    envelopeModule(names),
    keyCallableModule(keyCallable),
    readsModule(reads),
    refusalsModule(refusals),
    index(KINDS_MODULE, "Every kind's envelope, and the shapes only that kind carries.", under(KINDS_MODULE)),
  );
  if (under(SHARED_MODULE).length > 0) {
    modules.push(index(SHARED_MODULE, "Every shape more than one kind carries.", under(SHARED_MODULE)));
    members.push(SHARED_MODULE);
  }
  modules.push(
    index(
      ["index"],
      `The lemonfiber contract's types.\nSource: ${stamp}  ·  api_version ${String(artefact.api_version)}`,
      members.toSorted((a, b) => byCodePoint(a.join("/"), b.join("/"))),
    ),
  );
  const files = new Map();
  for (const module of modules) {
    const source = sourceOf(module);
    if (linesIn(source) > cap) {
      refuse(`${fileOf(module.path)} would hold ${String(linesIn(source))} lines, over the ${String(cap)} a module may hold.`);
    }
    files.set(fileOf(module.path), source);
  }
  files.set(`${OUT}/README.md`, README);
  return new Map([...files].toSorted(([a], [b]) => byCodePoint(a, b)));
}

/** Generates into `root`, replacing what was generated before and writing nothing when the artefact is refused. */
export async function run(root, { cap = LINE_CAP } = {}) {
  let files;
  try {
    const { artefact, stamp } = await readArtefact(root);
    files = generate(artefact, stamp, { cap });
  } catch (error_) {
    if (!(error_ instanceof ArtefactRefused)) throw error_;
    console.error(`contract:generate: refused, and nothing was written. ${error_.message}`);
    return 1;
  }
  await rm(join(root, OUT), { recursive: true, force: true });
  await Promise.all(
    [...files].map(async ([file, source]) => {
      await mkdir(dirname(join(root, file)), { recursive: true });
      await writeFile(join(root, file), source);
    }),
  );
  console.log(`generated ${String(files.size)} files into ${OUT}`);
  return 0;
}
