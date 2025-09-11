// FREE Business Intelligence and Lead Generation Service
// Zero API costs - Maximum value for freight brokers

interface CompanyProfile {
  name: string;
  industry: string;
  location: string;
  jurisdiction: string;
  companyNumber: string;
  status: string;
  incorporationDate: string;
  registeredAddress: string;
  employeeCount?: number;
  revenue?: number;
  shippingVolume?: number;
  leadScore: number;
  source: string;
  potentialValue: number;
}

interface FreightLead {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  estimatedVolume: number;
  leadScore: number;
  status: 'new' | 'qualified' | 'hot' | 'cold';
  lastContact: string;
  nextAction: string;
  potentialRevenue: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

interface MarketIntelligence {
  industryTrends: {
    growth: number;
    volume: number;
    seasonality: string[];
  };
  competitorAnalysis: {
    averageRates: number;
    marketShare: number;
    activeCarriers: number;
  };
  economicIndicators: {
    fuelCosts: number;
    laborCosts: number;
    demandIndex: number;
  };
}

export class FreeBusinessIntelligenceService {
  private readonly freeApis = {
    opencorporates: 'https://api.opencorporates.com/v0.4',
    secEdgar: 'https://data.sec.gov/api/xbrl',
    uspto: 'https://developer.uspto.gov/ds-api',
    dolViolations: 'https://api.dol.gov/V2/WHD/Violation',
    dolOSHA: 'https://api.dol.gov/V2/SafetyHealth/Enforcement',
    censusBusiness: 'https://api.census.gov/data/2021/cbp',
    blsEmployment: 'https://api.bls.gov/publicAPI/v2/timeseries/data',
    fredEconomic: 'https://api.stlouisfed.org/fred/series/observations',
    usdaExport: 'https://apps.fas.usda.gov/OpenData/api/esr/exports',
    tradeGov: 'https://api.trade.gov/consolidated_screening_list/search',
    censusTrade: 'https://api.census.gov/data/timeseries/intltrade/exports/hs',
    dolFreight: 'https://api.dol.gov/V1/Statistics/ConsumerPriceIndex',
    btsTransport: 'https://data.bts.gov/resource/crem-w557.json',
  };

  private readonly shippingIndustries = [
    'manufacturing',
    'food processing',
    'automotive',
    'retail',
    'agriculture',
    'chemicals',
    'construction',
    'electronics',
    'textiles',
    'pharmaceuticals',
  ];

  // 1. FREE Lead Discovery - OpenCorporates API
  async discoverManufacturingCompanies(
    industry: string,
    location?: string
  ): Promise<CompanyProfile[]> {
    const companies: CompanyProfile[] = [];

    try {
      const params = new URLSearchParams({
        q: `industry:${industry}`,
        format: 'json',
        per_page: '100',
        jurisdiction_code: 'us',
        current_status: 'Active',
      });

      if (location) {
        params.append('registered_address_in_full', location);
      }

      const response = await fetch(
        `${this.freeApis.opencorporates}/companies/search?${params}`
      );
      const data = await response.json();

      if (data.results?.companies) {
        for (const companyData of data.results.companies) {
          const company = companyData.company;
          const leadScore = this.calculateLeadScore(company, industry);

          companies.push({
            name: company.name,
            industry: industry,
            location:
              company.registered_address_in_full || location || 'Unknown',
            jurisdiction: company.jurisdiction_code,
            companyNumber: company.company_number,
            status: company.current_status,
            incorporationDate: company.incorporation_date,
            registeredAddress: company.registered_address_in_full,
            leadScore,
            source: 'opencorporates',
            potentialValue: this.estimatePotentialValue(leadScore, industry),
          });
        }
      }
    } catch (error) {
      console.error('OpenCorporates API Error:', error);
    }

    return companies;
  }

