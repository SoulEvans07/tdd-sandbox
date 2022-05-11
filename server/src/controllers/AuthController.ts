import { NextFunction, Response } from 'express';
import { check } from 'express-validator';
import AuthManager from '../BLL/AuthManager';
import { UserInput } from '../DAL/models/User';
import { epMeta } from '../decorators/api.decorators';
import { AuthorizedRequest, ControllerBase, ValidatedRequest } from '../types/api';
import { R } from '../types/localization';

export default class AuthController extends ControllerBase {
  private static baseUrl = 'auth';

  @epMeta({
    method: 'post',
    version: '1.0',
    path: `${AuthController.baseUrl}/login`,
    middleware: [
      check('username').notEmpty().withMessage(R.usernameRequired),
      check('password').notEmpty().withMessage(R.passwordRequired),
    ],
  })
  public async login(req: ValidatedRequest<UserInput>, res: Response, next: NextFunction) {
    try {
      const loginResponse = await AuthManager.login(req.body.username, req.body.password);
      return res.send(loginResponse);
    } catch (err) {
      next(err);
    }
  }

  @epMeta({
    method: 'post',
    version: '1.0',
    isAuthorized: true,
    path: `${AuthController.baseUrl}/token`,
  })
  public async token(req: AuthorizedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Unexpected error occurred');
      }
      const loginResponse = await AuthManager.generateTokenForUser(req.user.username);
      return res.send(loginResponse);
    } catch (err) {
      next(err);
    }
  }
}
