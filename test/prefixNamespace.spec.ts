import { expect } from 'chai';

import { getKey, prefix, prefixNamespace } from '../src/utils/prefixNamespace';

describe('prefix namespace', () => {
  it('object with type', () => {
    const namespace = 'app';
    const reducers = {
      '+': () => null,
      '-': () => null,
    };
    expect(prefix(namespace, reducers)).to.deep.equal({
      [getKey(namespace, '+')]: reducers['+'],
      [getKey(namespace, '-')]: reducers['-'],
    });
  });

  it('namespace model', () => {
    const model = {
      namespace: 'app',

      state: 0,

      reducers: {
        '+': (s, a) => s + 1,
        '-': (s, a) => s - 1,
      },

      effects: {
        '*+': async (a, u) => null,
        '*-': async (a, u) => null,
      },

      subscriptions: {
        setup: () => null,
      },
    };

    const namespacedModel = {
      namespace: 'app',

      state: 0,

      reducers: {
        [getKey('app', '+')]: model.reducers['+'],
        [getKey('app', '-')]: model.reducers['-'],
      },

      effects: {
        [getKey('app', '*+')]: model.effects['*+'],
        [getKey('app', '*-')]: model.effects['*-'],
      },

      subscriptions: model.subscriptions,
    };

    expect(prefixNamespace(model).reducers).to.deep.equal(namespacedModel.reducers);
    expect(prefixNamespace(model).effects).to.deep.equal(namespacedModel.effects);
    expect(prefixNamespace(model)).to.deep.equal(namespacedModel);
  });

  it('undefine reducers/effects', () => {
    expect(prefixNamespace({
      namespace: 'app',
      state: 1,
    })).to.deep.equal({
      namespace: 'app',
      state: 1,
      reducers: {},
      effects: {},
    });
  });
});
