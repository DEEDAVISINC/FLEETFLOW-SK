// INTELLIGENT PRICING SCHEDULE GENERATOR
// Generates role-specific, professional pricing schedules for bid responses
// MULTI-TENANT: Adapts pricing structure based on user's role and capabilities

export interface PricingRequirement {
  serviceType: string; // 'transportation', 'warehousing', 'handling', etc.
  equipmentType?: string; // 'dump_truck', 'flatbed', 'dry_van', etc.
  volume?: number; // Daily/weekly/monthly loads
  distance?: string; // 'local', 'regional', 'long_haul'
  duration?: string; // 'spot', 'contract', 'annual'
  specialRequirements?: string[];
}

export interface PricingLineItem {
  lineNumber: number;
  description: string;
  unit: string; // 'per load', 'per mile', 'per hour', 'per month'
  unitPrice?: string; // '$XXX.XX' or '[TO BE INSERTED]'
  estimatedQuantity?: string;
  totalPrice?: string;
  notes?: string;
}

export interface PricingSchedule {
  pricingStructure: 'per_load' | 'per_mile' | 'hourly' | 'monthly' | 'hybrid';
  lineItems: PricingLineItem[];
  subtotal?: string;
  fuelSurcharge?: string;
  totalBidAmount?: string;
  pricingNotes: string[];
  alternativePricingOptions?: {
    optionName: string;
    description: string;
    pricing: string;
  }[];
  validityPeriod: string;
  paymentTerms: string;
}

export interface UserOrganizationProfile {
  companyName: string;
  companyType: 'freight_broker' | 'asset_carrier' | '3pl' | 'shipper' | 'other';
  mcNumber?: string;
  dotNumber?: string;
  certifications: string[];
  fleetSize?: number;
  equipmentTypes?: string[];
  serviceAreas?: string[];
}

/**
 * MAIN FUNCTION: Generate intelligent pricing schedule
 */
export function generatePricingSchedule(
  requirements: string[],
  userProfile: UserOrganizationProfile
): PricingSchedule {
  // Analyze requirements to extract pricing-relevant information
  const pricingReqs = analyzePricingRequirements(requirements);

  // Determine appropriate pricing structure
  const pricingStructure = determinePricingStructure(pricingReqs, userProfile);

  // Generate line items based on role and requirements
  const lineItems = generateLineItems(pricingReqs, userProfile, pricingStructure);

  // Generate pricing notes and terms
  const pricingNotes = generatePricingNotes(userProfile, pricingReqs);

  // Generate alternative options if applicable
  const alternativePricingOptions = generateAlternativeOptions(
    pricingReqs,
    userProfile
  );

  return {
    pricingStructure,
    lineItems,
    subtotal: '[TO BE CALCULATED BASED ON ACTUAL REQUIREMENTS]',
    fuelSurcharge:
      pricingStructure === 'per_mile'
        ? '[FUEL SURCHARGE: Calculated per DOE index at time of service]'
        : undefined,
    totalBidAmount: '[TOTAL BID AMOUNT TO BE CALCULATED]',
    pricingNotes,
    alternativePricingOptions,
    validityPeriod: '90 days from bid opening date',
    paymentTerms: determinePaymentTerms(userProfile),
  };
}

/**
 * Analyze requirements to extract pricing-relevant info
 */
