/**
The phones that asked one running lemonfiber to wake them, listed, registered
and removed.

Spec: 20-architecture/contracts/web-api-live-state.md
*/
import { answeredAs, type Ask } from "./answered.js";
import type { Asking } from "./deadline.js";
import { segmentOf } from "./query.js";
import type { Reading } from "./envelope.js";
import type { BodyRoute, ByKind, PushEndpointsBody } from "./generated/index.js";

/**
Where push endpoints are listed and registered, and under which one is removed
by its name.
*/
const PUSH_ENDPOINTS = "/api/push-endpoints" satisfies BodyRoute;

/**
The push endpoints this credential may keep: every one for the operator, a
member's own for a member's session. A key is refused here whatever its scope.

Each endpoint's address is the distributor's whole address, and whoever holds
it can wake the phone: a screen shows its host alone.
*/
export interface PushEndpoints {
  /**
  Every push endpoint, in the order they were registered.
  */
  list(asking?: Asking): Promise<Reading<ByKind["push-endpoints"]>>;

  /**
  Registers a phone's push endpoint under a name, with its `https` address and
  its WebPush key and secret, answered with the endpoint as registered. Sent
  once.
  */
  register(
    registering: PushEndpointsBody,
    asking?: Asking,
  ): Promise<Reading<ByKind["push-endpoint"]>>;

  /**
  Removes one push endpoint by its name, answered with the endpoints as they
  now stand, naming the one removed. The name is sent as one path segment.
  Sent once.
  */
  remove(name: string, asking?: Asking): Promise<Reading<ByKind["push-endpoints"]>>;
}

/**
The push endpoints, asked for through `ask`.
*/
export function pushEndpoints(ask: Ask): PushEndpoints {
  return {
    list: async (asking = {}) =>
      answeredAs(await ask("GET", PUSH_ENDPOINTS, asking, undefined, true), "push-endpoints"),
    register: async (registering, asking = {}) =>
      answeredAs(
        await ask("POST", PUSH_ENDPOINTS, asking, JSON.stringify(registering)),
        "push-endpoint",
      ),
    remove: async (name, asking = {}) => {
      const one = segmentOf(name);
      if (!one.ok) return one;
      return answeredAs(
        await ask("DELETE", `${PUSH_ENDPOINTS}/${one.value}`, asking),
        "push-endpoints",
      );
    },
  };
}
