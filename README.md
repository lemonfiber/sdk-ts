<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/logo-on-ink.svg">
    <img alt="lemonfiber" src=".github/logo.svg" height="72">
  </picture>
</p>

<h1 align="center">Lemonfiber &mdash; sdk-ts</h1>

<p align="center">
  <code>@lemonfiber/sdk-ts</code>: a TypeScript client for the web API that
  <a href="https://github.com/lemonfiber/lemonfiber">lemonfiber</a> serves on
  your machine. For anyone writing a script, tool or web page that reads or
  controls a lemonfiber media stack.
</p>

<p align="center">
  <img alt="Licence" src="https://img.shields.io/badge/licence-Hippocratic%203.0-17160F">
</p>

---

It gives you typed calls, a typed live event stream and typed errors, with no
runtime dependencies. It runs in Node and in the browser, and it only talks to a
lemonfiber running on the same machine.

**Not on npm.** There is no release yet; install it from GitHub at a commit.

## Requirements

- Node 26 or newer, or a current browser.
- lemonfiber, serving its web API with `lemonfiber ui` on the same machine.

## Install

Pin a commit from [the commit list](https://github.com/lemonfiber/sdk-ts/commits/main):

```console
npm install github:lemonfiber/sdk-ts#<commit>
```

npm builds the package as it installs it.

## Quick start

Start lemonfiber's web API. It prints the address and a token for this run:

```console
$ lemonfiber ui --port 9000 --no-browser
lemonfiber is serving at:
  http://[::1]:9000
  http://127.0.0.1:9000
…
The token for this run, which the page will ask you for:
  <token>
```

Then ask it how the stack is doing. Save this as `status.ts`:

```ts
import { Client } from "@lemonfiber/sdk-ts";

const opened = Client.at({
  url: "http://127.0.0.1:9000",
  token: process.env.LEMONFIBER_TOKEN ?? "",
  sending: fetch,
});
if (!opened.ok) throw new Error(opened.problem.message);

const status = await opened.client.read("status");
if (!status.ok) throw new Error(status.problem.message);
console.log(status.value.data.condition, status.value.data.active_forms);
```

Run it with the token lemonfiber printed:

```console
$ LEMONFIBER_TOKEN=<token> node status.ts
active [ 'library' ]
```

That is the output with only the `library` form running and healthy. A form is a
named part of the stack, such as `library` or `tv`; see
[forms](https://docs.lemonfiber.app/running/forms-and-slices/).

Nothing throws for an expected failure: every call returns either
`{ ok: true, value }` or `{ ok: false, problem }`, and `problem.message` is a
sentence you can show a person.

## Where to go next

- [The guide](docs/guide.md): actions, files, the live event stream, every kind
  of problem, refusal codes and version handling.
- [The web API](https://docs.lemonfiber.app/api/): the envelope every answer
  arrives in, every payload kind and the field-by-field reference.
- [The command reference](https://docs.lemonfiber.app/commands/every-command/):
  every read and action is a command, and takes the same arguments.

## Contributing

```console
npm ci        # installs, builds and turns on the git hooks
npm run ci    # format, lint, types, guards, contract check, tests at 100% coverage, build
```

`src/generated/` is generated from lemonfiber's contract and never edited by hand;
the [guide](docs/guide.md#where-the-types-come-from) says how to regenerate it.
Every change cites a requirement in the
[specification](https://github.com/lemonfiber/spec); start with the
[contributing guide](https://github.com/lemonfiber/spec/blob/main/50-governance/contributing.md).
Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## Security

Report a vulnerability privately, as the
[security policy](https://github.com/lemonfiber/.github/blob/main/SECURITY.md)
describes. Do not open a public issue.

## Licence

[Hippocratic License 3.0](LICENSE): source-available and ethical-source, not
OSI-approved. The [licence rationale](https://github.com/lemonfiber/spec/blob/main/90-appendix/license-rationale.md)
explains what that means for you. Made by NightWorksIO.

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
