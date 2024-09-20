import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/core';

export default defineConfig({
  driver: BetterSqliteDriver,
  entities: ['./dist/database/entities'],
  entitiesTs: ['./src/database/entities'],
  dbName: '.data/app.sqlite',
  highlighter: new SqlHighlighter(),
  debug: false,
  extensions: [Migrator],
  migrations: {
    fileName: (timestamp) => `migration-${timestamp}`,
    tableName: 'migrations',
    path: './src/database/migrations'
  },
  seeder: {
    path: './src/database/seeders'
  }
});
