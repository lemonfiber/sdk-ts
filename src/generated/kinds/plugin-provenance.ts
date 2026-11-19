// Generated from the lemonfiber contract. Do not edit.
// The `plugin-provenance` envelope, and the shapes only `plugin-provenance` carries.
// Regenerate with `npm run contract:generate`.

/** What a service says its image is built on, and what this build makes of it. */
export interface Based {
  /** The upstream image, as the manifest names it. */
  image: string;
  /** The upstream's release, as the manifest names it. */
  release: string;
}

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
  /**
   * What the service says its image is built on, and what its build provenance makes
   * of that, where it says.
   */
  built_on?: Based | null;
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
   * one does, because a claim that did not hold is worse than none, and so does an
   * upstream image a service says it is built on that its build provenance does not
   * record.
   */
  installable: boolean;
}
