import { NextFunction } from 'express';
import { AuthorizedRequest } from '../types/api';
import { Logger } from '../utils/Logger';

export default class ApiEndpointLoggerMiddleware {
  public static log(req: AuthorizedRequest, _: unknown, next: NextFunction) {
    Logger.log(`Handle request: ${req.method.toLowerCase()}, ${req.url}, ${req.body}, ${req.query}, ${req.user}`);
    return next();
  }
}
