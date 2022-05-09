import { rest } from 'msw';
import { serverUrl } from '../config';
import { HttpStatusCode } from '../types/statusCodes';

export function createEmptyGetHandler(endpoint: string, statusCode: HttpStatusCode, statusText?: string) {
  return rest.get(serverUrl + endpoint, (_, res, ctx) => res(ctx.status(statusCode, statusText)));
}
