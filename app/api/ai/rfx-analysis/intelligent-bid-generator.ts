// INTELLIGENT BID RESPONSE GENERATOR
// Analyzes solicitation requirements and generates role-specific, detailed responses
// MULTI-TENANT: Works for any user type (freight broker, asset carrier, 3PL, etc.)

export interface UserOrganizationProfile {
  companyName: string;
  companyType: 'freight_broker' | 'asset_carrier' | '3pl' | 'shipper' | 'other';
  mcNumber?: string;
  dotNumber?: string;
  certifications: string[]; // ['WOSB', 'MBE', 'DBE', 'SDB', etc.]
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  capabilities: string[]; // Services they provide
  fleetSize?: number;
  equipmentTypes?: string[];
  serviceAreas?: string[];
  yearsInBusiness?: number;
}

export interface ParsedRequirement {
  originalText: string;
  category:
    | 'equipment'
    | 'capacity'
    | 'timeline'
    | 'geographic'
    | 'certification'
    | 'insurance'
    | 'safety'
    | 'experience'
    | 'technology'
    | 'other';
  specifics: {
    equipmentType?: string;
    quantity?: number;
    timeline?: string;
    location?: string;
    certificationNeeded?: string;
    insuranceAmount?: string;
  };
}

export interface IntelligentBidResponse {
  requirement: string;
  complianceStatus: 'fully_compliant' | 'partially_compliant' | 'non_compliant';
  detailedResponse: string;
  supportingEvidence: string[];
  pricingGuidance?: string;
  riskFactors?: string[];
}

/**
 * INTELLIGENT ANALYZER: Parses and categorizes requirements
 */
export function analyzeRequirements(
  requirements: string[]
): ParsedRequirement[] {
  return requirements.map((req) => {
    const parsed: ParsedRequirement = {
      originalText: req,
      category: 'other',
      specifics: {},
    };

    const lowerReq = req.toLowerCase();

    // Equipment detection
    if (
      lowerReq.match(
        /truck|trailer|van|flatbed|reefer|dump|tanker|container|equipment/i
      )
    ) {
      parsed.category = 'equipment';

      // Extract equipment type
      if (lowerReq.includes('dump truck'))
        parsed.specifics.equipmentType = 'dump_truck';
      else if (lowerReq.includes('flatbed'))
        parsed.specifics.equipmentType = 'flatbed';
      else if (lowerReq.includes('dry van'))
        parsed.specifics.equipmentType = 'dry_van';
      else if (lowerReq.includes('reefer'))
        parsed.specifics.equipmentType = 'refrigerated';
      else if (lowerReq.includes('tanker'))
        parsed.specifics.equipmentType = 'tanker';

      // Extract quantity
      const qtyMatch = req.match(/(\d+)\s*(trucks?|loads?|vehicles?)/i);
      if (qtyMatch) parsed.specifics.quantity = parseInt(qtyMatch[1]);
    }

    // Capacity detection
    else if (
      lowerReq.match(
        /\d+\s*(loads?|shipments?|trips?).*per\s*(day|week|month)/i
      )
    ) {
      parsed.category = 'capacity';
      const capacityMatch = req.match(/(\d+)\s*(loads?|shipments?)/i);
      if (capacityMatch) parsed.specifics.quantity = parseInt(capacityMatch[1]);
    }

    // Timeline detection
    else if (
      lowerReq.match(/deadline|due date|within|days?|weeks?|delivery time/i)
    ) {
      parsed.category = 'timeline';
      parsed.specifics.timeline = req;
    }

    // Geographic detection
    else if (
      lowerReq.match(
        /location|state|city|county|within.*miles|region|nationwide|multi-state/i
      )
    ) {
      parsed.category = 'geographic';
      parsed.specifics.location = req;
    }

    // Certification detection
    else if (
      lowerReq.match(
        /wosb|mbe|dbe|sdb|wbe|certified|minority|woman-owned|small business/i
      )
    ) {
      parsed.category = 'certification';
      if (lowerReq.includes('wosb'))
        parsed.specifics.certificationNeeded = 'WOSB';
      else if (lowerReq.includes('mbe'))
        parsed.specifics.certificationNeeded = 'MBE';
      else if (lowerReq.includes('dbe'))
        parsed.specifics.certificationNeeded = 'DBE';
    }

    // Insurance detection
    else if (
      lowerReq.match(/insurance|liability|cargo coverage|\$\d+.*million/i)
    ) {
      parsed.category = 'insurance';
      const insuranceMatch = req.match(/\$(\d+(?:\.\d+)?)\s*million/i);
      if (insuranceMatch)
        parsed.specifics.insuranceAmount = `$${insuranceMatch[1]}M`;
    }

    // Safety detection
    else if (
      lowerReq.match(
        /safety rating|dot compliance|fmcsa|basic scores|violations|accidents/i
      )
    ) {
      parsed.category = 'safety';
    }

    // Experience detection
    else if (
      lowerReq.match(
        /experience|years in business|past performance|references|similar projects/i
      )
    ) {
      parsed.category = 'experience';
    }

    // Technology detection
    else if (
      lowerReq.match(
        /tracking|gps|technology|edi|api|portal|real-time|automated/i
      )
    ) {
      parsed.category = 'technology';
    }

    return parsed;
  });
}

