import { expect } from 'chai';

import { createSoul as soul, Utils } from '../src';
import { Soul } from '../src/core';

const appModel = {
  namespace: 'app',
  state: {
    value: 0,
  },
  reducers: {
    '+'(state) {
      return { ...state, value: state.value + 1 };
    },
    '-'(state) {
      return { ...state, value: state.value - 1 };
    },
  },
  effects: {
    async '*+'(action, { dispatch }: Utils) {
      dispatch({ type: 'app/+' });
    },
    async '*-'(action, { dispatch }) {
      dispatch({ type: 'app/-' });
    },
    async '*+/put'(action, { put }) {
      await put({ type: 'app/+' });
    },
    async '*-/put'(action, { put }) {
      await put({ type: 'app/-' });
    },
  },
  subscriptions: {
    setup({ getState }) {
      return getState().app * 10;
    },
  },
};

const bppModel = {
  namespace: 'bpp',
  state: {
    value: 0,
  },
  reducers: {
    '+'(state) {
      return { ...state, value: state.value + 1 };
    },
    '-'(state) {
      return { ...state, value: state.value - 1 };
    },
  },
  effects: {
    async '*+'(action, { dispatch }) {
      dispatch({ type: 'app/+' });
    },
    async '*-'(action, { dispatch }) {
      dispatch({ type: 'app/-' });
    },
  },
  subscriptions: {
    setup({ getState }) {
      return getState().app * 10;
    },
  },
};

describe('soul', () => {
  let app: Soul;
  beforeEach(() => {
    app = soul();
    app.model(appModel);
    app.model(bppModel);
    app.start();
  });

  it('namespace required', () => {
    expect(() => app.model({} as any)).to.throw(/\[Model\] namespace should be defined./)
  });

  it('namespace duplicated', () => {
    expect(() => app.model(appModel)).to.throw(/\[Model\] namespace app has already been registered by other model./);
  });

  it('dispatch reducers', () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.equal(appModel.state);
    app.dispatch({ type: 'app/+' });
    expect(app.getState().app).to.deep.equal({ value: 1 });
    expect(app.getState().app).to.not.equal(appModel.state);

    app.dispatch({ type: 'app/-' });
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.not.equal(appModel.state);
  });

  it('dispatch non-reducers', () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/++' });
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.equal(appModel.state);
  });

  it('dispatch effects', () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/*+' });
    expect(app.getState().app).to.deep.equal({ value: 1 });
    expect(app.getState().app).to.not.equal(appModel.state);

    app.dispatch({ type: 'app/*-' });
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.not.equal(appModel.state);
  });

  it('dispatch effects await put reudcers', () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/*+/put' });
    expect(app.getState().app).to.deep.equal({ value: 1 });
    expect(app.getState().app).to.not.equal(appModel.state);

    app.dispatch({ type: 'app/*-/put' });
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.not.equal(appModel.state);
  });

  it('dispatch non-effects', () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/*++' });
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.equal(appModel.state);
  });

  // it('subscription run on start', () => {
  //   const subscriptions = app._api.getSubscriptions();

  //   expect(subscriptions.app.setup()).to.equal(10);
  // });
});
