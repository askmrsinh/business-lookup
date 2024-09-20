import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BusinessFactory } from '../factories';

export class BusinessSeeder extends Seeder {
  async run(em: EntityManager) {
    await new BusinessFactory(em).create(50);
  }
}
