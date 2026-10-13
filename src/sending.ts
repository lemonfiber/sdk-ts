/**
What a client sends its requests through.

Spec: 20-architecture/contracts/web-api.md
*/

/**
The slice of `fetch` this needs, so a test can supply its own.

`blob` is read for a file lemonfiber hands over and for nothing else, so a
reply without it answers every request but those. `fetch`'s reply has it.

`redirect` is always `"error"`: an answer pointing somewhere else is not
followed, so the token goes to the address it was given for and nowhere
else. `fetch` honours it as given; a `sending` of any other kind has to as
well.

`signal` is raised when the call runs out of time or its caller stops it, and
`fetch` gives up on the request and on reading its body when it is. A
`sending` of any other kind has to as well, or a call waits on it past its
deadline.
*/
export type Sending = (
  url: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body?: string;
    redirect: "error";
    signal: AbortSignal;
  },
) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  blob?: () => Promise<Blob>;
  body?: ReadableStream<Uint8Array<ArrayBuffer>> | null;
  headers?: { get: (name: string) => string | null };
}>;

/**
One reply, as `sending` handed it back.
*/
export type Answer = Awaited<ReturnType<Sending>>;
