import { Entity, EntityRepositoryType, Property } from '@mikro-orm/better-sqlite';
import { BaseEntity } from './base/base-entity';
import { BusinessRepository } from '../repositories';

@Entity({ tableName: 'business', repository: () => BusinessRepository })
export class BusinessEntity extends BaseEntity {
  [EntityRepositoryType]?: BusinessRepository;

  @Property()
  name: string;

  @Property({ columnType: 'real' })
  latitude: number;

  @Property({ columnType: 'real' })
  longitude: number;

  @Property()
  type: string;

  @Property({ persist: false })
  distance?: number;

  constructor(obj: { name: string; latitude: number; longitude: number; type: string }) {
    super();
    this.name = obj.name;
    this.latitude = obj.latitude;
    this.longitude = obj.longitude;
    this.type = obj.type;
  }
}
