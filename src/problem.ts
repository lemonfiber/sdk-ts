/**
 * What went wrong, in words an operator can act on.
 *
 * Spec: 10-functional/features/g-ux/g4-error-model.md
 */

export type ProblemKind =
  "unreachable" | "refused" | "missing" | "misasked" | "version" | "malformed" | "stream";

export interface Problem {
  kind: ProblemKind;
  /**
   * Plain language. No status codes, no stack traces, no jargon.
   */
  message: string;
}

export const problem = (kind: ProblemKind, message: string): Problem => ({ kind, message });

export const unreachable = (): Problem =>
  problem("unreachable", "lemonfiber is not answering. It may have been stopped.");

/**
 * lemonfiber refused the request.
 *
 * Given the sentence lemonfiber answered with, that sentence is the message. It
 * names what was wrong with this particular request — the action that does not
 * exist, the argument that was not given — which no wording held here could.
 *
 * Without one, the message is the thing true of every refusal that carried no
 * words: the key is not the one this run is expecting.
 */
export const refused = (said?: string): Problem =>
  problem(
    "refused",
    said ??
      "lemonfiber refused that. The key this page is using is not the one it is expecting — reopen it from the address lemonfiber printed.",
  );

/**
 * lemonfiber has nothing by the name the request gave.
 *
 * Separate from every other refusal, and separately actionable: a word this
 * product does not explain and a container engine that is not running are both a
 * read that came back with no answer, and only one of them is worth asking a
 * different question about. Asking this one again, unchanged, will never succeed.
 *
 * The sentence is lemonfiber's own. It names what was asked for and, where the set
 * is short enough to be the answer, what there is instead — which no wording held
 * here could. Nothing is defaulted, since this is built from words that arrived
 * and from nothing else.
 */
export const missing = (said: string): Problem => problem("missing", said);

/**
 * lemonfiber could not answer the request as it was asked.
 *
 * A parameter it needs and was not given, or a value outside a vocabulary the
 * surface itself defines. What the request named may well exist; the request
 * cannot be carried out in the shape it arrived in, and the sentence says which
 * part of it cannot.
 */
export const misasked = (said: string): Problem => problem("misasked", said);

export const malformed = (): Problem =>
  problem("malformed", "That reply did not come from lemonfiber.");

export const wrongVersion = (mine: number, theirs: number): Problem =>
  problem(
    "version",
    `This page speaks version ${String(mine)} of lemonfiber's interface and the copy running speaks version ${String(theirs)}. Reload the page; if that does not help, the two were built apart.`,
  );

export const streamLost = (quietForMs: number): Problem =>
  problem(
    "stream",
    `Nothing has arrived for ${String(Math.round(quietForMs / 1000))} seconds, so the connection has been lost. Everything shown is the last thing confirmed, not what is true now.`,
  );
