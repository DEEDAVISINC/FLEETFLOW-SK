/**
 * HS Code Service
 *
 * Harmonized System code database and duty calculation service
 * Uses FREE USITC HTS database and Trade.gov Tariff API
 */

export interface HSCode {
  hsCode: string;
  description: string;
  generalDuty: string;
  units: string;
  keywords: string[];
  category: string;
}

export interface DutyInfo {
  hsCode: string;
  description: string;
  country: string;
  generalDutyRate: string;
  source: string;
}

export class HSCodeService {
  private readonly API_KEY = process.env.TRADE_GOV_API_KEY;
  private readonly TARIFF_API = 'https://api.trade.gov/tariff_rates/search';

  /**
   * Search for HS codes by product description
   */
  async searchByDescription(
    description: string,
    limit: number = 10
  ): Promise<HSCode[]> {
    // Mock data - replace with actual HTS database
    const mockCodes: HSCode[] = [
      {
        hsCode: '8517.62.00',
        description: 'Smartphones and mobile phones',
        generalDuty: 'Free',
        units: 'No.',
        keywords: ['smartphone', 'phone', 'mobile', 'cell'],
        category: 'Electronics',
      },
      {
        hsCode: '8471.30.01',
        description: 'Laptops and portable computers',
        generalDuty: 'Free',
        units: 'No.',
        keywords: ['laptop', 'computer', 'notebook'],
        category: 'Electronics',
      },
      {
        hsCode: '6109.10.00',
        description: 'T-shirts of cotton',
        generalDuty: '16.5%',
        units: 'kg',
        keywords: ['t-shirt', 'shirt', 'cotton'],
        category: 'Textiles',
      },
    ];

    return mockCodes.slice(0, limit);
  }

  /**
   * Get duty rates for HS code by country
   */
  async getDutyRates(
    hsCode: string,
    country: string
  ): Promise<DutyInfo | null> {
    try {
      if (!this.API_KEY) {
        throw new Error('TRADE_GOV_API_KEY not set');
      }

      const queryParams = new URLSearchParams({
        api_key: this.API_KEY,
        hs_code: hsCode,
        country: country,
      });

      const response = await fetch(
        `${this.TARIFF_API}?${queryParams.toString()}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          hsCode,
          description: result.description || 'Unknown',
          country: result.country || country,
          generalDutyRate:
            result.duty_rate || result.general_duty_rate || 'Unknown',
          source: 'Trade.gov Tariff API',
        };
      }

      return null;
    } catch (error) {
      console.error('Duty rate lookup failed:', error);
      return null;
    }
  }

  /**
   * Calculate estimated duty
   */
  async calculateDuty(params: {
    hsCode: string;
    country: string;
    value: number;
  }): Promise<{
    dutyAmount: number;
    dutyRate: string;
    totalValue: number;
  }> {
    const dutyInfo = await this.getDutyRates(params.hsCode, params.country);

    if (!dutyInfo) {
      throw new Error('Could not retrieve duty information');
    }

    const dutyRatePercent = this.parseDutyRate(dutyInfo.generalDutyRate);
    const dutyAmount = params.value * dutyRatePercent;

    return {
      dutyAmount: Math.round(dutyAmount * 100) / 100,
      dutyRate: dutyInfo.generalDutyRate,
      totalValue: params.value,
    };
  }

  private parseDutyRate(dutyRate: string): number {
    if (dutyRate === 'Free' || dutyRate === '0%') {
      return 0;
    }

    const percentMatch = dutyRate.match(/(\d+(?:\.\d+)?)%/);
    if (percentMatch) {
      return parseFloat(percentMatch[1]) / 100;
    }

    return 0;
  }
}

export const hsCodeService = new HSCodeService();
