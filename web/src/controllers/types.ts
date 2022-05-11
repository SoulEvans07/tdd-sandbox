import { request } from '../services/request/request';
import { serverUrl } from '../config';
import { RequestBody, RequestHeaders, ResponseBody } from '../services/request/types';

export abstract class ControllerBase {
  protected abstract readonly version: string;
  protected abstract readonly name: string;

  protected get baseUrl(): string {
    return serverUrl + '/api/' + this.version + '/' + this.name;
  }

  protected async get<R extends ResponseBody>(url: string, headers?: RequestHeaders): Promise<R> {
    return request.get<R>(url, headers);
  }

  protected async post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R> {
    return request.post<R>(url, body, headers);
  }
}
