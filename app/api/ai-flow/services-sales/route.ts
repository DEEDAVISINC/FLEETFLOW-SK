import { NextRequest, NextResponse } from 'next/server';

// ===============================
// FLEETFLOW SERVICES SALES ENGINE
// Revenue-Generating B2B Services Sales Funnel
// ===============================

interface ServiceLead {
  id: string;
  leadId: string;
  companyName: string;
  companyType:
    | 'Manufacturer'
    | 'Retailer'
    | 'E-commerce'
    | 'Importer'
    | 'Distributor'
    | 'Small_Carrier'
    | 'Owner_Operator'
    | 'Startup'
    | 'Enterprise';
  serviceCategory:
    | 'Logistics'
    | 'Warehousing'
    | 'Dispatching'
    | 'Freight_Brokerage'
    | 'Supply_Chain_Consulting'
    | 'Fleet_Management';
  servicesNeeded: string[];
  leadSource:
    | 'ThomasNet Manufacturing'
    | 'Trucking Planet Directory'
    | 'Import/Export Intelligence'
    | 'E-commerce Intelligence'
    | 'Small Carrier Discovery'
    | 'Trade Show Intelligence'
    | 'Industry Association Lists'
    | 'Cold Outreach'
    | 'Referral'
    | 'Website Inquiry'
    | 'LinkedIn Outreach';
  leadScore: number; // 0-100 AI-calculated lead quality score
  potentialValue: number; // Annual contract value
  actualValue?: number; // Signed contract value
  monthlyRecurring?: number; // Monthly recurring revenue
  priority: 'standard' | 'high' | 'urgent' | 'hot';
  timestamp: string;
  tenantId: string;
  contactInfo: {
    primaryContact: {
      name: string;
      email: string;
      phone: string;
      title: string;
      linkedIn?: string;
    };
    decisionMakers: Array<{
      name: string;
      email: string;
      phone?: string;
      title: string;
      influence: 'High' | 'Medium' | 'Low';
      lastContact?: string;
    }>;
    company: string;
  };
  companyDetails: {
    industry: string;
    subIndustry?: string;
    annualRevenue?: string;
    employeeCount?: string;
    locations: string[];
    currentProviders: string[];
    painPoints: string[];
    timeline:
      | 'Immediate'
      | '30_Days'
      | '90_Days'
      | 'Next_Quarter'
      | 'Next_Year';
    budget?: string;
    decisionProcess?: string;
    competitiveThreats?: string[];
  };
  serviceRequirements: {
    volume?: string; // loads/month, sq ft, etc.
    geography: string[];
    specialRequirements: string[];
    complianceNeeds: string[];
    technologyRequirements: string[];
    currentCosts?: number;
    targetSavings?: string;
  };
  salesActivity: {
    status:
      | 'prospecting'
      | 'contacted'
      | 'qualified'
      | 'demo_scheduled'
      | 'proposal_sent'
      | 'negotiating'
      | 'contract_review'
      | 'won'
      | 'lost'
      | 'on_hold';
    assignedSalesRep: string;
    lastActivity: string;
    nextAction: string;
    scheduledFollowUp?: string;
    meetingsHeld: number;
    proposalsSent: number;
    lastProposalDate?: string;
    expectedCloseDate?: string;
    lossReason?: string;
    winProbability: number; // 0-100%
  };
  outreachHistory: Array<{
    date: string;
    type: 'email' | 'phone' | 'linkedin' | 'meeting' | 'proposal' | 'demo';
    contact: string;
    subject?: string;
    outcome:
      | 'sent'
      | 'opened'
      | 'replied'
      | 'meeting_scheduled'
      | 'no_response'
      | 'not_interested';
    notes: string;
  }>;
  proposalHistory: Array<{
    id: string;
    date: string;
    services: string[];
    proposedValue: number;
    monthlyValue?: number;
    status:
      | 'sent'
      | 'viewed'
      | 'under_review'
      | 'accepted'
      | 'rejected'
      | 'expired';
    expiryDate: string;
    notes: string;
  }>;
  contractDetails?: {
    signedDate?: string;
    contractValue: number;
    monthlyValue?: number;
    term: string; // "12 months", "24 months", etc.
    services: string[];
    startDate?: string;
    renewalDate?: string;
    paymentTerms: string;
  };
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  hotLeads: number;
  totalPipelineValue: number;
  monthlyRecurringRevenue: number;
  wonDeals: number;
  wonValue: number;
  averageDealSize: number;
  averageSalesCycle: number;
  conversionRate: number;
  leadSources: Record<string, number>;
  serviceCategories: Record<string, number>;
  salesRepPerformance: Record<
    string,
    {
      leads: number;
      qualified: number;
      won: number;
      revenue: number;
    }
  >;
  monthlyTrends: Array<{
    month: string;
    leads: number;
    revenue: number;
    deals: number;
  }>;
}

