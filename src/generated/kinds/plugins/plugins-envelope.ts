// Generated from the lemonfiber contract. Do not edit.
// Some of the shapes only `plugins` carries; `kinds/plugins` gathers them all.
// Regenerate with `npm run contract:generate`.

import type { PluginInstalls } from "./plugin-proving.js";

/** The envelope carrying `plugins`. */
export interface PluginsEnvelope {
  api_version: number;
  data: PluginInstalls;
  host?: string | null;
  job?: string | null;
  kind: "plugins";
}
