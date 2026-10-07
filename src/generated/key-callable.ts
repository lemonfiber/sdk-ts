// Generated from the lemonfiber contract. Do not edit.
// Every action an integration key may call, and what the contract says of each.
// Regenerate with `npm run contract:generate`.

/** Every action a key may call; any other is refused to a key, naming its scope. */
export type KeyCallableAction = "restart" | "diagnose" | "update" | "downloads-pause" | "downloads-resume";

/** What the contract says of one action a key may call. */
export interface KeyCallable {
  /** Whether calling it disturbs the running system. */
  readonly disturbs: boolean;
  /** Whether it takes `dry_run`, so it can be rehearsed before the real call is offered. */
  readonly rehearsal: boolean;
  /** Whether calling it again with the same arguments leaves the stack as calling it once did. */
  readonly idempotent: boolean;
}

/** What the contract says of each action a key may call, in the order it lists them. */
export const KEY_CALLABLE: Readonly<Record<KeyCallableAction, KeyCallable>> = {
  "restart": { disturbs: true, rehearsal: true, idempotent: false },
  "diagnose": { disturbs: true, rehearsal: false, idempotent: false },
  "update": { disturbs: true, rehearsal: true, idempotent: false },
  "downloads-pause": { disturbs: false, rehearsal: true, idempotent: true },
  "downloads-resume": { disturbs: false, rehearsal: true, idempotent: true },
};

/** Whether an action is one the contract says a key may call. */
export const isKeyCallable = (value: string): value is KeyCallableAction =>
  Object.hasOwn(KEY_CALLABLE, value);
