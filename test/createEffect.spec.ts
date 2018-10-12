import { expect } from 'chai';

import { createEffect } from '../src/utils/createEffect';
import { Action, Effects, Utils } from '../src/core/types';

describe('create effect', () => {
  it('should be', () => {
    const state = {
      value: 0,
    };

    const utils = {
      dispatch: () => { state.value += 1; },
      getState: () => state,
      select: async () => state,
      put: async () => null,
      getCurrentState: () => state,
    };

    const effect = createEffect({
      async '*+'(action, { dispatch }) {
        dispatch(action);
      },
    });

    effect({ type: '*+' }, utils as Utils)
    expect(state.value).to.equal(1);
    effect({ type: '*+' }, utils as Utils)
    expect(state.value).to.equal(2);
  });

  it('undefined', () => {
    const reducer = createEffect(undefined as any as Effects<Action, {}>);
    expect(typeof reducer).to.be.equal('function');
  });

  it('null', () => {
    const reducer = createEffect(null as any as Effects<Action, {}>);
    expect(typeof reducer).to.be.equal('function');
  });
});
