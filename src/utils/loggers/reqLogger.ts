import { logger } from './logger';
import { pinoHttp } from 'pino-http';

export const reqLogger = () => pinoHttp({ logger: logger.child({ namespace: 'req' }) });
