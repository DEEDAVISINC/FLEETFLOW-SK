/**
 * 🏢 Enhanced CRM Service
 * Relationship scoring, upselling alerts, contract tracking, shipper preferences, competitive intelligence
 */

interface CustomerRelationshipScore {
  customerId: string;
  customerName: string;
  overallScore: number;
  scoreBreakdown: {
    paymentHistory: number;
    volumeConsistency: number;
    marginQuality: number;
    communicationQuality: number;
    growthPotential: number;
    loyalty: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  relationshipStage:
    | 'prospect'
    | 'new'
    | 'established'
    | 'strategic'
    | 'at_risk';
  lastInteraction: string;
  nextActionRecommended: string;
  accountManager: string;
}

interface UpsellOpportunity {
  id: string;
  customerId: string;
  customerName: string;
  opportunityType:
    | 'volume_increase'
    | 'new_lanes'
    | 'premium_services'
    | 'dedicated_capacity'
    | 'technology_upgrade';
  title: string;
  description: string;
  estimatedValue: number;
  probability: number;
  timeframe: string;
  requiredActions: string[];
  competitorThreat: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
  assignedTo: string;
  status:
    | 'identified'
    | 'qualified'
    | 'proposal_sent'
    | 'negotiating'
    | 'closed_won'
    | 'closed_lost';
}

interface ContractDetails {
  contractId: string;
  customerId: string;
  customerName: string;
  contractType: 'spot' | 'contract' | 'dedicated' | 'managed_transportation';
  startDate: string;
  endDate: string;
  totalValue: number;
  rateStructure: 'fixed' | 'cost_plus' | 'indexed' | 'variable';
  minimumVolume?: number;
  maximumVolume?: number;
  lanes: Array<{
    origin: string;
    destination: string;
    volume: number;
    rate: number;
  }>;
  performance: {
    onTimeDelivery: number;
    damageRate: number;
    customerSatisfaction: number;
    costVariance: number;
  };
  renewalDate: string;
  renewalProbability: number;
  keyTerms: string[];
  status: 'active' | 'pending_renewal' | 'expired' | 'terminated';
}

interface ShipperPreferences {
  customerId: string;
  customerName: string;
  preferences: {
    communicationMethods: string[];
    reportingFrequency: string;
    equipmentTypes: string[];
    carrierRequirements: string[];
    serviceLevel: 'standard' | 'premium' | 'white_glove';
    specialInstructions: string[];
  };
  restrictions: {
    blacklistedCarriers: string[];
    forbiddenLanes: string[];
    timeWindows: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    specialRequirements: string[];
  };
  contactPreferences: {
    primaryContact: string;
    backupContact: string;
    escalationContact: string;
    preferredContactTime: string;
    emergencyContact: string;
  };
  paymentTerms: {
    terms: number;
    earlyPaymentDiscount: number;
    penaltyRate: number;
    preferredPaymentMethod: string;
  };
  lastUpdated: string;
}

interface CompetitiveIntelligence {
  customerId: string;
  customerName: string;
  competitors: Array<{
    competitorName: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
    pricing: 'higher' | 'competitive' | 'lower';
    serviceLevel: 'basic' | 'standard' | 'premium';
    relationshipStrength: 'weak' | 'moderate' | 'strong';
    lastActivity: string;
  }>;
  marketPosition: {
    ourShare: number;
    primaryCompetitor: string;
    competitiveAdvantages: string[];
    vulnerabilities: string[];
    winLossRatio: number;
  };
  threats: Array<{
    type:
      | 'price_competition'
      | 'service_gap'
      | 'relationship_risk'
      | 'technology_disadvantage';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    mitigationPlan: string;
    timeline: string;
  }>;
  opportunities: Array<{
    type:
      | 'competitor_weakness'
      | 'market_gap'
      | 'technology_advantage'
      | 'relationship_opportunity';
    description: string;
    actionPlan: string;
    estimatedValue: number;
    timeline: string;
  }>;
  lastUpdated: string;
}

interface CRMDashboardData {
  customerMetrics: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomersThisMonth: number;
    churnRate: number;
    averageCustomerValue: number;
    lifetimeValue: number;
  };
  relationshipHealth: {
    strategic: number;
    established: number;
    new: number;
    at_risk: number;
    prospect: number;
  };
  pipeline: {
    totalOpportunities: number;
    pipelineValue: number;
    averageDealSize: number;
    winRate: number;
    averageSalesCycle: number;
  };
  contracts: {
    totalContracts: number;
    renewalsThisQuarter: number;
    atRiskContracts: number;
    averageContractValue: number;
    renewalRate: number;
  };
}

