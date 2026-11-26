// Generated from the lemonfiber contract. Do not edit.
// Every route that takes a body, and the type of the body each takes.
// Regenerate with `npm run contract:generate`.

import type { ActionsAcceptBody, ActionsAdoptBody, ActionsAskBody, ActionsBackupBody, ActionsBandwidthBody, ActionsCompanionPairBody, ActionsConfigSetBody, ActionsCredentialsRevokeBody, ActionsDiagnoseBody, ActionsDownBody, ActionsDownloadsPauseBody, ActionsDownloadsResumeBody, ActionsForgetBody, ActionsGrantBody, ActionsHostingInstallBody, ActionsHostingRemoveBody, ActionsHouseholdAllowBody, ActionsHouseholdApproveBody, ActionsHouseholdDeclineBody, ActionsHouseholdHandoffBody, ActionsInternalCertificateReplaceBody, ActionsInviteBody, ActionsMigrateAdoptBody, ActionsMigrateBesideBody, ActionsMigrateImportBody, ActionsMigrateReplaceBody, ActionsNotifyChooseBody, ActionsPlayBody, ActionsPluginInstallBody, ActionsPluginProveBody, ActionsPluginRemoveBody, ActionsPluginRunBody, ActionsPluginUpdateBody, ActionsPullBody, ActionsPushWokenBody, ActionsQualityReapplyBody, ActionsQualitySetBody, ActionsQualityUpgradeBody, ActionsReissueBody, ActionsRemoveBody, ActionsRepairBody, ActionsResetBody, ActionsRestartBody, ActionsRestoreBody, ActionsRunBody, ActionsSearchBody, ActionsSeedBody, ActionsSettingsClearBody, ActionsSettingsSetBody, ActionsSpaceBody, ActionsStopSeedingBody, ActionsSupportBody, ActionsSwitchBody, ActionsTuneBody, ActionsUndoBody, ActionsUninstallBody, ActionsUpBody, ActionsUpdateBody, ActionsWalkthroughBody, ActionsWatchBody, ActionsWatchedBody, ActionsWiringFillBody, DeviceKeysBody, KeysBody, KeysClaimBody, NotifyEventsBody, PushEndpointsBody, SessionBody, SessionCodeBody, SetupAnswerBody, SetupRecoverBody } from "./bodies.js";

/** Every route that takes a body. */
export type BodyRoute = "/api/actions/accept" | "/api/actions/adopt" | "/api/actions/ask" | "/api/actions/backup" | "/api/actions/bandwidth" | "/api/actions/companion-pair" | "/api/actions/config-set" | "/api/actions/credentials-revoke" | "/api/actions/diagnose" | "/api/actions/down" | "/api/actions/downloads-pause" | "/api/actions/downloads-resume" | "/api/actions/forget" | "/api/actions/grant" | "/api/actions/hosting-install" | "/api/actions/hosting-remove" | "/api/actions/household-allow" | "/api/actions/household-approve" | "/api/actions/household-decline" | "/api/actions/household-handoff" | "/api/actions/internal-certificate-replace" | "/api/actions/invite" | "/api/actions/migrate-adopt" | "/api/actions/migrate-beside" | "/api/actions/migrate-import" | "/api/actions/migrate-replace" | "/api/actions/notify-choose" | "/api/actions/play" | "/api/actions/plugin-install" | "/api/actions/plugin-prove" | "/api/actions/plugin-remove" | "/api/actions/plugin-run" | "/api/actions/plugin-update" | "/api/actions/pull" | "/api/actions/push-woken" | "/api/actions/quality-reapply" | "/api/actions/quality-set" | "/api/actions/quality-upgrade" | "/api/actions/reissue" | "/api/actions/remove" | "/api/actions/repair" | "/api/actions/reset" | "/api/actions/restart" | "/api/actions/restore" | "/api/actions/run" | "/api/actions/search" | "/api/actions/seed" | "/api/actions/settings-clear" | "/api/actions/settings-set" | "/api/actions/space" | "/api/actions/stop-seeding" | "/api/actions/support" | "/api/actions/switch" | "/api/actions/tune" | "/api/actions/undo" | "/api/actions/uninstall" | "/api/actions/up" | "/api/actions/update" | "/api/actions/walkthrough" | "/api/actions/watch" | "/api/actions/watched" | "/api/actions/wiring-fill" | "/api/device-keys" | "/api/keys" | "/api/keys/claim" | "/api/notify/events" | "/api/push-endpoints" | "/api/session" | "/api/session/code" | "/api/setup/answer" | "/api/setup/recover";

