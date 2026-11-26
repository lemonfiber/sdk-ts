// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/search` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `search` action is posted with. */
export interface ActionsSearchBody {
  /** Whether the checks that disturb the running system are included. */
  disruptive: boolean;
  /** The season a followed show is narrowed to, or every season where absent. */
  season?: number | null;
  /** What to follow, named as a person would say it. */
  term?: string | null;
}
