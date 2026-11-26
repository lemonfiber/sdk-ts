// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/bandwidth` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `bandwidth` action is posted with. */
export interface ActionsBandwidthBody {
  /** The hours the household is awake, as `HH:MM-HH:MM` on the wall clock. */
  active?: string | null;
  /** A monthly allowance for what the stack itself moves. */
  cap?: string | null;
  /**
   * How much of the line downloads may take, as a share or a rate.
   *
   * Carried as it was written and read in the core, like `unrated` above and for
   * the same reason: a surface that decided what `50%` meant would be a second
   * answer to the question, and the two would part company on the first change
   * to either — which a household would meet as an evening that went wrong on
   * one surface and not on another.
   */
  down?: string | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** What is to happen when that cap is reached, decided in advance. */
  exceeded?: string | null;
  /** What the line carries, as `<down>/<up>`, where the operator knows. */
  line?: string | null;
  /** How many minutes to lift the limits for, and no longer. */
  unrestricted_for?: number | null;
  /** How much of it uploads may take, set apart from the download. */
  up?: string | null;
}
