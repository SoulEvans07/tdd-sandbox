import { StatusCode } from 'shared-types';
import { R } from '../localization';
import { BaseException } from './BaseException';

export class UnAuthorizeException extends BaseException {
  constructor(message: string = R.unAuthorize) {
    super(StatusCode.Unauthorized, message);
  }
}
