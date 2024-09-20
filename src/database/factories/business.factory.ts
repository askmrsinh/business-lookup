import { Factory } from '@mikro-orm/seeder';
import { BusinessEntity } from '../entities';
import { faker } from '@faker-js/faker';

export class BusinessFactory extends Factory<BusinessEntity> {
  model = BusinessEntity;

  private static readonly TYPES = [
    { weight: 50, value: 'Cafe' },
    { weight: 50, value: 'Restaurant' }
  ];

  definition(): Partial<BusinessEntity> {
    return {
      name: faker.company.name(),
      latitude: faker.location.latitude({ precision: 6 }),
      longitude: faker.location.longitude({ precision: 6 }),
      type: faker.helpers.weightedArrayElement(BusinessFactory.TYPES)
    };
  }
}
