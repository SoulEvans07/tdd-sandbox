import { R } from '../localization';
import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
  constructor(message: string = R.badRequest) {
    super(400, message);
  }
}
