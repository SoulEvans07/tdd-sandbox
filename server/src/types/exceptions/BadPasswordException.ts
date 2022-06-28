import { StatusCode } from 'shared-types';
import { R } from '../localization';
import { BaseException } from './BaseException';

export class BadPasswordException extends BaseException {
  constructor() {
    super(StatusCode.Forbidden, R.userPasswordIsWrong);
  }
}