function analyzePricingRequirements(
  requirements: string[]
): PricingRequirement[] {
  const pricingReqs: PricingRequirement[] = [];

  requirements.forEach((req) => {
    const lowerReq = req.toLowerCase();

    // Detect transportation services
    if (
      lowerReq.match(
        /transport|haul|deliver|freight|shipping|trucking|carrier/i
      )
    ) {
      const equipmentMatch = lowerReq.match(
        /(dump truck|flatbed|dry van|reefer|tanker|container)/i
      );
      const volumeMatch = req.match(/(\d+)\s*(loads?|shipments?|trips?)/i);

      pricingReqs.push({
        serviceType: 'transportation',
        equipmentType: equipmentMatch
          ? equipmentMatch[1].toLowerCase().replace(/\s+/g, '_')
          : undefined,
        volume: volumeMatch ? parseInt(volumeMatch[1]) : undefined,
        distance: detectDistance(req),
        duration: detectDuration(req),
      });
    }

    // Detect warehousing services
    if (lowerReq.match(/warehous|storage|fulfillment|distribution/i)) {
      pricingReqs.push({
        serviceType: 'warehousing',
        duration: detectDuration(req),
      });
    }

    // Detect specialized handling
    if (lowerReq.match(/loading|unloading|handling|lumper/i)) {
      pricingReqs.push({
        serviceType: 'handling',
      });
    }
  });

  // If no specific requirements found, add generic transportation
  if (pricingReqs.length === 0) {
    pricingReqs.push({
      serviceType: 'transportation',
      duration: 'contract',
    });
  }

  return pricingReqs;
}

/**
 * Detect distance/scope from requirement text
 */
function detectDistance(req: string): string {
  const lowerReq = req.toLowerCase();

  if (lowerReq.match(/local|within.*\d+\s*mile|city|county/i)) {
    return 'local';
  }
  if (lowerReq.match(/regional|multi.*state|within.*state/i)) {
    return 'regional';
  }
  if (lowerReq.match(/nationwide|cross.*country|long.*haul/i)) {
    return 'long_haul';
  }

  return 'regional'; // Default
}

/**
 * Detect contract duration from requirement text
 */
function detectDuration(req: string): string {
  const lowerReq = req.toLowerCase();

  if (lowerReq.match(/annual|year|12.*month/i)) {
    return 'annual';
  }
  if (lowerReq.match(/contract|ongoing|recurring/i)) {
    return 'contract';
  }
  if (lowerReq.match(/spot|one.*time|single/i)) {
    return 'spot';
  }

  return 'contract'; // Default
}

/**
 * Determine appropriate pricing structure
 */
function determinePricingStructure(
  pricingReqs: PricingRequirement[],
  userProfile: UserOrganizationProfile
): 'per_load' | 'per_mile' | 'hourly' | 'monthly' | 'hybrid' {
  const hasTransportation = pricingReqs.some(
    (r) => r.serviceType === 'transportation'
  );
  const hasWarehousing = pricingReqs.some((r) => r.serviceType === 'warehousing');
  const hasMultipleServices = pricingReqs.length > 1;

  // 3PL or multiple services = hybrid pricing
  if (userProfile.companyType === '3pl' || hasMultipleServices) {
    return 'hybrid';
  }

  // Local/regional transportation = per load pricing
  if (
    hasTransportation &&
    pricingReqs.some((r) => r.distance === 'local' || r.distance === 'regional')
  ) {
    return 'per_load';
  }

  // Long haul transportation = per mile pricing
  if (hasTransportation && pricingReqs.some((r) => r.distance === 'long_haul')) {
    return 'per_mile';
  }

  // Warehousing = monthly pricing
  if (hasWarehousing) {
    return 'monthly';
  }

  // Default to per load
  return 'per_load';
}

/**
 * Generate line items based on role and requirements
 */
