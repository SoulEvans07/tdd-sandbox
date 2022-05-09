import { R } from '../localization';
import { BaseException } from './BaseException';

export class InvalidTokenException extends BaseException {
  constructor(message?: string) {
    super(400, (message = R.accountActivationFailure));
  }
}
