'use client';

// FMCSA API Integration Service
// This service handles FMCSA data lookup and carrier verification

export interface FMCSACarrierData {
  dotNumber: string;
  mcNumber?: string;
  legalName: string;
  dbaName?: string;
  physicalAddress: string;
  mailingAddress?: string;
  phone: string;
  email?: string;
  operatingAuthority: string;
  operatingStatus: 'ACTIVE' | 'OUT_OF_SERVICE' | 'NOT_AUTHORIZED';
  safetyRating: 'SATISFACTORY' | 'CONDITIONAL' | 'UNSATISFACTORY' | 'NOT_RATED';
  entityType: string;
  powerUnits: number;
  drivers: number;
  mcs150Date?: string;
  mcs150Mileage?: number;
  equipmentTypes: string[];
  cargoCarried: string[];
  operationClassification: string[];
  insuranceRequired: string[];
  bondSurety: string[];
  safetyReviewDate?: string;
  lastUpdateDate: string;
  // Additional fields for FleetFlow integration
  factorCompany?: string;
  creditRating?: string;
  businessYears?: number;
  insuranceProvider?: string;
  equipmentOwnership: 'OWNED' | 'LEASED' | 'BOTH';
  
  // Safety metrics
  crashTotal?: number;
  crashFatal?: number;
  crashInjury?: number;
  crashTow?: number;
  crashHazmat?: number;
  
  // Inspection data
  inspectionTotal?: number;
  inspectionOOS?: number;
  driverOOS?: number;
  vehicleOOS?: number;
  hazmatInspections?: number;
  
  // Violation data
  driverViolations?: number;
  vehicleViolations?: number;
  hazmatViolations?: number;
}

export interface FMCSASearchResult {
  success: boolean;
  data?: FMCSACarrierData;
  error?: string;
  searchTime: number;
  dataSource: 'FMCSA_API' | 'CACHE' | 'MOCK';
}

