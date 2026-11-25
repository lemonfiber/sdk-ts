/**
 * Each definition holding fields beside a union carries them in every branch, and
 * every branch, as the committed types write it.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const KINDS = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "generated", "kinds");

const interfaceOf = (source, name) => {
  const start = source.indexOf(`export interface ${name} {`);
  return start === -1 ? "" : source.slice(start, source.indexOf("\n}", start));
};

describe("the fields beside a union", () => {
  it.each([
    [
      "copying.ts",
      "RunningCopy",
      ["what: CopyWhat;", "scope: CopiedScope;", "part: string;"],
      { RunningCopyWorking: ['state: "working";'], RunningCopyPaced: ["limit: number;"], RunningCopyStalled: ["wrote: Instant;"] },
    ],
    [
      "plugin-provenance.ts",
      "Vouch",
      ["digest: string;", "image: string;", "service: string;"],
      { VouchSigned: ["by: string;"], VouchUnproven: ['provenance: "unproven";'], VouchRefused: ['provenance: "refused";'] },
    ],
    [
      "plugin-provenance.ts",
      "Based",
      ["image: string;", "release: string;"],
      { BasedRecorded: ["digests: string[];"], BasedUnproven: ['basis: "unproven";'], BasedRefused: ['basis: "refused";'] },
    ],
  ])("are carried in every branch of %s's %s", async (file, union, beside, branches) => {
    const source = await readFile(join(KINDS, file), "utf8");
    expect(source).toContain(`export type ${union} = ${Object.keys(branches).join(" | ")};`);
    for (const [branch, own] of Object.entries(branches)) {
      const written = interfaceOf(source, branch);
      for (const field of [...beside, ...own]) expect(written, branch).toContain(field);
    }
  });
});