/** Every route that takes a body, in path order. */
export const BODY_ROUTES: readonly BodyRoute[] = [
  "/api/actions/accept",
  "/api/actions/adopt",
  "/api/actions/ask",
  "/api/actions/backup",
  "/api/actions/bandwidth",
  "/api/actions/companion-pair",
  "/api/actions/config-set",
  "/api/actions/credentials-revoke",
  "/api/actions/diagnose",
  "/api/actions/down",
  "/api/actions/downloads-pause",
  "/api/actions/downloads-resume",
  "/api/actions/forget",
  "/api/actions/grant",
  "/api/actions/hosting-install",
  "/api/actions/hosting-remove",
  "/api/actions/household-allow",
  "/api/actions/household-approve",
  "/api/actions/household-decline",
  "/api/actions/household-handoff",
  "/api/actions/internal-certificate-replace",
  "/api/actions/invite",
  "/api/actions/migrate-adopt",
  "/api/actions/migrate-beside",
  "/api/actions/migrate-import",
  "/api/actions/migrate-replace",
  "/api/actions/notify-choose",
  "/api/actions/play",
  "/api/actions/plugin-install",
  "/api/actions/plugin-prove",
  "/api/actions/plugin-remove",
  "/api/actions/plugin-run",
  "/api/actions/plugin-update",
  "/api/actions/pull",
  "/api/actions/push-woken",
  "/api/actions/quality-reapply",
  "/api/actions/quality-set",
  "/api/actions/quality-upgrade",
  "/api/actions/reissue",
  "/api/actions/remove",
  "/api/actions/repair",
  "/api/actions/reset",
  "/api/actions/restart",
  "/api/actions/restore",
  "/api/actions/run",
  "/api/actions/search",
  "/api/actions/seed",
  "/api/actions/settings-clear",
  "/api/actions/settings-set",
  "/api/actions/space",
  "/api/actions/stop-seeding",
  "/api/actions/support",
  "/api/actions/switch",
  "/api/actions/tune",
  "/api/actions/undo",
  "/api/actions/uninstall",
  "/api/actions/up",
  "/api/actions/update",
  "/api/actions/walkthrough",
  "/api/actions/watch",
  "/api/actions/watched",
  "/api/actions/wiring-fill",
  "/api/device-keys",
  "/api/keys",
  "/api/keys/claim",
  "/api/notify/events",
  "/api/push-endpoints",
  "/api/session",
  "/api/session/code",
  "/api/setup/answer",
  "/api/setup/recover",
];

