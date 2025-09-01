'use client';

interface CarrierTier {
  tier: string;
  driverRange: string;
  dispatchFee: string;
  monthlyRevenue: string;
  targetCarriers: number;
  serviceLevel: string;
  benefits: string[];
  requirements: string[];
}

export const carrierTierStructure: CarrierTier[] = [
  {
    tier: 'Bronze',
    driverRange: '1-3 Drivers',
    dispatchFee: '10% of load fees',
    monthlyRevenue: '$3,000',
    targetCarriers: 40,
    serviceLevel: 'Essential Dispatch',
    benefits: [
      'Load matching and booking',
      'Basic load tracking',
      'Payment processing assistance',
      '24/7 dispatch support',
      'Monthly performance reports',
      'Fuel surcharge administration',
    ],
    requirements: [
      'Active DOT authority',
      'Valid insurance coverage',
      'Clean safety rating',
      'Willingness to accept dispatched loads',
    ],
  },
  {
    tier: 'Silver',
    driverRange: '4-10 Drivers',
    dispatchFee: '9% of load fees',
    monthlyRevenue: '$7,200',
    targetCarriers: 25,
    serviceLevel: 'Professional Dispatch',
    benefits: [
      'All Bronze benefits',
      'Dedicated dispatch coordinator',
      'Advanced load optimization',
      'Real-time GPS tracking',
      'Weekly strategy calls',
      'Marketing support materials',
      'Priority load assignments',
      'Consolidated invoicing',
    ],
    requirements: [
      'All Bronze requirements',
      'Consistent load acceptance rate (>80%)',
      'Positive carrier feedback',
      'Technology integration capability',
    ],
  },
  {
    tier: 'Gold',
    driverRange: '11-25 Drivers',
    dispatchFee: '8% of load fees',
    monthlyRevenue: '$12,000',
    targetCarriers: 12,
    serviceLevel: 'Enterprise Dispatch',
    benefits: [
      'All Silver benefits',
      'Dedicated account management team',
      'Advanced analytics dashboard',
      'Custom reporting solutions',
      'Strategic planning sessions',
      'Co-marketing opportunities',
      'Preferred load access',
      'Technology integration support',
      'Fleet optimization consulting',
    ],
    requirements: [
      'All Silver requirements',
      'Minimum 6-month partnership',
      'Technology integration completed',
      'Fleet management system in place',
      'Consistent performance metrics',
    ],
  },
  {
    tier: 'Platinum',
    driverRange: '26+ Drivers',
    dispatchFee: '6% of load fees',
    monthlyRevenue: '$15,000+',
    targetCarriers: 3,
    serviceLevel: 'Strategic Partnership',
    benefits: [
      'All Gold benefits',
      'Executive-level relationship management',
      'Custom technology solutions',
      'Dedicated development team',
      'Strategic growth planning',
      'Joint business development',
      'Exclusive load opportunities',
      'Revenue share opportunities',
      'First access to new services',
    ],
    requirements: [
      'All Gold requirements',
      'Minimum 12-month partnership',
      'Advanced technology integration',
      'Strategic partnership agreement',
      'Joint business planning commitment',
    ],
  },
];

export const tierUpgradePath = {
  bronzeToSilver: {
    requirements: '3 months consistent performance, 80%+ load acceptance',
    incentives: 'Reduced fee trial (9% for first month), priority support',
  },
  silverToGold: {
    requirements: '6 months partnership, technology integration completed',
    incentives:
      'Fee reduction (11% for first 3 months), dedicated account manager',
  },
  goldToPlatinum: {
    requirements: '12 months partnership, strategic partnership agreement',
    incentives: 'Fee reduction (13% for first 6 months), executive sponsorship',
  },
};

export const revenueProjections = {
  totalTierRevenue: {
    bronze: 120000, // 40 carriers × $3,000 (10% fee)
    silver: 180000, // 25 carriers × $7,200 (9% fee)
    gold: 144000, // 12 carriers × $12,000 (8% fee)
    platinum: 45000, // 3 carriers × $15,000 (6% fee)
    total: 489000, // $489K annual revenue
  },
  monthlyRevenue: 40750, // $489K ÷ 12 months
  growthPotential: {
    year1: 489000,
    year2: 978000, // 2x growth with network expansion
    year3: 1956000, // 4x growth with scale
  },
};
