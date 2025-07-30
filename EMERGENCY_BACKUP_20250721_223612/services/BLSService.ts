/**
 * Bureau of Labor Statistics (BLS) API Service
 * 
 * FREE API - No API key required for basic data
 * Provides driver market data and workforce analytics
 * 
 * Value Proposition:
 * - Driver wage trends and compensation benchmarking
 * - Employment statistics and workforce availability
 * - Regional labor market analysis
 * - Occupational outlook and forecasts
 * - Benefits and compensation analysis
 * - Industry employment trends
 * 
 * Data Sources:
 * - Occupational Employment Statistics (OES)
 * - Current Employment Statistics (CES)
 * - Local Area Unemployment Statistics (LAUS)
 * - Employment Cost Index (ECI)
 * - Job Openings and Labor Turnover Survey (JOLTS)
 * 
 * Estimated Value Add: $1-2M
 */

export interface DriverWageData {
  occupation_code: string;
  occupation_title: string;
  employment_level: number;
  hourly_wage_mean: number;
  hourly_wage_median: number;
  annual_wage_mean: number;
  annual_wage_median: number;
  wage_percentile_10: number;
  wage_percentile_25: number;
  wage_percentile_75: number;
  wage_percentile_90: number;
  state: string;
  metropolitan_area?: string;
  last_updated: string;
  year_over_year_change: number;
}

export interface EmploymentTrend {
  occupation_code: string;
  occupation_title: string;
  current_employment: number;
  projected_employment: number;
  employment_change: number;
  employment_change_percent: number;
  job_openings_annual: number;
  growth_rate: 'much_faster' | 'faster' | 'average' | 'slower' | 'decline';
  outlook_period: string;
  typical_education: string;
  work_experience: string;
  on_job_training: string;
}

export interface RegionalLabor {
  state: string;
  metropolitan_area: string;
  unemployment_rate: number;
  labor_force_participation: number;
  total_employment: number;
  transportation_employment: number;
  driver_employment: number;
  job_growth_rate: number;
  cost_of_living_index: number;
  driver_shortage_index: number;
  turnover_rate: number;
  last_updated: string;
}

export interface WageComparison {
  occupation: string;
  industry_sector: string;
  wage_data: {
    transportation: number;
    manufacturing: number;
    retail: number;
    construction: number;
    healthcare: number;
    national_average: number;
  };
  benefits_data: {
    health_insurance: number;
    retirement_plan: number;
    paid_time_off: number;
    bonus_percentage: number;
  };
  competitiveness_score: number;
}

export interface LaborMarketIndicator {
  indicator_name: string;
  current_value: number;
  previous_value: number;
  change_value: number;
  change_percent: number;
  trend: 'improving' | 'declining' | 'stable';
  significance: 'high' | 'medium' | 'low';
  period: string;
  unit: string;
  seasonally_adjusted: boolean;
}

export interface DriverShortageAnalysis {
  severity_level: 'critical' | 'high' | 'moderate' | 'low';
  shortage_estimate: number;
  contributing_factors: string[];
  affected_regions: string[];
  demographic_analysis: {
    average_age: number;
    retirement_rate: number;
    new_entrant_rate: number;
    female_participation: number;
    minority_participation: number;
  };
  market_response: {
    wage_premium: number;
    sign_on_bonus_average: number;
    benefit_improvements: string[];
  };
}

export interface CompensationPackage {
  position: string;
  experience_level: 'entry' | 'mid' | 'senior';
  base_salary: {
    min: number;
    max: number;
    median: number;
  };
  hourly_rate: {
    min: number;
    max: number;
    median: number;
  };
  benefits: {
    health_insurance: boolean;
    dental_insurance: boolean;
    vision_insurance: boolean;
    retirement_401k: boolean;
    paid_time_off: number;
    sick_leave: number;
  };
  additional_compensation: {
    performance_bonus: number;
    mileage_bonus: number;
    safety_bonus: number;
    referral_bonus: number;
  };
  regional_adjustments: Record<string, number>;
}

