/**
 * Asking a read again before a passing failure is reported.
 *
 * A read that met nothing, or a gateway in front of lemonfiber that could not
 * reach it, is asked twice more, a little later each time. Those are the
 * failures a moment can clear: a phone waking its radio, a proxy whose upstream
 * is restarting. A read changes nothing, so asking it again costs only the wait.
 * Every other answer is lemonfiber's own and is taken on the first attempt,
 * since asking again would only repeat it. An action is never asked again, so a
 * change cannot be made twice by a retry nobody chose.
 */

/**
 * How long before the first retry, in milliseconds; the second waits twice as long.
 */
const FIRST_WAIT_MS = 250;

/**
 * What a gateway in front of lemonfiber answers when it could not reach it, or is
 * waiting for it.
 */
const PASSED_ON: ReadonlySet<number> = new Set([502, 503, 504]);

/**
 * Whether an attempt ended in a failure a moment can clear: nothing arrived, or a
 * gateway could not reach lemonfiber.
 */
function isPassing(answer: { status: number } | undefined): boolean {
  return answer === undefined || PASSED_ON.has(answer.status);
}

/**
 * The answer to a read, asked three times in all while it ends in a passing failure.
 *
 * Written out attempt by attempt rather than as a loop: each waits on the one
 * before, and three is few enough to read. The last answer is handed back as
 * it came, so a caller reads a refusal the way it did before reads were retried.
 *
 * Every pause ends early when `ending` is raised, and no further attempt is made
 * once it is: what came back so far is handed back, nothing where nothing did.
 */
export async function askedAgain<A extends { status: number }>(
  ask: () => Promise<A | undefined>,
  ending?: AbortSignal,
): Promise<A | undefined> {
  const first = await ask();
  if (!isPassing(first)) return first;

  if (!(await waited(FIRST_WAIT_MS, ending))) return first;
  const second = await ask();
  if (!isPassing(second)) return second;

  if (!(await waited(FIRST_WAIT_MS * 2, ending))) return second;
  return ask();
}

/**
 * A pause of this many milliseconds, cut short where `ending` is raised.
 * Whether it ran its full length.
 */
function waited(milliseconds: number, ending?: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (ending?.aborted === true) {
      resolve(false);
      return;
    }
    const cut = (): void => {
      clearTimeout(pause);
      resolve(false);
    };
    const pause = setTimeout(() => {
      ending?.removeEventListener("abort", cut);
      resolve(true);
    }, milliseconds);
    ending?.addEventListener("abort", cut, { once: true });
  });
}
