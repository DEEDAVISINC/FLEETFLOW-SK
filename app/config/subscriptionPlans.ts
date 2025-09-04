export const ORGANIZATION_SUBSCRIPTION_PLANS = {
  BROKERAGE_STARTER: {
    id: 'brokerage_starter',
    name: 'Brokerage Starter',
    basePrice: 199,
    includedSeats: 2,
    additionalSeatPrice: 49,
    features: [
      'Core brokerage tools',
      'Load management',
      'Basic carrier database',
      'Standard reporting',
    ],
  },
  BROKERAGE_PROFESSIONAL: {
    id: 'brokerage_professional',
    name: 'Brokerage Professional',
    basePrice: 499,
    includedSeats: 5,
    additionalSeatPrice: 39,
    features: [
      'Advanced brokerage tools',
      'Unlimited loads',
      'Enhanced carrier management',
      'Advanced analytics',
      'API access',
    ],
  },
  DISPATCH_STARTER: {
    id: 'dispatch_starter',
    name: 'Dispatch Starter',
    basePrice: 149,
    includedSeats: 2,
    additionalSeatPrice: 39,
    features: [
      'Core dispatch tools',
      'Driver management',
      'Load tracking',
      'Basic reporting',
    ],
  },
  DISPATCH_PROFESSIONAL: {
    id: 'dispatch_professional',
    name: 'Dispatch Professional',
    basePrice: 349,
    includedSeats: 5,
    additionalSeatPrice: 29,
    features: [
      'Advanced dispatch tools',
      'Unlimited drivers',
      'Real-time tracking',
      'Advanced analytics',
      'API access',
    ],
  },
  CARRIER_STARTER: {
    id: 'carrier_starter',
    name: 'Carrier Starter',
    basePrice: 99,
    includedSeats: 1,
    additionalSeatPrice: 29,
    features: [
      'Basic carrier tools',
      'Load bidding',
      'Trip management',
      'Basic reporting',
    ],
  },
  CARRIER_PROFESSIONAL: {
    id: 'carrier_professional',
    name: 'Carrier Professional',
    basePrice: 249,
    includedSeats: 3,
    additionalSeatPrice: 19,
    features: [
      'Advanced carrier tools',
      'Load matching',
      'ELD integration',
      'Advanced reporting',
      'API access',
    ],
  },
  SHIPPER_STARTER: {
    id: 'shipper_starter',
    name: 'Shipper Starter',
    basePrice: 79,
    includedSeats: 1,
    additionalSeatPrice: 25,
    features: [
      'Basic shipper tools',
      'Load posting',
      'Quote management',
      'Basic tracking',
    ],
  },
  SHIPPER_PROFESSIONAL: {
    id: 'shipper_professional',
    name: 'Shipper Professional',
    basePrice: 199,
    includedSeats: 3,
    additionalSeatPrice: 15,
    features: [
      'Advanced shipper tools',
      'Bulk load posting',
      'Advanced analytics',
      'Dedicated support',
      'API access',
    ],
  },
};

export type SubscriptionPlanId = keyof typeof ORGANIZATION_SUBSCRIPTION_PLANS;
export type SubscriptionPlan =
  (typeof ORGANIZATION_SUBSCRIPTION_PLANS)[SubscriptionPlanId];

// Helper function to calculate subscription cost
export function calculateSubscriptionCost(
  planId: SubscriptionPlanId,
  totalSeats: number
): number {
  const plan = ORGANIZATION_SUBSCRIPTION_PLANS[planId];
  if (!plan) throw new Error('Invalid plan ID');

  const extraSeats = Math.max(0, totalSeats - plan.includedSeats);
  const totalCost = plan.basePrice + extraSeats * plan.additionalSeatPrice;

  return totalCost;
}

// Helper function to get plan by ID
export function getSubscriptionPlan(
  planId: SubscriptionPlanId
): SubscriptionPlan {
  const plan = ORGANIZATION_SUBSCRIPTION_PLANS[planId];
  if (!plan) throw new Error('Invalid plan ID');
  return plan;
}

// Helper function to get all plans for a specific organization type
export function getPlansForType(
  type: 'brokerage' | 'dispatch_agency' | 'carrier' | 'shipper'
): SubscriptionPlan[] {
  return Object.values(ORGANIZATION_SUBSCRIPTION_PLANS).filter((plan) =>
    plan.id.toLowerCase().includes(type)
  );
}

// Helper function to get default plan for organization type
export function getDefaultPlanForType(
  type: 'brokerage' | 'dispatch_agency' | 'carrier' | 'shipper'
): SubscriptionPlanId {
  const typeMap = {
    brokerage: 'BROKERAGE_STARTER' as SubscriptionPlanId,
    dispatch_agency: 'DISPATCH_STARTER' as SubscriptionPlanId,
    carrier: 'CARRIER_STARTER' as SubscriptionPlanId,
    shipper: 'SHIPPER_STARTER' as SubscriptionPlanId,
  };
  return typeMap[type];
}


