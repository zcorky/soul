import {
  Action as ReduxAction,
  Reducer as ReduxReducer,
  Dispatch,
} from 'redux';
import { Delay } from '@zcorky/delay';

export interface Action extends ReduxAction<string> {
  payload?: any;
  [extraProps: string]: any;
}

export type Namespace = string;

export type State = object | string | number | boolean;

// reducer(s)
export type Reducer<S, A extends Action> = ReduxReducer<S, A>;

export interface Reducers<S, A extends Action> {
  [type: string]: Reducer<S, A>;
}

// effect(s)
export interface Effect<A extends Action = Action, U = {}> {
  (action: A, utils: U, extraUtils?: ExtraUtils): Promise<any>;
}

export interface Effects<A extends Action, U> {
  [type: string]: Effect<A, U>;
}

// subscription(s)
export interface Subscription<T> {
  (middlewareAPI: T, extraUtils?: ExtraUtils): any;
}

export interface Subscriptions<M> {
  [type: string]: Subscription<M>;
}

// middleare api
export interface MiddlewareAPI {
  dispatch: Dispatch;
  getState(): State;
}

// utils api
export interface Utils {
  // dispatch(action: Action): Promise<any>;
  // getState(): Promise<any>;
  dispatch(action: Action): Action;
  getState(): any;
  select(fn?: Function): Promise<any>;
  put(action: Action): Promise<any>;
  call(fn: Function, ...args: any[]): Promise<any>;
  race(races: { [k: string]: Promise<any> }): Promise<any>
  delay: Delay;
}

// extra utils binded with namespace
export interface ExtraUtils {
  getState(): Promise<State>;
}

// model(s)
export interface Model {
  /**
   * model namespace, required.
   */
  namespace: Namespace;

  /**
   * model state
   */
  state: State;

  /**
   * model reducers
   */
  reducers?: Reducers<State, Action>,

  /**
   * model effects
   */
  effects?: Effects<Action, Utils>,

  subscriptions?: Subscriptions<MiddlewareAPI>,
}

// export type Models<S> = {
//   [N in keyof S]?: Model<S[N]>;
// }

export interface Models {
  [namespace: string]: Model;
};
