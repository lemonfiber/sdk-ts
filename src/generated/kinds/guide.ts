// Generated from the lemonfiber contract. Do not edit.
// The `guide` envelope, and the shapes only `guide` carries.
// Regenerate with `npm run contract:generate`.

import type { Instant } from "../shared/instant.js";

/** A programme in a channel's guide. */
export interface Airing {
  /** Its certificate, as the server holds it, where it has one. */
  certificate?: string | null;
  /** When it ends. */
  ends: Instant;
  /** When it starts. */
  starts: Instant;
  /** What it is called. */
  title: string;
}

/** The envelope carrying `guide`. */
export interface GuideEnvelope {
  api_version: number;
  data: GuideReport;
  host?: string | null;
  job?: string | null;
  kind: "guide";
}

/**
 * The live TV guide one member may watch: each channel with its programmes from now
 * across the guide window.
 */
export interface GuideReport {
  /**
   * Each channel their own account may watch whose programme now is within their
   * limits. Empty where their account may not watch live TV.
   */
  channels: Guided[];
  /** The identifier the media server files them under. */
  id: string;
  /** The member this was asked for, by the name they are known by. */
  member: string;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
}

/** One channel in a member's guide. */
export interface Guided {
  /**
   * When the last programme the media server's guide holds on it inside the window
   * ends; none where it holds none.
   */
  guide_until?: Instant | null;
  /** The identifier the server tells it apart by. */
  id: string;
  /** What it is called. */
  name: string;
  /** Its number, where it has one. */
  number?: string | null;
  /**
   * Each programme on it from now across the guide window, in the order they air, the
   * one on now first; one outside the member's limits is left out, a gap.
   */
  programmes: Airing[];
}
