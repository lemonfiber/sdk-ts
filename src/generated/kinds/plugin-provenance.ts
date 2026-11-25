// Generated from the lemonfiber contract. Do not edit.
// The `plugin-provenance` envelope, and the shapes only `plugin-provenance` carries.
// Regenerate with `npm run contract:generate`.

/** What a service says its image is built on, and what this build makes of it. */
export type Based = BasedRecorded | BasedUnproven | BasedRefused;

/** The build of every platform's image is recorded as starting from it. */
export interface BasedRecorded {
  basis: "recorded";
  /** The digest of the upstream image each build is recorded as starting from. */
  digests: string[];
  /** The upstream image, as the manifest names it. */
  image: string;
  /** The upstream's release, as the manifest names it. */
  release: string;
}

/** The build of some platform's image is not recorded as starting from it. */
export interface BasedRefused {
  basis: "refused";
  /** The upstream image, as the manifest names it. */
  image: string;
  /** The upstream's release, as the manifest names it. */
  release: string;
  /** What each such build is recorded as starting from. */
  why: string;
}

/** The build provenance could not be asked for. */
export interface BasedUnproven {
  basis: "unproven";
  /** The upstream image, as the manifest names it. */
  image: string;
  /** The upstream's release, as the manifest names it. */
  release: string;
  /** What stopped it being asked for. */
  why: string;
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
export type Vouch = VouchSigned | VouchUnproven | VouchRefused;

/** A signature is offered and it does not hold. */
export interface VouchRefused {
  /**
   * What the service says its image is built on, and what its build provenance makes
   * of that, where it says.
   */
  built_on?: Based | null;
  /** The digest that fixes what runs. */
  digest: string;
  /** The registry path, as the manifest declares it. */
  image: string;
  provenance: "refused";
  /** The service the image runs as. */
  service: string;
  /** Every way it does not. */
  why: string;
}

/** A signature over a payload naming this digest verified against a held key. */
export interface VouchSigned {
  /**
   * What the service says its image is built on, and what its build provenance makes
   * of that, where it says.
   */
  built_on?: Based | null;
  /** Which key it verified against, so the answer names what was trusted. */
  by: string;
  /** The digest that fixes what runs. */
  digest: string;
  /** The registry path, as the manifest declares it. */
  image: string;
  provenance: "signed";
  /** The service the image runs as. */
  service: string;
}

/** Nothing was established, and nothing follows from it either way. */
export interface VouchUnproven {
  /**
   * What the service says its image is built on, and what its build provenance makes
   * of that, where it says.
   */
  built_on?: Based | null;
  /** The digest that fixes what runs. */
  digest: string;
  /** The registry path, as the manifest declares it. */
  image: string;
  provenance: "unproven";
  /** The service the image runs as. */
  service: string;
  /** What stopped it being established. */
  why: string;
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
