// EPA SmartWay API Service
// Provides sustainability analytics, emissions tracking, and environmental compliance
// Real-time environmental data for fleet optimization

interface EPAEmissionsData {
  co2EmissionsGrams: number;
  noxEmissionsGrams: number;
  particulateEmissionsGrams: number;
  carbonFootprintLbs: number;
  mpgRating: number;
  fuelType: string;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
  certificationLevel: 'SmartWay Elite' | 'SmartWay' | 'Standard';
}

interface EPAFuelEfficiencyData {
  avgMPG: number;
  fuelConsumptionGallons: number;
  co2PerMile: number;
  annualFuelCost: number;
  efficiencyRating: number;
  greenhouseGasScore: number;
  smogRating: number;
  vehicleClass: string;
}

interface EPAComplianceData {
  regulationCompliance: boolean;
  certificationStatus: 'Active' | 'Pending' | 'Expired';
  lastInspectionDate: string;
  nextInspectionDue: string;
  violationCount: number;
  complianceScore: number;
  certificationLevel: string;
  auditStatus: 'Pass' | 'Fail' | 'Pending';
}

interface EPASustainabilityMetrics {
  carbonFootprintReduction: number;
  fuelSavingsGallons: number;
  costSavingsAnnual: number;
  emissionsReductionTons: number;
  greenMilesPercentage: number;
  sustainabilityScore: number;
  renewableFuelUsage: number;
  efficiencyImprovement: number;
}

interface EPAEnvironmentalImpact {
  totalEmissionsTons: number;
  waterFootprintGallons: number;
  wasteReductionLbs: number;
  energyUsageKWh: number;
  renewableEnergyPercentage: number;
  recyclingRate: number;
  biodiversityImpact: 'positive' | 'neutral' | 'negative';
  airQualityIndex: number;
}

interface EPACarrierRankings {
  carrierName: string;
  smartWayRank: number;
  sustainabilityScore: number;
  carbonEfficiency: number;
  totalEmissions: number;
  fleetSize: number;
  certificationLevel: string;
  performanceGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
}

interface EPAAlternativeFuels {
  fuelType: string;
  availabilityPercentage: number;
  costPerGallon: number;
  emissionsReduction: number;
  infrastructureReadiness: number;
  adoptionRate: number;
  incentivesAvailable: boolean;
  roiTimeframe: string;
}

interface EPARegionalEnvironmental {
  state: string;
  airQualityIndex: number;
  ozoneLevels: number;
  particulateMatter: number;
  emissionsStandards: string;
  incentivePrograms: string[];
  complianceRequirements: string[];
  greenZoneRestrictions: boolean;
}

class EPAService {
  private static instance: EPAService;
  private baseUrl = 'https://api.epa.gov/smartway/v1';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 3600000; // 1 hour

  static getInstance(): EPAService {
    if (!EPAService.instance) {
      EPAService.instance = new EPAService();
    }
    return EPAService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? Date.now() - cached.timestamp < this.cacheTimeout : false;
  }

  private getCachedData(key: string) {
    return this.cache.get(key)?.data;
  }

  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getVehicleEmissions(vin: string): Promise<EPAEmissionsData> {
    const cacheKey = `emissions_${vin}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      // Mock data for development - replace with real API call
      const mockData: EPAEmissionsData = {
        co2EmissionsGrams: 1089,
        noxEmissionsGrams: 2.8,
        particulateEmissionsGrams: 0.02,
        carbonFootprintLbs: 2.4,
        mpgRating: 7.2,
        fuelType: 'Diesel',
        efficiency: 'good',
        certificationLevel: 'SmartWay'
      };

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching EPA emissions data:', error);
      throw new Error('Failed to fetch emissions data');
    }
  }

  async getFuelEfficiencyData(fleetId: string): Promise<EPAFuelEfficiencyData> {
    const cacheKey = `fuel_efficiency_${fleetId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPAFuelEfficiencyData = {
        avgMPG: 6.8,
        fuelConsumptionGallons: 23847,
        co2PerMile: 1.6,
        annualFuelCost: 89234,
        efficiencyRating: 7.3,
        greenhouseGasScore: 6,
        smogRating: 7,
        vehicleClass: 'Heavy Duty Truck'
      };

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching fuel efficiency data:', error);
      throw new Error('Failed to fetch fuel efficiency data');
    }
  }

