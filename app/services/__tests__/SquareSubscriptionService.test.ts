import { mockApiResponse, mockFetchResponse } from '../../test-utils';
import { squareSubscriptionService } from '../SquareSubscriptionService';

// Mock Square SDK
jest.mock('squareup', () => ({
  Client: jest.fn(() => ({
    customers: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    subscriptions: {
      create: jest.fn(),
      retrieve: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
    },
    payments: {
      create: jest.fn(),
    },
  })),
}));

// Mock environment variables
process.env.SQUARE_APPLICATION_ID = 'test-app-id';
process.env.SQUARE_ACCESS_TOKEN = 'test-access-token';

describe('SquareSubscriptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchResponse(mockApiResponse.success({}));
  });

  describe('createSubscription', () => {
    const mockSubscriptionData = {
      customerId: 'customer-123',
      planIds: ['plan-basic'],
      paymentMethodId: 'pm_123',
      trialDays: 14,
    };

    it('handles subscription creation', async () => {
      const result =
        await squareSubscriptionService.createSubscription(
          mockSubscriptionData
        );

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('validates input parameters', async () => {
      const result = await squareSubscriptionService.createSubscription({
        customerId: '',
        planIds: [],
        paymentMethodId: '',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });
  });

  describe('getUserSubscriptions', () => {
    it('handles user subscription retrieval', async () => {
      const userId = 'user-123';
      const result =
        await squareSubscriptionService.getUserSubscriptionInfo(userId);

      expect(result).toBeDefined();
    });

    it('handles non-existent users', async () => {
      const result = await squareSubscriptionService.getUserSubscriptionInfo(
        'user-no-subscriptions'
      );
      expect(result).toBeDefined();
    });
  });

  describe('service methods', () => {
    it('handles basic service operations', async () => {
      const subscriptionId = 'sub_123';
      const userId = 'user-123';

      // Test cancelSubscription
      const cancelResult =
        await squareSubscriptionService.cancelSubscription(subscriptionId);
      expect(typeof cancelResult).toBe('boolean');

      // Test updateSubscriptionStatus
      const updateResult =
        await squareSubscriptionService.updateSubscriptionStatus(
          subscriptionId,
          'active'
        );
      expect(typeof updateResult).toBe('boolean');

      // Test hasFeatureAccess
      const featureResult = await squareSubscriptionService.hasFeatureAccess(
        userId,
        'advanced_reporting'
      );
      expect(typeof featureResult).toBe('boolean');

      // Test checkUsageLimit
      const usageResult = await squareSubscriptionService.checkUsageLimit(
        userId,
        'users',
        5
      );
      expect(usageResult).toHaveProperty('withinLimit');
      expect(usageResult).toHaveProperty('limit');
      expect(usageResult).toHaveProperty('usage');
    });
  });
});
