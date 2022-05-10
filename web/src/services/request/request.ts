import { IRequest, RequestBody, RequestHeaders, ResponseBody } from './types';

async function parseBody(res: Response) {
  return res.text().then(text => Promise.resolve(JSON.parse(text || '{}')));
}

async function get<R extends ResponseBody>(url: string, headers?: RequestHeaders): Promise<R> {
  return fetch(url, { method: 'get', headers }).then(res => res.json());
}

async function post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
  return fetch(url, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  }).then(res => parseBody(res));
}

export const request: IRequest = { get, post } as const;
