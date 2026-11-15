// Generated from the lemonfiber contract. Do not edit.
// The shapes `plugins`, `settings` and `status` all carry.
// Regenerate with `npm run contract:generate`.

/** A service held back until the operator gives what it needs to start. */
export interface Waiting {
  /** The service. */
  service: string;
  /** Everything it waits for. */
  wants: Wanted[];
}

/** One thing a service waits for, never with its value. */
export type Wanted = WantedSetting | WantedSecret | WantedService;

/** A secret nobody has entered. */
export interface WantedSecret {
  kind: "secret";
  /** The secret, by its name in the secret store. */
  secret: string;
}

/** The service it runs through, which is held back itself. */
export interface WantedService {
  kind: "service";
  /** That service. */
  service: string;
}

/** A setting only the operator holds, or one holding a value outside its choices. */
export interface WantedSetting {
  /** The values it accepts, where it declares choices. */
  choices?: string[] | null;
  kind: "setting";
  /** The setting. */
  setting: string;
}
