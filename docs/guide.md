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
  generated list of reads, with each one's path, parameters and kinds. The logs
  answer with one envelope per line, so they are not among the names `read`
  takes.
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

Everything under `src/generated/` is generated from
`contract/web-api.contract.json`, which lemonfiber builds from the Rust types
that produce its answers. Nothing there is edited by hand. To take a newer
contract:

```console
npm run contract:sync -- <tag-or-full-commit>   # vendor the contract at that revision of lemonfiber
npm run contract:generate                       # rewrite src/generated/ from it
```

The revision is required and must be a release tag or a full 40-character commit
hash. `npm run contract:check` regenerates and fails on any difference, so a hand
edit fails CI.
