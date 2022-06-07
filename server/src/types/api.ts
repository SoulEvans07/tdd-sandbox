import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserOutput } from '../DAL/models/User';

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    tenants: number[];
  };
  token: string;
}

export interface ValidatedRequest<T extends Record<string, any>> extends Request<{}, {}, T> {
  validationErrors?: {
    [key in keyof T]?: string;
  };
}

export interface AuthorizedRequest<
  Params extends Record<string, any> = {},
  Req extends Record<string, any> = {},
  ReqQuery extends Record<string, any> = {}
> extends Request<Params, {}, Req, ReqQuery> {
  user?: UserOutput;
}

export interface ValidatedAuthorizedRequest<T extends Record<string, any>> extends ValidatedRequest<T> {
  user?: UserOutput;
}

export interface ParsedJwtToken extends JwtPayload {
  email: string;
  exp: number;
  iat: number;
  id: number;
  iss: string;
  username: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ApiEndpointMeta<T> {
  method: EpMethod;
  version: string;
  path: string;
  isAuthorized?: boolean;
  hasSocketRes?: boolean;
  middleware?: (ApiMiddleware<T> | ((fields?: string | string[] | undefined, message?: any) => void))[];
}

export const noopMiddleware = (_: unknown, __: unknown, next: () => void) => next();

export type ApiMiddleware<T> = (req: Request<{}, {}, T, {}>, res: Response, next: () => void) => void;

export type EpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch';

export class ControllerBase {}

export type Controllers = Record<string, ControllerBase>;
