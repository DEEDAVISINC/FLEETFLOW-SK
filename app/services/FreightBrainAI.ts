/**
 * Freight Brain AI - Centralized Knowledge System
 * Inspired by Sintra.ai's Brain AI Profile
 * Specialized for freight brokerage operations
 */

'use client';

export interface FreightKnowledge {
  id: string;
  category:
    | 'market_data'
    | 'carrier_intel'
    | 'customer_profiles'
    | 'lane_analytics'
    | 'compliance_rules'
    | 'pricing_strategies';
  title: string;
  content: any;
  confidence: number; // 0-100
  lastUpdated: Date;
  source: string;
  tags: string[];
  aiStaffAccess: string[]; // Which AI staff can access this knowledge
}

export interface MarketIntelligence {
  lane: string;
  averageRate: number;
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
  seasonalTrends: {
    month: string;
    multiplier: number;
  }[];
  competitorActivity: {
    competitor: string;
    marketShare: number;
    avgRate: number;
  }[];
}

export interface CarrierIntelligence {
  carrierId: string;
  dotNumber: string;
  companyName: string;
  performanceScore: number; // 0-100
  reliability: {
    onTimeDelivery: number;
    communicationScore: number;
    damageRate: number;
  };
  preferredLanes: string[];
  rateHistory: {
    lane: string;
    rate: number;
    date: Date;
  }[];
  riskFactors: string[];
  strengths: string[];
}

export interface CustomerProfile {
  customerId: string;
  companyName: string;
  industry: string;
  paymentTerms: string;
  creditRating: string;
  volumeHistory: {
    month: string;
    loads: number;
    revenue: number;
  }[];
  preferredCarriers: string[];
  specialRequirements: string[];
  communicationPreferences: {
    method: 'email' | 'phone' | 'text' | 'portal';
    frequency: 'immediate' | 'daily' | 'weekly';
    contactPerson: string;
  };
  profitability: {
    averageMargin: number;
    totalRevenue: number;
    growthTrend: 'increasing' | 'stable' | 'decreasing';
  };
}

