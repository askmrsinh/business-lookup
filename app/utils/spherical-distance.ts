import { EARTHS_RADIUS_IN_KM } from '../constants';

/**
 * Calculates the distance between two points on the Earth’s surface specified by latitude and
 * longitude using the spherical law of cosines.
 *
 * @param lat1 - Latitude of the first point in degrees. Must be between -90 and 90.
 * @param lon1 - Longitude of the first point in degrees. Must be between -180 and 180.
 * @param lat2 - Latitude of the second point in degrees. Must be between -90 and 90.
 * @param lon2 - Longitude of the second point in degrees. Must be between -180 and 180.
 * @param [radius=EARTHS_RADIUS_IN_KM] - The radius of the Earth in the unit of measurement
 * (default is kilometers).
 * @returns The distance between the two points in the specified unit (default is kilometers).
 *
 * @example
 * // Calculate distance between (51.5074, -0.1278) and (40.7128, -74.0060)
 * const distance = sphericalDistance(51.5074, -0.1278, 40.7128, -74.0060);
 */
export function sphericalDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radius = EARTHS_RADIUS_IN_KM
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const lat1Rad = toRad(lat1);
  const lon1Rad = toRad(lon1);
  const lat2Rad = toRad(lat2);
  const lon2Rad = toRad(lon2);

  const cosValue =
    Math.sin(lat1Rad) * Math.sin(lat2Rad) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);

  return radius * Math.acos(cosValue);
}