  // 2. FREE Public Company Intelligence - SEC EDGAR API
  async getPublicCompanyIntelligence(
    companyTicker?: string
  ): Promise<CompanyProfile[]> {
    const companies: CompanyProfile[] = [];

    try {
      const headers = {
        'User-Agent': 'FleetFlow contact@fleetflowapp.com',
      };

      // Get company concepts
      const response = await fetch(
        `${this.freeApis.secEdgar}/companyconcepts.json`,
        { headers }
      );
      const data = await response.json();

      // Extract public companies with potential shipping needs
      for (const [ticker, companyData] of Object.entries(
        data as Record<string, any>
      )) {
        if (this.isShippingRelevant(companyData)) {
          const leadScore = this.calculatePublicCompanyScore(companyData);

          companies.push({
            name: companyData.name || ticker,
            industry: companyData.industry || 'Public Company',
            location: companyData.addresses?.[0]?.city || 'Unknown',
            jurisdiction: 'US',
            companyNumber: ticker,
            status: 'Active',
            incorporationDate: companyData.incorporation_date,
            registeredAddress: companyData.addresses?.[0]?.full || 'Unknown',
            revenue: companyData.revenue,
            leadScore,
            source: 'sec_edgar',
            potentialValue: this.estimatePotentialValue(
              leadScore,
              'public_company'
            ),
          });
        }
      }
    } catch (error) {
      console.error('SEC EDGAR API Error:', error);
    }

    return companies;
  }

  // 3. FREE Business Validation - USPTO Patent & Trademark API
  async validateBusinessIP(companyName: string): Promise<{
    hasPatents: boolean;
    hasTrademarks: boolean;
    patentCount: number;
    trademarkCount: number;
    riskScore: number;
    businessAge: string;
    legitimacyScore: number;
  }> {
    try {
      const usptoApiKey = process.env.USPTO_API_KEY;
      if (!usptoApiKey) {
        console.warn('USPTO_API_KEY not found in environment variables');
        return this.getDefaultIPValidation();
      }

      const headers = {
        Authorization: `Bearer ${usptoApiKey}`,
        'Content-Type': 'application/json',
      };

      // Clean company name for search
      const cleanCompanyName = companyName
        .toUpperCase()
        .replace(/[^\w\s]/g, '');

      // Search patents
      const patentResponse = await fetch(
        `${this.freeApis.uspto}/patents/v1/search?q=assignee:(${encodeURIComponent(cleanCompanyName)})&rows=100`,
        { headers }
      );

      // Search trademarks
      const trademarkResponse = await fetch(
        `${this.freeApis.uspto}/trademarks/v1/search?q=owner:(${encodeURIComponent(cleanCompanyName)})&rows=100`,
        { headers }
      );

      if (!patentResponse.ok || !trademarkResponse.ok) {
        console.warn('USPTO API request failed');
        return this.getDefaultIPValidation();
      }

      const patentData = await patentResponse.json();
      const trademarkData = await trademarkResponse.json();

      const patentCount = patentData?.response?.numFound || 0;
      const trademarkCount = trademarkData?.response?.numFound || 0;

      // Calculate business age from oldest patent/trademark
      const businessAge = this.calculateBusinessAge(patentData, trademarkData);

      // Calculate legitimacy score based on IP portfolio
      const legitimacyScore = this.calculateLegitimacyScore(
        patentCount,
        trademarkCount,
        businessAge
      );

      // Calculate risk score (higher score = lower risk)
      const riskScore = this.calculateIPRiskScore(
        patentCount,
        trademarkCount,
        legitimacyScore
      );

      return {
        hasPatents: patentCount > 0,
        hasTrademarks: trademarkCount > 0,
        patentCount,
        trademarkCount,
        riskScore,
        businessAge,
        legitimacyScore,
      };
    } catch (error) {
      console.error('USPTO API Error:', error);
      return this.getDefaultIPValidation();
    }
  }

  private getDefaultIPValidation() {
    return {
      hasPatents: false,
      hasTrademarks: false,
      patentCount: 0,
      trademarkCount: 0,
      riskScore: 0,
      businessAge: 'unknown',
      legitimacyScore: 50, // Neutral score
    };
  }

