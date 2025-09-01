/**
 * Advanced AI-Powered FreightQuotingEngine
 * Comprehensive freight pricing with market intelligence and competitive analysis
 */

import { AIDispatcher } from './ai-dispatcher';
import { DataConsortiumService } from './DataConsortiumService';
import { FinancialMarketsService } from './FinancialMarketsService';
import { RFxResponseService } from './RFxResponseService';

export interface QuoteRequest {
  id: string;
  type: 'LTL' | 'FTL' | 'Specialized';
  origin: string;
  destination: string;
  weight?: number;
  pallets?: number;
  freightClass?: number;
  equipmentType?: string;
  serviceType?: string;
  distance: number;
  pickupDate: string;
  deliveryDate: string;
  urgency: 'standard' | 'expedited' | 'emergency';
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  specialRequirements?: string[];
  hazmat?: boolean;
  temperature?: 'ambient' | 'refrigerated' | 'frozen';
}

export interface AIQuoteResponse {
  quoteId: string;
  baseRate: number;
  fuelSurcharge: number;
  accessorialCharges: number;
  totalQuote: number;
  winProbability: number;
  competitiveScore: number;
  marketPosition: 'below' | 'at' | 'above';
  priceConfidence: number;
  recommendedActions: string[];
  marketIntelligence: {
    averageMarketRate: number;
    competitorRates: Array<{
      carrier: string;
      rate: number;
      confidence: number;
    }>;
    demandLevel: 'low' | 'medium' | 'high' | 'critical';
    capacityTightness: number;
    seasonalFactor: number;
  };
  riskFactors: Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  profitMargin: number;
  breakEvenPoint: number;
  timestamp: string;
}

export interface CompetitiveAnalysis {
  marketShare: number;
  competitorCount: number;
  averageWinRate: number;
  priceAdvantage: number;
  serviceAdvantage: number;
  recommendations: string[];
  marketTrends: {
    direction: 'increasing' | 'decreasing' | 'stable';
    magnitude: number;
    timeframe: string;
  };
}

export class FreightQuotingEngine {
  private aiDispatcher: AIDispatcher;
  private dataConsortium: DataConsortiumService;
  private financialMarkets: FinancialMarketsService;
  private rfxService: RFxResponseService;
  private quoteHistory: Map<string, AIQuoteResponse[]> = new Map();
  private competitiveCache: Map<string, CompetitiveAnalysis> = new Map();

  constructor() {
    this.aiDispatcher = new AIDispatcher();
    this.dataConsortium = new DataConsortiumService();
    this.financialMarkets = new FinancialMarketsService();
    this.rfxService = new RFxResponseService();
    
    console.info('🧠 Advanced FreightQuotingEngine initialized');
  }

  /**
   * Generate AI-powered freight quote with market intelligence
   */
  async generateQuote(request: QuoteRequest): Promise<AIQuoteResponse> {
    console.info(`🎯 Generating AI quote for ${request.type} shipment`);
    
    try {
      // Step 1: Gather market intelligence
      const marketData = await this.gatherMarketIntelligence(request);
      
      // Step 2: Analyze competitive landscape
      const competitiveAnalysis = await this.analyzeCompetition(request);
      
      // Step 3: Calculate base pricing with AI optimization
      const basePricing = await this.calculateBasePricing(request, marketData);
      
      // Step 4: Apply dynamic pricing adjustments
      const adjustedPricing = await this.applyDynamicPricing(basePricing, request, marketData);
      
      // Step 5: Calculate win probability
      const winProbability = await this.calculateWinProbability(adjustedPricing, request, competitiveAnalysis);
      
      // Step 6: Generate final quote with recommendations
      const finalQuote = await this.generateFinalQuote(adjustedPricing, winProbability, request, marketData, competitiveAnalysis);
      
      // Step 7: Store quote history for learning
      this.storeQuoteHistory(request.origin + '-' + request.destination, finalQuote);
      
      return finalQuote;
      
    } catch (error) {
      console.error('❌ Quote generation failed:', error);
      return this.generateFallbackQuote(request);
    }
  }

