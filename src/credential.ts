/**
 * The token a caller hands over, checked before anything carries it.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */
import { misconfigured, type Problem } from "./problem.js";

/**
 * What a token is written in: visible ASCII, nothing a header could be split on.
 */
const VISIBLE = /^[\u{21}-\u{7E}]+$/u;

/**
 * Why a token cannot be sent, or nothing where it can.
 */
export function tokenProblem(token: string): Problem | undefined {
  if (token.trim() === "") {
    return misconfigured(
      "The token is empty. Pass the one lemonfiber printed when it started serving.",
    );
  }
  if (!VISIBLE.test(token)) {
    return misconfigured(
      "The token holds a space or a character a header cannot carry. Pass the one lemonfiber printed, exactly as it was printed.",
    );
  }
  return undefined;
}
