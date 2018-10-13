import { expect } from 'chai';
import { delay } from '@zcorky/delay';
import { promise as isPromise } from '@zcorky/is';

import { createSoul as soul, Utils } from '../src';
import { Soul } from '../src/core';
import { ExtraUtils } from '../src/core/types';

describe('soul', () => {
  let app: Soul, appModel, bppModel;
  beforeEach(() => {
    appModel = {
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
        async '*+'(action, { getState: getAllState, dispatch, call, race }: Utils, { getState }: ExtraUtils) {
          expect(getAllState()).to.be.deep.equal({ app: { value: 0 }, bpp: { value: 0 } });

          expect(isPromise(call(delay, 0))).to.equal(true);
          expect(isPromise(race({
            data: call(delay, 0),
            timeout: call(delay, 1000),
          }))).to.equal(true);
          expect(await race({
            data: call(v => new Promise(resolve => resolve(v)), { id: 1, user: 2 }),
            timeout: call(delay, 1000),
          })).to.be.deep.equal({ data: { id: 1, user: 2 } });

          const currentState = await getState();
          dispatch({ type: 'app/+' });
          const afterState = await getState();
          expect(currentState).to.be.deep.equal({ value: 0 });
          expect(afterState).to.be.deep.equal({ value: 1 });
          expect(currentState).to.be.not.equal(afterState);
        },
        async '*-'(action, { dispatch }) {
          dispatch({ type: 'app/-' });
        },
        async '*+/put'(action, { put, select }: Utils, { getState }: ExtraUtils) {
          expect((await select()).app).to.be.deep.equal({ value: 0 });
          expect(await select(state => state.app)).to.be.deep.equal({ value: 0 });
          expect(await select(state => state.app)).to.be.equal(await getState());
          const currentState = await getState();
          await put({ type: 'app/+' });
          const afterState = await getState();
          expect(currentState).to.be.deep.equal({ value: 0 });
          expect(afterState).to.be.deep.equal({ value: 1 });
          expect(currentState).to.be.not.equal(afterState);
        },
        async '*-/put'(action, { put }) {
          await put({ type: 'app/-' });
        },
      },
      subscriptions: {
        async setup({ getState }, utils) {
          const state = getState();
          const nstate = await utils.getState();

          expect(state.app).to.be.equal(nstate);
          expect(nstate).to.be.equal(appModel.state);
          expect(nstate).to.be.deep.equal(appModel.state);
        },
      },
    };

    bppModel = {
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
        async setup({ getState }, utils) {
          const state = getState();
          const nstate = await utils.getState();

          expect(state.bpp).to.be.equal(nstate);
          expect(nstate).to.be.equal(bppModel.state);
          expect(nstate).to.be.deep.equal(bppModel.state);
        },
      },
    };

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

  it('dispatch effects', async () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/*+' });
    await delay(0);
    expect(app.getState().app).to.deep.equal({ value: 1 });
    expect(app.getState().app).to.not.equal(appModel.state);

    app.dispatch({ type: 'app/*-' });
    await delay(0);
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.not.equal(appModel.state);
  });

  it('dispatch effects await put reudcers', async () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/*+/put' });
    await delay(0);
    expect(app.getState().app).to.deep.equal({ value: 1 });
    expect(app.getState().app).to.not.equal(appModel.state);

    app.dispatch({ type: 'app/*-/put' });
    await delay(0);
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.not.equal(appModel.state);
  });

  it('dispatch non-effects', async () => {
    expect(app.getState().app).to.deep.equal({ value: 0 });
    app.dispatch({ type: 'app/*++' });
    await delay(0);
    expect(app.getState().app).to.deep.equal({ value: 0 });
    expect(app.getState().app).to.equal(appModel.state);
  });

  // it('subscription run on start', () => {
  //   const subscriptions = app._api.getSubscriptions();

  //   expect(subscriptions.app.setup()).to.equal(10);
  // });
});