export class BrokerCRMService {
  private static instance: BrokerCRMService;

  public static getInstance(): BrokerCRMService {
    if (!BrokerCRMService.instance) {
      BrokerCRMService.instance = new BrokerCRMService();
    }
    return BrokerCRMService.instance;
  }

  /**
   * Get customer relationship scores
   */
  async getCustomerRelationshipScores(brokerId: string): Promise<{
    scores: CustomerRelationshipScore[];
    summary: {
      averageScore: number;
      scoreTrend: number;
      highValueCustomers: number;
      atRiskCustomers: number;
    };
    recommendations: Array<{
      customerId: string;
      customerName: string;
      action: string;
      priority: string;
      expectedImpact: string;
    }>;
  }> {
    // Mock data - replace with actual database queries
    const scores = this.generateMockRelationshipScores();

    return {
      scores,
      summary: {
        averageScore: 78.5,
        scoreTrend: 2.3,
        highValueCustomers: scores.filter((s) => s.overallScore >= 80).length,
        atRiskCustomers: scores.filter((s) => s.relationshipStage === 'at_risk')
          .length,
      },
      recommendations: [
        {
          customerId: 'CUST_001',
          customerName: 'Walmart Distribution',
          action: 'Schedule quarterly business review',
          priority: 'high',
          expectedImpact:
            'Strengthen strategic relationship, identify expansion opportunities',
        },
        {
          customerId: 'CUST_003',
          customerName: 'Target Supply Chain',
          action: 'Address payment delay concerns',
          priority: 'critical',
          expectedImpact:
            'Prevent relationship deterioration, improve cash flow',
        },
      ],
    };
  }

