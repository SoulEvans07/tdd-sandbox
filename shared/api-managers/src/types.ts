type QueryParams = Record<string, string | number | boolean | undefined | null>;
type RequestBody = Record<string, any>;
type ResponseBody = Record<string, any>;
type RequestHeaders = Record<string, string>;

interface RestApi {
  get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R>;
  post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  delete<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
}

interface AuthHeader extends RequestHeaders {
  authorization: string;
}

export abstract class ApiManager {
  protected abstract readonly version: string;
  protected abstract readonly name: string;

  constructor(protected rest: RestApi, protected baseUrl: string) {}

  protected get apiUrl(): string {
    return this.baseUrl + '/api/' + this.version;
  }

  protected get entityUrl(): string {
    return this.apiUrl + '/' + this.name;
  }

  protected toAuthHeader(token: string): AuthHeader {
    return { authorization: `Bearer ${token}` };
  }

  protected async get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R> {
    return this.rest.get<R>(url, query, headers);
  }

  protected async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return this.rest.post<R>(url, body, headers);
  }

  protected async patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return this.rest.patch<R>(url, body, headers);
  }

  protected async delete<R extends ResponseBody>(
    url: string,
    body?: RequestBody,
    headers?: RequestHeaders
  ): Promise<R> {
    return this.rest.delete<R>(url, body, headers);
  }
}
