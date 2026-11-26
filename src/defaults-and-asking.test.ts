import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isKind, parse } from "./envelope.js";
import type { Policy, SettingDefault, SettingMove } from "./generated/index.js";

const DEFS_AT = new URL("../contract/web-api/defs/", import.meta.url);

interface Definition {
  oneOf?: readonly { const?: string; properties?: { of?: { const?: string } } }[];
  properties?: Record<string, unknown>;
  required?: readonly string[];
}

const definition = (name: string): Definition =>
  JSON.parse(readFileSync(new URL(`${name}.json`, DEFS_AT), "utf8")) as Definition;

/**
Each default a moved setting may fall back to, held to exactly the tags the
generated union carries by the compiler.
*/
const defaultTags = {
  core: true,
  declared: true,
  "per-reader": true,
  none: true,
} satisfies Record<SettingDefault["of"], true>;

/**
Each policy an invitation may hold their asking to, held to exactly the
generated union by the compiler.
*/
const policies = {
  trusted: true,
  "within-a-limit": true,
  "everything-waits": true,
} satisfies Record<Policy, true>;

const said = (fallback: SettingDefault): string | readonly string[] => {
  switch (fallback.of) {
    case "core":
    case "declared": {
      return `${fallback.of}: ${fallback.value}`;
    }
    case "per-reader": {
      return fallback.readers.map(
        (reader) =>
          `${reader.service} ${reader.met ? "met" : "unmet"}: ${reader.default ?? "declares none"}`,
      );
    }
    case "none": {
      return "none";
    }
  }
};

const settingsChange = (moves: readonly SettingMove[]): string =>
  JSON.stringify({
    api_version: 1,
    kind: "settings",
    data: {
      rehearsed: false,
      secrets: [],
      settings: [],
      waiting: [],
      change: {
        agreement: "b3f1",
        applied: true,
        regenerates: [],
        restarts: ["sonarr"],
        starts: [],
        waiting: [],
        settings: moves,
      },
    },
  });

const rehearsedInvitation = (asking: Policy | undefined): string =>
  JSON.stringify({
    api_version: 1,
    kind: "invitation",
    data: {
      address: "https://192.168.1.42/join",
      hours: 48,
      linked: "not-tried",
      name: "bo",
      rehearsed: true,
      standing: "made",
      suspended: [],
      withdrawn: [],
      applied: {
        filtering:
          "A limit hides what is rated above it; it is not a filter on what is unrated.",
        libraries: ["Films"],
        limit: "PG",
        requesting: "made",
        unrated: "held-back",
        ...(asking !== undefined && { asking }),
      },
    },
  });

describe("what a moved setting falls back to", () => {
  it("is typed by every tag the contract gives it, and required on each move", () => {
    const tags = (definition("SettingDefault").oneOf ?? []).map(
      (branch) => branch.properties?.of?.const,
    );

    expect(tags).toEqual(Object.keys(defaultTags));
    expect(definition("SettingMove").required).toContain("default");
    expect(definition("ReaderDefault").required).not.toContain("default");
  });

  it("reads by what it is of, keeping each reader's own and its absence", () => {
    const got = parse(
      settingsChange([
        {
          setting: "LEMONFIBER_BACKUP_LIMIT",
          value: "4",
          was: null,
          default: { of: "core", value: "off" },
        },
        {
          setting: "sonarr:port",
          value: null,
          was: "9000",
          default: { of: "declared", value: "8989" },
        },
        {
          setting: "gluetun:countries",
          value: "Belgium",
          default: {
            of: "per-reader",
            readers: [
              {
                service: "gluetun",
                variable: "SERVER_COUNTRIES",
                default: "Netherlands",
                met: true,
              },
              { service: "qbittorrent", variable: "VPN_COUNTRIES", met: false },
            ],
          },
        },
        { setting: "jellyfin:published", value: null, default: { of: "none" } },
      ]),
    );

    expect(got.ok).toBe(true);
    if (!got.ok || !isKind(got.value, "settings")) throw new Error("not a settings answer");
    const moves = got.value.data.change?.settings ?? [];

    expect(Object.fromEntries(moves.map((move) => [move.setting, said(move.default)]))).toEqual(
      {
        LEMONFIBER_BACKUP_LIMIT: "core: off",
        "sonarr:port": "declared: 8989",
        "gluetun:countries": ["gluetun met: Netherlands", "qbittorrent unmet: declares none"],
        "jellyfin:published": "none",
      },
    );
  });
});

describe("what an invitation holds their asking to", () => {
  it("is typed as the household's policy, and optional", () => {
    const branches = (definition("Policy").oneOf ?? []).map((branch) => branch.const);

    expect(branches).toEqual(Object.keys(policies));
    expect(definition("InvitationApplied").properties).toHaveProperty("asking");
    expect(definition("InvitationApplied").required).not.toContain("asking");
  });

  it.each([
    ["held by the request service", "everything-waits" as const],
    ["not held by it", undefined],
  ])(
    "reads the policy a rehearsal would hold it to, and its absence as no policy: %s",
    (_, asking) => {
      const got = parse(rehearsedInvitation(asking));

      expect(got.ok).toBe(true);
      if (!got.ok || !isKind(got.value, "invitation")) throw new Error("not an invitation");

      expect(got.value.data.applied?.asking ?? undefined).toBe(asking);
      expect(got.value.data.applied?.requesting).toBe("made");
    },
  );
});
