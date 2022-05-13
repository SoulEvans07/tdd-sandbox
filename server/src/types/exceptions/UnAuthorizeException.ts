import { R } from '../localization';
import { BaseException } from './BaseException';

export class UnAuthorizeException extends BaseException {
  constructor(message: string = R.unAuthorize) {
    super(401, message);
  }
}
