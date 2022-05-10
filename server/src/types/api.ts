import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserOutput } from '../DAL/models/User';

export interface ValidatedRequest<T extends object> extends Request<{}, {}, T> {
  validationErrors?: {
    [key in keyof T]?: string;
  };
}

export interface AuthorizedRequest extends Request {
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
  middleware?: (ApiMiddleware<T> | ((fields?: string | string[] | undefined, message?: any) => void))[];
}

export const noopMiddleware = (_: unknown, __: unknown, next: () => void) => next();

export type ApiMiddleware<T> = (req: Request<{}, {}, T, {}>, res: Response, next: () => void) => void;

export type EpMethod = 'post' | 'get' | 'put' | 'delete';

export class ControllerBase {}

export type Controllers = Record<string, ControllerBase>;