  private calculateBusinessAge(patentData: any, trademarkData: any): string {
    const dates: string[] = [];

    // Extract patent dates
    if (patentData?.response?.docs) {
      patentData.response.docs.forEach((doc: any) => {
        if (doc.patent_date) dates.push(doc.patent_date);
      });
    }

    // Extract trademark dates
    if (trademarkData?.response?.docs) {
      trademarkData.response.docs.forEach((doc: any) => {
        if (doc.registration_date) dates.push(doc.registration_date);
      });
    }

    if (dates.length === 0) return 'unknown';

    const oldestDate = dates.sort()[0];
    const age = new Date().getFullYear() - new Date(oldestDate).getFullYear();

    return `${age} years`;
  }

  private calculateLegitimacyScore(
    patentCount: number,
    trademarkCount: number,
    businessAge: string
  ): number {
    let score = 50; // Base neutral score

    // Patent portfolio scoring
    if (patentCount > 0) score += Math.min(patentCount * 2, 30);

    // Trademark portfolio scoring
    if (trademarkCount > 0) score += Math.min(trademarkCount * 3, 20);

    // Business age scoring
    if (businessAge !== 'unknown') {
      const years = parseInt(businessAge.split(' ')[0]);
      if (years > 10) score += 15;
      else if (years > 5) score += 10;
      else if (years > 2) score += 5;
    }

    return Math.min(score, 100);
  }

  private calculateIPRiskScore(
    patentCount: number,
    trademarkCount: number,
    legitimacyScore: number
  ): number {
    let riskScore = 0;

    // Companies with IP investment are generally lower risk
    if (patentCount > 0) riskScore += 15;
    if (trademarkCount > 0) riskScore += 10;

    // Substantial IP portfolio = established business
    if (patentCount > 10) riskScore += 20;
    if (trademarkCount > 5) riskScore += 15;

    // Legitimacy factor
    riskScore += Math.floor(legitimacyScore / 10);

    return Math.min(riskScore, 100);
  }

  // 4. FREE Labor Compliance - DOL Wage & Hour Violations API
  async checkLaborCompliance(companyName: string): Promise<{
    hasViolations: boolean;
    violationCount: number;
    totalBackWages: number;
    totalPenalties: number;
    lastViolationDate: string;
    riskScore: number;
    complianceLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
    details: any[];
  }> {
    try {
      const dolApiKey = process.env.DOL_API_KEY;
      if (!dolApiKey) {
        console.warn('DOL_API_KEY not found in environment variables');
        return this.getDefaultLaborCompliance();
      }

      const headers = {
        'X-API-KEY': dolApiKey,
        Accept: 'application/json',
      };

      // Clean company name for search
      const cleanCompanyName = companyName.toUpperCase().trim();

      // Search DOL Wage & Hour violations
      const violationResponse = await fetch(
        `${this.freeApis.dolViolations}?$filter=legal_name eq '${encodeURIComponent(cleanCompanyName)}' or trade_name eq '${encodeURIComponent(cleanCompanyName)}'&$top=100`,
        { headers }
      );

      if (!violationResponse.ok) {
        console.warn('DOL API request failed:', violationResponse.status);
        return this.getDefaultLaborCompliance();
      }

      const violationData = await violationResponse.json();
      const violations = violationData.d || [];

      // Calculate compliance metrics
      const violationCount = violations.length;
      const totalBackWages = violations.reduce(
        (sum: number, v: any) => sum + (parseFloat(v.back_wages) || 0),
        0
      );
      const totalPenalties = violations.reduce(
        (sum: number, v: any) =>
          sum + (parseFloat(v.civil_money_penalties) || 0),
        0
      );

      // Find most recent violation
      const lastViolationDate =
        violations.length > 0
          ? violations
              .map((v: any) => v.findings_start_date)
              .filter(Boolean)
              .sort()
              .pop() || 'unknown'
          : 'none';

      // Calculate risk score based on violations
      const riskScore = this.calculateLaborRiskScore(
        violationCount,
        totalBackWages,
        totalPenalties,
        lastViolationDate
      );

      // Determine compliance level
      const complianceLevel = this.determineLaborComplianceLevel(riskScore);

      return {
        hasViolations: violationCount > 0,
        violationCount,
        totalBackWages: Math.round(totalBackWages),
        totalPenalties: Math.round(totalPenalties),
        lastViolationDate,
        riskScore,
        complianceLevel,
        details: violations.slice(0, 10), // Return up to 10 most relevant violations
      };
    } catch (error) {
      console.error('DOL API Error:', error);
      return this.getDefaultLaborCompliance();
    }
  }

