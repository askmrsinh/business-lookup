import { EntityRepository, raw, SelectQueryBuilder } from '@mikro-orm/better-sqlite';
import { BusinessEntity } from '../entities';
import { EARTHS_RADIUS_IN_KM } from '../constants';

export class BusinessRepository extends EntityRepository<BusinessEntity> {
  protected static readonly RADIUS = EARTHS_RADIUS_IN_KM;

  /**
   * Adds a SQL select statement to calculate the distance between each business and a specified
   * geographic location and includes the calculated distance as a new column named 'distance'.
   *
   * The distance is calculated using the spherical law of cosines formula.
   *
   * @param {number} latitude - The latitude of the point to measure distance from.
   * @param {number} longitude - The longitude of the point to measure distance from.
   * @returns A QueryBuilder object.
   *
   * @example
   * // Get businesses with a new column 'distance' from the specified coordinates
   * const businesses = await businessRepository.addSelectDistance(40.7128, -74.0060).execute();
   */
  public addSelectDistance(
    latitude: number,
    longitude: number
  ): SelectQueryBuilder<BusinessEntity> {
    return this.qb().addSelect(
      raw(`(${BusinessRepository.RADIUS} * acos(
        sin(radians(${latitude})) * sin(radians(latitude))
        + cos(radians(${latitude})) 
        * cos(radians(latitude)) 
        * cos(radians(longitude) - radians(${longitude}))
      ))`).as('distance')
    );
  }
}
