// Generated from the lemonfiber contract. Do not edit.
// The shapes `adoption` and `migration` both carry.
// Regenerate with `npm run contract:generate`.

/** What adopting one existing service would come to. */
export interface CarryingReport {
  /** Whether its database must be backed up before lemonfiber opens it. */
  backup_first: boolean;
  /** What that means for this service's data, in the operator's terms. */
  because: string;
  /** The version standing here now. */
  existing: string;
  /** The version lemonfiber pins. */
  ours: string;
  /** Whether lemonfiber will not do this at all. */
  refused: boolean;
  /** The service, by the name lemonfiber runs it under. */
  service: string;
  /** Which of the two is the later, in one word. */
  verdict: string;
}
