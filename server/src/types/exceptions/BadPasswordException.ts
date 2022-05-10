import { R } from '../localization';
import { BaseException } from './BaseException';

export class BadPasswordException extends BaseException {
  constructor() {
    super(403, R.userPasswordIsWrong);
  }
}
