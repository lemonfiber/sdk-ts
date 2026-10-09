// Generated from the lemonfiber contract. Do not edit.
// Every read the web API serves, by the name it goes by, and what each takes and answers with.
// Regenerate with `npm run contract:generate`.

import type { ByKind } from "./envelope.js";

/** One value a query parameter carries. */
export type Scalar = string | number | boolean;

/** Every read answered with a document, by name: its path, the segments of it a caller fills, the parameters it takes, and the kinds it answers with. */
export const READS = {
  "version": { path: "/api/version", segments: [], parameters: [], kinds: ["version"] },
  "forms": { path: "/api/forms", segments: [], parameters: [{ name: "form", repeatable: true }], kinds: ["forms", "preview"] },
  "status": { path: "/api/status", segments: [], parameters: [], kinds: ["status"] },
  "services": { path: "/api/services", segments: [], parameters: [{ name: "form", repeatable: true }], kinds: ["status"] },
  "checks": { path: "/api/checks", segments: [], parameters: [{ name: "only", repeatable: false }], kinds: ["doctor"] },
  "storage": { path: "/api/storage", segments: [], parameters: [], kinds: ["doctor"] },
  "requests": { path: "/api/requests", segments: [], parameters: [{ name: "member", repeatable: false }, { name: "defaults", repeatable: false }], kinds: ["household"] },
  "held": { path: "/api/held", segments: [], parameters: [{ name: "member", repeatable: false }, { name: "defaults", repeatable: false }, { name: "most", repeatable: false }], kinds: ["held"] },
  "held/{id}": { path: "/api/held/{id}", segments: ["id"], parameters: [{ name: "member", repeatable: false }, { name: "defaults", repeatable: false }], kinds: ["title"] },
  "watching": { path: "/api/watching", segments: [], parameters: [{ name: "member", repeatable: false }, { name: "most", repeatable: false }], kinds: ["part-way"] },
  "playing": { path: "/api/playing", segments: [], parameters: [{ name: "member", repeatable: false }], kinds: ["playing"] },
  "hosting": { path: "/api/hosting", segments: [], parameters: [], kinds: ["hosting"] },
  "front-door": { path: "/api/front-door", segments: [], parameters: [], kinds: ["front-door"] },
  "news": { path: "/api/news", segments: [], parameters: [], kinds: ["news-items"] },
  "trace": { path: "/api/trace", segments: [], parameters: [{ name: "term", repeatable: false }, { name: "season", repeatable: false }], kinds: ["trace"] },
  "stuck": { path: "/api/stuck", segments: [], parameters: [], kinds: ["stuck"] },
  "config": { path: "/api/config", segments: [], parameters: [{ name: "key", repeatable: false }], kinds: ["config"] },
  "quality": { path: "/api/quality", segments: [], parameters: [], kinds: ["quality"] },
  "explain": { path: "/api/explain", segments: [], parameters: [{ name: "word", repeatable: false }], kinds: ["glossary", "word"] },
  "backups": { path: "/api/backups", segments: [], parameters: [], kinds: ["archives"] },
  "outbound": { path: "/api/outbound", segments: [], parameters: [], kinds: ["outbound"] },
  "provenance": { path: "/api/provenance", segments: [], parameters: [], kinds: ["provenance"] },
  "catalogue": { path: "/api/catalogue", segments: [], parameters: [], kinds: ["catalogue"] },
  "stored": { path: "/api/stored", segments: [], parameters: [], kinds: ["stored"] },
  "uninstall": { path: "/api/uninstall", segments: [], parameters: [{ name: "tier", repeatable: false }], kinds: ["uninstall"] },
  "space": { path: "/api/space", segments: [], parameters: [], kinds: ["space"] },
  "bandwidth": { path: "/api/bandwidth", segments: [], parameters: [], kinds: ["bandwidth"] },
  "clients": { path: "/api/clients", segments: [], parameters: [], kinds: ["clients"] },
  "alerts": { path: "/api/alerts", segments: [], parameters: [], kinds: ["alerts"] },
  "credentials": { path: "/api/credentials", segments: [], parameters: [], kinds: ["credentials"] },
  "migration": { path: "/api/migration", segments: [], parameters: [], kinds: ["migration"] },
  "history": { path: "/api/history", segments: [], parameters: [], kinds: ["history"] },
  "update": { path: "/api/update", segments: [], parameters: [{ name: "what", repeatable: false }, { name: "to", repeatable: false }], kinds: ["self-update", "update"] },
  "plugins": { path: "/api/plugins", segments: [], parameters: [], kinds: ["plugins"] },
  "wiring": { path: "/api/wiring", segments: [], parameters: [], kinds: ["wiring"] },
  "logs": { path: "/api/logs", segments: [], parameters: [{ name: "form", repeatable: true }, { name: "service", repeatable: true }, { name: "tail", repeatable: false }, { name: "follow", repeatable: false }], kinds: ["job", "log"] },
} as const;

/** The name of a read answered with a document. */
export type ReadName = keyof typeof READS;

/** What each read takes: each segment of its path a caller fills, always; a repeatable parameter as one value or a list, any other as one value, and nothing sent for undefined. */
export interface ReadQuery {
  "version": Record<string, never>;
  "forms": { form?: Scalar | readonly Scalar[] | undefined };
  "status": Record<string, never>;
  "services": { form?: Scalar | readonly Scalar[] | undefined };
  "checks": { only?: Scalar | undefined };
  "storage": Record<string, never>;
  "requests": { member?: Scalar | undefined; defaults?: Scalar | undefined };
  "held": { member?: Scalar | undefined; defaults?: Scalar | undefined; most?: Scalar | undefined };
  "held/{id}": { id: Scalar; member?: Scalar | undefined; defaults?: Scalar | undefined };
  "watching": { member?: Scalar | undefined; most?: Scalar | undefined };
  "playing": { member?: Scalar | undefined };
  "hosting": Record<string, never>;
  "front-door": Record<string, never>;
  "news": Record<string, never>;
  "trace": { term?: Scalar | undefined; season?: Scalar | undefined };
  "stuck": Record<string, never>;
  "config": { key?: Scalar | undefined };
  "quality": Record<string, never>;
  "explain": { word?: Scalar | undefined };
  "backups": Record<string, never>;
  "outbound": Record<string, never>;
  "provenance": Record<string, never>;
  "catalogue": Record<string, never>;
  "stored": Record<string, never>;
  "uninstall": { tier?: Scalar | undefined };
  "space": Record<string, never>;
  "bandwidth": Record<string, never>;
  "clients": Record<string, never>;
  "alerts": Record<string, never>;
  "credentials": Record<string, never>;
  "migration": Record<string, never>;
  "history": Record<string, never>;
  "update": { what?: Scalar | undefined; to?: Scalar | undefined };
  "plugins": Record<string, never>;
  "wiring": Record<string, never>;
  "logs": { form?: Scalar | readonly Scalar[] | undefined; service?: Scalar | readonly Scalar[] | undefined; tail?: Scalar | undefined; follow?: Scalar | undefined };
}

/** The envelope a read answers with, of whichever kind the contract lists for it. */
export type ReadAnswer<N extends ReadName> = ByKind[(typeof READS)[N]["kinds"][number]];

/** Every read answered with a file, by name, and its path. */
export const FILES = {
  "bundle": { path: "/api/bundle/{name}" },
} as const;