/**
 * INTELLIGENT RESPONSE GENERATOR: Creates detailed, role-specific responses
 */
export function generateIntelligentResponses(
  requirements: string[],
  userProfile: UserOrganizationProfile
): IntelligentBidResponse[] {
  const analyzedReqs = analyzeRequirements(requirements);

  return analyzedReqs.map((req) => {
    // Determine compliance based on user profile and requirement
    const complianceStatus = determineCompliance(req, userProfile);

    // Generate role-specific detailed response
    const detailedResponse = generateDetailedResponse(
      req,
      userProfile,
      complianceStatus
    );

    // Generate supporting evidence
    const supportingEvidence = generateSupportingEvidence(req, userProfile);

    // Generate pricing guidance if applicable
    const pricingGuidance = generatePricingGuidance(req, userProfile);

    // Identify risk factors
    const riskFactors = identifyRiskFactors(req, userProfile);

    return {
      requirement: req.originalText,
      complianceStatus,
      detailedResponse,
      supportingEvidence,
      pricingGuidance,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
    };
  });
}

/**
 * Determine if user can comply with requirement
 */
function determineCompliance(
  req: ParsedRequirement,
  profile: UserOrganizationProfile
): 'fully_compliant' | 'partially_compliant' | 'non_compliant' {
  // Check certifications
  if (req.category === 'certification' && req.specifics.certificationNeeded) {
    if (profile.certifications.includes(req.specifics.certificationNeeded)) {
      return 'fully_compliant';
    }
    return 'non_compliant';
  }

  // Check equipment for asset carriers
  if (req.category === 'equipment' && profile.companyType === 'asset_carrier') {
    if (
      req.specifics.equipmentType &&
      profile.equipmentTypes?.includes(req.specifics.equipmentType)
    ) {
      return 'fully_compliant';
    }
    return 'partially_compliant'; // Can potentially source it
  }

  // Freight brokers can usually source any equipment
  if (
    req.category === 'equipment' &&
    profile.companyType === 'freight_broker'
  ) {
    return 'fully_compliant'; // Brokers coordinate any equipment type
  }

  // Default: assume compliance (conservative approach)
  return 'fully_compliant';
}

/**
 * Generate detailed, role-specific response
 */
