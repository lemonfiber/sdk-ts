/**
Work already begun, asked about and released by the name its accepting reply
gave it.

Spec: 20-architecture/contracts/web-api-wire.md
*/
import type { Ask } from "./answered.js";
import type { Asking } from "./deadline.js";
import type { Envelope, Reading } from "./envelope.js";

/**
Where the work one name stands for is asked about and released.
*/
const JOBS = "/api/jobs";

/**
Work already begun, by its name. A household member is refused here.

Where it stands is the kind of the answer: `job` is work still going, `ended`
is work ended before it finished, saying whether its name was released or it
was let go, and the kind the equivalent command answers with is work that
finished. Work that stopped on a failure, and a name this run never issued,
are the problem the stack refused with.
*/
export interface Jobs {
  /**
  Where the work `job` names stands. Asking keeps work with no ending of its
  own going.
  */
  about(job: string, asking?: Asking): Promise<Reading<Envelope>>;

  /**
  Releases the name `job`, ending its work at the next moment it can be ended,
  answered as asking about it would now be. What the stack was already asked to
  do runs on, and work that had finished is answered as it finished. Sent once.
  */
  release(job: string, asking?: Asking): Promise<Reading<Envelope>>;
}

/**
The jobs, asked about through `ask`.
*/
export function jobs(ask: Ask): Jobs {
  return {
    about: (job, asking = {}) => ask("GET", named(job), asking, undefined, true),
    release: (job, asking = {}) => ask("DELETE", named(job), asking),
  };
}

/**
The path one job is asked about at, its name sent as one path segment.
*/
const named = (job: string): string => `${JOBS}/${encodeURIComponent(job)}`;
