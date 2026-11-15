// Generated from the lemonfiber contract. Do not edit.
// The `channels` envelope, and the shapes only `channels` carries.
// Regenerate with `npm run contract:generate`.

/** One live TV channel, as one member's account may watch it. */
export interface Channel {
  /** The identifier the server tells it apart by. */
  id: string;
  /** What it is called. */
  name: string;
  /** The programme on it now, where the server knows one. */
  now?: Programme | null;
  /** Its number, where it has one. */
  number?: string | null;
}

/** The envelope carrying `channels`. */
export interface ChannelsEnvelope {
  api_version: number;
  data: ChannelsReport;
  host?: string | null;
  job?: string | null;
  kind: "channels";
}

/** The live TV channels one member may watch, each with the programme on it now. */
export interface ChannelsReport {
  /**
   * Each channel their own account may watch whose programme now is within their
   * limits. Empty where their account may not watch live TV.
   */
  channels: Channel[];
  /** The identifier the media server files them under. */
  id: string;
  /** The member this was asked for, by the name they are known by. */
  member: string;
  /** Whether this was a rehearsal: what would have happened, with none of it done. */
  rehearsed: boolean;
}

/** A programme on a channel. */
export interface Programme {
  /** Its certificate, as the server holds it, where it has one. */
  certificate?: string | null;
  /** When it ends, where the server knows. */
  ends?: number | null;
  /** What it is called. */
  title: string;
}
