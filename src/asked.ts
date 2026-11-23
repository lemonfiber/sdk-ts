/**
What each call that takes more than its name is asked with: the read's query
or the action's body, beside what any call may say.

Spec: 20-architecture/contracts/web-api.md
*/
import type { Asking } from "./deadline.js";
import type { ReadName, ReadQuery } from "./generated/index.js";

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
What one action takes: its body beside what any call may say.
*/
export interface Acting extends Asking {
  /**
  What the action is told, sent as its JSON body. An empty object where absent.
  */
  body?: Record<string, unknown>;
}
