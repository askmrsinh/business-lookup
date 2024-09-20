import 'reflect-metadata';
import type { MikroORM } from '@mikro-orm/better-sqlite';
import type { Request, Response, NextFunction, Express } from 'express';
import { RequestContext } from '@mikro-orm/better-sqlite';
import { Environment } from '../config/environment';
import { DiscoveryController } from '../controllers';
import { logger, reqLogger } from '../utils/loggers';
import { initEnv } from './init-env';
import { initOrm } from './init-orm';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

/** The parsed and validated process environment. */
export let env: Environment;

/** The MikroORM instance responsible for database interactions. */
export let orm: MikroORM;

/** The Express application instance, used to define routes and middleware. */
export let app: Express;

/**
 * Initializes the environment, ORM, and Express app.
 *
 * This function performs the following:
 * - Sets up global middleware for logging, CORS, security, and JSON parsing.
 * - Attaches ORM Entity Manager to each request.
 * - Defines routes and error handling.
 *
 * @returns Resolves when initialization is complete.
 *
 * @note Global {@link env}, {@link orm} and {@link app} are initialized within this function.
 */
export async function init(): Promise<void> {
  env = await initEnv();
  orm = await initOrm();
  app = express();

  app.set('port', env.port);
  app.use([reqLogger(), cors(), helmet(), express.json()]);
  app.use((req: Request, res: Response, next: NextFunction) =>
    RequestContext.create(orm.em, () => {
      req.orm = orm;
      next();
    })
  );

  app.get('/', (req: Request, res: Response) =>
    res.json({ message: 'Welcome to the Business Lookup project, try `/discovery` endpoint!' })
  );
  app.use('/discovery', DiscoveryController);

  app.use((req: Request, res: Response) => res.status(404).json({ message: 'No route found.' }));
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'Internal server error.' });
    next();
  });
}