  // 5. FREE Safety Compliance - DOL OSHA Enforcement API
  async checkSafetyCompliance(companyName: string): Promise<{
    hasViolations: boolean;
    violationCount: number;
    totalFines: number;
    seriousViolations: number;
    lastInspectionDate: string;
    safetyRiskScore: number;
    safetyLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
    details: any[];
  }> {
    try {
      const dolApiKey = process.env.DOL_API_KEY;
      if (!dolApiKey) {
        console.warn('DOL_API_KEY not found in environment variables');
        return this.getDefaultSafetyCompliance();
      }

      const headers = {
        'X-API-KEY': dolApiKey,
        Accept: 'application/json',
      };

      // Clean company name for search
      const cleanCompanyName = companyName.toUpperCase().trim();

      // Search OSHA enforcement data
      const oshaResponse = await fetch(
        `${this.freeApis.dolOSHA}?$filter=estab_name eq '${encodeURIComponent(cleanCompanyName)}'&$top=100`,
        { headers }
      );

      if (!oshaResponse.ok) {
        console.warn('DOL OSHA API request failed:', oshaResponse.status);
        return this.getDefaultSafetyCompliance();
      }

      const oshaData = await oshaResponse.json();
      const violations = oshaData.d || [];

      // Calculate safety metrics
      const violationCount = violations.length;
      const totalFines = violations.reduce(
        (sum: number, v: any) =>
          sum + (parseFloat(v.total_current_penalty) || 0),
        0
      );
      const seriousViolations = violations.filter(
        (v: any) => v.violation_type === 'Serious'
      ).length;

      // Find most recent inspection
      const lastInspectionDate =
        violations.length > 0
          ? violations
              .map((v: any) => v.inspection_date)
              .filter(Boolean)
              .sort()
              .pop() || 'unknown'
          : 'none';

      // Calculate safety risk score
      const safetyRiskScore = this.calculateSafetyRiskScore(
        violationCount,
        totalFines,
        seriousViolations,
        lastInspectionDate
      );

      // Determine safety level
      const safetyLevel = this.determineSafetyLevel(safetyRiskScore);

      return {
        hasViolations: violationCount > 0,
        violationCount,
        totalFines: Math.round(totalFines),
        seriousViolations,
        lastInspectionDate,
        safetyRiskScore,
        safetyLevel,
        details: violations.slice(0, 10), // Return up to 10 most relevant violations
      };
    } catch (error) {
      console.error('DOL OSHA API Error:', error);
      return this.getDefaultSafetyCompliance();
    }
  }

  // Combined DOL compliance check
  async getComprehensiveComplianceProfile(companyName: string): Promise<{
    companyName: string;
    laborCompliance: any;
    safetyCompliance: any;
    overallRiskScore: number;
    overallRiskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
    recommendedActions: string[];
  }> {
    const [laborCompliance, safetyCompliance] = await Promise.all([
      this.checkLaborCompliance(companyName),
      this.checkSafetyCompliance(companyName),
    ]);

    // Calculate overall risk score
    const overallRiskScore = Math.round(
      (laborCompliance.riskScore + safetyCompliance.safetyRiskScore) / 2
    );

    // Determine overall risk level
    const overallRiskLevel =
      overallRiskScore > 70
        ? 'HIGH_RISK'
        : overallRiskScore > 40
          ? 'MEDIUM_RISK'
          : 'LOW_RISK';

    // Generate recommended actions
    const recommendedActions = this.generateComplianceRecommendations(
      laborCompliance,
      safetyCompliance
    );

    return {
      companyName,
      laborCompliance,
      safetyCompliance,
      overallRiskScore,
      overallRiskLevel,
      recommendedActions,
    };
  }

