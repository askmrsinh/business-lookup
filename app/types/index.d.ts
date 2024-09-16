import { EntityManager, MikroORM } from '@mikro-orm/better-sqlite';

declare global {
  namespace Express {
    interface Request {
      orm: MikroORM;
      em: EntityManager;
    }
  }
}
