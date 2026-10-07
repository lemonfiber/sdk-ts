// Generated from the lemonfiber contract. Do not edit.
// The `handoff` envelope, and the shapes only `handoff` carries.
// Regenerate with `npm run contract:generate`.

/** One app a device can be pointed at the stack with, and the code that points it. */
export interface HandoffClient {
  /** What to use on it. */
  client: string;
  /**
   * What the code for this app carries: a link that opens the app at this server where
   * the app takes one, and the server's address otherwise.
   */
  code: string;
  /** Whether [`code`](Self::code) is such a link rather than the address alone. */
  deep_link: boolean;
  /** What somebody would call the device they are holding. */
  device: string;
  /** Whether that app is open source. A closed one is never the recommended path. */
  open_source: boolean;
}

/** The envelope carrying `handoff`. */
export interface HandoffEnvelope {
  api_version: number;
  data: HandoffReport;
  host?: string | null;
  job?: string | null;
  kind: "handoff";
}

/**
 * What there is to do next about a hand-off, which each surface says in its own words.
 *
 * Carried as a name rather than as a sentence because the act is the same everywhere
 * and the way to take it is not: a terminal names a command, and an app offers a
 * control. A sentence written here would have to pick one of them, and every other
 * surface would then be showing somebody an instruction it cannot carry out.
 */
export type HandoffRemedy = "invite" | "ask-again" | "start-server" | "record-address";

/**
 * Where one person's hand-off stands, and what to hand them.
 *
 * **The code is an address and nothing more.** Whoever holds a copy of it can find the
 * server and still has to sign in as somebody, so a code sent to the wrong phone, or
 * photographed over a shoulder, gives away where the server is and nothing else.
 */
export interface HandoffReport {
  /**
   * The address the code carries. Absent where there is no address to carry, which is
   * one of the ways a hand-off fails.
   */
  address?: string | null;
  /**
   * What is worth knowing about that address, where anything is: most often that it
   * answers only on the home network.
   */
  caution?: string | null;
  /** The apps to point a device at the stack with, each with its code. */
  clients: HandoffClient[];
  /** When a code was first issued for them, as an instant. Absent until one is. */
  issued?: string | null;
  /**
   * Who it is for, as the media server spells their account where it holds one, and as
   * it was asked for otherwise.
   */
  name: string;
  /**
   * Whether the media server offers the sign-in by short code, where one account already
   * signed in approves another device.
   */
  quick_connect: boolean;
  /**
   * Why it stands there, where that is not the state itself: why an account that is not
   * there stops it, and what stopped one that failed. In words any surface can show, so
   * it names no command; what to do about it is [`remedy`](Self::remedy).
   */
  reason?: string | null;
  /** Whether this was a rehearsal, in which no issue was written down. */
  rehearsed: boolean;
  /**
   * What there is to do next, where there is anything: named rather than said, so
   * that each surface offers it in its own way.
   */
  remedy?: HandoffRemedy | null;
  /** The devices signed in to the account now, as the media server lists them. */
  sessions: HandoffSession[];
  /** Where it stands. */
  state: HandoffState;
  /**
   * How the person signs in on the new device, one step at a time.
   *
   * Every step is something the person does on their device, in words any surface can
   * show. Asking again afterwards is not one of them: that is [`remedy`](Self::remedy).
   *
   * **Guidance and never an approval.** Where the sign-in asks for a short code to be
   * approved from a device they are already signed in on, that approval is theirs: it
   * is the step that proves the person holding the new device is the person the
   * account is for, and a program that took it for them would have proved nothing.
   */
  steps: string[];
}

/** One device the media server lists as signed in to the account. */
export interface HandoffSession {
  /** The app it signed in with. */
  client: string;
  /** What the device calls itself. */
  device: string;
  /** When the media server last heard from it, where it says. */
  last_seen?: string | null;
}

/**
 * Where one person's hand-off stands.
 *
 * Read from the media server each time rather than remembered, apart from when a code
 * was first issued and which devices were signed in then: whether a device is signed in
 * is the server's to say, and a copy kept here would go on saying it after the person
 * signed out.
 */
export type HandoffState = "unprovisioned" | "ready" | "pending" | "connected" | "failed";
