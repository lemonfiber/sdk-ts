// Generated from the lemonfiber contract. Do not edit.
// Every action the web API takes, and what the contract says of each.
// Regenerate with `npm run contract:generate`.

/** Every action the web API takes, by the name it is posted to under `/api/actions/`. */
export type ActionName = "accept" | "adopt" | "ask" | "backup" | "bandwidth" | "companion-pair" | "config-set" | "credentials-revoke" | "diagnose" | "down" | "downloads-pause" | "downloads-resume" | "forget" | "grant" | "hosting-install" | "hosting-remove" | "household-allow" | "household-approve" | "household-decline" | "household-handoff" | "internal-certificate-replace" | "invite" | "migrate-adopt" | "migrate-beside" | "migrate-import" | "migrate-replace" | "notify-choose" | "play" | "plugin-install" | "plugin-prove" | "plugin-remove" | "plugin-run" | "plugin-update" | "pull" | "push-woken" | "quality-reapply" | "quality-set" | "quality-upgrade" | "reissue" | "remove" | "repair" | "reset" | "restart" | "restore" | "run" | "search" | "seed" | "settings-clear" | "settings-set" | "space" | "stop-seeding" | "support" | "switch" | "tune" | "undo" | "uninstall" | "up" | "update" | "walkthrough" | "watch" | "watched" | "wiring-fill";

/** What the contract says of one action. */
export interface ActionDescribed {
  /** The name of every argument it takes, in the order the contract lists them. */
  readonly arguments: readonly string[];
  /** The arguments carrying the operator's yes, without which it writes nothing. */
  readonly consent: readonly string[];
  /** Whether it takes `dry_run`, so it can be rehearsed before the real call. */
  readonly rehearsal: boolean;
}

