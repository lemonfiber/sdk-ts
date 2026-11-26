// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/notify-choose` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `notify-choose` action is posted with. */
export interface ActionsNotifyChooseBody {
  /** Each way to be told a member chooses, by the id the operator's offer lists it under. */
  backends?: string[];
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
}