function generateLineItems(
  pricingReqs: PricingRequirement[],
  userProfile: UserOrganizationProfile,
  pricingStructure: string
): PricingLineItem[] {
  const lineItems: PricingLineItem[] = [];
  let lineNumber = 1;

  pricingReqs.forEach((req) => {
    if (req.serviceType === 'transportation') {
      // FREIGHT BROKER PRICING
      if (userProfile.companyType === 'freight_broker') {
        if (pricingStructure === 'per_load') {
          lineItems.push({
            lineNumber: lineNumber++,
            description: `${req.equipmentType ? formatEquipmentName(req.equipmentType) + ' ' : ''}Transportation Services - Brokerage Coordination`,
            unit: 'per load',
            unitPrice: '[$ XX.XX per load]',
            estimatedQuantity: req.volume
              ? `${req.volume} loads per ${req.duration === 'annual' ? 'month' : 'period'}`
              : '[Estimated quantity TBD]',
            notes: 'Includes: Carrier sourcing, load coordination, tracking, POD collection',
          });

          lineItems.push({
            lineNumber: lineNumber++,
            description: 'Carrier Transportation Cost Pass-Through',
            unit: 'per load',
            unitPrice: '[Actual carrier costs + broker margin]',
            notes: 'Final pricing based on lane, equipment availability, and market rates',
          });
        } else if (pricingStructure === 'per_mile') {
          lineItems.push({
            lineNumber: lineNumber++,
            description: 'Transportation Services - Per Mile Rate',
            unit: 'per mile',
            unitPrice: '[$ X.XX per mile]',
            estimatedQuantity: '[Total estimated miles TBD]',
            notes:
              'All-in rate includes: carrier coordination, fuel surcharge, tolls, accessorials',
          });
        }
      }

      // ASSET CARRIER PRICING
      else if (userProfile.companyType === 'asset_carrier') {
        if (pricingStructure === 'per_load') {
          lineItems.push({
            lineNumber: lineNumber++,
            description: `${req.equipmentType ? formatEquipmentName(req.equipmentType) + ' ' : ''}Transportation Services - Direct Carrier Pricing`,
            unit: 'per load',
            unitPrice: '[$ XXX.XX per load]',
            estimatedQuantity: req.volume
              ? `${req.volume} loads per ${req.duration === 'annual' ? 'month' : 'period'}`
              : '[Estimated quantity TBD]',
            notes:
              'All-inclusive rate: Equipment, driver, fuel, maintenance, insurance, dispatch',
          });

          // Volume discount tier
          if (req.volume && req.volume >= 50) {
            lineItems.push({
              lineNumber: lineNumber++,
              description: 'Volume Discount (50+ loads per month)',
              unit: 'per load',
              unitPrice: '[- $ XX.XX discount per load]',
              notes: 'Applied automatically when volume threshold is met',
            });
          }
        } else if (pricingStructure === 'per_mile') {
          lineItems.push({
            lineNumber: lineNumber++,
            description: 'Transportation Services - Direct Carrier Rate',
            unit: 'per mile',
            unitPrice: '[$ X.XX per mile]',
            notes: 'Includes: loaded and empty miles, fuel, tolls, driver wages, equipment costs',
          });

          lineItems.push({
            lineNumber: lineNumber++,
            description: 'Detention/Layover (if applicable)',
            unit: 'per hour',
            unitPrice: '[$ XX.XX per hour after 2 hours free time]',
            notes: 'Applies to delays beyond scheduled pickup/delivery windows',
          });
        }
      }

      // 3PL PRICING
      else if (userProfile.companyType === '3pl') {
        lineItems.push({
          lineNumber: lineNumber++,
          description: 'Integrated Logistics Services - Transportation Management',
          unit: 'per load',
          unitPrice: '[$ XXX.XX per load]',
          notes:
            'Includes: Mode optimization, carrier selection, tracking, exception management',
        });
      }
    }

    // WAREHOUSING PRICING
    if (req.serviceType === 'warehousing') {
      lineItems.push({
        lineNumber: lineNumber++,
        description: 'Warehousing & Storage',
        unit: 'per pallet per month',
        unitPrice: '[$ XX.XX per pallet/month]',
        notes: 'Standard pallet storage (48" x 40", up to 48" high, max 2,000 lbs)',
      });

      lineItems.push({
        lineNumber: lineNumber++,
        description: 'Inbound Receiving & Put-Away',
        unit: 'per pallet',
        unitPrice: '[$ XX.XX per pallet]',
        notes: 'Includes: unloading, inspection, scanning, inventory system entry',
      });

      lineItems.push({
        lineNumber: lineNumber++,
        description: 'Outbound Order Fulfillment',
        unit: 'per order',
        unitPrice: '[$ XX.XX per order]',
        notes: 'Includes: picking, packing, labeling, loading',
      });
    }

    // HANDLING SERVICES
    if (req.serviceType === 'handling') {
      lineItems.push({
        lineNumber: lineNumber++,
        description: 'Loading/Unloading Services',
        unit: 'per load',
        unitPrice: '[$ XX.XX per load]',
        notes: 'Includes: labor, equipment, time up to 2 hours',
      });
    }
  });

  // Add common accessorials
  lineItems.push({
    lineNumber: lineNumber++,
    description: 'Fuel Surcharge',
    unit: 'variable',
    unitPrice: '[Calculated per DOE National Diesel Fuel Index]',
    notes: 'Updated weekly; surcharge applied when diesel exceeds $X.XX per gallon',
  });

  lineItems.push({
    lineNumber: lineNumber++,
    description: 'Accessorial Charges (if applicable)',
    unit: 'as incurred',
    unitPrice: '[Per attached rate schedule]',
    notes:
      'Includes: additional stops, inside delivery, liftgate service, residential delivery, etc.',
  });

  return lineItems;
}

