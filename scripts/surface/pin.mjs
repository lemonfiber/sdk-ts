/** The commit of this package that lemonfiber-web's default branch pins. */

/** The consumer whose pin is the surface this package keeps. */
export const CONSUMER = "lemonfiber/lemonfiber-web";

/** Where the consumer's manifest is served, raw, from its default branch. */
const MANIFEST = `https://api.github.com/repos/${CONSUMER}/contents/package.json`;

/** A dependency on this repository at a full commit, as npm writes one from GitHub. */
const PINNED = /^(?:github:)?lemonfiber\/sdk-ts#([0-9a-f]{40})$/;

/** The commit a consumer's `package.json` pins this package at, refusing one that pins it at no full commit. */
export function pinIn(manifest, name) {
  const named = manifest.dependencies?.[name] ?? manifest.devDependencies?.[name];
  const commit = typeof named === "string" ? PINNED.exec(named)?.[1] : undefined;
  if (commit === undefined) {
    throw new Error(
      `${CONSUMER}'s package.json pins ${name} at ${JSON.stringify(named)}, which names no full commit of lemonfiber/sdk-ts`,
    );
  }
  return commit;
}

/** The commit lemonfiber-web's default branch pins `name` at, read from GitHub with `token` where one is given. */
export async function pinnedBy(name, token, fetching = fetch) {
  const headers = {
    Accept: "application/vnd.github.raw+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const answer = await fetching(MANIFEST, { headers });
  if (!answer.ok) throw new Error(`${MANIFEST} answered ${String(answer.status)}`);
  return pinIn(await answer.json(), name);
}
