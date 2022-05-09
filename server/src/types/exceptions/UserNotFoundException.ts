import { R } from '../localization';
import { BaseException } from './BaseException';

export class UserNotFound extends BaseException {
  constructor() {
    super(404, R.userNotFound);
  }
}