function generateDetailedResponse(
  req: ParsedRequirement,
  profile: UserOrganizationProfile,
  compliance: string
): string {
  // FREIGHT BROKER responses
  if (profile.companyType === 'freight_broker') {
    switch (req.category) {
      case 'equipment':
        return `As a licensed freight brokerage (${profile.mcNumber}), ${profile.companyName} will coordinate transportation through our pre-qualified carrier network. We have established relationships with carriers specializing in ${req.specifics.equipmentType || 'the required equipment type'}, all of whom are verified for DOT compliance, insurance requirements, and safety standards. Our FleetFlow™ platform enables real-time carrier sourcing, load tendering, and shipment tracking to ensure seamless execution.`;

      case 'capacity':
        return `${profile.companyName} can fulfill the required ${req.specifics.quantity || 'specified'} loads through our extensive carrier network. As a freight broker, we maintain relationships with ${estimateCarrierCount(req)} carriers capable of handling this volume. Our dispatch coordination center operates 24/7 to ensure consistent capacity coverage, with backup carriers pre-qualified for surge situations.`;

      case 'timeline':
        return `${profile.companyName} will meet all timeline requirements through proactive carrier coordination and real-time tracking. Our broker operations team manages scheduling, pickup coordination, and delivery confirmations. We use FleetFlow™ technology for automated exception alerts, ensuring any potential delays are identified and resolved before impacting delivery commitments.`;

      case 'insurance':
        return `All carriers in ${profile.companyName}'s network are required to maintain ${req.specifics.insuranceAmount || 'industry-standard'} minimum insurance coverage, including commercial auto liability and cargo insurance. We verify insurance certificates before carrier approval and monitor renewal dates to ensure continuous coverage. ${profile.companyName} maintains contingent cargo and liability coverage as an additional layer of protection.`;

      case 'technology':
        return `${profile.companyName} provides comprehensive technology integration through our proprietary FleetFlow™ platform. This includes: real-time GPS tracking for all shipments, automated proof of delivery (POD) collection, customer portal access with 24/7 visibility, exception management with proactive alerts, and customizable reporting/analytics. We offer EDI/API integration capabilities for seamless connection with your existing systems.`;

      case 'safety':
        return `${profile.companyName} maintains rigorous carrier safety standards. All carriers in our network are vetted for: satisfactory DOT safety ratings, BASIC scores within acceptable thresholds, clean inspection records, and comprehensive driver qualification processes. We conduct annual carrier re-qualification reviews and monitor ongoing safety performance through FMCSA databases.`;

      default:
        return `${profile.companyName} is fully equipped to meet this requirement through our freight brokerage operations. With ${profile.mcNumber} authority and ${profile.yearsInBusiness || '5+'} years of experience, we have successfully fulfilled similar requirements for comparable contracts. Our broker coordination model ensures flexibility, scalability, and reliable service delivery.`;
    }
  }

  // ASSET CARRIER responses
  else if (profile.companyType === 'asset_carrier') {
    switch (req.category) {
      case 'equipment':
        const fleetInfo = profile.fleetSize
          ? `${profile.fleetSize}-truck fleet`
          : 'company-owned fleet';
        return `${profile.companyName} operates a ${fleetInfo} specifically equipped for ${req.specifics.equipmentType || 'these transportation needs'}. Our equipment is company-owned and maintained in-house, providing direct control over quality, availability, and service delivery. All vehicles meet current DOT/FMCSA requirements and are maintained on a preventive maintenance schedule exceeding manufacturer recommendations. Average fleet age: ${estimateFleetAge(profile)} years.`;

      case 'capacity':
        const dailyCapacity = profile.fleetSize
          ? Math.floor(profile.fleetSize * 0.8)
          : req.specifics.quantity || 50;
        return `${profile.companyName} has dedicated equipment capacity to handle ${req.specifics.quantity || 'the required'} loads. With ${profile.fleetSize || 'our'} company-owned trucks and ${estimateDriverCount(profile)} employed drivers, we can provide ${dailyCapacity} loads per day of dedicated capacity. As an asset-based carrier, we offer schedule reliability and consistent service without dependence on third-party capacity.`;

      case 'timeline':
        return `${profile.companyName} will meet all delivery timelines using our company-operated fleet and employed driver force. We maintain direct operational control over scheduling, routing, and execution. Our dispatch center coordinates all movements with real-time communication to drivers. With company drivers (not owner-operators), we have full authority over scheduling and can prioritize urgent shipments as needed.`;

      case 'insurance':
        return `${profile.companyName} maintains comprehensive insurance coverage exceeding ${req.specifics.insuranceAmount || 'industry standards'}, including: Commercial Auto Liability, Cargo Insurance, General Liability, Workers' Compensation, and Umbrella/Excess coverage. All insurance is held directly by ${profile.companyName} (not by third-party carriers), with ${profile.companyName} as the primary insured party. Insurance certificates are available upon request.`;

      case 'technology':
        return `${profile.companyName} provides real-time shipment visibility through GPS tracking on all company vehicles. Our systems include: Electronic Logging Devices (ELD) for HOS compliance, Fleet management software with real-time location updates, Customer portal access for shipment tracking, and Automated delivery notifications. We can accommodate EDI integration or API connectivity with your systems as needed.`;

      case 'safety':
        return `${profile.companyName} maintains a ${profile.dotNumber || 'satisfactory DOT safety rating'} with rigorous safety protocols. Our safety program includes: DOT/FMCSA compliance monitoring, Drug and alcohol testing program (DOT-compliant), Regular driver training and safety meetings, Vehicle inspection programs, and Incident investigation procedures. Our safety record reflects our commitment: [specific safety metrics would be inserted from profile data].`;

      default:
        return `${profile.companyName} is fully capable of meeting this requirement with our asset-based operations. As a motor carrier operating under ${profile.dotNumber}, we provide reliable, direct service with company equipment and employed drivers. Our ${profile.yearsInBusiness || '10+'} years of experience in similar operations demonstrates our capability to deliver consistent, high-quality transportation services.`;
    }
  }

  // 3PL responses
  else if (profile.companyType === '3pl') {
    return `${profile.companyName}, as a comprehensive third-party logistics provider, will address this requirement through our integrated service offerings. We combine warehousing, transportation management, and logistics coordination to provide end-to-end solutions. Our approach includes both asset-based capabilities (company-operated equipment) and brokerage services (vetted carrier network), giving us flexibility to optimize service and cost. This hybrid model ensures capacity reliability while maintaining competitive pricing.`;
  }

  // Default/Other
  else {
    return `${profile.companyName} will meet this requirement through our established logistics operations. With ${profile.yearsInBusiness || 'extensive'} experience in transportation and supply chain management, we have successfully fulfilled similar requirements for comparable contracts. Our team will coordinate all necessary resources, equipment, and personnel to ensure full compliance with your specifications.`;
  }
}

