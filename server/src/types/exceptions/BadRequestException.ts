import { StatusCode } from 'shared-types';
import { R } from '../localization';
import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
  constructor(message: string = R.badRequest) {
    super(StatusCode.BadRequest, message);
  }
}