// Mock FMCSA database for development
const MOCK_FMCSA_DATABASE: Record<string, FMCSACarrierData> = {
  '123456': {
    dotNumber: '123456',
    mcNumber: 'MC-123456',
    legalName: 'ABC Trucking LLC',
    dbaName: 'ABC Transport Solutions',
    physicalAddress: '1234 Industrial Blvd, Dallas, TX 75201',
    mailingAddress: '1234 Industrial Blvd, Dallas, TX 75201',
    phone: '(555) 123-4567',
    email: 'operations@abctransport.com',
    operatingAuthority: 'Motor Carrier',
    operatingStatus: 'ACTIVE',
    safetyRating: 'SATISFACTORY',
    entityType: 'LLC',
    powerUnits: 25,
    drivers: 30,
    mcs150Date: '2024-01-15',
    mcs150Mileage: 2500000,
    equipmentTypes: ['Van (Enclosed Box)', 'Refrigerated Van'],
    cargoCarried: ['General Freight', 'Refrigerated Food'],
    operationClassification: ['Interstate', 'Intrastate Hazmat', 'Intrastate Non-Hazmat'],
    insuranceRequired: ['Cargo', 'Liability'],
    bondSurety: ['Property Broker: $75,000'],
    safetyReviewDate: '2023-06-15',
    lastUpdateDate: '2024-01-15',
    factorCompany: 'RTS Financial',
    creditRating: 'A-',
    businessYears: 8,
    insuranceProvider: 'Progressive Commercial',
    equipmentOwnership: 'OWNED',
    crashTotal: 2,
    crashFatal: 0,
    crashInjury: 1,
    crashTow: 1,
    crashHazmat: 0,
    inspectionTotal: 45,
    inspectionOOS: 3,
    driverOOS: 1,
    vehicleOOS: 2,
    hazmatInspections: 0,
    driverViolations: 5,
    vehicleViolations: 8,
    hazmatViolations: 0
  },
  '789012': {
    dotNumber: '789012',
    mcNumber: 'MC-789012',
    legalName: 'Express Logistics Inc',
    physicalAddress: '5678 Commerce Ave, Houston, TX 77001',
    mailingAddress: '5678 Commerce Ave, Houston, TX 77001',
    phone: '(555) 789-0123',
    email: 'dispatch@expresslogistics.com',
    operatingAuthority: 'Motor Carrier',
    operatingStatus: 'ACTIVE',
    safetyRating: 'SATISFACTORY',
    entityType: 'Corporation',
    powerUnits: 15,
    drivers: 18,
    mcs150Date: '2024-01-10',
    mcs150Mileage: 1800000,
    equipmentTypes: ['Flatbed', 'Step Deck Low Boy'],
    cargoCarried: ['Building Materials', 'Machinery'],
    operationClassification: ['Interstate'],
    insuranceRequired: ['Cargo', 'Liability'],
    bondSurety: [],
    safetyReviewDate: '2023-08-20',
    lastUpdateDate: '2024-01-10',
    factorCompany: 'Triumph Business Capital',
    creditRating: 'B+',
    businessYears: 5,
    insuranceProvider: 'CIS Insurance',
    equipmentOwnership: 'BOTH',
    crashTotal: 1,
    crashFatal: 0,
    crashInjury: 0,
    crashTow: 1,
    crashHazmat: 0,
    inspectionTotal: 32,
    inspectionOOS: 2,
    driverOOS: 0,
    vehicleOOS: 2,
    hazmatInspections: 0,
    driverViolations: 3,
    vehicleViolations: 4,
    hazmatViolations: 0
  },
  '345678': {
    dotNumber: '345678',
    mcNumber: 'MC-345678',
    legalName: 'Reliable Freight Solutions LLC',
    physicalAddress: '9876 Logistics Way, Phoenix, AZ 85001',
    mailingAddress: '9876 Logistics Way, Phoenix, AZ 85001',
    phone: '(555) 345-6789',
    email: 'info@reliablefreight.com',
    operatingAuthority: 'Motor Carrier',
    operatingStatus: 'ACTIVE',
    safetyRating: 'CONDITIONAL',
    entityType: 'LLC',
    powerUnits: 45,
    drivers: 52,
    mcs150Date: '2023-12-05',
    mcs150Mileage: 4200000,
    equipmentTypes: ['Van (Enclosed Box)', 'Flatbed', 'Tank'],
    cargoCarried: ['General Freight', 'Liquids/Gases', 'Chemicals'],
    operationClassification: ['Interstate', 'Intrastate Hazmat'],
    insuranceRequired: ['Cargo', 'Liability', 'Environmental Restoration'],
    bondSurety: ['Property Broker: $75,000'],
    safetyReviewDate: '2023-05-10',
    lastUpdateDate: '2023-12-05',
    creditRating: 'C+',
    businessYears: 12,
    insuranceProvider: 'National Interstate Insurance',
    equipmentOwnership: 'OWNED',
    crashTotal: 8,
    crashFatal: 0,
    crashInjury: 3,
    crashTow: 5,
    crashHazmat: 1,
    inspectionTotal: 128,
    inspectionOOS: 15,
    driverOOS: 8,
    vehicleOOS: 7,
    hazmatInspections: 12,
    driverViolations: 28,
    vehicleViolations: 35,
    hazmatViolations: 3
  },
  '567890': {
    dotNumber: '567890',
    mcNumber: 'MC-567890',
    legalName: 'Prime Transport Corp',
    physicalAddress: '2468 Highway Blvd, Atlanta, GA 30301',
    mailingAddress: '2468 Highway Blvd, Atlanta, GA 30301',
    phone: '(555) 567-8901',
    email: 'operations@primetransport.com',
    operatingAuthority: 'Motor Carrier',
    operatingStatus: 'ACTIVE',
    safetyRating: 'SATISFACTORY',
    entityType: 'Corporation',
    powerUnits: 85,
    drivers: 95,
    mcs150Date: '2024-02-01',
    mcs150Mileage: 6800000,
    equipmentTypes: ['Van (Enclosed Box)', 'Refrigerated Van', 'Intermodal Cont.'],
    cargoCarried: ['General Freight', 'Refrigerated Food', 'Intermodal Containers'],
    operationClassification: ['Interstate'],
    insuranceRequired: ['Cargo', 'Liability'],
    bondSurety: [],
    safetyReviewDate: '2023-11-15',
    lastUpdateDate: '2024-02-01',
    factorCompany: 'Apex Capital',
    creditRating: 'A',
    businessYears: 15,
    insuranceProvider: 'Great West Casualty',
    equipmentOwnership: 'OWNED',
    crashTotal: 4,
    crashFatal: 0,
    crashInjury: 2,
    crashTow: 2,
    crashHazmat: 0,
    inspectionTotal: 245,
    inspectionOOS: 12,
    driverOOS: 5,
    vehicleOOS: 7,
    hazmatInspections: 0,
    driverViolations: 18,
    vehicleViolations: 25,
    hazmatViolations: 0
  }
};

