import { NextRequest, NextResponse } from 'next/server';

// ===============================
// SHIPPER & MANUFACTURER DISCOVERY DEPARTMENT
// High-Value B2B Lead Generation Engine
// ===============================

interface ShipperLead {
  id: string;
  leadId: string;
  companyName: string;
  companyType:
    | 'Fortune_500_Manufacturer'
    | 'Mid_Market_Manufacturer'
    | 'Regional_Manufacturer'
    | 'E-commerce_Shipper'
    | 'Retail_Chain'
    | 'Food_Beverage'
    | 'Automotive_OEM'
    | 'Chemical_Industrial'
    | 'Consumer_Goods'
    | 'Technology_Hardware'
    | 'Pharmaceutical'
    | 'Construction_Materials';
  industry: string;
  subIndustry: string;
  discoverySource:
    | 'ThomasNet_Manufacturing'
    | 'Import_Export_Intelligence'
    | 'SEC_Filings_Analysis'
    | 'Trade_Publication_Monitoring'
    | 'Supply_Chain_Network_Analysis'
    | 'Competitor_Intelligence'
    | 'Industry_Association_Lists'
    | 'Government_Contract_Analysis'
    | 'LinkedIn_Sales_Navigator'
    | 'Customs_Data_Analysis';
  leadScore: number; // 0-100 AI-calculated opportunity score
  annualShippingVolume?: {
    estimatedLoads: number;
    estimatedValue: number;
    confidence: 'High' | 'Medium' | 'Low';
  };
  currentLogisticsSpend?: number;
  potentialContractValue: number; // Annual potential
  priority: 'platinum' | 'gold' | 'silver' | 'bronze';
  timestamp: string;
  tenantId: string;

  companyProfile: {
    headquarters: string;
    facilities: string[];
    annualRevenue: string;
    employeeCount: string;
    publiclyTraded: boolean;
    stockSymbol?: string;
    keyProducts: string[];
    majorCustomers?: string[];
    supplyChainComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Highly_Complex';
  };

  shippingProfile: {
    primaryModes: ('Truckload' | 'LTL' | 'Intermodal' | 'Ocean' | 'Air')[];
    geographicScope: ('Local' | 'Regional' | 'National' | 'International')[];
    seasonality: 'None' | 'Moderate' | 'High';
    specialRequirements: string[];
    currentProviders?: string[];
    painPoints: string[];
    tenderProcess: 'RFP' | 'Spot_Market' | 'Contract' | 'Mixed';
  };

  contactInfo: {
    primaryContacts: Array<{
      name: string;
      title: string;
      email?: string;
      phone?: string;
      linkedIn?: string;
      department:
        | 'Logistics'
        | 'Supply_Chain'
        | 'Procurement'
        | 'Operations'
        | 'C_Suite';
      influence: 'High' | 'Medium' | 'Low';
    }>;
    company: string;
    website: string;
    phoneNumber?: string;
  };

  discoveryIntel: {
    recentNews: string[];
    expansionPlans?: string[];
    financialHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    growthTrend: 'Rapid_Growth' | 'Steady_Growth' | 'Stable' | 'Declining';
    logisticsMaturity: 'Advanced' | 'Intermediate' | 'Basic' | 'Outsourced';
    technologyAdoption: 'High' | 'Medium' | 'Low';
    sustainabilityFocus: boolean;
    complianceRequirements: string[];
  };

  prospectingActivity: {
    status:
      | 'discovered'
      | 'researching'
      | 'contacted'
      | 'qualified'
      | 'proposal_requested'
      | 'rfp_submitted'
      | 'negotiating'
      | 'won'
      | 'lost';
    assignedProspector: string;
    discoveryDate: string;
    lastActivity: string;
    nextAction: string;
    researchNotes: string;
    outreachAttempts: number;
    responseReceived: boolean;
    meetingsScheduled: number;
    proposalsRequested: number;
  };

