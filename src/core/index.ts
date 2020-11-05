import * as assert from 'assert';
import { Store, ReducersMapObject, combineReducers } from 'redux';
import { Action, Reducer, Reducers, Effect, Subscription, Subscriptions, Model, Models, Effects, MiddlewareAPI, Utils } from './types';
import { prefixNamespace } from '../utils/prefixNamespace';
import { createReducer } from '../utils/createReducer';
import { EffectsMapObject, SubscriptionsMapObject, combineEffects, combineSubscriptions } from '../utils/combine';
import { createEffect } from '../utils/createEffect';
import { createSubscription } from '../utils/createSubscription';
import { createStore } from '../utils/createStore';

export {
  Action,
  Reducer,
  Effect,
  Subscription,
  Model,
  Utils,
  MiddlewareAPI,
};

export interface ISoul {
  model(_model: Model): void;
  getState(): any;
  subscribe(listener: () => void): void;
  dispatch(action: Action): void;
  start(): void;
}

// 1 prefixNamespace
// 2 for model of models
//   2.1 createReducer => collect => combineReducers => createStore
//   2.2 createEffect => collect => combineEffects => createStore(onAction)
//   2.3 createSubscription => collect => combineSubscription => createStore(runSubscription)

export class Soul implements ISoul {
  private models: Models = {};
  public _store: Store;

  public model<S>(_model: Model) {
    assert(_model.namespace, '[Model] namespace should be defined.');
    assert(!this.models[_model.namespace], '[Model] namespace app has already been registered by other model.');

    this.models[_model.namespace] = _model;
    return this;
  }

  private create() {
    const initialState = {};
    const reducers: ReducersMapObject = {};
    const effects: EffectsMapObject = {};
    const subscriptions: SubscriptionsMapObject = {};

    for (const namespace in this.models) {
      const model = prefixNamespace(this.models[namespace]);
      type State = typeof model.state;

      initialState[namespace] = model.state;
      reducers[namespace] = createReducer<typeof model.state>(model.reducers as Reducers<State, Action>, model.state);
      effects[namespace] = createEffect(namespace, model.effects as Effects<Action, Utils>);
      subscriptions[namespace] = createSubscription(namespace, model.subscriptions as Subscriptions<MiddlewareAPI>);
    }

    const reducer = combineReducers(reducers);
    const effect = combineEffects(effects);
    const subscription = combineSubscriptions(subscriptions);

    this._store = createStore({
      initialState,
      reducer,
      effect,
      plugins: {},
    });

    // get utils
    const utils = this.getUtils();

    // run subscription
    subscription(utils as MiddlewareAPI);
    
    return {
      utils,
      subscription,
    };
  }

  public start() {
    this.create();

    return this;
  }
  
  public getState() {
    return this._store.getState();
  }

  public subscribe(listener: () => void) {
    return this._store.subscribe(listener);
  }

  public dispatch(action: Action) {
    return this._store.dispatch(action);
  }

  private getUtils() {
    const store = this._store;
    
    return {
      dispatch: store.dispatch,
      getState: store.getState,
      // put: async (action: Action) => store.dispatch(action),
      // select: async (fn) => typeof fn === 'function' ? fn(store.getState()) : store.getState(),
    };
  }
}

export const createSoul = () => new Soul();

export default createSoul;
