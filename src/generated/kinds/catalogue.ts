// Generated from the lemonfiber contract. Do not edit.
// The `catalogue` envelope, and the shapes only `catalogue` carries.
// Regenerate with `npm run contract:generate`.

import type { Criticality } from "../shared/catalogue__dashboard__lifecycle__status.js";

/** The envelope carrying `catalogue`. */
export interface CatalogueEnvelope {
  api_version: number;
  data: CatalogueReport;
  host?: string | null;
  kind: "catalogue";
}

/** What this stack holds, and what it used to. */
export interface CatalogueReport {
  /**
   * The services this stack has dropped, in the order it records them.
   *
   * Empty for a stack that has never dropped anything, which is a different thing
   * from a stack that keeps no record — and told apart by the fact that a stack
   * keeping no record cannot be read as having dropped something it did.
   */
  removed: RemovedService[];
  /**
   * The services, in the order the stack declares them.
   *
   * Every service the manifest holds rather than the ones some form would start:
   * what a service is *for* is the question being asked, and an answer narrowed to
   * what is running would leave the operator unable to ask about the one they are
   * deciding whether to run.
   */
  services: CataloguedService[];
}

/** What one service is for, as the stack declares it. */
export interface CataloguedService {
  /** How much its absence matters. */
  criticality: Criticality;
  /** What it does for the operator, in plain language. */
  describes: string;
  /** The service's id, which is also its Compose service name. */
  id: string;
  /** What it is called in front of an operator. */
  name: string;
  /**
   * What going without it costs.
   *
   * Carried beside the description rather than left to a separate question,
   * because the pair is what turns an inventory into a judgement: knowing that
   * Bazarr finds subtitles says nothing about whether its being down matters.
   */
  without_it: string;
}

/** A service this stack used to carry, and what became of it. */
export interface RemovedService {
  /** The id it was declared under, which is the name an operator will look for. */
  id: string;
  /** Why it went. */
  reason: string;
  /** The stack version whose catalogue stopped carrying it. */
  removed_in: string;
  /**
   * What took its place, where anything did.
   *
   * Absent is an answer and the commonest one: most things that go are not
   * replaced, and a record that named the nearest surviving service to avoid an
   * empty field would be pointing an operator at something that does not do the
   * job they are looking for.
   */
  replaced_by?: string | null;
}
