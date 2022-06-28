import { HttpStatusCode } from 'shared-types';

export class BaseException extends Error {
  public status: number;
  constructor(status: HttpStatusCode, message?: string) {
    super(message);
    this.status = status;
  }
}
