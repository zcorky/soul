import { Model } from '../core/types';

export const NAMESPACE_SEP = '/';

export interface Handlers<T> {
  [type: string]: T
}

export interface NamespacedObject<T> {
  [namespace: string]: T
}

export function getKey(namespace: string, type: string) {
  return `${namespace}${NAMESPACE_SEP}${type}`;
}

/**
 * prefix object with namespace
 * @param namespace string
 * @param origin object
 */
export function prefix<T>(namespace: string, origin: object): T {
  return Object.keys(origin)
    .reduce((memo, type) => {
      const key = getKey(namespace, type);
      memo[key] = origin[type];
      return memo;
    }, {}) as T;
}

export function prefixNamespace(model: Model) {
  const namespace = model.namespace;

  return {
    ...model,
    reducers: prefix<Model['reducers']>(namespace, model.reducers || {}),
    effects: prefix<Model['effects']>(namespace, model.effects || {}),
  };
}
