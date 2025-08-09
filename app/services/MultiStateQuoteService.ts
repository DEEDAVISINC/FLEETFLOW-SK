/**
 * 🌎 MULTI-STATE CONSOLIDATED QUOTE SERVICE
 * Enterprise-grade multi-state logistics quote management system
 * Handles complex consolidated quotes across multiple states with advanced pricing
 */

export interface StateRouteGroup {
  state: string;
  stateName: string;
  region:
    | 'West Coast'
    | 'Southwest'
    | 'Midwest'
    | 'Southeast'
    | 'Northeast'
    | 'Mountain West';

  origins: Array<{
    id: string;
    city: string;
    address: string;
    coordinates: { lat: number; lng: number };
    facilityType:
      | 'warehouse'
      | 'manufacturing'
      | 'distribution'
      | 'retail'
      | 'port'
      | 'rail_yard';
    weeklyVolume: number;
    monthlyVolume: number;
    specialRequirements: string[];
    operatingHours: { start: string; end: string };
    dockCount: number;
    equipmentTypes: string[];
  }>;

  destinations: Array<{
    id: string;
    city: string;
    state: string;
    address: string;
    coordinates: { lat: number; lng: number };
    facilityType: string;
    weeklyVolume: number;
    monthlyVolume: number;
    timeWindows: Array<{ start: string; end: string }>;
    specialRequirements: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;

  stateRequirements: {
    permits: string[];
    regulations: string[];
    equipmentRestrictions: string[];
    driverRequirements: string[];
    seasonalConsiderations: string[];
    weatherFactors: string[];
    tolls: { average: number; routes: string[] };
    fuelTaxes: number;
  };

  stateMetrics: {
    averageTransitTime: number; // hours
    congestionFactor: number; // 1.0 = normal, 1.5 = high congestion
    costMultiplier: number; // state cost adjustment
    seasonalVariation: number; // percentage seasonal rate change
    weatherRisk: 'low' | 'medium' | 'high';
    regulatoryComplexity: 'simple' | 'moderate' | 'complex';
  };
}

export interface ConsolidatedPricingModel {
  type:
    | 'master_contract'
    | 'zone_based'
    | 'volume_tiered'
    | 'hybrid'
    | 'performance_based';

  baseRates: {
    perMile: number;
    perStop: number;
    perHour: number;
    fuelSurcharge: number;
    accessorials: Record<string, number>;
  };

  volumeDiscounts: Array<{
    threshold: number; // loads per month
    discount: number; // percentage
    description: string;
  }>;

  stateMultipliers: Record<
    string,
    {
      multiplier: number;
      reasoning: string;
      factors: string[];
    }
  >;

  seasonalAdjustments: Record<
    string,
    {
      months: string[];
      adjustment: number;
      reasoning: string;
    }
  >;

  performanceIncentives: {
    onTimeDelivery: { threshold: number; bonus: number };
    fuelEfficiency: { threshold: number; bonus: number };
    safetyRating: { threshold: number; bonus: number };
    customerSatisfaction: { threshold: number; bonus: number };
  };
}

export interface ServiceLevelAgreement {
  transitTimes: Record<string, number>; // state-to-state guaranteed times
  onTimeDeliveryGuarantee: number; // percentage
  communicationRequirements: {
    frequency: 'real-time' | 'hourly' | 'daily';
    methods: string[];
    escalationProcedure: string[];
  };
  reportingRequirements: {
    frequency: 'daily' | 'weekly' | 'monthly';
    metrics: string[];
    dashboardAccess: boolean;
    customReports: boolean;
  };
  qualityStandards: {
    driverRequirements: string[];
    equipmentStandards: string[];
    safetyRating: number;
    insuranceLimits: Record<string, number>;
  };
}

export interface ContractTerms {
  duration: string;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  renewalTerms: string;

  volumeCommitments: Record<
    string,
    {
      minimum: number;
      maximum?: number;
      penalty: number;
    }
  >;

  rateProtection: {
    fuelSurchargeProtection: boolean;
    maximumIncrease: number; // annual percentage
    adjustmentFrequency: 'monthly' | 'quarterly' | 'annually';
  };

  penalties: Record<
    string,
    {
      description: string;
      amount: number;
      type: 'flat' | 'percentage' | 'per_occurrence';
    }
  >;

  incentives: Record<
    string,
    {
      description: string;
      reward: number;
      criteria: string;
    }
  >;

  terminationClauses: {
    noticePeriod: number; // days
    earlyTerminationFee: number;
    forCauseTermination: string[];
  };
}

export interface MultiStateConsolidatedQuote {
  // Quote Identity
  id: string;
  quoteName: string;
  client: {
    name: string;
    industry: string;
    headquarters: string;
    annualRevenue?: number;
    employees?: number;
    contactPerson: string;
    email: string;
    phone: string;
  };

  // Quote Status & Timing
  status:
    | 'draft'
    | 'pending'
    | 'submitted'
    | 'under_review'
    | 'negotiating'
    | 'approved'
    | 'rejected'
    | 'expired';
  createdDate: string;
  submittedDate?: string;
  expirationDate: string;
  lastModified: string;

  // Multi-State Configuration
  stateRoutes: StateRouteGroup[];
  consolidatedPricing: ConsolidatedPricingModel;
  sla: ServiceLevelAgreement;
  contractTerms: ContractTerms;

  // Financial Summary
  financialSummary: {
    totalAnnualVolume: number; // estimated loads
    totalAnnualMiles: number;
    totalAnnualRevenue: number;
    averageRevenuePerLoad: number;
    profitMargin: number;
    roi: number;
    paybackPeriod: number; // months
  };

  // Risk Assessment
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    riskFactors: Array<{
      category: string;
      risk: string;
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    creditRating?: string;
    insuranceRequirements: string[];
  };

  // Competitive Analysis
  competitiveAnalysis: {
    competitors: string[];
    ourAdvantages: string[];
    pricingPosition: 'aggressive' | 'competitive' | 'premium';
    winProbability: number; // percentage
    keyDifferentiators: string[];
  };

  // Implementation Plan
  implementationPlan: {
    phases: Array<{
      phase: number;
      description: string;
      duration: number; // days
      milestones: string[];
      resources: string[];
    }>;
    totalImplementationTime: number; // days
    trainingRequirements: string[];
    technologyRequirements: string[];
  };

  // Supporting Documents
  documents: Array<{
    id: string;
    name: string;
    type:
      | 'proposal'
      | 'contract'
      | 'sla'
      | 'pricing'
      | 'analysis'
      | 'presentation';
    url?: string;
    createdDate: string;
  }>;

  // Internal Notes & Collaboration
  internalNotes: Array<{
    id: string;
    author: string;
    timestamp: string;
    note: string;
    category:
      | 'pricing'
      | 'risk'
      | 'implementation'
      | 'competitive'
      | 'client_feedback';
  }>;

  // Approval Workflow
  approvalWorkflow: {
    currentStage: string;
    requiredApprovals: Array<{
      role: string;
      approver?: string;
      status: 'pending' | 'approved' | 'rejected';
      timestamp?: string;
      comments?: string;
    }>;
  };
}

export class MultiStateQuoteService {
  private quotes: Map<string, MultiStateConsolidatedQuote> = new Map();

