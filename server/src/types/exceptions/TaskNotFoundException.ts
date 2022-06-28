import { HttpStatusCode, StatusCode } from 'shared-types';
import { R } from '../localization';
import { BaseException } from './BaseException';

export class TaskNotFoundException extends BaseException {
  constructor(status: HttpStatusCode = StatusCode.NotFound) {
    super(status, R.taskNotFound);
  }
}