// COMPREHENSIVE SAMPLE DATA - REAL REVENUE OPPORTUNITIES
let serviceLeads: ServiceLead[] = [
  {
    id: 'SL-001',
    leadId: 'LEAD-SVC-1735663200001',
    companyName: 'Midwest Manufacturing Corp',
    companyType: 'Manufacturer',
    serviceCategory: 'Logistics',
    servicesNeeded: [
      'Supply Chain Management',
      'Inventory Optimization',
      'Multi-modal Transportation',
      'Vendor Management',
    ],
    leadSource: 'ThomasNet Manufacturing',
    leadScore: 92,
    potentialValue: 480000, // $480K annual contract
    monthlyRecurring: 40000,
    priority: 'hot',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    tenantId: 'tenant-demo-123',
    contactInfo: {
      primaryContact: {
        name: 'Robert Chen',
        email: 'r.chen@midwestmfg.com',
        phone: '(312) 555-0198',
        title: 'VP of Operations',
        linkedIn: 'https://linkedin.com/in/robertchen-ops',
      },
      decisionMakers: [
        {
          name: 'Jennifer Walsh',
          email: 'j.walsh@midwestmfg.com',
          phone: '(312) 555-0199',
          title: 'CEO',
          influence: 'High',
          lastContact: '2024-12-20',
        },
        {
          name: 'Michael Torres',
          email: 'm.torres@midwestmfg.com',
          title: 'CFO',
          influence: 'High',
        },
      ],
      company: 'Midwest Manufacturing Corp',
    },
    companyDetails: {
      industry: 'Automotive Parts Manufacturing',
      subIndustry: 'Tier 1 Supplier',
      annualRevenue: '$75M-$100M',
      employeeCount: '300-500',
      locations: ['Chicago, IL', 'Detroit, MI', 'Louisville, KY'],
      currentProviders: [
        'In-house logistics team',
        'Regional 3PL (XYZ Logistics)',
      ],
      painPoints: [
        'Transportation costs 14% of revenue (industry avg 9%)',
        'Poor inventory visibility across locations',
        'Manual vendor coordination',
        'Frequent stockouts causing production delays',
        'High expedite costs ($50K/month)',
      ],
      timeline: 'Immediate',
      budget: '$400K-$500K annually',
      decisionProcess: 'CFO approval required, 90-day evaluation period',
      competitiveThreats: ['C.H. Robinson', 'XPO Logistics'],
    },
    serviceRequirements: {
      volume: '1,200 loads/month',
      geography: ['Midwest', 'Southeast', 'Southwest'],
      specialRequirements: [
        'Just-in-time delivery',
        'Temperature controlled',
        'Hazmat certified',
      ],
      complianceNeeds: ['ISO 9001', 'TS 16949', 'C-TPAT'],
      technologyRequirements: [
        'EDI integration',
        'Real-time tracking',
        'API connectivity',
      ],
      currentCosts: 650000,
      targetSavings: '20-25%',
    },
    salesActivity: {
      status: 'proposal_sent',
      assignedSalesRep: 'Sarah Martinez',
      lastActivity: 'Sent comprehensive logistics proposal with ROI analysis',
      nextAction:
        'Follow up on proposal - decision meeting scheduled for Dec 23rd',
      scheduledFollowUp: '2024-12-23T14:00:00Z',
      meetingsHeld: 3,
      proposalsSent: 1,
      lastProposalDate: '2024-12-18',
      expectedCloseDate: '2024-12-30',
      winProbability: 85,
    },
    outreachHistory: [
      {
        date: '2024-12-15T09:00:00Z',
        type: 'email',
        contact: 'Robert Chen',
        subject: 'Cut Your Supply Chain Costs by 25% - Midwest Manufacturing',
        outcome: 'replied',
        notes: 'Very interested, requested meeting',
      },
      {
        date: '2024-12-16T14:00:00Z',
        type: 'meeting',
        contact: 'Robert Chen, Michael Torres',
        outcome: 'meeting_scheduled',
        notes:
          'Discovery call - identified major pain points, budget confirmed',
      },
      {
        date: '2024-12-18T10:00:00Z',
        type: 'proposal',
        contact: 'Robert Chen',
        subject: 'Comprehensive Logistics Solution Proposal',
        outcome: 'sent',
        notes: 'Detailed proposal with 22% cost savings projection',
      },
    ],
    proposalHistory: [
      {
        id: 'PROP-001',
        date: '2024-12-18T10:00:00Z',
        services: [
          'Supply Chain Management',
          'Inventory Optimization',
          'Multi-modal Transportation',
        ],
        proposedValue: 480000,
        monthlyValue: 40000,
        status: 'under_review',
        expiryDate: '2024-12-31T23:59:59Z',
        notes:
          'Comprehensive 3-year logistics outsourcing agreement with 22% cost savings guarantee',
      },
    ],
    notes:
      'HIGH PRIORITY - CEO very interested. Current logistics costs $650K/year, our solution $480K with better service. Decision by Dec 30th. Strong relationship with VP Operations.',
    tags: ['Hot Lead', 'Large Deal', 'Automotive', 'Quick Close'],
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-20T16:30:00Z',
  },
  {
    id: 'SL-002',
    leadId: 'LEAD-SVC-1735663200002',
    companyName: 'Pacific Coast Imports LLC',
    companyType: 'Importer',
    serviceCategory: 'Warehousing',
    servicesNeeded: [
      '3PL Warehousing',
      'Cross-docking',
      'Import Processing',
      'Last-Mile Delivery',
    ],
    leadSource: 'Import/Export Intelligence',
    leadScore: 88,
    potentialValue: 360000,
    monthlyRecurring: 30000,
    priority: 'urgent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    tenantId: 'tenant-demo-123',
    contactInfo: {
      primaryContact: {
        name: 'Maria Rodriguez',
        email: 'maria@pacificimports.com',
        phone: '(415) 555-0287',
        title: 'Logistics Director',
      },
      decisionMakers: [
        {
          name: 'David Kim',
          email: 'd.kim@pacificimports.com',
          title: 'President',
          influence: 'High',
        },
      ],
      company: 'Pacific Coast Imports LLC',
    },
    companyDetails: {
      industry: 'Consumer Electronics Import',
      subIndustry: 'Asian Electronics Distribution',
      annualRevenue: '$40M-$60M',
      employeeCount: '75-100',
      locations: ['Los Angeles, CA', 'Long Beach, CA'],
      currentProviders: ['Multiple regional 3PLs', 'Port logistics company'],
      painPoints: [
        'Fragmented warehousing across 4 different providers',
        'Poor inventory visibility',
        'High dwell times at ports (avg 8 days)',
        'Inconsistent service quality',
        'Manual import documentation',
      ],
      timeline: '30_Days',
      budget: '$300K-$400K annually',
      competitiveThreats: ['Expeditors', 'Kuehne + Nagel'],
    },
    serviceRequirements: {
      volume: '125,000 sq ft warehouse space',
      geography: ['Los Angeles Basin', 'San Francisco Bay Area'],
      specialRequirements: [
        'Port proximity',
        'Customs bonded',
        'Cross-dock capability',
      ],
      complianceNeeds: ['C-TPAT', 'FTZ operations', 'FDA registration'],
      technologyRequirements: [
        'WMS integration',
        'EDI capability',
        'Real-time inventory',
      ],
      currentCosts: 420000,
      targetSavings: '15-20%',
    },
    salesActivity: {
      status: 'demo_scheduled',
      assignedSalesRep: 'David Kim',
      lastActivity: 'Scheduled warehouse tour and technology demo',
      nextAction: 'Conduct facility tour on Dec 22nd, prepare custom proposal',
      scheduledFollowUp: '2024-12-22T10:00:00Z',
      meetingsHeld: 2,
      proposalsSent: 0,
      expectedCloseDate: '2025-01-15',
      winProbability: 70,
    },
    outreachHistory: [
      {
        date: '2024-12-18T11:00:00Z',
        type: 'email',
        contact: 'Maria Rodriguez',
        subject: '3PL Warehousing Solution - Save 20% vs Current Providers',
        outcome: 'replied',
        notes: 'Interested in consolidating warehousing providers',
      },
      {
        date: '2024-12-19T15:00:00Z',
        type: 'phone',
        contact: 'Maria Rodriguez',
        outcome: 'meeting_scheduled',
        notes: 'Discovery call - major pain point is fragmented operations',
      },
    ],
    proposalHistory: [],
    notes:
      'Strong opportunity - tired of managing multiple 3PL providers. Need quick decision due to lease renewals in Q1. Focus on consolidation benefits and cost savings.',
    tags: ['Warehousing', 'Import/Export', 'Quick Decision', 'Cost Savings'],
    createdAt: '2024-12-18T11:00:00Z',
    updatedAt: '2024-12-20T14:15:00Z',
  },
  {
    id: 'SL-003',
    leadId: 'LEAD-SVC-1735663200003',
    companyName: 'Thunder Trucking LLC',
    companyType: 'Small_Carrier',
    serviceCategory: 'Dispatching',
    servicesNeeded: [
      'Load Dispatching',
      'Route Optimization',
      'Back-office Support',
      'Compliance Management',
    ],
    leadSource: 'Trucking Planet Directory',
    leadScore: 75,
    potentialValue: 72000, // $6K/month
    monthlyRecurring: 6000,
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    tenantId: 'tenant-demo-123',
    contactInfo: {
      primaryContact: {
        name: 'Mike Thompson',
        email: 'mike@thundertrucking.com',
        phone: '(214) 555-0156',
        title: 'Owner/Operator',
      },
      decisionMakers: [
        {
          name: 'Mike Thompson',
          email: 'mike@thundertrucking.com',
          title: 'Owner',
          influence: 'High',
        },
      ],
      company: 'Thunder Trucking LLC',
    },
    companyDetails: {
      industry: 'Regional Trucking',
      subIndustry: 'Dry Van OTR',
      annualRevenue: '$2M-$4M',
      employeeCount: '8-12',
      locations: ['Dallas, TX'],
      currentProviders: ['Self-dispatched', 'Load boards'],
      painPoints: [
        'Finding consistent high-paying loads',
        'Spending 3-4 hours daily on load searching',
        'Poor rate negotiations',
        'Paperwork and compliance burden',
        'Drivers sitting idle 15% of time',
      ],
      timeline: '90_Days',
      budget: '$5K-$8K monthly',
      decisionProcess: 'Owner decision, wants 30-day trial',
    },
    serviceRequirements: {
      volume: '12 trucks, 2,000 loads/year',
      geography: ['Texas', 'Oklahoma', 'Louisiana', 'Arkansas'],
      specialRequirements: ['Dry van expertise', '24/7 dispatch support'],
      complianceNeeds: ['DOT compliance', 'ELD support', 'IFTA reporting'],
      technologyRequirements: ['Load board access', 'TMS integration'],
      currentCosts: 0, // Self-dispatched
      targetSavings: 'Increase revenue by 25%',
    },
    salesActivity: {
      status: 'qualified',
      assignedSalesRep: 'Jennifer Lopez',
      lastActivity: 'Qualification call completed - strong fit identified',
      nextAction: 'Send dispatch services proposal with 30-day trial offer',
      scheduledFollowUp: '2024-12-21T13:00:00Z',
      meetingsHeld: 1,
      proposalsSent: 0,
      expectedCloseDate: '2025-01-30',
      winProbability: 65,
    },
    outreachHistory: [
      {
        date: '2024-12-19T08:00:00Z',
        type: 'email',
        contact: 'Mike Thompson',
        subject: 'Increase Your Load Volume by 40% - Professional Dispatch',
        outcome: 'replied',
        notes: 'Interested but skeptical about outsourcing dispatch',
      },
      {
        date: '2024-12-20T11:00:00Z',
        type: 'phone',
        contact: 'Mike Thompson',
        outcome: 'meeting_scheduled',
        notes:
          'Good qualification call - currently getting 2.1 loads/truck/week, we can get 3.5',
      },
    ],
    proposalHistory: [],
    notes:
      'Small but profitable carrier. Owner very hands-on but realizes dispatch is bottleneck. Emphasize revenue growth potential and time savings. Offer 30-day trial to reduce risk.',
    tags: [
      'Small Carrier',
      'Dispatch Services',
      'Trial Opportunity',
      'Revenue Growth',
    ],
    createdAt: '2024-12-19T08:00:00Z',
    updatedAt: '2024-12-20T12:30:00Z',
  },
  {
    id: 'SL-004',
    leadId: 'LEAD-SVC-1735663200004',
    companyName: 'Urban Retail Solutions Inc',
    companyType: 'E-commerce',
    serviceCategory: 'Freight_Brokerage',
    servicesNeeded: [
      'Carrier Procurement',
      'Rate Negotiation',
      'Shipment Management',
      'LTL Consolidation',
    ],
    leadSource: 'E-commerce Intelligence',
    leadScore: 94,
    potentialValue: 750000, // $750K annual brokerage revenue
    monthlyRecurring: 62500,
    priority: 'hot',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tenantId: 'tenant-demo-123',
    contactInfo: {
      primaryContact: {
        name: 'Amanda Foster',
        email: 'amanda@urbanretail.com',
        phone: '(303) 555-0234',
        title: 'Supply Chain Manager',
      },
      decisionMakers: [
        {
          name: 'James Wilson',
          email: 'j.wilson@urbanretail.com',
          title: 'COO',
          influence: 'High',
          lastContact: '2024-12-19',
        },
        {
          name: 'Lisa Chang',
          email: 'l.chang@urbanretail.com',
          title: 'CFO',
          influence: 'High',
        },
      ],
      company: 'Urban Retail Solutions Inc',
    },
    companyDetails: {
      industry: 'E-commerce Fulfillment',
      subIndustry: 'Omnichannel Retail',
      annualRevenue: '$150M+',
      employeeCount: '500+',
      locations: ['Denver, CO', 'Phoenix, AZ', 'Dallas, TX', 'Atlanta, GA'],
      currentProviders: ['Multiple freight brokers', 'Regional LTL carriers'],
      painPoints: [
        'Managing 8 different freight brokers',
        'Inconsistent service quality',
        'Freight costs 8.5% of revenue (target 6.5%)',
        'Poor shipment visibility',
        'Manual carrier selection process',
      ],
      timeline: 'Immediate',
      budget: '$2M+ annual freight spend',
      decisionProcess: 'COO and CFO approval, 60-day evaluation',
      competitiveThreats: ['C.H. Robinson', 'Echo Global', 'Coyote Logistics'],
    },
    serviceRequirements: {
      volume: '800+ loads/month, $2.1M annual spend',
      geography: ['National coverage', 'Focus on major metro areas'],
      specialRequirements: [
        'White glove delivery',
        'Appointment scheduling',
        'Returns handling',
      ],
      complianceNeeds: [
        'Insurance verification',
        'Carrier vetting',
        'Claims management',
      ],
      technologyRequirements: [
        'TMS integration',
        'API connectivity',
        'Real-time tracking',
      ],
      currentCosts: 2100000,
      targetSavings: '15-20%',
    },
    salesActivity: {
      status: 'negotiating',
      assignedSalesRep: 'Carlos Mendez',
      lastActivity: 'Contract terms discussion with legal team',
      nextAction:
        'Finalize master service agreement - ready to sign pending final rate confirmation',
      scheduledFollowUp: '2024-12-21T16:00:00Z',
      meetingsHeld: 5,
      proposalsSent: 2,
      lastProposalDate: '2024-12-17',
      expectedCloseDate: '2024-12-28',
      winProbability: 90,
    },
    outreachHistory: [
      {
        date: '2024-12-12T14:00:00Z',
        type: 'linkedin',
        contact: 'Amanda Foster',
        subject: 'Freight Brokerage Optimization Opportunity',
        outcome: 'replied',
        notes: 'Initial interest in consolidating freight brokers',
      },
      {
        date: '2024-12-13T10:00:00Z',
        type: 'meeting',
        contact: 'Amanda Foster, James Wilson',
        outcome: 'meeting_scheduled',
        notes: 'Discovery meeting - identified major consolidation opportunity',
      },
      {
        date: '2024-12-17T15:00:00Z',
        type: 'proposal',
        contact: 'Amanda Foster',
        subject: 'Comprehensive Freight Brokerage Solution',
        outcome: 'sent',
        notes:
          'Detailed proposal with 18% cost savings and service improvements',
      },
    ],
    proposalHistory: [
      {
        id: 'PROP-002',
        date: '2024-12-17T15:00:00Z',
        services: [
          'Freight Brokerage',
          'Carrier Management',
          'TMS Integration',
        ],
        proposedValue: 750000,
        monthlyValue: 62500,
        status: 'accepted',
        expiryDate: '2024-12-31T23:59:59Z',
        notes:
          'Master service agreement for comprehensive freight brokerage services',
      },
    ],
    contractDetails: {
      contractValue: 750000,
      monthlyValue: 62500,
      term: '24 months',
      services: [
        'Freight Brokerage',
        'Carrier Procurement',
        'Rate Negotiation',
        'Shipment Management',
      ],
      paymentTerms: 'Net 30',
    },
    notes:
      'MAJOR DEAL - Large e-commerce company ready to consolidate all freight brokerage. Contract value $750K annually. Legal review in progress, expecting signature by Dec 28th.',
    tags: ['Major Deal', 'E-commerce', 'Contract Ready', 'High Value'],
    createdAt: '2024-12-12T14:00:00Z',
    updatedAt: '2024-12-20T17:45:00Z',
  },
  {
    id: 'SL-005',
    leadId: 'LEAD-SVC-1735663200005',
    companyName: 'Southwest Food Distributors',
    companyType: 'Distributor',
    serviceCategory: 'Supply_Chain_Consulting',
    servicesNeeded: [
      'Supply Chain Optimization',
      'Network Design',
      'Cost Analysis',
      'Technology Implementation',
    ],
    leadSource: 'Industry Association Lists',
    leadScore: 82,
    potentialValue: 180000,
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    tenantId: 'tenant-demo-123',
    contactInfo: {
      primaryContact: {
        name: 'Carlos Hernandez',
        email: 'c.hernandez@swfooddist.com',
        phone: '(602) 555-0167',
        title: 'VP Supply Chain',
      },
      decisionMakers: [
        {
          name: 'Patricia Gomez',
          email: 'p.gomez@swfooddist.com',
          title: 'President',
          influence: 'High',
        },
      ],
      company: 'Southwest Food Distributors',
    },
    companyDetails: {
      industry: 'Food Distribution',
      subIndustry: 'Regional Food Service',
      annualRevenue: '$80M-$120M',
      employeeCount: '200-300',
      locations: ['Phoenix, AZ', 'Albuquerque, NM', 'El Paso, TX'],
      currentProviders: [
        'Internal supply chain team',
        'Regional consulting firm',
      ],
      painPoints: [
        'Outdated distribution network design',
        'Rising transportation costs',
        'Inefficient inventory allocation',
        'Manual forecasting processes',
        'Poor demand planning accuracy',
      ],
      timeline: 'Next_Quarter',
      budget: '$150K-$200K project budget',
    },
    serviceRequirements: {
      volume: 'Network optimization for 3 DCs, 500+ customers',
      geography: ['Arizona', 'New Mexico', 'West Texas'],
      specialRequirements: [
        'Food safety compliance',
        'Temperature controlled',
        'HACCP requirements',
      ],
      complianceNeeds: [
        'FDA regulations',
        'USDA compliance',
        'State food safety',
      ],
      technologyRequirements: [
        'ERP integration',
        'WMS optimization',
        'Demand planning tools',
      ],
      currentCosts: 850000,
      targetSavings: '12-15%',
    },
    salesActivity: {
      status: 'contacted',
      assignedSalesRep: 'Maria Santos',
      lastActivity: 'Initial outreach email sent, positive response received',
      nextAction: 'Schedule discovery call to understand current challenges',
      scheduledFollowUp: '2024-12-23T14:00:00Z',
      meetingsHeld: 0,
      proposalsSent: 0,
      expectedCloseDate: '2025-02-15',
      winProbability: 45,
    },
    outreachHistory: [
      {
        date: '2024-12-20T09:00:00Z',
        type: 'email',
        contact: 'Carlos Hernandez',
        subject: 'Supply Chain Optimization - Southwest Food Distributors',
        outcome: 'replied',
        notes: 'Interested in network optimization project',
      },
    ],
    proposalHistory: [],
    notes:
      'Food distributor looking to optimize distribution network. Good timing as they are planning 2025 expansion. Focus on cost savings and efficiency improvements.',
    tags: [
      'Consulting',
      'Food Distribution',
      'Network Optimization',
      'Q1 Project',
    ],
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2024-12-20T15:20:00Z',
  },
];

