import * as window from 'global/window';
import {
  Store,
  createStore as reduxCreateStore,
  applyMiddleware,
  compose,
  StoreEnhancer,
  Middleware,
} from 'redux';

import { Action, Reducer, Effect, Utils } from '../core/types';

export interface Plugins<S> {
  extraEnhancers?: StoreEnhancer<Store<S, Action>>[];
  extraMiddlewares?: Middleware[]
};

export function applyEffect(effect: Effect): Middleware {
  return middlewareAPI => {
    const put = async (action) => middlewareAPI.dispatch(action);
    const select = async (fn) => fn ? fn(middlewareAPI.getState()) : middlewareAPI.getState();
    const utils = { ...middlewareAPI, put, select } as Utils;

    return next => action => {
      effect(action, utils);
      return next(action);
    };
  }
}

export interface CreateStoreOptions<S> {
  initialState: object;
  reducer: Reducer<S, Action>;
  effect: Effect<Action, Utils>;
  plugins: Plugins<S>;
}

export function createStore<S = {}>(options: CreateStoreOptions<S>): Store<S, Action> {
  const { initialState, reducer, effect, plugins } = options;

  const extraEnhancers: StoreEnhancer<Store<S, Action>>[] = plugins['extraEnhancers'] || [];
  const extraMiddlewares: Middleware<{}, typeof initialState>[] = plugins['extraMiddlewares'] || [];

  const middlewares = [
    ...extraMiddlewares,
    applyEffect(effect),
  ];

  let devtools: StoreEnhancer<Store<S, Action>>[] = [];

  if (process.env.NODE_ENV !== 'production' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    devtools = [(window as any).__REDUX_DEVTOOLS_EXTENSION__];
  }

  const enhancers = [
    applyMiddleware(...middlewares) as StoreEnhancer<Store<S, Action>>,
    ...devtools,
    ...extraEnhancers,
  ];

  return reduxCreateStore(reducer, initialState, compose(...enhancers));
}
