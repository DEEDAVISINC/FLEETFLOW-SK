import {
  createMockCarrier,
  createMockLoad,
  createMockShipper,
  createMockUser,
  createTestDatabase,
  mockApiResponse,
  waitForNextTick,
} from './test-utils';

describe('Test Utilities', () => {
  describe('Mock Data Factories', () => {
    it('creates mock user with default values', () => {
      const user = createMockUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('brokerId');
    });

    it('creates mock user with overrides', () => {
      const user = createMockUser({ name: 'Custom User', role: 'admin' });

      expect(user.name).toBe('Custom User');
      expect(user.role).toBe('admin');
    });

    it('creates mock load with default values', () => {
      const load = createMockLoad();

      expect(load).toHaveProperty('id');
      expect(load).toHaveProperty('loadId');
      expect(load).toHaveProperty('origin');
      expect(load).toHaveProperty('destination');
      expect(load).toHaveProperty('rate');
      expect(load).toHaveProperty('status');
    });

    it('creates mock shipper with default values', () => {
      const shipper = createMockShipper();

      expect(shipper).toHaveProperty('id');
      expect(shipper).toHaveProperty('name');
      expect(shipper).toHaveProperty('email');
      expect(shipper).toHaveProperty('phone');
    });

    it('creates mock carrier with default values', () => {
      const carrier = createMockCarrier();

      expect(carrier).toHaveProperty('id');
      expect(carrier).toHaveProperty('name');
      expect(carrier).toHaveProperty('email');
      expect(carrier).toHaveProperty('mcNumber');
      expect(Array.isArray(carrier.equipment)).toBe(true);
    });
  });

  describe('API Response Helpers', () => {
    it('creates success response', () => {
      const data = { message: 'Success' };
      const response = mockApiResponse.success(data);

      expect(response.data).toEqual(data);
      expect(response.error).toBeNull();
      expect(response.status).toBe(200);
    });

    it('creates error response', () => {
      const message = 'Something went wrong';
      const response = mockApiResponse.error(message, 400);

      expect(response.data).toBeNull();
      expect(response.error.message).toBe(message);
      expect(response.status).toBe(400);
    });
  });

  describe('Async Helpers', () => {
    it('waits for next tick', async () => {
      const start = Date.now();
      await waitForNextTick();
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Test Database', () => {
    it('creates test database with basic operations', () => {
      const db = createTestDatabase();

      expect(db.size).toBe(0);

      db.set('key1', 'value1');
      expect(db.get('key1')).toBe('value1');
      expect(db.has('key1')).toBe(true);
      expect(db.size).toBe(1);

      db.delete('key1');
      expect(db.has('key1')).toBe(false);
      expect(db.size).toBe(0);
    });
  });
});


