import { type LogContext, type LoggerNamespace } from '@mikro-orm/core/logging/Logger';
import { type LoggerOptions, DefaultLogger } from '@mikro-orm/core';
import { type Logger } from 'pino';
import { logger } from './logger';

/**
 * A custom log factory on top of Pino logger for MikroOMR.
 */
class OrmLogger<T extends Logger<'information' | 'warning'>> extends DefaultLogger {
  protected static NAMESPACE_PREFIX = 'orm-';

  protected readonly logger: T;

  constructor(options: LoggerOptions, logger: T) {
    super(options);
    this.logger = logger;
  }

  /**
   * @inheritDoc
   */
  log(namespace: LoggerNamespace, message: string, context?: LogContext) {
    if (!this.isEnabled(namespace, context)) return;

    const level: LogContext['level'] = context?.level ?? 'info';
    message = message.replace(/\n/g, '').replace(/ +/g, ' ').replace(/^- /, '').trim();

    this.logger[level]({ namespace: OrmLogger.NAMESPACE_PREFIX + namespace, context }, message);
  }
}

export const ormLogger = (options: LoggerOptions) => new OrmLogger(options, logger.child({}));