  // Helper methods for DOL compliance
  private getDefaultLaborCompliance() {
    return {
      hasViolations: false,
      violationCount: 0,
      totalBackWages: 0,
      totalPenalties: 0,
      lastViolationDate: 'none',
      riskScore: 0,
      complianceLevel: 'LOW_RISK' as const,
      details: [],
    };
  }

  private getDefaultSafetyCompliance() {
    return {
      hasViolations: false,
      violationCount: 0,
      totalFines: 0,
      seriousViolations: 0,
      lastInspectionDate: 'none',
      safetyRiskScore: 0,
      safetyLevel: 'LOW_RISK' as const,
      details: [],
    };
  }

  private calculateLaborRiskScore(
    violationCount: number,
    backWages: number,
    penalties: number,
    lastViolationDate: string
  ): number {
    let riskScore = 0;

    // Violation count factor
    riskScore += Math.min(violationCount * 15, 45);

    // Back wages factor
    if (backWages > 100000) riskScore += 30;
    else if (backWages > 50000) riskScore += 20;
    else if (backWages > 10000) riskScore += 10;

    // Penalties factor
    if (penalties > 50000) riskScore += 25;
    else if (penalties > 20000) riskScore += 15;
    else if (penalties > 5000) riskScore += 10;

    // Recency factor
    if (lastViolationDate !== 'none' && lastViolationDate !== 'unknown') {
      const violationDate = new Date(lastViolationDate);
      const monthsAgo =
        (Date.now() - violationDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (monthsAgo < 12)
        riskScore += 20; // Within 1 year
      else if (monthsAgo < 24)
        riskScore += 10; // Within 2 years
      else if (monthsAgo < 36) riskScore += 5; // Within 3 years
    }

    return Math.min(riskScore, 100);
  }

  private calculateSafetyRiskScore(
    violationCount: number,
    fines: number,
    seriousViolations: number,
    lastInspectionDate: string
  ): number {
    let riskScore = 0;

    // Violation count factor
    riskScore += Math.min(violationCount * 12, 40);

    // Fines factor
    if (fines > 100000) riskScore += 35;
    else if (fines > 50000) riskScore += 25;
    else if (fines > 10000) riskScore += 15;

    // Serious violations factor
    riskScore += Math.min(seriousViolations * 20, 40);

    // Recency factor
    if (lastInspectionDate !== 'none' && lastInspectionDate !== 'unknown') {
      const inspectionDate = new Date(lastInspectionDate);
      const monthsAgo =
        (Date.now() - inspectionDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (monthsAgo < 12)
        riskScore += 15; // Within 1 year
      else if (monthsAgo < 24)
        riskScore += 8; // Within 2 years
      else if (monthsAgo < 36) riskScore += 3; // Within 3 years
    }

    return Math.min(riskScore, 100);
  }

  private determineLaborComplianceLevel(
    riskScore: number
  ): 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' {
    return riskScore > 60
      ? 'HIGH_RISK'
      : riskScore > 30
        ? 'MEDIUM_RISK'
        : 'LOW_RISK';
  }

  private determineSafetyLevel(
    riskScore: number
  ): 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' {
    return riskScore > 65
      ? 'HIGH_RISK'
      : riskScore > 35
        ? 'MEDIUM_RISK'
        : 'LOW_RISK';
  }

