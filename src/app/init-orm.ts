import { MikroORM } from '@mikro-orm/better-sqlite';
import config from '../config/orm';
import { logger, ormLogger } from '../utils/loggers';

export async function initOrm(): Promise<MikroORM> {
  try {
    return await MikroORM.init({ ...config, loggerFactory: (o) => ormLogger(o) });
  } catch (e) {
    logger.error(e, 'failed to initialize ORM');
    throw e;
  }
}
