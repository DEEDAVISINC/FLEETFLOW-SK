import {
  ORGANIZATION_SUBSCRIPTION_PLANS,
  SubscriptionPlanId,
  calculateSubscriptionCost,
  getSubscriptionPlan,
} from '../config/subscriptionPlans';
import { organizationService } from './OrganizationService';
import { squareService } from './SquareService';

export interface SubscriptionCreationParams {
  organizationId: string;
  planId: SubscriptionPlanId;
  totalSeats: number;
  customerDetails: {
    email: string;
    name: string;
    companyName: string;
    phone?: string;
    address?: {
      addressLine1: string;
      locality: string; // City
      administrativeDistrictLevel1: string; // State
      postalCode: string;
      country: string;
    };
  };
}

export interface SubscriptionUpdateParams {
  organizationId: string;
  newTotalSeats: number;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  invoiceId?: string;
  error?: string;
}

export interface UpdateResult {
  success: boolean;
  newPrice: number;
  newTotalSeats: number;
  invoiceId?: string;
  error?: string;
}

export class OrganizationSubscriptionService {
  /**
   * Create a new organization subscription with Square integration
   */
  async createOrganizationSubscription(
    params: SubscriptionCreationParams
  ): Promise<SubscriptionResult> {
    try {
      const { organizationId, planId, totalSeats, customerDetails } = params;

      // Validate plan exists
      if (!ORGANIZATION_SUBSCRIPTION_PLANS[planId]) {
        return {
          success: false,
          error: 'Invalid subscription plan',
        };
      }

      // Check if organization exists
      const organization =
        await organizationService.getOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
        };
      }

      // Calculate subscription cost
      const price = calculateSubscriptionCost(planId, totalSeats);

      // Create customer in Square
      const customerResult = await squareService.createCustomer({
        givenName: customerDetails.name.split(' ')[0],
        familyName: customerDetails.name.split(' ').slice(1).join(' '),
        companyName: customerDetails.companyName,
        emailAddress: customerDetails.email,
        phoneNumber: customerDetails.phone,
        address: customerDetails.address,
        referenceId: organizationId,
      });

      if (!customerResult.success) {
        console.error('Square customer creation failed:', customerResult.error);
        return {
          success: false,
          error: customerResult.error || 'Failed to create customer in Square',
        };
      }

      const squareCustomerId = customerResult.customerId;

      // Create subscription invoice in Square
      const invoiceResult = await squareService.createFleetFlowInvoice({
        customerId: squareCustomerId,
        invoiceTitle: `${ORGANIZATION_SUBSCRIPTION_PLANS[planId].name} Subscription`,
        description: `${ORGANIZATION_SUBSCRIPTION_PLANS[planId].name} - ${totalSeats} seats - Monthly subscription`,
        lineItems: [
          {
            name: `${ORGANIZATION_SUBSCRIPTION_PLANS[planId].name} Base Plan`,
            quantity: 1,
            rate: ORGANIZATION_SUBSCRIPTION_PLANS[planId].basePrice,
            amount: ORGANIZATION_SUBSCRIPTION_PLANS[planId].basePrice,
          },
          ...(totalSeats > ORGANIZATION_SUBSCRIPTION_PLANS[planId].includedSeats
            ? [
                {
                  name: 'Additional Seats',
                  quantity:
                    totalSeats -
                    ORGANIZATION_SUBSCRIPTION_PLANS[planId].includedSeats,
                  rate: ORGANIZATION_SUBSCRIPTION_PLANS[planId]
                    .additionalSeatPrice,
                  amount:
                    (totalSeats -
                      ORGANIZATION_SUBSCRIPTION_PLANS[planId].includedSeats) *
                    ORGANIZATION_SUBSCRIPTION_PLANS[planId].additionalSeatPrice,
                },
              ]
            : []),
        ],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 7 days from now
        customFields: [
          { label: 'Organization ID', value: organizationId },
          {
            label: 'Plan',
            value: ORGANIZATION_SUBSCRIPTION_PLANS[planId].name,
          },
          { label: 'Total Seats', value: totalSeats.toString() },
        ],
      });

