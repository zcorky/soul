import { Action, Effect, Effects, Utils } from '../core/types';

/**
 * one namespace
 * @param namespace string
 * @param effects in one namespace
 *
 * @example
 *  namespaceA
 *    before: { +: async (a, u) => any, -: async (a, u) => any }
 *    after: async (a, u) => any
 */
export function createEffect(namespace: string, effects: Effects<Action, Utils> = {}): Effect<Action, Utils> {
  return async (action, utils) => {
    const effect = effects[action.type];
    const extendsUtils = {
      getState: async () => utils.getState()[namespace],
    };

    if (effect) {
      await effect(action, utils, extendsUtils);
    }
  }
}
