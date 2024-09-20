import type { MikroORM } from '@mikro-orm/better-sqlite';
import { Server } from 'node:http';
import { createServer } from 'http';
import { init, app, env, orm } from './app';
import { logger } from './utils/loggers';

export let server: Server;

/**
 * Handles server errors such as insufficient privileges or address already in use.
 *
 * This function performs the following:
 * - Exits the process for "EACCES" and "EADDRINUSE" errors.
 * - Throws the error if it is not related to "listen" syscall.
 *
 * @param e - The error object emitted by the server.
 * @param port - The port or pipe on which the server was trying to listen.
 */
const onError = (e: NodeJS.ErrnoException, port: string | number) => {
  const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`;
  if (e.syscall !== 'listen') throw e;
  if (e.code === 'EACCES') {
    logger.fatal(`${bind} requires elevated privileges`);
    process.exit(1);
  }
  if (e.code === 'EADDRINUSE') {
    logger.fatal(`${bind} is already in use`);
    process.exit(1);
  }
  throw e;
};

/**
 * Gracefully shuts down the running Node server.
 *
 * This function performs the following:
 * - Stops the server from accepting new connections.
 * - Closes all connection(s) to the database.
 * - Exits process with a code of `0` on successful shutdown, or `1` if an error occurs.
 *
 * @param server - HTTP server instance to shut down.
 * @param orm - MikroORM instance for database connection management.
 * @param [signal] - Signal (e.g., 'SIGTERM', 'SIGINT') that triggered the shutdown.
 */
export async function shutdown(server: Server, orm: MikroORM, signal?: string) {
  logger.info(`${signal?.toLowerCase() || 'shutdown'} initiated`);
  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    logger.info('server closed');
    await orm.close().then(() => logger.info('database connection(s) closed'));
    process.exit(0);
  } catch (error) {
    logger.error('shutdown error has occurred', error);
    process.exit(1);
  }
}

/**
 * The main function that initializes the server.
 *
 * This function performs the following:
 * - Initializes the environment, ORM, and Express app by calling {@link init}`.
 * - Creates the HTTP server and starts listening on the configured port.
 * - Registers error handlers for the server (e.g., handling "EACCES" and "EADDRINUSE" errors).
 * - Registers signal handlers (e.g., 'SIGTERM', 'SIGINT') for graceful shutdown.
 */
(async function () {
  await init();
  server = createServer(app);

  server.listen(env.port);
  server.on('error', (error: NodeJS.ErrnoException) => onError(error, env.port));
  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    logger.info(`Server listening on ${bind}`);
  });

  ['SIGTERM', 'SIGINT'].forEach((signal) =>
    process.on(signal, () => shutdown(server, orm, signal))
  );
})();
