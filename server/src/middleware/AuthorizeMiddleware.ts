import { NextFunction, Request, Response } from 'express';
import { AuthorizedRequest } from '../types/api';
import { UnAuthorizeException } from '../types/exceptions/UnAuthorizeException';
import { Logger } from '../utils/Logger';

export default class AuthorizeMiddleware {
  public static handleRequest(req: AuthorizedRequest, _: Response, next: NextFunction) {
    if (!req.user) {
      return next(new UnAuthorizeException());
    }
    next();
  }
}
