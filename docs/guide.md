# Using the TypeScript client

This guide covers everything `@lemonfiber/sdk-ts` does. The
[README](../README.md) has the install steps and a first call.

## Connecting

`lemonfiber ui` serves the web API on this machine. When it starts it prints the
address it is serving at and a token for that run:

```console
$ lemonfiber ui --port 9000 --no-browser
lemonfiber is serving at:
  http://[::1]:9000
  http://127.0.0.1:9000
…
The token for this run, which the page will ask you for:
  <token>
```

Pass both to `Client.at`, with the `fetch` the client should send requests
through:

```ts
import { Client } from "@lemonfiber/sdk-ts";

const opened = Client.at({
  url: "http://127.0.0.1:9000",
  token: printedByLemonfiber,
  sending: fetch,
});
if (!opened.ok) throw new Error(opened.problem.message);
const { client } = opened;
```

`Client.at` returns `{ ok: true, client }` or `{ ok: false, problem }`. It
refuses, before anything is sent:

- an address that is not on this machine (`localhost`, `*.localhost`, `127.x.x.x`
  or `::1`);
- an address carrying a user name, password, query or fragment;
- an empty token, or one holding a character an HTTP header cannot carry.

The token travels in the `X-Lemonfiber-Token` header (exported as `TOKEN_HEADER`)
and never in a URL. Every request asks for `redirect: "error"`, so the token is
sent to the address it was given for and nowhere else. If you pass your own
`sending` instead of `fetch`, it has to honour that too.

## Reading and acting

```ts
const status = await client.read("status");
if (status.ok) {
  console.log(status.value.data.condition); // "inactive" | "degraded" | "partial" | "active"
}

await client.act("restart", { forms: ["tv"], services: ["sonarr"] });
```

- `read(name, query?)` asks for a read by the name the contract lists it under,
  such as `status`, `front-door` or `requests`. The query takes the parameters
  that read takes, and the answer is typed as the kind the contract lists for it.
  An answer of any other kind is an `unrecognised` problem. `READS` is the
  generated list of reads, with each one's path, segments, parameters and kinds.
  The logs answer with one envelope per line, so they are not among the names
  `read` takes.
- A read whose path has a segment the caller fills keeps it in its name, such as
  `held/{id}`, and takes it in the query:
  `read("held/{id}", { id: "tt0111161", member: "ada" })` asks
  `/api/held/tt0111161?member=ada`. The segment is written escaped, so it stays
  one segment. One not given, given as a list, empty, `.` or `..` is a
  `misasked` problem, and nothing is sent.
- `act(name, body?)` sends `POST /api/actions/<name>`. The action names and their
  arguments are the command line's own. lemonfiber refuses a name it does not
  offer and a field the action does not take.

