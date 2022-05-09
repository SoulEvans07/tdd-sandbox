import config from '../config/config';

export class Logger {
  public static log(...args: any[]) {
    if (config.logger.enabled === true) {
      console.log('⚡️ [server]: ', ...args);
    }
  }
}
