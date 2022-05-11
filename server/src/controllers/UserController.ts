import { NextFunction, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { UserManager } from '../BLL/UserManager';
import { UserInput } from '../DAL/models/User';
import { epMeta } from '../decorators/api.decorators';
import { ControllerBase, ValidatedRequest } from '../types/api';
import { ValidationException } from '../types/exceptions/ValidationException';
import { R } from '../types/localization';

export default class UserController extends ControllerBase {
  @epMeta({
    method: 'post',
    version: '1.0',
    path: 'users',
    middleware: [UserController.validateUsername, UserController.validateEmail, UserController.validatePassword],
  })
  public async register(req: ValidatedRequest<UserInput>, res: Response, _: NextFunction) {
    await UserManager.save(req.body);
    return res.status(200).send({ message: req.t(R.userCreated) });
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
