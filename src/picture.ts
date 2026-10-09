/**
A title's pictures, as lemonfiber hands them over for a browser to draw.

Spec: 10-functional/features/d-content/d11-watching-what-the-house-holds.md
*/
import { problem, type Problem } from "./problem.js";

/**
The types a picture arrives as: raster images, which carry nothing a browser runs.
*/
export const PICTURE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

/**
One of the types a picture arrives as.
*/
export type PictureType = (typeof PICTURE_TYPES)[number];

/**
The most bytes a picture is.
*/
export const PICTURE_MOST = 2 * 1024 * 1024;

/**
One of a title's pictures: the image as it arrived, and the type it is.
*/
export interface Picture {
  bytes: Blob;
  mediaType: PictureType;
}

/**
A title's picture, or why there is none to draw.

A refusal carries the body it arrived with as `said`, as a handed-over file's
does: a title outside the member's limits is `PLAY-2` there, and a title with
no picture of that kind is `PLAY-9`.
*/
export type Pictured =
  { ok: true; value: Picture } | { ok: false; problem: Problem; said?: string };

const isAPictureType = (type: string): type is PictureType =>
  (PICTURE_TYPES as readonly string[]).includes(type);

/**
The slice of a reply a picture is read from.
*/
interface Arriving {
  headers?: { get: (name: string) => string | null };
  body?: ReadableStream<Uint8Array<ArrayBuffer>> | null;
  blob?: () => Promise<Blob>;
}

const tooLarge: Pictured = {
  ok: false,
  problem: problem(
    "malformed",
    "That picture is larger than a picture is allowed to be, so nothing was drawn.",
  ),
};

const notAPicture: Pictured = {
  ok: false,
  problem: problem(
    "malformed",
    "That reply is not a picture this page can show, so nothing was drawn.",
  ),
};

/**
A reply read as a picture: refused unread where it states a length past
`PICTURE_MOST`, and otherwise read no further than one byte past it. A reply
with no body to stream is read whole, as a `sending` that hands over only a
`Blob` gives no way to stop part-way. Nothing where it could not be read.
*/
export async function pictureFrom(answer: Arriving): Promise<Pictured | undefined> {
  const length = answer.headers?.get("Content-Length") ?? "";
  if (/^\d+$/.test(length) && Number(length) > PICTURE_MOST) return tooLarge;
  const type = answer.headers?.get("Content-Type") ?? "";
  const file = answer.body
    ? new Blob(await upTo(answer.body, PICTURE_MOST + 1), { type })
    : await answer.blob?.();
  return file && pictureOf(file);
}

/**
The first `most` bytes of a stream, or all of it where it is shorter, the rest
left unread and the stream let go.
*/
async function upTo(
  stream: ReadableStream<Uint8Array<ArrayBuffer>>,
  most: number,
): Promise<Uint8Array<ArrayBuffer>[]> {
  const reader = stream.getReader();
  const kept: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (size < most) {
      const { done, value } = await reader.read();
      if (done) break;
      const taken = value.subarray(0, most - size);
      kept.push(taken);
      size += taken.length;
    }
  } finally {
    await reader.cancel();
  }
  return kept;
}

/**
The handed-over file as a picture, or `malformed` where it is not a raster
image of at most `PICTURE_MOST` bytes.
*/
export function pictureOf(file: Blob): Pictured {
  const end = file.type.indexOf(";");
  const type = (end === -1 ? file.type : file.type.slice(0, end)).trim().toLowerCase();
  if (!isAPictureType(type)) return notAPicture;
  if (file.size > PICTURE_MOST) return tooLarge;
  return { ok: true, value: { bytes: file, mediaType: type } };
}
