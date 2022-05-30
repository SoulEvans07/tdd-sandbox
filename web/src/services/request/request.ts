import { IRequest, QueryParams, RequestBody, RequestHeaders, ResponseBody } from './types';

function stringifyParams(query?: QueryParams): string {
  if (query === undefined) return '';

  const keyPairs = Object.entries(query).filter(([, value]) => value !== undefined && value !== null);
  if (keyPairs.length === 0) return '';

  const stringified = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return '?' + stringified;
}

async function parseBody(response: Response) {
  return response.text().then(text => JSON.parse(text || '{}'));
}

async function handleResponse<R extends ResponseBody>(response: Response): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    if (response.status !== 200) parseBody(response).then(error => reject(error));
    else parseBody(response).then(data => resolve(data));
  });
}

async function get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R> {
  return fetch(url + stringifyParams(query), { method: 'get', headers }).then(response => handleResponse(response));
}

async function post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
  return new Promise<R>((resolve, reject) =>
    fetch(url, {
      method: 'post',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }).then(
      response => resolve(handleResponse(response)),
      err => reject(err) // fetch error, i.e: no internet
    )
  );
}

async function patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
  return new Promise<R>((resolve, reject) =>
    fetch(url, {
      method: 'PATCH', // for some reason it will only work with uppercase
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }).then(
      response => resolve(handleResponse(response)),
      err => reject(err) // fetch error, i.e: no internet
    )
  );
}

async function del<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
  return new Promise<R>((resolve, reject) =>
    fetch(url, {
      method: 'delete',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }).then(
      response => resolve(handleResponse(response)),
      err => reject(err) // fetch error, i.e: no internet
    )
  );
}

export const request: IRequest = { get, post, patch, delete: del } as const;
