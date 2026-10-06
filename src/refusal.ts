/**
 * What an answer that was not a success says went wrong.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { isKind, parse } from "./envelope.js";
import { isRefusalCode, REFUSAL_CODES, type RefusalCode } from "./generated/index.js";
import {
  declined,
  failed,
  misasked,
  missing,
  refused,
  unreachable,
  type Problem,
} from "./problem.js";

/**
 * Whether a status is lemonfiber turning away who is asking.
 *
 * Both are read: 403 is what it answers most of them with, 401 is what it answers
 * a wrong password with, and 401 is what a proxy in front of it may answer with
 * instead.
 */
const wasTurnedAway = (status: number): boolean => status === 403 || status === 401;

/**
 * The registry name of the refusal that is the key: the request carried nothing
 * this run admits.
 *
 * Its code is read from the contract's list by this name, so no code is written
 * here.
 */
const THE_KEY = "NOT_ADMITTED";

/**
 * Whether a refusal's code is the key's.
 */
function isTheKey(code: RefusalCode): boolean {
  const listed: { readonly name: string } = REFUSAL_CODES[code];
  return listed.name === THE_KEY;
}

/**
 * What an answer's body said: the one sentence it holds, and the code it named,
 * as it arrived.
 */
interface Said {
  sentence?: string;
  code?: string;
}

/**
 * Whether a code arrived and is one the contract lists. Any other reads as none.
 */
const isListed = (code: string | undefined): code is RefusalCode =>
  code !== undefined && isRefusalCode(code);

/**
 * A problem carrying the code it was refused with, where the contract lists it.
 */
const carrying = (problem: Problem, code: string | undefined): Problem =>
  isListed(code) ? { ...problem, code } : problem;

/**
 * What opens something other than a sentence: a JSON body, or markup from
 * whatever stands between the caller and lemonfiber.
 */
const OPENS_A_STRUCTURE = /^[<[{]/;

/**
 * What a status says the request itself got wrong.
 *
 * lemonfiber settles where a problem lies at the point the problem is raised — in
 * what the request named, in how it asked, or in the answering — and answers with
 * the status that carries that reading, so this is read back rather than guessed
 * at from the sentence. Two of the three are the request's, and they are the two
 * listed. The third needs no entry: a status faulting neither what was named nor
 * how it was asked leaves the answering, which is `failed`.
 *
 * Falling through to `failed` rather than listing 500 is deliberate. A status
 * nothing here recognises is then read as a failure of the answering rather than
 * as the key, which is the safe direction of the two: a caller told its key is
 * wrong rotates a credential that was working, while a caller told the answering
 * failed is given the sentence, which names what actually broke.
 */
const MEANT_BY: ReadonlyMap<number, (said: string) => Problem> = new Map([
  [400, misasked],
  [404, missing],
]);

/**
 * The problem an answer that was not a success is, given the body it arrived
 * with.
 *
 * Offered rather than kept private. A caller that reads a status itself — because
 * what it asked for is not one document, and so is not something `read` can parse
 * — would otherwise write this reading a second time, and a second copy of which
 * status means which kind is a second place to remember when a status is added.
 *
 * A refusal lemonfiber wrote a sentence for is that sentence, under the kind its
 * status warrants. A failure whose body holds no sentence this package can read is
 * reported as not answering: a body it cannot read tells it no more than silence
 * would, whatever status other than 401 or 403 carried it.
 *
 * What that rules out is a document, not a stranger. A page and a body of JSON
 * that is not this envelope are both refused, and a plain sentence is taken as
 * lemonfiber's own — which it usually is, since every refusal the write surface
 * makes is prose and so are the reads it could not read. Nothing in a line of
 * words says who wrote it, so a plain-text page from whatever else is listening on
 * a loopback port is read as lemonfiber's account of what there is. Refusing prose
 * would close that door by discarding the surface's own refusals, which is the
 * larger loss of the two.
 *
 * A refusal's code, where the contract lists it, is carried on the problem it is
 * read as. A code the contract does not list reads as none.
 *
 * A request turned away at 401 or 403 is read from its code. The key's code is
 * `refused`, carrying it. Any other listed code is `declined`, carrying the code
 * and lemonfiber's sentence, since what it objects to is who is asking or where
 * from and a new key would not help. No code, a code the contract does not list,
 * or a listed code with no sentence beside it is read from the status alone,
 * which for these two is the key — `refused`, carrying no code and no sentence.
 */
export function refusalIn(status: number, body: string): Problem {
  const said = saidIn(body);
  if (wasTurnedAway(status)) return turnedAway(said);

  if (said.sentence === undefined) return unreachable();

  const meant = MEANT_BY.get(status) ?? failed;
  return carrying(meant(said.sentence), said.code);
}

/**
 * The problem a request turned away at 401 or 403 is, given what its body said.
 */
function turnedAway({ sentence, code }: Said): Problem {
  if (!isListed(code)) return refused();
  if (isTheKey(code)) return { ...refused(), code };
  if (sentence === undefined) return refused();
  return declined(sentence, code);
}

/**
 * What lemonfiber refused with, or nothing where the body holds nothing it said.
 *
 * Two shapes arrive. An action lemonfiber does not offer, or an argument it does
 * not know, is answered in prose, which carries no code. A command that ran and
 * failed, and a request it turned away, are answered with an `error` envelope,
 * whose summary is that same one sentence and whose code names why. A body of any
 * other shape did not come from lemonfiber and is not handed on as its words.
 */
function saidIn(body: string): Said {
  const words = body.trim();
  if (words === "") return {};
  if (OPENS_A_STRUCTURE.test(words)) return errorIn(words);
  return { sentence: words };
}

/**
 * The one plain sentence an `error` envelope carries, and the code it names.
 *
 * The kind names the payload; it does not prove its shape. Each field is read as
 * something arriving off a wire, so an envelope labelled `error` that carries no
 * sentence yields none, and one whose code is not a string yields no code.
 */
function errorIn(body: string): Said {
  const envelope = parse<unknown>(body);
  if (!envelope.ok || !isKind(envelope.value, "error")) return {};

  const data: unknown = envelope.value.data;
  if (typeof data !== "object" || data === null) return {};

  const { summary, code } = data as Record<string, unknown>;
  return {
    ...(typeof summary === "string" && summary.trim() !== "" && { sentence: summary.trim() }),
    ...(typeof code === "string" && { code }),
  };
}
