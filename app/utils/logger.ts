import { LoggerOptions, DefaultLogger } from '@mikro-orm/core';

// TODO
export class OrmLogger extends DefaultLogger {
  constructor(options: LoggerOptions) {
    super(options);
  }
}

// TODO
export const logger = (options: LoggerOptions) => new OrmLogger(options);