      if (!invoiceResult.success) {
        console.error('Square invoice creation failed:', invoiceResult.error);
        return {
          success: false,
          error: invoiceResult.error || 'Failed to create subscription invoice',
        };
      }

      // Update organization with subscription details
      const updateResult =
        await organizationService.updateOrganizationSubscription(
          organizationId,
          {
            plan: planId,
            seats: {
              total: totalSeats,
              used: 1, // Owner account
              available: totalSeats - 1,
            },
            billingCycle: 'monthly',
            price,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          }
        );

      if (!updateResult) {
        console.error('Organization update failed');
        return {
          success: false,
          error: 'Failed to update organization subscription details',
        };
      }

      // Update organization billing info
      await organizationService.updateOrganization(organizationId, {
        billing: {
          ...organization.billing,
          squareCustomerId,
        },
      });

      console.log(
        `Subscription created successfully for organization ${organizationId}`
      );

      return {
        success: true,
        subscriptionId: invoiceResult.invoiceId,
        invoiceId: invoiceResult.invoiceId,
      };
    } catch (error) {
      console.error('Error creating organization subscription:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update organization subscription seats
   */
  async updateOrganizationSeats(
    params: SubscriptionUpdateParams
  ): Promise<UpdateResult> {
    try {
      const { organizationId, newTotalSeats } = params;

      // Get current organization
      const organization =
        await organizationService.getOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
        };
      }

      const currentUsedSeats = organization.subscription.seats.used;

      // Check if reducing seats below current usage
      if (newTotalSeats < currentUsedSeats) {
        return {
          success: false,
          error: `Cannot reduce seats below current usage (${currentUsedSeats} seats in use)`,
        };
      }

      // Calculate new price
      const newPrice = calculateSubscriptionCost(
        organization.subscription.plan as SubscriptionPlanId,
        newTotalSeats
      );

      // Create updated subscription invoice in Square
      const invoiceResult = await squareService.createFleetFlowInvoice({
        customerId: organization.billing.squareCustomerId,
        invoiceTitle: `Updated Subscription - ${
          ORGANIZATION_SUBSCRIPTION_PLANS[
            organization.subscription.plan as SubscriptionPlanId
          ].name
        }`,
        description: `Updated subscription with ${newTotalSeats} total seats`,
        lineItems: [
          {
            name: `${
              ORGANIZATION_SUBSCRIPTION_PLANS[
                organization.subscription.plan as SubscriptionPlanId
              ].name
            } Base Plan`,
            quantity: 1,
            rate: ORGANIZATION_SUBSCRIPTION_PLANS[
              organization.subscription.plan as SubscriptionPlanId
            ].basePrice,
            amount:
              ORGANIZATION_SUBSCRIPTION_PLANS[
                organization.subscription.plan as SubscriptionPlanId
              ].basePrice,
          },
          ...(newTotalSeats >
          ORGANIZATION_SUBSCRIPTION_PLANS[
            organization.subscription.plan as SubscriptionPlanId
          ].includedSeats
            ? [
                {
                  name: 'Additional Seats',
                  quantity:
                    newTotalSeats -
                    ORGANIZATION_SUBSCRIPTION_PLANS[
                      organization.subscription.plan as SubscriptionPlanId
                    ].includedSeats,
                  rate: ORGANIZATION_SUBSCRIPTION_PLANS[
                    organization.subscription.plan as SubscriptionPlanId
                  ].additionalSeatPrice,
                  amount:
                    (newTotalSeats -
                      ORGANIZATION_SUBSCRIPTION_PLANS[
                        organization.subscription.plan as SubscriptionPlanId
                      ].includedSeats) *
                    ORGANIZATION_SUBSCRIPTION_PLANS[
                      organization.subscription.plan as SubscriptionPlanId
                    ].additionalSeatPrice,
                },
              ]
            : []),
        ],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        customFields: [
          { label: 'Organization ID', value: organizationId },
          { label: 'Updated Seats', value: newTotalSeats.toString() },
        ],
      });

      if (!invoiceResult.success) {
        console.error('Square invoice update failed:', invoiceResult.error);
        return {
          success: false,
          error: invoiceResult.error || 'Failed to update subscription invoice',
        };
      }

      // Update organization subscription details
      const updateResult =
        await organizationService.updateOrganizationSubscription(
          organizationId,
          {
            seats: {
              total: newTotalSeats,
              used: currentUsedSeats,
              available: newTotalSeats - currentUsedSeats,
            },
            price: newPrice,
          }
        );

      if (!updateResult) {
        console.error('Organization subscription update failed');
        return {
          success: false,
          error: 'Failed to update organization subscription details',
        };
      }

      console.log(
        `Subscription updated successfully for organization ${organizationId}: ${newTotalSeats} seats`
      );

      return {
        success: true,
        newPrice,
        newTotalSeats,
        invoiceId: invoiceResult.invoiceId,
      };
    } catch (error) {
      console.error('Error updating organization seats:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Cancel organization subscription
   */
  async cancelOrganizationSubscription(
    organizationId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const organization =
        await organizationService.getOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
        };
      }

      // Note: Square doesn't have a direct "cancel subscription" API
      // We would typically create a final invoice and mark the subscription as cancelled
      // For now, we'll just update the organization status

      const updateResult =
        await organizationService.updateOrganizationSubscription(
          organizationId,
          {
            seats: {
              total: organization.subscription.seats.total,
              used: organization.subscription.seats.used,
              available: 0, // Mark as cancelled
            },
          }
        );

      if (!updateResult) {
        return {
          success: false,
          error: 'Failed to cancel subscription',
        };
      }

      console.log(`Subscription cancelled for organization ${organizationId}`);
      return { success: true };
    } catch (error) {
      console.error('Error cancelling organization subscription:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get subscription details for an organization
   */
  async getOrganizationSubscription(organizationId: string): Promise<{
    success: boolean;
    subscription?: {
      plan: any;
      seats: {
        total: number;
        used: number;
        available: number;
      };
      price: number;
      billingCycle: string;
      nextBillingDate: Date;
    };
    error?: string;
  }> {
    try {
      const organization =
        await organizationService.getOrganization(organizationId);
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found',
        };
      }

      const plan = getSubscriptionPlan(
        organization.subscription.plan as SubscriptionPlanId
      );

      return {
        success: true,
        subscription: {
          plan,
          seats: organization.subscription.seats,
          price: organization.subscription.price,
          billingCycle: organization.subscription.billingCycle,
          nextBillingDate: new Date(organization.subscription.nextBillingDate),
        },
      };
    } catch (error) {
      console.error('Error getting organization subscription:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Process recurring billing for all organizations
   */
  async processRecurringBilling(): Promise<{
    processed: number;
    failed: number;
    errors: string[];
  }> {
    try {
      // This would typically be called by a cron job
      // For now, we'll return a placeholder response
      console.log('Processing recurring billing...');

      // In a real implementation, you would:
      // 1. Find all organizations with subscriptions due for renewal
      // 2. Create new invoices in Square for each
      // 3. Update next billing dates
      // 4. Send notifications

      return {
        processed: 0,
        failed: 0,
        errors: ['Recurring billing processing not yet implemented'],
      };
    } catch (error) {
      console.error('Error processing recurring billing:', error);
      return {
        processed: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Calculate prorated amount for mid-cycle seat changes
   */
  calculateProratedAmount(
    currentPlan: SubscriptionPlanId,
    newTotalSeats: number,
    daysRemaining: number,
    totalDaysInCycle: number = 30
  ): number {
    const newPrice = calculateSubscriptionCost(currentPlan, newTotalSeats);
    const currentPrice = calculateSubscriptionCost(
      currentPlan,
      ORGANIZATION_SUBSCRIPTION_PLANS[currentPlan].includedSeats
    );

    const dailyRate = currentPrice / totalDaysInCycle;
    const proratedDifference =
      (newPrice - currentPrice) * (daysRemaining / totalDaysInCycle);

    return Math.max(0, proratedDifference);
  }
}

// Export singleton instance
export const organizationSubscriptionService =
  new OrganizationSubscriptionService();


