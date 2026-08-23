# AGENTS.md — sdk-ts

Guidance for any AI agent working in this repo.

> **Common rules for every lemonfiber repo are canonical in the spec:**
> [50-governance/ai-contributors.md](https://github.com/lemonfiber/spec/blob/main/50-governance/ai-contributors.md).
> Read them. This file is the `sdk-ts`-specific header only.

## What this repo is

The TypeScript client for lemonfiber's local web API, published as
`@lemonfiber/sdk-ts`. A library with **no user interface and no server**. Spec:
[`30-repos/sdk-ts.md`](https://github.com/lemonfiber/spec/blob/main/30-repos/sdk-ts.md)
and the
[web API contract](https://github.com/lemonfiber/spec/blob/main/20-architecture/contracts/web-api.md).

It is a **peer** of [`sdk-php`](https://github.com/lemonfiber/sdk-php), not its
original. Both implement one specification and neither is the reference for the
other. Where this client disagrees with the contract, this client is wrong.

## The rules you cannot break

- **`src/generated/` is not edited by hand.** It is produced from
  `contract/web-api.contract.json`, the artefact `lemonfiber` builds from the
  types that actually serialise the reply (`ARCH-R56`, `ARCH-R58`).
  `npm run contract:check` regenerates and fails on any diff.
- **No runtime dependencies** without a recorded reason. A client library's
  dependency tree becomes every consumer's.
- **No rendering, no policy, no state beyond the stream.** No DOM, no framework.
  A figure it has not been given is one it does not have.
- **The token is a header, never a URL** (`ARCH-R52`).
- **Loopback only.** A non-loopback host is refused before anything is sent.
- **100% coverage** across lines, statements, branches and functions, and
  `strict` TypeScript with no escape hatches. `eslint-disable` is not a fix.

## What is written and what is generated

Everything a schema can express is generated. What is written by hand is the
behaviour it cannot: the stream's heartbeat detection and resumption, marking
values held across a reconnect gap as stale, the version refusal, and the error
model's wording. That is the part worth reviewing.

## Checks

```
npm run ci        # format, lint, types, guards, unused, contract, coverage, build, package
npm test          # the suite alone
```

`npm run ci` is exactly what the `gate` workflow runs, so a red pipeline is
reproducible on a laptop.

## Before you open a PR

- `npm run ci` is clean.
- Cite a spec identifier in a commit `Spec:` trailer and the PR body.
- Sign off every commit (`git commit -s`); the DCO gate fails without it.
- No AI attribution in commits, PR bodies, or comments.
