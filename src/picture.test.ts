import { describe, expect, it } from "vitest";
import { Client, type Sending } from "./client.js";
import { API_VERSION } from "./envelope.js";
import { TOKEN_HEADER } from "./credential.js";
import { PICTURE_MOST, pictureFrom, pictureOf } from "./picture.js";

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

interface Seen {
  url: string;
  headers: Record<string, string>;
}

/**
A `fetch` answering with `file` as its bytes, or with `refusal` as a 404 where one is given.
*/
function showing(file: Blob, seen: Seen[] = [], refusal?: string): Sending {
  return (url, init) => {
    seen.push({ url, headers: init.headers });
    return Promise.resolve({
      ok: refusal === undefined,
      status: refusal === undefined ? 200 : 404,
      text: () => Promise.resolve(refusal ?? ""),
      blob: () => Promise.resolve(file),
    });
  };
}

const open = (sending: Sending) => {
  const got = Client.at({ url: "http://127.0.0.1:7777", token: "a-run-token", sending });
  if (!got.ok) throw new Error(got.problem.message);
  return got.client;
};

const absent = (code: string): string =>
  JSON.stringify({
    api_version: API_VERSION,
    kind: "error",
    data: {
      code,
      summary: "There is nothing to show.",
      meaning: "Nothing was read.",
      remedies: [],
      severity: "error",
      state: "actionable",
    },
  });

describe("poster and backdrop", () => {
  it("read a title's poster as the image and its type, asking only for pictures", async () => {
    const seen: Seen[] = [];
    const got = await open(showing(new Blob([PNG], { type: "image/png" }), seen)).poster(
      "4f2a9c",
      {
        member: "ana",
      },
    );

    if (!got.ok) throw new Error(got.problem.message);
    expect(new Uint8Array(await got.value.bytes.arrayBuffer())).toEqual(PNG);
    expect(got.value.mediaType).toBe("image/png");
    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/held/4f2a9c/poster?member=ana");
    expect(seen[0]?.headers["Accept"]).toBe(
      "image/jpeg, image/png, image/webp, image/gif, image/avif",
    );
    expect(seen[0]?.headers[TOKEN_HEADER]).toBe("a-run-token");
  });

  it("read a backdrop where a backdrop is, the id kept to one segment", async () => {
    const seen: Seen[] = [];
    const got = await open(showing(new Blob([PNG], { type: "image/webp" }), seen)).backdrop(
      "a/b",
    );

    expect(got.ok && got.value.mediaType).toBe("image/webp");
    expect(seen[0]?.url).toBe("http://127.0.0.1:7777/api/held/a%2Fb/backdrop");
  });

  it.each(["", ".", ".."])("send nothing for an id that names no title: %j", async (id) => {
    const seen: Seen[] = [];
    const got = await open(showing(new Blob([PNG], { type: "image/png" }), seen)).poster(id);

    expect(got).toMatchObject({ ok: false, problem: { kind: "misasked" } });
    expect(seen).toEqual([]);
  });

  it.each(["PLAY-2", "PLAY-9"])(
    "report a title with nothing to show as missing, keeping %s",
    async (code) => {
      const got = await open(showing(new Blob([]), [], absent(code))).poster("81", {
        member: "ana",
      });

      expect(got).toMatchObject({ ok: false, problem: { kind: "missing", code } });
      expect(!got.ok && got.said).toContain(code);
    },
  );
});

