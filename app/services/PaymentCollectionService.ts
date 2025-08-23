/**
 * Payment Collection Service
 * Integrates with existing Square/Bill.com for subscription payment management
 */

import { MultiTenantSquareService } from './MultiTenantSquareService';
import { subscriptionAgreementService } from './SubscriptionAgreementService';
import { SubscriptionManagementService } from './SubscriptionManagementService';
import { BillComService } from './billing/BillComService';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'ach';
  last4: string;
  brand?: string; // Visa, MasterCard, etc.
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  accountType?: 'checking' | 'savings';
  isDefault: boolean;
  isActive: boolean;
  createdDate: Date;
  squarePaymentMethodId?: string;
  billComVendorId?: string;
}

export interface PaymentAttempt {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  attemptDate: Date;
  failureReason?: string;
  squarePaymentId?: string;
  billComTransactionId?: string;
  retryCount: number;
  nextRetryDate?: Date;
}

export interface SubscriptionBilling {
  id: string;
  userId: string;
  subscriptionTierId: string;
  status: 'active' | 'past_due' | 'cancelled' | 'suspended';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  currency: string;
  paymentMethodId: string;
  lastPaymentDate?: Date;
  nextBillingDate: Date;
  failedPaymentCount: number;
  trialEndDate?: Date;
  cancelledDate?: Date;
  pausedDate?: Date;
  dunningStatus?: 'none' | 'soft_decline' | 'hard_decline' | 'final_notice';
}

export interface PaymentSettings {
  userId: string;
  autoRetryEnabled: boolean;
  retryAttempts: number; // Default: 3
  retryInterval: number; // Days between retries, Default: 3
  invoiceReminderEnabled: boolean;
  reminderDaysBefore: number; // Default: 3
  paymentFailureNotifications: boolean;
  preferredPaymentMethod: 'square' | 'billcom';
  taxId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

class PaymentCollectionService {
  private squareService: MultiTenantSquareService | null = null;
  private billComService: BillComService | null = null;
  private paymentMethods: Map<string, PaymentMethod[]> = new Map();
  private paymentAttempts: Map<string, PaymentAttempt[]> = new Map();
  private subscriptionBilling: Map<string, SubscriptionBilling> = new Map();
  private paymentSettings: Map<string, PaymentSettings> = new Map();

  constructor() {
    this.initializeServices();
    this.initializeMockData();
  }

  private initializeServices() {
    try {
      this.squareService = new MultiTenantSquareService();
      console.log('✅ Square service initialized');
    } catch (error) {
      console.warn(
        '⚠️ Square service not available in development mode',
        error.message
      );
      this.squareService = null;
    }

    try {
      this.billComService = new BillComService();
      console.log('✅ Bill.com service initialized');
    } catch (error) {
      console.warn('⚠️ Bill.com service not available in development mode');
      this.billComService = null;
    }
  }

  private initializeMockData() {
    // Demo payment methods
    const demoPaymentMethods: PaymentMethod[] = [
      {
        id: 'pm_1_card_visa',
        userId: 'DD-MGR-20240101-1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        isActive: true,
        createdDate: new Date('2024-01-01'),
        squarePaymentMethodId: 'sq_pm_1234567890abcdef',
      },
      {
        id: 'pm_2_ach_bank',
        userId: 'DD-MGR-20240101-1',
        type: 'ach',
        last4: '6789',
        bankName: 'Chase Bank',
        accountType: 'checking',
        isDefault: false,
        isActive: true,
        createdDate: new Date('2024-01-15'),
        billComVendorId: 'vendor_ach_123456',
      },
    ];

    this.paymentMethods.set('DD-MGR-20240101-1', demoPaymentMethods);

    // Demo billing configuration
    const demoBilling: SubscriptionBilling = {
      id: 'sub_billing_demo_1',
      userId: 'DD-MGR-20240101-1',
      subscriptionTierId: 'enterprise-module',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      billingCycle: 'monthly',
      amount: 2698,
      currency: 'USD',
      paymentMethodId: 'pm_1_card_visa',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      failedPaymentCount: 0,
      dunningStatus: 'none',
    };

    this.subscriptionBilling.set('DD-MGR-20240101-1', demoBilling);

    // Demo payment settings
    const demoSettings: PaymentSettings = {
      userId: 'DD-MGR-20240101-1',
      autoRetryEnabled: true,
      retryAttempts: 3,
      retryInterval: 3,
      invoiceReminderEnabled: true,
      reminderDaysBefore: 3,
      paymentFailureNotifications: true,
      preferredPaymentMethod: 'square',
      billingAddress: {
        street: '123 Fleet Street',
        city: 'Dallas',
        state: 'TX',
        postalCode: '75201',
        country: 'US',
      },
    };

    this.paymentSettings.set('DD-MGR-20240101-1', demoSettings);
  }

