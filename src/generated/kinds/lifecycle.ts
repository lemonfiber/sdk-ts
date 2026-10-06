// Generated from the lemonfiber contract. Do not edit.
// The `lifecycle` envelope, and the shapes only `lifecycle` carries.
// Regenerate with `npm run contract:generate`.

import type { Service } from "../shared/dashboard__lifecycle__status.js";
import type { ConflictReport } from "../shared/lifecycle__migration.js";
import type { Plan } from "../shared/lifecycle__preview.js";
import type { StackEdit } from "../shared/lifecycle__quality__reset__update.js";
import type { Condition } from "../shared/lifecycle__status.js";

/** The envelope carrying `lifecycle`. */
export interface LifecycleEnvelope {
  api_version: number;
  data: LifecycleReport;
  host?: string | null;
  kind: "lifecycle";
}

/** What a lifecycle command did, or would have done. */
export interface LifecycleReport {
  /** The Compose subcommand that was run. */
  action: string;
  /** The exact command, so what happened is never a matter of trust. */
  command: string[];
  /** What those services amount to, as one word. */
  condition?: Condition | null;
  /**
   * What starting the stack did about the VPN's forwarded port, where it did
   * anything. Absent in the ordinary case — the client was already on it, or
   * there is no tunnel to forward through — and a sentence where the client was
   * moved, or could not be.
   */
  forwarding?: string | null;
  /**
   * Why nothing was run, where a start declined to run anything.
   *
   * Absent for every ordinary command, which is what makes it readable: a
   * lifecycle report with an empty plan and a status of nothing is a report of
   * something that did not happen, and without this there is nowhere to say
   * whether that was a fault or the correct answer. A start at a login declines
   * for three reasons the operator would each act on differently — the stack was
   * stopped on purpose, autostart was never asked for, or this machine is on its
   * battery and nobody said to start anyway — and a run nobody is watching has to
   * leave the reason somewhere a reader finds later.
   */
  held?: string | null;
  /**
   * What the named forms came to: the profiles, the services they hold, and
   * what the configuration left out.
   *
   * The resolved plan itself rather than a copy of its parts, because it is
   * stated to the operator before the command runs and read out of the
   * report afterwards — two accounts of one run, and a second shape for it
   * would be a way for them to differ.
   */
  plan: Plan;
  /**
   * Host ports this start wants that another Compose project on this machine
   * already answers on, each named on both sides.
   *
   * Empty for every action that starts nothing, and empty on a machine running one
   * stack. Reported rather than refused: a port somebody deliberately shares is
   * their business, and the start goes ahead — what this changes is whether an
   * operator meeting a bind failure knows who is holding the port.
   */
  port_conflicts?: ConflictReport[];
  /** Whether this was a rehearsal. */
  rehearsed: boolean;
  /**
   * What each service ended up doing, where the action waited to find out, or
   * where a start did not complete, read once when it ended.
   *
   * Empty for actions that do not wait. Stopping is finished when Compose
   * says it is, and surveying afterwards would only report the absence it
   * was asked to produce. A start that failed is not waited on, and names every
   * service it addressed and those they depend on as the engine had them then.
   */
  services: Service[];
  /**
   * Stack files the operator has edited, left as they set them rather than
   * overwritten with lemonfiber's own. Empty in the ordinary case; a named entry
   * warns that an upgrade would change a file they changed, and shows the diff.
   */
  stack_edits: StackEdit[];
  /** The exit status, absent for a rehearsal or a signalled process. */
  status?: number | null;
  /**
   * What narrowing moved, where the command was a switch. Absent for every
   * other action, which is what tells a reader that nothing was left running
   * on purpose.
   */
  switched?: Switched | null;
}

/**
 * What narrowing the active set moved.
 *
 * Three lists rather than a before and an after, because the operator's question
 * is not "what is running now" — they can ask that — but "what did that do". The
 * middle list is the one that makes the verb worth having: it is the promise that
 * a download in flight was not interrupted to change the shape of the stack
 * around it.
 */
export interface Switched {
  /**
   * Left running: the new closure holds them too, so nothing here asked them to
   * stop. Not a promise that nothing touched them — Compose recreates a container
   * whose configuration changed — but a promise that narrowing did not.
   */
  kept: string[];
  /** Started, because the new closure holds them and they were not up. */
  started: string[];
  /**
   * The exact Compose invocation that stopped what fell outside, so a switch is
   * no more a matter of trust than any other action. Absent where nothing had
   * to stop.
   */
  stop_command?: string[] | null;
  /** Stopped, because the new closure does not hold them. */
  stopped: string[];
}
