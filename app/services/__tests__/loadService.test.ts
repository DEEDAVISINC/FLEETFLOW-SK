import { createMockLoad, mockFetchResponse } from '../../test-utils';
import { createLoad, generateLoadId, getBrokerLoads } from '../loadService';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({ data: createMockLoad(), error: null })
          ),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({ data: [createMockLoad()], error: null })
          ),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: createMockLoad({ status: 'booked' }),
                error: null,
              })
            ),
          })),
        })),
      })),
    })),
  })),
}));

describe('Load Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchResponse({ success: true });
  });

  describe('generateLoadId', () => {
    it('generates a unique load ID with proper format', () => {
      const loadId = generateLoadId();
      expect(loadId).toMatch(/^FL-\d{4}-\d{3}$/); // FL-2025-001 format
    });

    it('generates different IDs on subsequent calls', () => {
      // Clear any existing state to ensure unique IDs
      const loadId1 = generateLoadId({ origin: 'LA', destination: 'NY' });
      const loadId2 = generateLoadId({ origin: 'SF', destination: 'NYC' });
      expect(loadId1).not.toBe(loadId2);
    });

    it('generates comprehensive ID when load data is provided', () => {
      const loadData = {
        origin: 'Los Angeles, CA',
        destination: 'New York, NY',
        pickupDate: '2024-01-15',
        equipment: 'Dry Van',
        brokerName: 'Test Broker',
      };

      const loadId = generateLoadId(loadData);
      expect(loadId).toMatch(/^TB-\d{4}/); // Should start with TB (Test Broker initials)
    });
  });

  describe('createLoad', () => {
    const mockLoadData = {
      brokerId: 'broker-123',
      origin: 'Los Angeles, CA',
      destination: 'New York, NY',
      rate: 2500,
      distance: '2800 miles',
      weight: '45000 lbs',
      equipment: 'Dry Van',
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      shipperId: 'shipper-123',
      dispatcherId: 'dispatcher-123',
      flowStage: 'available' as const,
      status: 'available' as const,
      identifiers: {
        loadId: 'TEST-001',
        trackingNumber: 'TR123',
        proNumber: 'PRO123',
        bolNumber: 'BOL123',
      },
    };

    it('creates a load successfully with valid data', () => {
      const result = createLoad(mockLoadData);

      expect(result).toBeDefined();
      expect(result.origin).toBe('Los Angeles, CA');
      expect(result.destination).toBe('New York, NY');
      expect(result.rate).toBe(2500);
      expect(result.equipment).toBe('Dry Van');
    });

    it('sets default values for optional fields', () => {
      const minimalData = {
        brokerId: 'broker-123',
        origin: 'Los Angeles, CA',
        destination: 'New York, NY',
        rate: 2000,
        distance: '1000 miles',
        weight: '10000 lbs',
        equipment: 'Dry Van',
        pickupDate: '2024-01-15',
        deliveryDate: '2024-01-18',
        flowStage: 'available' as const,
        status: 'available' as const,
        identifiers: {
          loadId: 'TEST-001',
          trackingNumber: 'TR123',
          proNumber: 'PRO123',
          bolNumber: 'BOL123',
        },
      };

      const result = createLoad(minimalData);

      expect(result.equipment).toBe('Dry Van');
      expect(result.brokerId).toBe('broker-123');
    });
  });

  describe('getBrokerLoads', () => {
    it('retrieves loads for a specific broker', () => {
      const brokerId = 'broker-123';
      const loads = getBrokerLoads(brokerId);

      expect(Array.isArray(loads)).toBe(true);
    });

    it('returns loads when no broker specified', () => {
      const loads = getBrokerLoads();
      expect(Array.isArray(loads)).toBe(true);
    });
  });
});
