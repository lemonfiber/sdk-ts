// Generated from the lemonfiber contract. Do not edit.
// The shapes `settings` and `wizard` both carry.
// Regenerate with `npm run contract:generate`.

/** One value a setting accepts. */
export interface Choosable {
  /**
   * The values of other settings under which it is a choice: each setting with the
   * values it has to hold one of, and none where it always is.
   */
  needs: { [key: string]: string[] };
  /** Whether it is a choice now. */
  open: boolean;
  /** The value. */
  value: string;
}
