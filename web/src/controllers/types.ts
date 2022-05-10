import { serverUrl } from '../config';

export abstract class ControllerBase {
  protected abstract readonly version: string;
  protected abstract readonly name: string;

  protected get baseUrl(): string {
    return serverUrl + '/api/' + this.version + '/' + this.name;
  }
}
