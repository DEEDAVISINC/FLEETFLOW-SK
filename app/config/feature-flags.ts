// Feature Flags Configuration
// Controls gradual rollout of new features

export interface FeatureFlags {
  // Market Intelligence Features
  COMPETITOR_INTELLIGENCE: boolean;
  CUSTOMER_RETENTION_ANALYSIS: boolean;
  ECONOMIC_IMPACT_ASSESSMENT: boolean;
  INDUSTRY_TREND_ANALYSIS: boolean;

  // Pricing Enhancements
  SPOT_RATE_OPTIMIZATION: boolean;
  VOLUME_DISCOUNT_STRUCTURE: boolean;
  EMERGENCY_LOAD_PRICING: boolean;

  // Specialized Routing
  PERMIT_ROUTE_PLANNING: boolean;
  HAZMAT_ROUTE_COMPLIANCE: boolean;
  SEASONAL_LOAD_PLANNING: boolean;
  CROSS_DOCKING_OPTIMIZATION: boolean;

  // Business Intelligence
  NEW_MARKET_ENTRY: boolean;
  ACQUISITION_TARGET_ANALYSIS: boolean;
  CUSTOMER_REFERRAL_PROGRAM: boolean;
  DIGITAL_MARKETING_STRATEGY: boolean;

  // Risk Management
  CYBER_SECURITY_PROTOCOL: boolean;
  FORCE_MAJEURE_PLANNING: boolean;
  REGULATORY_RISK_ASSESSMENT: boolean;

  // Communication Enhancements
  CARRIER_FEEDBACK_SYSTEM: boolean;
  CUSTOMER_NEWSLETTER: boolean;

  // Operational Efficiency
  VENDOR_MANAGEMENT: boolean;
  COST_REDUCTION_INITIATIVES: boolean;

  // Advanced Business Intelligence
  SMART_TASK_PRIORITIZATION: boolean;
}

// Default feature flags (all disabled initially)
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Market Intelligence Features
  COMPETITOR_INTELLIGENCE: false,
  CUSTOMER_RETENTION_ANALYSIS: false,
  ECONOMIC_IMPACT_ASSESSMENT: false,
  INDUSTRY_TREND_ANALYSIS: false,

  // Pricing Enhancements
  SPOT_RATE_OPTIMIZATION: false,
  VOLUME_DISCOUNT_STRUCTURE: false,
  EMERGENCY_LOAD_PRICING: false,

  // Specialized Routing
  PERMIT_ROUTE_PLANNING: false,
  HAZMAT_ROUTE_COMPLIANCE: false,
  SEASONAL_LOAD_PLANNING: false,
  CROSS_DOCKING_OPTIMIZATION: false,

  // Business Intelligence
  NEW_MARKET_ENTRY: false,
  ACQUISITION_TARGET_ANALYSIS: false,
  CUSTOMER_REFERRAL_PROGRAM: false,
  DIGITAL_MARKETING_STRATEGY: false,

  // Risk Management
  CYBER_SECURITY_PROTOCOL: false,
  FORCE_MAJEURE_PLANNING: false,
  REGULATORY_RISK_ASSESSMENT: false,

  // Communication Enhancements
  CARRIER_FEEDBACK_SYSTEM: false,
  CUSTOMER_NEWSLETTER: false,

  // Operational Efficiency
  VENDOR_MANAGEMENT: false,
  COST_REDUCTION_INITIATIVES: false,

  // Advanced Business Intelligence
  SMART_TASK_PRIORITIZATION: true,
};

// Get feature flags from environment variables
export function getFeatureFlags(): FeatureFlags {
  const flags = { ...DEFAULT_FEATURE_FLAGS };

  // Override with environment variables
  Object.keys(flags).forEach((key) => {
    const envKey = `ENABLE_${key}`;
    if (process.env[envKey] !== undefined) {
      flags[key as keyof FeatureFlags] = process.env[envKey] === 'true';
    }
  });

  return flags;
}

// Feature flag utility functions
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

export function getEnabledFeatures(): string[] {
  const flags = getFeatureFlags();
  return Object.entries(flags)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
}

// Feature flag hook for React components
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  // In a real implementation, this would use React context
  // For now, return the environment-based value
  return isFeatureEnabled(feature);
}
