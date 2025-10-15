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
// TODO: Replace with real data from CRM/database
let shipperLeads: ShipperLead[] = [];

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

    console.info(
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

    console.info(
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

    console.info(
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
