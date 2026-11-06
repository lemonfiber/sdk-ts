/**
 * The API Extractor report of each entry point a built tree of this package
 * exports, and the built tree of a commit.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { declarations } from "./compare.mjs";

/** How the compiler API Extractor runs reads the built declarations, which import each other as ES modules. */
const COMPILER = {
  compilerOptions: {
    module: "nodenext",
    moduleResolution: "nodenext",
    target: "esnext",
    lib: ["esnext", "dom"],
    skipLibCheck: true,
  },
};

/** The message API Extractor gives a name an entry point reaches and does not export. */
const FORGOTTEN = "ae-forgotten-export";

/**
 * Each entry point `package.json` exports declarations for, as an import
 * specifier beside the declarations its `types` names.
 */
export function entriesOf(root) {
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  return Object.entries(manifest.exports ?? {})
    .filter(([, targets]) => typeof targets?.types === "string")
    .map(([subpath, targets]) => ({
      specifier: `${manifest.name}${subpath.slice(1)}`,
      types: targets.types,
    }));
}

/**
 * The report API Extractor writes for one entry point of the built tree under
 * `root`, and every name it reaches that the entry point does not export.
 */
function reportOf(root, types) {
  const folder = mkdtempSync(join(tmpdir(), "sdk-ts-surface-"));
  try {
    const config = ExtractorConfig.prepare({
      configObject: {
        projectFolder: root,
        mainEntryPointFilePath: join(root, types),
        apiReport: { enabled: true, reportFolder: folder, reportTempFolder: folder },
        docModel: { enabled: false },
        dtsRollup: { enabled: false },
        tsdocMetadata: { enabled: false },
        compiler: { overrideTsconfig: COMPILER },
      },
      configObjectFullPath: undefined,
      packageJsonFullPath: join(root, "package.json"),
    });
    const unexported = new Set();
    let failed;
    try {
      Extractor.invoke(config, {
        localBuild: true,
        messageCallback: (message) => {
          if (message.messageId === FORGOTTEN)
            unexported.add(/"([^"]+)"/.exec(message.text)?.[1]);
          if (message.category === "Compiler" && message.logLevel === "error")
            failed ??= message.text;
          message.handled = true;
        },
      });
    } catch (error_) {
      failed ??= error_ instanceof Error ? error_.message : String(error_);
    }
    if (failed !== undefined)
      throw new Error(`API Extractor could not read ${types} under ${root}: ${failed}`);
    const [report] = readdirSync(folder).filter((file) => file.endsWith(".api.md"));
    return { report: readFileSync(join(folder, report), "utf8"), unexported };
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}

/**
 * The report of each entry point of the built tree under `root`, by its import
 * specifier.
 *
 * A report holds only what is exported, so a change to a name the entry points
 * reach and none of them exports is one no report shows. Asked for a `whole`
 * surface, as the tree being judged is, a tree reaching such a name is refused;
 * the commits it is compared against are read as they are.
 */
export function reportsOf(root, { whole = false } = {}) {
  const absolute = resolve(root);
  const read = entriesOf(absolute).map(({ specifier, types }) => ({
    specifier,
    ...reportOf(absolute, types),
  }));
  const exported = new Set(read.flatMap(({ report }) => [...declarations(report).keys()]));
  const unseen = [...new Set(read.flatMap(({ unexported }) => [...unexported]))]
    .filter((name) => !exported.has(name))
    .toSorted();
  if (whole && unseen.length > 0) {
    throw new Error(
      `the entry points reach ${unseen.map((name) => `\`${name}\``).join(", ")}, which none of them exports, so no report shows a change to it`,
    );
  }
  return new Map(read.map(({ specifier, report }) => [specifier, report]));
}

/** Runs a command in `cwd`, its output on this process's error stream, failing where it fails. */
const run = (cwd, command, ...args) =>
  execFileSync(command, args, { cwd, stdio: ["ignore", process.stderr, process.stderr] });

/** Builds the package under `root`, whose dependencies are installed. */
export const build = (root) => run(root, "npx", "tsdown");

/**
 * The reports of `commit` of the repository at `repository`, installed exactly
 * as its lockfile says and built in a worktree of its own that is removed after.
 */
export function reportsAt(repository, commit) {
  const scratch = mkdtempSync(join(tmpdir(), "sdk-ts-commit-"));
  run(repository, "git", "worktree", "add", "--detach", scratch, commit);
  try {
    run(scratch, "npm", "ci", "--ignore-scripts", "--no-audit", "--no-fund");
    build(scratch);
    return reportsOf(scratch);
  } finally {
    run(repository, "git", "worktree", "remove", "--force", scratch);
  }
}
