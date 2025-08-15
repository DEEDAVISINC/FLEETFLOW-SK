import { ClaudeAIService } from '../../lib/claude-ai-service';
import { AddressValidationService } from './address-validation-service';
import { FMCSAService } from './fmcsa';

export interface AddressRisk {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  flags: string[];
  details: {
    isVirtualOffice: boolean;
    isResidential: boolean;
    hasBusinessHours: boolean;
    locationType: string;
  };
}

export interface LegitimacyScore {
  legitimacyScore: number; // 0-100
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
  businessType: string;
  registrationStatus: string;
}

export interface FraudRiskAssessment {
  overallRisk: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  primaryRiskFactors: string[];
  recommendations: string[];
  confidence: number;
  breakdown: {
    addressRisk: number;
    documentRisk: number;
    behaviorRisk: number;
    fmcsaRisk: number;
    businessRisk: number;
  };
}

export interface EnhancedCarrierScore {
  combinedScore: number; // 0-100
  riskAdjustedScore: number; // 0-100
  recommendation: 'approve' | 'review' | 'reject';
  confidence: number;
  performanceScore: number;
  fraudRisk: number;
  originalFactors: any[];
}

export class FraudGuardService {
  private claudeAI: ClaudeAIService;
  private fmcsaService: FMCSAService;
  private addressValidationService: AddressValidationService;

  constructor() {
    // Use existing services - NO NEW COSTS
    this.claudeAI = new ClaudeAIService();
    this.fmcsaService = new FMCSAService();
    this.addressValidationService = new AddressValidationService();
  }

  // FREE Fraud Detection Methods
  async detectVirtualAddress(address: string): Promise<AddressRisk> {
    try {
      // Use existing Google Maps API (already paid for)
      const validationResult =
        await this.addressValidationService.validateBusinessAddress(address);

      return {
        riskLevel: validationResult.riskLevel,
        confidence: validationResult.confidence || 0,
        flags: validationResult.riskFactors,
        details: {
          isVirtualOffice:
            validationResult.riskFactors.includes('Virtual Office'),
          isResidential: validationResult.riskFactors.includes(
            'Residential Address'
          ),
          hasBusinessHours: validationResult.businessType !== 'unknown',
          locationType:
            validationResult.locationDetails.types?.[0] || 'unknown',
        },
      };
    } catch (error) {
      console.error('Address validation error:', error);
      return {
        riskLevel: 'medium',
        confidence: 0,
        flags: ['Address validation failed'],
        details: {
          isVirtualOffice: false,
          isResidential: false,
          hasBusinessHours: false,
          locationType: 'unknown',
        },
      };
    }
  }

  async validateBusinessLegitimacy(carrierData: any): Promise<LegitimacyScore> {
    try {
      // Use existing Claude AI (already integrated)
      const analysis = await this.claudeAI.analyzeBusinessData({
        companyName: carrierData.companyName,
        address: carrierData.address,
        phone: carrierData.phone,
        email: carrierData.email,
        mcNumber: carrierData.mcNumber,
      });

      return {
        legitimacyScore: analysis.score || 75,
        riskFactors: analysis.riskFactors || [],
        recommendations: analysis.recommendations || [],
        confidence: analysis.confidence || 80,
        businessType: analysis.businessType || 'transportation',
        registrationStatus: analysis.registrationStatus || 'unknown',
      };
    } catch (error) {
      console.error('Business legitimacy analysis error:', error);
      return {
        legitimacyScore: 50,
        riskFactors: ['Analysis failed'],
        recommendations: ['Manual review required'],
        confidence: 0,
        businessType: 'unknown',
        registrationStatus: 'unknown',
      };
    }
  }

