import { Request, Response } from 'express';

export interface ValidatedRequest<T extends object> extends Request<{}, {}, T> {
  validationErrors?: {
    [key in keyof T]?: string;
  };
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ApiEndpointMeta<T> {
  method: EpMethod;
  version: string;
  path: string;
  middleware?: (ApiMiddleware<T> | ((fields?: string | string[] | undefined, message?: any) => void))[];
}

export type ApiMiddleware<T> = (req: Request<{}, {}, T, {}>, res: Response, next: () => void) => void;

export type EpMethod = 'post' | 'get' | 'put' | 'delete';

export class ControllerBase {}

export type Controllers = Record<string, ControllerBase>;
