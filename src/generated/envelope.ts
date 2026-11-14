// Generated from the lemonfiber contract. Do not edit.
// Every kind the server may send, and the envelope each one carries.
// Regenerate with `npm run contract:generate`.

import type { AdmissionEnvelope, AdoptionEnvelope, AlertEnvelope, AlertsEnvelope, ArchivesEnvelope, AskableEnvelope, AskableKindsEnvelope, AskedEnvelope, BackupEnvelope, BandwidthEnvelope, BesideEnvelope, BootEnvelope, BundleEnvelope, CapabilitiesEnvelope, CatalogueEnvelope, CertificateEnvelope, ClientsEnvelope, ConfigEnvelope, CredentialsEnvelope, DashboardEnvelope, DeviceChallengeEnvelope, DeviceKeyEnvelope, DeviceKeysEnvelope, DoctorEnvelope, EndedEnvelope, ErrorEnvelope, FormsEnvelope, FrontDoorEnvelope, GlossaryEnvelope, GrantEnvelope, HandoffEnvelope, HeldEnvelope, HistoryEnvelope, HostingEnvelope, HouseholdEnvelope, ImportEnvelope, InvitationEnvelope, JobEnvelope, KeyClaimEnvelope, KeysEnvelope, LifecycleEnvelope, LogEnvelope, MigrationEnvelope, MintedKeyEnvelope, MusicEnvelope, NewsEnvelope, NewsItemsEnvelope, NotifyEnvelope, NotifyMineEnvelope, OutboundEnvelope, PairingEnvelope, PartWayEnvelope, PausingEnvelope, PlayingEnvelope, PluginsEnvelope, PreviewEnvelope, ProvenanceEnvelope, PullEnvelope, PushEndpointEnvelope, PushEndpointsEnvelope, QualityEnvelope, QueueEnvelope, RemovalEnvelope, RepairEnvelope, ReplacementEnvelope, ResetEnvelope, RestoreEnvelope, SeedEnvelope, SelfUpdateEnvelope, SettingsEnvelope, SetupEnvelope, SpaceEnvelope, StackEnvelope, StartEnvelope, StatusEnvelope, StepEnvelope, StopSeedingEnvelope, StoredEnvelope, StuckEnvelope, SubstitutionEnvelope, TitleEnvelope, TraceEnvelope, UndoEnvelope, UninstallEnvelope, UpdateEnvelope, UpgradeEnvelope, VersionEnvelope, WalkthroughEnvelope, WatchEnvelope, WatchedEnvelope, WatcherEnvelope, WiringEnvelope, WizardEnvelope, WordEnvelope } from "./kinds.js";

/** The wire version these types were generated for. */
export const CONTRACT_API_VERSION = 1;

/** Every kind the server may send. */
export type Kind = "admission" | "adoption" | "alert" | "alerts" | "archives" | "askable" | "askable-kinds" | "asked" | "backup" | "bandwidth" | "beside" | "boot" | "bundle" | "capabilities" | "catalogue" | "certificate" | "clients" | "config" | "credentials" | "dashboard" | "device-challenge" | "device-key" | "device-keys" | "doctor" | "ended" | "error" | "forms" | "front-door" | "glossary" | "grant" | "handoff" | "held" | "history" | "hosting" | "household" | "import" | "invitation" | "job" | "key-claim" | "keys" | "lifecycle" | "log" | "migration" | "minted-key" | "music" | "news" | "news-items" | "notify" | "notify-mine" | "outbound" | "pairing" | "part-way" | "pausing" | "playing" | "plugins" | "preview" | "provenance" | "pull" | "push-endpoint" | "push-endpoints" | "quality" | "queue" | "removal" | "repair" | "replacement" | "reset" | "restore" | "seed" | "self-update" | "settings" | "setup" | "space" | "stack" | "start" | "status" | "step" | "stop-seeding" | "stored" | "stuck" | "substitution" | "title" | "trace" | "undo" | "uninstall" | "update" | "upgrade" | "version" | "walkthrough" | "watch" | "watched" | "watcher" | "wiring" | "wizard" | "word";

/** Every kind the server may send, in name order. */
export const KINDS: readonly Kind[] = [
  "admission",
  "adoption",
  "alert",
  "alerts",
  "archives",
  "askable",
  "askable-kinds",
  "asked",
  "backup",
  "bandwidth",
  "beside",
  "boot",
  "bundle",
  "capabilities",
  "catalogue",
  "certificate",
  "clients",
  "config",
  "credentials",
  "dashboard",
  "device-challenge",
  "device-key",
  "device-keys",
  "doctor",
  "ended",
  "error",
  "forms",
  "front-door",
  "glossary",
  "grant",
  "handoff",
  "held",
  "history",
  "hosting",
  "household",
  "import",
  "invitation",
  "job",
  "key-claim",
  "keys",
  "lifecycle",
  "log",
  "migration",
  "minted-key",
  "music",
  "news",
  "news-items",
  "notify",
  "notify-mine",
  "outbound",
  "pairing",
  "part-way",
  "pausing",
  "playing",
  "plugins",
  "preview",
  "provenance",
  "pull",
  "push-endpoint",
  "push-endpoints",
  "quality",
  "queue",
  "removal",
  "repair",
  "replacement",
  "reset",
  "restore",
  "seed",
  "self-update",
  "settings",
  "setup",
  "space",
  "stack",
  "start",
  "status",
  "step",
  "stop-seeding",
  "stored",
  "stuck",
  "substitution",
  "title",
  "trace",
  "undo",
  "uninstall",
  "update",
  "upgrade",
  "version",
  "walkthrough",
  "watch",
  "watched",
  "watcher",
  "wiring",
  "wizard",
  "word",
];

