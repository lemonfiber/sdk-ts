import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { API_VERSION, type Envelope } from "./envelope.js";
import { follow, type Arrival, type Heard } from "./events.js";

const KINDS_AT = new URL("../contract/web-api/kinds/", import.meta.url);

/**
Every kind in the vendored artefact, with the top-level properties its schema
declares.
*/
const declared: readonly { kind: string; fields: readonly string[] }[] = readdirSync(KINDS_AT)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const schema = JSON.parse(readFileSync(new URL(file, KINDS_AT), "utf8")) as {
      properties: Record<string, unknown>;
    };
    return { kind: file.slice(0, -".json".length), fields: Object.keys(schema.properties) };
  });

/**
The fields the generated envelope types carry, held to exactly `keyof Envelope`
by the compiler.
*/
const typed = {
  api_version: true,
  data: true,
  host: true,
  job: true,
  kind: true,
} satisfies Record<keyof Envelope, true>;

/**
Every field of the generated envelope is one `Heard` carries, by the compiler.
*/
const heardCarries: [Exclude<keyof Envelope, keyof Heard>] extends [never] ? true : false =
  true;

/**
A value for a field the test has nothing particular to say of.
*/
const valueOf = (kind: string, field: string): unknown => {
  if (field === "api_version") return API_VERSION;
  if (field === "kind") return kind;
  if (field === "data") return {};
  return `${field} of ${kind}`;
};

const said = (kind: string, fields: readonly string[]): Record<string, unknown> =>
  Object.fromEntries(fields.map((field) => [field, valueOf(kind, field)]));

async function heardFrom(envelopes: readonly Record<string, unknown>[]): Promise<Arrival[]> {
  const encoder = new TextEncoder();
  const chunks = envelopes.map((envelope) => `data: ${JSON.stringify(envelope)}\n\n`);
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = chunks.shift();
      if (chunk === undefined) controller.close();
      else controller.enqueue(encoder.encode(chunk));
    },
  });
  const following = follow({
    url: "http://127.0.0.1:7777/api/events",
    token: "a-run-token",
    fetching: () => Promise.resolve({ ok: true, status: 200, body }),
    reconnectsAllowed: 0,
  });
  const got: Arrival[] = [];
  for await (const arrival of following) {
    if (arrival.at === "live") got.push(arrival);
  }
  return got;
}

describe("the envelope's own fields", () => {
  it("reads the vendored artefact, every kind of it", () => {
    expect(declared.length).toBeGreaterThan(0);
    expect(heardCarries).toBe(true);
  });

  it.each(declared)("types every top-level property $kind declares", ({ fields }) => {
    expect(Object.keys(typed)).toEqual(expect.arrayContaining([...fields]));
  });

  it("hands a follower every top-level property each kind declares", async () => {
    const arrivals = await heardFrom(declared.map(({ kind, fields }) => said(kind, fields)));

    expect(arrivals).toEqual(
      declared.map(({ kind, fields }) => ({ at: "live", ...said(kind, fields) })),
    );
  });
});
