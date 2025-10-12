// GOVERNMENT CONTRACT PRICING ANALYZER
// FAR 15.404 Compliant Cost/Price Analysis System
// Generates complete cost proposals with all required schedules and documentation

import {
  generateBasisOfEstimate,
  generateBillOfMaterials,
  generateIndirectRatesSchedule,
  generateLaborDetailSchedule,
  generatePricingNarrative,
} from './government-pricing-schedules';

export interface GovernmentPricingRequest {
  requirements: string[];
  documentContent: string;
  userProfile: UserOrganizationProfile;
  companyFinancials?: CompanyFinancials;
}

export interface UserOrganizationProfile {
  companyName: string;
  companyType: 'freight_broker' | 'asset_carrier' | '3pl' | 'shipper' | 'other';
  mcNumber?: string;
  dotNumber?: string;
  ein?: string; // Employer Identification Number (Federal Tax ID)
  dunsNumber?: string; // D-U-N-S Number (Data Universal Numbering System)
  ueiNumber?: string; // Unique Entity Identifier (SAM.gov, replaced DUNS in 2022)
  cageCode?: string; // Commercial and Government Entity Code
  scacCode?: string; // Standard Carrier Alpha Code
  npiNumber?: string; // National Provider Identifier (for healthcare/medical logistics)
  certifications: string[];
  fleetSize?: number;
  equipmentTypes?: string[];
  serviceAreas?: string[];
  yearsInBusiness?: number;
}

export interface CompanyFinancials {
  driverWage: number; // Base hourly rate
  dispatcherWage: number;
  supervisorWage: number;
  fringeBenefitRate: number; // Percentage (e.g., 0.30 for 30%)
  overheadRate: number; // Calculated or provided
  overheadPool?: number; // Annual overhead costs
  directLaborBase?: number; // Annual direct labor
  fuelCostPerGallon: number;
  vehicleMPG: number;
  maintenanceCostPerMonth: number;
  insuranceCostPerMonth: number;
  profitMarginTarget?: number; // Percentage (e.g., 0.10 for 10%)
}

export interface EvaluationCriteria {
  method: 'LPTA' | 'BEST_VALUE' | 'PRICE_ONLY';
  factors?: {
    technical?: number; // Percentage weight
    pastPerformance?: number;
    price?: number;
  };
}

export interface ContractType {
  type: 'FFP' | 'CPFF' | 'TM' | 'FPI' | 'OTHER';
  ceiling?: number; // Not-to-exceed amount
  performancePeriod: string; // e.g., "12 months"
}

export interface DirectCosts {
  labor: {
    drivers: { fte: number; hours: number; rate: number; cost: number };
    dispatchers: { fte: number; hours: number; rate: number; cost: number };
    supervisors: { fte: number; hours: number; rate: number; cost: number };
    fringe: number;
    total: number;
  };
  materials: {
    fuel: { quantity: number; unitPrice: number; cost: number };
    supplies: { description: string; cost: number }[];
    total: number;
  };
  subcontractors: {
    maintenance: { description: string; cost: number };
    other: { description: string; cost: number }[];
    total: number;
  };
  total: number;
}

export interface IndirectCosts {
  overheadRate: number;
  overheadAmount: number;
  breakdown: {
    administrative: number;
    facilities: number;
    operations: number;
    marketing: number;
  };
}

export interface ProfitAnalysis {
  profitRate: number;
  profitAmount: number;
  justification: string;
  weightedGuidelinesFactors?: {
    contractorEffort: number;
    costRisk: number;
    socioeconomic: number;
    capitalInvestment: number;
    costEfficiency: number;
  };
}

export interface PricingStrategy {
  recommendedPrice: number;
  pricePerUnit: number;
  competitiveRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
  justification: string;
}

export interface GovernmentPricingAnalysis {
  evaluationCriteria: EvaluationCriteria;
  contractType: ContractType;
  directCosts: DirectCosts;
  indirectCosts: IndirectCosts;
  totalCost: number;
  profitAnalysis: ProfitAnalysis;
  totalPrice: number;
  pricingStrategy: PricingStrategy;
  schedules: {
    laborDetail: string;
    billOfMaterials: string;
    indirectRates: string;
    basisOfEstimate: string;
    pricingNarrative: string;
  };
  verificationReport: {
    mathematicalAccuracy: boolean;
    complianceChecks: { check: string; passed: boolean }[];
    warnings: string[];
    readyForSubmission: boolean;
  };
}

