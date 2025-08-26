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
    marketplace: number; // Go with the Flow/Marketplace loads
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
    standard: 10.0, // Standard loads
    expedited: 12.0, // Expedited/hot loads
    hazmat: 11.0, // Hazmat loads
    oversize: 11.5, // Oversize/overweight
    team: 10.5, // Team driver loads
    marketplace: 5.0, // Go with the Flow/Marketplace loads (reduced fee)
  },
};

// Fee calculation function
export const calculateDispatchFee = (
  loadAmount: number,
  loadType:
    | 'standard'
    | 'expedited'
    | 'hazmat'
    | 'oversize'
    | 'team'
    | 'marketplace' = 'standard',
  managementOverride?: number
): { feePercentage: number; dispatchFee: number } => {
  let feePercentage: number;

  // Check for management override first
  if (
    managementOverride !== undefined &&
    DISPATCH_CONFIG.managementOverrideEnabled
  ) {
    feePercentage = Math.max(
      DISPATCH_CONFIG.minimumFeePercentage,
      Math.min(DISPATCH_CONFIG.maximumFeePercentage, managementOverride)
    );
  } else {
    // Use default rates based on load type
    feePercentage =
      DISPATCH_CONFIG.feeCalculationRules[loadType] ||
      DISPATCH_CONFIG.defaultFeePercentage;
  }

  const dispatchFee = (loadAmount * feePercentage) / 100;

  return {
    feePercentage,
    dispatchFee,
  };
};

// Get default fee percentage
export const getDefaultFeePercentage = (): number => {
  return DISPATCH_CONFIG.defaultFeePercentage;
};

// Validate fee percentage (for management overrides)
export const validateFeePercentage = (percentage: number): boolean => {
  return (
    percentage >= DISPATCH_CONFIG.minimumFeePercentage &&
    percentage <= DISPATCH_CONFIG.maximumFeePercentage
  );
};

// Get fee percentage display text
export const getFeeDisplayText = (
  loadType:
    | 'standard'
    | 'expedited'
    | 'hazmat'
    | 'oversize'
    | 'team'
    | 'marketplace' = 'standard',
  managementOverride?: number
): string => {
  const { feePercentage } = calculateDispatchFee(
    0,
    loadType,
    managementOverride
  );

  if (managementOverride !== undefined) {
    return `${feePercentage}% (Management Override)`;
  }

  const displayText =
    loadType === 'standard'
      ? 'Standard Rate'
      : loadType === 'marketplace'
        ? 'Go with the Flow/Marketplace Rate'
        : loadType.charAt(0).toUpperCase() + loadType.slice(1) + ' Rate';
  return `${feePercentage}% (${displayText})`;
};

// Helper function to determine load type based on source
export const getLoadTypeFromSource = (
  loadSource?: string
): 'standard' | 'marketplace' => {
  if (
    loadSource &&
    (loadSource.includes('marketplace') ||
      loadSource.includes('go-with-the-flow') ||
      loadSource.includes('marketplace-network') ||
      loadSource.startsWith('MKT-'))
  ) {
    return 'marketplace';
  }
  return 'standard';
};

// Calculate fee for marketplace/Go with the Flow loads
export const calculateMarketplaceFee = (
  loadAmount: number
): { feePercentage: number; dispatchFee: number } => {
  return calculateDispatchFee(loadAmount, 'marketplace');
};

// Calculate fee for standard loads
export const calculateStandardFee = (
  loadAmount: number
): { feePercentage: number; dispatchFee: number } => {
  return calculateDispatchFee(loadAmount, 'standard');
};
