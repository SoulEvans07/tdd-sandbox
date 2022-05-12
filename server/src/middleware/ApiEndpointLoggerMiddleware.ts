import { NextFunction } from 'express';
import { AuthorizedRequest } from '../types/api';
import { Logger } from '../utils/Logger';

export default class ApiEndpointLoggerMiddleware {
  public static log(req: AuthorizedRequest, _: unknown, next: NextFunction) {
    Logger.log(
      `Handle request: ${req.method.toLowerCase()}, url: ${req.url}, body: ${
        req.body ? JSON.stringify(req.body) : '-'
      }, query: ${req.query ? JSON.stringify(req.query) : '-'}, user: ${req.user ? JSON.stringify(req.user) : '-'}`
    );
    return next();
  }
}
