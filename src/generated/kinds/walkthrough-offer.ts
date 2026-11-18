// Generated from the lemonfiber contract. Do not edit.
// The `walkthrough-offer` envelope, and the shapes only `walkthrough-offer` carries.
// Regenerate with `npm run contract:generate`.

import type { Reason, Shape } from "../shared/reason.js";

/** The envelope carrying `walkthrough-offer`. */
export interface WalkthroughOfferEnvelope {
  api_version: number;
  data: Why;
  host?: string | null;
  job?: string | null;
  kind: "walkthrough-offer";
}

/** Whether a walkthrough is worth offering to this stack, and which one. */
export type Why = WhyOffer | WhyNot;

/** Do not offer. What is missing first, said as the reason it would have stopped at. */
export interface WhyNot {
  not: Reason;
}

/** Offer this shape of walk. */
export interface WhyOffer {
  offer: Shape;
}
