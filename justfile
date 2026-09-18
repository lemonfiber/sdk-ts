# Task runner for the lemonfiber/sdk-ts repo. `just` with no argument lists tasks.
#
# npm is where the steps are — `package.json` holds them and CI runs them there.
# What this file adds is a place to say what the one command covers, which
# `package.json` has no slot for and npm prints nowhere.
default:
    @just --list

# Turn on the repository's own git hooks. Once per clone.
#
# `npm ci` does this too, through npm's `prepare` script, and that is the usual
# route here. This is the same line under a name, for a clone where nothing has
# been installed yet — `core.hooksPath` is per-clone local config and no commit
# can carry it.
hooks:
    git config core.hooksPath .githooks
    @echo "hooks on: .githooks/commit-msg, .githooks/pre-push"

# Everything the `gate` job reads, which is `npm run ci` and is the whole of what
# CI runs over this package's own source.
#
# It is not CI and does not say it is. The rest of what a pull request here
# starts is forge-side, and these are not here:
#
#   commitlint, dco, attribution,   `.githooks/commit-msg` refuses all four
#   the citation gate               before the push, and `hooks` turns it on
#   contract-drift                  fetches the served contract artefact and
#                                   deep-compares; needs the network and the
#                                   published build
#   hygiene                         actionlint, typos, links, markdown, the
#                                   invite check and shared-files — the last
#                                   needs a spec checkout
#   pins, workflow-pins             ask the forge which commits a pin has not
#                                   taken
#   CodeQL, gitleaks, osv-scanner,  forge-side
#   sonar, label, goals, the
#   reference comment
ci: hooks
    npm run ci

# The contract at a named revision of lemonfiber, vendored into `contract/`.
#
# The revision is required and is a release tag or a full 40-character commit
# hash — an abbreviated hash names one artefact today and may not later. There is
# no default: `just sync v1.0.0`.
sync revision:
    npm run contract:sync -- {{revision}}

# Rewrite `src/generated/` from the vendored contract.
generate:
    npm run contract:generate