  async assessFraudRisk(carrierData: any): Promise<FraudRiskAssessment> {
    try {
      const [addressRisk, businessRisk, fmcsaRisk] = await Promise.all([
        this.detectVirtualAddress(carrierData.address),
        this.validateBusinessLegitimacy(carrierData),
        this.getFMCSARisk(carrierData.mcNumber),
      ]);

      // Calculate composite risk score
      const overallRisk = this.calculateCompositeRisk({
        addressRisk: this.convertRiskToScore(addressRisk.riskLevel),
        businessRisk: 100 - businessRisk.legitimacyScore,
        fmcsaRisk: fmcsaRisk,
      });

      return {
        overallRisk,
        riskLevel: this.convertScoreToRiskLevel(overallRisk),
        primaryRiskFactors: this.getPrimaryRiskFactors(
          addressRisk,
          businessRisk,
          fmcsaRisk
        ),
        recommendations: this.generateRecommendations(overallRisk),
        confidence: this.calculateConfidence([
          addressRisk.confidence,
          businessRisk.confidence,
        ]),
        breakdown: {
          addressRisk: this.convertRiskToScore(addressRisk.riskLevel),
          documentRisk: 50, // Placeholder - will be enhanced
          behaviorRisk: 50, // Placeholder - will be enhanced
          fmcsaRisk,
          businessRisk: 100 - businessRisk.legitimacyScore,
        },
      };
    } catch (error) {
      console.error('Fraud risk assessment error:', error);
      return {
        overallRisk: 75,
        riskLevel: 'high',
        primaryRiskFactors: ['Assessment failed'],
        recommendations: ['Manual review required'],
        confidence: 0,
        breakdown: {
          addressRisk: 75,
          documentRisk: 75,
          behaviorRisk: 75,
          fmcsaRisk: 75,
          businessRisk: 75,
        },
      };
    }
  }

  async getEnhancedScore(carrierData: any): Promise<EnhancedCarrierScore> {
    try {
      // Get fraud risk assessment
      const fraudRisk = await this.assessFraudRisk(carrierData);

      // Placeholder for existing performance score (will integrate with existing system)
      const performanceScore = 75; // This will come from existing 10-factor scoring

      // Calculate combined score
      const combinedScore = this.calculateCombinedScore(
        performanceScore,
        fraudRisk.overallRisk
      );
      const riskAdjustedScore = this.calculateRiskAdjustedScore(
        performanceScore,
        fraudRisk.overallRisk
      );

      return {
        combinedScore,
        riskAdjustedScore,
        recommendation: this.getRecommendation(
          combinedScore,
          fraudRisk.overallRisk
        ),
        confidence: fraudRisk.confidence,
        performanceScore,
        fraudRisk: fraudRisk.overallRisk,
        originalFactors: [], // Will integrate with existing scoring factors
      };
    } catch (error) {
      console.error('Enhanced score calculation error:', error);
      return {
        combinedScore: 50,
        riskAdjustedScore: 50,
        recommendation: 'review',
        confidence: 0,
        performanceScore: 50,
        fraudRisk: 75,
        originalFactors: [],
      };
    }
  }

  // Helper methods
  private analyzeAddressRisk(
    geocodeResult: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (!geocodeResult) return 'medium';

    const flags = this.identifyAddressFlags(geocodeResult);
    const flagCount = flags.length;

    if (flagCount === 0) return 'low';
    if (flagCount === 1) return 'medium';
    if (flagCount === 2) return 'high';
    return 'critical';
  }

  private identifyAddressFlags(geocodeResult: any): string[] {
    const flags = [];

    if (this.isVirtualOffice(geocodeResult)) {
      flags.push('Virtual office address detected');
    }

    if (this.isResidentialAddress(geocodeResult)) {
      flags.push('Residential address for business');
    }

    if (!this.hasBusinessHours(geocodeResult)) {
      flags.push('No business hours available');
    }

    if (geocodeResult.confidence && geocodeResult.confidence < 0.7) {
      flags.push('Low geocoding confidence');
    }

    return flags;
  }

  private isVirtualOffice(geocodeResult: any): boolean {
    if (!geocodeResult || !geocodeResult.types) return false;

    const virtualOfficeTypes = [
      'virtual_office',
      'mailing_address',
      'post_office',
      'mailbox',
    ];

    return virtualOfficeTypes.some((type) =>
      geocodeResult.types.includes(type)
    );
  }

  private isResidentialAddress(geocodeResult: any): boolean {
    if (!geocodeResult || !geocodeResult.types) return false;

    const residentialTypes = ['residential', 'home', 'house', 'apartment'];

    return residentialTypes.some((type) => geocodeResult.types.includes(type));
  }