/** The body each route takes, so what is sent is typed by where it goes. */
export interface BodyOf {
  "/api/actions/accept": ActionsAcceptBody;
  "/api/actions/adopt": ActionsAdoptBody;
  "/api/actions/ask": ActionsAskBody;
  "/api/actions/backup": ActionsBackupBody;
  "/api/actions/bandwidth": ActionsBandwidthBody;
  "/api/actions/companion-pair": ActionsCompanionPairBody;
  "/api/actions/config-set": ActionsConfigSetBody;
  "/api/actions/credentials-revoke": ActionsCredentialsRevokeBody;
  "/api/actions/diagnose": ActionsDiagnoseBody;
  "/api/actions/down": ActionsDownBody;
  "/api/actions/downloads-pause": ActionsDownloadsPauseBody;
  "/api/actions/downloads-resume": ActionsDownloadsResumeBody;
  "/api/actions/forget": ActionsForgetBody;
  "/api/actions/grant": ActionsGrantBody;
  "/api/actions/hosting-install": ActionsHostingInstallBody;
  "/api/actions/hosting-remove": ActionsHostingRemoveBody;
  "/api/actions/household-allow": ActionsHouseholdAllowBody;
  "/api/actions/household-approve": ActionsHouseholdApproveBody;
  "/api/actions/household-decline": ActionsHouseholdDeclineBody;
  "/api/actions/household-handoff": ActionsHouseholdHandoffBody;
  "/api/actions/internal-certificate-replace": ActionsInternalCertificateReplaceBody;
  "/api/actions/invite": ActionsInviteBody;
  "/api/actions/migrate-adopt": ActionsMigrateAdoptBody;
  "/api/actions/migrate-beside": ActionsMigrateBesideBody;
  "/api/actions/migrate-import": ActionsMigrateImportBody;
  "/api/actions/migrate-replace": ActionsMigrateReplaceBody;
  "/api/actions/notify-choose": ActionsNotifyChooseBody;
  "/api/actions/play": ActionsPlayBody;
  "/api/actions/plugin-install": ActionsPluginInstallBody;
  "/api/actions/plugin-prove": ActionsPluginProveBody;
  "/api/actions/plugin-remove": ActionsPluginRemoveBody;
  "/api/actions/plugin-run": ActionsPluginRunBody;
  "/api/actions/plugin-update": ActionsPluginUpdateBody;
  "/api/actions/pull": ActionsPullBody;
  "/api/actions/push-woken": ActionsPushWokenBody;
  "/api/actions/quality-reapply": ActionsQualityReapplyBody;
  "/api/actions/quality-set": ActionsQualitySetBody;
  "/api/actions/quality-upgrade": ActionsQualityUpgradeBody;
  "/api/actions/reissue": ActionsReissueBody;
  "/api/actions/remove": ActionsRemoveBody;
  "/api/actions/repair": ActionsRepairBody;
  "/api/actions/reset": ActionsResetBody;
  "/api/actions/restart": ActionsRestartBody;
  "/api/actions/restore": ActionsRestoreBody;
  "/api/actions/run": ActionsRunBody;
  "/api/actions/search": ActionsSearchBody;
  "/api/actions/seed": ActionsSeedBody;
  "/api/actions/settings-clear": ActionsSettingsClearBody;
  "/api/actions/settings-set": ActionsSettingsSetBody;
  "/api/actions/space": ActionsSpaceBody;
  "/api/actions/stop-seeding": ActionsStopSeedingBody;
  "/api/actions/support": ActionsSupportBody;
  "/api/actions/switch": ActionsSwitchBody;
  "/api/actions/tune": ActionsTuneBody;
  "/api/actions/undo": ActionsUndoBody;
  "/api/actions/uninstall": ActionsUninstallBody;
  "/api/actions/up": ActionsUpBody;
  "/api/actions/update": ActionsUpdateBody;
  "/api/actions/walkthrough": ActionsWalkthroughBody;
  "/api/actions/watch": ActionsWatchBody;
  "/api/actions/watched": ActionsWatchedBody;
  "/api/actions/wiring-fill": ActionsWiringFillBody;
  "/api/device-keys": DeviceKeysBody;
  "/api/keys": KeysBody;
  "/api/keys/claim": KeysClaimBody;
  "/api/notify/events": NotifyEventsBody;
  "/api/push-endpoints": PushEndpointsBody;
  "/api/session": SessionBody;
  "/api/session/code": SessionCodeBody;
  "/api/setup/answer": SetupAnswerBody;
  "/api/setup/recover": SetupRecoverBody;
}
