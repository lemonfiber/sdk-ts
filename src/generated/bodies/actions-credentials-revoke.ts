// Generated from the lemonfiber contract. Do not edit.
// The body `/api/actions/credentials-revoke` takes, and the shapes only it carries.
// Regenerate with `npm run contract:generate`.

/** What the `credentials-revoke` action is posted with. */
export interface ActionsCredentialsRevokeBody {
  /**
   * The credential a grant to a third-party plugin is of, by the setting the
   * credentials read lists it under.
   */
  credential?: string | null;
  /** Whether to rehearse: write nothing, and answer with what the action would do. */
  dry_run?: boolean;
  /**
   * What was read before answering — the offer a repair's yes was read in, the
   * listing a restore's was, what a replacement would stop — as it named itself.
   */
  offer?: string | null;
  /**
   * The plugin an update or a removal acts on, by the id the record of what is
   * installed lists it under.
   */
  plugin?: string | null;
}
