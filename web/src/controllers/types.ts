import { request } from '../services/request/request';
import { serverUrl } from '../config';
import { QueryParams, RequestBody, RequestHeaders, ResponseBody } from '../services/request/types';

interface AuthHeader extends RequestHeaders {
  authorization: string;
}

export abstract class ControllerBase {
  protected abstract readonly version: string;
  protected abstract readonly name: string;

  protected get apiUrl(): string {
    return serverUrl + '/api/' + this.version;
  }

  protected get entityUrl(): string {
    return this.apiUrl + '/' + this.name;
  }

  protected toAuthHeader(token: string): AuthHeader {
    return { authorization: `Bearer ${token}` };
  }

  protected async get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R> {
    return request.get<R>(url, query, headers);
  }

  protected async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return request.post<R>(url, body, headers);
  }
}
