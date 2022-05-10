import { R } from '../localization';
import { BaseException } from './BaseException';

export class UnAuthorizeException extends BaseException {
  constructor(message?: string) {
    super(401, (message = R.unAuthorize));
  }
}