  opportunityAssessment: {
    immediateOpportunity: boolean;
    timeframe:
      | 'Immediate'
      | '3_Months'
      | '6_Months'
      | '12_Months'
      | 'Long_Term';
    budgetAvailable: boolean;
    decisionMakingProcess: string;
    competitiveThreats: string[];
    winProbability: number; // 0-100%
    strategicValue: 'High' | 'Medium' | 'Low';
  };

  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface DiscoveryMetrics {
  totalProspects: number;
  qualifiedProspects: number;
  platinumProspects: number;
  totalPipelineValue: number;
  averageContractValue: number;
  discoveryRate: number; // new prospects per week
  qualificationRate: number; // % of discovered prospects that qualify
  conversionRate: number; // % that become customers
  industryBreakdown: Record<string, number>;
  discoverySourcePerformance: Record<
    string,
    {
      prospects: number;
      qualified: number;
      avgValue: number;
      conversionRate: number;
    }
  >;
  prospectorPerformance: Record<
    string,
    {
      discovered: number;
      qualified: number;
      meetings: number;
      proposals: number;
      won: number;
      revenue: number;
    }
  >;
  monthlyTrends: Array<{
    month: string;
    discovered: number;
    qualified: number;
    pipelineValue: number;
  }>;
}

// HIGH-VALUE SHIPPER & MANUFACTURER PROSPECTS
let shipperLeads: ShipperLead[] = [
  {
    id: 'SH-001',
    leadId: 'SHIPPER-DISC-1735663200001',
    companyName: 'Tesla Manufacturing Inc',
    companyType: 'Fortune_500_Manufacturer',
    industry: 'Automotive Manufacturing',
    subIndustry: 'Electric Vehicles',
    discoverySource: 'SEC_Filings_Analysis',
    leadScore: 98,
    annualShippingVolume: {
      estimatedLoads: 15000,
      estimatedValue: 75000000,
      confidence: 'High',
    },
    currentLogisticsSpend: 85000000,
    potentialContractValue: 12000000, // 12M annual logistics contract
    priority: 'platinum',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tenantId: 'tenant-demo-123',

    companyProfile: {
      headquarters: 'Austin, TX',
      facilities: [
        'Austin, TX',
        'Fremont, CA',
        'Shanghai, China',
        'Berlin, Germany',
      ],
      annualRevenue: '$96.8B',
      employeeCount: '140,000+',
      publiclyTraded: true,
      stockSymbol: 'TSLA',
      keyProducts: [
        'Model S',
        'Model 3',
        'Model X',
        'Model Y',
        'Cybertruck',
        'Energy Storage',
      ],
      majorCustomers: [
        'Direct to Consumer',
        'Government Fleets',
        'Corporate Fleets',
      ],
      supplyChainComplexity: 'Highly_Complex',
    },

    shippingProfile: {
      primaryModes: ['Truckload', 'Intermodal', 'Ocean'],
      geographicScope: ['National', 'International'],
      seasonality: 'Moderate',
      specialRequirements: [
        'White glove delivery for high-value vehicles',
        'Enclosed transport for premium models',
        'Real-time GPS tracking',
        'Temperature-controlled for batteries',
        'Security protocols for high-value cargo',
      ],
      currentProviders: [
        'Multiple 3PLs',
        'Regional carriers',
        'Dedicated fleet',
      ],
      painPoints: [
        'Scaling logistics for rapid production increases',
        'International shipping complexity',
        'Last-mile delivery for direct sales',
        'Cost optimization pressure from shareholders',
        'Sustainability requirements for carbon-neutral shipping',
      ],
      tenderProcess: 'RFP',
    },

    contactInfo: {
      primaryContacts: [
        {
          name: 'Sarah Chen',
          title: 'VP Global Logistics',
          email: 'sarah.chen@tesla.com',
          phone: '(512) 555-0199',
          linkedIn: 'https://linkedin.com/in/sarahchen-tesla',
          department: 'Logistics',
          influence: 'High',
        },
        {
          name: 'Michael Rodriguez',
          title: 'Director Supply Chain Operations',
          email: 'm.rodriguez@tesla.com',
          department: 'Supply_Chain',
          influence: 'High',
        },
        {
          name: 'Jennifer Walsh',
          title: 'Chief Operations Officer',
          department: 'C_Suite',
          influence: 'High',
        },
      ],
      company: 'Tesla Manufacturing Inc',
      website: 'https://tesla.com',
      phoneNumber: '(512) 516-8177',
    },

    discoveryIntel: {
      recentNews: [
        'Announced new Gigafactory in Mexico - massive logistics expansion needed',
        'Q3 2024 delivery targets increased by 25% - shipping capacity constraints',
        'New direct-to-consumer delivery model expanding nationwide',
        'Sustainability initiative targeting carbon-neutral supply chain by 2025',
      ],
      expansionPlans: [
        'Mexico Gigafactory (2024-2025)',
        'India market entry (2025)',
        'European expansion (ongoing)',
        'Cybertruck production ramp-up',
      ],
      financialHealth: 'Excellent',
      growthTrend: 'Rapid_Growth',
      logisticsMaturity: 'Intermediate',
      technologyAdoption: 'High',
      sustainabilityFocus: true,
      complianceRequirements: [
        'DOT',
        'International trade',
        'Hazmat (batteries)',
        'CARB emissions',
      ],
    },

    prospectingActivity: {
      status: 'researching',
      assignedProspector: 'David Kim - Senior Enterprise Prospector',
      discoveryDate: '2024-12-20T14:30:00Z',
      lastActivity:
        'Completed comprehensive company research and logistics spend analysis',
      nextAction:
        'Identify warm introduction through mutual connection at Austin Chamber of Commerce',
      researchNotes:
        'MASSIVE OPPORTUNITY - Tesla is rapidly scaling and has publicly stated logistics is a bottleneck. Recent earnings call mentioned $85M annual logistics spend with 25% growth target. Perfect timing with Mexico expansion.',
      outreachAttempts: 0,
      responseReceived: false,
      meetingsScheduled: 0,
      proposalsRequested: 0,
    },

    opportunityAssessment: {
      immediateOpportunity: true,
      timeframe: '3_Months',
      budgetAvailable: true,
      decisionMakingProcess:
        'VP Logistics has budget authority up to $15M, COO approval for larger contracts',
      competitiveThreats: [
        'C.H. Robinson',
        'J.B. Hunt',
        'Ryder',
        'UPS Supply Chain',
      ],
      winProbability: 75,
      strategicValue: 'High',
    },

    tags: [
      'Fortune 500',
      'Electric Vehicles',
      'Rapid Growth',
      'Sustainability Focus',
      'High Tech',
    ],
    notes:
      'PLATINUM PROSPECT - Tesla is the holy grail of automotive logistics. Rapid growth, massive scale, technology-forward, and publicly committed to supply chain optimization. This could be our biggest win ever.',
    createdAt: '2024-12-20T14:30:00Z',
    updatedAt: '2024-12-20T18:45:00Z',
  },
  {
    id: 'SH-002',
    leadId: 'SHIPPER-DISC-1735663200002',
    companyName: 'Procter & Gamble Manufacturing',
    companyType: 'Fortune_500_Manufacturer',
    industry: 'Consumer Goods',
    subIndustry: 'Personal Care & Household Products',
    discoverySource: 'Trade_Publication_Monitoring',
    leadScore: 94,
    annualShippingVolume: {
      estimatedLoads: 25000,
      estimatedValue: 120000000,
      confidence: 'High',
    },
    currentLogisticsSpend: 140000000,
    potentialContractValue: 18000000, // 18M annual logistics contract
    priority: 'platinum',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    tenantId: 'tenant-demo-123',

    companyProfile: {
      headquarters: 'Cincinnati, OH',
      facilities: [
        'Cincinnati, OH',
        'Mason, OH',
        'Albany, GA',
        'Cape Girardeau, MO',
        'Lima, OH',
      ],
      annualRevenue: '$82.0B',
      employeeCount: '106,000+',
      publiclyTraded: true,
      stockSymbol: 'PG',
      keyProducts: [
        'Tide',
        'Pampers',
        'Gillette',
        'Oral-B',
        'Head & Shoulders',
        'Olay',
      ],
      majorCustomers: ['Walmart', 'Amazon', 'Target', 'Kroger', 'Costco'],
      supplyChainComplexity: 'Highly_Complex',
    },

    shippingProfile: {
      primaryModes: ['Truckload', 'LTL', 'Intermodal'],
      geographicScope: ['National', 'International'],
      seasonality: 'Moderate',
      specialRequirements: [
        'Temperature-controlled for certain products',
        'Hazmat certified for cleaning chemicals',
        'High-security for premium products',
        'Retail-ready packaging requirements',
        'Just-in-time delivery to major retailers',
      ],
      currentProviders: [
        'Dedicated contract carriers',
        'Major 3PLs',
        'Regional LTL',
      ],
      painPoints: [
        'Rising transportation costs impacting margins',
        'Retail consolidation requiring larger shipments',
        'E-commerce growth changing distribution patterns',
        'Sustainability pressure from major retailers',
        'Supply chain visibility across global network',
      ],
      tenderProcess: 'RFP',
    },

    contactInfo: {
      primaryContacts: [
        {
          name: 'Amanda Johnson',
          title: 'VP Transportation & Logistics',
          email: 'johnson.a@pg.com',
          phone: '(513) 555-0187',
          department: 'Logistics',
          influence: 'High',
        },
        {
          name: 'Robert Martinez',
          title: 'Director Global Supply Chain',
          email: 'martinez.r@pg.com',
          department: 'Supply_Chain',
          influence: 'High',
        },
      ],
      company: 'Procter & Gamble Manufacturing',
      website: 'https://pg.com',
      phoneNumber: '(513) 983-1100',
    },

    discoveryIntel: {
      recentNews: [
        'Announced $2B supply chain modernization initiative',
        'New distribution center in Texas to serve growing Southwest market',
        'Partnership with major retailers on sustainable packaging',
        'Q4 2024 earnings highlighted transportation cost pressures',
      ],
      expansionPlans: [
        'Texas distribution center (2025)',
        'Mexico manufacturing expansion',
        'E-commerce fulfillment network upgrade',
      ],
      financialHealth: 'Excellent',
      growthTrend: 'Steady_Growth',
      logisticsMaturity: 'Advanced',
      technologyAdoption: 'High',
      sustainabilityFocus: true,
      complianceRequirements: ['FDA', 'EPA', 'DOT', 'International trade'],
    },

    prospectingActivity: {
      status: 'discovered',
      assignedProspector: 'Sarah Martinez - Enterprise Prospector',
      discoveryDate: '2024-12-20T12:15:00Z',
      lastActivity:
        'Initial company profile created from trade publication intelligence',
      nextAction:
        'Deep dive research on current logistics providers and recent RFP activity',
      researchNotes:
        'P&G is a logistics powerhouse with massive scale. Recent earnings call mentioned transportation inflation as margin pressure. Perfect timing with their $2B supply chain modernization.',
      outreachAttempts: 0,
      responseReceived: false,
      meetingsScheduled: 0,
      proposalsRequested: 0,
    },

    opportunityAssessment: {
      immediateOpportunity: false,
      timeframe: '6_Months',
      budgetAvailable: true,
      decisionMakingProcess:
        'Formal RFP process, multiple stakeholders, 6-month evaluation cycle',
      competitiveThreats: [
        'C.H. Robinson',
        'XPO Logistics',
        'J.B. Hunt',
        'Schneider',
      ],
      winProbability: 60,
      strategicValue: 'High',
    },

    tags: [
      'Fortune 500',
      'Consumer Goods',
      'Supply Chain Modernization',
      'High Volume',
    ],
    notes:
      'MAJOR OPPORTUNITY - P&G is one of the largest shippers in consumer goods. Their supply chain modernization initiative creates perfect timing for new partnerships.',
    createdAt: '2024-12-20T12:15:00Z',
    updatedAt: '2024-12-20T16:20:00Z',
  },
  {
    id: 'SH-003',
    leadId: 'SHIPPER-DISC-1735663200003',
    companyName: 'Beyond Meat Inc',
    companyType: 'Mid_Market_Manufacturer',
    industry: 'Food & Beverage',
    subIndustry: 'Alternative Protein',
    discoverySource: 'LinkedIn_Sales_Navigator',
    leadScore: 87,
    annualShippingVolume: {
      estimatedLoads: 3500,
      estimatedValue: 18000000,
      confidence: 'Medium',
    },
    currentLogisticsSpend: 22000000,
    potentialContractValue: 3500000, // 3.5M annual logistics contract
    priority: 'gold',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    tenantId: 'tenant-demo-123',

    companyProfile: {
      headquarters: 'El Segundo, CA',
      facilities: [
        'El Segundo, CA',
        'Columbia, MO',
        'Pennsylvania',
        'Netherlands',
      ],
      annualRevenue: '$418M',
      employeeCount: '1,400+',
      publiclyTraded: true,
      stockSymbol: 'BYND',
      keyProducts: [
        'Beyond Burger',
        'Beyond Sausage',
        'Beyond Chicken',
        'Beyond Beef',
      ],
      majorCustomers: ["McDonald's", 'KFC', 'Subway', 'Walmart', 'Target'],
      supplyChainComplexity: 'Complex',
    },

    shippingProfile: {
      primaryModes: ['Truckload', 'LTL'],
      geographicScope: ['National', 'International'],
      seasonality: 'Low',
      specialRequirements: [
        'Frozen/refrigerated transport required',
        'Food safety compliance (SQF, BRC)',
        'Temperature monitoring throughout transit',
        'Quick turn times for fresh product',
        'Retail distribution center delivery',
      ],
      currentProviders: ['Regional refrigerated carriers', 'National LTL'],
      painPoints: [
        'Rapid growth outpacing logistics capacity',
        'Cold chain integrity across long distances',
        'International expansion logistics complexity',
        'Cost pressures from competitive market',
        'Seasonal demand spikes',
      ],
      tenderProcess: 'Contract',
    },

    contactInfo: {
      primaryContacts: [
        {
          name: 'Lisa Thompson',
          title: 'VP Supply Chain & Operations',
          email: 'l.thompson@beyondmeat.com',
          linkedIn: 'https://linkedin.com/in/lisathompson-supplychain',
          department: 'Supply_Chain',
          influence: 'High',
        },
        {
          name: 'Mark Davis',
          title: 'Director Logistics',
          email: 'm.davis@beyondmeat.com',
          department: 'Logistics',
          influence: 'High',
        },
      ],
      company: 'Beyond Meat Inc',
      website: 'https://beyondmeat.com',
      phoneNumber: '(310) 683-4444',
    },

    discoveryIntel: {
      recentNews: [
        'Expanding production capacity in Missouri facility',
        'New international partnerships in Europe and Asia',
        'Recent cost-cutting initiatives to improve margins',
        'Partnership with major QSR chains driving volume growth',
      ],
      expansionPlans: [
        'European manufacturing facility expansion',
        'Asia-Pacific market entry',
        'New product line launches',
      ],
      financialHealth: 'Fair',
      growthTrend: 'Steady_Growth',
      logisticsMaturity: 'Intermediate',
      technologyAdoption: 'Medium',
      sustainabilityFocus: true,
      complianceRequirements: [
        'FDA',
        'USDA',
        'International food safety',
        'Organic certifications',
      ],
    },

    prospectingActivity: {
      status: 'discovered',
      assignedProspector: 'Jennifer Lopez - Food & Beverage Specialist',
      discoveryDate: '2024-12-20T10:45:00Z',
      lastActivity:
        'LinkedIn research identified key logistics contacts and recent expansion news',
      nextAction:
        'Research current cold chain providers and recent logistics challenges',
      researchNotes:
        'Growing alternative protein company with complex cold chain needs. Recent expansion creating logistics challenges. Good opportunity for specialized cold chain expertise.',
      outreachAttempts: 0,
      responseReceived: false,
      meetingsScheduled: 0,
      proposalsRequested: 0,
    },

    opportunityAssessment: {
      immediateOpportunity: true,
      timeframe: 'Immediate',
      budgetAvailable: true,
      decisionMakingProcess:
        'VP Supply Chain has decision authority, fast-moving company',
      competitiveThreats: [
        'Lineage Logistics',
        'Americold',
        'Regional cold chain providers',
      ],
      winProbability: 70,
      strategicValue: 'Medium',
    },

    tags: [
      'Alternative Protein',
      'Cold Chain',
      'Rapid Growth',
      'Sustainability',
      'Public Company',
    ],
    notes:
      'GROWTH OPPORTUNITY - Beyond Meat is scaling rapidly and needs specialized cold chain logistics. Their sustainability focus aligns well with our green logistics capabilities.',
    createdAt: '2024-12-20T10:45:00Z',
    updatedAt: '2024-12-20T14:30:00Z',
  },
  {
    id: 'SH-004',
    leadId: 'SHIPPER-DISC-1735663200004',
    companyName: 'Wayfair Supply Chain Services',
    companyType: 'E-commerce_Shipper',
    industry: 'E-commerce',
    subIndustry: 'Home Goods & Furniture',
    discoverySource: 'Import_Export_Intelligence',
    leadScore: 91,
    annualShippingVolume: {
      estimatedLoads: 12000,
      estimatedValue: 45000000,
      confidence: 'High',
    },
    currentLogisticsSpend: 55000000,
    potentialContractValue: 8500000, // 8.5M annual logistics contract
    priority: 'gold',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    tenantId: 'tenant-demo-123',

    companyProfile: {
      headquarters: 'Boston, MA',
      facilities: [
        'Boston, MA',
        'Berlin, NJ',
        'Hebron, KY',
        'Salt Lake City, UT',
        'Reno, NV',
      ],
      annualRevenue: '$13.7B',
      employeeCount: '18,000+',
      publiclyTraded: true,
      stockSymbol: 'W',
      keyProducts: [
        'Furniture',
        'Home Decor',
        'Kitchen & Dining',
        'Bed & Bath',
        'Outdoor',
      ],
      majorCustomers: [
        'Direct to Consumer',
        'Small Business',
        'Professional Buyers',
      ],
      supplyChainComplexity: 'Highly_Complex',
    },

    shippingProfile: {
      primaryModes: ['Truckload', 'LTL', 'Ocean'],
      geographicScope: ['National', 'International'],
      seasonality: 'High',
      specialRequirements: [
        'White glove delivery for furniture',
        'Appointment scheduling for home delivery',
        'Assembly services coordination',
        'Damage-free handling of fragile items',
        'Peak season capacity (Q4)',
        'International import coordination',
      ],
      currentProviders: [
        'XPO Logistics',
        'FedEx Freight',
        'Various white glove providers',
      ],
      painPoints: [
        'Last-mile delivery complexity for large items',
        'Seasonal capacity constraints in Q4',
        'International import delays and costs',
        'Damage rates on fragile/large items',
        'Customer delivery experience expectations',
      ],
      tenderProcess: 'RFP',
    },

    contactInfo: {
      primaryContacts: [
        {
          name: 'Rachel Kim',
          title: 'VP Transportation',
          email: 'rkim@wayfair.com',
          department: 'Logistics',
          influence: 'High',
        },
        {
          name: 'Thomas Wilson',
          title: 'Director Last Mile Operations',
          email: 'twilson@wayfair.com',
          department: 'Operations',
          influence: 'High',
        },
      ],
      company: 'Wayfair Supply Chain Services',
      website: 'https://wayfair.com',
      phoneNumber: '(617) 532-6100',
    },

    discoveryIntel: {
      recentNews: [
        'Investing heavily in logistics network expansion',
        'New fulfillment centers planned for 2025',
        'Focus on improving delivery experience and reducing damage',
        'International expansion into European markets',
      ],
      expansionPlans: [
        'Additional fulfillment centers in key markets',
        'Enhanced last-mile delivery network',
        'European market expansion',
      ],
      financialHealth: 'Good',
      growthTrend: 'Steady_Growth',
      logisticsMaturity: 'Advanced',
      technologyAdoption: 'High',
      sustainabilityFocus: true,
      complianceRequirements: [
        'Import/export',
        'Consumer product safety',
        'International trade',
      ],
    },

    prospectingActivity: {
      status: 'discovered',
      assignedProspector: 'Carlos Mendez - E-commerce Specialist',
      discoveryDate: '2024-12-20T08:30:00Z',
      lastActivity:
        'Import data analysis revealed massive shipping volumes and growth trends',
      nextAction:
        'Research current last-mile providers and recent delivery performance challenges',
      researchNotes:
        'Wayfair has complex logistics needs with emphasis on last-mile delivery for large items. Recent focus on improving customer delivery experience creates opportunity.',
      outreachAttempts: 0,
      responseReceived: false,
      meetingsScheduled: 0,
      proposalsRequested: 0,
    },

    opportunityAssessment: {
      immediateOpportunity: false,
      timeframe: '6_Months',
      budgetAvailable: true,
      decisionMakingProcess:
        'Formal RFP process, multiple stakeholders including customer experience team',
      competitiveThreats: [
        'XPO Logistics',
        'FedEx',
        'UPS',
        'Specialized furniture delivery companies',
      ],
      winProbability: 65,
      strategicValue: 'High',
    },

    tags: ['E-commerce', 'Furniture', 'Last Mile', 'White Glove', 'Seasonal'],
    notes:
      'SPECIALIZED OPPORTUNITY - Wayfair needs expertise in large item/furniture logistics with focus on customer experience. Their growth and expansion plans create multiple opportunities.',
    createdAt: '2024-12-20T08:30:00Z',
    updatedAt: '2024-12-20T12:15:00Z',
  },
];

// GET - Fetch shipper discovery leads with comprehensive filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const companyType = searchParams.get('companyType');
    const industry = searchParams.get('industry');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const prospector = searchParams.get('prospector');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeMetrics = searchParams.get('metrics') === 'true';

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'tenantId is required' },
        { status: 400 }
      );
    }

    // Filter leads by tenant and other criteria
    let filteredLeads = shipperLeads.filter(
      (lead) => lead.tenantId === tenantId
    );

    if (companyType) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.companyType === companyType
      );
    }

    if (industry) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    if (priority) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.priority === priority
      );
    }

    if (status) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.prospectingActivity.status === status
      );
    }

    if (prospector) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.prospectingActivity.assignedProspector.includes(prospector)
      );
    }

    // Sort by priority and lead score
    filteredLeads = filteredLeads
      .sort((a, b) => {
        // First by priority (platinum > gold > silver > bronze)
        const priorityOrder = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        // Then by lead score
        if (a.leadScore !== b.leadScore) {
          return b.leadScore - a.leadScore;
        }
        // Finally by potential contract value
        return b.potentialContractValue - a.potentialContractValue;
      })
      .slice(0, limit);

    // Calculate comprehensive metrics
    const allLeads = shipperLeads.filter((lead) => lead.tenantId === tenantId);
    const metrics: DiscoveryMetrics = {
      totalProspects: allLeads.length,
      qualifiedProspects: allLeads.filter((lead) =>
        [
          'qualified',
          'proposal_requested',
          'rfp_submitted',
          'negotiating',
        ].includes(lead.prospectingActivity.status)
      ).length,
      platinumProspects: allLeads.filter((lead) => lead.priority === 'platinum')
        .length,
      totalPipelineValue: allLeads
        .filter(
          (lead) => !['won', 'lost'].includes(lead.prospectingActivity.status)
        )
        .reduce((sum, lead) => sum + lead.potentialContractValue, 0),
      averageContractValue:
        allLeads.length > 0
          ? allLeads.reduce(
              (sum, lead) => sum + lead.potentialContractValue,
              0
            ) / allLeads.length
          : 0,
      discoveryRate: 3.2, // new prospects per week
      qualificationRate: 35, // % of discovered prospects that qualify
      conversionRate: 12, // % that become customers
      industryBreakdown: allLeads.reduce(
        (acc, lead) => {
          acc[lead.industry] = (acc[lead.industry] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      discoverySourcePerformance: allLeads.reduce(
        (acc, lead) => {
          const source = lead.discoverySource;
          if (!acc[source]) {
            acc[source] = {
              prospects: 0,
              qualified: 0,
              avgValue: 0,
              conversionRate: 0,
            };
          }
          acc[source].prospects++;
          if (
            [
              'qualified',
              'proposal_requested',
              'rfp_submitted',
              'negotiating',
              'won',
            ].includes(lead.prospectingActivity.status)
          ) {
            acc[source].qualified++;
          }
          acc[source].avgValue =
            (acc[source].avgValue + lead.potentialContractValue) /
            acc[source].prospects;
          return acc;
        },
        {} as Record<string, any>
      ),
      prospectorPerformance: allLeads.reduce(
        (acc, lead) => {
          const prospector =
            lead.prospectingActivity.assignedProspector.split(' - ')[0];
          if (!acc[prospector]) {
            acc[prospector] = {
              discovered: 0,
              qualified: 0,
              meetings: 0,
              proposals: 0,
              won: 0,
              revenue: 0,
            };
          }
          acc[prospector].discovered++;
          if (
            [
              'qualified',
              'proposal_requested',
              'rfp_submitted',
              'negotiating',
              'won',
            ].includes(lead.prospectingActivity.status)
          ) {
            acc[prospector].qualified++;
          }
          acc[prospector].meetings +=
            lead.prospectingActivity.meetingsScheduled;
          acc[prospector].proposals +=
            lead.prospectingActivity.proposalsRequested;
          if (lead.prospectingActivity.status === 'won') {
            acc[prospector].won++;
            acc[prospector].revenue += lead.potentialContractValue;
          }
          return acc;
        },
        {} as Record<string, any>
      ),
      monthlyTrends: [
        {
          month: 'Nov 2024',
          discovered: 12,
          qualified: 4,
          pipelineValue: 28000000,
        },
        {
          month: 'Dec 2024',
          discovered: 18,
          qualified: 7,
          pipelineValue: 42000000,
        },
        { month: 'Jan 2025', discovered: 0, qualified: 0, pipelineValue: 0 }, // Projected
      ],
    };

    const response: any = {
      success: true,
      data: {
        shipperLeads: filteredLeads,
        totalCount: allLeads.length,
        filteredCount: filteredLeads.length,
        timestamp: new Date().toISOString(),
      },
    };

    if (includeMetrics) {
      response.data.metrics = metrics;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Shipper Discovery API GET failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipper discovery leads' },
      { status: 500 }
    );
  }
}

// POST - Create new shipper discovery lead with AI scoring
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadData } = body;

    if (!leadData) {
      return NextResponse.json(
        { success: false, error: 'leadData is required' },
        { status: 400 }
      );
    }

    // AI Lead Scoring Algorithm for Shippers/Manufacturers
    const calculateShipperLeadScore = (lead: any): number => {
      let score = 0;

      // Company size and revenue (25 points max)
      if (lead.companyProfile?.annualRevenue) {
        const revenue = lead.companyProfile.annualRevenue;
        if (revenue.includes('$50B+') || revenue.includes('$100B+'))
          score += 25;
        else if (revenue.includes('$10B-$50B')) score += 22;
        else if (revenue.includes('$5B-$10B')) score += 20;
        else if (revenue.includes('$1B-$5B')) score += 18;
        else if (revenue.includes('$500M-$1B')) score += 15;
        else if (revenue.includes('$100M-$500M')) score += 12;
        else score += 8;
      }

      // Shipping volume and complexity (20 points max)
      if (lead.annualShippingVolume?.estimatedLoads) {
        const loads = lead.annualShippingVolume.estimatedLoads;
        if (loads >= 20000) score += 20;
        else if (loads >= 10000) score += 17;
        else if (loads >= 5000) score += 14;
        else if (loads >= 2000) score += 11;
        else if (loads >= 1000) score += 8;
        else score += 5;
      }

      // Supply chain complexity (15 points max)
      if (lead.companyProfile?.supplyChainComplexity) {
        const complexity = lead.companyProfile.supplyChainComplexity;
        if (complexity === 'Highly_Complex') score += 15;
        else if (complexity === 'Complex') score += 12;
        else if (complexity === 'Moderate') score += 8;
        else score += 5;
      }

      // Growth trend and opportunity timing (15 points max)
      if (lead.discoveryIntel?.growthTrend) {
        const growth = lead.discoveryIntel.growthTrend;
        if (growth === 'Rapid_Growth') score += 15;
        else if (growth === 'Steady_Growth') score += 12;
        else if (growth === 'Stable') score += 8;
        else score += 3;
      }

      // Financial health (10 points max)
      if (lead.discoveryIntel?.financialHealth) {
        const health = lead.discoveryIntel.financialHealth;
        if (health === 'Excellent') score += 10;
        else if (health === 'Good') score += 8;
        else if (health === 'Fair') score += 5;
        else score += 2;
      }

      // Technology adoption and logistics maturity (10 points max)
      if (lead.discoveryIntel?.technologyAdoption === 'High') score += 5;
      else if (lead.discoveryIntel?.technologyAdoption === 'Medium') score += 3;

      if (lead.discoveryIntel?.logisticsMaturity === 'Advanced') score += 5;
      else if (lead.discoveryIntel?.logisticsMaturity === 'Intermediate')
        score += 3;
      else score += 1;

      // Discovery source quality (5 points max)
      const highQualitySources = [
        'SEC_Filings_Analysis',
        'Trade_Publication_Monitoring',
        'Government_Contract_Analysis',
      ];
      if (highQualitySources.includes(lead.discoverySource)) score += 5;
      else score += 3;

      return Math.min(score, 100);
    };

    // Determine priority based on score and contract value
    const determinePriority = (
      score: number,
      contractValue: number
    ): 'platinum' | 'gold' | 'silver' | 'bronze' => {
      if (score >= 90 && contractValue >= 10000000) return 'platinum';
      if (score >= 80 && contractValue >= 5000000) return 'gold';
      if (score >= 70 && contractValue >= 2000000) return 'silver';
      return 'bronze';
    };

    const leadScore = calculateShipperLeadScore(leadData);
    const priority = determinePriority(
      leadScore,
      leadData.potentialContractValue || 0
    );

    const newLead: ShipperLead = {
      id: `SH-${Date.now()}`,
      leadId: `SHIPPER-DISC-${Date.now()}`,
      leadScore,
      priority,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      prospectingActivity: {
        status: 'discovered',
        assignedProspector:
          leadData.prospectingActivity?.assignedProspector || 'Auto-Assignment',
        discoveryDate: new Date().toISOString(),
        lastActivity: 'Lead discovered and added to system',
        nextAction: 'Initial research and contact identification',
        researchNotes: leadData.prospectingActivity?.researchNotes || '',
        outreachAttempts: 0,
        responseReceived: false,
        meetingsScheduled: 0,
        proposalsRequested: 0,
        ...leadData.prospectingActivity,
      },
      opportunityAssessment: {
        immediateOpportunity: false,
        timeframe: '6_Months',
        budgetAvailable: false,
        decisionMakingProcess: 'Unknown',
        competitiveThreats: [],
        winProbability: leadScore > 80 ? 60 : leadScore > 60 ? 40 : 20,
        strategicValue: 'Medium',
        ...leadData.opportunityAssessment,
      },
      tags: leadData.tags || [],
      notes: leadData.notes || '',
      ...leadData,
    };

    shipperLeads.unshift(newLead);

    // Keep only last 200 leads to prevent memory issues
    if (shipperLeads.length > 200) {
      shipperLeads = shipperLeads.slice(0, 200);
    }

    console.log(
      `✅ New shipper discovery lead created: ${newLead.companyName} - ${newLead.industry} (Score: ${newLead.leadScore}, Priority: ${newLead.priority})`
    );

    return NextResponse.json({
      success: true,
      data: {
        lead: newLead,
        message: 'Shipper discovery lead created successfully',
        leadScore: newLead.leadScore,
        priority: newLead.priority,
      },
    });
  } catch (error) {
    console.error('❌ Shipper Discovery API POST failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shipper discovery lead' },
      { status: 500 }
    );
  }
}

