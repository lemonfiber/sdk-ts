// Generated from the lemonfiber contract. Do not edit.
// The body `/api/keys` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What a mint is asked with. */
export interface KeysBody {
  /**
   * Whether to mint it as a claim: the reply carries the link a program collects it
   * with, once, within ten minutes, and no secret.
   */
  claim?: boolean;
  /** What to call it. */
  name: string;
  /** The operator's password, given again. */
  password: string;
  /** What it is for: `home-assistant`, `mcp` or `other`. */
  purpose: string;
  /** What it admits: `read`, `act` or `member:<account>`. */
  scope: string;
}