/** What the contract says of every action the web API takes, by name. */
export const ACTIONS: Readonly<Record<ActionName, ActionDescribed>> = {
  "accept": { arguments: ["check","disruptive"], consent: [], rehearsal: false },
  "adopt": { arguments: [], consent: [], rehearsal: true },
  "ask": { arguments: ["name","id","kind","seasons","unit","found"], consent: [], rehearsal: true },
  "backup": { arguments: ["service"], consent: [], rehearsal: true },
  "bandwidth": { arguments: ["down","up","active","line","cap","exceeded","unrestricted_for"], consent: [], rehearsal: true },
  "companion-pair": { arguments: [], consent: [], rehearsal: false },
  "config-set": { arguments: ["wait","key","value","confirm"], consent: ["confirm"], rehearsal: true },
  "credentials-revoke": { arguments: ["offer","plugin","credential"], consent: ["offer"], rehearsal: true },
  "diagnose": { arguments: ["only","disruptive"], consent: [], rehearsal: false },
  "down": { arguments: ["forms","services","wait"], consent: [], rehearsal: true },
  "downloads-pause": { arguments: ["offer"], consent: ["offer"], rehearsal: true },
  "downloads-resume": { arguments: ["offer"], consent: ["offer"], rehearsal: true },
  "forget": { arguments: ["confirm"], consent: ["confirm"], rehearsal: true },
  "grant": { arguments: ["name","device"], consent: [], rehearsal: true },
  "hosting-install": { arguments: ["forms","kept"], consent: [], rehearsal: true },
  "hosting-remove": { arguments: ["kept"], consent: [], rehearsal: true },
  "household-allow": { arguments: ["name","policy","requests","days"], consent: [], rehearsal: true },
  "household-approve": { arguments: ["request"], consent: [], rehearsal: true },
  "household-decline": { arguments: ["request","reason"], consent: [], rehearsal: true },
  "household-handoff": { arguments: ["name"], consent: [], rehearsal: true },
  "internal-certificate-replace": { arguments: ["offer"], consent: ["offer"], rehearsal: true },
  "invite": { arguments: ["name","libraries","age_limit","unrated","confirm"], consent: ["confirm"], rehearsal: true },
  "migrate-adopt": { arguments: ["confirm"], consent: ["confirm"], rehearsal: true },
  "migrate-beside": { arguments: ["confirm"], consent: ["confirm"], rehearsal: true },
  "migrate-import": { arguments: ["confirm"], consent: ["confirm"], rehearsal: true },
  "migrate-replace": { arguments: ["offer"], consent: ["offer"], rehearsal: true },
  "notify-choose": { arguments: ["backends"], consent: [], rehearsal: true },
  "play": { arguments: ["device","id","pass"], consent: [], rehearsal: true },
  "plugin-install": { arguments: ["offer","source","approved","inputs"], consent: ["offer","approved"], rehearsal: true },
  "plugin-prove": { arguments: ["offer","plugin"], consent: ["offer"], rehearsal: true },
  "plugin-remove": { arguments: ["offer","plugin"], consent: ["offer"], rehearsal: true },
  "plugin-run": { arguments: ["offer","plugin","recipe","approved","inputs"], consent: ["offer","approved"], rehearsal: true },
  "plugin-update": { arguments: ["offer","plugin","source","approved","inputs"], consent: ["offer","approved"], rehearsal: true },
  "pull": { arguments: ["forms"], consent: [], rehearsal: true },
  "push-woken": { arguments: ["name","id"], consent: [], rehearsal: true },
  "quality-reapply": { arguments: [], consent: [], rehearsal: true },
  "quality-set": { arguments: ["preset","media_type","confirm"], consent: ["confirm"], rehearsal: true },
  "quality-upgrade": { arguments: ["confirm"], consent: ["confirm"], rehearsal: true },
  "reissue": { arguments: ["name"], consent: [], rehearsal: true },
  "remove": { arguments: ["name","offer"], consent: ["offer"], rehearsal: true },
  "repair": { arguments: ["disruptive","offer","agreed","confirm"], consent: ["offer","agreed","confirm"], rehearsal: true },
  "reset": { arguments: ["offer"], consent: ["offer"], rehearsal: true },
  "restart": { arguments: ["forms","services","offer"], consent: ["offer"], rehearsal: true },
  "restore": { arguments: ["archive","repoint","offer","confirm"], consent: ["offer","confirm"], rehearsal: true },
  "run": { arguments: ["service","now"], consent: [], rehearsal: true },
  "search": { arguments: ["disruptive","term","season"], consent: [], rehearsal: false },
  "seed": { arguments: [], consent: [], rehearsal: true },
  "settings-clear": { arguments: ["settings","offer"], consent: ["offer"], rehearsal: true },
  "settings-set": { arguments: ["values","offer"], consent: ["offer"], rehearsal: true },
  "space": { arguments: ["only","offer"], consent: ["offer"], rehearsal: true },
  "stop-seeding": { arguments: ["offer","download"], consent: ["offer"], rehearsal: true },
  "support": { arguments: ["write","logs","filenames","reveal","confirm"], consent: ["confirm"], rehearsal: true },
  "switch": { arguments: ["forms","offer"], consent: ["offer"], rehearsal: true },
  "tune": { arguments: ["id","stream","stop"], consent: [], rehearsal: true },
  "undo": { arguments: ["at"], consent: [], rehearsal: true },
  "uninstall": { arguments: ["wait","offer","confirm","tier"], consent: ["offer","confirm"], rehearsal: true },
  "up": { arguments: ["forms","services","offer"], consent: ["offer"], rehearsal: true },
  "update": { arguments: ["wait","service","offer","confirm"], consent: ["offer","confirm"], rehearsal: true },
  "walkthrough": { arguments: ["item"], consent: [], rehearsal: false },
  "watch": { arguments: ["forms"], consent: [], rehearsal: true },
  "watched": { arguments: ["name","id","position","ended"], consent: [], rehearsal: true },
  "wiring-fill": { arguments: ["service","offer","reason","capability"], consent: ["offer"], rehearsal: true },
};

/** Whether a name is one of an action the web API takes. */
export const isActionName = (value: string): value is ActionName =>
  Object.hasOwn(ACTIONS, value);