describe("pictureOf", () => {
  it.each([
    ["IMAGE/JPEG", "image/jpeg"],
    ["image/gif; q=1", "image/gif"],
    [" image/avif ;x=y", "image/avif"],
  ])("reads the label %j as %s", (label, read) => {
    expect(pictureOf(new Blob([PNG], { type: label }))).toMatchObject({
      ok: true,
      value: { mediaType: read },
    });
  });

  it.each(["image/svg+xml", "text/html", "image/pngx", ""])(
    "refuses an answer labelled %j",
    (label) => {
      expect(pictureOf(new Blob([PNG], { type: label }))).toEqual({
        ok: false,
        problem: {
          kind: "malformed",
          message: "That reply is not a picture this page can show, so nothing was drawn.",
        },
      });
    },
  );

  it("keeps a picture of exactly the most a picture is, and refuses one byte more", () => {
    const most = new Uint8Array(PICTURE_MOST);
    expect(pictureOf(new Blob([most], { type: "image/jpeg" })).ok).toBe(true);
    expect(pictureOf(new Blob([most, new Uint8Array(1)], { type: "image/jpeg" }))).toEqual({
      ok: false,
      problem: {
        kind: "malformed",
        message:
          "That picture is larger than a picture is allowed to be, so nothing was drawn.",
      },
    });
  });
});

/**
A body handed over a chunk at a time, counting how many chunks were pulled and whether it was let go.
*/
function streaming(chunks: Uint8Array<ArrayBuffer>[]) {
  const seen = { pulled: 0, cancelled: false };
  const body = new ReadableStream<Uint8Array<ArrayBuffer>>(
    {
      pull(controller) {
        const next = chunks[seen.pulled];
        seen.pulled += 1;
        if (next === undefined) controller.close();
        else controller.enqueue(next);
      },
      cancel() {
        seen.cancelled = true;
      },
    },
    { highWaterMark: 0 },
  );
  return { body, seen };
}

const headed = (fields: Record<string, string>) => ({
  get: (name: string) => fields[name] ?? null,
});

describe("pictureFrom", () => {
  it("refuses a reply stating a length past the most a picture is, reading none of it", async () => {
    const { body, seen } = streaming([PNG]);
    const got = await pictureFrom({
      body,
      headers: headed({
        "Content-Type": "image/png",
        "Content-Length": String(PICTURE_MOST + 1),
      }),
    });

    expect(got).toMatchObject({ ok: false, problem: { kind: "malformed" } });
    expect(seen.pulled).toBe(0);
    expect(body.locked).toBe(false);
  });

  it.each(["huge", "-3", String(PICTURE_MOST)])(
    "reads by what arrives where the length stated is %j",
    async (length) => {
      const { body } = streaming([PNG]);
      const got = await pictureFrom({
        body,
        headers: headed({ "Content-Type": "image/png", "Content-Length": length }),
      });

      expect(got).toMatchObject({ ok: true, value: { mediaType: "image/png" } });
    },
  );

  it("stops one byte past the most a picture is, lets the rest go, and refuses it", async () => {
    const half = new Uint8Array(PICTURE_MOST / 2 + 1);
    const { body, seen } = streaming([half, half, half, half]);
    const got = await pictureFrom({ body, headers: headed({ "Content-Type": "image/png" }) });

    expect(got).toMatchObject({ ok: false, problem: { kind: "malformed" } });
    expect(seen.pulled).toBe(2);
    expect(seen.cancelled).toBe(true);
  });

  it("keeps a picture streamed a chunk at a time up to exactly the most a picture is", async () => {
    const half = new Uint8Array(PICTURE_MOST / 2).fill(7);
    const { body } = streaming([half, half]);
    const got = await pictureFrom({ body, headers: headed({ "Content-Type": "image/webp" }) });

    if (!got?.ok) throw new Error("not kept");
    expect(got.value.bytes.size).toBe(PICTURE_MOST);
    expect(got.value.mediaType).toBe("image/webp");
  });

  it("reads a reply with no body to stream as the file it hands over, and nothing where there is none", async () => {
    const file = new Blob([PNG], { type: "image/gif" });

    expect(await pictureFrom({ blob: () => Promise.resolve(file) })).toMatchObject({
      ok: true,
      value: { mediaType: "image/gif" },
    });
    expect(await pictureFrom({ body: null })).toBeUndefined();
  });
});
