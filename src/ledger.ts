/**
 * What the stream has said, and how much of it can still be believed.
 *
 * Spec: 20-architecture/contracts/web-api.md
 */

/**
 * A value the stream carried, with how current it is.
 */
export type Held =
  | { at: "live"; kind: string; data: unknown }
  | { at: "stale"; kind: string; data: unknown; quietForMs: number };

interface Entry {
  data: unknown;
  recordedAtMs: number;
  live: boolean;
}

/**
 * Holds the last value seen for each kind.
 *
 * A gap in the stream does not discard what was held; it stops the ledger
 * calling it live. The value remains the last thing the source said.
 */
export class Ledger {
  readonly #entries = new Map<string, Entry>();
  #lastArrivalMs: number | undefined;

  /**
   * Records a value arriving now.
   */
  record(kind: string, data: unknown, atMs: number): void {
    this.#entries.set(kind, { data, recordedAtMs: atMs, live: true });
    this.spoke(atMs);
  }

  /**
   * Notes the stream speaking without it having said anything.
   *
   * The server breaks a silence with a comment line, which holds no value and
   * names no kind and is the whole of what tells a quiet stream from a dead one.
   * What is held is untouched; what starts again is the silence.
   */
  spoke(atMs: number): void {
    this.#lastArrivalMs = atMs;
  }

  /**
   * Milliseconds since anything arrived, or `undefined` before the first.
   */
  quietForMs(nowMs: number): number | undefined {
    if (this.#lastArrivalMs === undefined) return undefined;
    return nowMs - this.#lastArrivalMs;
  }

  /**
   * Marks everything held as no longer current.
   *
   * Called when the connection drops and when it resumes: a value gathered
   * before a gap is stale whatever the transport reports.
   */
  cool(): void {
    for (const entry of this.#entries.values()) entry.live = false;
  }

  /**
   * What is held for `kind`, or `undefined` if nothing ever arrived for it.
   */
  held(kind: string, nowMs: number): Held | undefined {
    const entry = this.#entries.get(kind);
    if (entry === undefined) return undefined;
    return Ledger.#shape(kind, entry, nowMs);
  }

  /**
   * Everything held, in the order it was first recorded.
   */
  all(nowMs: number): Held[] {
    return [...this.#entries].map(([kind, entry]) => Ledger.#shape(kind, entry, nowMs));
  }

  static #shape(kind: string, entry: Entry, nowMs: number): Held {
    const data = entry.data;
    if (entry.live) return { at: "live", kind, data };
    return { at: "stale", kind, data, quietForMs: nowMs - entry.recordedAtMs };
  }

  /**
   * Everything held, all of it stale. Read after `cool`.
   */
  cooled(nowMs: number): { kind: string; data: unknown; quietForMs: number }[] {
    return [...this.#entries].map(([kind, entry]) => ({
      kind,
      data: entry.data,
      quietForMs: nowMs - entry.recordedAtMs,
    }));
  }

  /**
   * How many kinds are held.
   */
  get size(): number {
    return this.#entries.size;
  }
}
