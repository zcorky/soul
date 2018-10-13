import * as chai from 'chai';
import * as spies from 'chai-spies';

chai.use(spies)

const expect = chai.expect;

import { createSubscription } from '../src/utils/createSubscription';
import { MiddlewareAPI } from '../src/core/types';

describe('create subscription', () => {
  it('should be normal', () => {
    const spy = chai.spy();

    const state = {
      value: 0,
    };

    const middleAPI = {
      dispatch: () => { state.value += 1; },
      getState: () => state,
    };

    const subscription = createSubscription('app', {
      setup() {
        spy();
      },
      setup2() {
        spy();
      },
      setup3() {
        spy();
      },
      willIgnore: 1 as any,
    });

    subscription(middleAPI as MiddlewareAPI);
    expect(spy).to.has.been.called.exactly(3);
  });

  it('should allow undefined', () => {
    const subscription = createSubscription('app');
    expect(typeof subscription).to.equal('function');
  })
});
