// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/quality-set` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `quality-set` action is posted with. */
export interface ActionsQualitySetBody {
  /** Whether a cost the action would incur was agreed to in advance. */
  confirm?: boolean;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /** The media type a quality choice applies to. */
  media_type?: string | null;
  /** The quality preset, or the music format, as it is written. */
  preset?: string | null;
}