  private hasBusinessHours(geocodeResult: any): boolean {
    // This would require additional API calls to get business hours
    // For now, return true as placeholder
    return true;
  }

  private async getFMCSARisk(mcNumber: string): Promise<number> {
    try {
      const fmcsaData = await this.fmcsaService.searchByMC(mcNumber);

      if (!fmcsaData.success || !fmcsaData.data) {
        return 75; // Medium risk if no data
      }

      const data = fmcsaData.data;
      let riskScore = 0;

      // Safety rating risk
      if (data.safetyRating === 'UNSATISFACTORY') riskScore += 40;
      else if (data.safetyRating === 'CONDITIONAL') riskScore += 20;
      else if (data.safetyRating === 'SATISFACTORY') riskScore += 0;
      else riskScore += 10; // NOT_RATED

      // Operating status risk
      if (data.operatingStatus === 'OUT_OF_SERVICE') riskScore += 50;
      else if (data.operatingStatus === 'ACTIVE') riskScore += 0;
      else riskScore += 25;

      // Insurance status risk
      if (data.insuranceStatus !== 'ACTIVE') riskScore += 30;

      return Math.min(riskScore, 100);
    } catch (error) {
      console.error('FMCSA risk calculation error:', error);
      return 50; // Medium risk if error
    }
  }

  private calculateCompositeRisk(risks: {
    addressRisk: number;
    businessRisk: number;
    fmcsaRisk: number;
  }): number {
    const weights = { address: 0.3, business: 0.3, fmcsa: 0.4 };

    return Math.round(
      risks.addressRisk * weights.address +
        risks.businessRisk * weights.business +
        risks.fmcsaRisk * weights.fmcsa
    );
  }

  private convertRiskToScore(riskLevel: string): number {
    switch (riskLevel) {
      case 'low':
        return 0;
      case 'medium':
        return 25;
      case 'high':
        return 50;
      case 'critical':
        return 75;
      default:
        return 50;
    }
  }

  private convertScoreToRiskLevel(
    score: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 25) return 'low';
    if (score < 50) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }

  private getPrimaryRiskFactors(
    addressRisk: AddressRisk,
    businessRisk: LegitimacyScore,
    fmcsaRisk: number
  ): string[] {
    const factors = [];

    if (addressRisk.riskLevel !== 'low') {
      factors.push(...addressRisk.flags.slice(0, 2));
    }

    if (businessRisk.legitimacyScore < 70) {
      factors.push(...businessRisk.riskFactors.slice(0, 2));
    }

    if (fmcsaRisk > 50) {
      factors.push('FMCSA compliance issues detected');
    }

    return factors.slice(0, 3); // Return top 3
  }

  private generateRecommendations(riskScore: number): string[] {
    if (riskScore < 25) {
      return ['Low risk - proceed with normal onboarding'];
    } else if (riskScore < 50) {
      return ['Medium risk - additional verification recommended'];
    } else if (riskScore < 75) {
      return [
        'High risk - manual review required',
        'Request additional documentation',
      ];
    } else {
      return [
        'Critical risk - reject application',
        'Flag for fraud investigation',
      ];
    }
  }

  private calculateConfidence(confidences: number[]): number {
    if (confidences.length === 0) return 0;
    return Math.round(
      confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
    );
  }

  private calculateCombinedScore(
    performanceScore: number,
    fraudRisk: number
  ): number {
    // Performance weighted 70%, fraud risk 30%
    return Math.round(performanceScore * 0.7 + (100 - fraudRisk) * 0.3);
  }

  private calculateRiskAdjustedScore(
    performanceScore: number,
    fraudRisk: number
  ): number {
    // Reduce performance score based on fraud risk
    const riskPenalty = fraudRisk * 0.5;
    return Math.max(0, Math.round(performanceScore - riskPenalty));
  }

  private getRecommendation(
    combinedScore: number,
    fraudRisk: number
  ): 'approve' | 'review' | 'reject' {
    if (fraudRisk > 75) return 'reject';
    if (combinedScore > 70 && fraudRisk < 50) return 'approve';
    return 'review';
  }
}