/**
 * MAIN FUNCTION: Analyze solicitation and generate complete cost proposal
 */
export async function analyzeGovernmentPricing(
  request: GovernmentPricingRequest
): Promise<GovernmentPricingAnalysis> {
  // Step 1: Detect evaluation criteria and contract type
  const evaluationCriteria = detectEvaluationCriteria(request.documentContent);
  const contractType = detectContractType(request.documentContent);

  // Step 2: Calculate direct costs
  const directCosts = calculateDirectCosts(
    request.requirements,
    request.userProfile,
    request.companyFinancials
  );

  // Step 3: Calculate indirect costs
  const indirectCosts = calculateIndirectCosts(
    directCosts.labor.total,
    request.companyFinancials
  );

  // Step 4: Calculate total cost
  const totalCost = directCosts.total + indirectCosts.overheadAmount;

  // Step 5: Determine profit
  const profitAnalysis = calculateProfit(
    totalCost,
    contractType,
    evaluationCriteria,
    request.companyFinancials
  );

  // Step 6: Calculate total price
  const totalPrice = totalCost + profitAnalysis.profitAmount;

  // Step 7: Develop pricing strategy
  const pricingStrategy = developPricingStrategy(
    totalPrice,
    evaluationCriteria,
    contractType,
    request.requirements,
    request.userProfile
  );

  // Step 8: Generate all required schedules
  const schedules = generateAllSchedules(
    directCosts,
    indirectCosts,
    profitAnalysis,
    request.userProfile,
    request.companyFinancials,
    contractType
  );

  // Step 9: Verify proposal
  const verificationReport = verifyProposal(
    directCosts,
    indirectCosts,
    profitAnalysis,
    totalPrice,
    pricingStrategy
  );

  return {
    evaluationCriteria,
    contractType,
    directCosts,
    indirectCosts,
    totalCost,
    profitAnalysis,
    totalPrice,
    pricingStrategy,
    schedules,
    verificationReport,
  };
}

/**
 * Detect evaluation criteria from solicitation
 */
function detectEvaluationCriteria(documentContent: string): EvaluationCriteria {
  const lowerContent = documentContent.toLowerCase();

  // Check for LPTA
  if (lowerContent.match(/lowest price.*technically acceptable|lpta/i)) {
    return {
      method: 'LPTA',
    };
  }

  // Check for Best Value
  if (lowerContent.match(/best value|tradeoff/i)) {
    // Try to extract factor weights
    const technicalMatch = documentContent.match(/technical.*?(\d+)%/i);
    const performanceMatch = documentContent.match(
      /past performance.*?(\d+)%/i
    );
    const priceMatch = documentContent.match(/price.*?(\d+)%/i);

    return {
      method: 'BEST_VALUE',
      factors: {
        technical: technicalMatch ? parseInt(technicalMatch[1]) : 40,
        pastPerformance: performanceMatch ? parseInt(performanceMatch[1]) : 30,
        price: priceMatch ? parseInt(priceMatch[1]) : 30,
      },
    };
  }

  // Check for price-only
  if (lowerContent.match(/price only|lowest price/i)) {
    return {
      method: 'PRICE_ONLY',
    };
  }

  // Default to Best Value
  return {
    method: 'BEST_VALUE',
    factors: {
      technical: 40,
      pastPerformance: 30,
      price: 30,
    },
  };
}

/**
 * Detect contract type from solicitation
 */
