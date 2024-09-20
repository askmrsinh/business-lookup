import type { MikroORM } from '@mikro-orm/better-sqlite';

declare global {
  namespace Express {
    interface Request {
      orm: Readonly<MikroORM>;
    }
  }
}
