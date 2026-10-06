// Generated from the lemonfiber contract. Do not edit.
// The `forms` envelope, and the shapes only `forms` carries.
// Regenerate with `npm run contract:generate`.

/**
 * One form the stack declares, as a listing shows it.
 *
 * The manifest's own words rather than lemonfiber's: forms come from the stack, so a
 * stack of somebody's own names and describes them however it likes, and a listing that
 * paraphrased would be describing a different stack from the one being run.
 */
export interface FormReport {
  /**
   * Whether it can be started alongside another form.
   *
   * Worth saying in the listing rather than only when a combination is refused: an
   * operator choosing between two forms is exactly who needs to know they are a choice.
   */
  composable: boolean;
  /** What it is for, in one line. */
  description: string;
  /** What to type to start it. */
  id: string;
  /** What it is called. */
  name: string;
}

/** The envelope carrying `forms`. */
export interface FormsEnvelope {
  api_version: number;
  data: FormsReport;
  host?: string | null;
  kind: "forms";
}

/** Every form this stack declares. */
export interface FormsReport {
  /** The forms, in the order the stack declares them. */
  forms: FormReport[];
}
