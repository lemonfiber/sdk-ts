#!/usr/bin/env node
/**
 * Compares the public surface of this tree with the commit lemonfiber-web's
 * default branch pins, and says each break the tree makes that its base does
 * not.
 *
 * Each surface is the API Extractor report of every entry point `package.json`
 * exports, built from that commit. A break the base already makes is the
 * base's. A title declaring a break, with `!` after its type as a conventional
 * commit writes one, allows it. `GITHUB_TOKEN`, where set, reads the pin.
 *
 * Exits 0 when the tree breaks nothing its base does not, when its title
 * declares the break, and when no title is given; 1 when it breaks something
 * its title does not declare; and 2 when a surface or the pin cannot be read.
 *
 * Usage: `node scripts/backward-compat.mjs <base-commit> [<title>]`
 */
import { readFileSync } from "node:fs";
import { breaks } from "./surface/compare.mjs";
import { CONSUMER, pinnedBy } from "./surface/pin.mjs";
import { build, reportsAt, reportsOf } from "./surface/reports.mjs";

/** Text from outside as one line, so nothing it holds starts a line of its own in the log, a workflow command included. */
const oneLine = (text) => text.replaceAll(/[\r\n]+/g, " ");

/** A title declaring a break, as conventional commits write one. */
const DECLARED = /^[a-z]+(\([a-z0-9.-]+\))?!: /;

const [base, title] = process.argv.slice(2);
const root = process.cwd();

if (base === undefined) {
  console.error(
    "backward-compat needs the base commit, then the title where one is to be held to it.",
  );
  process.exit(2);
}

let pinned;
let added;
try {
  const { name } = JSON.parse(readFileSync("package.json", "utf8"));
  pinned = await pinnedBy(name, process.env.GITHUB_TOKEN);
  console.log(
    `Comparing against ${oneLine(pinned)}, the commit ${CONSUMER}'s default branch pins.`,
  );
  const before = reportsAt(root, pinned);
  const onBase = new Set(breaks(before, reportsAt(root, base)));
  build(root);
  added = breaks(before, reportsOf(root, { whole: true })).filter((line) => !onBase.has(line));
} catch (error_) {
  console.error(
    `backward-compat: ${error_ instanceof Error ? error_.message : String(error_)}`,
  );
  process.exit(2);
}

if (added.length === 0) {
  console.log(
    `Nothing breaks against ${oneLine(pinned)} that ${oneLine(base)} did not already break.`,
  );
} else {
  for (const line of added) console.log(oneLine(line));
  if (title !== undefined && !DECLARED.test(title)) {
    console.log(
      `::error::This breaks what ${CONSUMER} pins. Declare it with '!' in the title (for example 'feat!: ...') and route its side, or keep the old surface.`,
    );
    process.exitCode = 1;
  } else if (title !== undefined) {
    console.log(`::notice::This breaks what ${CONSUMER} pins, and its title says so.`);
  }
}
