/**
 * CONTRACT EXPIRATION FORECASTER
 *
 * Uses USASpending.gov historical data to predict RE-COMPETE opportunities
 * Analyzes contract end dates to forecast when agencies will re-bid contracts
 *
 * TRUE FORECASTING: Predicts opportunities 3-18 months before they're posted
 */

import { createClient } from '@supabase/supabase-js';
import USAspendingService from './USAspendingService';

interface ExpiringContract {
  id: string;
  agency: string;
  title: string;
  description: string;
  currentValue: number;
  startDate: string;
  endDate: string;
  naicsCode?: string;
  currentContractor: string;
  contractType: string;
  setAsideType?: string;
  wosbEligible: boolean;
  daysUntilExpiration: number;
  predictedRecompeteDate: string;
  recompeteProbability: number;
  forecastConfidence: 'high' | 'medium' | 'low';
}

interface ForecastAnalysis {
  expiringContracts: ExpiringContract[];
  totalValue: number;
  wosbOpportunities: number;
  highProbabilityRecompetes: number;
  forecastPeriod: string;
}

export class ContractExpirationForecaster {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Analyze expiring contracts to forecast re-compete opportunities
   */
  async forecastRecompetes(
    monthsAhead: number = 12
  ): Promise<ForecastAnalysis> {
    console.log(
      `🔮 Forecasting contract re-competes for next ${monthsAhead} months...`
    );

    try {
      // Get historical contract data from USASpending.gov
      const historicalContracts =
        await USAspendingService.getHistoricalContracts();

      // Filter for contracts expiring in the forecast window
      const today = new Date();
      const forecastEndDate = new Date();
      forecastEndDate.setMonth(forecastEndDate.getMonth() + monthsAhead);

      const expiringContracts: ExpiringContract[] = [];

      // Analyze each historical contract
      for (const contract of historicalContracts) {
        const endDate = new Date(
          contract.period_of_performance_end ||
            contract.period_of_performance_current_end_date
        );
        const daysUntilExpiration = Math.floor(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if expiring within forecast window
        if (
          endDate >= today &&
          endDate <= forecastEndDate &&
          daysUntilExpiration > 0
        ) {
          // Predict re-compete date (typically 3-6 months before expiration)
          const predictedRecompeteDate = new Date(endDate);
          predictedRecompeteDate.setMonth(
            predictedRecompeteDate.getMonth() - 4
          ); // 4 months before expiration

          // Calculate re-compete probability based on contract type
          const recompeteProbability =
            this.calculateRecompeteProbability(contract);

          // Determine forecast confidence
          const forecastConfidence = this.calculateForecastConfidence(
            daysUntilExpiration,
            contract
          );

          // Check WOSB eligibility
          const wosbEligible =
            contract.set_aside_type?.toLowerCase().includes('wosb') ||
            contract.set_aside_type?.toLowerCase().includes('women') ||
            contract.type_set_aside_description
              ?.toLowerCase()
              .includes('wosb') ||
            contract.total_obligation < 4000000; // Contracts under $4M often have SB set-asides

          expiringContracts.push({
            id: `expiring-${contract.award_id_piid || Math.random().toString(36).substr(2, 9)}`,
            agency: contract.awarding_agency_name || 'Unknown Agency',
            title: contract.award_description || 'Contract Re-compete',
            description: `Re-compete opportunity for: ${contract.award_description}`,
            currentValue: contract.total_obligation || 0,
            startDate: contract.period_of_performance_start_date,
            endDate: contract.period_of_performance_current_end_date,
            naicsCode: contract.naics_code,
            currentContractor: contract.recipient_name || 'Unknown',
            contractType: contract.contract_award_type_desc || 'Unknown',
            setAsideType: contract.type_set_aside_description,
            wosbEligible,
            daysUntilExpiration,
            predictedRecompeteDate: predictedRecompeteDate
              .toISOString()
              .split('T')[0],
            recompeteProbability,
            forecastConfidence,
          });
        }
      }

      // Sort by predicted recompete date
      expiringContracts.sort(
        (a, b) =>
          new Date(a.predictedRecompeteDate).getTime() -
          new Date(b.predictedRecompeteDate).getTime()
      );

      console.log(
        `✅ Found ${expiringContracts.length} expiring contracts in forecast window`
      );

      // Calculate summary metrics
      const totalValue = expiringContracts.reduce(
        (sum, c) => sum + c.currentValue,
        0
      );
      const wosbOpportunities = expiringContracts.filter(
        (c) => c.wosbEligible
      ).length;
      const highProbabilityRecompetes = expiringContracts.filter(
        (c) => c.recompeteProbability > 70
      ).length;

      const analysis: ForecastAnalysis = {
        expiringContracts,
        totalValue,
        wosbOpportunities,
        highProbabilityRecompetes,
        forecastPeriod: `${today.toISOString().split('T')[0]} to ${forecastEndDate.toISOString().split('T')[0]}`,
      };

      // Save forecast to database
      await this.saveForecastToDatabase(expiringContracts);

      return analysis;
    } catch (error: any) {
      console.error('❌ Error forecasting re-competes:', error);
      throw error;
    }
  }

  /**
   * Calculate probability of re-compete based on contract characteristics
   */
  private calculateRecompeteProbability(contract: any): number {
    let probability = 50; // Base probability

    // Increase probability for:
    // - Multi-year contracts (likely to continue)
    if (contract.total_obligation > 500000) probability += 20;

    // - Government favorites (recurring contracts)
    if (contract.contract_award_type_desc?.includes('IDIQ')) probability += 15;

    // - Transportation/logistics contracts
    const transportationNAICS = ['484', '485', '488', '492', '493'];
    if (transportationNAICS.some((n) => contract.naics_code?.startsWith(n))) {
      probability += 10;
    }

    // Decrease probability for:
    // - One-time projects
    if (contract.award_description?.toLowerCase().includes('pilot'))
      probability -= 10;
    if (contract.award_description?.toLowerCase().includes('study'))
      probability -= 15;

    return Math.min(95, Math.max(20, probability)); // Cap between 20-95%
  }

  /**
   * Calculate forecast confidence
   */
  private calculateForecastConfidence(
    daysUntilExpiration: number,
    contract: any
  ): 'high' | 'medium' | 'low' {
    // High confidence: expiring in 3-9 months with good data
    if (
      daysUntilExpiration >= 90 &&
      daysUntilExpiration <= 270 &&
      contract.award_description &&
      contract.naics_code
    ) {
      return 'high';
    }

    // Medium confidence: expiring in 2-12 months
    if (daysUntilExpiration >= 60 && daysUntilExpiration <= 365) {
      return 'medium';
    }

    // Low confidence: very near-term or far future
    return 'low';
  }

  /**
   * Save forecast to database
   */
  private async saveForecastToDatabase(
    contracts: ExpiringContract[]
  ): Promise<void> {
    console.log(
      `💾 Saving ${contracts.length} contract expiration forecasts to database...`
    );

    try {
      const records = contracts.map((c) => ({
        source: 'CONTRACT_EXPIRATION',
        agency: c.agency,
        title: c.title,
        description: c.description,
        naics_code: c.naicsCode,
        estimated_value: c.currentValue,
        predicted_post_date: c.predictedRecompeteDate,
        fiscal_year: new Date(c.endDate).getFullYear().toString(),
        wosb_eligible: c.wosbEligible,
        small_business_set_aside: c.setAsideType,
        forecast_confidence: c.forecastConfidence,
        scanned_at: new Date().toISOString(),
      }));

      const { error } = await this.supabase
        .from('gov_contract_forecasts')
        .insert(records);

      if (error) throw error;

      console.log(
        `✅ Saved ${records.length} expiration forecasts to database`
      );
    } catch (error: any) {
      console.error('❌ Error saving forecasts:', error);
      throw error;
    }
  }

  /**
   * Get forecasts by agency
   */
  async getForecastsByAgency(agency: string): Promise<ExpiringContract[]> {
    const { data, error } = await this.supabase
      .from('gov_contract_forecasts')
      .select('*')
      .eq('agency', agency)
      .eq('source', 'contract_expiration')
      .order('predicted_post_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get WOSB-eligible forecasts
   */
  async getWOSBForecasts(): Promise<ExpiringContract[]> {
    const { data, error } = await this.supabase
      .from('gov_contract_forecasts')
      .select('*')
      .eq('wosb_eligible', true)
      .eq('source', 'contract_expiration')
      .order('predicted_post_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export default ContractExpirationForecaster;
