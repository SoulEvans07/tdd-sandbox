import { StatusCode } from 'shared-types';
import { R } from '../localization';
import { BaseException } from './BaseException';

export class ForbiddenException extends BaseException {
  constructor(message: string = R.forbidden) {
    super(StatusCode.Forbidden, message);
  }
}
