/**
Work already begun, asked about, released and forgotten by the name its
accepting reply gave it.

Spec: 20-architecture/contracts/web-api-wire.md
*/
import type { Ask } from "./answered.js";
import type { Asking } from "./deadline.js";
import type { Envelope, Reading } from "./envelope.js";
import { segmentOf } from "./query.js";

/**
Where the work one name stands for is asked about and released.
*/
const JOBS = "/api/jobs";

/**
What a job's path is followed by where its name is forgotten.
*/
const FORGET = "/forget";

/**
Work already begun, by its name. A name is answered to the credential whose
request started the work and to the operator; to any other it is missing, as a
name this run never issued is.

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

  /**
  Forgets the name `job` and leaves its work running, answered as asking about
  it would now be. From then on the name is missing, as one this run never
  issued is, and what the work ends with is kept for nobody. Sent once.
  */
  forget(job: string, asking?: Asking): Promise<Reading<Envelope>>;
}

/**
The jobs, asked about through `ask`.
*/
export function jobs(ask: Ask): Jobs {
  const at = async (
    method: string,
    job: string,
    then: string,
    asking: Asking,
    isARead?: boolean,
  ): Promise<Reading<Envelope>> => {
    const one = segmentOf(job);
    return one.ok
      ? ask(method, `${JOBS}/${one.value}${then}`, asking, undefined, isARead)
      : one;
  };
  return {
    about: (job, asking = {}) => at("GET", job, "", asking, true),
    release: (job, asking = {}) => at("DELETE", job, "", asking),
    forget: (job, asking = {}) => at("POST", job, FORGET, asking),
  };
}