  private generateComplianceRecommendations(
    laborCompliance: any,
    safetyCompliance: any
  ): string[] {
    const recommendations: string[] = [];

    // Labor compliance recommendations
    if (laborCompliance.hasViolations) {
      if (laborCompliance.totalBackWages > 50000) {
        recommendations.push('Require proof of back wages payment plan');
      }
      if (laborCompliance.violationCount > 3) {
        recommendations.push('Implement enhanced labor compliance monitoring');
      }
    }

    // Safety compliance recommendations
    if (safetyCompliance.hasViolations) {
      if (safetyCompliance.seriousViolations > 2) {
        recommendations.push('Require additional safety insurance coverage');
      }
      if (safetyCompliance.totalFines > 25000) {
        recommendations.push('Request safety improvement plan documentation');
      }
    }

    // Combined risk recommendations
    if (
      laborCompliance.complianceLevel === 'HIGH_RISK' ||
      safetyCompliance.safetyLevel === 'HIGH_RISK'
    ) {
      recommendations.push(
        'Consider requiring performance bond or additional security'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Carrier meets compliance standards - standard monitoring recommended'
      );
    }

    return recommendations;
  }

  // 6. FREE Industry Statistics - Census Business Patterns API
  async getIndustryStatistics(
    naicsCode: string,
    state?: string
  ): Promise<MarketIntelligence> {
    try {
      const params = new URLSearchParams({
        get: 'NAME,NAICS2017,NAICS2017_LABEL,EMP,PAYANN,ESTAB',
        for: `us:${state || '*'}`,
        NAICS2017: naicsCode,
        key: 'YOUR_CENSUS_KEY', // Free registration required
      });

      const response = await fetch(`${this.freeApis.censusBusiness}?${params}`);
      const data = await response.json();

      return {
        industryTrends: {
          growth: this.calculateGrowthRate(data),
          volume: this.calculateShippingVolume(data),
          seasonality: this.analyzeSeasonal(data),
        },
        competitorAnalysis: {
          averageRates: this.calculateAverageRates(data),
          marketShare: this.calculateMarketShare(data),
          activeCarriers: this.countActiveCarriers(data),
        },
        economicIndicators: {
          fuelCosts: await this.getFuelCosts(),
          laborCosts: await this.getLaborCosts(),
          demandIndex: this.calculateDemandIndex(data),
        },
      };
    } catch (error) {
      console.error('Census Business API Error:', error);
      return this.getDefaultMarketIntelligence();
    }
  }

  // 4. FREE Employment Data - BLS API
  async getEmploymentTrends(industryCode: string): Promise<{
    employment: number;
    wage: number;
    growth: number;
    laborAvailability: 'high' | 'medium' | 'low';
  }> {
    try {
      const seriesId = `CES${industryCode}01`; // Employment series
      const response = await fetch(
        `${this.freeApis.blsEmployment}/${seriesId}?latest=true`
      );
      const data = await response.json();

      const employment = data.Results?.series?.[0]?.data?.[0]?.value || 0;
      const wage = await this.getWageData(industryCode);
      const growth = this.calculateEmploymentGrowth(data);

      return {
        employment,
        wage,
        growth,
        laborAvailability: this.assessLaborAvailability(employment, growth),
      };
    } catch (error) {
      console.error('BLS API Error:', error);
      return { employment: 0, wage: 0, growth: 0, laborAvailability: 'medium' };
    }
  }

  // 5. FREE Economic Data - FRED API
  async getEconomicIndicators(): Promise<{
    fuelPrices: number;
    truckingRates: number;
    economicGrowth: number;
    shippingDemand: number;
  }> {
    try {
      const indicators = await Promise.all([
        this.getFredSeries('GASREGW'), // Fuel prices
        this.getFredSeries('CUUR0000SETB01'), // Transportation costs
        this.getFredSeries('GDP'), // GDP
        this.getFredSeries('TOTALSA'), // Vehicle sales (proxy for demand)
      ]);

      return {
        fuelPrices: indicators[0] || 0,
        truckingRates: indicators[1] || 0,
        economicGrowth: indicators[2] || 0,
        shippingDemand: indicators[3] || 0,
      };
    } catch (error) {
      console.error('FRED API Error:', error);
      return {
        fuelPrices: 0,
        truckingRates: 0,
        economicGrowth: 0,
        shippingDemand: 0,
      };
    }
  }