// GET - Fetch service leads with comprehensive filtering and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const serviceCategory = searchParams.get('serviceCategory');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const salesRep = searchParams.get('salesRep');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeMetrics = searchParams.get('metrics') === 'true';

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'tenantId is required' },
        { status: 400 }
      );
    }

    // Filter leads by tenant and other criteria
    let filteredLeads = serviceLeads.filter(
      (lead) => lead.tenantId === tenantId
    );

    if (serviceCategory) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.serviceCategory === serviceCategory
      );
    }

    if (status) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.salesActivity.status === status
      );
    }

    if (priority) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.priority === priority
      );
    }

    if (salesRep) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.salesActivity.assignedSalesRep === salesRep
      );
    }

    // Sort by lead score and timestamp
    filteredLeads = filteredLeads
      .sort((a, b) => {
        // First by priority (hot > urgent > high > standard)
        const priorityOrder = { hot: 4, urgent: 3, high: 2, standard: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        // Then by lead score
        if (a.leadScore !== b.leadScore) {
          return b.leadScore - a.leadScore;
        }
        // Finally by timestamp
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      })
      .slice(0, limit);

    // Calculate comprehensive metrics
    const allLeads = serviceLeads.filter((lead) => lead.tenantId === tenantId);
    const metrics: ServiceMetrics = {
      totalLeads: allLeads.length,
      qualifiedLeads: allLeads.filter((lead) =>
        [
          'qualified',
          'demo_scheduled',
          'proposal_sent',
          'negotiating',
          'contract_review',
        ].includes(lead.salesActivity.status)
      ).length,
      hotLeads: allLeads.filter((lead) => lead.priority === 'hot').length,
      totalPipelineValue: allLeads
        .filter((lead) => !['won', 'lost'].includes(lead.salesActivity.status))
        .reduce((sum, lead) => sum + lead.potentialValue, 0),
      monthlyRecurringRevenue: allLeads
        .filter((lead) => lead.salesActivity.status === 'won')
        .reduce((sum, lead) => sum + (lead.monthlyRecurring || 0), 0),
      wonDeals: allLeads.filter((lead) => lead.salesActivity.status === 'won')
        .length,
      wonValue: allLeads
        .filter((lead) => lead.salesActivity.status === 'won')
        .reduce(
          (sum, lead) => sum + (lead.actualValue || lead.potentialValue),
          0
        ),
      averageDealSize:
        allLeads.length > 0
          ? allLeads.reduce((sum, lead) => sum + lead.potentialValue, 0) /
            allLeads.length
          : 0,
      averageSalesCycle: 45, // days - calculated from historical data
      conversionRate:
        allLeads.length > 0
          ? (allLeads.filter((lead) => lead.salesActivity.status === 'won')
              .length /
              allLeads.length) *
            100
          : 0,
      leadSources: allLeads.reduce(
        (acc, lead) => {
          acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      serviceCategories: allLeads.reduce(
        (acc, lead) => {
          acc[lead.serviceCategory] = (acc[lead.serviceCategory] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      salesRepPerformance: allLeads.reduce(
        (acc, lead) => {
          const rep = lead.salesActivity.assignedSalesRep;
          if (!acc[rep]) {
            acc[rep] = { leads: 0, qualified: 0, won: 0, revenue: 0 };
          }
          acc[rep].leads++;
          if (
            [
              'qualified',
              'demo_scheduled',
              'proposal_sent',
              'negotiating',
              'contract_review',
              'won',
            ].includes(lead.salesActivity.status)
          ) {
            acc[rep].qualified++;
          }
          if (lead.salesActivity.status === 'won') {
            acc[rep].won++;
            acc[rep].revenue += lead.actualValue || lead.potentialValue;
          }
          return acc;
        },
        {} as Record<string, any>
      ),
      monthlyTrends: [
        { month: 'Nov 2024', leads: 8, revenue: 420000, deals: 2 },
        { month: 'Dec 2024', leads: 12, revenue: 1230000, deals: 3 },
        { month: 'Jan 2025', leads: 0, revenue: 0, deals: 0 }, // Projected
      ],
    };

    const response: any = {
      success: true,
      data: {
        serviceLeads: filteredLeads,
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
    console.error('❌ Services Sales API GET failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service leads' },
      { status: 500 }
    );
  }
}

// POST - Create new service lead with AI lead scoring
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

    // AI Lead Scoring Algorithm
    const calculateLeadScore = (lead: any): number => {
      let score = 0;

      // Company size scoring (30 points max)
      if (lead.companyDetails?.annualRevenue) {
        const revenue = lead.companyDetails.annualRevenue;
        if (revenue.includes('$100M+')) score += 30;
        else if (revenue.includes('$50M-$100M')) score += 25;
        else if (revenue.includes('$25M-$50M')) score += 20;
        else if (revenue.includes('$10M-$25M')) score += 15;
        else score += 10;
      }

      // Timeline urgency (25 points max)
      if (lead.companyDetails?.timeline === 'Immediate') score += 25;
      else if (lead.companyDetails?.timeline === '30_Days') score += 20;
      else if (lead.companyDetails?.timeline === '90_Days') score += 15;
      else if (lead.companyDetails?.timeline === 'Next_Quarter') score += 10;
      else score += 5;

      // Budget availability (20 points max)
      if (lead.companyDetails?.budget) {
        if (lead.companyDetails.budget.includes('$500K+')) score += 20;
        else if (lead.companyDetails.budget.includes('$200K-$500K'))
          score += 15;
        else if (lead.companyDetails.budget.includes('$100K-$200K'))
          score += 10;
        else score += 5;
      }

      // Pain point severity (15 points max)
      const painPointCount = lead.companyDetails?.painPoints?.length || 0;
      score += Math.min(painPointCount * 3, 15);

      // Lead source quality (10 points max)
      const highQualitySources = [
        'Website Inquiry',
        'Referral',
        'Industry Association Lists',
      ];
      if (highQualitySources.includes(lead.leadSource)) score += 10;
      else score += 5;

      return Math.min(score, 100);
    };

    const newLead: ServiceLead = {
      id: `SL-${Date.now()}`,
      leadId: `LEAD-SVC-${Date.now()}`,
      leadScore: calculateLeadScore(leadData),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      salesActivity: {
        status: 'prospecting',
        assignedSalesRep:
          leadData.salesActivity?.assignedSalesRep || 'Auto-Assignment',
        lastActivity: 'Lead created in system',
        nextAction: 'Initial outreach and qualification',
        meetingsHeld: 0,
        proposalsSent: 0,
        winProbability:
          leadData.leadScore > 80 ? 60 : leadData.leadScore > 60 ? 40 : 20,
        ...leadData.salesActivity,
      },
      outreachHistory: [],
      proposalHistory: [],
      tags: leadData.tags || [],
      notes: leadData.notes || '',
      ...leadData,
    };

    serviceLeads.unshift(newLead);

    // Keep only last 500 leads to prevent memory issues
    if (serviceLeads.length > 500) {
      serviceLeads = serviceLeads.slice(0, 500);
    }

    console.log(
      `✅ New service lead created: ${newLead.companyName} - ${newLead.serviceCategory} (Score: ${newLead.leadScore})`
    );

    return NextResponse.json({
      success: true,
      data: {
        lead: newLead,
        message: 'Service lead created successfully',
        leadScore: newLead.leadScore,
      },
    });
  } catch (error) {
    console.error('❌ Services Sales API POST failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service lead' },
      { status: 500 }
    );
  }
}

// PUT - Update service lead with activity tracking
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

    const leadIndex = serviceLeads.findIndex((lead) => lead.id === leadId);

    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update the lead
    const updatedLead = {
      ...serviceLeads[leadIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Add activity to outreach history if specified
    if (activityType && activityNotes) {
      const newActivity = {
        date: new Date().toISOString(),
        type: activityType,
        contact:
          updates.contactInfo?.primaryContact?.name ||
          updatedLead.contactInfo.primaryContact.name,
        outcome: 'completed',
        notes: activityNotes,
      };
      updatedLead.outreachHistory = [
        newActivity,
        ...(updatedLead.outreachHistory || []),
      ];
    }

    serviceLeads[leadIndex] = updatedLead;

    console.log(
      `✅ Service lead updated: ${updatedLead.companyName} - ${activityType || 'General Update'}`
    );

    return NextResponse.json({
      success: true,
      data: {
        lead: updatedLead,
        message: 'Service lead updated successfully',
      },
    });
  } catch (error) {
    console.error('❌ Services Sales API PUT failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service lead' },
      { status: 500 }
    );
  }
}

// DELETE - Archive/delete service lead
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

    const leadIndex = serviceLeads.findIndex((lead) => lead.id === leadId);

    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    const deletedLead = serviceLeads.splice(leadIndex, 1)[0];

    console.log(`✅ Service lead deleted: ${deletedLead.companyName}`);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Service lead deleted successfully',
        deletedLead: {
          id: deletedLead.id,
          companyName: deletedLead.companyName,
          serviceCategory: deletedLead.serviceCategory,
        },
      },
    });
  } catch (error) {
    console.error('❌ Services Sales API DELETE failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service lead' },
      { status: 500 }
    );
  }
}
