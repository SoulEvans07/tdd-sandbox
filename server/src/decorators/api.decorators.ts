import 'reflect-metadata';

import { ApiEndpointMeta } from '../types/api';

const key = Symbol('epMeta');

export function epMeta<T>(meta: ApiEndpointMeta<T>) {
  return Reflect.metadata(key, meta);
}

export function getEpMeta<T>(target: any, propertyKey: string): ApiEndpointMeta<T> {
  return Reflect.getMetadata(key, target, propertyKey);
}