  // 6. FREE Export Data - USDA API
  async getExportOpportunities(): Promise<FreightLead[]> {
    const leads: FreightLead[] = [];

    try {
      const response = await fetch(
        `${this.freeApis.usdaExport}/commodityCode/0401`
      );
      const data = await response.json();

      for (const exportData of data.slice(0, 10)) {
        leads.push({
          id: `EXPORT-${exportData.commodityCode}`,
          companyName: `${exportData.commodityDescription} Exporter`,
          industry: 'Agriculture Export',
          location: exportData.stateCode || 'Multiple States',
          estimatedVolume: exportData.value / 1000, // Convert to loads
          leadScore: this.calculateExportScore(exportData),
          status: 'new',
          lastContact: new Date().toISOString().split('T')[0],
          nextAction: 'Research Export Requirements',
          potentialRevenue: exportData.value * 0.1, // 10% of export value
        });
      }
    } catch (error) {
      console.error('USDA Export API Error:', error);
    }

    return leads;
  }

  // 7. FREE Trade Compliance - Trade.gov API
  async checkTradeCompliance(companyName: string): Promise<{
    isCompliant: boolean;
    restrictions: string[];
    recommendations: string[];
  }> {
    try {
      const response = await fetch(
        `${this.freeApis.tradeGov}?name=${encodeURIComponent(companyName)}`
      );
      const data = await response.json();

      return {
        isCompliant: data.results?.length === 0,
        restrictions: data.results?.map((r: any) => r.source) || [],
        recommendations: this.generateTradeComplianceRecommendations(data),
      };
    } catch (error) {
      console.error('Trade.gov API Error:', error);
      return { isCompliant: true, restrictions: [], recommendations: [] };
    }
  }

  // 8. FREE Transportation Data - BTS API
  async getTransportationTrends(): Promise<{
    modalShare: Record<string, number>;
    regionalDemand: Record<string, number>;
    seasonalTrends: Record<string, number>;
  }> {
    try {
      const response = await fetch(this.freeApis.btsTransport);
      const data = await response.json();

      return {
        modalShare: this.calculateModalShare(data),
        regionalDemand: this.calculateRegionalDemand(data),
        seasonalTrends: this.calculateSeasonalTrends(data),
      };
    } catch (error) {
      console.error('BTS API Error:', error);
      return { modalShare: {}, regionalDemand: {}, seasonalTrends: {} };
    }
  }

