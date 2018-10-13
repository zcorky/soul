import { combineReducers } from 'redux';
import { Action, Effect, Subscription, Utils, MiddlewareAPI } from '../core/types';

export interface EffectsMapObject<A extends Action = Action, U extends Utils = Utils> {
  [namespace: string]: Effect<A, U>;
}

export interface SubscriptionsMapObject<U extends MiddlewareAPI = MiddlewareAPI> {
  [namespace: string]: Subscription<U>;
}

function combineEffects(effects: EffectsMapObject): Effect<Action, Utils> {
  return async function combination(action, utils) {
    Object.keys(effects).forEach(async namespace => {
      const effect = effects[namespace];
      await effect(action, utils);
    });
  };
}

function combineSubscriptions(subscriptions: SubscriptionsMapObject<MiddlewareAPI>): Subscription<MiddlewareAPI> {
  return async function combination(utils) {
    Object.keys(subscriptions).forEach(async namespace => {
      const subscription = subscriptions[namespace];
      await subscription(utils);
    });
  };
}

export {
  combineReducers,
  combineEffects,
  combineSubscriptions,
};
