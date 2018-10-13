import { Subscriptions, MiddlewareAPI } from '../core/types';

/**
 * one namespace
 * @param namespace string
 * @param reducers in one namespace
 *
 * @example
 *  namespaceA
 *    before: { async +(u) => any, async -(u) => any }
 *    after: async (u) => any
 */
export function createSubscription(namespace: string, subscriptions: Subscriptions<MiddlewareAPI> = {}) {
  return (middlewareAPI: MiddlewareAPI) => {
    const extendsUtils = {
      getState: async () => middlewareAPI.getState()[namespace],
    };

    Object.keys(subscriptions)
      .forEach(async (key) => {
        const sub = subscriptions[key];
        if (typeof sub === 'function') {
          await sub(middlewareAPI, extendsUtils); // @TODO Middleware API
        }
      });
  }
}
