import { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidatedRequest } from '../types/api';
import { ValidationException } from '../types/exceptions/ValidationException';

export default class ValidationMiddleware {
  public static throwValidationErrors(req: ValidatedRequest<any>, _: unknown, next: NextFunction) {
    const errorsFromExpressValidator = validationResult(req);
    if (req.validationErrors || errorsFromExpressValidator.array().length > 0) {
      return next(new ValidationException(req.validationErrors));
    }
    return next();
  }
}
