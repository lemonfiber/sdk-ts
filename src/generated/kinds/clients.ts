// Generated from the lemonfiber contract. Do not edit.
// The `clients` envelope, and the shapes only `clients` carries.
// Regenerate with `npm run contract:generate`.

/** One thing that could be behind a symptom, and how to tell it from the others. */
export interface Cause {
  /** What is wrong. */
  because: string;
  /** What to do about it. */
  fix: string;
  /** How to tell this cause from the others under the same symptom. */
  tell: string;
}

/** The envelope carrying `clients`. */
export interface ClientsEnvelope {
  api_version: number;
  data: Guidance;
  host?: string | null;
  kind: "clients";
}

/** A kind of device somebody in the house might watch on. */
export interface Device {
  /** What is worth knowing before starting, where anything is. */
  caution?: string | null;
  /** What to use on it. */
  client: string;
  /**
   * A link that opens the app already pointed at this server, where the app is known to
   * take one, with `{address}` where the server's address goes. Absent otherwise, and a
   * hand-off then carries the address alone as its code, which the app is pointed at by
   * scanning or typing.
   */
  deep_link?: string | null;
  /** What somebody would call the device they are holding. */
  device: string;
  /** What to do instead where this is a bad device to be stuck with. */
  instead?: string | null;
  /**
   * Whether the app named is open source. A closed one may be named, with this false
   * beside it, and is never the one recommended.
   */
  open_source: boolean;
  /** How well served it is. */
  support: Support;
}

/** The guidance in full, for a surface that shows all of it. */
export interface Guidance {
  /** Every device, in the order somebody is likely to be holding one. */
  devices: Device[];
  /** What this will not do for them. */
  nothing_is_installed: string;
  /** True of every device, said once. */
  only_at_home: string;
  /**
   * Why playback here is likely to struggle before any app is chosen, or `None`
   * where the preset in force asks for nothing this platform cannot serve.
   *
   * Absent far more often than present, and it must be: a caution shown to
   * everybody says nothing about anybody's machine, and a reader who meets one
   * every time stops reading it.
   */
  straining?: Straining | null;
  /** What to do when it does not work, keyed by the symptom. */
  trouble: Trouble[];
}

/**
 * Why playback here is likely to struggle, whatever app the household installs.
 *
 * Present only where the preset in force asks for transcoding this platform cannot
 * do in hardware. It belongs to the guidance rather than to any one device: the
 * preset and the platform decide it between them, and every device in the table
 * meets it.
 */
export interface Straining {
  /**
   * What that preset asks of this machine, and what playback does where this
   * machine cannot give it.
   */
  caution: string;
  /** What makes it stop. */
  instead: string;
  /** The preset in force, under the name it was chosen by. */
  preset: string;
}

/** How well a device is served. */
export type Support = "good" | "workable" | "poor" | "fallback";

/**
 * Something somebody reports, and what is likely behind it.
 *
 * Keyed by the symptom rather than the cause: the person asking has the symptom,
 * and which cause it is is the thing they cannot yet say.
 */
export interface Trouble {
  /** What is likely behind it, most likely first. */
  causes: Cause[];
  /** What somebody says is happening, in their words. */
  symptom: string;
}
