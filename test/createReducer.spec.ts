import { expect } from 'chai';

import { createReducer } from '../src/utils/createReducer';
import { Action, Reducers } from '../src/core/types';

describe('create reducer', () => {
  let reducers;
  let initialState = 0;

  beforeEach(() => {
    reducers = {
      '+': state => state + 1,
      '-': state => state - 1,
    };

    initialState = 0;
  });

  it('should be', () => {
    const reducer = createReducer<typeof initialState>(reducers, initialState);

    expect(reducer(2, { type: '+' })).to.equal(3);
    expect(reducer(3, { type: '-' })).to.equal(2);
    expect(reducer(2, { type: '*' })).to.equal(2);
    expect(reducer(2, { type: '&' })).to.equal(2);
  });

  it('undefined', () => {
    const reducer = createReducer(undefined as any as Reducers<{}, Action>, {});
    expect(typeof reducer).to.be.equal('function');
  });

  it('null', () => {
    const reducer = createReducer(null as any as Reducers<{}, Action>, {});
    expect(typeof reducer).to.be.equal('function');
  });
});