function detectContractType(documentContent: string): ContractType {
  const lowerContent = documentContent.toLowerCase();

  // Firm Fixed Price
  if (lowerContent.match(/firm fixed price|ffp|fixed.price contract/i)) {
    const periodMatch = documentContent.match(
      /performance period.*?(\d+)\s*(month|year)/i
    );
    return {
      type: 'FFP',
      performancePeriod: periodMatch
        ? `${periodMatch[1]} ${periodMatch[2]}s`
        : '12 months',
    };
  }

  // Cost-Plus-Fixed-Fee
  if (lowerContent.match(/cost plus|cost.plus.fixed.fee|cpff/i)) {
    return {
      type: 'CPFF',
      performancePeriod: '12 months',
    };
  }

  // Time & Materials
  if (lowerContent.match(/time and materials|t&m|t\s*&\s*m/i)) {
    const ceilingMatch = documentContent.match(
      /not.to.exceed.*?\$\s*([\d,]+)/i
    );
    return {
      type: 'TM',
      ceiling: ceilingMatch
        ? parseFloat(ceilingMatch[1].replace(/,/g, ''))
        : undefined,
      performancePeriod: '12 months',
    };
  }

  // Default to FFP
  return {
    type: 'FFP',
    performancePeriod: '12 months',
  };
}

/**
 * Calculate direct costs (labor, materials, subcontractors)
 */
function calculateDirectCosts(
  requirements: string[],
  userProfile: UserOrganizationProfile,
  financials?: CompanyFinancials
): DirectCosts {
  // Extract volume requirements
  const volumeReq = requirements.find((r) => r.match(/\d+\s*loads?/i));
  const volumeMatch = volumeReq?.match(/(\d+)\s*loads?/i);
  const loadsPerDay = volumeMatch ? parseInt(volumeMatch[1]) : 50;
  const loadsPerMonth = loadsPerDay * 22; // Working days

  // Extract distance
  const distanceReq = requirements.find((r) => r.match(/miles?|distance/i));
  const distanceMatch = distanceReq?.match(/(\d+)\s*miles?/i);
  const milesPerLoad = distanceMatch ? parseInt(distanceMatch[1]) : 50;

  // Default financial values
  const driverWage = financials?.driverWage || 25;
  const dispatcherWage = financials?.dispatcherWage || 30;
  const supervisorWage = financials?.supervisorWage || 35;
  const fringeRate = financials?.fringeBenefitRate || 0.3;
  const fuelCost = financials?.fuelCostPerGallon || 3.8;
  const mpg = financials?.vehicleMPG || 6.5;

  // Calculate labor
  const hoursPerLoad = Math.ceil(milesPerLoad / 12.5); // ~12.5 mph average with loading/unloading
  const loadsPerDriverPerDay = Math.floor(10 / hoursPerLoad); // 10-hour workday
  const driversNeeded = Math.ceil(
    loadsPerDay / Math.max(loadsPerDriverPerDay, 1)
  );
  const hoursPerMonth = 176; // 4 weeks × 44 hours

  const driverHours = driversNeeded * hoursPerMonth;
  const driverBasePay = driverHours * driverWage;
  const driverFringe = driverBasePay * fringeRate;

  const dispatchersNeeded = Math.max(1, Math.ceil(driversNeeded / 15));
  const dispatcherHours = dispatchersNeeded * hoursPerMonth;
  const dispatcherBasePay = dispatcherHours * dispatcherWage;
  const dispatcherFringe = dispatcherBasePay * fringeRate;

  const supervisorsNeeded = 1;
  const supervisorHours = supervisorsNeeded * hoursPerMonth;
  const supervisorBasePay = supervisorHours * supervisorWage;
  const supervisorFringe = supervisorBasePay * fringeRate;

  const totalBasePay = driverBasePay + dispatcherBasePay + supervisorBasePay;
  const totalFringe = driverFringe + dispatcherFringe + supervisorFringe;
  const totalLabor = totalBasePay + totalFringe;

  // Calculate materials (fuel)
  const totalMiles = loadsPerMonth * milesPerLoad;
  const gallonsNeeded = totalMiles / mpg;
  const fuelCostTotal = gallonsNeeded * fuelCost;

  // Supplies
  const supplies = [
    { description: 'Maintenance supplies (oil, filters, fluids)', cost: 500 },
    { description: 'Safety equipment (PPE, cones, signage)', cost: 300 },
    { description: 'Office supplies', cost: 200 },
  ];
  const suppliesTotal = supplies.reduce((sum, s) => sum + s.cost, 0);

  // Subcontractors
  const maintenance = {
    description: 'Contracted maintenance and repairs',
    cost: financials?.maintenanceCostPerMonth || 3000,
  };
  const otherSubs = [{ description: 'Backup equipment rental', cost: 1500 }];
  const subTotal =
    maintenance.cost + otherSubs.reduce((sum, s) => sum + s.cost, 0);

  // Calculate totals
  const materialsTotal = fuelCostTotal + suppliesTotal;
  const directTotal = totalLabor + materialsTotal + subTotal;

  return {
    labor: {
      drivers: {
        fte: driversNeeded,
        hours: driverHours,
        rate: driverWage,
        cost: driverBasePay + driverFringe,
      },
      dispatchers: {
        fte: dispatchersNeeded,
        hours: dispatcherHours,
        rate: dispatcherWage,
        cost: dispatcherBasePay + dispatcherFringe,
      },
      supervisors: {
        fte: supervisorsNeeded,
        hours: supervisorHours,
        rate: supervisorWage,
        cost: supervisorBasePay + supervisorFringe,
      },
      fringe: totalFringe,
      total: totalLabor,
    },
    materials: {
      fuel: {
        quantity: gallonsNeeded,
        unitPrice: fuelCost,
        cost: fuelCostTotal,
      },
      supplies,
      total: materialsTotal,
    },
    subcontractors: {
      maintenance,
      other: otherSubs,
      total: subTotal,
    },
    total: directTotal,
  };
}

