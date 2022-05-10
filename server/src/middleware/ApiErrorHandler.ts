import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ValidationException } from '../types/exceptions/ValidationException';
import { BaseException } from '../types/exceptions/BaseException';
import { Logger } from '../utils/Logger';

export default class ApiErrorHandler {
  public static handleError(err: BaseException | ValidationException, req: Request, res: Response, _: any) {
    const { status, message } = err;
    let validationErrors: any;

    if ('errors' in err) {
      const { errors } = err;
      if (errors) {
        validationErrors = {
          ...errors,
        };
      }
    }

    const errorsFromExpressValidator = validationResult(req).array();
    if (errorsFromExpressValidator.length > 0) {
      validationErrors = validationErrors || {};
      errorsFromExpressValidator.forEach(error => {
        validationErrors[error.param] = req.t(error.msg);
      });
    }

    res.status(status).send({
      path: req.originalUrl,
      timestamp: new Date().getTime(),
      message: req.t(message),
      validationErrors,
    });
    Logger.log(`[ApiErrorHandler] Error occurred(${status}): ${message}`);
  }
}