// PUT - Update shipper discovery lead
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, updates, activityType, activityNotes } = body;

    if (!leadId || !updates) {
      return NextResponse.json(
        { success: false, error: 'leadId and updates are required' },
        { status: 400 }
      );
    }

    const leadIndex = shipperLeads.findIndex((lead) => lead.id === leadId);

    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update the lead
    const updatedLead = {
      ...shipperLeads[leadIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update activity if specified
    if (activityType && activityNotes) {
      updatedLead.prospectingActivity = {
        ...updatedLead.prospectingActivity,
        lastActivity: activityNotes,
        ...updates.prospectingActivity,
      };
    }

    shipperLeads[leadIndex] = updatedLead;

    console.log(
      `✅ Shipper discovery lead updated: ${updatedLead.companyName} - ${activityType || 'General Update'}`
    );

    return NextResponse.json({
      success: true,
      data: {
        lead: updatedLead,
        message: 'Shipper discovery lead updated successfully',
      },
    });
  } catch (error) {
    console.error('❌ Shipper Discovery API PUT failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update shipper discovery lead' },
      { status: 500 }
    );
  }
}

// DELETE - Archive/delete shipper discovery lead
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'leadId is required' },
        { status: 400 }
      );
    }

    const leadIndex = shipperLeads.findIndex((lead) => lead.id === leadId);

    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const deletedLead = shipperLeads.splice(leadIndex, 1)[0];

    console.log(
      `✅ Shipper discovery lead deleted: ${deletedLead.companyName}`
    );

    return NextResponse.json({
      success: true,
      data: {
        message: 'Shipper discovery lead deleted successfully',
        deletedLead: {
          id: deletedLead.id,
          companyName: deletedLead.companyName,
          industry: deletedLead.industry,
        },
      },
    });
  } catch (error) {
    console.error('❌ Shipper Discovery API DELETE failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete shipper discovery lead' },
      { status: 500 }
    );
  }
}
