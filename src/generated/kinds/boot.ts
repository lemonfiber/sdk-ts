// Generated from the lemonfiber contract. Do not edit.
// The `boot` envelope, and the shapes only `boot` carries.
// Regenerate with `npm run contract:generate`.

import type { Forwarded } from "../shared/boot__lifecycle.js";

/** The envelope carrying `boot`. */
export interface BootEnvelope {
  api_version: number;
  data: BootReport;
  host?: string | null;
  job?: string | null;
  kind: "boot";
}

/** What a run at boot came to. */
export type BootOutcome = "passed" | "failed" | "waiting-for-install";

/**
 * When this machine last started, what the run after it came to, and how long the
 * stack has failed to come back.
 */
export interface BootReport {
  /** When this machine last started, in seconds since the Unix epoch, where it says. */
  booted_at?: number | null;
  /** Why a run after that start started nothing, where one did. */
  declined?: string | null;
  /** How many starts it has failed to come back after since then. */
  failed_boots?: number | null;
  /** Since when the stack has failed to come back, in seconds since the Unix epoch. */
  failing_since?: number | null;
  /** The newest verification kept against any start. */
  last_verified?: BootVerification | null;
  /** The verification kept against that start, where one ran after it. */
  verified?: BootVerification | null;
}

/** Whether the tunnel came back with the stack. */
export type BootTunnel = BootTunnelHeld | BootTunnelNotEstablished | BootTunnelNotChecked;

/** Its checks passed. */
export interface BootTunnelHeld {
  state: "held";
}

/**
 * Nothing checked it: the stack runs no tunnel, did not come up, or could not be
 * read.
 */
export interface BootTunnelNotChecked {
  state: "not-checked";
}

/** A check of it failed. */
export interface BootTunnelNotEstablished {
  /** Which, in the stack's words. */
  said: string;
  state: "not-established";
}

/** What one run at boot that reached the stack came to. */
export interface BootVerification {
  /** When the machine started that the run came after, where it said. */
  against?: number | null;
  /** When the run finished. */
  at: number;
  /** Each service that did not come back. */
  not_back?: string[];
  /** What it came to. */
  outcome: BootOutcome;
  /** The forwarded port before the start and after it, where the stack forwards one. */
  port?: Forwarded | null;
  /** The sentence the run raised, where it raised one. */
  said?: string | null;
  /** Whether the tunnel came back with the stack. */
  tunnel: BootTunnel;
}