  async getComplianceStatus(carrierId: string): Promise<EPAComplianceData> {
    const cacheKey = `compliance_${carrierId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPAComplianceData = {
        regulationCompliance: true,
        certificationStatus: 'Active',
        lastInspectionDate: '2024-03-15',
        nextInspectionDue: '2024-09-15',
        violationCount: 0,
        complianceScore: 94.7,
        certificationLevel: 'SmartWay Elite',
        auditStatus: 'Pass'
      };

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching compliance data:', error);
      throw new Error('Failed to fetch compliance data');
    }
  }

  async getSustainabilityMetrics(timeframe: string): Promise<EPASustainabilityMetrics> {
    const cacheKey = `sustainability_${timeframe}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPASustainabilityMetrics = {
        carbonFootprintReduction: 23.4,
        fuelSavingsGallons: 4567,
        costSavingsAnnual: 18924,
        emissionsReductionTons: 89.2,
        greenMilesPercentage: 67.8,
        sustainabilityScore: 8.4,
        renewableFuelUsage: 12.6,
        efficiencyImprovement: 15.9
      };

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching sustainability metrics:', error);
      throw new Error('Failed to fetch sustainability metrics');
    }
  }

  async getEnvironmentalImpact(region: string): Promise<EPAEnvironmentalImpact> {
    const cacheKey = `environmental_${region}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPAEnvironmentalImpact = {
        totalEmissionsTons: 2847.5,
        waterFootprintGallons: 1.2e6,
        wasteReductionLbs: 45600,
        energyUsageKWh: 890450,
        renewableEnergyPercentage: 18.7,
        recyclingRate: 76.3,
        biodiversityImpact: 'positive',
        airQualityIndex: 68
      };

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching environmental impact data:', error);
      throw new Error('Failed to fetch environmental impact data');
    }
  }

  async getCarrierRankings(category: string): Promise<EPACarrierRankings[]> {
    const cacheKey = `rankings_${category}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPACarrierRankings[] = [
        {
          carrierName: 'Green Fleet Solutions',
          smartWayRank: 1,
          sustainabilityScore: 97.8,
          carbonEfficiency: 94.2,
          totalEmissions: 1250.5,
          fleetSize: 847,
          certificationLevel: 'SmartWay Elite',
          performanceGrade: 'A+'
        },
        {
          carrierName: 'EcoTrans Logistics',
          smartWayRank: 2,
          sustainabilityScore: 95.3,
          carbonEfficiency: 91.8,
          totalEmissions: 1398.2,
          fleetSize: 923,
          certificationLevel: 'SmartWay Elite',
          performanceGrade: 'A+'
        },
        {
          carrierName: 'Sustainable Freight Co',
          smartWayRank: 3,
          sustainabilityScore: 92.1,
          carbonEfficiency: 88.9,
          totalEmissions: 1576.8,
          fleetSize: 1045,
          certificationLevel: 'SmartWay',
          performanceGrade: 'A'
        }
      ];

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching carrier rankings:', error);
      throw new Error('Failed to fetch carrier rankings');
    }
  }

  async getAlternativeFuels(region: string): Promise<EPAAlternativeFuels[]> {
    const cacheKey = `alt_fuels_${region}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPAAlternativeFuels[] = [
        {
          fuelType: 'Biodiesel B20',
          availabilityPercentage: 78.5,
          costPerGallon: 4.12,
          emissionsReduction: 22.3,
          infrastructureReadiness: 84.7,
          adoptionRate: 31.2,
          incentivesAvailable: true,
          roiTimeframe: '2.3 years'
        },
        {
          fuelType: 'Compressed Natural Gas',
          availabilityPercentage: 65.2,
          costPerGallon: 3.89,
          emissionsReduction: 31.8,
          infrastructureReadiness: 72.4,
          adoptionRate: 18.6,
          incentivesAvailable: true,
          roiTimeframe: '3.1 years'
        },
        {
          fuelType: 'Electric',
          availabilityPercentage: 42.8,
          costPerGallon: 2.97,
          emissionsReduction: 89.4,
          infrastructureReadiness: 58.3,
          adoptionRate: 8.7,
          incentivesAvailable: true,
          roiTimeframe: '4.2 years'
        }
      ];

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching alternative fuels data:', error);
      throw new Error('Failed to fetch alternative fuels data');
    }
  }

  async getRegionalEnvironmentalData(state: string): Promise<EPARegionalEnvironmental> {
    const cacheKey = `regional_${state}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const mockData: EPARegionalEnvironmental = {
        state: 'California',
        airQualityIndex: 72,
        ozoneLevels: 0.068,
        particulateMatter: 11.2,
        emissionsStandards: 'CARB Tier 4',
        incentivePrograms: ['HVIP', 'LCTI', 'Zero-Emission Vouchers'],
        complianceRequirements: ['CARB Reporting', 'GHG Verification'],
        greenZoneRestrictions: true
      };

      this.setCachedData(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching regional environmental data:', error);
      throw new Error('Failed to fetch regional environmental data');
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default EPAService;
export type {
  EPAEmissionsData,
  EPAFuelEfficiencyData,
  EPAComplianceData,
  EPASustainabilityMetrics,
  EPAEnvironmentalImpact,
  EPACarrierRankings,
  EPAAlternativeFuels,
  EPARegionalEnvironmental
}; 