export class FMCSAService {
  private static instance: FMCSAService;
  private cache: Map<string, { data: FMCSACarrierData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  private constructor() {}
  
  public static getInstance(): FMCSAService {
    if (!FMCSAService.instance) {
      FMCSAService.instance = new FMCSAService();
    }
    return FMCSAService.instance;
  }

  /**
   * Search for carrier by DOT number
   */
  public async searchByDOT(dotNumber: string): Promise<FMCSASearchResult> {
    const startTime = Date.now();
    
    try {
      // Validate DOT number format
      const cleanDOT = dotNumber.replace(/\D/g, '');
      if (!cleanDOT || cleanDOT.length < 6) {
        return {
          success: false,
          error: 'Invalid DOT number format. DOT numbers must be at least 6 digits.',
          searchTime: Date.now() - startTime,
          dataSource: 'MOCK'
        };
      }

      // Check cache first
      const cached = this.cache.get(cleanDOT);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        return {
          success: true,
          data: cached.data,
          searchTime: Date.now() - startTime,
          dataSource: 'CACHE'
        };
      }

      // In production, this would make an actual FMCSA API call
      // For now, use mock data
      const carrierData = await this.fetchFromMockAPI(cleanDOT);
      
      if (carrierData) {
        // Cache the result
        this.cache.set(cleanDOT, {
          data: carrierData,
          timestamp: Date.now()
        });

        return {
          success: true,
          data: carrierData,
          searchTime: Date.now() - startTime,
          dataSource: 'MOCK'
        };
      } else {
        return {
          success: false,
          error: 'Carrier not found in FMCSA database.',
          searchTime: Date.now() - startTime,
          dataSource: 'MOCK'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `FMCSA lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        searchTime: Date.now() - startTime,
        dataSource: 'MOCK'
      };
    }
  }

  /**
   * Search for carrier by MC number
   */
  public async searchByMC(mcNumber: string): Promise<FMCSASearchResult> {
    const startTime = Date.now();
    
    try {
      const cleanMC = mcNumber.replace(/[^0-9]/g, '');
      
      // Find carrier by MC number in mock database
      const foundCarrier = Object.values(MOCK_FMCSA_DATABASE).find(
        carrier => carrier.mcNumber?.replace(/[^0-9]/g, '') === cleanMC
      );

      if (foundCarrier) {
        return {
          success: true,
          data: foundCarrier,
          searchTime: Date.now() - startTime,
          dataSource: 'MOCK'
        };
      } else {
        return {
          success: false,
          error: 'Carrier not found by MC number.',
          searchTime: Date.now() - startTime,
          dataSource: 'MOCK'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `MC lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        searchTime: Date.now() - startTime,
        dataSource: 'MOCK'
      };
    }
  }

  /**
   * Search for carriers by company name
   */
  public async searchByName(companyName: string): Promise<FMCSASearchResult[]> {
    const searchTerm = companyName.toLowerCase();
    const results: FMCSASearchResult[] = [];
    
    for (const [dotNumber, carrier] of Object.entries(MOCK_FMCSA_DATABASE)) {
      if (
        carrier.legalName.toLowerCase().includes(searchTerm) ||
        carrier.dbaName?.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          success: true,
          data: carrier,
          searchTime: 0,
          dataSource: 'MOCK'
        });
      }
    }
    
