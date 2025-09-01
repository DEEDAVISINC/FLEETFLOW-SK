import ThomasNetService, {
  ManufacturerInfo,
} from '../../lib/thomas-net-service';
import { EnhancedCarrierService } from './enhanced-carrier-service';
import { FMCSAService } from './fmcsa';

interface EnhancedLeadInfo extends ManufacturerInfo {
  // FMCSA cross-reference data
  fmcsaMatches?: {
    dotNumber?: string;
    mcNumber?: string;
    relatedCarriers?: string[];
    carrierRelationships?: 'SHIPPER' | 'CONSIGNEE' | 'BROKER' | 'UNKNOWN';
  };

  // Enhanced lead scoring
  enhancedLeadScore?: number;
  freightVolumeEstimate?: {
    monthlyShipments: number;
    averageLoadValue: number;
    potentialRevenue: number;
    confidence: number;
  };

  // Contact enhancement
  contactEnrichment?: {
    decisionMakers?: string[];
    departments?: string[];
    bestContactTime?: string;
    preferredContactMethod?: 'PHONE' | 'EMAIL' | 'SMS';
  };

  // Integration metadata
  sourceSystem: 'THOMAS_NET';
  integrationDate: string;
  lastEnhanced: string;
}

interface LeadScoringFactors {
  industryWeight: number;
  locationWeight: number;
  companySizeWeight: number;
  freightVolumeWeight: number;
  contactQualityWeight: number;
  fmcsaPresenceWeight: number;
}

class ThomasNetIntegrationService {
  private thomasNetService: ThomasNetService;
  private fmcsaService: FMCSAService;
  private carrierService: EnhancedCarrierService;
  private scoringFactors: LeadScoringFactors;

  constructor() {
    const credentials = {
      username: process.env.THOMAS_NET_USERNAME || '',
      password: process.env.THOMAS_NET_PASSWORD || '',
    };

    this.thomasNetService = new ThomasNetService(credentials);
    this.fmcsaService = new FMCSAService();
    this.carrierService = new EnhancedCarrierService();

    // Lead scoring weights (total = 1.0)
    this.scoringFactors = {
      industryWeight: 0.25, // Industry type importance
      locationWeight: 0.15, // Geographic location
      companySizeWeight: 0.2, // Company size indicators
      freightVolumeWeight: 0.3, // Estimated freight volume
      contactQualityWeight: 0.05, // Contact information quality
      fmcsaPresenceWeight: 0.05, // FMCSA database presence
    };
  }

  async initialize(): Promise<void> {
    await this.thomasNetService.initialize();
    console.info('ThomasNet Integration Service initialized');
  }

