// Generated from the lemonfiber contract. Do not edit.
// The `provenance` envelope, and the shapes only `provenance` carries.
// Regenerate with `npm run contract:generate`.

/** The envelope carrying `provenance`. */
export interface ProvenanceEnvelope {
  api_version: number;
  data: ProvenanceReport;
  host?: string | null;
  job?: string | null;
  kind: "provenance";
}

/** Where every service in this stack comes from. */
export interface ProvenanceReport {
  /**
   * The services, in the order the stack declares them.
   *
   * Every service the manifest holds rather than the ones some form would start:
   * what is *in* this stack is the question being asked, and an answer narrowed to
   * what is running would leave the operator unable to ask about the service they
   * are deciding whether to run.
   */
  services: ServiceProvenance[];
}

/** Where one service comes from, as the stack declares it. */
export interface ServiceProvenance {
  /**
   * The digest of the image that runs, where the stack names one.
   *
   * Beside the tag rather than instead of it: the tag is the version somebody reads,
   * and the digest is the one image that version was when it was pinned, which is
   * what is pulled and what somebody verifies against the registry.
   */
  digest?: string | null;
  /** The service's id, which is also its Compose service name. */
  id: string;
  /** The image it runs, without a tag. */
  image: string;
  /**
   * The SPDX identifier of the licence it is published under.
   *
   * Stated rather than summarised as *open source*, because the identifier is what
   * somebody checks against the project — and because the four in this stack are
   * not interchangeable to anybody deciding what to do with what they run.
   */
  license: string;
  /** What it is called in front of an operator. */
  name: string;
  /**
   * The exact tag this stack pins it at.
   *
   * Kept apart from the image rather than written as one reference, so that a
   * caller comparing what is pinned against what a project has released is
   * comparing versions rather than parsing them out of a string. The two are
   * printed together for a person, because a version without the image it belongs
   * to names nothing that can be fetched.
   */
  pinned: string;
  /**
   * The project it is built from.
   *
   * The whole point of the entry for anybody verifying: the licence is a string
   * this stack wrote down, and this is where somebody goes to find out whether the
   * project still agrees with it.
   */
  upstream: string;
}
