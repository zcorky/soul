import { Action, Effect, Effects, Utils } from '../core/types';

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
export function createEffect(effects: Effects<Action, Utils> = {}): Effect<Action, Utils> {
  return async (action, utils) => {
    const effect = effects[action.type];
    if (effect) {
      await effect(action, utils);
    }
  }
}
