import { rest } from 'msw';
import { HttpStatusCode } from 'shared-types';
import { serverUrl } from '../config';

export function createEmptyGetHandler(endpoint: string, statusCode: HttpStatusCode, statusText?: string) {
  return rest.get(serverUrl + endpoint, (_, res, ctx) => res(ctx.status(statusCode, statusText)));
}