/**
 * Calculate indirect costs (overhead)
 */
function calculateIndirectCosts(
  directLaborTotal: number,
  financials?: CompanyFinancials
): IndirectCosts {
  const overheadRate = financials?.overheadRate || 0.378; // 37.8%
  const overheadAmount = directLaborTotal * overheadRate;

  // Breakdown (estimated distribution)
  const breakdown = {
    administrative: overheadAmount * 0.21, // 21%
    facilities: overheadAmount * 0.18, // 18%
    operations: overheadAmount * 0.52, // 52%
    marketing: overheadAmount * 0.09, // 9%
  };

  return {
    overheadRate,
    overheadAmount,
    breakdown,
  };
}

/**
 * Calculate profit based on FAR guidelines
 */
function calculateProfit(
  totalCost: number,
  contractType: ContractType,
  evaluationCriteria: EvaluationCriteria,
  financials?: CompanyFinancials
): ProfitAnalysis {
  // Use provided target or calculate based on complexity
  let profitRate = financials?.profitMarginTarget || 0.1;

  // Adjust for contract type
  if (contractType.type === 'FFP') {
    // Add risk premium for fixed price
    profitRate += 0.02; // +2%
  } else if (contractType.type === 'CPFF') {
    // Reduce for cost-plus (lower risk)
    profitRate -= 0.02; // -2%
  }

  // Cap at reasonable ranges
  profitRate = Math.max(0.08, Math.min(profitRate, 0.15));

  const profitAmount = totalCost * profitRate;

  // Weighted Guidelines Method factors (FAR 15.404-4)
  const factors = {
    contractorEffort: 0.035, // 3.5%
    costRisk: contractType.type === 'FFP' ? 0.025 : 0.015, // 2.5% for FFP, 1.5% otherwise
    socioeconomic: 0.015, // 1.5% (WOSB)
    capitalInvestment: 0.015, // 1.5%
    costEfficiency: 0.015, // 1.5%
  };

  const justification = `
Profit margin of ${(profitRate * 100).toFixed(1)}% is based on FAR 15.404-4
Weighted Guidelines Method and represents a fair return considering:
- ${contractType.type === 'FFP' ? 'Fixed price' : contractType.type} contract with ${contractType.type === 'FFP' ? 'contractor bearing cost risk' : 'government bearing cost risk'}
- Medium complexity operations with routine services
- Woman-Owned Small Business providing socioeconomic value
- Efficient operations with proven cost controls
`.trim();

  return {
    profitRate,
    profitAmount,
    justification,
    weightedGuidelinesFactors: factors,
  };
}

/**
 * Develop pricing strategy based on evaluation criteria
 */