  /**
   * Gather comprehensive market intelligence
   */
  private async gatherMarketIntelligence(request: QuoteRequest) {
    console.info('📊 Gathering market intelligence...');
    
    const [marketIntel, fuelData, consortiumData] = await Promise.all([
      this.rfxService.getMarketIntelligence(request.origin, request.destination, request.equipmentType || 'Dry Van'),
      this.financialMarkets.getMarketData(),
      this.dataConsortium.getMarketIntelligence()
    ]);

    return {
      currentRate: marketIntel.currentRate,
      marketAverage: marketIntel.marketAverage,
      rateRange: marketIntel.rateRange,
      demandLevel: marketIntel.demandLevel,
      capacityTightness: marketIntel.capacityTightness,
      seasonalMultiplier: marketIntel.seasonalMultiplier,
      trendDirection: marketIntel.trendDirection,
      competitorRates: marketIntel.competitorRates,
      fuelPrice: fuelData.fuelPrice.currentPrice,
      fuelTrend: fuelData.fuelPrice.priceChange,
      laneAnalysis: consortiumData.laneAnalysis.find(lane => 
        lane.origin.includes(request.origin.split(',')[0]) && 
        lane.destination.includes(request.destination.split(',')[0])
      ),
      equipmentTrends: consortiumData.equipmentTrends.find(eq => 
        eq.type.toLowerCase().includes(request.equipmentType?.toLowerCase() || 'dry')
      )
    };
  }

  /**
   * Analyze competitive landscape
   */
  private async analyzeCompetition(request: QuoteRequest): Promise<CompetitiveAnalysis> {
    const cacheKey = `${request.origin}-${request.destination}-${request.type}`;
    
    if (this.competitiveCache.has(cacheKey)) {
      return this.competitiveCache.get(cacheKey)!;
    }

    console.info('🎯 Analyzing competitive landscape...');
    
    // Simulate competitive analysis
    const analysis: CompetitiveAnalysis = {
      marketShare: Math.random() * 0.3 + 0.1, // 10-40% market share
      competitorCount: Math.floor(Math.random() * 15) + 5, // 5-20 competitors
      averageWinRate: Math.random() * 0.4 + 0.4, // 40-80% win rate
      priceAdvantage: (Math.random() - 0.5) * 0.2, // -10% to +10%
      serviceAdvantage: Math.random() * 0.3 + 0.7, // 70-100% service score
      recommendations: [
        'Consider competitive pricing strategy',
        'Emphasize service quality differentiation',
        'Monitor competitor rate changes',
        'Leverage customer relationship strength'
      ],
      marketTrends: {
        direction: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any,
        magnitude: Math.random() * 0.15 + 0.05, // 5-20% change
        timeframe: '30 days'
      }
    };

    this.competitiveCache.set(cacheKey, analysis);
    return analysis;
  }

  /**
   * Calculate base pricing with AI optimization
   */
  private async calculateBasePricing(request: QuoteRequest, marketData: any) {
    console.info('💰 Calculating AI-optimized base pricing...');
    
    let baseRate = 0;
    
    // Base rate calculation by shipment type
    switch (request.type) {
      case 'LTL':
        baseRate = this.calculateLTLRate(request, marketData);
        break;
      case 'FTL':
        baseRate = this.calculateFTLRate(request, marketData);
        break;
      case 'Specialized':
        baseRate = this.calculateSpecializedRate(request, marketData);
        break;
    }

    // Apply market adjustments
    const marketAdjustment = marketData.marketAverage / marketData.currentRate;
    baseRate *= marketAdjustment;

    // Apply fuel surcharge
    const fuelSurcharge = baseRate * this.calculateFuelSurchargeRate(request.type, marketData.fuelPrice);

    // Calculate accessorial charges
    const accessorialCharges = this.calculateAccessorialCharges(request);

    return {
      baseRate,
      fuelSurcharge,
      accessorialCharges,
      subtotal: baseRate + fuelSurcharge + accessorialCharges
    };
  }

  /**
   * Apply dynamic pricing adjustments
   */
  private async applyDynamicPricing(basePricing: any, request: QuoteRequest, marketData: any) {
    console.info('⚡ Applying dynamic pricing adjustments...');
    
    let adjustedRate = basePricing.subtotal;
    
    // Demand-based pricing
    const demandMultiplier = this.getDemandMultiplier(marketData.demandLevel);
    adjustedRate *= demandMultiplier;
    
    // Capacity tightness adjustment
    const capacityMultiplier = 1 + (marketData.capacityTightness / 100) * 0.3;
    adjustedRate *= capacityMultiplier;
    
    // Seasonal adjustment
    adjustedRate *= marketData.seasonalMultiplier;
    
    // Urgency premium
    const urgencyMultiplier = this.getUrgencyMultiplier(request.urgency);
    adjustedRate *= urgencyMultiplier;
    
    // Customer tier discount
    const customerDiscount = this.getCustomerTierDiscount(request.customerTier);
    adjustedRate *= (1 - customerDiscount);
    
    // Lane profitability adjustment
    const laneMultiplier = this.getLaneMultiplier(request.origin, request.destination);
    adjustedRate *= laneMultiplier;

    return {
      ...basePricing,
      adjustedRate,
      adjustments: {
        demandMultiplier,
        capacityMultiplier,
        seasonalMultiplier: marketData.seasonalMultiplier,
        urgencyMultiplier,
        customerDiscount,
        laneMultiplier
      }
    };
  }

