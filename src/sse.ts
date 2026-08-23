/**
 * A parser for the `text/event-stream` wire format.
 */

export interface SseEvent {
  id: string | undefined;
  event: string;
  data: string;
}

interface Pending {
  id: string | undefined;
  event: string;
  data: string[];
}

const blank = (): Pending => ({ id: undefined, event: "message", data: [] });

/**
 * Splits a field line into its name and value, per the event-stream grammar.
 */
function field(line: string): { name: string; value: string } {
  const colon = line.indexOf(":");
  if (colon === -1) return { name: line, value: "" };
  const name = line.slice(0, colon);
  const raw = line.slice(colon + 1);
  return { name, value: raw.startsWith(" ") ? raw.slice(1) : raw };
}

/**
 * Accumulates chunks and emits events as they complete.
 *
 * A chunk may split a line, and a line may split a UTF-8 sequence, so text is
 * held until a newline arrives and an event is held until a blank line does.
 */
export class SseParser {
  #buffer = "";
  #pending: Pending = blank();

  /**
   * The events completed by this chunk, in order.
   */
  push(chunk: string): SseEvent[] {
    this.#buffer += chunk;
    const done: SseEvent[] = [];

    let newline = this.#buffer.indexOf("\n");
    while (newline !== -1) {
      const line = this.#buffer.slice(0, newline).replace(/\r$/, "");
      this.#buffer = this.#buffer.slice(newline + 1);

      const event = this.#line(line);
      if (event !== undefined) done.push(event);

      newline = this.#buffer.indexOf("\n");
    }
    return done;
  }

  /**
   * Returns an event when `line` ends one.
   */
  #line(line: string): SseEvent | undefined {
    if (line === "") return this.#complete();
    if (line.startsWith(":")) return undefined;

    const { name, value } = field(line);
    switch (name) {
      case "id": {
        this.#pending.id = value;
        return undefined;
      }
      case "event": {
        this.#pending.event = value;
        return undefined;
      }
      case "data": {
        this.#pending.data.push(value);
        return undefined;
      }
      default: {
        return undefined;
      }
    }
  }

  /**
   * A blank line ends an event, unless nothing has been gathered.
   */
  #complete(): SseEvent | undefined {
    const pending = this.#pending;
    this.#pending = blank();
    if (pending.data.length === 0) return undefined;
    return { id: pending.id, event: pending.event, data: pending.data.join("\n") };
  }
}
