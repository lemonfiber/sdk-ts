// Generated from the lemonfiber contract. Do not edit.
// The `plugin-provenance` envelope, and the shapes only `plugin-provenance` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `plugin-provenance`. */
export interface PluginProvenanceEnvelope {
  api_version: number;
  data: Vouched;
  host?: string | null;
  job?: string | null;
  kind: "plugin-provenance";
}

/** What one of a plugin's images is vouched for. */
export interface Vouch {
  /** The digest that fixes what runs. */
  digest: string;
  /** The registry path, as the manifest declares it. */
  image: string;
  /** The service the image runs as. */
  service: string;
}

/** Every image a plugin pins, and what anybody has said about each. */
export interface Vouched {
  /** The plugin's id. */
  id: string;
  /** One answer per image it pins. */
  images: Vouch[];
  /**
   * Whether what was found stops an install.
   *
   * An unproven image does not: a publisher who signed nothing has made no claim,
   * and refusing every unsigned image would refuse most of the registry. A refused
   * one does, because a claim that did not hold is worse than none.
   */
  installable: boolean;
}