Nothing throws for an expected failure. Every call returns either
`{ ok: true, value }` or `{ ok: false, problem }`; see [Problems](#problems).

### Timeouts and stopping a call

Every call waits at most `timeoutMs`: ten seconds (`DEFAULT_TIMEOUT_MS`) unless
`Client.at` is given another. The wait covers the whole call, including a read
asked again after a gateway could not reach lemonfiber. A call can set its own
wait, and pass a signal to stop it:

```ts
const stopping = new AbortController();
const status = await client.read("status", {}, { timeoutMs: 3000, signal: stopping.signal });
```

A call that runs out of time, or that is stopped, comes back `unreachable` and
says which. The signal reaches `sending` as `init.signal`, which `fetch` honours.

## Envelopes and types

Every answer is an `Envelope`: `api_version`, `kind` and `data`. The `Envelope`
type is the union of every kind the contract describes, told apart by `kind`.
`isKind` narrows an envelope to one kind, and so does comparing `kind` yourself.
An answer of a kind this package does not know is an `unrecognised` problem
rather than an untyped value.

Every type the contract defines, each kind's payload and the shapes several kinds
share, is exported from `@lemonfiber/sdk-ts/contract`:

```ts
import type { StatusReport } from "@lemonfiber/sdk-ts/contract";
```

## Files

A support bundle is a file, so it arrives as a `Blob` with the content type
lemonfiber served it with. Ask for it by the name it was written under, or by the
payload the `support` action answered with:

```ts
const made = await client.act("support", { write: true });
if (made.ok && isKind(made.value, "bundle")) {
  const { path } = made.value.data; // absent when the run described a bundle and wrote none
  if (typeof path === "string") {
    const file = await client.bundle({ path }); // or client.bundle(name)
    if (file.ok) offerDownload(file.value); // a Blob, for URL.createObjectURL
    if (!file.ok) report(file.problem, file.said);
  }
}
```

`take(endpoint)` reads any other endpoint that answers with a file. A refusal on
either carries the whole body it arrived with as `said`, beside the `problem`.

A title's poster and backdrop are pictures, read as the member by the id the
shelf lists the title under. Each arrives as a `Picture`: the image as a `Blob`
and its `mediaType`.

```ts
const poster = await client.poster(id, { member: "ada" }); // or client.backdrop
if (poster.ok) draw(URL.createObjectURL(poster.value.bytes));
```

A picture is one of `PICTURE_TYPES` (JPEG, PNG, WebP, GIF and AVIF, never SVG)
and at most `PICTURE_MOST` bytes, 2 MiB. Anything else is a `malformed` problem.
The client reads no further than one byte past the limit, and none of a reply
that states a longer length.
A title outside the member's limits is `missing` with `PLAY-2` in `said`, and a
title with no picture of that kind is `missing` with `PLAY-9`.

## Integration keys

A program that runs beside the stack for months holds a key rather than the
per-run token. Keys are listed, minted and revoked through routes of their own.
The operator keeps every key, and a household member only their own; a key is
refused at all three, whatever its scope.

```ts
const listing = await client.keys(); // every key, without its secret
const made = await client.mint({
  name: "home",
  scope: "read",
  purpose: "home-assistant",
  password,
});
if (made.ok) showOnce(made.value.data.secret, made.value.data.pin);
await client.revoke("home"); // answered with the keys as they now stand
```

The password is sent in the mint's body and kept by nothing here, and the
secret is in that one reply and no other.

## Walking setup

First-run setup is walked one request a step, each answered with where setup
then stands, as a `wizard` envelope. The answers so far live in the progress
file setup keeps on the machine, so a walk begun in a terminal is the one these
read, and reloading loses nothing.

```ts
let walked = await client.setup(); // where it stands; changes nothing
walked = await client.setupAnswer({ protocols: { torrent: true, usenet: false } });
walked = await client.setupNext(); // past a step that only informs
walked = await client.setupBack(); // back to the question before
walked = await client.setupApply(); // write the reviewed answers
walked = await client.setupRecover("roll-back"); // out of an apply that stopped part-way
```

An answer is a `SetupAnswerBody`: one field, named for the question it answers.
A credential in it is tested against its service as it is given, and the reply
says what the service said and never repeats the value. Only `setup()` is asked
again after a passing failure; every step is sent once.

## Live updates

`GET /api/events` is a stream of envelopes. `follow` reads it:

```ts
import { follow } from "@lemonfiber/sdk-ts";

const url = "http://127.0.0.1:9000/api/events"; // the stream's own address, not the base

for await (const arrival of follow({ url, token: printedByLemonfiber, fetching: fetch })) {
  if (arrival.at === "live") draw(arrival.kind, arrival.data);
  if (arrival.at === "stale") markOutOfDate(arrival.quietForMs);
  if (arrival.at === "unreadable") note(arrival.problem.message); // one event; reading goes on
  if (arrival.at === "lost") report(arrival.problem.message); // the stream has ended
}
```

| `at`         | Meaning                                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `live`       | A value that just arrived                                                                                                   |
| `stale`      | A value held from before the connection broke. It is not current until the stream carries it again                          |
| `unreadable` | One event could not be read, or was in an `api_version` this package does not speak. The stream goes on                     |
| `lost`       | The stream has ended: refused, unreachable, closed by the server, or silent for longer than allowed. The problem says which |

A `live` or `stale` arrival carries `job` where its envelope names the job it
was said for. A walkthrough's `step` events name the job its accepting reply
gave, so each step can be tied to the walk that asked for it. An event naming
no job carries no `job` field.

The server sends a heartbeat every 15 seconds (`HEARTBEAT_MS`). Silence for 30
seconds (`SILENCE_ALLOWED_MS`) counts as a broken connection. A broken
connection is reopened up to five times in a row (`RECONNECTS_ALLOWED`) before
the stream is `lost`.

The stream's address is checked the way `Client.at` checks one. An address that
is not on this machine arrives as `lost`, and nothing is sent to it.

To ask what the stream holds while it runs, pass a `Ledger`:
`ledger.held(kind, now)` is the last value of one kind, live or stale, and
`ledger.all(now)` is every one of them. Pass an `AbortSignal` as `signal` to stop
following.

## Problems

`problem.message` is a sentence written for a person. `problem.kind` says what
sort of failure it was, so code can decide what to do without reading the
sentence:

| `kind`          | Meaning                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| `configuration` | The address or token you passed cannot be used. Nothing was sent               |
| `unreachable`   | Nothing lemonfiber wrote came back                                             |
| `refused`       | The token is not the one this run of lemonfiber expects                        |
| `declined`      | lemonfiber turned away who is asking, or where from, for another reason        |
| `missing`       | lemonfiber has nothing by the name the request gave                            |
| `misasked`      | lemonfiber could not answer the request as it was asked                        |
| `failed`        | lemonfiber understood the request and could not carry it out                   |
| `busy`          | Other work held the stack. The same request may be sent again                  |
| `too-many`      | Too many wrong attempts lately. `retryAfterSeconds` says how long, where known |
| `version`       | The answer is in an `api_version` this package does not speak                  |
| `malformed`     | What arrived was not a lemonfiber envelope                                     |
| `unrecognised`  | The answer is of a kind this package does not know                             |
| `stream`        | The event stream broke, went quiet for too long, or was closed                 |

Only `refused` means "get a new token". `failed` means something behind
lemonfiber went wrong: a stopped container engine is `failed`, and the same
request succeeds once the engine is running again.

`missing`, `misasked`, `failed` and `declined` always carry lemonfiber's own
sentence. An answer whose body this package cannot read is `unreachable`, or
`refused` at HTTP 401 and 403, so a page from a proxy in front of lemonfiber is
never passed off as lemonfiber's answer.

### Refusal codes

When an error envelope names a code the contract lists, the problem carries it as
`problem.code`, typed `RefusalCode`. Decide what a refusal means from the code,
not from the sentence. At 401 or 403 the code also decides the kind: the token's
code is `refused`, and every other listed code is `declined`. A refusal without a
listed code is read by its HTTP status alone.

`REFUSAL_CODES` holds what the contract says about each code, and
`isRefusalCode` tells a listed code from any other string. The codes are listed
in [every error by code](https://docs.lemonfiber.app/fixing/every-error-by-code/).

### What an integration key may call

`KEY_CALLABLE` lists the actions an integration key may call, in the contract's
order. Each entry says whether calling it disturbs the running system
(`disturbs`), whether it takes `dry_run` so it can be rehearsed first
(`rehearsal`), and whether calling it again with the same arguments leaves the
stack as calling it once did (`idempotent`). `isKeyCallable` tells
whether an action name is on the list.

## Two version numbers

The package has a semver version. The wire has `api_version`, a whole number that
only goes up. `CONTRACT_API_VERSION` is the one this package speaks, and many
package versions can speak the same one. An answer in any other `api_version` is
refused as a `version` problem that names both numbers. See
[two version numbers](https://docs.lemonfiber.app/api/two-version-numbers/).

## Where the types come from

Everything under `src/generated/` is generated from the contract vendored under
`contract/`, which lemonfiber builds from the Rust types that produce its
answers and read its requests. Each route's body is written as a type named
for the route (`/api/setup/answer` takes a `SetupAnswerBody`), and `BodyOf`
maps each route to its body. The copy is in the layout the revision it came from publishes: the
directory `contract/web-api/`, or the single file
`contract/web-api.contract.json`. Nothing there is edited by hand. To take a
newer contract:

```console
npm run contract:sync -- <tag-or-full-commit>   # vendor the contract at that revision of lemonfiber
npm run contract:generate                       # rewrite src/generated/ from it
```

The revision is required and must be a release tag or a full 40-character commit
hash. `npm run contract:check` regenerates and fails on any difference, so a hand
edit fails CI.
