import { NextFunction, Response } from 'express';
import { check } from 'express-validator';
import { TenantManager } from '../BLL/TenantManager';
import { UserManager } from '../BLL/UserManager';
import { RestrictedUserOutput, UserInput } from '../DAL/models/User';
import { epMeta } from '../decorators/api.decorators';
import { AuthorizedRequest, ControllerBase, ValidatedRequest } from '../types/api';
import { ForbiddenException } from '../types/exceptions/ForbiddenException';
import { R } from '../types/localization';

export default class UserController extends ControllerBase {
  @epMeta({
    method: 'post',
    version: '1.0',
    path: 'user',
    middleware: [UserController.validateUsername, UserController.validateEmail, UserController.validatePassword],
  })
  public async register(req: ValidatedRequest<UserInput>, res: Response, _: NextFunction) {
    await UserManager.save(req.body);
    return res.status(200).send({ message: req.t(R.userCreated) });
  }

  @epMeta({
    method: 'get',
    version: '1.0',
    path: 'users/tenant/:tenantId',
  })
  public async list(
    req: AuthorizedRequest<{ tenantId?: string }>,
    res: Response<RestrictedUserOutput[]>,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new ForbiddenException();

      const tenantId = req.params.tenantId ? parseInt(req.params.tenantId) : undefined;
      if (!tenantId || req.user.tenantId !== tenantId) throw new ForbiddenException();

      const users = await TenantManager.getUsersByTenant(tenantId);
      const strippedUsers = users.map(u => ({ id: u.id, username: u.username, email: u.email }));
      return res.send(strippedUsers);
    } catch (err) {
      next(err);
    }
  }

  private static validateUsername(req: ValidatedRequest<UserInput>, res: Response, next: () => void) {
    check('username')
      .notEmpty()
      .withMessage(R.usernameRequired)
      .bail()
      .isLength({ min: 6, max: 32 })
      .withMessage(R.usernameLength)
      .bail()
      .custom((value: string) =>
        UserController.validateIsInUse(value, UserManager.isExistsByUsername, R.usernameInUse)
      )(req, res, next);
  }

  private static validateEmail(req: ValidatedRequest<UserInput>, res: Response, next: () => void) {
    check('email')
      .notEmpty()
      .withMessage(R.emailRequired)
      .bail()
      .isEmail()
      .withMessage(R.emailNotValid)
      .bail()
      .custom((value: string) => UserController.validateIsInUse(value, UserManager.isExistsByEmail, R.emailInUse))(
      req,
      res,
      next
    );
  }

  private static validatePassword(req: ValidatedRequest<UserInput>, res: Response, next: () => void) {
    check('password')
      .notEmpty()
      .withMessage(R.passwordRequired)
      .bail()
      .isLength({ min: 8 })
      .withMessage(R.passwordLength)
      .bail()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage(R.passwordPattern)
      .bail()(req, res, next);
  }

  private static async validateIsInUse(
    value: string,
    managerFunc: (value: string) => Promise<boolean>,
    errorMsg: string
  ) {
    if (await managerFunc(value)) {
      throw new Error(errorMsg);
    }
  }
}