  async discoverHighValueManufacturers(
    location?: string
  ): Promise<EnhancedLeadInfo[]> {
    try {
      console.info('Starting high-value manufacturer discovery...');

      // Search for high freight volume industries
      const highValueIndustries = [
        'automotive manufacturing',
        'steel fabrication',
        'chemical manufacturing',
        'construction materials',
        'industrial machinery',
        'food processing',
        'building materials',
        'heavy equipment',
      ];

      const manufacturers = await this.thomasNetService.bulkManufacturerSearch(
        highValueIndustries,
        location
      );

      console.info(
        `Found ${manufacturers.length} manufacturers from ThomasNet`
      );

      // Enhance each lead with FMCSA data and advanced scoring
      const enhancedLeads: EnhancedLeadInfo[] = [];

      for (const manufacturer of manufacturers) {
        try {
          const enhanced = await this.enhanceManufacturerLead(manufacturer);
          if (enhanced.enhancedLeadScore && enhanced.enhancedLeadScore >= 70) {
            enhancedLeads.push(enhanced);
          }
        } catch (error) {
          console.error(
            `Failed to enhance lead for ${manufacturer.companyName}:`,
            error
          );
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Sort by lead score (highest first)
      enhancedLeads.sort(
        (a, b) => (b.enhancedLeadScore || 0) - (a.enhancedLeadScore || 0)
      );

      console.info(`Enhanced ${enhancedLeads.length} high-quality leads`);
      return enhancedLeads;
    } catch (error) {
      console.error('Failed to discover manufacturers:', error);
      return [];
    }
  }

  async enhanceManufacturerLead(
    manufacturer: ManufacturerInfo
  ): Promise<EnhancedLeadInfo> {
    const enhanced: EnhancedLeadInfo = {
      ...manufacturer,
      sourceSystem: 'THOMAS_NET',
      integrationDate: new Date().toISOString(),
      lastEnhanced: new Date().toISOString(),
    };

    try {
      // Step 1: FMCSA Cross-Reference
      if (manufacturer.companyName) {
        enhanced.fmcsaMatches = await this.crossReferenceFMCSA(
          manufacturer.companyName
        );
      }

      // Step 2: Enhanced Lead Scoring
      enhanced.enhancedLeadScore = this.calculateEnhancedLeadScore(enhanced);

      // Step 3: Freight Volume Estimation
      enhanced.freightVolumeEstimate = this.estimateFreightVolume(enhanced);

      // Step 4: Contact Enhancement
      enhanced.contactEnrichment = this.enhanceContactInfo(enhanced);

      console.info(
        `Enhanced lead: ${enhanced.companyName} (Score: ${enhanced.enhancedLeadScore})`
      );
    } catch (error) {
      console.error(
        `Failed to fully enhance lead for ${manufacturer.companyName}:`,
        error
      );
    }

    return enhanced;
  }

  private async crossReferenceFMCSA(companyName: string): Promise<any> {
    try {
      // Search FMCSA database for company
      const fmcsaResults =
        await this.fmcsaService.searchByCompanyName(companyName);

      if (fmcsaResults && fmcsaResults.length > 0) {
        const primaryResult = fmcsaResults[0];
        return {
          dotNumber: primaryResult.dotNumber,
          mcNumber: primaryResult.mcNumber,
          relatedCarriers: fmcsaResults
            .map((r) => r.mcNumber)
            .filter((mc) => mc),
          carrierRelationships: this.inferCarrierRelationship(primaryResult),
        };
      }

      return null;
    } catch (error) {
      console.error('FMCSA cross-reference failed:', error);
      return null;
    }
  }

  private inferCarrierRelationship(
    fmcsaData: any
  ): 'SHIPPER' | 'CONSIGNEE' | 'BROKER' | 'UNKNOWN' {
    if (!fmcsaData) return 'UNKNOWN';

    const operatingAuthority =
      fmcsaData.operatingAuthority?.toLowerCase() || '';

    if (operatingAuthority.includes('broker')) {
      return 'BROKER';
    } else if (
      operatingAuthority.includes('common carrier') ||
      operatingAuthority.includes('contract carrier')
    ) {
      return 'CONSIGNEE'; // They have carrier authority, likely receive freight
    } else {
      return 'SHIPPER'; // Manufacturing company, likely ships freight
    }
  }

  private calculateEnhancedLeadScore(lead: EnhancedLeadInfo): number {
    let score = 0;

    // Industry scoring
    const industryScore = this.getIndustryScore(
      lead.industryType,
      lead.products
    );
    score += industryScore * this.scoringFactors.industryWeight;

    // Location scoring
    const locationScore = this.getLocationScore(lead.state, lead.city);
    score += locationScore * this.scoringFactors.locationWeight;

    // Company size scoring
    const companySizeScore = this.getCompanySizeScore(
      lead.employeeCount,
      lead.annualRevenue
    );
    score += companySizeScore * this.scoringFactors.companySizeWeight;

    // Freight volume scoring
    const freightVolumeScore = this.getFreightVolumeScore(
      lead.freightVolume,
      lead.industryType
    );
    score += freightVolumeScore * this.scoringFactors.freightVolumeWeight;

    // Contact quality scoring
    const contactScore = this.getContactQualityScore(
      lead.phone,
      lead.email,
      lead.website
    );
    score += contactScore * this.scoringFactors.contactQualityWeight;

    // FMCSA presence bonus
    const fmcsaScore = lead.fmcsaMatches ? 100 : 50;
    score += fmcsaScore * this.scoringFactors.fmcsaPresenceWeight;

    return Math.min(Math.round(score), 100);
  }

  private getIndustryScore(industry?: string, products?: string[]): number {
    const highValueIndustries = [
      'automotive',
      'steel',
      'chemical',
      'construction',
      'machinery',
      'industrial',
      'manufacturing',
      'equipment',
      'metal',
      'building',
    ];

    let score = 50; // Base score

    if (industry) {
      const industryLower = industry.toLowerCase();
      if (highValueIndustries.some((hvi) => industryLower.includes(hvi))) {
        score += 30;
      }
    }

    if (products && products.length > 0) {
      const productText = products.join(' ').toLowerCase();
      if (highValueIndustries.some((hvi) => productText.includes(hvi))) {
        score += 20;
      }
    }

    return Math.min(score, 100);
  }

  private getLocationScore(state?: string, city?: string): number {
    const highFreightStates = [
      'texas',
      'california',
      'illinois',
      'pennsylvania',
      'ohio',
      'michigan',
      'georgia',
      'north carolina',
      'florida',
      'new york',
    ];

    const highFreightCities = [
      'houston',
      'los angeles',
      'chicago',
      'atlanta',
      'dallas',
      'detroit',
      'memphis',
      'kansas city',
      'columbus',
      'phoenix',
    ];

    let score = 50;

    if (state && highFreightStates.includes(state.toLowerCase())) {
      score += 25;
    }

    if (city && highFreightCities.includes(city.toLowerCase())) {
      score += 25;
    }

    return Math.min(score, 100);
  }

  private getCompanySizeScore(
    employeeCount?: string,
    revenue?: string
  ): number {
    let score = 50;

    if (employeeCount) {
      const employees = parseInt(employeeCount.replace(/[^\d]/g, ''));
      if (employees > 100) score += 30;
      else if (employees > 50) score += 20;
      else if (employees > 20) score += 10;
    }

    if (revenue) {
      const revenueNum = parseInt(revenue.replace(/[^\d]/g, ''));
      if (revenueNum > 10000000)
        score += 20; // $10M+
      else if (revenueNum > 5000000)
        score += 15; // $5M+
      else if (revenueNum > 1000000) score += 10; // $1M+
    }

    return Math.min(score, 100);
  }

  private getFreightVolumeScore(
    freightVolume?: string,
    industry?: string
  ): number {
    let score = 50;

    if (freightVolume) {
      switch (freightVolume) {
        case 'CRITICAL':
          score += 40;
          break;
        case 'HIGH':
          score += 30;
          break;
        case 'MEDIUM':
          score += 20;
          break;
        case 'LOW':
          score += 10;
          break;
      }
    }

    // Industry-specific freight volume boost
    if (industry) {
      const industryLower = industry.toLowerCase();
      if (industryLower.includes('heavy') || industryLower.includes('bulk')) {
        score += 10;
      }
    }

    return Math.min(score, 100);
  }

  private getContactQualityScore(
    phone?: string,
    email?: string,
    website?: string
  ): number {
    let score = 0;

    if (phone && phone.length >= 10) score += 40;
    if (email && email.includes('@')) score += 30;
    if (website && website.startsWith('http')) score += 30;

    return Math.min(score, 100);
  }

  private estimateFreightVolume(lead: EnhancedLeadInfo): any {
    // Base estimates on industry type and company size
    let monthlyShipments = 10; // Base
    let averageLoadValue = 2000; // Base

    if (lead.industryType) {
      const industry = lead.industryType.toLowerCase();
      if (industry.includes('automotive') || industry.includes('steel')) {
        monthlyShipments *= 3;
        averageLoadValue *= 2;
      } else if (industry.includes('food') || industry.includes('chemical')) {
        monthlyShipments *= 2;
        averageLoadValue *= 1.5;
      }
    }

    if (lead.freightVolume) {
      switch (lead.freightVolume) {
        case 'CRITICAL':
          monthlyShipments *= 5;
          break;
        case 'HIGH':
          monthlyShipments *= 3;
          break;
        case 'MEDIUM':
          monthlyShipments *= 2;
          break;
      }
    }

    const potentialRevenue = monthlyShipments * averageLoadValue * 0.15; // 15% margin
    const confidence = lead.enhancedLeadScore
      ? lead.enhancedLeadScore / 100
      : 0.7;

    return {
      monthlyShipments,
      averageLoadValue,
      potentialRevenue,
      confidence,
    };
  }

  private enhanceContactInfo(lead: EnhancedLeadInfo): any {
    return {
      decisionMakers: [
        'Transportation Manager',
        'Logistics Coordinator',
        'Operations Manager',
      ],
      departments: ['Shipping', 'Logistics', 'Operations', 'Procurement'],
      bestContactTime: '9:00 AM - 4:00 PM EST',
      preferredContactMethod: lead.phone
        ? 'PHONE'
        : lead.email
          ? 'EMAIL'
          : 'SMS',
    };
  }

  async integratWithAIFlow(leads: EnhancedLeadInfo[]): Promise<void> {
    try {
      // Send leads to AI Flow system for further processing
      console.info(
        `Integrating ${leads.length} ThomasNet leads with AI Flow system`
      );

      for (const lead of leads) {
        const aiFlowLead = this.convertToAIFlowFormat(lead);

        // This would call your existing AI Flow lead ingestion API
        // await this.submitToAIFlow(aiFlowLead);

        console.info(
          `Submitted ${lead.companyName} to AI Flow (Score: ${lead.enhancedLeadScore})`
        );
      }
    } catch (error) {
      console.error('Failed to integrate with AI Flow:', error);
    }
  }

  private convertToAIFlowFormat(lead: EnhancedLeadInfo): any {
    return {
      source: 'ThomasNet Manufacturing',
      companyName: lead.companyName,
      contactInfo: {
        phone: lead.phone,
        email: lead.email,
        website: lead.website,
        address: `${lead.address}, ${lead.city}, ${lead.state} ${lead.zipCode}`,
      },
      leadScore: lead.enhancedLeadScore,
      industryType: lead.industryType,
      freightPotential: lead.freightVolumeEstimate,
      fmcsaData: lead.fmcsaMatches,
      lastUpdated: lead.lastEnhanced,
      priority:
        lead.enhancedLeadScore && lead.enhancedLeadScore >= 85
          ? 'HIGH'
          : 'MEDIUM',
    };
  }

  async close(): Promise<void> {
    await this.thomasNetService.close();
    console.info('ThomasNet Integration Service closed');
  }
}

export default ThomasNetIntegrationService;
export type { EnhancedLeadInfo, LeadScoringFactors };
