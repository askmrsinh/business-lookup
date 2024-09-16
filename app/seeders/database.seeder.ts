import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BusinessEntity } from '../entities';

export class DatabaseSeeder extends Seeder {
  public static readonly BUSINESSES: Omit<BusinessEntity, 'id'>[] = [
    { name: 'Business 1', latitude: 40.7128, longitude: -74.006, type: 'Cafe' },
    { name: 'Business 2', latitude: 34.0522, longitude: -118.2437, type: 'Restaurant' },
    { name: 'Business 3', latitude: 51.5074, longitude: -0.1278, type: 'Cafe' },
    { name: 'Business 4', latitude: 48.8566, longitude: 2.3522, type: 'Restaurant' },
    { name: 'Business 5', latitude: 41.8781, longitude: -87.6298, type: 'Cafe' },
    { name: 'Business 6', latitude: 51.5074, longitude: -0.1278, type: 'Restaurant' }
  ];

  async run(em: EntityManager) {
    DatabaseSeeder.BUSINESSES.map((r) => em.create(BusinessEntity, r));

    return await em.flush();
  }
}