export class FreightBrainAI {
  private knowledgeBase: FreightKnowledge[] = [];
  private marketIntelligence: Map<string, MarketIntelligence> = new Map();
  private carrierIntelligence: Map<string, CarrierIntelligence> = new Map();
  private customerProfiles: Map<string, CustomerProfile> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
    this.loadMarketIntelligence();
    this.loadCarrierIntelligence();
    this.loadCustomerProfiles();
  }

  /**
   * Initialize the knowledge base with freight-specific data
   */
  private initializeKnowledgeBase() {
    const baseKnowledge: FreightKnowledge[] = [
      {
        id: 'seasonal_freight_patterns',
        category: 'market_data',
        title: 'Seasonal Freight Patterns & Peak Seasons',
        content: {
          peakSeasons: [
            {
              period: 'Q4 (Oct-Dec)',
              reason: 'Holiday shipping surge',
              rateIncrease: '15-25%',
            },
            {
              period: 'Back-to-School (Aug-Sep)',
              reason: 'Retail restocking',
              rateIncrease: '10-15%',
            },
            {
              period: 'Spring (Mar-May)',
              reason: 'Construction season',
              rateIncrease: '8-12%',
            },
          ],
          slowSeasons: [
            {
              period: 'Jan-Feb',
              reason: 'Post-holiday slowdown',
              rateDecrease: '10-20%',
            },
            {
              period: 'July',
              reason: 'Summer vacation impact',
              rateDecrease: '5-10%',
            },
          ],
        },
        confidence: 95,
        lastUpdated: new Date(),
        source: 'Historical market analysis',
        tags: ['seasonal', 'rates', 'market-trends'],
        aiStaffAccess: ['Logan', 'Will', 'Ana Lytics', 'Brook R.'],
      },
      {
        id: 'dot_compliance_requirements',
        category: 'compliance_rules',
        title: 'DOT Compliance Requirements & Red Flags',
        content: {
          requiredDocuments: [
            'Valid DOT Number',
            'Current Insurance Certificate (minimum $1M)',
            'Safety Rating (Satisfactory or better)',
            'Valid MC Authority',
          ],
          redFlags: [
            'Safety rating below Satisfactory',
            'Recent out-of-service orders',
            'Insurance lapses in past 12 months',
            'DOT number less than 2 years old',
          ],
          verificationSteps: [
            'Check FMCSA SAFER database',
            'Verify insurance with carrier',
            'Review safety inspection history',
            'Confirm authority status',
          ],
        },
        confidence: 98,
        lastUpdated: new Date(),
        source: 'FMCSA regulations',
        tags: ['compliance', 'dot', 'safety', 'verification'],
        aiStaffAccess: ['Kameelah', 'Regina', 'Brook R.', 'Carrie R.'],
      },
      {
        id: 'rate_negotiation_strategies',
        category: 'pricing_strategies',
        title: 'Effective Rate Negotiation Strategies',
        content: {
          strategies: [
            {
              name: 'Market Rate Justification',
              description: 'Use current market data to justify rate increases',
              effectiveness: 85,
              bestUsedWhen: 'Market rates are trending upward',
            },
            {
              name: 'Volume Commitment',
              description: 'Offer guaranteed volume for better rates',
              effectiveness: 78,
              bestUsedWhen: 'Customer has consistent shipping needs',
            },
            {
              name: 'Service Differentiation',
              description: 'Highlight superior service as rate justification',
              effectiveness: 72,
              bestUsedWhen: 'Competing on service quality',
            },
          ],
          tacticsToAvoid: [
            'Aggressive pressure tactics',
            'Unrealistic rate demands',
            'Ignoring market conditions',
          ],
        },
        confidence: 88,
        lastUpdated: new Date(),
        source: 'Sales team best practices',
        tags: ['negotiation', 'rates', 'sales', 'strategy'],
        aiStaffAccess: ['Will', 'Brook R.', 'Logan'],
      },
    ];

    this.knowledgeBase = baseKnowledge;
  }

  /**
   * Load market intelligence data
   */
  private loadMarketIntelligence() {
    const marketData: MarketIntelligence[] = [
      {
        lane: 'CHI-ATL',
        averageRate: 2.15,
        demandLevel: 'high',
        seasonalTrends: [
          { month: 'Jan', multiplier: 0.85 },
          { month: 'Feb', multiplier: 0.9 },
          { month: 'Mar', multiplier: 1.05 },
          { month: 'Apr', multiplier: 1.1 },
          { month: 'May', multiplier: 1.15 },
          { month: 'Jun', multiplier: 1.08 },
          { month: 'Jul', multiplier: 0.95 },
          { month: 'Aug', multiplier: 1.12 },
          { month: 'Sep', multiplier: 1.18 },
          { month: 'Oct', multiplier: 1.25 },
          { month: 'Nov', multiplier: 1.3 },
          { month: 'Dec', multiplier: 1.2 },
        ],
        competitorActivity: [
          { competitor: 'MegaBroker Inc', marketShare: 15, avgRate: 2.18 },
          { competitor: 'FreightForce', marketShare: 12, avgRate: 2.12 },
          { competitor: 'LogiLink', marketShare: 8, avgRate: 2.2 },
        ],
      },
      {
        lane: 'LAX-DAL',
        averageRate: 1.95,
        demandLevel: 'medium',
        seasonalTrends: [
          { month: 'Jan', multiplier: 0.88 },
          { month: 'Feb', multiplier: 0.92 },
          { month: 'Mar', multiplier: 1.02 },
          { month: 'Apr', multiplier: 1.08 },
          { month: 'May', multiplier: 1.12 },
          { month: 'Jun', multiplier: 1.05 },
          { month: 'Jul', multiplier: 0.98 },
          { month: 'Aug', multiplier: 1.15 },
          { month: 'Sep', multiplier: 1.2 },
          { month: 'Oct', multiplier: 1.28 },
          { month: 'Nov', multiplier: 1.32 },
          { month: 'Dec', multiplier: 1.18 },
        ],
        competitorActivity: [
          { competitor: 'WestCoast Logistics', marketShare: 18, avgRate: 1.98 },
          { competitor: 'Texas Transport', marketShare: 14, avgRate: 1.92 },
          { competitor: 'Pacific Freight', marketShare: 10, avgRate: 2.01 },
        ],
      },
    ];

    marketData.forEach((data) => {
      this.marketIntelligence.set(data.lane, data);
    });
  }

  /**
   * Load carrier intelligence data
   */
  private loadCarrierIntelligence() {
    const carrierData: CarrierIntelligence[] = [
      {
        carrierId: 'reliable_transport_001',
        dotNumber: '1234567',
        companyName: 'Reliable Transport LLC',
        performanceScore: 94,
        reliability: {
          onTimeDelivery: 96,
          communicationScore: 92,
          damageRate: 0.2,
        },
        preferredLanes: ['CHI-ATL', 'ATL-MIA', 'CHI-DAL'],
        rateHistory: [
          { lane: 'CHI-ATL', rate: 2.1, date: new Date('2024-01-15') },
          { lane: 'CHI-ATL', rate: 2.15, date: new Date('2024-02-10') },
          { lane: 'ATL-MIA', rate: 1.85, date: new Date('2024-01-20') },
        ],
        riskFactors: [],
        strengths: [
          'Excellent communication',
          'Reliable delivery',
          'Competitive rates',
        ],
      },
      {
        carrierId: 'express_freight_002',
        dotNumber: '2345678',
        companyName: 'Express Freight Solutions',
        performanceScore: 87,
        reliability: {
          onTimeDelivery: 89,
          communicationScore: 85,
          damageRate: 0.5,
        },
        preferredLanes: ['LAX-DAL', 'DAL-ATL', 'LAX-PHX'],
        rateHistory: [
          { lane: 'LAX-DAL', rate: 1.9, date: new Date('2024-01-12') },
          { lane: 'LAX-DAL', rate: 1.95, date: new Date('2024-02-08') },
        ],
        riskFactors: ['Occasional communication delays'],
        strengths: [
          'Fast transit times',
          'Good equipment',
          'Flexible scheduling',
        ],
      },
    ];

    carrierData.forEach((carrier) => {
      this.carrierIntelligence.set(carrier.carrierId, carrier);
    });
  }

  /**
   * Load customer profiles
   */
  private loadCustomerProfiles() {
    const customerData: CustomerProfile[] = [
      {
        customerId: 'abc_manufacturing',
        companyName: 'ABC Manufacturing Inc',
        industry: 'Automotive Parts',
        paymentTerms: 'Net 30',
        creditRating: 'A+',
        volumeHistory: [
          { month: '2024-01', loads: 45, revenue: 95000 },
          { month: '2024-02', loads: 52, revenue: 108000 },
          { month: '2024-03', loads: 48, revenue: 102000 },
        ],
        preferredCarriers: ['reliable_transport_001', 'express_freight_002'],
        specialRequirements: ['Temperature controlled', 'White glove service'],
        communicationPreferences: {
          method: 'email',
          frequency: 'daily',
          contactPerson: 'Sarah Johnson - Logistics Manager',
        },
        profitability: {
          averageMargin: 18.5,
          totalRevenue: 305000,
          growthTrend: 'increasing',
        },
      },
    ];

    customerData.forEach((customer) => {
      this.customerProfiles.set(customer.customerId, customer);
    });
  }

  /**
   * Add new knowledge to the brain
   */
  addKnowledge(
    knowledge: Omit<FreightKnowledge, 'id' | 'lastUpdated'>
  ): string {
    const id = `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newKnowledge: FreightKnowledge = {
      ...knowledge,
      id,
      lastUpdated: new Date(),
    };

    this.knowledgeBase.push(newKnowledge);
    return id;
  }

  /**
   * Get knowledge by category
   */
  getKnowledgeByCategory(
    category: FreightKnowledge['category']
  ): FreightKnowledge[] {
    return this.knowledgeBase.filter((k) => k.category === category);
  }

  /**
   * Search knowledge base
   */
  searchKnowledge(query: string, staffMember?: string): FreightKnowledge[] {
    const queryLower = query.toLowerCase();

    return this.knowledgeBase
      .filter((knowledge) => {
        // Check staff access
        if (staffMember && !knowledge.aiStaffAccess.includes(staffMember)) {
          return false;
        }

        // Search in title, tags, and content
        const titleMatch = knowledge.title.toLowerCase().includes(queryLower);
        const tagMatch = knowledge.tags.some((tag) =>
          tag.toLowerCase().includes(queryLower)
        );
        const contentMatch = JSON.stringify(knowledge.content)
          .toLowerCase()
          .includes(queryLower);

        return titleMatch || tagMatch || contentMatch;
      })
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get market intelligence for a lane
   */
  getMarketIntelligence(lane: string): MarketIntelligence | null {
    return this.marketIntelligence.get(lane) || null;
  }

  /**
   * Get carrier intelligence
   */
  getCarrierIntelligence(carrierId: string): CarrierIntelligence | null {
    return this.carrierIntelligence.get(carrierId) || null;
  }

  /**
   * Get customer profile
   */
  getCustomerProfile(customerId: string): CustomerProfile | null {
    return this.customerProfiles.get(customerId) || null;
  }

  /**
   * Get AI-powered recommendations for staff member
   */
  getRecommendationsForStaff(staffMember: string, context: any = {}): any {
    const relevantKnowledge = this.knowledgeBase.filter((k) =>
      k.aiStaffAccess.includes(staffMember)
    );

    const recommendations = {
      staffMember,
      timestamp: new Date(),
      recommendations: [] as any[],
    };

    // Generate contextual recommendations based on staff role
    switch (staffMember) {
      case 'Logan': // Logistics
        recommendations.recommendations = [
          {
            type: 'market_insight',
            title: 'High-Demand Lanes This Week',
            content:
              'CHI-ATL showing 25% above average rates due to capacity shortage',
            priority: 'high',
            action: 'Focus carrier recruitment on this lane',
          },
          {
            type: 'carrier_alert',
            title: 'Top Performer Available',
            content: 'Reliable Transport LLC has capacity on preferred lanes',
            priority: 'medium',
            action: 'Reach out for upcoming loads',
          },
        ];
        break;

      case 'Will': // Sales
        recommendations.recommendations = [
          {
            type: 'pricing_opportunity',
            title: 'Rate Increase Opportunity',
            content: "Market rates up 15% on customer ABC's primary lanes",
            priority: 'high',
            action: 'Schedule rate discussion meeting',
          },
          {
            type: 'customer_insight',
            title: 'Volume Growth Trend',
            content: 'ABC Manufacturing showing 12% month-over-month growth',
            priority: 'medium',
            action: 'Propose volume commitment discount',
          },
        ];
        break;

      case 'Kameelah': // DOT Compliance
        recommendations.recommendations = [
          {
            type: 'compliance_alert',
            title: 'Insurance Renewals Due',
            content: '3 carriers have insurance expiring within 30 days',
            priority: 'high',
            action: 'Request updated certificates',
          },
          {
            type: 'safety_update',
            title: 'New FMCSA Regulations',
            content: 'Updated HOS rules effective next month',
            priority: 'medium',
            action: 'Brief operations team on changes',
          },
        ];
        break;
    }

    return recommendations;
  }

  /**
   * Update knowledge confidence based on usage and feedback
   */
  updateKnowledgeConfidence(
    knowledgeId: string,
    feedback: 'positive' | 'negative'
  ): void {
    const knowledge = this.knowledgeBase.find((k) => k.id === knowledgeId);
    if (knowledge) {
      if (feedback === 'positive') {
        knowledge.confidence = Math.min(100, knowledge.confidence + 2);
      } else {
        knowledge.confidence = Math.max(0, knowledge.confidence - 5);
      }
      knowledge.lastUpdated = new Date();
    }
  }

  /**
   * Get brain statistics
   */
  getBrainStats() {
    return {
      totalKnowledge: this.knowledgeBase.length,
      averageConfidence: Math.round(
        this.knowledgeBase.reduce((sum, k) => sum + k.confidence, 0) /
          this.knowledgeBase.length
      ),
      categoryCounts: {
        market_data: this.getKnowledgeByCategory('market_data').length,
        carrier_intel: this.getKnowledgeByCategory('carrier_intel').length,
        customer_profiles:
          this.getKnowledgeByCategory('customer_profiles').length,
        lane_analytics: this.getKnowledgeByCategory('lane_analytics').length,
        compliance_rules:
          this.getKnowledgeByCategory('compliance_rules').length,
        pricing_strategies:
          this.getKnowledgeByCategory('pricing_strategies').length,
      },
      marketLanes: this.marketIntelligence.size,
      carrierProfiles: this.carrierIntelligence.size,
      customerProfiles: this.customerProfiles.size,
      lastUpdated: new Date(),
    };
  }
}

// Export singleton instance
export const freightBrainAI = new FreightBrainAI();
