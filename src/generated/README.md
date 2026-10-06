# Generated

Written by `npm run contract:generate` from `contract/web-api.contract.json`.

Never edit anything here by hand. A change belongs in the Rust types the
contract is generated from; everything downstream follows from that.

Each kind's envelope and the types only it carries are one module under
`kinds/`, the types several kinds carry are one module per set of kinds under
`shared/`, and `envelope.ts` and `refusals.ts` hold the kinds and the refusal
codes. No module holds more lines than the guards allow a source file; one that
would is written as parts beside it. `index.ts` hands on every name.