/** Whether a kind is one this package knows. */
export const isKnownKind = (value: string): value is Kind => (KINDS as readonly string[]).includes(value);

/** The envelope carrying each kind, so a payload is typed by what it is. */
export interface ByKind {
  "admission": AdmissionEnvelope;
  "adoption": AdoptionEnvelope;
  "alert": AlertEnvelope;
  "alerts": AlertsEnvelope;
  "archives": ArchivesEnvelope;
  "askable": AskableEnvelope;
  "askable-kinds": AskableKindsEnvelope;
  "asked": AskedEnvelope;
  "backup": BackupEnvelope;
  "bandwidth": BandwidthEnvelope;
  "beside": BesideEnvelope;
  "boot": BootEnvelope;
  "bundle": BundleEnvelope;
  "capabilities": CapabilitiesEnvelope;
  "catalogue": CatalogueEnvelope;
  "certificate": CertificateEnvelope;
  "clients": ClientsEnvelope;
  "config": ConfigEnvelope;
  "credentials": CredentialsEnvelope;
  "dashboard": DashboardEnvelope;
  "device-challenge": DeviceChallengeEnvelope;
  "device-key": DeviceKeyEnvelope;
  "device-keys": DeviceKeysEnvelope;
  "doctor": DoctorEnvelope;
  "ended": EndedEnvelope;
  "error": ErrorEnvelope;
  "forms": FormsEnvelope;
  "front-door": FrontDoorEnvelope;
  "glossary": GlossaryEnvelope;
  "grant": GrantEnvelope;
  "handoff": HandoffEnvelope;
  "held": HeldEnvelope;
  "history": HistoryEnvelope;
  "hosting": HostingEnvelope;
  "household": HouseholdEnvelope;
  "import": ImportEnvelope;
  "invitation": InvitationEnvelope;
  "job": JobEnvelope;
  "key-claim": KeyClaimEnvelope;
  "keys": KeysEnvelope;
  "lifecycle": LifecycleEnvelope;
  "log": LogEnvelope;
  "migration": MigrationEnvelope;
  "minted-key": MintedKeyEnvelope;
  "music": MusicEnvelope;
  "news": NewsEnvelope;
  "news-items": NewsItemsEnvelope;
  "notify": NotifyEnvelope;
  "notify-mine": NotifyMineEnvelope;
  "outbound": OutboundEnvelope;
  "pairing": PairingEnvelope;
  "part-way": PartWayEnvelope;
  "pausing": PausingEnvelope;
  "playing": PlayingEnvelope;
  "plugins": PluginsEnvelope;
  "preview": PreviewEnvelope;
  "provenance": ProvenanceEnvelope;
  "pull": PullEnvelope;
  "push-endpoint": PushEndpointEnvelope;
  "push-endpoints": PushEndpointsEnvelope;
  "quality": QualityEnvelope;
  "queue": QueueEnvelope;
  "removal": RemovalEnvelope;
  "repair": RepairEnvelope;
  "replacement": ReplacementEnvelope;
  "reset": ResetEnvelope;
  "restore": RestoreEnvelope;
  "seed": SeedEnvelope;
  "self-update": SelfUpdateEnvelope;
  "settings": SettingsEnvelope;
  "setup": SetupEnvelope;
  "space": SpaceEnvelope;
  "stack": StackEnvelope;
  "start": StartEnvelope;
  "status": StatusEnvelope;
  "step": StepEnvelope;
  "stop-seeding": StopSeedingEnvelope;
  "stored": StoredEnvelope;
  "stuck": StuckEnvelope;
  "substitution": SubstitutionEnvelope;
  "title": TitleEnvelope;
  "trace": TraceEnvelope;
  "undo": UndoEnvelope;
  "uninstall": UninstallEnvelope;
  "update": UpdateEnvelope;
  "upgrade": UpgradeEnvelope;
  "version": VersionEnvelope;
  "walkthrough": WalkthroughEnvelope;
  "watch": WatchEnvelope;
  "watched": WatchedEnvelope;
  "watcher": WatcherEnvelope;
  "wiring": WiringEnvelope;
  "wizard": WizardEnvelope;
  "word": WordEnvelope;
}

/** An envelope of any kind the server may send, told apart by its `kind`. */
export type Envelope = ByKind[Kind];
