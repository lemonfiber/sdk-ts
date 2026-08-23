<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/logo-on-ink.svg">
    <img alt="lemonfiber" src=".github/logo.svg" height="72">
  </picture>
</p>

<h1 align="center">Lemonfiber &mdash; sdk-ts</h1>

<p align="center">
  The TypeScript client for lemonfiber's local web API. Typed calls, a typed
  event stream, and a typed error &mdash; published as
  <code>@lemonfiber/sdk-ts</code>.
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-unreleased-F0C419?labelColor=17160F">
  <img alt="Licence" src="https://img.shields.io/badge/licence-Hippocratic%203.0-17160F">
</p>

---

> **Status: unreleased.** The request half and the generated types are in; the
> package is not on npm yet. Full account in the spec:
> [`30-repos/sdk-ts.md`](https://github.com/lemonfiber/spec/blob/main/30-repos/sdk-ts.md).

## What it is

A library with **no user interface and no server**. It speaks the
[web API](https://github.com/lemonfiber/spec/blob/main/20-architecture/contracts/web-api.md)
and exposes it as typed calls, a typed event stream, and a typed error. It is the
only thing [`lemonfiber-web`](https://github.com/lemonfiber/lemonfiber-web) uses to
talk to the core, and the first thing any other consumer should reach for.

It is a **peer** of [`sdk-php`](https://github.com/lemonfiber/sdk-php), not its
original — both implement one specification, and neither is the reference for the
other. Where this client disagrees with the contract, this client is wrong.

## Install

```console
npm install @lemonfiber/sdk-ts
```

Requires Node **26 or newer**, or any modern browser. It has **no runtime
dependencies** — a client library's dependency tree becomes every consumer's.

## Use

`lemonfiber` prints an address and a token when it starts serving. Pass both in;
the token is sent as a header and never placed in a URL.

```ts
import { Client, follow } from "@lemonfiber/sdk-ts";

const opened = Client.at({
  url: "http://127.0.0.1:9000", // loopback only — anything else is refused
  token: printedByLemonfiber,
  sending: fetch,
});
if (!opened.ok) throw new Error(opened.problem.message);

const status = await opened.client.read("status");
if (status.ok) {
  status.value.kind; // "status"
  status.value.data; // the payload, shaped by kind
}

await opened.client.act("retry-import", { service: "sonarr" });
```

Live updates arrive as envelopes. Anything gathered before a break in the
connection is marked out of date rather than shown as current:

```ts
for await (const arrival of follow({ url, token: printedByLemonfiber, fetching: fetch })) {
  if (arrival.at === "live") draw(arrival.kind, arrival.data);
  if (arrival.at === "stale") markOutOfDate(arrival.quietForMs);
  if (arrival.at === "lost") report(arrival.problem.message);
}
```

Nothing throws for an expected failure. A call returns either a value or a
`Problem` carrying a sentence written for a person to read.

## `src/generated/` is not yours to edit

**Everything under [`src/generated/`](src/generated/) is written by
`npm run contract:generate`** from the vendored
[`contract/web-api.contract.json`](contract/), which `lemonfiber` produces from the
Rust types that actually serialise the reply. **Never edit it by hand** — a
hand-written response shape is a second source of truth for the contract, which
`ARCH-R58` forbids.

A change belongs in those Rust types; everything downstream follows from that. The
`contract:check` gate regenerates and diffs, so a hand edit fails CI rather than
merging:

```console
npm run contract:sync       # pull a newer contract from lemonfiber
npm run contract:generate   # rewrite src/generated/ from it
```

Why it works this way:
[ADR-0014](https://github.com/lemonfiber/spec/blob/main/00-overview/decisions/0014-one-generated-contract-for-every-sdk.md).

## The gate

Everything CI runs, in one command:

```console
npm ci
npm run ci
```

The individual steps are the `scripts` in [`package.json`](package.json), and each
runs on its own while you work — `npm test` for the fast loop.

The bar is the Rust workspace's, in its TypeScript equivalents: **100% coverage**
across lines, statements, branches and functions; `strict` with
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`; `typescript-eslint`
`strictTypeChecked` with zero warnings tolerated. There are no escape hatches, and
a threshold is not a target to negotiate.

## Two version numbers

They do different jobs, and conflating them is the mistake to avoid. **The
package** carries semver. **`api_version`** is a monotonic integer describing the
wire, and `CONTRACT_API_VERSION` is the one this package speaks. Many package
versions may speak one wire version. A reply in a version it cannot speak is
refused, naming both (`ARCH-R55`).

Releases are recorded in [CHANGELOG.md](CHANGELOG.md), generated from the commit
history rather than kept by hand.

## Contributing

The spec is **canonical**: every change cites a spec identifier that already
exists. Routine maintenance cites `GOV-R12`.

- [Contributing guide](https://github.com/lemonfiber/.github/blob/main/CONTRIBUTING.md)
  · [Support](https://github.com/lemonfiber/.github/blob/main/SUPPORT.md)
  · [Security](https://github.com/lemonfiber/.github/blob/main/SECURITY.md)
  · [Code of conduct](https://github.com/lemonfiber/.github/blob/main/CODE_OF_CONDUCT.md)
- [ADR-0013](https://github.com/lemonfiber/spec/blob/main/00-overview/decisions/0013-an-sdk-owns-the-api-client.md)
  — why the SDK exists and is separate
- [The full spec page for this repo](https://github.com/lemonfiber/spec/blob/main/30-repos/sdk-ts.md)

## Licence

[Hippocratic License 3.0](LICENSE) — ethical-source, source-available,
deliberately not OSI-approved. See the
[rationale](https://github.com/lemonfiber/spec/blob/main/90-appendix/license-rationale.md).

---

<p align="center">
  <a href="https://nightworks.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/nightworks-white.png">
      <img alt="NightWorks.io" src=".github/nightworks-dark.png" height="20">
    </picture>
  </a>
  &nbsp;&middot;&nbsp;<a href="https://discord.nightworks.io"><img alt="Discord" src=".github/discord.svg" height="20"></a>
</p>
