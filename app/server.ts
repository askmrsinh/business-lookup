import 'reflect-metadata';
import { Server } from 'node:http';
import { MikroORM, RequestContext } from '@mikro-orm/better-sqlite';
import express, { Express, Request, Response, NextFunction } from 'express';
import { DiscoveryController } from './controllers';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import pino, { Logger } from 'pino';

export const app: Express = express();

export let logger: Logger;
export let server: Server;
export let database: MikroORM;

const shutdown = async () => {
  logger.info('Graceful shutdown initiated');
  server.close(async (err) => {
    if (err) {
      logger.error('Error shutting down server:', err);
      process.exit(1);
    }
    try {
      await database.close();
      logger.info('Database connections closed');
      process.exit(0);
    } catch (dbErr) {
      logger.error('Error closing database:', dbErr);
      process.exit(1);
    }
  });
};

export const init = (async () => {
  const port = process.env.PORT || 3000;
  const console = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, destination: 1 }
    }
  });

  logger = console;
  const orm = await MikroORM.init();

  app.use(pinoHttp({ logger: console }));
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use((req: Request, res: Response, next: NextFunction) =>
    RequestContext.create(orm.em, () => {
      req.orm = orm;
      req.em = orm.em;
      next();
    })
  );

  app.get('/', (req: Request, res: Response) =>
    res.json({
      message: 'Welcome to the Business Lookup Express TS project, try /discovery endpoint!'
    })
  );
  app.use('/discovery', DiscoveryController);

  app.use((req: Request, res: Response) => res.status(404).json({ message: 'No route found' }));

  app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  [database, server] = [
    orm,
    app.listen(port, () => {
      console.info(`Express TS example started at http://localhost:${port}`);
    })
  ];

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
})();
