// Generated from the lemonfiber contract. Do not edit.
// The body `/api/setup/recover` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/**
 * What to do about an interrupted apply, once one is found.
 *
 * The three exits the setup wizard promises for its one dangerous state: keep
 * going, walk it back, or drop it entirely. A surface offers these; [`Recovery`]
 * turns the chosen one into the work it means.
 *
 * Read back as well as built, because the surface offering them may not be in this
 * process: a browser sends the one the operator picked by the name it is written
 * under here.
 */
export type Choice = "resume" | "roll-back" | "start-over";

/**
 * The way out of an interrupted apply a caller picked.
 *
 * A named field rather than a bare word, so the body is an object like every other
 * this surface takes and a second thing to decide can be added without the shape
 * changing under a caller.
 */
export interface SetupRecoverBody {
  /** Which of the three ways out. */
  choice: Choice;
}
