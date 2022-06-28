import { StatusCode } from 'shared-types';
import { R } from '../localization';
import { ValidationErrors } from '../api';
import { BaseException } from './BaseException';

export class ValidationException extends BaseException {
  public errors?: ValidationErrors;
  constructor(errors?: ValidationErrors) {
    super(StatusCode.BadRequest, R.validationFailure);
    this.errors = errors;
  }
}