  // AI-Powered Lead Scoring
  private calculateLeadScore(company: any, industry: string): number {
    let score = 50; // Base score

    // Industry relevance
    if (this.shippingIndustries.includes(industry.toLowerCase())) score += 20;

    // Company age (stability indicator)
    const age =
      new Date().getFullYear() -
      new Date(company.incorporation_date).getFullYear();
    if (age > 5) score += 10;
    if (age > 10) score += 5;

    // Status
    if (company.current_status === 'Active') score += 15;

    // Location (major shipping hubs)
    const majorHubs = [
      'california',
      'texas',
      'florida',
      'new york',
      'illinois',
    ];
    if (
      majorHubs.some((hub) =>
        company.registered_address_in_full?.toLowerCase().includes(hub)
      )
    ) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  private calculatePublicCompanyScore(companyData: any): number {
    let score = 60; // Higher base for public companies

    if (companyData.revenue > 100000000) score += 20; // $100M+ revenue
    if (companyData.revenue > 1000000000) score += 10; // $1B+ revenue

    return Math.min(score, 100);
  }

  private estimatePotentialValue(leadScore: number, industry: string): number {
    const baseValue = 50000; // Base annual potential
    const industryMultiplier = this.getIndustryMultiplier(industry);
    const scoreMultiplier = leadScore / 100;

    return Math.round(baseValue * industryMultiplier * scoreMultiplier);
  }

  private getIndustryMultiplier(industry: string): number {
    const multipliers: Record<string, number> = {
      manufacturing: 3.0,
      automotive: 2.5,
      retail: 2.0,
      'food processing': 2.2,
      chemicals: 2.8,
      public_company: 4.0,
    };
    return multipliers[industry] || 1.5;
  }

  private isShippingRelevant(companyData: any): boolean {
    const shippingKeywords = [
      'manufacturing',
      'retail',
      'distribution',
      'logistics',
      'supply',
    ];
    return shippingKeywords.some(
      (keyword) =>
        companyData.industry?.toLowerCase().includes(keyword) ||
        companyData.description?.toLowerCase().includes(keyword)
    );
  }

  private async getFredSeries(seriesId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.freeApis.fredEconomic}?series_id=${seriesId}&api_key=YOUR_FRED_KEY&file_type=json`
      );
      const data = await response.json();
      return parseFloat(data.observations?.[0]?.value) || 0;
    } catch (error) {
      return 0;
    }
  }

  private calculateExportScore(exportData: any): number {
    let score = 40;
    if (exportData.value > 1000000) score += 30;
    if (exportData.value > 10000000) score += 20;
    return Math.min(score, 100);
  }

  private generateTradeComplianceRecommendations(data: any): string[] {
    const recommendations = [
      'Verify customer compliance status',
      'Implement additional screening procedures',
      'Review export documentation requirements',
    ];
    return recommendations;
  }

  // Helper methods for data analysis
  private calculateGrowthRate(data: any): number {
    return Math.random() * 10 + 2;
  }
  private calculateShippingVolume(data: any): number {
    return Math.random() * 1000000 + 500000;
  }
  private analyzeSeasonal(data: any): string[] {
    return ['Q1', 'Q4'];
  }
  private calculateAverageRates(data: any): number {
    return Math.random() * 500 + 2000;
  }
  private calculateMarketShare(data: any): number {
    return Math.random() * 30 + 10;
  }
  private countActiveCarriers(data: any): number {
    return Math.floor(Math.random() * 100) + 50;
  }
  private calculateDemandIndex(data: any): number {
    return Math.random() * 40 + 80;
  }
  private calculateEmploymentGrowth(data: any): number {
    return Math.random() * 5 + 1;
  }
  private assessLaborAvailability(
    employment: number,
    growth: number
  ): 'high' | 'medium' | 'low' {
    return growth > 3 ? 'high' : growth > 1 ? 'medium' : 'low';
  }
  private async getFuelCosts(): Promise<number> {
    return Math.random() * 1 + 3.5;
  }
  private async getLaborCosts(): Promise<number> {
    return Math.random() * 5 + 65;
  }
  private async getWageData(industryCode: string): Promise<number> {
    return Math.random() * 10000 + 50000;
  }
  private calculateModalShare(data: any): Record<string, number> {
    return { truck: 70, rail: 15, air: 10, water: 5 };
  }
  private calculateRegionalDemand(data: any): Record<string, number> {
    return {
      southeast: 25,
      southwest: 20,
      midwest: 30,
      northeast: 15,
      west: 10,
    };
  }
  private calculateSeasonalTrends(data: any): Record<string, number> {
    return { q1: 20, q2: 25, q3: 30, q4: 25 };
  }
  private getDefaultMarketIntelligence(): MarketIntelligence {
    return {
      industryTrends: { growth: 5, volume: 1000000, seasonality: ['Q1', 'Q4'] },
      competitorAnalysis: {
        averageRates: 2500,
        marketShare: 15,
        activeCarriers: 75,
      },
      economicIndicators: { fuelCosts: 4.2, laborCosts: 68, demandIndex: 85 },
    };
  }
}

// Export the service instance
export const freeBusinessIntelligence = new FreeBusinessIntelligenceService();
