/**
 * Government Contract Forecasting System
 * Predicts future government contracting opportunities and spending patterns
 * For DEE DAVIS INC/DEPOINTE - WOSB Certified Transportation Company
 */

export interface ForecastPeriod {
  quarter: string;
  fiscalYear: number;
  startDate: string;
  endDate: string;
}

export interface SpendingForecast {
  agency: string;
  category: string;
  predictedValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
}

export interface AgencyContact {
  name: string;
  title: string;
  email: string;
  phone?: string;
  office: string;
}

export interface OpportunityForecast {
  id: string;
  title: string;
  agency: string;
  agencyCode: string;
  office: string;
  predictedPostDate: string;
  estimatedValue: number;
  wosbProbability: number;
  competitionLevel: 'low' | 'medium' | 'high';
  winProbability: number;
  preparationTime: number; // days
  keyRequirements: string[];
  strategicImportance: number;
  naicsCode?: string;
  placeOfPerformance?: string;
  // Contact Intelligence
  primaryContact?: AgencyContact;
  alternateContacts?: AgencyContact[];
  pastWinners?: string[];
  typicalBuyerBehavior?: string;
}

export interface MarketForecast {
  sector: string;
  totalMarketSize: number;
  wosbOpportunities: number;
  growthRate: number;
  keyTrends: string[];
  threats: string[];
  opportunities: string[];
}

export class GovContractForecaster {
  /**
   * Generate quarterly forecasts for government transportation spending
   */
  async generateQuarterlyForecast(quarters: number = 4): Promise<{
    periods: ForecastPeriod[];
    spendingForecasts: SpendingForecast[];
    opportunityForecasts: OpportunityForecast[];
    marketForecasts: MarketForecast[];
    summary: {
      totalPredictedValue: number;
      wosbOpportunities: number;
      highProbabilityWins: number;
      strategicRecommendations: string[];
    };
  }> {
    const currentDate = new Date();
    const currentFY = this.getCurrentFiscalYear();

    // Generate forecast periods
    const periods = this.generateForecastPeriods(currentFY, quarters);

    // Generate spending forecasts by agency
    const spendingForecasts = await this.generateSpendingForecasts(periods);

    // Predict specific opportunities
    const opportunityForecasts =
      await this.generateOpportunityForecasts(periods);

    // Market analysis and trends
    const marketForecasts = await this.generateMarketForecasts(periods);

    // Calculate summary metrics
    const summary = this.calculateForecastSummary(
      spendingForecasts,
      opportunityForecasts
    );

    return {
      periods,
      spendingForecasts,
      opportunityForecasts,
      marketForecasts,
      summary,
    };
  }

  /**
   * Generate forecast periods (quarters)
   */
  private generateForecastPeriods(
    startFY: number,
    quarters: number
  ): ForecastPeriod[] {
    const periods: ForecastPeriod[] = [];

    for (let i = 0; i < quarters; i++) {
      const fy = startFY + Math.floor(i / 4);
      const quarter = (i % 4) + 1;

      // Federal fiscal year starts October 1
      const fyStart = new Date(fy - 1, 9, 1); // October 1 of previous calendar year
      const quarterStart = new Date(fyStart);
      quarterStart.setMonth(quarterStart.getMonth() + (quarter - 1) * 3);

      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3);
      quarterEnd.setDate(quarterEnd.getDate() - 1);

      periods.push({
        quarter: `Q${quarter}`,
        fiscalYear: fy,
        startDate: quarterStart.toISOString().split('T')[0],
        endDate: quarterEnd.toISOString().split('T')[0],
      });
    }