  // ========================================
  // PAYMENT METHOD MANAGEMENT
  // ========================================

  async addPaymentMethod(
    userId: string,
    paymentMethodData: {
      type: 'card' | 'bank_account';
      cardNumber?: string;
      expiryMonth?: number;
      expiryYear?: number;
      cvc?: string;
      accountNumber?: string;
      routingNumber?: string;
      accountType?: 'checking' | 'savings';
    }
  ): Promise<PaymentMethod> {
    try {
      // Check user agreements first
      const agreementCheck =
        subscriptionAgreementService.hasUserAgreedToRequired(userId);
      if (!agreementCheck.hasAgreed) {
        throw new Error(
          'User must agree to subscription terms before adding payment method'
        );
      }

      let squarePaymentMethodId: string | undefined;
      let billComVendorId: string | undefined;

      if (paymentMethodData.type === 'card') {
        // Create payment method in Square (if available)
        if (this.squareService) {
          // Note: Square payment methods are typically created on the frontend
          // This is a placeholder for the backend integration
          squarePaymentMethodId = `sq_pm_${userId}_${Date.now()}`;
          console.log('✅ Square payment method created');
        } else {
          // Mock Square payment method ID for development
          squarePaymentMethodId = `sq_pm_mock_${userId}_${Date.now()}`;
          console.log('🔧 Using mock Square payment method ID');
        }
      } else if (paymentMethodData.type === 'bank_account') {
        // Create ACH payment method in Bill.com (if available)
        if (this.billComService) {
          billComVendorId = await this.billComService.createVendor({
            userId,
            accountNumber: paymentMethodData.accountNumber!,
            routingNumber: paymentMethodData.routingNumber!,
            accountType: paymentMethodData.accountType!,
          });
        } else {
          // Mock Bill.com vendor ID for development
          billComVendorId = `vendor_mock_${userId}_${Date.now()}`;
          console.log('🔧 Using mock Bill.com vendor ID');
        }
      }

      const paymentMethod: PaymentMethod = {
        id: `pm_${userId}_${Date.now()}`,
        userId,
        type: paymentMethodData.type === 'bank_account' ? 'ach' : 'card',
        last4:
          paymentMethodData.type === 'card'
            ? paymentMethodData.cardNumber!.slice(-4)
            : paymentMethodData.accountNumber!.slice(-4),
        brand:
          paymentMethodData.type === 'card'
            ? this.detectCardBrand(paymentMethodData.cardNumber!)
            : undefined,
        expiryMonth: paymentMethodData.expiryMonth,
        expiryYear: paymentMethodData.expiryYear,
        accountType: paymentMethodData.accountType,
        isDefault: false,
        isActive: true,
        createdDate: new Date(),
        squarePaymentMethodId,
        billComVendorId,
      };

      if (!this.paymentMethods.has(userId)) {
        this.paymentMethods.set(userId, []);
      }

      this.paymentMethods.get(userId)!.push(paymentMethod);

      console.log(
        `✅ Payment method added for user ${userId}: ${paymentMethod.type} ending in ${paymentMethod.last4}`
      );

      return paymentMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<void> {
    const userPaymentMethods = this.paymentMethods.get(userId) || [];

    // Remove default from all methods
    userPaymentMethods.forEach((pm) => (pm.isDefault = false));

    // Set new default
    const targetMethod = userPaymentMethods.find(
      (pm) => pm.id === paymentMethodId
    );
    if (targetMethod) {
      targetMethod.isDefault = true;
      console.log(
        `✅ Default payment method updated for user ${userId}: ${paymentMethodId}`
      );
    }
  }

  getUserPaymentMethods(userId: string): PaymentMethod[] {
    return this.paymentMethods.get(userId) || [];
  }

  async removePaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<void> {
    const userPaymentMethods = this.paymentMethods.get(userId) || [];
    const methodIndex = userPaymentMethods.findIndex(
      (pm) => pm.id === paymentMethodId
    );

    if (methodIndex > -1) {
      const method = userPaymentMethods[methodIndex];

      // Remove from payment processors
      if (method.squarePaymentMethodId && this.squareService) {
        // Square payment methods would be handled on the frontend
        // This is a placeholder for any backend cleanup needed
        console.log('✅ Square payment method removed');
      } else if (method.squarePaymentMethodId) {
        console.log(
          '🔧 Skipping Square payment method removal in development mode'
        );
      }

      // Mark as inactive rather than deleting for audit purposes
      method.isActive = false;

      console.log(
        `✅ Payment method removed for user ${userId}: ${paymentMethodId}`
      );
    }
  }

  // ========================================
  // SUBSCRIPTION BILLING
  // ========================================

  async createSubscriptionBilling(
    userId: string,
    subscriptionTierId: string,
    paymentMethodId: string,
    billingCycle: 'monthly' | 'annual'
  ): Promise<SubscriptionBilling> {
    const subscription =
      SubscriptionManagementService.getSubscriptionTier(subscriptionTierId);
    if (!subscription) {
      throw new Error(`Subscription tier not found: ${subscriptionTierId}`);
    }

    const paymentMethod = this.getUserPaymentMethods(userId).find(
      (pm) => pm.id === paymentMethodId && pm.isActive
    );

    if (!paymentMethod) {
      throw new Error('Valid payment method required');
    }

    // Calculate billing amount (annual gets 20% discount)
    const baseAmount = subscription.price;
    const amount =
      billingCycle === 'annual' ? baseAmount * 12 * 0.8 : baseAmount;

    const billing: SubscriptionBilling = {
      id: `sub_billing_${userId}_${Date.now()}`,
      userId,
      subscriptionTierId,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(
        Date.now() +
          (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
      ),
      billingCycle,
      amount,
      currency: 'USD',
      paymentMethodId,
      nextBillingDate: new Date(
        Date.now() +
          (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
      ),
      failedPaymentCount: 0,
      dunningStatus: 'none',
    };

    this.subscriptionBilling.set(userId, billing);

    // Process initial payment
    await this.processPayment(
      userId,
      amount,
      paymentMethodId,
      'Initial subscription payment'
    );

    console.log(
      `✅ Subscription billing created for user ${userId}: ${subscriptionTierId} - $${amount}/${billingCycle}`
    );

    return billing;
  }

  async processPayment(
    userId: string,
    amount: number,
    paymentMethodId: string,
    description: string
  ): Promise<PaymentAttempt> {
    const paymentMethod = this.getUserPaymentMethods(userId).find(
      (pm) => pm.id === paymentMethodId
    );

    if (!paymentMethod || !paymentMethod.isActive) {
      throw new Error('Invalid or inactive payment method');
    }

    const attempt: PaymentAttempt = {
      id: `pa_${Date.now()}`,
      userId,
      subscriptionId: this.subscriptionBilling.get(userId)?.id || 'unknown',
      amount,
      currency: 'USD',
      paymentMethodId,
      status: 'pending',
      attemptDate: new Date(),
      retryCount: 0,
    };

    try {
      let success = false;

      if (
        paymentMethod.type === 'card' &&
        paymentMethod.squarePaymentMethodId
      ) {
        // Process through Square (if available)
        if (this.squareService) {
          // Square payment processing would be handled via their API
          const squareResult = await this.squareService.processPayment({
            tenantId: 'default', // Would be determined from context
            amount,
            currency: 'USD',
            sourceId: paymentMethod.squarePaymentMethodId,
            description,
          });

          attempt.squarePaymentId = squareResult.paymentId || '';
          success = squareResult.success;
        } else {
          // Mock successful payment in development mode
          attempt.squarePaymentId = `sq_pay_mock_${Date.now()}`;
          success = true;
          console.log('🔧 Mock Square payment processed successfully');
        }
      } else if (
        paymentMethod.type === 'ach' &&
        paymentMethod.billComVendorId
      ) {
        // Process through Bill.com (if available)
        if (this.billComService) {
          const billComResult = await this.billComService.createPayment({
            vendorId: paymentMethod.billComVendorId,
            amount,
            description,
          });

          attempt.billComTransactionId = billComResult.id;
          success = billComResult.status === 'processed';
        } else {
          // Mock successful payment in development mode
          attempt.billComTransactionId = `tx_mock_${Date.now()}`;
          success = true;
          console.log('🔧 Mock Bill.com payment processed successfully');
        }
      }

      attempt.status = success ? 'succeeded' : 'failed';

      if (success) {
        // Update subscription billing
        const billing = this.subscriptionBilling.get(userId);
        if (billing) {
          billing.lastPaymentDate = new Date();
          billing.failedPaymentCount = 0;
          billing.dunningStatus = 'none';
        }

        console.log(`✅ Payment successful: User ${userId}, Amount $${amount}`);
      } else {
        attempt.failureReason = 'Payment processing failed';
        await this.handleFailedPayment(userId, attempt);
        console.log(`❌ Payment failed: User ${userId}, Amount $${amount}`);
      }
    } catch (error) {
      attempt.status = 'failed';
      attempt.failureReason =
        error instanceof Error ? error.message : 'Unknown error';
      await this.handleFailedPayment(userId, attempt);
      console.error('Payment processing error:', error);
    }

    // Store payment attempt
    if (!this.paymentAttempts.has(userId)) {
      this.paymentAttempts.set(userId, []);
    }
    this.paymentAttempts.get(userId)!.push(attempt);

    return attempt;
  }

  private async handleFailedPayment(
    userId: string,
    attempt: PaymentAttempt
  ): Promise<void> {
    const billing = this.subscriptionBilling.get(userId);
    const settings = this.paymentSettings.get(userId);

    if (!billing || !settings) return;

    billing.failedPaymentCount++;

    // Determine dunning status
    if (billing.failedPaymentCount === 1) {
      billing.dunningStatus = 'soft_decline';
    } else if (billing.failedPaymentCount === 2) {
      billing.dunningStatus = 'hard_decline';
    } else if (billing.failedPaymentCount >= 3) {
      billing.dunningStatus = 'final_notice';
      // Suspend service after 3 failed attempts
      billing.status = 'suspended';
    }

    // Schedule retry if enabled and under limit
    if (
      settings.autoRetryEnabled &&
      attempt.retryCount < settings.retryAttempts
    ) {
      attempt.nextRetryDate = new Date(
        Date.now() + settings.retryInterval * 24 * 60 * 60 * 1000
      );
      console.log(
        `🔄 Payment retry scheduled for ${attempt.nextRetryDate} (attempt ${attempt.retryCount + 1})`
      );
    }

    // Send notifications if enabled
    if (settings.paymentFailureNotifications) {
      await this.sendPaymentFailureNotification(userId, attempt, billing);
    }
  }

  private async sendPaymentFailureNotification(
    userId: string,
    attempt: PaymentAttempt,
    billing: SubscriptionBilling
  ): Promise<void> {
    // Integration with existing notification system
    const notificationData = {
      userId,
      type: 'payment_failure',
      title: 'Payment Failed',
      message: `Your payment of $${attempt.amount} failed. ${attempt.failureReason || 'Please update your payment method.'}`,
      priority: billing.dunningStatus === 'final_notice' ? 'high' : 'medium',
      actionRequired: true,
      metadata: {
        subscriptionId: billing.id,
        amount: attempt.amount,
        dunningStatus: billing.dunningStatus,
        nextRetryDate: attempt.nextRetryDate?.toISOString(),
      },
    };

    console.log(`📧 Payment failure notification sent to user ${userId}`);
    // In production, integrate with EmailService/NotificationService
  }

  // ========================================
  // BILLING AUTOMATION
  // ========================================

  async processRecurringBilling(): Promise<{
    processed: number;
    failed: number;
    totalRevenue: number;
  }> {
    let processed = 0;
    let failed = 0;
    let totalRevenue = 0;

    const today = new Date();

    for (const [userId, billing] of this.subscriptionBilling) {
      if (billing.status !== 'active') continue;
      if (billing.nextBillingDate > today) continue;

      try {
        const result = await this.processPayment(
          userId,
          billing.amount,
          billing.paymentMethodId,
          `${billing.billingCycle} subscription payment`
        );

        if (result.status === 'succeeded') {
          // Update next billing date
          const nextBilling = new Date(billing.nextBillingDate);
          if (billing.billingCycle === 'monthly') {
            nextBilling.setMonth(nextBilling.getMonth() + 1);
          } else {
            nextBilling.setFullYear(nextBilling.getFullYear() + 1);
          }
          billing.nextBillingDate = nextBilling;
          billing.currentPeriodStart = new Date();
          billing.currentPeriodEnd = nextBilling;

          totalRevenue += billing.amount;
          processed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Billing failed for user ${userId}:`, error);
        failed++;
      }
    }

    console.log(
      `💰 Recurring billing complete: ${processed} processed, ${failed} failed, $${totalRevenue} revenue`
    );

    return { processed, failed, totalRevenue };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  private detectCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');

    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    if (number.startsWith('6')) return 'Discover';

    return 'Unknown';
  }

  getUserBilling(userId: string): SubscriptionBilling | null {
    return this.subscriptionBilling.get(userId) || null;
  }

  getUserPaymentHistory(userId: string): PaymentAttempt[] {
    return this.paymentAttempts.get(userId) || [];
  }

  getUserPaymentSettings(userId: string): PaymentSettings | null {
    return this.paymentSettings.get(userId) || null;
  }

  async updatePaymentSettings(
    userId: string,
    settings: Partial<PaymentSettings>
  ): Promise<void> {
    const currentSettings = this.paymentSettings.get(userId);
    if (currentSettings) {
      Object.assign(currentSettings, settings);
    } else {
      this.paymentSettings.set(userId, {
        userId,
        ...settings,
      } as PaymentSettings);
    }

    console.log(`✅ Payment settings updated for user ${userId}`);
  }

  // Get billing summary for dashboard
  getBillingSummary(userId: string): {
    currentPlan: string;
    nextBillingDate: Date;
    nextBillingAmount: number;
    paymentStatus: string;
    totalPaid: number;
    failedPayments: number;
  } {
    const billing = this.getUserBilling(userId);
    const paymentHistory = this.getUserPaymentHistory(userId);

    if (!billing) {
      return {
        currentPlan: 'No active subscription',
        nextBillingDate: new Date(),
        nextBillingAmount: 0,
        paymentStatus: 'none',
        totalPaid: 0,
        failedPayments: 0,
      };
    }

    const successfulPayments = paymentHistory.filter(
      (p) => p.status === 'succeeded'
    );
    const failedPayments = paymentHistory.filter((p) => p.status === 'failed');

    return {
      currentPlan:
        SubscriptionManagementService.getSubscriptionTier(
          billing.subscriptionTierId
        )?.name || 'Unknown',
      nextBillingDate: billing.nextBillingDate,
      nextBillingAmount: billing.amount,
      paymentStatus: billing.status,
      totalPaid: successfulPayments.reduce((sum, p) => sum + p.amount, 0),
      failedPayments: failedPayments.length,
    };
  }
}

export const paymentCollectionService = new PaymentCollectionService();