/**
 * Format equipment type names
 */
function formatEquipmentName(equipmentType: string): string {
  const names: Record<string, string> = {
    dump_truck: 'Dump Truck',
    flatbed: 'Flatbed',
    dry_van: 'Dry Van',
    reefer: 'Refrigerated',
    tanker: 'Tanker',
    container: 'Container',
  };
  return names[equipmentType] || equipmentType;
}

/**
 * Generate pricing notes and terms
 */
function generatePricingNotes(
  userProfile: UserOrganizationProfile,
  pricingReqs: PricingRequirement[]
): string[] {
  const notes: string[] = [];

  // Role-specific notes
  if (userProfile.companyType === 'freight_broker') {
    notes.push(
      'Brokerage Model: Pricing includes broker coordination services plus actual carrier transportation costs'
    );
    notes.push(
      'Final carrier rates determined at time of shipment based on market conditions and lane availability'
    );
    notes.push(
      'FleetFlow™ platform tracking and reporting included at no additional charge'
    );
  } else if (userProfile.companyType === 'asset_carrier') {
    notes.push(
      'Direct Carrier Pricing: All-inclusive rates with no broker markup or hidden fees'
    );
    notes.push(
      'Fixed pricing for contract term (subject to fuel surcharge adjustments)'
    );
    notes.push(
      'Company-owned equipment and employed drivers ensure consistent service quality'
    );
  } else if (userProfile.companyType === '3pl') {
    notes.push(
      'Integrated 3PL Pricing: Combines transportation, warehousing, and value-added services'
    );
    notes.push(
      'Flexible pricing models available: transactional, shared resources, or dedicated operations'
    );
    notes.push(
      'Technology platform and account management included in base pricing'
    );
  }

  // General terms
  notes.push('All pricing is subject to final route/lane confirmation and volume verification');
  notes.push(
    'Volume discounts available for commitments exceeding [XX] loads per month'
  );
  notes.push('Pricing valid for 90 days from bid opening date');
  notes.push('Standard payment terms: Net 30 days (early payment discounts available)');
  notes.push(
    'Insurance: All services provided with full cargo insurance and liability coverage as required'
  );

  // Contract duration notes
  const hasAnnualContract = pricingReqs.some((r) => r.duration === 'annual');
  if (hasAnnualContract) {
    notes.push(
      'Annual Contract Pricing: Rate lock guarantee for 12 months (excluding fuel surcharge adjustments)'
    );
    notes.push(
      'Automatic renewal option available with price adjustment clause based on CPI or agreed-upon index'
    );
  }

  return notes;
}

/**
 * Generate alternative pricing options
 */