  /**
   * Calculate win probability using AI analysis
   */
  private async calculateWinProbability(pricing: any, request: QuoteRequest, competitive: CompetitiveAnalysis): Promise<number> {
    console.info('🎲 Calculating win probability...');
    
    // Use AI dispatcher for intelligent probability calculation
    const aiAnalysis = await this.aiDispatcher.optimizeRates(
      {
        rate: pricing.adjustedRate,
        type: request.type,
        distance: request.distance,
        urgency: request.urgency,
        customerTier: request.customerTier
      },
      {
        averageRates: [pricing.adjustedRate * 0.95, pricing.adjustedRate * 1.05],
        competitorRates: competitive.marketShare > 0.2 ? [pricing.adjustedRate * 0.98] : [pricing.adjustedRate * 1.02],
        acceptanceRates: [competitive.averageWinRate],
        marketPosition: competitive.priceAdvantage
      }
    );

    return Math.min(Math.max(aiAnalysis.acceptanceProbability || 0.65, 0.1), 0.95);
  }

  /**
   * Generate final quote with all intelligence
   */
  private async generateFinalQuote(
    pricing: any, 
    winProbability: number, 
    request: QuoteRequest, 
    marketData: any, 
    competitive: CompetitiveAnalysis
  ): Promise<AIQuoteResponse> {
    
    const totalQuote = pricing.adjustedRate;
    const profitMargin = (totalQuote - (totalQuote * 0.85)) / totalQuote; // Assume 85% cost ratio
    
    return {
      quoteId: `AIQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      baseRate: pricing.baseRate,
      fuelSurcharge: pricing.fuelSurcharge,
      accessorialCharges: pricing.accessorialCharges,
      totalQuote,
      winProbability,
      competitiveScore: this.calculateCompetitiveScore(pricing.adjustedRate, marketData.marketAverage),
      marketPosition: this.getMarketPosition(pricing.adjustedRate, marketData.marketAverage),
      priceConfidence: this.calculatePriceConfidence(marketData, competitive),
      recommendedActions: this.generateRecommendations(pricing, winProbability, competitive),
      marketIntelligence: {
        averageMarketRate: marketData.marketAverage,
        competitorRates: marketData.competitorRates,
        demandLevel: marketData.demandLevel,
        capacityTightness: marketData.capacityTightness,
        seasonalFactor: marketData.seasonalMultiplier
      },
      riskFactors: this.identifyRiskFactors(request, marketData),
      profitMargin,
      breakEvenPoint: totalQuote * 0.85,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Helper methods for calculations
   */
  private calculateLTLRate(request: QuoteRequest, marketData: any): number {
    const baseRate = 250;
    const weightRate = (request.weight || 1000) * 0.85;
    const palletRate = (request.pallets || 2) * 45;
    const classMultiplier = this.getFreightClassMultiplier(request.freightClass || 100);
    
    return (baseRate + weightRate + palletRate) * classMultiplier;
  }

  private calculateFTLRate(request: QuoteRequest, marketData: any): number {
    const baseRate = 1800;
    const mileageRate = request.distance * 2.85;
    const equipmentMultiplier = this.getEquipmentMultiplier(request.equipmentType || 'Dry Van');
    
    return (baseRate + mileageRate) * equipmentMultiplier;
  }

  private calculateSpecializedRate(request: QuoteRequest, marketData: any): number {
    const baseRate = 2500;
    const mileageRate = request.distance * 3.25;
    const serviceMultiplier = this.getServiceMultiplier(request.serviceType || 'Hazmat');
    
    return (baseRate + mileageRate) * serviceMultiplier;
  }

  private calculateFuelSurchargeRate(type: string, fuelPrice: number): number {
    const baseRates = { LTL: 0.18, FTL: 0.22, Specialized: 0.25 };
    const fuelAdjustment = (fuelPrice - 3.50) * 0.02; // Adjust for fuel price variance
    return (baseRates[type as keyof typeof baseRates] || 0.20) + fuelAdjustment;
  }

  private calculateAccessorialCharges(request: QuoteRequest): number {
    let charges = 0;
    
    // Standard accessorial charges
    if (request.specialRequirements?.includes('liftgate')) charges += 75;
    if (request.specialRequirements?.includes('residential')) charges += 120;
    if (request.specialRequirements?.includes('inside_delivery')) charges += 150;
    if (request.specialRequirements?.includes('lumper')) charges += 200; // Loading/unloading labor
    if (request.specialRequirements?.includes('detention')) charges += 75; // Per hour after 2 hours free
    if (request.specialRequirements?.includes('tonu')) charges += 250; // Truck Ordered Not Used
    if (request.specialRequirements?.includes('layover')) charges += 150; // Driver layover
    if (request.specialRequirements?.includes('redelivery')) charges += 100; // Redelivery attempt
    if (request.specialRequirements?.includes('sort_segregate')) charges += 125; // Sort and segregate
    if (request.specialRequirements?.includes('appointment')) charges += 50; // Appointment delivery
    if (request.specialRequirements?.includes('blind_shipment')) charges += 75; // Blind shipment
    if (request.specialRequirements?.includes('cross_dock')) charges += 100; // Cross dock
    if (request.specialRequirements?.includes('freeze_protection')) charges += 200; // Freeze protection
    if (request.specialRequirements?.includes('heated_service')) charges += 175; // Heated service
    if (request.specialRequirements?.includes('oversize_permit')) charges += 300; // Oversize permit
    if (request.specialRequirements?.includes('escort_vehicle')) charges += 500; // Escort vehicle
    
    // Special commodity charges
    if (request.hazmat) charges += 200;
    if (request.temperature === 'refrigerated') charges += 300;
    if (request.temperature === 'frozen') charges += 450;
    
    return charges;
  }

  private getDemandMultiplier(demandLevel: string): number {
    const multipliers = { low: 0.95, medium: 1.0, high: 1.08, critical: 1.15 };
    return multipliers[demandLevel as keyof typeof multipliers] || 1.0;
  }

  private getUrgencyMultiplier(urgency: string): number {
    const multipliers = { standard: 1.0, expedited: 1.25, emergency: 1.5 };
    return multipliers[urgency as keyof typeof multipliers] || 1.0;
  }

  private getCustomerTierDiscount(tier: string): number {
    const discounts = { bronze: 0, silver: 0.03, gold: 0.05, platinum: 0.08 };
    return discounts[tier as keyof typeof discounts] || 0;
  }

  private getLaneMultiplier(origin: string, destination: string): number {
    // Simulate lane profitability analysis
    const hash = (origin + destination).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return 0.95 + (hash % 10) * 0.01; // 0.95 to 1.04 multiplier
  }

  private getFreightClassMultiplier(freightClass: number): number {
    const multipliers: { [key: number]: number } = {
      50: 1.0, 55: 1.1, 60: 1.2, 65: 1.3, 70: 1.4, 77.5: 1.5,
      85: 1.6, 92.5: 1.7, 100: 1.8, 110: 1.9, 125: 2.0, 150: 2.2,
      175: 2.4, 200: 2.6, 250: 2.8, 300: 3.0, 400: 3.5, 500: 4.0
    };
    return multipliers[freightClass] || 1.8;
  }

  private getEquipmentMultiplier(equipmentType: string): number {
    const multipliers: { [key: string]: number } = {
      'Dry Van': 1.0, 'Reefer': 1.25, 'Flatbed': 1.15, 'Step Deck': 1.35,
      'Lowboy': 1.5, 'Tanker': 1.4, 'Auto Carrier': 1.3, 'Conestoga': 1.2
    };
    return multipliers[equipmentType] || 1.0;
  }

  private getServiceMultiplier(serviceType: string): number {
    const multipliers: { [key: string]: number } = {
      'Hazmat': 1.3, 'Refrigerated': 1.45, 'Oversized': 1.8, 'Team Drivers': 1.6,
      'Flatbed': 1.2, 'White Glove': 1.9, 'Expedited': 1.7
    };
    return multipliers[serviceType] || 1.3;
  }

  private calculateCompetitiveScore(ourRate: number, marketAverage: number): number {
    const ratio = ourRate / marketAverage;
    return Math.max(0, Math.min(100, (2 - ratio) * 50));
  }

  private getMarketPosition(ourRate: number, marketAverage: number): 'below' | 'at' | 'above' {
    const ratio = ourRate / marketAverage;
    if (ratio < 0.95) return 'below';
    if (ratio > 1.05) return 'above';
    return 'at';
  }

  private calculatePriceConfidence(marketData: any, competitive: CompetitiveAnalysis): number {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on market data quality
    if (marketData.competitorRates.length > 3) confidence += 0.1;
    if (marketData.demandLevel !== 'medium') confidence += 0.05;
    
    // Adjust based on competitive analysis
    if (competitive.marketShare > 0.2) confidence += 0.1;
    if (competitive.averageWinRate > 0.6) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  private generateRecommendations(pricing: any, winProbability: number, competitive: CompetitiveAnalysis): string[] {
    const recommendations: string[] = [];
    
    if (winProbability < 0.5) {
      recommendations.push('Consider reducing rate by 5-10% to improve win probability');
    }
    
    if (winProbability > 0.8) {
      recommendations.push('Rate may be too low - consider increasing by 3-5%');
    }
    
    if (competitive.priceAdvantage < -0.05) {
      recommendations.push('Emphasize service quality and reliability in proposal');
    }
    
    if (competitive.marketTrends.direction === 'increasing') {
      recommendations.push('Market rates trending up - consider premium pricing');
    }
    
    recommendations.push('Monitor competitor responses and adjust accordingly');
    
    return recommendations;
  }

  private identifyRiskFactors(request: QuoteRequest, marketData: any) {
    const risks = [];
    
    if (marketData.demandLevel === 'critical') {
      risks.push({
        factor: 'High demand market',
        impact: 'high' as const,
        mitigation: 'Secure capacity early and communicate potential delays'
      });
    }
    
    if (marketData.capacityTightness > 80) {
      risks.push({
        factor: 'Limited capacity availability',
        impact: 'medium' as const,
        mitigation: 'Consider alternative equipment types or flexible scheduling'
      });
    }
    
    if (request.urgency === 'emergency') {
      risks.push({
        factor: 'Emergency shipment timing',
        impact: 'high' as const,
        mitigation: 'Ensure dedicated dispatch and tracking resources'
      });
    }
    
    return risks;
  }

  private storeQuoteHistory(lane: string, quote: AIQuoteResponse) {
    if (!this.quoteHistory.has(lane)) {
      this.quoteHistory.set(lane, []);
    }
    
    const history = this.quoteHistory.get(lane)!;
    history.push(quote);
    
    // Keep only last 50 quotes per lane
    if (history.length > 50) {
      history.shift();
    }
  }

  private generateFallbackQuote(request: QuoteRequest): AIQuoteResponse {
    const baseRate = request.type === 'LTL' ? 450 : request.type === 'FTL' ? 2200 : 2800;
    const fuelSurcharge = baseRate * 0.18;
    const totalQuote = baseRate + fuelSurcharge;
    
    return {
      quoteId: `FALLBACK-${Date.now()}`,
      baseRate,
      fuelSurcharge,
      accessorialCharges: 0,
      totalQuote,
      winProbability: 0.65,
      competitiveScore: 75,
      marketPosition: 'at',
      priceConfidence: 0.6,
      recommendedActions: ['Fallback quote - limited market data available'],
      marketIntelligence: {
        averageMarketRate: baseRate,
        competitorRates: [],
        demandLevel: 'medium',
        capacityTightness: 50,
        seasonalFactor: 1.0
      },
      riskFactors: [],
      profitMargin: 0.15,
      breakEvenPoint: totalQuote * 0.85,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get quote history for analytics
   */
  getQuoteHistory(lane?: string): AIQuoteResponse[] {
    if (lane) {
      return this.quoteHistory.get(lane) || [];
    }
    
    return Array.from(this.quoteHistory.values()).flat();
  }

  /**
   * Get competitive analysis for a lane
   */
  async getCompetitiveAnalysis(origin: string, destination: string, type: string): Promise<CompetitiveAnalysis> {
    const mockRequest = { origin, destination, type } as QuoteRequest;
    return this.analyzeCompetition(mockRequest);
  }
}

// Export singleton instance
export const freightQuotingEngine = new FreightQuotingEngine(); 