import type { EntityManager } from '@mikro-orm/core';
import { QueryOrder } from '@mikro-orm/better-sqlite';
import { BusinessEntity } from '../database/entities';
import { DiscoveryQueryDto } from '../dtos';

/**
 * Service for handling discovery-related database operations.
 */
export class DiscoveryService {
  /**
   * Retrieves nearby business entities based on the validated data.
   *
   * @param data - The validated query data.
   * @param em - The EntityManager used for database operations.
   * @returns A promise that resolves with the nearest business location.
   */
  static async getNearbyBusinesses(data: DiscoveryQueryDto, em: EntityManager) {
    return em
      .getRepository(BusinessEntity)
      .addSelectDistance(data.lat, data.long)
      .addSelect(['name', 'latitude', 'longitude', 'distance'])
      .orderBy({ distance: QueryOrder.ASC })
      .limit(data.limit)
      .where(data.type != null ? { type: data.type } : {})
      .execute();
  }
}
