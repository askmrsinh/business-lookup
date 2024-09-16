import request from 'supertest';
import { app, database, init, server } from '../server';
import { DatabaseSeeder } from '../seeders';
import { BusinessEntity } from '../entities';
import { sphericalDistance } from '../utils';

describe('Discovery Controller', () => {
  beforeAll(async () => {
    await init;
    database.config.set('dbName', ':memory:');
    database.config.getLogger().setDebugMode(false);
    await database.config.getDriver().reconnect();
    await database.migrator.up();
    await database.seeder.seed(DatabaseSeeder);
  });

  afterAll(async () => {
    await database.getSchemaGenerator().dropDatabase();
    await database.close(true);
    server.close();
  });

  it('should return all businesses by default with name, latitude, longitude, and distance', async () => {
    const res = await request(app).get('/discovery');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(DatabaseSeeder.BUSINESSES.length);
    res.body.map((r: BusinessEntity) => {
      expect(r).toHaveProperty('name');
      expect(r).toHaveProperty('latitude');
      expect(r).toHaveProperty('longitude');
      expect(r).toHaveProperty('distance');
    });
  });

  it('should return businesses sorted by closest distance to given lat and long', async () => {
    const [lat, long] = [0, 0];
    const sorted = DatabaseSeeder.BUSINESSES.map((r) => ({
      ...r,
      distance: sphericalDistance(r.latitude, r.longitude, lat, long)
    })).sort((b1, b2) => b1.distance - b2.distance);
    const res = await request(app).get('/discovery').query({ lat, long });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(DatabaseSeeder.BUSINESSES.length);
    res.body.map((r: BusinessEntity, i: number) => expect(r.name).toBe(sorted[i].name));
  });

  it('should limit the number of returned businesses', async () => {
    const res = await request(app).get('/discovery').query({ limit: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should filter businesses by type', async () => {
    const cafeNames = DatabaseSeeder.BUSINESSES.filter((r) => r.type === 'Cafe').map((r) => r.name);
    const resCafe = await request(app).get('/discovery').query({ type: 'Cafe' });
    expect(resCafe.status).toBe(200);
    expect(resCafe.body).toHaveLength(cafeNames.length);
    const resCafeNames = resCafe.body.map((business: BusinessEntity) => business.name);
    expect(resCafeNames).toEqual(expect.arrayContaining(cafeNames));
  });

  it('should handle various invalid query parameters', async () => {
    // Test with non-numeric, invalid query parameters
    const invalidTypeRes = await request(app)
      .get('/discovery')
      .query({ lat: 'invalid', long: 'invalid' });
    expect(invalidTypeRes.status).toBe(400);
    expect(invalidTypeRes.body.message).toBe('Invalid request.');
    expect(invalidTypeRes.body.error).toBeDefined();

    // Test with out-of-range, positive latitude and longitude values
    const outOfRangePositiveRes = await request(app)
      .get('/discovery')
      .query({ lat: 200, long: 200 });
    expect(outOfRangePositiveRes.status).toBe(400);
    expect(outOfRangePositiveRes.body.error.lat).toContain('lat must be a valid earth latitude');
    expect(outOfRangePositiveRes.body.error.long).toContain('long must be a valid earth longitude');

    // Test with out-of-range, negative latitude and longitude values
    const outOfRangeNegativeRes = await request(app)
      .get('/discovery')
      .query({ lat: -200, long: -200 });
    expect(outOfRangeNegativeRes.status).toBe(400);
    expect(outOfRangeNegativeRes.body.error.lat).toContain('lat must be a valid earth latitude');
    expect(outOfRangeNegativeRes.body.error.long).toContain('long must be a valid earth longitude');

    // Test with one valid and one invalid field
    const partialInvalidRes = await request(app)
      .get('/discovery')
      .query({ lat: 40.7128, long: 'invalid' });
    expect(partialInvalidRes.status).toBe(400);
    expect(partialInvalidRes.body.message).toBe('Invalid request.');
    expect(partialInvalidRes.body.error.long).toContain('long must be a number');

    // Test with non-numeric 'limit' value
    const invalidLimitRes = await request(app).get('/discovery').query({ limit: 'invalid' });
    expect(invalidLimitRes.status).toBe(400);
    expect(invalidLimitRes.body.message).toBe('Invalid request.');
    expect(invalidLimitRes.body.error.limit).toContain('limit must be an integer number');

    // Test with large negative 'limit' value
    const negativeLimitRes = await request(app).get('/discovery').query({ limit: -10 });
    expect(negativeLimitRes.status).toBe(400);
    expect(negativeLimitRes.body.error.limit).toContain('limit must not be less than -1');

    // Test with a decimal 'limit' value
    const nonIntegerLimitRes = await request(app).get('/discovery').query({ limit: 2.5 });
    expect(nonIntegerLimitRes.status).toBe(400);
    expect(nonIntegerLimitRes.body.error.limit).toContain('limit must be an integer number');

    // Test with multiple invalid query parameters simultaneously
    const allInvalidParamsRes = await request(app).get('/discovery').query({
      lat: Number.NEGATIVE_INFINITY,
      long: Number.POSITIVE_INFINITY,
      limit: -1.3 // Non integer limit
    });
    expect(allInvalidParamsRes.status).toBe(400);
    expect(allInvalidParamsRes.body.message).toBe('Invalid request.');
    expect(allInvalidParamsRes.body.error.lat).toContain('lat must be a number');
    expect(allInvalidParamsRes.body.error.long).toContain('long must be a number');
    expect(allInvalidParamsRes.body.error.lat).toContain('lat must be a valid earth latitude');
    expect(allInvalidParamsRes.body.error.long).toContain('long must be a valid earth longitude');
    expect(allInvalidParamsRes.body.error.limit).toContain('limit must be an integer number');
  });

  it('should handle boundary values for latitude and longitude', async () => {
    // Test with maximum valid latitude and longitude
    const maxRes = await request(app).get('/discovery').query({ lat: 90, long: 180 });
    expect(maxRes.status).toBe(200);

    // Test with minimum valid latitude and longitude
    const minRes = await request(app).get('/discovery').query({ lat: -90, long: -180 });
    expect(minRes.status).toBe(200);

    // Test with zero latitude and longitude
    const zeroRes = await request(app).get('/discovery').query({ lat: 0, long: 0 });
    expect(zeroRes.status).toBe(200);

    // Test with maximum latitude and minimum longitude
    const maxLatMinLongRes = await request(app).get('/discovery').query({ lat: 90, long: -180 });
    expect(maxLatMinLongRes.status).toBe(200);

    // Test with minimum latitude and maximum longitude
    const minLatMaxLongRes = await request(app).get('/discovery').query({ lat: -90, long: 180 });
    expect(minLatMaxLongRes.status).toBe(200);

    // Test with slightly less than max valid latitude and longitude
    const nearMaxRes = await request(app).get('/discovery').query({ lat: 89.999, long: 179.9999 });
    expect(nearMaxRes.status).toBe(200);

    // Test with slightly more than min valid latitude and longitude
    const nearMinRes = await request(app).get('/discovery').query({ lat: -89.999, long: -179.999 });
    expect(nearMinRes.status).toBe(200);

    // Test with positive latitude and zero longitude
    const posLatZeroLongRes = await request(app).get('/discovery').query({ lat: 45, long: 0 });
    expect(posLatZeroLongRes.status).toBe(200);

    // Test with zero latitude and positive longitude
    const zeroLatPosLongRes = await request(app).get('/discovery').query({ lat: 0, long: 45 });
    expect(zeroLatPosLongRes.status).toBe(200);

    // Test with positive latitude and negative longitude
    const mixedPosNegRes = await request(app).get('/discovery').query({ lat: 45, long: -45 });
    expect(mixedPosNegRes.status).toBe(200);

    // Test with negative latitude and positive longitude
    const negLatPosLongRes = await request(app).get('/discovery').query({ lat: -45, long: 45 });
    expect(negLatPosLongRes.status).toBe(200);
  });

  it('should handle zero and negative one limit values', async () => {
    // Test with zero as limit
    const resZero = await request(app).get('/discovery').query({ limit: 0 });
    expect(resZero.status).toBe(200);
    expect(resZero.body).toHaveLength(0);

    // Test with negative one as limit
    const resNegative = await request(app).get('/discovery').query({ limit: -1 });
    expect(resNegative.status).toBe(200);
    expect(resNegative.body).toHaveLength(DatabaseSeeder.BUSINESSES.length);
  });
});
