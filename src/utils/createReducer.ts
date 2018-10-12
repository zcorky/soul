import { Action, Reducer, Reducers } from '../core/types';

/**
 * one namespace
 * @param reducers in one namespace
 * @param initialState in one namespace
 *
 * @example
 *  namespaceA
 *    before: { +(s, a) => s, -(s, a) => s }
 *    after: (s, a) => s, type in (+, -)
 */
export function createReducer<State = any>(reducers: Reducers<State, Action> = {}, initialState: State): Reducer<State, Action> {
  return (state: typeof initialState = initialState, action: Action): State => {
    const reducer = reducers[action.type];
    return reducer ? reducer(state, action) : state;
  };
}
