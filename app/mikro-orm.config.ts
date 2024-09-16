import { defineConfig } from '@mikro-orm/core';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Migrator } from '@mikro-orm/migrations';
import { logger } from './utils';

export default defineConfig({
  driver: BetterSqliteDriver,
  entities: ['./dist/entities'],
  entitiesTs: ['./app/entities'],
  dbName: '.data/app.sqlite',
  highlighter: new SqlHighlighter(),
  debug: false,
  extensions: [Migrator],
  migrations: {
    fileName: (timestamp) => `migration-${timestamp}`,
    tableName: 'migrations',
    path: './app/migrations'
  },
  seeder: {
    path: './app/seeders'
  },
  loggerFactory: (options) => logger(options)
});