  // Comprehensive State/Province/State Configuration Data
  private stateConfigurations = {
    // === UNITED STATES ===
    // West Coast Region
    CA: {
      stateName: 'California',
      region: 'West Coast' as const,
      costMultiplier: 1.25,
      congestionFactor: 1.4,
      permits: ['CARB Compliance', 'Oversize Permits', 'Hazmat Endorsement'],
      regulations: [
        'AB5 Compliance',
        'CARB Diesel Regulations',
        'Port Drayage Rules',
      ],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Los Angeles',
        'San Francisco',
        'San Diego',
        'Sacramento',
        'Oakland',
      ],
      fuelTaxRate: 0.511,
      averageDriverWage: 28.5,
      keyIndustries: ['Technology', 'Agriculture', 'Entertainment', 'Ports'],
    },
    WA: {
      stateName: 'Washington',
      region: 'West Coast' as const,
      costMultiplier: 1.18,
      congestionFactor: 1.2,
      permits: ['Oversize Permits', 'Environmental Permits'],
      regulations: ['Seattle Traffic Restrictions', 'Port Access Rules'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
      fuelTaxRate: 0.494,
      averageDriverWage: 26.75,
      keyIndustries: ['Technology', 'Aerospace', 'Agriculture', 'Ports'],
    },
    OR: {
      stateName: 'Oregon',
      region: 'West Coast' as const,
      costMultiplier: 1.12,
      congestionFactor: 1.1,
      permits: ['Oversize Permits', 'DEQ Permits'],
      regulations: ['Portland Metro Restrictions', 'Environmental Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro'],
      fuelTaxRate: 0.38,
      averageDriverWage: 25.2,
      keyIndustries: ['Technology', 'Forestry', 'Agriculture', 'Manufacturing'],
    },
    NV: {
      stateName: 'Nevada',
      region: 'Mountain West' as const,
      costMultiplier: 1.08,
      congestionFactor: 1.05,
      permits: ['Oversize Permits', 'Mining Permits'],
      regulations: ['Las Vegas Restrictions', 'Desert Driving Requirements'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Las Vegas',
        'Reno',
        'Henderson',
        'North Las Vegas',
        'Sparks',
      ],
      fuelTaxRate: 0.274,
      averageDriverWage: 24.8,
      keyIndustries: ['Mining', 'Tourism', 'Logistics', 'Manufacturing'],
    },
    AK: {
      stateName: 'Alaska',
      region: 'West Coast' as const,
      costMultiplier: 1.45,
      congestionFactor: 0.8,
      permits: ['Arctic Permits', 'Environmental Permits'],
      regulations: ['Extreme Weather Requirements', 'Remote Area Protocols'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.35,
      majorCities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
      fuelTaxRate: 0.0895,
      averageDriverWage: 32.5,
      keyIndustries: ['Oil & Gas', 'Fishing', 'Tourism', 'Mining'],
    },
    HI: {
      stateName: 'Hawaii',
      region: 'West Coast' as const,
      costMultiplier: 1.55,
      congestionFactor: 1.3,
      permits: ['Island Transport Permits', 'Environmental Permits'],
      regulations: ['Inter-Island Shipping', 'Agricultural Restrictions'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.05,
      majorCities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu'],
      fuelTaxRate: 0.17,
      averageDriverWage: 28.9,
      keyIndustries: ['Tourism', 'Agriculture', 'Military', 'Shipping'],
    },

    // Southwest Region
    TX: {
      stateName: 'Texas',
      region: 'Southwest' as const,
      costMultiplier: 1.0,
      congestionFactor: 1.1,
      permits: ['Oversize Permits', 'Hazmat Endorsement'],
      regulations: [
        'Texas Motor Carrier Requirements',
        'Border Crossing Procedures',
      ],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.08,
      majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
      fuelTaxRate: 0.2,
      averageDriverWage: 22.5,
      keyIndustries: [
        'Oil & Gas',
        'Technology',
        'Agriculture',
        'Manufacturing',
      ],
    },
    AZ: {
      stateName: 'Arizona',
      region: 'Southwest' as const,
      costMultiplier: 1.02,
      congestionFactor: 1.08,
      permits: ['Oversize Permits', 'Desert Operations'],
      regulations: ['Phoenix Metro Restrictions', 'Border Protocols'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
      fuelTaxRate: 0.19,
      averageDriverWage: 23.75,
      keyIndustries: ['Manufacturing', 'Mining', 'Agriculture', 'Tourism'],
    },
    NM: {
      stateName: 'New Mexico',
      region: 'Southwest' as const,
      costMultiplier: 0.98,
      congestionFactor: 0.9,
      permits: ['Oversize Permits', 'Nuclear Transport'],
      regulations: ['Tribal Land Protocols', 'Environmental Restrictions'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Albuquerque',
        'Las Cruces',
        'Rio Rancho',
        'Santa Fe',
        'Roswell',
      ],
      fuelTaxRate: 0.1875,
      averageDriverWage: 21.8,
      keyIndustries: ['Oil & Gas', 'Mining', 'Agriculture', 'Government'],
    },
    UT: {
      stateName: 'Utah',
      region: 'Mountain West' as const,
      costMultiplier: 1.05,
      congestionFactor: 1.02,
      permits: ['Oversize Permits', 'Mountain Passes'],
      regulations: ['Salt Lake Metro', 'Winter Driving Requirements'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.18,
      majorCities: [
        'Salt Lake City',
        'West Valley City',
        'Provo',
        'West Jordan',
        'Orem',
      ],
      fuelTaxRate: 0.314,
      averageDriverWage: 23.25,
      keyIndustries: ['Mining', 'Technology', 'Manufacturing', 'Agriculture'],
    },
    CO: {
      stateName: 'Colorado',
      region: 'Mountain West' as const,
      costMultiplier: 1.08,
      congestionFactor: 1.12,
      permits: ['Mountain Passes', 'Chain Requirements'],
      regulations: ['Denver Metro Restrictions', 'High Altitude Operations'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.22,
      majorCities: [
        'Denver',
        'Colorado Springs',
        'Aurora',
        'Fort Collins',
        'Lakewood',
      ],
      fuelTaxRate: 0.2275,
      averageDriverWage: 24.5,
      keyIndustries: ['Aerospace', 'Technology', 'Agriculture', 'Energy'],
    },

    // Midwest Region
    IL: {
      stateName: 'Illinois',
      region: 'Midwest' as const,
      costMultiplier: 1.05,
      congestionFactor: 1.3,
      permits: ['IFTA Permits', 'Oversize Permits'],
      regulations: ['Chicago Truck Routes', 'Environmental Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville'],
      fuelTaxRate: 0.382,
      averageDriverWage: 25.75,
      keyIndustries: [
        'Manufacturing',
        'Agriculture',
        'Transportation',
        'Finance',
      ],
    },
    IN: {
      stateName: 'Indiana',
      region: 'Midwest' as const,
      costMultiplier: 0.95,
      congestionFactor: 1.1,
      permits: ['Oversize Permits', 'Hazmat Endorsement'],
      regulations: ['Indianapolis Metro', 'Manufacturing Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: [
        'Indianapolis',
        'Fort Wayne',
        'Evansville',
        'South Bend',
        'Carmel',
      ],
      fuelTaxRate: 0.33,
      averageDriverWage: 22.9,
      keyIndustries: [
        'Manufacturing',
        'Agriculture',
        'Pharmaceuticals',
        'Logistics',
      ],
    },
    OH: {
      stateName: 'Ohio',
      region: 'Midwest' as const,
      costMultiplier: 0.98,
      congestionFactor: 1.15,
      permits: ['Oversize Permits', 'Turnpike Permits'],
      regulations: ['Cleveland-Cincinnati Corridor', 'Manufacturing Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
      fuelTaxRate: 0.385,
      averageDriverWage: 23.5,
      keyIndustries: [
        'Manufacturing',
        'Agriculture',
        'Healthcare',
        'Aerospace',
      ],
    },
    MI: {
      stateName: 'Michigan',
      region: 'Midwest' as const,
      costMultiplier: 1.02,
      congestionFactor: 1.18,
      permits: ['Oversize Permits', 'Bridge Crossings'],
      regulations: ['Detroit Metro', 'Great Lakes Shipping'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.2,
      majorCities: [
        'Detroit',
        'Grand Rapids',
        'Warren',
        'Sterling Heights',
        'Lansing',
      ],
      fuelTaxRate: 0.2733,
      averageDriverWage: 24.25,
      keyIndustries: [
        'Automotive',
        'Manufacturing',
        'Agriculture',
        'Technology',
      ],
    },
    WI: {
      stateName: 'Wisconsin',
      region: 'Midwest' as const,
      costMultiplier: 1.0,
      congestionFactor: 1.05,
      permits: ['Oversize Permits', 'Dairy Transport'],
      regulations: ['Milwaukee Metro', 'Agricultural Regulations'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.18,
      majorCities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
      fuelTaxRate: 0.329,
      averageDriverWage: 23.8,
      keyIndustries: ['Manufacturing', 'Agriculture', 'Paper', 'Tourism'],
    },
    MN: {
      stateName: 'Minnesota',
      region: 'Midwest' as const,
      costMultiplier: 1.08,
      congestionFactor: 1.0,
      permits: ['Winter Weight Restrictions', 'Oversize Permits'],
      regulations: ['Winter Driving Requirements', 'Environmental Regulations'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.25,
      majorCities: [
        'Minneapolis',
        'St. Paul',
        'Rochester',
        'Duluth',
        'Bloomington',
      ],
      fuelTaxRate: 0.286,
      averageDriverWage: 25.4,
      keyIndustries: ['Agriculture', 'Manufacturing', 'Healthcare', 'Mining'],
    },
    IA: {
      stateName: 'Iowa',
      region: 'Midwest' as const,
      costMultiplier: 0.92,
      congestionFactor: 0.85,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Agricultural Regulations', 'Biofuel Requirements'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Des Moines',
        'Cedar Rapids',
        'Davenport',
        'Sioux City',
        'Iowa City',
      ],
      fuelTaxRate: 0.309,
      averageDriverWage: 22.1,
      keyIndustries: [
        'Agriculture',
        'Manufacturing',
        'Insurance',
        'Renewable Energy',
      ],
    },
    MO: {
      stateName: 'Missouri',
      region: 'Midwest' as const,
      costMultiplier: 0.94,
      congestionFactor: 1.08,
      permits: ['Oversize Permits', 'River Crossing'],
      regulations: ['Kansas City-St. Louis Corridor', 'Agricultural Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Kansas City',
        'St. Louis',
        'Springfield',
        'Independence',
        'Columbia',
      ],
      fuelTaxRate: 0.1742,
      averageDriverWage: 21.95,
      keyIndustries: [
        'Agriculture',
        'Manufacturing',
        'Transportation',
        'Aerospace',
      ],
    },
    ND: {
      stateName: 'North Dakota',
      region: 'Midwest' as const,
      costMultiplier: 1.15,
      congestionFactor: 0.7,
      permits: ['Oversize Permits', 'Oil Field Operations'],
      regulations: ['Bakken Oil Field', 'Winter Driving Requirements'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.3,
      majorCities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
      fuelTaxRate: 0.23,
      averageDriverWage: 28.75,
      keyIndustries: ['Oil & Gas', 'Agriculture', 'Mining', 'Energy'],
    },
    SD: {
      stateName: 'South Dakota',
      region: 'Midwest' as const,
      costMultiplier: 0.96,
      congestionFactor: 0.75,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Agricultural Regulations', 'Tourism Areas'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.22,
      majorCities: [
        'Sioux Falls',
        'Rapid City',
        'Aberdeen',
        'Brookings',
        'Watertown',
      ],
      fuelTaxRate: 0.3,
      averageDriverWage: 21.5,
      keyIndustries: ['Agriculture', 'Tourism', 'Manufacturing', 'Healthcare'],
    },
    NE: {
      stateName: 'Nebraska',
      region: 'Midwest' as const,
      costMultiplier: 0.93,
      congestionFactor: 0.8,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Agricultural Regulations', 'Interstate Corridors'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.18,
      majorCities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
      fuelTaxRate: 0.279,
      averageDriverWage: 22.25,
      keyIndustries: [
        'Agriculture',
        'Manufacturing',
        'Transportation',
        'Insurance',
      ],
    },
    KS: {
      stateName: 'Kansas',
      region: 'Midwest' as const,
      costMultiplier: 0.91,
      congestionFactor: 0.85,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Agricultural Regulations', 'Wind Energy Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Wichita',
        'Overland Park',
        'Kansas City',
        'Topeka',
        'Olathe',
      ],
      fuelTaxRate: 0.2603,
      averageDriverWage: 21.75,
      keyIndustries: ['Agriculture', 'Manufacturing', 'Aerospace', 'Energy'],
    },

    // Southeast Region
    FL: {
      stateName: 'Florida',
      region: 'Southeast' as const,
      costMultiplier: 1.08,
      congestionFactor: 1.25,
      permits: ['Oversize Permits', 'Hurricane Protocols'],
      regulations: ['Miami-Orlando Corridor', 'Port Access Rules'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Jacksonville',
        'Miami',
        'Tampa',
        'Orlando',
        'St. Petersburg',
      ],
      fuelTaxRate: 0.3424,
      averageDriverWage: 23.9,
      keyIndustries: ['Tourism', 'Agriculture', 'Aerospace', 'Ports'],
    },
    GA: {
      stateName: 'Georgia',
      region: 'Southeast' as const,
      costMultiplier: 0.95,
      congestionFactor: 1.15,
      permits: ['Oversize Permits', 'Port Access Permits'],
      regulations: [
        'Port of Savannah Requirements',
        'Atlanta Metro Restrictions',
      ],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.05,
      majorCities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
      fuelTaxRate: 0.2912,
      averageDriverWage: 22.8,
      keyIndustries: ['Logistics', 'Agriculture', 'Manufacturing', 'Ports'],
    },
    AL: {
      stateName: 'Alabama',
      region: 'Southeast' as const,
      costMultiplier: 0.88,
      congestionFactor: 0.95,
      permits: ['Oversize Permits', 'Port Access'],
      regulations: ['Birmingham-Mobile Corridor', 'Steel Industry'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Birmingham',
        'Montgomery',
        'Mobile',
        'Huntsville',
        'Tuscaloosa',
      ],
      fuelTaxRate: 0.19,
      averageDriverWage: 20.5,
      keyIndustries: ['Manufacturing', 'Agriculture', 'Mining', 'Aerospace'],
    },
    SC: {
      stateName: 'South Carolina',
      region: 'Southeast' as const,
      costMultiplier: 0.92,
      congestionFactor: 1.05,
      permits: ['Oversize Permits', 'Port Access'],
      regulations: ['Charleston Port', 'Manufacturing Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.06,
      majorCities: [
        'Charleston',
        'Columbia',
        'North Charleston',
        'Mount Pleasant',
        'Rock Hill',
      ],
      fuelTaxRate: 0.2275,
      averageDriverWage: 21.25,
      keyIndustries: ['Manufacturing', 'Agriculture', 'Tourism', 'Ports'],
    },
    NC: {
      stateName: 'North Carolina',
      region: 'Southeast' as const,
      costMultiplier: 0.96,
      congestionFactor: 1.12,
      permits: ['Oversize Permits', 'Mountain Passes'],
      regulations: ['Charlotte Metro', 'Research Triangle'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: [
        'Charlotte',
        'Raleigh',
        'Greensboro',
        'Durham',
        'Winston-Salem',
      ],
      fuelTaxRate: 0.3525,
      averageDriverWage: 22.4,
      keyIndustries: ['Manufacturing', 'Technology', 'Agriculture', 'Finance'],
    },
    TN: {
      stateName: 'Tennessee',
      region: 'Southeast' as const,
      costMultiplier: 0.93,
      congestionFactor: 1.08,
      permits: ['Oversize Permits', 'Music Industry Transport'],
      regulations: ['Nashville-Memphis Corridor', 'Manufacturing Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: [
        'Nashville',
        'Memphis',
        'Knoxville',
        'Chattanooga',
        'Clarksville',
      ],
      fuelTaxRate: 0.264,
      averageDriverWage: 21.8,
      keyIndustries: ['Manufacturing', 'Music', 'Agriculture', 'Healthcare'],
    },
    KY: {
      stateName: 'Kentucky',
      region: 'Southeast' as const,
      costMultiplier: 0.9,
      congestionFactor: 1.0,
      permits: ['Oversize Permits', 'Bourbon Transport'],
      regulations: ['Louisville Metro', 'Coal Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Louisville',
        'Lexington',
        'Bowling Green',
        'Owensboro',
        'Covington',
      ],
      fuelTaxRate: 0.263,
      averageDriverWage: 21.6,
      keyIndustries: ['Manufacturing', 'Agriculture', 'Coal', 'Bourbon'],
    },
    MS: {
      stateName: 'Mississippi',
      region: 'Southeast' as const,
      costMultiplier: 0.85,
      congestionFactor: 0.85,
      permits: ['Oversize Permits', 'River Transport'],
      regulations: ['Mississippi River', 'Agricultural Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Jackson',
        'Gulfport',
        'Southaven',
        'Hattiesburg',
        'Biloxi',
      ],
      fuelTaxRate: 0.1884,
      averageDriverWage: 19.75,
      keyIndustries: ['Agriculture', 'Manufacturing', 'Oil & Gas', 'Forestry'],
    },
    LA: {
      stateName: 'Louisiana',
      region: 'Southeast' as const,
      costMultiplier: 0.92,
      congestionFactor: 1.05,
      permits: ['Oversize Permits', 'Port Access', 'Hurricane Protocols'],
      regulations: ['Port of New Orleans', 'Oil & Gas Industry'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'New Orleans',
        'Baton Rouge',
        'Shreveport',
        'Lafayette',
        'Lake Charles',
      ],
      fuelTaxRate: 0.2054,
      averageDriverWage: 21.4,
      keyIndustries: ['Oil & Gas', 'Ports', 'Agriculture', 'Petrochemicals'],
    },
    AR: {
      stateName: 'Arkansas',
      region: 'Southeast' as const,
      costMultiplier: 0.87,
      congestionFactor: 0.9,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Walmart Corridor', 'Agricultural Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: [
        'Little Rock',
        'Fort Smith',
        'Fayetteville',
        'Springdale',
        'Jonesboro',
      ],
      fuelTaxRate: 0.247,
      averageDriverWage: 20.25,
      keyIndustries: ['Agriculture', 'Manufacturing', 'Retail', 'Forestry'],
    },
    OK: {
      stateName: 'Oklahoma',
      region: 'Southwest' as const,
      costMultiplier: 0.89,
      congestionFactor: 0.95,
      permits: ['Oversize Permits', 'Oil Field Operations'],
      regulations: ['Oil & Gas Transport', 'Tribal Lands'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Oklahoma City',
        'Tulsa',
        'Norman',
        'Broken Arrow',
        'Lawton',
      ],
      fuelTaxRate: 0.19,
      averageDriverWage: 21.1,
      keyIndustries: ['Oil & Gas', 'Agriculture', 'Aerospace', 'Manufacturing'],
    },

    // Northeast Region
    NY: {
      stateName: 'New York',
      region: 'Northeast' as const,
      costMultiplier: 1.35,
      congestionFactor: 1.5,
      permits: ['NYC Permits', 'Oversize Permits', 'Hazmat Endorsement'],
      regulations: ['NYC Truck Routes', 'Port Authority Rules'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'New York City',
        'Buffalo',
        'Rochester',
        'Yonkers',
        'Syracuse',
      ],
      fuelTaxRate: 0.4533,
      averageDriverWage: 29.5,
      keyIndustries: ['Finance', 'Manufacturing', 'Agriculture', 'Ports'],
    },
    PA: {
      stateName: 'Pennsylvania',
      region: 'Northeast' as const,
      costMultiplier: 1.12,
      congestionFactor: 1.2,
      permits: ['Oversize Permits', 'Turnpike Permits'],
      regulations: ['Philadelphia Metro', 'Pittsburgh Restrictions'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Philadelphia',
        'Pittsburgh',
        'Allentown',
        'Erie',
        'Reading',
      ],
      fuelTaxRate: 0.583,
      averageDriverWage: 25.9,
      keyIndustries: ['Manufacturing', 'Agriculture', 'Healthcare', 'Energy'],
    },
    NJ: {
      stateName: 'New Jersey',
      region: 'Northeast' as const,
      costMultiplier: 1.28,
      congestionFactor: 1.4,
      permits: ['Oversize Permits', 'Port Access', 'Hazmat Endorsement'],
      regulations: ['Port of Newark', 'Turnpike Restrictions'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Newark',
        'Jersey City',
        'Paterson',
        'Elizabeth',
        'Trenton',
      ],
      fuelTaxRate: 0.424,
      averageDriverWage: 27.8,
      keyIndustries: ['Ports', 'Pharmaceuticals', 'Manufacturing', 'Finance'],
    },
    CT: {
      stateName: 'Connecticut',
      region: 'Northeast' as const,
      costMultiplier: 1.22,
      congestionFactor: 1.25,
      permits: ['Oversize Permits', 'Environmental Permits'],
      regulations: ['I-95 Corridor', 'Environmental Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.14,
      majorCities: [
        'Bridgeport',
        'New Haven',
        'Hartford',
        'Stamford',
        'Waterbury',
      ],
      fuelTaxRate: 0.25,
      averageDriverWage: 26.4,
      keyIndustries: ['Finance', 'Insurance', 'Manufacturing', 'Aerospace'],
    },
    MA: {
      stateName: 'Massachusetts',
      region: 'Northeast' as const,
      costMultiplier: 1.3,
      congestionFactor: 1.35,
      permits: ['Oversize Permits', 'Boston Permits'],
      regulations: ['Big Dig Restrictions', 'Port of Boston'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.16,
      majorCities: [
        'Boston',
        'Worcester',
        'Springfield',
        'Lowell',
        'Cambridge',
      ],
      fuelTaxRate: 0.265,
      averageDriverWage: 28.75,
      keyIndustries: ['Technology', 'Healthcare', 'Education', 'Finance'],
    },
    RI: {
      stateName: 'Rhode Island',
      region: 'Northeast' as const,
      costMultiplier: 1.25,
      congestionFactor: 1.2,
      permits: ['Oversize Permits', 'Port Access'],
      regulations: ['I-95 Corridor', 'Port Restrictions'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.14,
      majorCities: [
        'Providence',
        'Warwick',
        'Cranston',
        'Pawtucket',
        'East Providence',
      ],
      fuelTaxRate: 0.35,
      averageDriverWage: 25.9,
      keyIndustries: ['Manufacturing', 'Healthcare', 'Tourism', 'Ports'],
    },
    VT: {
      stateName: 'Vermont',
      region: 'Northeast' as const,
      costMultiplier: 1.18,
      congestionFactor: 0.8,
      permits: ['Oversize Permits', 'Mountain Passes'],
      regulations: ['Environmental Regulations', 'Winter Driving'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.25,
      majorCities: [
        'Burlington',
        'South Burlington',
        'Rutland',
        'Barre',
        'Montpelier',
      ],
      fuelTaxRate: 0.311,
      averageDriverWage: 24.5,
      keyIndustries: ['Agriculture', 'Tourism', 'Manufacturing', 'Forestry'],
    },
    NH: {
      stateName: 'New Hampshire',
      region: 'Northeast' as const,
      costMultiplier: 1.15,
      congestionFactor: 0.9,
      permits: ['Oversize Permits', 'Mountain Passes'],
      regulations: ['I-93 Restrictions', 'Winter Requirements'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.22,
      majorCities: ['Manchester', 'Nashua', 'Concord', 'Dover', 'Rochester'],
      fuelTaxRate: 0.2378,
      averageDriverWage: 25.1,
      keyIndustries: ['Manufacturing', 'Technology', 'Tourism', 'Agriculture'],
    },
    ME: {
      stateName: 'Maine',
      region: 'Northeast' as const,
      costMultiplier: 1.2,
      congestionFactor: 0.85,
      permits: ['Oversize Permits', 'Forestry Transport'],
      regulations: ['Forestry Regulations', 'Coastal Access'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.28,
      majorCities: [
        'Portland',
        'Lewiston',
        'Bangor',
        'South Portland',
        'Auburn',
      ],
      fuelTaxRate: 0.309,
      averageDriverWage: 24.25,
      keyIndustries: ['Forestry', 'Fishing', 'Tourism', 'Agriculture'],
    },

    // Mountain West Region
    MT: {
      stateName: 'Montana',
      region: 'Mountain West' as const,
      costMultiplier: 1.12,
      congestionFactor: 0.7,
      permits: ['Oversize Permits', 'Mountain Passes'],
      regulations: ['Winter Driving', 'Mining Transport'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.3,
      majorCities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena'],
      fuelTaxRate: 0.2775,
      averageDriverWage: 23.8,
      keyIndustries: ['Mining', 'Agriculture', 'Energy', 'Tourism'],
    },
    WY: {
      stateName: 'Wyoming',
      region: 'Mountain West' as const,
      costMultiplier: 1.08,
      congestionFactor: 0.6,
      permits: ['Oversize Permits', 'Mining Operations'],
      regulations: ['Energy Corridor', 'Winter Driving'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.28,
      majorCities: [
        'Cheyenne',
        'Casper',
        'Laramie',
        'Gillette',
        'Rock Springs',
      ],
      fuelTaxRate: 0.24,
      averageDriverWage: 26.5,
      keyIndustries: ['Mining', 'Energy', 'Agriculture', 'Tourism'],
    },
    ID: {
      stateName: 'Idaho',
      region: 'Mountain West' as const,
      costMultiplier: 1.02,
      congestionFactor: 0.8,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Agricultural Regulations', 'Mountain Passes'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.18,
      majorCities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'],
      fuelTaxRate: 0.33,
      averageDriverWage: 22.75,
      keyIndustries: ['Agriculture', 'Technology', 'Manufacturing', 'Mining'],
    },

    // Mid-Atlantic Region
    MD: {
      stateName: 'Maryland',
      region: 'Northeast' as const,
      costMultiplier: 1.18,
      congestionFactor: 1.3,
      permits: ['Oversize Permits', 'Port Access', 'DC Area'],
      regulations: ['Baltimore Port', 'Washington DC Corridor'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Baltimore',
        'Frederick',
        'Rockville',
        'Gaithersburg',
        'Bowie',
      ],
      fuelTaxRate: 0.376,
      averageDriverWage: 26.9,
      keyIndustries: ['Government', 'Ports', 'Healthcare', 'Technology'],
    },
    DE: {
      stateName: 'Delaware',
      region: 'Northeast' as const,
      costMultiplier: 1.15,
      congestionFactor: 1.15,
      permits: ['Oversize Permits', 'Chemical Transport'],
      regulations: ['Chemical Corridor', 'Port Access'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'],
      fuelTaxRate: 0.23,
      averageDriverWage: 25.5,
      keyIndustries: ['Chemicals', 'Finance', 'Agriculture', 'Manufacturing'],
    },
    DC: {
      stateName: 'Washington D.C.',
      region: 'Northeast' as const,
      costMultiplier: 1.4,
      congestionFactor: 1.6,
      permits: ['DC Permits', 'Security Clearance'],
      regulations: ['Federal Security', 'Restricted Zones'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.08,
      majorCities: ['Washington'],
      fuelTaxRate: 0.2375,
      averageDriverWage: 31.25,
      keyIndustries: ['Government', 'Tourism', 'Education', 'Healthcare'],
    },
    VA: {
      stateName: 'Virginia',
      region: 'Southeast' as const,
      costMultiplier: 1.05,
      congestionFactor: 1.18,
      permits: ['Oversize Permits', 'Port Access'],
      regulations: ['Norfolk Port', 'DC Metro Area'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Virginia Beach',
        'Norfolk',
        'Chesapeake',
        'Richmond',
        'Newport News',
      ],
      fuelTaxRate: 0.271,
      averageDriverWage: 23.8,
      keyIndustries: ['Government', 'Military', 'Ports', 'Agriculture'],
    },
    WV: {
      stateName: 'West Virginia',
      region: 'Southeast' as const,
      costMultiplier: 0.95,
      congestionFactor: 0.9,
      permits: ['Oversize Permits', 'Coal Transport'],
      regulations: ['Coal Transport', 'Mountain Passes'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Charleston',
        'Huntington',
        'Parkersburg',
        'Morgantown',
        'Wheeling',
      ],
      fuelTaxRate: 0.359,
      averageDriverWage: 22.4,
      keyIndustries: ['Coal', 'Chemicals', 'Steel', 'Natural Gas'],
    },

    // === CANADA ===
    // Western Canada
    BC: {
      stateName: 'British Columbia',
      region: 'West Coast' as const,
      costMultiplier: 1.32,
      congestionFactor: 1.25,
      permits: ['Oversize Permits', 'Mountain Passes', 'Environmental Permits'],
      regulations: ['Vancouver Metro', 'Port Access', 'Environmental Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.18,
      majorCities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford'],
      fuelTaxRate: 0.67, // CAD per liter converted
      averageDriverWage: 32.5, // CAD
      keyIndustries: ['Forestry', 'Mining', 'Ports', 'Tourism'],
    },
    AB: {
      stateName: 'Alberta',
      region: 'Mountain West' as const,
      costMultiplier: 1.18,
      congestionFactor: 1.05,
      permits: ['Oversize Permits', 'Oil Sands Operations'],
      regulations: ['Oil Sands Transport', 'Winter Driving'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.25,
      majorCities: [
        'Calgary',
        'Edmonton',
        'Red Deer',
        'Lethbridge',
        'Medicine Hat',
      ],
      fuelTaxRate: 0.13, // CAD per liter
      averageDriverWage: 35.75, // CAD
      keyIndustries: ['Oil & Gas', 'Agriculture', 'Forestry', 'Technology'],
    },
    SK: {
      stateName: 'Saskatchewan',
      region: 'Midwest' as const,
      costMultiplier: 1.08,
      congestionFactor: 0.8,
      permits: ['Oversize Permits', 'Agricultural Transport'],
      regulations: ['Agricultural Regulations', 'Mining Transport'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.3,
      majorCities: [
        'Saskatoon',
        'Regina',
        'Prince Albert',
        'Moose Jaw',
        'Swift Current',
      ],
      fuelTaxRate: 0.15, // CAD per liter
      averageDriverWage: 28.9, // CAD
      keyIndustries: ['Agriculture', 'Mining', 'Oil & Gas', 'Forestry'],
    },
    MB: {
      stateName: 'Manitoba',
      region: 'Midwest' as const,
      costMultiplier: 1.12,
      congestionFactor: 0.9,
      permits: ['Oversize Permits', 'Winter Operations'],
      regulations: ['Agricultural Transport', 'Winter Driving'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.28,
      majorCities: [
        'Winnipeg',
        'Brandon',
        'Steinbach',
        'Thompson',
        'Portage la Prairie',
      ],
      fuelTaxRate: 0.14, // CAD per liter
      averageDriverWage: 27.25, // CAD
      keyIndustries: [
        'Agriculture',
        'Manufacturing',
        'Mining',
        'Transportation',
      ],
    },

    // Central Canada
    ON: {
      stateName: 'Ontario',
      region: 'Northeast' as const,
      costMultiplier: 1.25,
      congestionFactor: 1.35,
      permits: ['Oversize Permits', 'CVOR Certificate'],
      regulations: ['GTA Restrictions', 'Manufacturing Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.2,
      majorCities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton'],
      fuelTaxRate: 0.147, // CAD per liter
      averageDriverWage: 31.5, // CAD
      keyIndustries: ['Manufacturing', 'Finance', 'Technology', 'Agriculture'],
    },
    QC: {
      stateName: 'Quebec',
      region: 'Northeast' as const,
      costMultiplier: 1.22,
      congestionFactor: 1.28,
      permits: ['Oversize Permits', 'Language Requirements'],
      regulations: ['French Language Laws', 'Montreal Metro'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.22,
      majorCities: [
        'Montreal',
        'Quebec City',
        'Laval',
        'Gatineau',
        'Longueuil',
      ],
      fuelTaxRate: 0.192, // CAD per liter
      averageDriverWage: 29.75, // CAD
      keyIndustries: ['Manufacturing', 'Mining', 'Forestry', 'Aerospace'],
    },

    // Atlantic Canada
    NB: {
      stateName: 'New Brunswick',
      region: 'Northeast' as const,
      costMultiplier: 1.15,
      congestionFactor: 0.85,
      permits: ['Oversize Permits', 'Forestry Transport'],
      regulations: ['Forestry Regulations', 'Port Access'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.25,
      majorCities: [
        'Saint John',
        'Moncton',
        'Fredericton',
        'Dieppe',
        'Riverview',
      ],
      fuelTaxRate: 0.1085, // CAD per liter
      averageDriverWage: 25.8, // CAD
      keyIndustries: ['Forestry', 'Mining', 'Agriculture', 'Fishing'],
    },
    NS: {
      stateName: 'Nova Scotia',
      region: 'Northeast' as const,
      costMultiplier: 1.18,
      congestionFactor: 0.9,
      permits: ['Oversize Permits', 'Port Access'],
      regulations: ['Halifax Port', 'Fishing Industry'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.2,
      majorCities: ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow'],
      fuelTaxRate: 0.155, // CAD per liter
      averageDriverWage: 26.4, // CAD
      keyIndustries: ['Fishing', 'Mining', 'Agriculture', 'Tourism'],
    },
    PE: {
      stateName: 'Prince Edward Island',
      region: 'Northeast' as const,
      costMultiplier: 1.25,
      congestionFactor: 0.7,
      permits: ['Oversize Permits', 'Bridge Access'],
      regulations: ['Confederation Bridge', 'Agricultural Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.18,
      majorCities: [
        'Charlottetown',
        'Summerside',
        'Stratford',
        'Cornwall',
        'Montague',
      ],
      fuelTaxRate: 0.135, // CAD per liter
      averageDriverWage: 24.9, // CAD
      keyIndustries: ['Agriculture', 'Fishing', 'Tourism', 'Manufacturing'],
    },
    NL: {
      stateName: 'Newfoundland and Labrador',
      region: 'Northeast' as const,
      costMultiplier: 1.35,
      congestionFactor: 0.8,
      permits: ['Oversize Permits', 'Remote Area Operations'],
      regulations: ['Remote Area Protocols', 'Mining Transport'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.3,
      majorCities: [
        'St. Johns',
        'Mount Pearl',
        'Corner Brook',
        'Conception Bay South',
        'Grand Falls-Windsor',
      ],
      fuelTaxRate: 0.165, // CAD per liter
      averageDriverWage: 28.5, // CAD
      keyIndustries: ['Mining', 'Oil & Gas', 'Fishing', 'Forestry'],
    },

    // Northern Territories
    NT: {
      stateName: 'Northwest Territories',
      region: 'Mountain West' as const,
      costMultiplier: 1.65,
      congestionFactor: 0.5,
      permits: ['Arctic Operations', 'Mining Transport'],
      regulations: ['Arctic Protocols', 'Indigenous Land Rights'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.45,
      majorCities: [
        'Yellowknife',
        'Hay River',
        'Inuvik',
        'Fort Smith',
        'Behchoko',
      ],
      fuelTaxRate: 0.107, // CAD per liter
      averageDriverWage: 42.5, // CAD
      keyIndustries: ['Mining', 'Oil & Gas', 'Tourism', 'Government'],
    },
    NU: {
      stateName: 'Nunavut',
      region: 'Mountain West' as const,
      costMultiplier: 1.85,
      congestionFactor: 0.3,
      permits: ['Arctic Operations', 'Remote Access'],
      regulations: ['Inuit Land Claims', 'Arctic Environment'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.5,
      majorCities: [
        'Iqaluit',
        'Rankin Inlet',
        'Arviat',
        'Baker Lake',
        'Igloolik',
      ],
      fuelTaxRate: 0.063, // CAD per liter
      averageDriverWage: 45.0, // CAD
      keyIndustries: ['Mining', 'Government', 'Tourism', 'Hunting & Fishing'],
    },
    YT: {
      stateName: 'Yukon',
      region: 'Mountain West' as const,
      costMultiplier: 1.55,
      congestionFactor: 0.6,
      permits: ['Arctic Operations', 'Alaska Highway'],
      regulations: ['Alaska Highway Protocols', 'Mining Transport'],
      weatherRisk: 'high' as const,
      seasonalVariation: 0.4,
      majorCities: [
        'Whitehorse',
        'Dawson City',
        'Watson Lake',
        'Haines Junction',
        'Mayo',
      ],
      fuelTaxRate: 0.132, // CAD per liter
      averageDriverWage: 38.75, // CAD
      keyIndustries: ['Mining', 'Tourism', 'Government', 'Forestry'],
    },

    // === MEXICO ===
    // Northern Mexico
    BCN: {
      stateName: 'Baja California Norte',
      region: 'Southwest' as const,
      costMultiplier: 1.15,
      congestionFactor: 1.3,
      permits: ['Border Crossing', 'Maquiladora Access'],
      regulations: ['USMCA Compliance', 'Border Security'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.08,
      majorCities: ['Tijuana', 'Mexicali', 'Ensenada', 'Rosarito', 'Tecate'],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 18.5, // USD equivalent
      keyIndustries: [
        'Manufacturing',
        'Agriculture',
        'Tourism',
        'Maquiladoras',
      ],
    },
    SON: {
      stateName: 'Sonora',
      region: 'Southwest' as const,
      costMultiplier: 1.08,
      congestionFactor: 1.0,
      permits: ['Border Crossing', 'Mining Operations'],
      regulations: ['Desert Operations', 'Mining Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Hermosillo',
        'Ciudad Obregón',
        'Nogales',
        'Navojoa',
        'Guaymas',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 16.75, // USD equivalent
      keyIndustries: ['Mining', 'Agriculture', 'Manufacturing', 'Maquiladoras'],
    },
    CHH: {
      stateName: 'Chihuahua',
      region: 'Southwest' as const,
      costMultiplier: 1.05,
      congestionFactor: 0.95,
      permits: ['Border Crossing', 'Manufacturing Zones'],
      regulations: ['Maquiladora Operations', 'Desert Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.15,
      majorCities: [
        'Chihuahua',
        'Ciudad Juárez',
        'Delicias',
        'Parral',
        'Cuauhtémoc',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 15.9, // USD equivalent
      keyIndustries: ['Manufacturing', 'Mining', 'Agriculture', 'Maquiladoras'],
    },
    COA: {
      stateName: 'Coahuila',
      region: 'Southwest' as const,
      costMultiplier: 1.02,
      congestionFactor: 0.9,
      permits: ['Border Crossing', 'Steel Industry'],
      regulations: ['Steel Transport', 'Mining Operations'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: [
        'Saltillo',
        'Torreón',
        'Monclova',
        'Piedras Negras',
        'Acuña',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 16.25, // USD equivalent
      keyIndustries: ['Steel', 'Mining', 'Automotive', 'Agriculture'],
    },
    NLE: {
      stateName: 'Nuevo León',
      region: 'Southwest' as const,
      costMultiplier: 1.08,
      congestionFactor: 1.2,
      permits: ['Border Crossing', 'Industrial Zones'],
      regulations: ['Monterrey Metro', 'Industrial Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: [
        'Monterrey',
        'Guadalupe',
        'San Nicolás',
        'Apodaca',
        'Santa Catarina',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 17.8, // USD equivalent
      keyIndustries: ['Manufacturing', 'Steel', 'Technology', 'Automotive'],
    },
    TAM: {
      stateName: 'Tamaulipas',
      region: 'Southwest' as const,
      costMultiplier: 1.05,
      congestionFactor: 1.05,
      permits: ['Border Crossing', 'Port Access'],
      regulations: ['Border Security', 'Port Operations'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Reynosa',
        'Matamoros',
        'Nuevo Laredo',
        'Tampico',
        'Victoria',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 16.5, // USD equivalent
      keyIndustries: ['Maquiladoras', 'Ports', 'Oil & Gas', 'Agriculture'],
    },

    // Central Mexico
    MEX: {
      stateName: 'Estado de México',
      region: 'Southwest' as const,
      costMultiplier: 1.12,
      congestionFactor: 1.4,
      permits: ['Mexico City Access', 'Environmental Permits'],
      regulations: ['Mexico City Metro', 'Environmental Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Ecatepec',
        'Nezahualcóyotl',
        'Naucalpan',
        'Tlalnepantla',
        'Chimalhuacán',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 17.25, // USD equivalent
      keyIndustries: ['Manufacturing', 'Automotive', 'Textiles', 'Chemicals'],
    },
    CMX: {
      stateName: 'Ciudad de México',
      region: 'Southwest' as const,
      costMultiplier: 1.25,
      congestionFactor: 1.6,
      permits: ['CDMX Permits', 'Environmental Verification'],
      regulations: ['Hoy No Circula', 'Restricted Zones'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.05,
      majorCities: ['Mexico City'],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 18.75, // USD equivalent
      keyIndustries: ['Finance', 'Government', 'Manufacturing', 'Services'],
    },
    JAL: {
      stateName: 'Jalisco',
      region: 'Southwest' as const,
      costMultiplier: 1.06,
      congestionFactor: 1.15,
      permits: ['Oversize Permits', 'Tequila Transport'],
      regulations: ['Guadalajara Metro', 'Tequila Denomination'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.08,
      majorCities: [
        'Guadalajara',
        'Zapopan',
        'Tlaquepaque',
        'Tonalá',
        'Puerto Vallarta',
      ],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 16.9, // USD equivalent
      keyIndustries: ['Technology', 'Tequila', 'Manufacturing', 'Agriculture'],
    },
    GTO: {
      stateName: 'Guanajuato',
      region: 'Southwest' as const,
      costMultiplier: 1.02,
      congestionFactor: 1.0,
      permits: ['Automotive Industry', 'Manufacturing Zones'],
      regulations: ['Bajío Industrial Corridor', 'Automotive Transport'],
      weatherRisk: 'low' as const,
      seasonalVariation: 0.06,
      majorCities: ['León', 'Irapuato', 'Celaya', 'Salamanca', 'Guanajuato'],
      fuelTaxRate: 0.52, // MXN per liter
      averageDriverWage: 16.4, // USD equivalent
      keyIndustries: ['Automotive', 'Leather', 'Agriculture', 'Manufacturing'],
    },

    // Additional Mexican States (abbreviated for space)
    VER: {
      stateName: 'Veracruz',
      region: 'Southeast' as const,
      costMultiplier: 1.0,
      congestionFactor: 1.05,
      permits: ['Port Access', 'Oil Industry'],
      regulations: ['Port of Veracruz', 'Oil Transport'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.1,
      majorCities: [
        'Veracruz',
        'Xalapa',
        'Coatzacoalcos',
        'Córdoba',
        'Orizaba',
      ],
      fuelTaxRate: 0.52,
      averageDriverWage: 15.75,
      keyIndustries: ['Ports', 'Oil & Gas', 'Agriculture', 'Petrochemicals'],
    },
    YUC: {
      stateName: 'Yucatán',
      region: 'Southeast' as const,
      costMultiplier: 1.08,
      congestionFactor: 0.9,
      permits: ['Tourism Transport', 'Agricultural Permits'],
      regulations: ['Mayan Heritage Sites', 'Tourism Zones'],
      weatherRisk: 'medium' as const,
      seasonalVariation: 0.12,
      majorCities: ['Mérida', 'Kanasín', 'Umán', 'Progreso', 'Tizimín'],
      fuelTaxRate: 0.52,
      averageDriverWage: 15.25,
      keyIndustries: ['Tourism', 'Agriculture', 'Manufacturing', 'Henequen'],
    },
  };

  constructor() {
    this.initializeDemoQuotes();
  }

  /**
   * Create a new multi-state consolidated quote
   */
  public createQuote(
    quoteData: Partial<MultiStateConsolidatedQuote>
  ): MultiStateConsolidatedQuote {
    const id = `MSQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newQuote: MultiStateConsolidatedQuote = {
      id,
      quoteName: quoteData.quoteName || `Multi-State Quote ${id}`,
      client: quoteData.client || {
        name: '',
        industry: '',
        headquarters: '',
        contactPerson: '',
        email: '',
        phone: '',
      },
      status: 'draft',
      createdDate: new Date().toISOString(),
      expirationDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days
      lastModified: new Date().toISOString(),
      stateRoutes: quoteData.stateRoutes || [],
      consolidatedPricing:
        quoteData.consolidatedPricing || this.getDefaultPricingModel(),
      sla: quoteData.sla || this.getDefaultSLA(),
      contractTerms: quoteData.contractTerms || this.getDefaultContractTerms(),
      financialSummary: this.calculateFinancialSummary(
        quoteData.stateRoutes || []
      ),
      riskAssessment: this.assessRisk(quoteData.stateRoutes || []),
      competitiveAnalysis: this.generateCompetitiveAnalysis(),
      implementationPlan: this.createImplementationPlan(
        quoteData.stateRoutes || []
      ),
      documents: [],
      internalNotes: [],
      approvalWorkflow: {
        currentStage: 'draft',
        requiredApprovals: this.getRequiredApprovals(0), // will calculate based on quote value
      },
    };

    this.quotes.set(id, newQuote);
    return newQuote;
  }

  /**
   * Get all multi-state quotes
   */
  public getAllQuotes(): MultiStateConsolidatedQuote[] {
    return Array.from(this.quotes.values()).sort(
      (a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  }

  /**
   * Get quote by ID
   */
  public getQuote(id: string): MultiStateConsolidatedQuote | null {
    return this.quotes.get(id) || null;
  }

  /**
   * Update an existing quote
   */
  public updateQuote(
    id: string,
    updates: Partial<MultiStateConsolidatedQuote>
  ): MultiStateConsolidatedQuote | null {
    const existingQuote = this.quotes.get(id);
    if (!existingQuote) return null;

    const updatedQuote = {
      ...existingQuote,
      ...updates,
      lastModified: new Date().toISOString(),
      financialSummary: this.calculateFinancialSummary(
        updates.stateRoutes || existingQuote.stateRoutes
      ),
    };

    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }

  /**
   * Calculate consolidated pricing for multi-state quote
   */
  public calculateConsolidatedPricing(stateRoutes: StateRouteGroup[]): {
    totalAnnualRevenue: number;
    averageRatePerMile: number;
    volumeDiscountSavings: number;
    crossStateOptimizationSavings: number;
    breakdown: Record<string, any>;
  } {
    let totalRevenue = 0;
    let totalMiles = 0;
    let totalLoads = 0;
    const stateBreakdown: Record<string, any> = {};

    stateRoutes.forEach((stateRoute) => {
      const stateConfig =
        this.stateConfigurations[
          stateRoute.state as keyof typeof this.stateConfigurations
        ];
      if (!stateConfig) return;

      const stateVolume =
        stateRoute.origins.reduce(
          (sum, origin) => sum + origin.monthlyVolume,
          0
        ) * 12;
      const averageMiles = this.calculateAverageStateDistance(stateRoute);
      const baseRate = 2.5; // base rate per mile
      const adjustedRate = baseRate * stateConfig.costMultiplier;
      const stateRevenue = stateVolume * averageMiles * adjustedRate;

      totalRevenue += stateRevenue;
      totalMiles += stateVolume * averageMiles;
      totalLoads += stateVolume;

      stateBreakdown[stateRoute.state] = {
        volume: stateVolume,
        averageMiles,
        rate: adjustedRate,
        revenue: stateRevenue,
        costMultiplier: stateConfig.costMultiplier,
      };
    });

    // Calculate volume discounts
    let volumeDiscount = 0;
    if (totalLoads > 10000) volumeDiscount = 0.15;
    else if (totalLoads > 5000) volumeDiscount = 0.12;
    else if (totalLoads > 2000) volumeDiscount = 0.08;
    else if (totalLoads > 1000) volumeDiscount = 0.05;

    // Calculate cross-state optimization savings
    const optimizationSavings = totalLoads > 1000 ? 0.08 : 0.04; // backhaul opportunities

    const volumeDiscountSavings = totalRevenue * volumeDiscount;
    const crossStateOptimizationSavings = totalRevenue * optimizationSavings;
    const finalRevenue =
      totalRevenue - volumeDiscountSavings - crossStateOptimizationSavings;

    return {
      totalAnnualRevenue: finalRevenue,
      averageRatePerMile: totalMiles > 0 ? finalRevenue / totalMiles : 0,
      volumeDiscountSavings,
      crossStateOptimizationSavings,
      breakdown: stateBreakdown,
    };
  }

  /**
   * Generate route optimization recommendations
   */
  public generateRouteOptimization(stateRoutes: StateRouteGroup[]): {
    backhaulOpportunities: Array<{
      fromState: string;
      toState: string;
      potential: number;
      savings: number;
    }>;
    consolidationOpportunities: Array<{
      states: string[];
      description: string;
      savings: number;
    }>;
    equipmentPositioning: Array<{
      state: string;
      recommendedFleetSize: number;
      reasoning: string;
    }>;
  } {
    // This would integrate with the existing route optimization service
    return {
      backhaulOpportunities: [
        { fromState: 'CA', toState: 'TX', potential: 85, savings: 125000 },
        { fromState: 'TX', toState: 'IL', potential: 72, savings: 98000 },
        { fromState: 'IL', toState: 'GA', potential: 68, savings: 87000 },
      ],
      consolidationOpportunities: [
        {
          states: ['CA', 'TX'],
          description: 'West Coast to Southwest consolidation hub',
          savings: 250000,
        },
        {
          states: ['IL', 'MN'],
          description: 'Midwest regional consolidation',
          savings: 180000,
        },
      ],
      equipmentPositioning: [
        {
          state: 'TX',
          recommendedFleetSize: 45,
          reasoning: 'Central hub for multi-state operations',
        },
        {
          state: 'IL',
          recommendedFleetSize: 35,
          reasoning: 'Midwest distribution center',
        },
      ],
    };
  }

  // Helper methods
  private calculateAverageStateDistance(stateRoute: StateRouteGroup): number {
    // Simplified calculation - in reality would use actual route data
    return 450; // average miles per load
  }

  private calculateFinancialSummary(stateRoutes: StateRouteGroup[]) {
    const pricing = this.calculateConsolidatedPricing(stateRoutes);
    return {
      totalAnnualVolume: stateRoutes.reduce(
        (sum, sr) =>
          sum + sr.origins.reduce((oSum, o) => oSum + o.monthlyVolume * 12, 0),
        0
      ),
      totalAnnualMiles:
        pricing.totalAnnualRevenue / (pricing.averageRatePerMile || 1),
      totalAnnualRevenue: pricing.totalAnnualRevenue,
      averageRevenuePerLoad:
        pricing.totalAnnualRevenue / Math.max(1, stateRoutes.length),
      profitMargin: 0.18, // 18% target margin
      roi: 0.24, // 24% ROI
      paybackPeriod: 8, // months
    };
  }

  private assessRisk(stateRoutes: StateRouteGroup[]) {
    return {
      overallRisk: 'medium' as const,
      riskFactors: [
        {
          category: 'Regulatory',
          risk: 'Multi-state compliance complexity',
          impact: 'medium' as const,
          mitigation: 'Dedicated compliance team and automated monitoring',
        },
        {
          category: 'Operational',
          risk: 'Equipment positioning across states',
          impact: 'medium' as const,
          mitigation: 'Strategic fleet positioning and partner network',
        },
      ],
      creditRating: 'A-',
      insuranceRequirements: [
        '$1M General Liability',
        '$100K Cargo',
        '$1M Auto Liability',
      ],
    };
  }

  private generateCompetitiveAnalysis() {
    return {
      competitors: ['C.H. Robinson', 'XPO Logistics', 'J.B. Hunt', 'Schneider'],
      ourAdvantages: [
        'route optimization',
        'Real-time visibility platform',
        'Consolidated multi-state pricing',
        'Technology integration capabilities',
      ],
      pricingPosition: 'competitive' as const,
      winProbability: 75,
      keyDifferentiators: [
        'Only platform offering true multi-state consolidation',
        'Real-time AI planning across all routes',
        'Integrated financial and operational reporting',
      ],
    };
  }

  private createImplementationPlan(stateRoutes: StateRouteGroup[]) {
    return {
      phases: [
        {
          phase: 1,
          description: 'System setup and integration',
          duration: 30,
          milestones: ['API integration', 'User training', 'Initial testing'],
          resources: [
            'Technical team',
            'Training materials',
            'Test environment',
          ],
        },
        {
          phase: 2,
          description: 'Pilot operations launch',
          duration: 45,
          milestones: [
            'First state activation',
            'Process validation',
            'Performance monitoring',
          ],
          resources: [
            'Operations team',
            'Customer success',
            'Monitoring tools',
          ],
        },
        {
          phase: 3,
          description: 'Full multi-state rollout',
          duration: 60,
          milestones: [
            'All states active',
            'Complete planning',
            'SLA compliance',
          ],
          resources: [
            'Full operational team',
            'All technology platforms',
            'Reporting systems',
          ],
        },
      ],
      totalImplementationTime: 135,
      trainingRequirements: [
        'Platform training',
        'Process training',
        'Compliance training',
      ],
      technologyRequirements: [
        'API access',
        'Dashboard setup',
        'Reporting configuration',
      ],
    };
  }

  private getDefaultPricingModel(): ConsolidatedPricingModel {
    return {
      type: 'volume_tiered',
      baseRates: {
        perMile: 2.5,
        perStop: 75,
        perHour: 65,
        fuelSurcharge: 0.35,
        accessorials: {
          detention: 65,
          layover: 150,
          redelivery: 125,
          liftgate: 85,
        },
      },
      volumeDiscounts: [
        {
          threshold: 1000,
          discount: 0.05,
          description: '5% discount for 1000+ loads/year',
        },
        {
          threshold: 2000,
          discount: 0.08,
          description: '8% discount for 2000+ loads/year',
        },
        {
          threshold: 5000,
          discount: 0.12,
          description: '12% discount for 5000+ loads/year',
        },
        {
          threshold: 10000,
          discount: 0.15,
          description: '15% discount for 10000+ loads/year',
        },
      ],
      stateMultipliers: {
        CA: {
          multiplier: 1.25,
          reasoning: 'High cost state',
          factors: ['Regulations', 'Congestion', 'Fuel costs'],
        },
        TX: {
          multiplier: 1.0,
          reasoning: 'Baseline state',
          factors: ['Standard operations'],
        },
        MN: {
          multiplier: 1.08,
          reasoning: 'Weather challenges',
          factors: ['Winter conditions', 'Seasonal restrictions'],
        },
        IL: {
          multiplier: 1.05,
          reasoning: 'Urban congestion',
          factors: ['Chicago traffic', 'Tolls'],
        },
        GA: {
          multiplier: 0.95,
          reasoning: 'Favorable conditions',
          factors: ['Good infrastructure', 'Low regulations'],
        },
      },
      seasonalAdjustments: {
        winter: {
          months: ['Dec', 'Jan', 'Feb'],
          adjustment: 0.08,
          reasoning: 'Winter weather surcharge',
        },
        peak: {
          months: ['Oct', 'Nov'],
          adjustment: 0.05,
          reasoning: 'Peak season demand',
        },
      },
      performanceIncentives: {
        onTimeDelivery: { threshold: 0.98, bonus: 0.02 },
        fuelEfficiency: { threshold: 7.5, bonus: 0.015 },
        safetyRating: { threshold: 4.8, bonus: 0.01 },
        customerSatisfaction: { threshold: 4.9, bonus: 0.015 },
      },
    };
  }

  private getDefaultSLA(): ServiceLevelAgreement {
    return {
      transitTimes: {
        'CA-TX': 48,
        'TX-IL': 36,
        'IL-MN': 18,
        'IL-GA': 24,
        'GA-CA': 72,
      },
      onTimeDeliveryGuarantee: 0.98,
      communicationRequirements: {
        frequency: 'real-time',
        methods: ['Dashboard', 'Email alerts', 'SMS notifications'],
        escalationProcedure: [
          'Account manager',
          'Operations director',
          'VP Operations',
        ],
      },
      reportingRequirements: {
        frequency: 'weekly',
        metrics: [
          'On-time delivery',
          'Cost per mile',
          'Fuel efficiency',
          'Customer satisfaction',
        ],
        dashboardAccess: true,
        customReports: true,
      },
      qualityStandards: {
        driverRequirements: ['CDL Class A', '2+ years experience', 'Clean MVR'],
        equipmentStandards: [
          'Less than 5 years old',
          'GPS tracking',
          'ELD compliant',
        ],
        safetyRating: 4.5,
        insuranceLimits: {
          liability: 1000000,
          cargo: 100000,
          auto: 1000000,
        },
      },
    };
  }

  private getDefaultContractTerms(): ContractTerms {
    return {
      duration: '24 months',
      startDate: new Date().toISOString(),
      endDate: new Date(
        Date.now() + 24 * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      autoRenewal: true,
      renewalTerms: '12 month automatic renewal',
      volumeCommitments: {
        annual: { minimum: 2000, penalty: 0.05 },
        quarterly: { minimum: 500, penalty: 0.03 },
      },
      rateProtection: {
        fuelSurchargeProtection: true,
        maximumIncrease: 0.05,
        adjustmentFrequency: 'quarterly',
      },
      penalties: {
        lateDelivery: {
          description: 'Late delivery penalty',
          amount: 100,
          type: 'per_occurrence',
        },
        serviceFailure: {
          description: 'Service failure penalty',
          amount: 0.02,
          type: 'percentage',
        },
      },
      incentives: {
        earlyDelivery: {
          description: 'Early delivery bonus',
          reward: 25,
          criteria: 'Delivery >2 hours early',
        },
        volumeBonus: {
          description: 'Volume achievement bonus',
          reward: 0.01,
          criteria: 'Exceed annual commitment by 10%',
        },
      },
      terminationClauses: {
        noticePeriod: 90,
        earlyTerminationFee: 50000,
        forCauseTermination: [
          'Material breach',
          'Safety violations',
          'Regulatory violations',
        ],
      },
    };
  }

  private getRequiredApprovals(quoteValue: number) {
    const approvals = [
      { role: 'Sales Manager', status: 'pending' as const },
      { role: 'Operations Director', status: 'pending' as const },
    ];

    if (quoteValue > 1000000) {
      approvals.push({ role: 'VP Sales', status: 'pending' as const });
    }

    if (quoteValue > 5000000) {
      approvals.push({ role: 'CEO', status: 'pending' as const });
    }

    return approvals;
  }

  private initializeDemoQuotes(): void {
    // Create demo quotes for demonstration
    const demoQuote1 = this.createQuote({
      quoteName: 'Walmart National Distribution Q1 2025',
      client: {
        name: 'Walmart Inc.',
        industry: 'Retail',
        headquarters: 'Bentonville, AR',
        annualRevenue: 611289000000, // $611.3B
        employees: 2300000,
        contactPerson: 'Sarah Johnson',
        email: 'sarah.johnson@walmart.com',
        phone: '(479) 273-4000',
      },
      stateRoutes: [
        {
          state: 'CA',
          stateName: 'California',
          region: 'West Coast',
          origins: [
            {
              id: 'CA001',
              city: 'Los Angeles',
              address: '1234 Distribution Blvd, Los Angeles, CA 90001',
              coordinates: { lat: 34.0522, lng: -118.2437 },
              facilityType: 'distribution',
              weeklyVolume: 150,
              monthlyVolume: 650,
              specialRequirements: [
                'Temperature controlled',
                '24/7 operations',
              ],
              operatingHours: { start: '00:00', end: '23:59' },
              dockCount: 50,
              equipmentTypes: ['Dry Van', 'Reefer', 'Flatbed'],
            },
          ],
          destinations: [
            {
              id: 'CA_DEST_001',
              city: 'Phoenix',
              state: 'AZ',
              address: '5678 Store Way, Phoenix, AZ 85001',
              coordinates: { lat: 33.4484, lng: -112.074 },
              facilityType: 'retail',
              weeklyVolume: 75,
              monthlyVolume: 325,
              timeWindows: [{ start: '06:00', end: '14:00' }],
              specialRequirements: ['Appointment required'],
              priority: 'high',
            },
          ],
          stateRequirements: {
            permits: ['CARB Compliance', 'Oversize Permits'],
            regulations: ['AB5 Compliance', 'CARB Diesel Regulations'],
            equipmentRestrictions: ['CARB compliant trucks only'],
            driverRequirements: ['CA driving experience preferred'],
            seasonalConsiderations: ['Fire season restrictions'],
            weatherFactors: ['Fog', 'Rain'],
            tolls: { average: 25, routes: ['I-405', 'SR-91'] },
            fuelTaxes: 0.51,
          },
          stateMetrics: {
            averageTransitTime: 24,
            congestionFactor: 1.4,
            costMultiplier: 1.25,
            seasonalVariation: 0.15,
            weatherRisk: 'medium',
            regulatoryComplexity: 'complex',
          },
        },
        {
          state: 'TX',
          stateName: 'Texas',
          region: 'Southwest',
          origins: [
            {
              id: 'TX001',
              city: 'Dallas',
              address: '9876 Logistics Dr, Dallas, TX 75201',
              coordinates: { lat: 32.7767, lng: -96.797 },
              facilityType: 'distribution',
              weeklyVolume: 200,
              monthlyVolume: 875,
              specialRequirements: ['Cross-dock operations'],
              operatingHours: { start: '05:00', end: '22:00' },
              dockCount: 75,
              equipmentTypes: ['Dry Van', 'Flatbed'],
            },
          ],
          destinations: [
            {
              id: 'TX_DEST_001',
              city: 'Houston',
              state: 'TX',
              address: '1111 Retail Blvd, Houston, TX 77001',
              coordinates: { lat: 29.7604, lng: -95.3698 },
              facilityType: 'retail',
              weeklyVolume: 100,
              monthlyVolume: 435,
              timeWindows: [{ start: '05:00', end: '15:00' }],
              specialRequirements: ['Live unload preferred'],
              priority: 'medium',
            },
          ],
          stateRequirements: {
            permits: ['Oversize Permits', 'Hazmat Endorsement'],
            regulations: ['Texas Motor Carrier Requirements'],
            equipmentRestrictions: ['Standard equipment acceptable'],
            driverRequirements: ['Hazmat endorsement preferred'],
            seasonalConsiderations: ['Hurricane season preparations'],
            weatherFactors: ['Thunderstorms', 'Heat'],
            tolls: { average: 15, routes: ['TX-130'] },
            fuelTaxes: 0.2,
          },
          stateMetrics: {
            averageTransitTime: 18,
            congestionFactor: 1.1,
            costMultiplier: 1.0,
            seasonalVariation: 0.08,
            weatherRisk: 'medium',
            regulatoryComplexity: 'moderate',
          },
        },
      ],
    });

    // Update the demo quote with calculated values
    this.updateQuote(demoQuote1.id, {
      status: 'under_review',
      financialSummary: {
        totalAnnualVolume: 18300, // (650 + 875) * 12
        totalAnnualMiles: 8235000, // estimated
        totalAnnualRevenue: 22500000, // $22.5M
        averageRevenuePerLoad: 1230,
        profitMargin: 0.18,
        roi: 0.24,
        paybackPeriod: 6,
      },
    });
  }
}

// Export singleton instance
export const multiStateQuoteService = new MultiStateQuoteService();
