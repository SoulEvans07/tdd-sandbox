export type QueryParams = Record<string, string | number | boolean | undefined | null>;
export type RequestBody = Record<string, any>;
export type ResponseBody = Record<string, any>;
export type RequestHeaders = Record<string, string>;

export interface IRequest {
  get<R extends ResponseBody>(url: string, headers?: RequestHeaders): Promise<R>;
  post<R extends ResponseBody>(url: string, body?: RequestBody, options?: RequestHeaders): Promise<R>;
}
