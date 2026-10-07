// Generated from the lemonfiber contract. Do not edit.
// Every kind the server may send, and the envelope each one carries.
// Regenerate with `npm run contract:generate`.

import type { AdmissionEnvelope, AdoptionEnvelope, AlertsEnvelope, ArchivesEnvelope, BackupEnvelope, BandwidthEnvelope, BesideEnvelope, BundleEnvelope, CapabilitiesEnvelope, CatalogueEnvelope, CertificateEnvelope, ClientsEnvelope, ConfigEnvelope, CredentialsEnvelope, DashboardEnvelope, DoctorEnvelope, ErrorEnvelope, FormsEnvelope, FrontDoorEnvelope, GlossaryEnvelope, HandoffEnvelope, HeldEnvelope, HistoryEnvelope, HostingEnvelope, HouseholdEnvelope, ImportEnvelope, InvitationEnvelope, JobEnvelope, KeysEnvelope, LifecycleEnvelope, LogEnvelope, MigrationEnvelope, MintedKeyEnvelope, MusicEnvelope, NewsEnvelope, NewsItemsEnvelope, OutboundEnvelope, PairingEnvelope, PausingEnvelope, PlayingEnvelope, PluginsEnvelope, PreviewEnvelope, ProvenanceEnvelope, PullEnvelope, QualityEnvelope, RemovalEnvelope, RepairEnvelope, ReplacementEnvelope, ResetEnvelope, RestoreEnvelope, SeedEnvelope, SelfUpdateEnvelope, SetupEnvelope, SpaceEnvelope, StartEnvelope, StatusEnvelope, StepEnvelope, StopSeedingEnvelope, StoredEnvelope, StuckEnvelope, SubstitutionEnvelope, TraceEnvelope, UndoEnvelope, UninstallEnvelope, UpdateEnvelope, UpgradeEnvelope, VersionEnvelope, WalkthroughEnvelope, WatchEnvelope, WiringEnvelope, WizardEnvelope, WordEnvelope } from "./kinds.js";

/** The wire version these types were generated for. */
export const CONTRACT_API_VERSION = 1;

/** Every kind the server may send. */
export type Kind = "admission" | "adoption" | "alerts" | "archives" | "backup" | "bandwidth" | "beside" | "bundle" | "capabilities" | "catalogue" | "certificate" | "clients" | "config" | "credentials" | "dashboard" | "doctor" | "error" | "forms" | "front-door" | "glossary" | "handoff" | "held" | "history" | "hosting" | "household" | "import" | "invitation" | "job" | "keys" | "lifecycle" | "log" | "migration" | "minted-key" | "music" | "news" | "news-items" | "outbound" | "pairing" | "pausing" | "playing" | "plugins" | "preview" | "provenance" | "pull" | "quality" | "removal" | "repair" | "replacement" | "reset" | "restore" | "seed" | "self-update" | "setup" | "space" | "start" | "status" | "step" | "stop-seeding" | "stored" | "stuck" | "substitution" | "trace" | "undo" | "uninstall" | "update" | "upgrade" | "version" | "walkthrough" | "watch" | "wiring" | "wizard" | "word";

/** Every kind the server may send, in name order. */
export const KINDS: readonly Kind[] = [
  "admission",
  "adoption",
  "alerts",
  "archives",
  "backup",
  "bandwidth",
  "beside",
  "bundle",
  "capabilities",
  "catalogue",
  "certificate",
  "clients",
  "config",
  "credentials",
  "dashboard",
  "doctor",
  "error",
  "forms",
  "front-door",
  "glossary",
  "handoff",
  "held",
  "history",
  "hosting",
  "household",
  "import",
  "invitation",
  "job",
  "keys",
  "lifecycle",
  "log",
  "migration",
  "minted-key",
  "music",
  "news",
  "news-items",
  "outbound",
  "pairing",
  "pausing",
  "playing",
  "plugins",
  "preview",
  "provenance",
  "pull",
  "quality",
  "removal",
  "repair",
  "replacement",
  "reset",
  "restore",
  "seed",
  "self-update",
  "setup",
  "space",
  "start",
  "status",
  "step",
  "stop-seeding",
  "stored",
  "stuck",
  "substitution",
  "trace",
  "undo",
  "uninstall",
  "update",
  "upgrade",
  "version",
  "walkthrough",
  "watch",
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
  "alerts": AlertsEnvelope;
  "archives": ArchivesEnvelope;
  "backup": BackupEnvelope;
  "bandwidth": BandwidthEnvelope;
  "beside": BesideEnvelope;
  "bundle": BundleEnvelope;
  "capabilities": CapabilitiesEnvelope;
  "catalogue": CatalogueEnvelope;
  "certificate": CertificateEnvelope;
  "clients": ClientsEnvelope;
  "config": ConfigEnvelope;
  "credentials": CredentialsEnvelope;
  "dashboard": DashboardEnvelope;
  "doctor": DoctorEnvelope;
  "error": ErrorEnvelope;
  "forms": FormsEnvelope;
  "front-door": FrontDoorEnvelope;
  "glossary": GlossaryEnvelope;
  "handoff": HandoffEnvelope;
  "held": HeldEnvelope;
  "history": HistoryEnvelope;
  "hosting": HostingEnvelope;
  "household": HouseholdEnvelope;
  "import": ImportEnvelope;
  "invitation": InvitationEnvelope;
  "job": JobEnvelope;
  "keys": KeysEnvelope;
  "lifecycle": LifecycleEnvelope;
  "log": LogEnvelope;
  "migration": MigrationEnvelope;
  "minted-key": MintedKeyEnvelope;
  "music": MusicEnvelope;
  "news": NewsEnvelope;
  "news-items": NewsItemsEnvelope;
  "outbound": OutboundEnvelope;
  "pairing": PairingEnvelope;
  "pausing": PausingEnvelope;
  "playing": PlayingEnvelope;
  "plugins": PluginsEnvelope;
  "preview": PreviewEnvelope;
  "provenance": ProvenanceEnvelope;
  "pull": PullEnvelope;
  "quality": QualityEnvelope;
  "removal": RemovalEnvelope;
  "repair": RepairEnvelope;
  "replacement": ReplacementEnvelope;
  "reset": ResetEnvelope;
  "restore": RestoreEnvelope;
  "seed": SeedEnvelope;
  "self-update": SelfUpdateEnvelope;
  "setup": SetupEnvelope;
  "space": SpaceEnvelope;
  "start": StartEnvelope;
  "status": StatusEnvelope;
  "step": StepEnvelope;
  "stop-seeding": StopSeedingEnvelope;
  "stored": StoredEnvelope;
  "stuck": StuckEnvelope;
  "substitution": SubstitutionEnvelope;
  "trace": TraceEnvelope;
  "undo": UndoEnvelope;
  "uninstall": UninstallEnvelope;
  "update": UpdateEnvelope;
  "upgrade": UpgradeEnvelope;
  "version": VersionEnvelope;
  "walkthrough": WalkthroughEnvelope;
  "watch": WatchEnvelope;
  "wiring": WiringEnvelope;
  "wizard": WizardEnvelope;
  "word": WordEnvelope;
}

/** An envelope of any kind the server may send, told apart by its `kind`. */
export type Envelope = ByKind[Kind];
