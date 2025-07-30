// Dispatch Configuration
// Manages dispatch fee settings and business rules

export interface DispatchConfig {
  defaultFeePercentage: number;
  minimumFeePercentage: number;
  maximumFeePercentage: number;
  managementOverrideEnabled: boolean;
  feeCalculationRules: {
    standard: number;
    expedited: number;
    hazmat: number;
    oversize: number;
    team: number;
  };
}

// Default dispatch fee configuration
export const DISPATCH_CONFIG: DispatchConfig = {
  // All dispatch fees are set to 10% unless overwritten by management
  defaultFeePercentage: 10.0,
  minimumFeePercentage: 5.0,
  maximumFeePercentage: 15.0,
  managementOverrideEnabled: true,
  
  // Special rate modifiers for different load types
  feeCalculationRules: {
    standard: 10.0,          // Standard loads
    expedited: 12.0,         // Expedited/hot loads
    hazmat: 11.0,            // Hazmat loads
    oversize: 11.5,          // Oversize/overweight
    team: 10.5               // Team driver loads
  }
};

// Fee calculation function
export const calculateDispatchFee = (
  loadAmount: number, 
  loadType: 'standard' | 'expedited' | 'hazmat' | 'oversize' | 'team' = 'standard',
  managementOverride?: number
): { feePercentage: number; dispatchFee: number } => {
  let feePercentage: number;
  
  // Check for management override first
  if (managementOverride !== undefined && DISPATCH_CONFIG.managementOverrideEnabled) {
    feePercentage = Math.max(
      DISPATCH_CONFIG.minimumFeePercentage,
      Math.min(DISPATCH_CONFIG.maximumFeePercentage, managementOverride)
    );
  } else {
    // Use default rates based on load type
    feePercentage = DISPATCH_CONFIG.feeCalculationRules[loadType] || DISPATCH_CONFIG.defaultFeePercentage;
  }
  
  const dispatchFee = (loadAmount * feePercentage) / 100;
  
  return {
    feePercentage,
    dispatchFee
  };
};

// Get default fee percentage
export const getDefaultFeePercentage = (): number => {
  return DISPATCH_CONFIG.defaultFeePercentage;
};

// Validate fee percentage (for management overrides)
export const validateFeePercentage = (percentage: number): boolean => {
  return percentage >= DISPATCH_CONFIG.minimumFeePercentage && 
         percentage <= DISPATCH_CONFIG.maximumFeePercentage;
};

// Get fee percentage display text
export const getFeeDisplayText = (
  loadType: 'standard' | 'expedited' | 'hazmat' | 'oversize' | 'team' = 'standard',
  managementOverride?: number
): string => {
  const { feePercentage } = calculateDispatchFee(0, loadType, managementOverride);
  
  if (managementOverride !== undefined) {
    return `${feePercentage}% (Management Override)`;
  }
  
  return `${feePercentage}% (${loadType === 'standard' ? 'Standard Rate' : loadType.charAt(0).toUpperCase() + loadType.slice(1) + ' Rate'})`;
};
