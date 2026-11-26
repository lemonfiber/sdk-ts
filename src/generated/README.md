# Generated

Written by `npm run contract:generate` from the contract vendored under `contract/`.

Never edit anything here by hand. A change belongs in the Rust types the
contract is generated from; everything downstream follows from that.

Each kind's envelope and the types only it carries are one module under
`kinds/`, each route's body and the types only it carries one module under
`bodies/`, the types several kinds or bodies carry are one module per set of
them under `shared/`, and `envelope.ts`, `reads.ts`, `body-routes.ts`,
`actions.ts`, `refusals.ts`, `key-callable.ts` and `household-words.ts` hold the
kinds, the reads, the routes that take a body, the actions, the refusal codes, the
actions an integration key may call and what a member's surface may not show. No module holds more lines than the guards allow a source file; one that
would is written as parts beside it. `index.ts` hands on every name.