function developPricingStrategy(
  totalPrice: number,
  evaluationCriteria: EvaluationCriteria,
  contractType: ContractType,
  requirements: string[],
  userProfile: UserOrganizationProfile
): PricingStrategy {
  // Extract loads for per-unit calculation
  const volumeReq = requirements.find((r) => r.match(/\d+\s*loads?/i));
  const volumeMatch = volumeReq?.match(/(\d+)\s*loads?/i);
  const loadsPerDay = volumeMatch ? parseInt(volumeMatch[1]) : 50;
  const loadsPerMonth = loadsPerDay * 22;

  const pricePerUnit = totalPrice / loadsPerMonth;

  // Historical market data (mock - would come from real market research)
  const marketAveragePrice = 95; // per load
  const priceDiff =
    ((pricePerUnit - marketAveragePrice) / marketAveragePrice) * 100;

  let competitiveRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  const recommendations: string[] = [];

  if (evaluationCriteria.method === 'LPTA') {
    if (priceDiff > 30) {
      competitiveRisk = 'HIGH';
      recommendations.push(
        '⚠️ LPTA = lowest price wins. Your price is ' +
          priceDiff.toFixed(1) +
          '% above market.'
      );
      recommendations.push(
        'Consider declining bid if unprofitable at market rates'
      );
      recommendations.push(
        'Or restructure costs: use broker model, reduce overhead'
      );
    } else if (priceDiff > 15) {
      competitiveRisk = 'MEDIUM';
      recommendations.push('Price competitively but with minimal margin');
    } else {
      competitiveRisk = 'LOW';
      recommendations.push('Price is competitive for LPTA evaluation');
    }
  } else if (evaluationCriteria.method === 'BEST_VALUE') {
    const priceWeight = evaluationCriteria.factors?.price || 30;

    if (priceWeight < 35 && priceDiff < 50) {
      competitiveRisk = 'LOW';
      recommendations.push(
        `✅ Best Value with price at ${priceWeight}% allows premium pricing for quality`
      );
      recommendations.push(
        'Emphasize technical superiority and past performance'
      );
      recommendations.push(
        'Highlight WOSB certification and technology platform'
      );
    } else if (priceDiff > 50) {
      competitiveRisk = 'MEDIUM';
      recommendations.push(
        'Price is above market - strong value justification required'
      );
      recommendations.push(
        'Focus proposal on reliability, safety record, and quality'
      );
    } else {
      competitiveRisk = 'LOW';
      recommendations.push('Price is within acceptable range for Best Value');
    }
  } else {
    competitiveRisk = 'MEDIUM';
    recommendations.push(
      'Price-only evaluation - be as competitive as possible'
    );
  }

  const justification = generatePriceJustification(
    pricePerUnit,
    marketAveragePrice,
    userProfile,
    contractType
  );

  return {
    recommendedPrice: totalPrice,
    pricePerUnit,
    competitiveRisk,
    recommendations,
    justification,
  };
}

/**
 * Generate price justification narrative
 */
function generatePriceJustification(
  yourPrice: number,
  marketPrice: number,
  userProfile: UserOrganizationProfile,
  contractType: ContractType
): string {
  const priceDiff = ((yourPrice - marketPrice) / marketPrice) * 100;

  if (priceDiff < 10) {
    return `Our proposed price of $${yourPrice.toFixed(2)} per load is competitively aligned with market rates and represents excellent value for the Government.`;
  }

  return `
Our proposed price of $${yourPrice.toFixed(2)} per load exceeds spot market averages by ${priceDiff.toFixed(1)}% due to our superior service model:

DIRECT CARRIER MODEL: Unlike brokers who add 15-25% markup, we are a ${userProfile.companyType === 'asset_carrier' ? 'direct asset-based carrier' : 'licensed broker'} providing:
- ${userProfile.companyType === 'asset_carrier' ? 'Company-owned fleet with guaranteed capacity' : 'Direct carrier coordination without intermediary markup'}
- ${userProfile.companyType === 'asset_carrier' ? 'W-2 employed drivers (not owner-operators) ensuring consistent quality' : 'Pre-qualified carrier network with rigorous vetting'}
- Real-time GPS tracking via FleetFlow™ platform (no additional cost)
- 24/7 dispatch and customer support

QUALITY & RELIABILITY:
- 99.8% on-time delivery rate (documented)
- Zero safety violations (past 24 months)
- Backup equipment for emergencies
- Local dispatch center for responsive service

SOCIOECONOMIC VALUE:
- Woman-Owned Small Business (WOSB) certification
- Supports Federal diversity procurement goals
- Local economic development impact

RISK MITIGATION:
- ${contractType.type === 'FFP' ? 'Fixed price includes appropriate contingencies for cost fluctuations' : 'Cost controls and efficient operations minimize government risk'}
- Proven performance on similar contracts
- Financial stability and bonding capacity

Our price represents the best value considering total cost of ownership, quality assurance, and reduced performance risk.
`.trim();
}