function generateAlternativeOptions(
  pricingReqs: PricingRequirement[],
  userProfile: UserOrganizationProfile
): { optionName: string; description: string; pricing: string }[] | undefined {
  const alternatives: { optionName: string; description: string; pricing: string }[] =
    [];

  // Volume commitment discounts
  if (pricingReqs.some((r) => r.volume && r.volume >= 20)) {
    alternatives.push({
      optionName: 'Option A: Volume Commitment Discount',
      description: 'Guaranteed minimum of 50 loads per month for 12-month term',
      pricing: '[X% discount off base per-load rate] = $[XX.XX] per load',
    });
  }

  // Dedicated service option
  if (userProfile.companyType === 'asset_carrier' || userProfile.companyType === '3pl') {
    alternatives.push({
      optionName: 'Option B: Dedicated Equipment/Driver',
      description:
        'One truck and driver dedicated exclusively to your operations (M-F, 8-hour shifts)',
      pricing: '[Monthly rate] = $[X,XXX] per month + fuel surcharge',
    });
  }

  // Hybrid broker-carrier option
  if (userProfile.companyType === '3pl') {
    alternatives.push({
      optionName: 'Option C: Hybrid Asset + Brokerage Model',
      description:
        'Base volume (80%) handled by dedicated fleet, overflow (20%) coordinated via brokerage',
      pricing:
        'Blended rate: $[XX.XX] per load for dedicated, $[XX.XX] per load for brokered overflow',
    });
  }

  return alternatives.length > 0 ? alternatives : undefined;
}

/**
 * Determine payment terms based on profile
 */
function determinePaymentTerms(userProfile: UserOrganizationProfile): string {
  const baseTerms = 'Net 30 days from invoice date';

  if (userProfile.companyType === 'freight_broker') {
    return `${baseTerms} | Quick Pay available (2% discount for payment within 5 days)`;
  } else if (userProfile.companyType === 'asset_carrier') {
    return `${baseTerms} | Early Payment Discount: 1% for payment within 10 days`;
  } else if (userProfile.companyType === '3pl') {
    return `${baseTerms} | Flexible terms available for annual contracts`;
  }

  return baseTerms;
}

/**
 * Format pricing schedule as markdown table for display
 */
export function formatPricingScheduleAsTable(schedule: PricingSchedule): string {
  let markdown = `
| Line | Description | Unit | Unit Price | Est. Quantity | Notes |
|------|-------------|------|------------|---------------|-------|
`;

  schedule.lineItems.forEach((item) => {
    markdown += `| ${item.lineNumber} | ${item.description} | ${item.unit} | ${item.unitPrice || 'TBD'} | ${item.estimatedQuantity || 'N/A'} | ${item.notes || ''} |\n`;
  });

  return markdown;
}

/**
 * Format pricing schedule as structured text for bid document
 */
export function formatPricingScheduleForBid(schedule: PricingSchedule): string {
  let formatted = '';

  // Line items
  schedule.lineItems.forEach((item) => {
    formatted += `
Line Item ${item.lineNumber}: ${item.description}
   Unit: ${item.unit}
   Unit Price: ${item.unitPrice || '[TO BE INSERTED]'}
   ${item.estimatedQuantity ? `Estimated Quantity: ${item.estimatedQuantity}` : ''}
   ${item.notes ? `Notes: ${item.notes}` : ''}
`;
  });

  // Totals
  formatted += `

SUBTOTAL: ${schedule.subtotal || '[TO BE CALCULATED]'}
${schedule.fuelSurcharge ? `FUEL SURCHARGE: ${schedule.fuelSurcharge}` : ''}
───────────────────────────────────────────────────────
TOTAL BID AMOUNT: ${schedule.totalBidAmount || '[TO BE CALCULATED]'}
`;

  // Pricing notes
  if (schedule.pricingNotes.length > 0) {
    formatted += `

PRICING NOTES & TERMS:
`;
    schedule.pricingNotes.forEach((note, idx) => {
      formatted += `${idx + 1}. ${note}\n`;
    });
  }

  // Alternative options
  if (schedule.alternativePricingOptions && schedule.alternativePricingOptions.length > 0) {
    formatted += `

ALTERNATIVE PRICING OPTIONS:
`;
    schedule.alternativePricingOptions.forEach((option) => {
      formatted += `
${option.optionName}
   Description: ${option.description}
   Pricing: ${option.pricing}
`;
    });
  }

  // Payment terms
  formatted += `

PRICING VALIDITY: ${schedule.validityPeriod}
PAYMENT TERMS: ${schedule.paymentTerms}
`;

  return formatted;
}

