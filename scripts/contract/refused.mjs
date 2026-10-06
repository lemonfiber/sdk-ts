/**
 * How the generator turns an artefact down: one error, thrown before anything is
 * written.
 */
export class ArtefactRefused extends Error {}

/** Refuses the artefact, saying why. */
export const refuse = (message) => {
  throw new ArtefactRefused(message);
};
