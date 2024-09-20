import { PrimaryKey } from '@mikro-orm/better-sqlite';

export abstract class BaseEntity {
  @PrimaryKey()
  id: string = crypto.randomUUID();
}
