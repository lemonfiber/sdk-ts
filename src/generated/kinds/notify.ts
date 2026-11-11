// Generated from the lemonfiber contract. Do not edit.
// The `notify` envelope, and the shapes only `notify` carries.
// Regenerate with `npm run contract:generate`.

import type { NotificationKind } from "../shared/alerts__notify.js";

/** One back-end, as the read lists it. */
export interface NotifyBackend {
  /** Who chose it. */
  chosen_by: NotifyChosenBy;
  /** Every failed delivery since its last confirmed one, newest first. */
  failures: NotifyDelivery[];
  /** Where it is hosted, absent where it is the household's own. */
  hosted?: NotifyHosted | null;
  /** The stack's name for it, the same on every read. */
  id: string;
  /** What it speaks. */
  kind: NotifyBackendKind;
  /** Its newest delivery, absent where it has never delivered. */
  last?: NotifyDelivery | null;
  /** How far it is proven. */
  proof: NotifyProof;
  /** The delivery still to be tried again, absent where none is. */
  retry?: NotifyRetry | null;
  /** The host and topic or path it reaches, with no credential. */
  where: string;
}

/** What a back-end speaks. */
export type NotifyBackendKind = "ntfy" | "gotify" | "webhook" | "apprise" | "unifiedpush";

/** Who chose a back-end. */
export type NotifyChosenBy = "operator" | NotifyChosenByMember;

/** A household member, by their account's id. */
export interface NotifyChosenByMember {
  member: string;
}

/** One delivery to one back-end. */
export interface NotifyDelivery {
  /** When it was sent, in seconds since the Unix epoch. */
  at: number;
  /** Which kind of alert it carried. */
  kind: NotificationKind;
  /** What became of it. */
  outcome: NotifyOutcome;
}

/** The envelope carrying `notify`. */
export interface NotifyEnvelope {
  api_version: number;
  data: NotifyReport;
  host?: string | null;
  job?: string | null;
  kind: "notify";
}

/** A back-end on a host that is not the household's own. */
export interface NotifyHosted {
  /** The host it reaches. */
  host: string;
  /** What leaves for it, in the operator's words. */
  leaves: string[];
}

/** What became of one delivery. */
export type NotifyOutcome = "confirmed" | "sent" | NotifyOutcomeFailed;

/** The back-end refused it or did not answer, in its own words. */
export interface NotifyOutcomeFailed {
  failed: string;
}

/** How far a back-end is proven. */
export type NotifyProof = "unproven" | NotifyProofProven | NotifyProofHeld;

/** Nothing is delivered to it until it is proven again, and why. */
export interface NotifyProofHeld {
  held: string;
}

/** A test was seen arriving, at this instant in seconds since the Unix epoch. */
export interface NotifyProofProven {
  proven: number;
}

/** Where a message goes: every back-end the stack delivers to. */
export interface NotifyReport {
  /** Each back-end, in the order it was added. */
  backends: NotifyBackend[];
  /** Whether this was a rehearsal of a change, with nothing kept. */
  rehearsed: boolean;
  /** Where delivery as a whole stands. */
  state: NotifyState;
  /** Each back-end whose record could not be read, with why. */
  unread: NotifyUnread[];
}

/** A delivery still to be tried again. */
export interface NotifyRetry {
  /** Which attempt that will be, from one. */
  attempt: number;
  /** When it is tried next, in seconds since the Unix epoch. */
  next: number;
  /** How many attempts it is given. */
  of: number;
}

/** Where delivery as a whole stands. */
export type NotifyState = "unconfigured" | "ready" | "degraded" | "unreachable";

/** A back-end whose record could not be read. */
export interface NotifyUnread {
  /** The back-end, by its id. */
  backend: string;
  /** Why. */
  because: string;
}
