import { MiddlewareAPI } from 'redux';
import { delay } from '@zcorky/delay';
import { Utils } from '../core/types';

const call = async (fn, ...args) => await fn(...args);

const race = async (races) => {
  const racesPromise = Object.keys(races).map(key => (async () => {
    return { [key]: await races[key] };
  })());
  return Promise.race(racesPromise);
};

const createPut = dispatch => async (action) => dispatch(action);

const createSelect = getState => async (fn) => fn ? fn(getState()) : getState();

export function getUtils(middlewareAPI: MiddlewareAPI): Utils {
  const put = createPut(middlewareAPI.dispatch);
  const select = createSelect(middlewareAPI.getState);

  return {
    ...middlewareAPI,
    put, select,
    call, race, delay,
  };
}
