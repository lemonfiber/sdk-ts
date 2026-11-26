/**
What each call that takes more than its name is asked with: the read's query
or the action's body, beside what any call may say.

Spec: 20-architecture/contracts/web-api.md
*/
import type { Asking } from "./deadline.js";
import type { ActionName, ArgumentsOf, ReadName, ReadQuery } from "./generated/index.js";

/**
The read answered with a line of its own for each envelope rather than with
one document. `read` takes every other read the contract lists.
*/
export type LineByLine = "logs";

/**
The name of a read `read` answers: one answered with one document.
*/
export type DocumentRead = Exclude<ReadName, LineByLine>;

/**
What one read takes: the read's query beside what any call may say.
*/
export interface ReadAsking<N extends DocumentRead> extends Asking {
  /**
  The read's parameters, and the path segment it fills where it has one.
  */
  query?: ReadQuery[N];
}

/**
Whether every argument the action takes has a default, so it may be sent with none.
*/
export type TakesNone<N extends ActionName> =
  Partial<ArgumentsOf[N]> extends ArgumentsOf[N] ? true : false;

/**
What one action takes: its arguments, typed as the contract types that action's,
beside what any call may say. The arguments are sent as its JSON body, an empty
object where absent, and may be absent only where every argument has a default.
*/
export type Acting<N extends ActionName> = Asking &
  (TakesNone<N> extends true ? { body?: ArgumentsOf[N] } : { body: ArgumentsOf[N] });

/**
What `act` takes after the action's name: nothing more where every argument has
a default, and what it is told otherwise.
*/
export type ActingOn<N extends ActionName> =
  TakesNone<N> extends true ? [acting?: Acting<N>] : [acting: Acting<N>];