    return results;
  }

  /**
   * Mock API call - in production this would call the actual FMCSA API
   */
  private async fetchFromMockAPI(dotNumber: string): Promise<FMCSACarrierData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    return MOCK_FMCSA_DATABASE[dotNumber] || null;
  }

  /**
   * Get safety score based on carrier data
   */
  public static calculateSafetyScore(carrier: FMCSACarrierData): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    factors: string[];
  } {
    let score = 100;
    const factors: string[] = [];

    // Safety rating impact
    switch (carrier.safetyRating) {
      case 'SATISFACTORY':
        // No penalty
        break;
      case 'CONDITIONAL':
        score -= 20;
        factors.push('Conditional safety rating');
        break;
      case 'UNSATISFACTORY':
        score -= 40;
        factors.push('Unsatisfactory safety rating');
        break;
      case 'NOT_RATED':
        score -= 10;
        factors.push('No safety rating');
        break;
    }

    // Crash rate impact
    if (carrier.crashTotal && carrier.powerUnits) {
      const crashRate = carrier.crashTotal / carrier.powerUnits;
      if (crashRate > 0.2) {
        score -= 15;
        factors.push('High crash rate');
      }
      if (carrier.crashFatal && carrier.crashFatal > 0) {
        score -= 25;
        factors.push('Fatal crashes');
      }
    }

    // Inspection out-of-service rate
    if (carrier.inspectionTotal && carrier.inspectionOOS) {
      const oosRate = carrier.inspectionOOS / carrier.inspectionTotal;
      if (oosRate > 0.15) {
        score -= 10;
        factors.push('High out-of-service rate');
      }
    }

    // Violation rate
    if (carrier.inspectionTotal && (carrier.driverViolations || carrier.vehicleViolations)) {
      const totalViolations = (carrier.driverViolations || 0) + (carrier.vehicleViolations || 0);
      const violationRate = totalViolations / carrier.inspectionTotal;
      if (violationRate > 0.5) {
        score -= 8;
        factors.push('High violation rate');
      }
    }

    // Operating status
    if (carrier.operatingStatus !== 'ACTIVE') {
      score -= 30;
      factors.push('Not in active status');
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    return { score, grade, factors };
  }

  /**
   * Check if carrier meets basic onboarding requirements
   */
  public static validateForOnboarding(carrier: FMCSACarrierData): {
    eligible: boolean;
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Critical issues that prevent onboarding
    if (carrier.operatingStatus !== 'ACTIVE') {
      issues.push('Carrier is not in active operating status');
    }

    if (carrier.safetyRating === 'UNSATISFACTORY') {
      issues.push('Unsatisfactory safety rating');
    }

    if (!carrier.mcNumber) {
      issues.push('No MC number found - required for motor carrier operations');
    }

    // Warnings that should be reviewed
    if (carrier.safetyRating === 'CONDITIONAL') {
      warnings.push('Conditional safety rating requires additional review');
    }

    if (carrier.safetyRating === 'NOT_RATED') {
      warnings.push('Carrier has not been safety rated');
    }

    const safetyScore = this.calculateSafetyScore(carrier);
    if (safetyScore.grade === 'D' || safetyScore.grade === 'F') {
      warnings.push(`Low safety score (${safetyScore.score}/100)`);
    }

    // Check for recent MCS-150 filing
    if (carrier.mcs150Date) {
      const mcsDate = new Date(carrier.mcs150Date);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      
      if (mcsDate < twoYearsAgo) {
        warnings.push('MCS-150 filing is more than 2 years old');
      }
    }

    return {
      eligible: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get all available DOT numbers for testing
   */
  public getTestDOTNumbers(): string[] {
    return Object.keys(MOCK_FMCSA_DATABASE);
  }
}

// Export singleton instance
export const fmcsaService = FMCSAService.getInstance();
