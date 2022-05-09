import { rest } from 'msw';
import { serverUrl } from '../config';

export interface PingResponse {
  message: string;
}

export const mockResponse: PingResponse = {
  message: 'hello world!',
};

export const getPing = rest.get<{}, {}, PingResponse>(serverUrl + '/api/1.0/ping', (_, res, ctx) => {
  return res(ctx.json(mockResponse));
});
