import { R } from '../localization';
import { ValidationErrors } from '../api';
import { BaseException } from './BaseException';

export class ValidationException extends BaseException {
  public errors?: ValidationErrors;
  constructor(errors?: ValidationErrors) {
    super(400, R.validationFailure);
    this.errors = errors;
  }
}
