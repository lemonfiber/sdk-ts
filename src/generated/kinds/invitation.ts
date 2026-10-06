// Generated from the lemonfiber contract. Do not edit.
// The `invitation` envelope, and the shapes only `invitation` carries.
// Regenerate with `npm run contract:generate`.

import type { Unrated } from "../shared/dashboard__household__invitation.js";

/**
 * One invitation, as it was just made.
 *
 * Carries what the operator has to pass on and nothing else — a name to sign in
 * with, one address, and how long it stands. The address is the media server's,
 * because setting a first password happens there.
 */
export interface Invitation {
  /**
   * The one address to send them.
   *
   * Where a *person* reaches the media server: built from what this machine is
   * called on the network, not from either of the hosts the stack wires itself
   * with — those resolve only on this machine or inside the stack, and an
   * invitation carrying one sends somebody an address that cannot open.
   */
  address: string;
  /** What this offer wrote on the account, where it wrote anything. */
  applied?: InvitationApplied | null;
  /**
   * What is worth knowing about the address itself, where anything is.
   *
   * An address that is a number is one a router can hand elsewhere, so a bookmark
   * made from it stops working with nothing here having changed. Carried on the
   * invitation because that is the copy somebody keeps.
   */
  caution?: string | null;
  /**
   * Where they can decline it instead, where the stack runs the decline service.
   *
   * A page on the household's own network that refuses this invitation and nothing
   * else, and switches the account made for it off. Its token is in this address
   * alone: offering the same person again mints a new one, and the old address stops
   * declining anything. Absent on a rehearsal, for somebody already in the household,
   * and where the stack runs no decline service.
   */
  decline?: string | null;
  /**
   * How many hours it stands before it is withdrawn.
   *
   * Counted from when it was *offered*, which for an account whose password was
   * taken off is the moment of the reset rather than when the account was made.
   * What happens at the end depends on the account: one nobody has been in is
   * removed, and one somebody has is switched off and kept.
   */
  hours: number;
  /**
   * Whether the request service knows about the household yet.
   *
   * Separate from `standing`, which is about the media-server account alone. The
   * two can disagree — an account made while the request service was unreachable
   * is `Made` and `NotYet` — and that disagreement is the state this reports.
   */
  linked: Linked;
  /** The name they sign in as. */
  name: string;
  /**
   * Whether the account was made, or only described.
   *
   * A rehearsal can say the whole answer without writing any of it — the name is
   * the one asked for, the address is the stack's, and what has run out has just
   * been read — so the only thing separating it from the real run is this.
   */
  rehearsed: boolean;
  /** What was found where this was going. */
  standing: InvitationStanding;
  /**
   * Accounts somebody had been in, reset and not claimed again in time, switched off
   * on the way past rather than removed.
   *
   * Kept because removing one takes what they watched with it. Switched off because
   * an account with no password that anybody may still claim is the thing a window
   * exists to close. Offering it again, or reissuing it, switches it back on. On a
   * rehearsal these are the ones that *would* be switched off.
   */
  suspended: string[];
  /**
   * Invitations nobody claimed in time, removed on the way past.
   *
   * Reported rather than done quietly: an operator who invited somebody last
   * week and hears nothing would otherwise have no way to learn the account is
   * gone. On a rehearsal these are the ones that *would* be removed.
   */
  withdrawn: string[];
}

/**
 * What an invitation wrote on the account, in the household's own words.
 *
 * **Said back so an absence later is explicable.** A member held to a rating who
 * cannot find half the library is either this working or a defect, and an operator
 * with nothing on record cannot tell which. So the limit, the libraries, what happened
 * to content the media server has no rating for, and whether the request service was
 * held to the same decision all travel back on the answer that applied them.
 *
 * Absent where the offer set nothing at all, which is not the same as an offer that
 * set no restrictions: naming neither a library nor a limit is saying nothing about
 * access, and nothing is what gets written.
 *
 * Serialised in the field names the household read uses for the same facts, rather
 * than in the invitation's own spelling: one setting named two ways across two shapes
 * is two shapes a client has to be told are about the same thing.
 */
export interface InvitationApplied {
  /**
   * What a limit here is, and what it is not.
   *
   * Carried on the answer rather than left to a document, because the reader who
   * most needs it is the parent who has just set one.
   */
  filtering: string;
  /** The libraries they may open, as the operator named them. Empty is every one. */
  libraries: string[];
  /**
   * How far up the ratings they may watch, in the words and the certificates this
   * media server names in the operator's own country. Absent where no limit was set.
   */
  limit?: string | null;
  /**
   * Whether the request service was held to the same decision.
   *
   * The same three answers a link carries, and for the same reason: what somebody
   * may *ask for* is a second service's business, and that service can be down while
   * the media server is not. `NotTried` here is a service with no account for them
   * yet — nothing to hold rather than a failure to hold something.
   */
  requesting: Linked;
  /**
   * What becomes of content the media server has no rating for.
   *
   * Held back by default on somebody being narrowed, because a rating limit cannot
   * decide about a thing that carries no rating. The cost is real and is why this is
   * reported rather than assumed: some legitimate content becomes invisible to them.
   */
  unrated: Unrated;
}

/** The envelope carrying `invitation`. */
export interface InvitationEnvelope {
  api_version: number;
  data: Invitation;
  host?: string | null;
  kind: "invitation";
}

/**
 * What was found where the invitation was going.
 *
 * Offering somebody an account twice is a thing operators do — they forget, or the
 * first message went unanswered — and it is not a mistake to be refused. Each of
 * these is an answer, and which one it is decides what there is to say rather than
 * whether anything worked.
 */
export type InvitationStanding = "made" | "waiting" | "joined" | "reset";

/**
 * Whether the request service has been given an account for the household yet.
 *
 * The account somebody watches with is made on the media server, and it stands on its
 * own from that moment — nothing has to be running for them to claim it. Being able
 * to *ask* for something is a second account, on a second service, and that service
 * can be down while the first is not.
 *
 * So this is reported rather than made a condition of the invitation: an operator who
 * invites somebody during an outage has still invited them, and what they cannot do
 * yet is worth one line rather than a refusal.
 */
export type Linked = "made" | "not-yet" | "not-tried";