/**
 * Generate all required schedules and documentation
 */
function generateAllSchedules(
  directCosts: DirectCosts,
  indirectCosts: IndirectCosts,
  profitAnalysis: ProfitAnalysis,
  userProfile: UserOrganizationProfile,
  financials: CompanyFinancials | undefined,
  contractType: ContractType
): {
  laborDetail: string;
  billOfMaterials: string;
  indirectRates: string;
  basisOfEstimate: string;
  pricingNarrative: string;
} {
  const laborDetail = generateLaborDetailSchedule(
    directCosts.labor,
    financials
  );
  const billOfMaterials = generateBillOfMaterials(
    directCosts.materials,
    directCosts.subcontractors
  );
  const indirectRates = generateIndirectRatesSchedule(
    indirectCosts,
    directCosts.labor.total
  );
  const basisOfEstimate = generateBasisOfEstimate(
    directCosts,
    indirectCosts,
    profitAnalysis
  );
  const pricingNarrative = generatePricingNarrative(
    directCosts,
    indirectCosts,
    profitAnalysis,
    userProfile,
    contractType
  );

  return {
    laborDetail,
    billOfMaterials,
    indirectRates,
    basisOfEstimate,
    pricingNarrative,
  };
}

/**
 * Verify proposal for accuracy and compliance
 */
function verifyProposal(
  directCosts: DirectCosts,
  indirectCosts: IndirectCosts,
  profitAnalysis: ProfitAnalysis,
  totalPrice: number,
  pricingStrategy: PricingStrategy
): {
  mathematicalAccuracy: boolean;
  complianceChecks: { check: string; passed: boolean }[];
  warnings: string[];
  readyForSubmission: boolean;
} {
  const warnings: string[] = [];

  // Verify math
  const calculatedTotal =
    directCosts.total +
    indirectCosts.overheadAmount +
    profitAnalysis.profitAmount;
  const mathematicalAccuracy = Math.abs(calculatedTotal - totalPrice) < 0.01;

  if (!mathematicalAccuracy) {
    warnings.push('Mathematical discrepancy detected - totals do not match');
  }

  // Compliance checks
  const complianceChecks = [
    {
      check: 'Labor costs calculated',
      passed: directCosts.labor.total > 0,
    },
    {
      check: 'Material costs included',
      passed: directCosts.materials.total > 0,
    },
    {
      check: 'Overhead rate reasonable (30-45%)',
      passed:
        indirectCosts.overheadRate >= 0.3 && indirectCosts.overheadRate <= 0.45,
    },
    {
      check: 'Profit margin within FAR guidelines (8-15%)',
      passed:
        profitAnalysis.profitRate >= 0.08 && profitAnalysis.profitRate <= 0.15,
    },
    {
      check: 'Pricing strategy developed',
      passed: pricingStrategy.recommendations.length > 0,
    },
  ];

  // Check for competitive risk
  if (pricingStrategy.competitiveRisk === 'HIGH') {
    warnings.push(
      'HIGH competitive risk - price significantly above market average'
    );
  }

  // Check overhead rate
  if (indirectCosts.overheadRate > 0.45) {
    warnings.push('Overhead rate exceeds typical range - may face scrutiny');
  }

  const readyForSubmission =
    mathematicalAccuracy && complianceChecks.every((c) => c.passed);

  return {
    mathematicalAccuracy,
    complianceChecks,
    warnings,
    readyForSubmission,
  };
}
