import { Subscriptions, MiddlewareAPI } from '../core/types';

/**
 * one namespace
 * @param reducers in one namespace
 * @param initialState in one namespace
 *
 * @example
 *  namespaceA
 *    before: { async +(s, a) => s, async -(s, a) => s }
 *    after: async (s, a) => s, type in (+, -)
 */
export function createSubscription(subscriptions: Subscriptions<MiddlewareAPI> = {}) {
  return (middlewareAPI: MiddlewareAPI) => {
    Object.keys(subscriptions)
      .forEach(async (key) => {
        const sub = subscriptions[key];
        if (typeof sub === 'function') {
          await sub(middlewareAPI); // @TODO Middleware API
        }
      });
  }
}
