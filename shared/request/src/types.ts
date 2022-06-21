export type QueryParams = Record<string, string | number | boolean | undefined | null>;
export type RequestBody = Record<string, any>;
export type ResponseBody = Record<string, any>;
export type RequestHeaders = Record<string, string>;

export interface IRestApi {
  get<R extends ResponseBody>(url: string, query?: QueryParams, headers?: RequestHeaders): Promise<R>;
  post<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  patch<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
  delete<R extends ResponseBody>(url: string, body?: RequestBody, headers?: RequestHeaders): Promise<R>;
}