  /**
   * Get upsell opportunities
   */
  async getUpsellOpportunities(brokerId: string): Promise<{
    opportunities: UpsellOpportunity[];
    summary: {
      totalValue: number;
      qualifiedOpportunities: number;
      averageValue: number;
      expectedRevenue: number;
    };
    alerts: Array<{
      type:
        | 'deadline_approaching'
        | 'competitor_threat'
        | 'high_value'
        | 'quick_win';
      opportunityId: string;
      message: string;
      urgency: string;
    }>;
  }> {
    const opportunities = this.generateMockUpsellOpportunities();

    return {
      opportunities,
      summary: {
        totalValue: opportunities.reduce(
          (sum, opp) => sum + opp.estimatedValue,
          0
        ),
        qualifiedOpportunities: opportunities.filter(
          (opp) => opp.status === 'qualified'
        ).length,
        averageValue:
          opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0) /
          opportunities.length,
        expectedRevenue: opportunities.reduce(
          (sum, opp) => sum + (opp.estimatedValue * opp.probability) / 100,
          0
        ),
      },
      alerts: [
        {
          type: 'deadline_approaching',
          opportunityId: 'UPS_001',
          message: 'Amazon Logistics expansion proposal due in 5 days',
          urgency: 'high',
        },
        {
          type: 'competitor_threat',
          opportunityId: 'UPS_002',
          message: 'Competitor actively pursuing Home Depot account',
          urgency: 'critical',
        },
      ],
    };
  }

  /**
   * Get contract tracking information
   */
  async getContractTracking(brokerId: string): Promise<{
    contracts: ContractDetails[];
    summary: {
      totalValue: number;
      renewalsNext90Days: number;
      atRiskContracts: number;
      performanceScore: number;
    };
    renewalPipeline: Array<{
      contractId: string;
      customerName: string;
      renewalDate: string;
      value: number;
      probability: number;
      status: string;
    }>;
  }> {
    const contracts = this.generateMockContractDetails();

    return {
      contracts,
      summary: {
        totalValue: contracts.reduce(
          (sum, contract) => sum + contract.totalValue,
          0
        ),
        renewalsNext90Days: contracts.filter((c) =>
          this.isWithinDays(c.renewalDate, 90)
        ).length,
        atRiskContracts: contracts.filter((c) => c.renewalProbability < 60)
          .length,
        performanceScore: 87.5,
      },
      renewalPipeline: contracts
        .filter((c) => this.isWithinDays(c.renewalDate, 180))
        .map((c) => ({
          contractId: c.contractId,
          customerName: c.customerName,
          renewalDate: c.renewalDate,
          value: c.totalValue,
          probability: c.renewalProbability,
          status: c.status,
        })),
    };
  }

  /**
   * Get CRM dashboard data
   */
  async getCRMDashboard(brokerId: string): Promise<CRMDashboardData> {
    // Mock data - replace with actual analytics queries
    return {
      customerMetrics: {
        totalCustomers: 247,
        activeCustomers: 189,
        newCustomersThisMonth: 12,
        churnRate: 3.2,
        averageCustomerValue: 125000,
        lifetimeValue: 875000,
      },
      relationshipHealth: {
        strategic: 8,
        established: 67,
        new: 45,
        at_risk: 12,
        prospect: 115,
      },
      pipeline: {
        totalOpportunities: 34,
        pipelineValue: 2450000,
        averageDealSize: 72000,
        winRate: 68.5,
        averageSalesCycle: 45,
      },
      contracts: {
        totalContracts: 89,
        renewalsThisQuarter: 23,
        atRiskContracts: 7,
        averageContractValue: 450000,
        renewalRate: 82.3,
      },
    };
  }

  // Helper methods for generating mock data
  private generateMockRelationshipScores(): CustomerRelationshipScore[] {
    const customers = [
      'Walmart Distribution',
      'Amazon Logistics',
      'Target Supply Chain',
      'Home Depot',
    ];

    return customers.map((name, index) => ({
      customerId: `CUST_${(index + 1).toString().padStart(3, '0')}`,
      customerName: name,
      overallScore: Math.floor(Math.random() * 40) + 60,
      scoreBreakdown: {
        paymentHistory: Math.floor(Math.random() * 30) + 70,
        volumeConsistency: Math.floor(Math.random() * 30) + 60,
        marginQuality: Math.floor(Math.random() * 40) + 50,
        communicationQuality: Math.floor(Math.random() * 30) + 70,
        growthPotential: Math.floor(Math.random() * 50) + 40,
        loyalty: Math.floor(Math.random() * 30) + 60,
      },
      riskLevel: ['low', 'medium', 'high'][
        Math.floor(Math.random() * 3)
      ] as any,
      relationshipStage: [
        'prospect',
        'new',
        'established',
        'strategic',
        'at_risk',
      ][Math.floor(Math.random() * 5)] as any,
      lastInteraction: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      nextActionRecommended: 'Schedule quarterly business review',
      accountManager: ['John Smith', 'Sarah Johnson'][
        Math.floor(Math.random() * 2)
      ],
    }));
  }

  private generateMockUpsellOpportunities(): UpsellOpportunity[] {
    return [
      {
        id: 'UPS_001',
        customerId: 'CUST_002',
        customerName: 'Amazon Logistics',
        opportunityType: 'new_lanes',
        title: 'West Coast Distribution Expansion',
        description: 'Opportunity to handle new CA-WA-OR distribution network',
        estimatedValue: 2400000,
        probability: 75,
        timeframe: '120 days',
        requiredActions: [
          'Capacity analysis',
          'Rate proposal',
          'Service level agreement',
        ],
        competitorThreat: true,
        urgency: 'high',
        lastUpdated: '2024-01-24T15:00:00Z',
        assignedTo: 'Sarah Johnson',
        status: 'proposal_sent',
      },
      {
        id: 'UPS_002',
        customerId: 'CUST_004',
        customerName: 'Home Depot',
        opportunityType: 'dedicated_capacity',
        title: 'Dedicated Fleet for Building Materials',
        description:
          'Dedicated 20-truck fleet for high-volume building materials distribution',
        estimatedValue: 1800000,
        probability: 60,
        timeframe: '90 days',
        requiredActions: [
          'Fleet proposal',
          'Equipment sourcing',
          'Driver recruitment plan',
        ],
        competitorThreat: true,
        urgency: 'critical',
        lastUpdated: '2024-01-23T10:30:00Z',
        assignedTo: 'Mike Chen',
        status: 'negotiating',
      },
    ];
  }

  private generateMockContractDetails(): ContractDetails[] {
    return [
      {
        contractId: 'CONT_001',
        customerId: 'CUST_001',
        customerName: 'Walmart Distribution',
        contractType: 'dedicated',
        startDate: '2023-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        totalValue: 4500000,
        rateStructure: 'cost_plus',
        minimumVolume: 500,
        maximumVolume: 800,
        lanes: [
          {
            origin: 'Atlanta, GA',
            destination: 'Miami, FL',
            volume: 150,
            rate: 1250,
          },
        ],
        performance: {
          onTimeDelivery: 94.2,
          damageRate: 0.3,
          customerSatisfaction: 4.6,
          costVariance: -2.1,
        },
        renewalDate: '2024-10-01T00:00:00Z',
        renewalProbability: 85,
        keyTerms: [
          'Dedicated fleet',
          'Fuel escalation clause',
          'Performance guarantees',
        ],
        status: 'active',
      },
    ];
  }

  private isWithinDays(dateString: string, days: number): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays >= 0;
  }
}
