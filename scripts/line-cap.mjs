/**
 * The most lines a source file under `src/` may hold, the generated ones
 * included. The guards hold every file to it, and the generator writes a module
 * that would hold more as a module of parts.
 */
export const LINE_CAP = 550;

/** How many lines a file holds, counted as the guards count them. */
export const linesIn = (text) => text.split("\n").length;
