// Generated from the lemonfiber contract. Do not edit.
// The shapes `lifecycle` and `migration` both carry.
// Regenerate with `npm run contract:generate`.

/** A port lemonfiber wants for a service that something else already answers on. */
export interface ConflictReport {
  /** The project already holding it. */
  held_by: string;
  /** The host port both want. */
  port: number;
  /** The lemonfiber service that would publish it. */
  wanted_by: string;
}
