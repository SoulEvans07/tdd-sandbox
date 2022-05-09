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
    middlewares: [
      check('username')
        .notEmpty()
        .withMessage(R.usernameRequired)
        .bail()
        .isLength({ min: 6, max: 32 })
        .withMessage(R.usernameLength)
        .bail(),
      check('email').notEmpty().withMessage(R.emailRequired).bail().isEmail().withMessage(R.emailNotValid).bail(),
      check('password')
        .notEmpty()
        .withMessage(R.passwordRequired)
        .bail()
        .isLength({ min: 8 })
        .withMessage(R.passwordLength)
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
        .withMessage(R.passwordPattern)
        .bail(),
    ],
  })
  async register(req: ValidatedRequest<UserInput>, res: Response, next: NextFunction) {
    const errorsFromExpressValidator = validationResult(req);
    if (req.validationErrors || errorsFromExpressValidator.array().length > 0) {
      return next(new ValidationException(req.validationErrors));
    }

    const isEmpty = JSON.stringify(req.body) === '{}';
    if (isEmpty) return res.status(400).send();

    await UserManager.save(req.body);

    return res.status(200).send();
  }
}