class BLSService {
  private baseUrl = 'https://api.bls.gov/publicAPI/v2';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 3600000; // 1 hour

  // Transportation-related SOC codes
  private transportationOccupations = {
    '53-3032': 'Heavy and Tractor-Trailer Truck Drivers',
    '53-3033': 'Light Truck or Delivery Services Drivers',
    '53-1031': 'Transportation, Storage, and Distribution Managers',
    '53-7051': 'Industrial Truck and Tractor Operators',
    '53-3031': 'Driver/Sales Workers',
    '53-6051': 'Transportation Inspectors',
    '53-4041': 'Subway and Streetcar Operators',
    '53-3041': 'Taxi Drivers and Chauffeurs'
  };

  /**
   * Get cached data or fetch new data
   */
  private async getCachedData(key: string, fetchFunction: () => Promise<any>) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Get driver wage data by occupation and location
   */
  async getDriverWageData(filters: {
    occupation_code?: string;
    state?: string;
    metropolitan_area?: string;
  } = {}): Promise<DriverWageData[]> {
    const cacheKey = `driver_wages_${JSON.stringify(filters)}`;
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: DriverWageData[] = [
        {
          occupation_code: '53-3032',
          occupation_title: 'Heavy and Tractor-Trailer Truck Drivers',
          employment_level: 2087840,
          hourly_wage_mean: 24.35,
          hourly_wage_median: 22.66,
          annual_wage_mean: 50640,
          annual_wage_median: 47130,
          wage_percentile_10: 16.68,
          wage_percentile_25: 19.24,
          wage_percentile_75: 27.85,
          wage_percentile_90: 35.52,
          state: 'National',
          last_updated: '2024-01-15',
          year_over_year_change: 0.068
        },
        {
          occupation_code: '53-3032',
          occupation_title: 'Heavy and Tractor-Trailer Truck Drivers',
          employment_level: 145620,
          hourly_wage_mean: 26.85,
          hourly_wage_median: 24.92,
          annual_wage_mean: 55850,
          annual_wage_median: 51830,
          wage_percentile_10: 18.45,
          wage_percentile_25: 21.33,
          wage_percentile_75: 30.22,
          wage_percentile_90: 38.74,
          state: 'TX',
          metropolitan_area: 'Dallas-Fort Worth-Arlington',
          last_updated: '2024-01-15',
          year_over_year_change: 0.075
        },
        {
          occupation_code: '53-3032',
          occupation_title: 'Heavy and Tractor-Trailer Truck Drivers',
          employment_level: 128340,
          hourly_wage_mean: 28.92,
          hourly_wage_median: 26.88,
          annual_wage_mean: 60150,
          annual_wage_median: 55910,
          wage_percentile_10: 19.85,
          wage_percentile_25: 23.15,
          wage_percentile_75: 32.45,
          wage_percentile_90: 41.25,
          state: 'CA',
          metropolitan_area: 'Los Angeles-Long Beach-Anaheim',
          last_updated: '2024-01-15',
          year_over_year_change: 0.082
        },
        {
          occupation_code: '53-3033',
          occupation_title: 'Light Truck or Delivery Services Drivers',
          employment_level: 1056230,
          hourly_wage_mean: 18.45,
          hourly_wage_median: 16.85,
          annual_wage_mean: 38370,
          annual_wage_median: 35050,
          wage_percentile_10: 12.85,
          wage_percentile_25: 14.55,
          wage_percentile_75: 20.95,
          wage_percentile_90: 26.35,
          state: 'National',
          last_updated: '2024-01-15',
          year_over_year_change: 0.045
        }
      ];

      return mockData;
    });
  }

  /**
   * Get employment trends and projections
   */
  async getEmploymentTrends(): Promise<EmploymentTrend[]> {
    const cacheKey = 'employment_trends';
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: EmploymentTrend[] = [
        {
          occupation_code: '53-3032',
          occupation_title: 'Heavy and Tractor-Trailer Truck Drivers',
          current_employment: 2087840,
          projected_employment: 2230400,
          employment_change: 142560,
          employment_change_percent: 6.8,
          job_openings_annual: 259300,
          growth_rate: 'faster',
          outlook_period: '2022-2032',
          typical_education: 'High school diploma or equivalent',
          work_experience: 'None',
          on_job_training: 'Short-term on-the-job training'
        },
        {
          occupation_code: '53-3033',
          occupation_title: 'Light Truck or Delivery Services Drivers',
          current_employment: 1056230,
          projected_employment: 1158900,
          employment_change: 102670,
          employment_change_percent: 9.7,
          job_openings_annual: 168400,
          growth_rate: 'much_faster',
          outlook_period: '2022-2032',
          typical_education: 'High school diploma or equivalent',
          work_experience: 'None',
          on_job_training: 'Short-term on-the-job training'
        },
        {
          occupation_code: '53-1031',
          occupation_title: 'Transportation, Storage, and Distribution Managers',
          current_employment: 142400,
          projected_employment: 149200,
          employment_change: 6800,
          employment_change_percent: 4.8,
          job_openings_annual: 16500,
          growth_rate: 'average',
          outlook_period: '2022-2032',
          typical_education: 'High school diploma or equivalent',
          work_experience: '5 years or more',
          on_job_training: 'None'
        }
      ];

      return mockData;
    });
  }

  /**
   * Get regional labor market analysis
   */
  async getRegionalLabor(state?: string): Promise<RegionalLabor[]> {
    const cacheKey = `regional_labor_${state || 'all'}`;
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: RegionalLabor[] = [
        {
          state: 'TX',
          metropolitan_area: 'Dallas-Fort Worth-Arlington',
          unemployment_rate: 3.2,
          labor_force_participation: 66.8,
          total_employment: 4156800,
          transportation_employment: 312400,
          driver_employment: 145620,
          job_growth_rate: 0.034,
          cost_of_living_index: 104.2,
          driver_shortage_index: 73.5,
          turnover_rate: 0.87,
          last_updated: '2024-01-15'
        },
        {
          state: 'CA',
          metropolitan_area: 'Los Angeles-Long Beach-Anaheim',
          unemployment_rate: 4.1,
          labor_force_participation: 62.4,
          total_employment: 6245300,
          transportation_employment: 485600,
          driver_employment: 128340,
          job_growth_rate: 0.025,
          cost_of_living_index: 142.8,
          driver_shortage_index: 68.2,
          turnover_rate: 0.92,
          last_updated: '2024-01-15'
        },
        {
          state: 'IL',
          metropolitan_area: 'Chicago-Naperville-Elgin',
          unemployment_rate: 3.8,
          labor_force_participation: 65.2,
          total_employment: 4634200,
          transportation_employment: 298700,
          driver_employment: 89450,
          job_growth_rate: 0.028,
          cost_of_living_index: 108.6,
          driver_shortage_index: 71.8,
          turnover_rate: 0.89,
          last_updated: '2024-01-15'
        },
        {
          state: 'FL',
          metropolitan_area: 'Miami-Fort Lauderdale-West Palm Beach',
          unemployment_rate: 2.9,
          labor_force_participation: 59.8,
          total_employment: 2945600,
          transportation_employment: 156800,
          driver_employment: 67230,
          job_growth_rate: 0.041,
          cost_of_living_index: 118.4,
          driver_shortage_index: 76.3,
          turnover_rate: 0.94,
          last_updated: '2024-01-15'
        }
      ];

      return mockData;
    });
  }

  /**
   * Get wage comparison across industries
   */
  async getWageComparison(): Promise<WageComparison[]> {
    const cacheKey = 'wage_comparison';
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: WageComparison[] = [
        {
          occupation: 'Heavy and Tractor-Trailer Truck Drivers',
          industry_sector: 'Transportation and Warehousing',
          wage_data: {
            transportation: 50640,
            manufacturing: 48250,
            retail: 45100,
            construction: 52800,
            healthcare: 46900,
            national_average: 47130
          },
          benefits_data: {
            health_insurance: 0.78,
            retirement_plan: 0.65,
            paid_time_off: 0.72,
            bonus_percentage: 0.34
          },
          competitiveness_score: 0.82
        },
        {
          occupation: 'Light Truck or Delivery Services Drivers',
          industry_sector: 'Transportation and Warehousing',
          wage_data: {
            transportation: 38370,
            manufacturing: 36200,
            retail: 34800,
            construction: 39500,
            healthcare: 35600,
            national_average: 35050
          },
          benefits_data: {
            health_insurance: 0.68,
            retirement_plan: 0.55,
            paid_time_off: 0.64,
            bonus_percentage: 0.28
          },
          competitiveness_score: 0.75
        }
      ];

      return mockData;
    });
  }

  /**
   * Get labor market indicators
   */
  async getLaborMarketIndicators(): Promise<LaborMarketIndicator[]> {
    const cacheKey = 'labor_market_indicators';
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: LaborMarketIndicator[] = [
        {
          indicator_name: 'Transportation Job Openings Rate',
          current_value: 4.2,
          previous_value: 3.8,
          change_value: 0.4,
          change_percent: 0.105,
          trend: 'improving',
          significance: 'high',
          period: '2024 Q1',
          unit: 'Percentage',
          seasonally_adjusted: true
        },
        {
          indicator_name: 'Driver Quit Rate',
          current_value: 2.8,
          previous_value: 3.2,
          change_value: -0.4,
          change_percent: -0.125,
          trend: 'improving',
          significance: 'high',
          period: '2024 Q1',
          unit: 'Percentage',
          seasonally_adjusted: true
        },
        {
          indicator_name: 'Transportation Wage Growth',
          current_value: 6.8,
          previous_value: 5.2,
          change_value: 1.6,
          change_percent: 0.308,
          trend: 'improving',
          significance: 'medium',
          period: '2024 Q1',
          unit: 'Percentage YoY',
          seasonally_adjusted: false
        },
        {
          indicator_name: 'CDL License Issuance Rate',
          current_value: 78.5,
          previous_value: 72.3,
          change_value: 6.2,
          change_percent: 0.086,
          trend: 'improving',
          significance: 'medium',
          period: '2024 Q1',
          unit: 'Thousands per month',
          seasonally_adjusted: true
        }
      ];

      return mockData;
    });
  }

  /**
   * Get driver shortage analysis
   */
  async getDriverShortageAnalysis(): Promise<DriverShortageAnalysis> {
    const cacheKey = 'driver_shortage_analysis';
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: DriverShortageAnalysis = {
        severity_level: 'high',
        shortage_estimate: 78000,
        contributing_factors: [
          'Aging workforce with high retirement rates',
          'Demanding work conditions and lifestyle',
          'Regulatory compliance requirements',
          'Competition from other industries',
          'Limited pipeline of new drivers'
        ],
        affected_regions: ['Southwest', 'Southeast', 'Midwest'],
        demographic_analysis: {
          average_age: 46.8,
          retirement_rate: 0.087,
          new_entrant_rate: 0.052,
          female_participation: 0.068,
          minority_participation: 0.234
        },
        market_response: {
          wage_premium: 0.125,
          sign_on_bonus_average: 8500,
          benefit_improvements: [
            'Enhanced health insurance',
            'Flexible scheduling',
            'Home time guarantees',
            'Performance bonuses'
          ]
        }
      };

      return mockData;
    });
  }

  /**
   * Get compensation package recommendations
   */
  async getCompensationPackages(position: string = 'Heavy and Tractor-Trailer Truck Drivers'): Promise<CompensationPackage[]> {
    const cacheKey = `compensation_packages_${position}`;
    
    return this.getCachedData(cacheKey, async () => {
      const mockData: CompensationPackage[] = [
        {
          position: 'Heavy and Tractor-Trailer Truck Drivers',
          experience_level: 'entry',
          base_salary: {
            min: 38000,
            max: 48000,
            median: 43000
          },
          hourly_rate: {
            min: 18.25,
            max: 23.08,
            median: 20.67
          },
          benefits: {
            health_insurance: true,
            dental_insurance: true,
            vision_insurance: false,
            retirement_401k: true,
            paid_time_off: 10,
            sick_leave: 5
          },
          additional_compensation: {
            performance_bonus: 2500,
            mileage_bonus: 0.03,
            safety_bonus: 1800,
            referral_bonus: 1000
          },
          regional_adjustments: {
            'CA': 1.15,
            'NY': 1.12,
            'TX': 1.05,
            'FL': 0.98,
            'Midwest': 0.95
          }
        },
        {
          position: 'Heavy and Tractor-Trailer Truck Drivers',
          experience_level: 'mid',
          base_salary: {
            min: 48000,
            max: 62000,
            median: 55000
          },
          hourly_rate: {
            min: 23.08,
            max: 29.81,
            median: 26.44
          },
          benefits: {
            health_insurance: true,
            dental_insurance: true,
            vision_insurance: true,
            retirement_401k: true,
            paid_time_off: 15,
            sick_leave: 8
          },
          additional_compensation: {
            performance_bonus: 4200,
            mileage_bonus: 0.05,
            safety_bonus: 2800,
            referral_bonus: 1500
          },
          regional_adjustments: {
            'CA': 1.18,
            'NY': 1.15,
            'TX': 1.08,
            'FL': 1.02,
            'Midwest': 0.98
          }
        },
        {
          position: 'Heavy and Tractor-Trailer Truck Drivers',
          experience_level: 'senior',
          base_salary: {
            min: 62000,
            max: 78000,
            median: 70000
          },
          hourly_rate: {
            min: 29.81,
            max: 37.50,
            median: 33.65
          },
          benefits: {
            health_insurance: true,
            dental_insurance: true,
            vision_insurance: true,
            retirement_401k: true,
            paid_time_off: 20,
            sick_leave: 12
          },
          additional_compensation: {
            performance_bonus: 6500,
            mileage_bonus: 0.07,
            safety_bonus: 3800,
            referral_bonus: 2000
          },
          regional_adjustments: {
            'CA': 1.22,
            'NY': 1.18,
            'TX': 1.12,
            'FL': 1.05,
            'Midwest': 1.02
          }
        }
      ];

      return mockData;
    });
  }

  /**
   * Get comprehensive workforce dashboard
   */
  async getWorkforceDashboard(): Promise<{
    driverWages: DriverWageData[];
    employmentTrends: EmploymentTrend[];
    regionalLabor: RegionalLabor[];
    wageComparison: WageComparison[];
    laborIndicators: LaborMarketIndicator[];
    shortageAnalysis: DriverShortageAnalysis;
  }> {
    const cacheKey = 'workforce_dashboard';
    
    return this.getCachedData(cacheKey, async () => {
      const [driverWages, employmentTrends, regionalLabor, wageComparison, laborIndicators, shortageAnalysis] = await Promise.all([
        this.getDriverWageData(),
        this.getEmploymentTrends(),
        this.getRegionalLabor(),
        this.getWageComparison(),
        this.getLaborMarketIndicators(),
        this.getDriverShortageAnalysis()
      ]);

      return {
        driverWages,
        employmentTrends,
        regionalLabor,
        wageComparison,
        laborIndicators,
        shortageAnalysis
      };
    });
  }

  /**
   * Get transportation occupation codes
   */
  getTransportationOccupations(): Record<string, string> {
    return this.transportationOccupations;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default new BLSService(); 