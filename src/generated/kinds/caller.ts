// Generated from the lemonfiber contract. Do not edit.
// The `caller` envelope, and the shapes only `caller` carries.
// Regenerate with `npm run contract:generate`.

/** Who is calling. */
export type Caller = CallerOperator | CallerMember | CallerKey;

/** The envelope carrying `caller`. */
export interface CallerEnvelope {
  api_version: number;
  data: Calling;
  host?: string | null;
  job?: string | null;
  kind: "caller";
}

/** A program, on a key the operator or a member minted for it. */
export interface CallerKey {
  as: "key";
  /** The key's name. */
  name: string;
  /** What it admits: `read`, `act` or `member:<name>`. */
  scope: string;
}

/** A household member, on a session of their own. */
export interface CallerMember {
  as: "member";
  /** The id the media server files them under. */
  id: string;
}

/** The operator, on a session opened with the machine's password. */
export interface CallerOperator {
  as: "operator";
}

/** What the session or key a request carried came to. */
export type Calling = CallingKnown | CallingNobody | CallingUnconfirmed | CallingHeld | CallingExposed;

/** A key that crossed a network in the clear. */
export interface CallingExposed {
  standing: "exposed";
}

/** A key held back by too many wrong answers. */
export interface CallingHeld {
  /** How many whole seconds are left to wait. */
  retry_after: number;
  standing: "held";
}

/** Somebody this run admits. */
export interface CallingKnown {
  /** Who they are. */
  caller: Caller;
  standing: "known";
}

/** Nobody this run admits. */
export interface CallingNobody {
  standing: "nobody";
}

/** A member the media server could not be asked about. */
export interface CallingUnconfirmed {
  standing: "unconfirmed";
}
