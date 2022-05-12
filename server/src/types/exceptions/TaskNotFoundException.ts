import { R } from '../localization';
import { BaseException } from './BaseException';

export class TaskNotFoundException extends BaseException {
  constructor(status: number = 404) {
    super(status, R.taskNotFound);
  }
}
