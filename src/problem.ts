/**
 * What went wrong, in words an operator can act on.
 *
 * Spec: 10-functional/features/g-ux/g4-error-model.md
 */

export type ProblemKind = "unreachable" | "refused" | "version" | "malformed" | "stream";

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
