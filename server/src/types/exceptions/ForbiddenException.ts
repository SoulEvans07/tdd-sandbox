import { R } from '../localization';
import { BaseException } from './BaseException';

export class ForbiddenException extends BaseException {
  constructor(message: string = R.forbidden) {
    super(403, message);
  }
}