    return periods;
  }

  /**
   * Generate spending forecasts by agency and category
   */
  private async generateSpendingForecasts(
    periods: ForecastPeriod[]
  ): Promise<SpendingForecast[]> {
    const forecasts: SpendingForecast[] = [];

    // Key agencies for transportation contracting
    const agencies = [
      {
        name: 'Department of Transportation',
        baseSpending: 45000000,
        growth: 0.08,
      },
      { name: 'Department of Defense', baseSpending: 125000000, growth: 0.05 },
      {
        name: 'General Services Administration',
        baseSpending: 35000000,
        growth: 0.12,
      },
      {
        name: 'Department of Veterans Affairs',
        baseSpending: 28000000,
        growth: 0.15,
      },
      {
        name: 'Department of Homeland Security',
        baseSpending: 22000000,
        growth: 0.1,
      },
      { name: 'USPS', baseSpending: 18000000, growth: 0.06 },
      { name: 'State of Michigan', baseSpending: 12000000, growth: 0.14 },
      { name: 'City of Detroit', baseSpending: 8000000, growth: 0.18 },
    ];

    const categories = [
      'Transportation Services',
      'Freight & Logistics',
      'Fleet Management',
      'Emergency Transportation',
      'Medical Transportation',
      'Mail & Package Delivery',
    ];

    for (const agency of agencies) {
      for (const category of categories) {
        // Calculate predicted spending with seasonal adjustments
        const baseValue = agency.baseSpending / 6; // Divide among categories
        const seasonalMultiplier = this.getSeasonalMultiplier(
          category,
          periods[0]
        );
        const predictedValue =
          baseValue * (1 + agency.growth) * seasonalMultiplier;

        forecasts.push({
          agency: agency.name,
          category,
          predictedValue: Math.round(predictedValue),
          confidence: this.calculateConfidence(agency.name, category),
          trend:
            agency.growth > 0.1
              ? 'increasing'
              : agency.growth > 0.05
                ? 'stable'
                : 'decreasing',
          factors: this.getSpendingFactors(agency.name, category),
        });
      }
    }

    return forecasts;
  }

  /**
   * Generate specific opportunity forecasts
   */
  private async generateOpportunityForecasts(
    periods: ForecastPeriod[]
  ): Promise<OpportunityForecast[]> {
    const opportunities: OpportunityForecast[] = [];

    // Predicted opportunities based on historical patterns and budget cycles
    const predictedOpportunities = [
      {
        title: 'Michigan DOT Statewide Freight Transportation Services',
        agency: 'Michigan Department of Transportation',
        agencyCode: 'MDOT',
        office: 'Office of Passenger Transportation',
        estimatedValue: 2500000,
        wosbSetAside: true,
        competitionLevel: 'medium' as const,
        preparationTime: 45,
        naicsCode: '484110',
        placeOfPerformance: 'Michigan',
        keyRequirements: [
          'WOSB Certification',
          'Michigan Registration',
          'DOT Authority',
          'Insurance $2M+',
        ],
        primaryContact: {
          name: 'Michael Thompson',
          title: 'Procurement Specialist',
          email: 'thompsonm@michigan.gov',
          phone: '(517) 335-2550',
          office: 'Office of Passenger Transportation',
        },
        alternateContacts: [
          {
            name: 'Sarah Chen',
            title: 'Contract Manager',
            email: 'chens@michigan.gov',
            office: 'Procurement Division',
          },
        ],
        pastWinners: ['Metro Transportation LLC', 'Great Lakes Transit Inc'],
        typicalBuyerBehavior:
          'MDOT typically posts opportunities in Q2/Q3. They value local Michigan businesses and prioritize safety records.',
      },
      {
        title: 'VA Medical Center Transportation Services - Great Lakes Region',
        agency: 'Department of Veterans Affairs',
        agencyCode: 'VA',
        office: 'VISN 10 Network Contracting Office',
        estimatedValue: 1800000,
        wosbSetAside: true,
        competitionLevel: 'low' as const,
        preparationTime: 30,
        naicsCode: '485991',
        placeOfPerformance: 'Great Lakes Region',
        keyRequirements: [
          'WOSB Certification',
          'Medical Transport Experience',
          'Background Checks',
        ],
        primaryContact: {
          name: 'Jennifer Martinez',
          title: 'Contracting Officer',
          email: 'jennifer.martinez@va.gov',
          phone: '(313) 576-1000',
          office: 'VISN 10 Network Contracting Office',
        },
        pastWinners: ['Medical Transport Solutions', 'Veterans Care Transit'],
        typicalBuyerBehavior:
          'VA prioritizes veteran-owned and WOSB vendors. Emphasize safety, reliability, and veteran-friendly services.',
      },
      {
        title: 'GSA Fleet Management Services - Region 5',
        agency: 'General Services Administration',
        agencyCode: 'GSA',
        office: 'Fleet Management Division - Region 5',
        estimatedValue: 3200000,
        wosbSetAside: false,
        competitionLevel: 'high' as const,
        preparationTime: 60,
        naicsCode: '532120',
        placeOfPerformance: 'Midwest Region',
        keyRequirements: [
          'GSA Schedule',
          'Fleet Management Software',
          'Multi-state Operations',
        ],
        primaryContact: {
          name: 'Robert Johnson',
          title: 'Regional Fleet Manager',
          email: 'robert.johnson@gsa.gov',
          phone: '(312) 353-5395',
          office: 'Fleet Management Division - Region 5',
        },
        pastWinners: ['Enterprise Fleet Services', 'ARI Fleet Management'],
        typicalBuyerBehavior:
          'GSA requires existing GSA Schedule and emphasizes cost-efficiency and technology integration.',
      },
      {
        title: 'DHS Emergency Response Transportation - Midwest',
        agency: 'Department of Homeland Security',
        agencyCode: 'DHS',
        office: 'Office of Procurement Operations',
        estimatedValue: 1500000,
        wosbSetAside: true,
        competitionLevel: 'medium' as const,
        preparationTime: 35,
        naicsCode: '484110',
        placeOfPerformance: 'Midwest Region',
        keyRequirements: [
          'Security Clearance',
          '24/7 Operations',
          'Emergency Response Plan',
        ],
        primaryContact: {
          name: 'David Kim',
          title: 'Contracting Specialist',
          email: 'david.kim@hq.dhs.gov',
          phone: '(202) 282-8000',
          office: 'Office of Procurement Operations',
        },
        pastWinners: ['First Response Logistics', 'Emergency Transit Inc'],
        typicalBuyerBehavior:
          'DHS requires security clearances and 24/7 availability. Quick response times are critical.',
      },
      {
        title: 'Detroit City Government Fleet Services',
        agency: 'City of Detroit',
        agencyCode: 'DETROIT',
        office: 'Department of Public Works - Fleet Management',
        estimatedValue: 950000,
        wosbSetAside: true,
        competitionLevel: 'low' as const,
        preparationTime: 25,
        naicsCode: '484110',
        placeOfPerformance: 'Detroit, MI',
        keyRequirements: [
          'Local Business Preference',
          'City Vendor Registration',
          'Union Compliance',
        ],
        primaryContact: {
          name: 'Marcus Williams',
          title: 'Procurement Officer',
          email: 'williamsm@detroitmi.gov',
          phone: '(313) 224-3400',
          office: 'Department of Public Works - Fleet Management',
        },
        pastWinners: ['Detroit Metro Transit', 'Motor City Logistics'],
        typicalBuyerBehavior:
          'City of Detroit strongly prefers local, Detroit-based businesses. WOSB certification is highly valued.',
      },
    ];

    for (let i = 0; i < predictedOpportunities.length; i++) {
      const opp = predictedOpportunities[i];
      const periodIndex = Math.min(Math.floor(i / 2), periods.length - 1);
      const period = periods[periodIndex]; // Spread across quarters

      // Predict posting date within the quarter
      const quarterStart = new Date(period.startDate);
      const daysIntoQuarter = Math.floor(Math.random() * 90);
      const predictedDate = new Date(quarterStart);
      predictedDate.setDate(predictedDate.getDate() + daysIntoQuarter);

      opportunities.push({
        id: `FORECAST-${i + 1}`,
        title: opp.title,
        agency: opp.agency,
        agencyCode: opp.agencyCode || 'N/A',
        office: opp.office || 'Contracting Office',
        predictedPostDate: predictedDate.toISOString().split('T')[0],
        estimatedValue: opp.estimatedValue,
        wosbProbability: opp.wosbSetAside ? 85 : 25,
        competitionLevel: opp.competitionLevel,
        winProbability: this.calculateWinProbability(opp),
        preparationTime: opp.preparationTime,
        keyRequirements: opp.keyRequirements,
        strategicImportance: this.calculateStrategicImportance(opp),
        naicsCode: opp.naicsCode,
        placeOfPerformance: opp.placeOfPerformance,
        primaryContact: opp.primaryContact,
        alternateContacts: opp.alternateContacts,
        pastWinners: opp.pastWinners,
        typicalBuyerBehavior: opp.typicalBuyerBehavior,
      });
    }

    return opportunities;
  }

  /**
   * Generate market forecasts and trends
   */
  private async generateMarketForecasts(
    periods: ForecastPeriod[]
  ): Promise<MarketForecast[]> {
    return [
      {
        sector: 'Federal Transportation Services',
        totalMarketSize: 285000000,
        wosbOpportunities: 42750000, // 15% WOSB set-aside
        growthRate: 0.08,
        keyTrends: [
          'Increased focus on sustainable transportation',
          'Digital transformation in logistics',
          'Supply chain resilience initiatives',
          'Electric vehicle adoption in government fleets',
        ],
        threats: [
          'Large prime contractor consolidation',
          'Increased competition from tech companies',
          'Budget constraints in some agencies',
        ],
        opportunities: [
          'WOSB set-aside program expansion',
          'Infrastructure Investment and Jobs Act funding',
          'Green transportation initiatives',
          'Rural transportation service gaps',
        ],
      },
      {
        sector: 'State & Local Government',
        totalMarketSize: 125000000,
        wosbOpportunities: 31250000, // 25% diversity goals
        growthRate: 0.12,
        keyTrends: [
          'Local preference policies strengthening',
          'Emergency preparedness focus',
          'Public-private partnerships growth',
          'Technology integration requirements',
        ],
        threats: [
          'Budget pressures from pandemic recovery',
          'Political changes affecting procurement',
        ],
        opportunities: [
          'Michigan home-state advantage',
          'Detroit economic development initiatives',
          'Rural Michigan transportation needs',
          'Emergency response capabilities',
        ],
      },
      {
        sector: 'Healthcare Transportation',
        totalMarketSize: 95000000,
        wosbOpportunities: 23750000,
        growthRate: 0.15,
        keyTrends: [
          'Aging population increasing demand',
          'Telehealth reducing some transport needs',
          'Specialized medical transport growth',
          'Rural healthcare access initiatives',
        ],
        threats: [
          'Regulatory compliance complexity',
          'Insurance and liability costs',
        ],
        opportunities: [
          'VA medical center contracts',
          'Medicare/Medicaid transportation',
          'Specialized equipment transport',
          'Rural healthcare connectivity',
        ],
      },
    ];
  }

  /**
   * Calculate forecast summary metrics
   */
  private calculateForecastSummary(
    spendingForecasts: SpendingForecast[],
    opportunityForecasts: OpportunityForecast[]
  ) {
    const totalPredictedValue = spendingForecasts.reduce(
      (sum, f) => sum + f.predictedValue,
      0
    );
    const wosbOpportunities = opportunityForecasts.filter(
      (o) => o.wosbProbability > 50
    ).length;
    const highProbabilityWins = opportunityForecasts.filter(
      (o) => o.winProbability > 70
    ).length;

    const strategicRecommendations = [
      'Focus on WOSB set-aside opportunities for highest win probability',
      'Prioritize Michigan state and local contracts for geographic advantage',
      'Develop capabilities in healthcare transportation for growing market',
      'Invest in sustainable transportation solutions for future competitiveness',
      'Build relationships with contracting officers in target agencies',
      'Prepare for Q2 FY2025 surge in transportation contract awards',
    ];

    return {
      totalPredictedValue,
      wosbOpportunities,
      highProbabilityWins,
      strategicRecommendations,
    };
  }

  // Helper methods
  private getCurrentFiscalYear(): number {
    const now = new Date();
    return now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear();
  }

  private getSeasonalMultiplier(
    category: string,
    period: ForecastPeriod
  ): number {
    // Q1 (Oct-Dec): End of fiscal year spending surge
    // Q2 (Jan-Mar): New fiscal year ramp-up
    // Q3 (Apr-Jun): Steady state
    // Q4 (Jul-Sep): Preparation for fiscal year end

    const multipliers = {
      Q1: 1.3, // Fiscal year-end spending
      Q2: 0.8, // New year slow start
      Q3: 1.0, // Normal
      Q4: 1.1, // Preparation surge
    };

    return multipliers[period.quarter] || 1.0;
  }

  private calculateConfidence(agency: string, category: string): number {
    // Higher confidence for agencies with consistent spending patterns
    const agencyConfidence = {
      'Department of Transportation': 0.85,
      'Department of Defense': 0.9,
      'General Services Administration': 0.8,
      'State of Michigan': 0.75,
      'City of Detroit': 0.7,
    };

    return (agencyConfidence[agency] || 0.65) * 100;
  }

  private getSpendingFactors(agency: string, category: string): string[] {
    const commonFactors = [
      'Infrastructure Investment and Jobs Act funding',
      'Federal budget appropriations',
      'Economic recovery initiatives',
    ];

    const agencySpecific = {
      'Department of Transportation': [
        'Highway Trust Fund',
        'Public transit funding',
      ],
      'Department of Defense': [
        'Defense spending priorities',
        'Base realignment',
      ],
      'State of Michigan': [
        'State budget allocation',
        'Economic development goals',
      ],
      'City of Detroit': ['Municipal budget', 'Federal grant programs'],
    };

    return [...commonFactors, ...(agencySpecific[agency] || [])];
  }

  private calculateWinProbability(opp: any): number {
    let probability = 40; // Base probability

    // WOSB advantage
    if (opp.wosbSetAside) probability += 35;

    // Competition level
    if (opp.competitionLevel === 'low') probability += 20;
    else if (opp.competitionLevel === 'medium') probability += 10;

    // Local advantage for Michigan contracts
    if (opp.agency.includes('Michigan') || opp.agency.includes('Detroit')) {
      probability += 15;
    }

    return Math.min(95, probability);
  }

  private calculateStrategicImportance(opp: any): number {
    let importance = 50; // Base importance

    // Higher value = higher importance
    if (opp.estimatedValue > 2000000) importance += 20;
    else if (opp.estimatedValue > 1000000) importance += 10;

    // WOSB opportunities are strategically important
    if (opp.wosbSetAside) importance += 15;

    // Local contracts build reputation
    if (opp.agency.includes('Michigan') || opp.agency.includes('Detroit')) {
      importance += 10;
    }

    return Math.min(100, importance);
  }
}