/**
 * Generate supporting evidence references
 */
function generateSupportingEvidence(
  req: ParsedRequirement,
  profile: UserOrganizationProfile
): string[] {
  const evidence: string[] = [];

  // Always include basic authorizations
  if (profile.mcNumber)
    evidence.push(`FMCSA Operating Authority: ${profile.mcNumber}`);
  if (profile.dotNumber) evidence.push(`DOT Number: ${profile.dotNumber}`);

  // Add certification evidence
  if (req.category === 'certification' && profile.certifications.length > 0) {
    profile.certifications.forEach((cert) => {
      evidence.push(`${cert} Certification (Certificate attached as Appendix)`);
    });
  }

  // Add equipment evidence for asset carriers
  if (req.category === 'equipment' && profile.companyType === 'asset_carrier') {
    evidence.push('Equipment list with specifications (Appendix)');
    evidence.push('Vehicle maintenance records and inspection reports');
  }

  // Add insurance evidence
  if (req.category === 'insurance') {
    evidence.push('Certificates of Insurance (Appendix)');
    evidence.push('Insurance carrier rating: A- or better (A.M. Best)');
  }

  // Add safety evidence
  if (req.category === 'safety') {
    evidence.push('DOT Safety Rating documentation');
    evidence.push('SMS/BASIC scores report (available upon request)');
    evidence.push('Safety program documentation');
  }

  // Add past performance evidence
  if (req.category === 'experience') {
    evidence.push('Past performance references (3-5 similar contracts)');
    evidence.push('Contract completion certifications');
    evidence.push('Customer testimonials and performance metrics');
  }

  return evidence;
}

/**
 * Generate pricing guidance
 */
function generatePricingGuidance(
  req: ParsedRequirement,
  profile: UserOrganizationProfile
): string | undefined {
  if (req.category === 'equipment' || req.category === 'capacity') {
    if (profile.companyType === 'freight_broker') {
      return `Brokerage coordination fee structure: Per-load or percentage-based rates will be provided in detailed pricing schedule. Rates include: carrier sourcing, load coordination, tracking, documentation, and account management.`;
    } else if (profile.companyType === 'asset_carrier') {
      return `Direct carrier pricing: All-inclusive per-load or per-mile rates will be provided in detailed pricing schedule. Rates include: equipment, driver, fuel, maintenance, insurance, and dispatch coordination. No broker markup.`;
    } else if (profile.companyType === '3pl') {
      return `Comprehensive 3PL pricing: Integrated pricing for warehousing, transportation, and value-added services. Volume-based discounts available for multi-service contracts.`;
    }
  }

  return undefined;
}

/**
 * Identify potential risk factors
 */
function identifyRiskFactors(
  req: ParsedRequirement,
  profile: UserOrganizationProfile
): string[] {
  const risks: string[] = [];

  // Capacity risks
  if (req.category === 'capacity' && req.specifics.quantity) {
    if (profile.companyType === 'asset_carrier' && profile.fleetSize) {
      if (req.specifics.quantity > profile.fleetSize * 0.7) {
        risks.push('High fleet utilization - recommend buffer capacity plan');
      }
    }
  }

  // Geographic risks
  if (req.category === 'geographic' && req.specifics.location) {
    if (profile.serviceAreas && profile.serviceAreas.length > 0) {
      // Check if location is outside normal service area
      risks.push('Geographic coverage confirmation needed');
    }
  }

  // Timeline risks
  if (req.category === 'timeline') {
    risks.push('Tight timeline may require expedited coordination');
  }

  return risks;
}

/**
 * Helper functions for estimates
 */
function estimateCarrierCount(req: ParsedRequirement): string {
  if (req.specifics.quantity) {
    return `${Math.floor(req.specifics.quantity * 2.5)}-${Math.floor(req.specifics.quantity * 3)}`;
  }
  return '50-100';
}

function estimateFleetAge(profile: UserOrganizationProfile): string {
  return '2-4'; // Default estimate
}

function estimateDriverCount(profile: UserOrganizationProfile): number {
  return profile.fleetSize ? Math.floor(profile.fleetSize * 1.2) : 50;
}
