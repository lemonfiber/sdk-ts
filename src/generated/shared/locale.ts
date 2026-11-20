// Generated from the lemonfiber contract. Do not edit.
// The shapes `/api/setup/answer` and `wizard` both carry.
// Regenerate with `npm run contract:generate`.

export type Locale = string;

/** Where the house is: the zone the stack runs in and the house's language and region. */
export interface SetupHouse {
  /** The house's language and region. */
  locale: Locale;
  /** The zone the stack runs in, which it writes as `TZ`. */
  zone: Zone;
}

export type Zone = string;
