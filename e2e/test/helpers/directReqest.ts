import { QueryParams, RequestBody, RequestHeaders, ResponseBody, RestApi } from '@tdd-sandbox/api-managers';

class DirectRequest implements RestApi {
  public get<R extends ResponseBody>(
    url: string,
    query?: QueryParams | undefined,
    headers?: RequestHeaders | undefined
  ): Promise<R> {
    return new Promise(resolve => {
      cy.request({ method: 'GET', url: url + this.stringifyParams(query), headers }).then(response => {
        resolve(response.body);
      });
    });
  }

  public post<R extends ResponseBody>(
    url: string,
    body?: RequestBody | undefined,
    headers?: RequestHeaders | undefined
  ): Promise<R> {
    return new Promise(resolve => {
      cy.request({ method: 'POST', url, body, headers }).then(response => {
        resolve(response.body);
      });
    });
  }

  public patch<R extends ResponseBody>(
    url: string,
    body?: RequestBody | undefined,
    headers?: RequestHeaders | undefined
  ): Promise<R> {
    return new Promise(resolve => {
      cy.request({ method: 'PATCH', url, body, headers }).then(response => {
        resolve(response.body);
      });
    });
  }

  public delete<R extends ResponseBody>(
    url: string,
    body?: RequestBody | undefined,
    headers?: RequestHeaders | undefined
  ): Promise<R> {
    return new Promise(resolve => {
      cy.request({ method: 'DELETE', url, body, headers }).then(response => {
        resolve(response.body);
      });
    });
  }

  private stringifyParams(query?: QueryParams): string {
    if (query === undefined) return '';

    const keyPairs = Object.entries(query).filter(([, value]) => value !== undefined && value !== null);
    if (keyPairs.length === 0) return '';

    const stringified = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return '?' + stringified;
  }
}

export const directRequest = new DirectRequest();
