import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserManager } from '../BLL/UserManager';
import config from '../config/config';
import { AuthorizedRequest, ParsedJwtToken } from '../types/api';
import { Logger } from '../utils/Logger';

if (!config.security.tokenKey) {
  throw Error('JWT_TOKEN_KEY required!');
}

if (!config.security.expiresIn) {
  throw Error('JWT_EXPIRES_IN required!');
}

if (!config.security.issuer) {
  throw Error('JWT_ISSUER required!');
}

export default class AuthMiddleware {
  public static async handleRequest(req: AuthorizedRequest, _: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return next();
    }
    try {
      const decoded: ParsedJwtToken = jwt.verify(token.split(' ')[1], config.security.tokenKey) as ParsedJwtToken;
      const user = await UserManager.getUserByName(decoded.username);
      if (user) req.user = user;
    } catch (err) {
      Logger.log('Error at token validation: ', err);
    } finally {
      return next();
    }
  }
}
