import { ClaudeAIService } from '../../lib/claude-ai-service';

export interface CarrierProfile {
  id: string;
  companyName: string;
  mcNumber: string;
  submissionDate: Date;
  completionDate?: Date;
  submissionTime: number; // Time to complete in seconds
  dataQuality: {
    hasValidPhone: boolean;
    hasValidEmail: boolean;
    hasCompleteAddress: boolean;
    hasValidDocuments: boolean;
    documentCompleteness: number; // 0-100
  };
  contactResponse: {
    responseTime: number; // Hours to respond
    communicationQuality: 'poor' | 'fair' | 'good' | 'excellent';
    followUpResponsiveness: number; // 0-100
  };
  businessActivity: {
    yearsInBusiness: number;
    employeeCount: number;
    fleetSize: number;
    serviceAreas: string[];
    businessHours: string;
  };
  submissionPatterns: {
    submissionSpeed: string;
    dataConsistency: number; // 0-100
    documentQuality: string;
    informationCompleteness: number; // 0-100
  };
}

export interface BehaviorAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suspiciousPatterns: string[];
  recommendations: string[];
  confidence: number;
  analysis: {
    submissionSpeed: string;
    dataQuality: string;
    consistency: string;
    responseTime: string;
    documentCompleteness: string;
    businessLegitimacy: string;
  };
  riskScore: number; // 0-100
}

export interface BehaviorMetrics {
  averageSubmissionTime: number;
  dataQualityTrend: number;
  consistencyScore: number;
  responseTimeAverage: number;
  documentCompletenessAverage: number;
}

export class CarrierBehaviorAnalyzer {
  private claudeAI: ClaudeAIService;

  constructor() {
    // Use existing Claude AI - NO NEW COSTS
    this.claudeAI = new ClaudeAIService();
  }

  // FREE: Analyze existing carrier data
  async analyzeSubmissionPatterns(
    carrier: CarrierProfile
  ): Promise<BehaviorAnalysis> {
    try {
      // FREE: Use Claude AI to analyze behavior patterns
      const patterns = await this.claudeAI.analyzeBehavior({
        submissionSpeed: this.calculateSubmissionSpeed(carrier),
        dataQuality: this.assessDataQuality(carrier),
        consistency: this.checkDataConsistency(carrier),
        responseTime: this.measureResponseTime(carrier),
        documentCompleteness: this.assessDocumentCompleteness(carrier),
        businessActivity: this.assessBusinessActivity(carrier),
      });

      return {
        riskLevel: this.calculateBehaviorRisk(patterns),
        suspiciousPatterns: this.identifySuspiciousPatterns(patterns),
        recommendations: this.generateBehaviorRecommendations(patterns),
        confidence: this.calculateConfidence(patterns),
        analysis: {
          submissionSpeed: patterns.submissionSpeed || 'Unknown',
          dataQuality: patterns.dataQuality || 'Unknown',
          consistency: patterns.consistency || 'Unknown',
          responseTime: patterns.responseTime || 'Unknown',
          documentCompleteness: patterns.documentCompleteness || 'Unknown',
          businessLegitimacy: patterns.businessLegitimacy || 'Unknown',
        },
        riskScore: this.calculateRiskScore(patterns),
      };
    } catch (error) {
      console.error('Behavior analysis error:', error);
      return this.getDefaultBehaviorAnalysis();
    }
  }

  async analyzeMultipleCarriers(carriers: CarrierProfile[]): Promise<{
    individualAnalyses: BehaviorAnalysis[];
    aggregateMetrics: BehaviorMetrics;
    riskDistribution: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  }> {
    try {
      const individualAnalyses = await Promise.all(
        carriers.map((carrier) => this.analyzeSubmissionPatterns(carrier))
      );

      const aggregateMetrics = this.calculateAggregateMetrics(carriers);
      const riskDistribution =
        this.calculateRiskDistribution(individualAnalyses);

      return {
        individualAnalyses,
        aggregateMetrics,
        riskDistribution,
      };
    } catch (error) {
      console.error('Multiple carrier analysis error:', error);
      return {
        individualAnalyses: [],
        aggregateMetrics: this.getDefaultMetrics(),
        riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      };
    }
  }

  async detectAnomalies(carriers: CarrierProfile[]): Promise<{
    anomalies: CarrierProfile[];
    anomalyTypes: string[];
    recommendations: string[];
  }> {
    try {
      // FREE: Use Claude AI to detect anomalies
      const anomalyAnalysis = await this.claudeAI.detectAnomalies(
        {
          carriers: carriers.map((carrier) => ({
            id: carrier.id,
            companyName: carrier.companyName,
            submissionTime: carrier.submissionTime,
            dataQuality: carrier.dataQuality,
            businessActivity: carrier.businessActivity,
          })),
        },
        `
        Analyze these carriers for behavioral anomalies:

        Look for:
        1. Unusually fast submissions (potential automation)
        2. Poor data quality patterns
        3. Inconsistent business information
        4. Suspicious response patterns
        5. Document quality issues

        Return JSON with:
        - anomalies: array of carrier IDs with anomalies
        - anomalyTypes: array of anomaly types found
        - recommendations: array of next steps
      `
      );

      const result = JSON.parse(anomalyAnalysis);

      const anomalies = carriers.filter((carrier) =>
        result.anomalies.includes(carrier.id)
      );

      return {
        anomalies,
        anomalyTypes: result.anomalyTypes || [],
        recommendations: result.recommendations || [],
      };
    } catch (error) {
      console.error('Anomaly detection error:', error);
      return {
        anomalies: [],
        anomalyTypes: ['Analysis failed'],
        recommendations: ['Manual review required'],
      };
    }
  }

  // Helper methods for behavior analysis
  private calculateSubmissionSpeed(carrier: CarrierProfile): string {
    const timeToComplete = carrier.submissionTime;

    if (timeToComplete < 300) return 'Suspiciously fast - possible automation';
    if (timeToComplete < 900) return 'Fast but reasonable';
    if (timeToComplete < 1800) return 'Normal submission speed';
    if (timeToComplete < 3600) return 'Slow submission';
    return 'Very slow submission';
  }

  private assessDataQuality(carrier: CarrierProfile): string {
    const qualityIndicators = [
      carrier.dataQuality.hasValidPhone,
      carrier.dataQuality.hasValidEmail,
      carrier.dataQuality.hasCompleteAddress,
      carrier.dataQuality.hasValidDocuments,
    ];

    const qualityScore =
      qualityIndicators.filter(Boolean).length / qualityIndicators.length;

    if (qualityScore < 0.5) return 'Poor data quality - potential fraud risk';
    if (qualityScore < 0.8) return 'Moderate data quality';
    return 'High data quality';
  }

  private checkDataConsistency(carrier: CarrierProfile): string {
    // This would check for consistency across different data points
    // For now, return a placeholder
    return 'Consistency check not implemented';
  }

  private measureResponseTime(carrier: CarrierProfile): string {
    if (!carrier.contactResponse.responseTime) return 'No response time data';

    const responseTime = carrier.contactResponse.responseTime;

    if (responseTime < 2) return 'Very responsive';
    if (responseTime < 24) return 'Responsive';
    if (responseTime < 72) return 'Moderate response time';
    return 'Slow response time';
  }

  private assessDocumentCompleteness(carrier: CarrierProfile): string {
    const completeness = carrier.dataQuality.documentCompleteness;

    if (completeness >= 90) return 'Excellent document completeness';
    if (completeness >= 75) return 'Good document completeness';
    if (completeness >= 60) return 'Fair document completeness';
    return 'Poor document completeness';
  }

  private assessBusinessActivity(carrier: CarrierProfile): string {
    const activity = carrier.businessActivity;

    if (activity.yearsInBusiness < 1) return 'New business - higher risk';
    if (activity.employeeCount < 5) return 'Small business - moderate risk';
    if (activity.fleetSize < 3) return 'Small fleet - moderate risk';

    return 'Established business - lower risk';
  }

  private calculateBehaviorRisk(
    patterns: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    // This would use the patterns from Claude AI to calculate risk
    // For now, return a placeholder
    return 'medium';
  }

  private identifySuspiciousPatterns(patterns: any): string[] {
    const suspiciousPatterns = [];

    if (patterns.submissionSpeed?.includes('Suspiciously fast')) {
      suspiciousPatterns.push('Unusually fast submission');
    }

    if (patterns.dataQuality?.includes('Poor')) {
      suspiciousPatterns.push('Poor data quality');
    }

    if (patterns.consistency?.includes('Inconsistent')) {
      suspiciousPatterns.push('Data inconsistency');
    }

    if (patterns.responseTime?.includes('Slow')) {
      suspiciousPatterns.push('Slow response time');
    }

    if (patterns.documentCompleteness?.includes('Poor')) {
      suspiciousPatterns.push('Incomplete documentation');
    }

    return suspiciousPatterns;
  }

  private generateBehaviorRecommendations(patterns: any): string[] {
    const recommendations = [];

    if (patterns.submissionSpeed?.includes('Suspiciously fast')) {
      recommendations.push('Investigate submission automation');
      recommendations.push('Request additional verification');
    }

    if (patterns.dataQuality?.includes('Poor')) {
      recommendations.push('Request better quality documents');
      recommendations.push('Verify information accuracy');
    }

    if (patterns.consistency?.includes('Inconsistent')) {
      recommendations.push('Cross-reference all information');
      recommendations.push('Request clarification on discrepancies');
    }

    if (patterns.responseTime?.includes('Slow')) {
      recommendations.push('Monitor communication responsiveness');
      recommendations.push('Set response time expectations');
    }

    if (patterns.documentCompleteness?.includes('Poor')) {
      recommendations.push('Request missing documents');
      recommendations.push('Set document completion deadlines');
    }

    if (recommendations.length === 0) {
      recommendations.push('No immediate concerns - continue monitoring');
    }

    return recommendations;
  }

  private calculateConfidence(patterns: any): number {
    // This would calculate confidence based on data quality and analysis
    // For now, return a placeholder
    return 75;
  }

  private calculateRiskScore(patterns: any): number {
    // This would calculate a numerical risk score
    // For now, return a placeholder
    return 50;
  }

  private calculateAggregateMetrics(
    carriers: CarrierProfile[]
  ): BehaviorMetrics {
    if (carriers.length === 0) return this.getDefaultMetrics();

    const submissionTimes = carriers.map((c) => c.submissionTime);
    const dataQualityScores = carriers.map(
      (c) => c.dataQuality.documentCompleteness
    );
    const responseTimes = carriers
      .map((c) => c.contactResponse.responseTime)
      .filter(Boolean);

    return {
      averageSubmissionTime:
        submissionTimes.reduce((sum, time) => sum + time, 0) /
        submissionTimes.length,
      dataQualityTrend:
        dataQualityScores.reduce((sum, score) => sum + score, 0) /
        dataQualityScores.length,
      consistencyScore: 75, // Placeholder
      responseTimeAverage:
        responseTimes.length > 0
          ? responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length
          : 0,
      documentCompletenessAverage:
        dataQualityScores.reduce((sum, score) => sum + score, 0) /
        dataQualityScores.length,
    };
  }

  private calculateRiskDistribution(analyses: BehaviorAnalysis[]): {
    low: number;
    medium: number;
    high: number;
    critical: number;
  } {
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };

    analyses.forEach((analysis) => {
      distribution[analysis.riskLevel]++;
    });

    return distribution;
  }

  // Default results for error handling
  private getDefaultBehaviorAnalysis(): BehaviorAnalysis {
    return {
      riskLevel: 'medium',
      suspiciousPatterns: ['Analysis failed'],
      recommendations: ['Manual review required'],
      confidence: 0,
      analysis: {
        submissionSpeed: 'Unknown',
        dataQuality: 'Unknown',
        consistency: 'Unknown',
        responseTime: 'Unknown',
        documentCompleteness: 'Unknown',
        businessLegitimacy: 'Unknown',
      },
      riskScore: 50,
    };
  }

  private getDefaultMetrics(): BehaviorMetrics {
    return {
      averageSubmissionTime: 0,
      dataQualityTrend: 0,
      consistencyScore: 0,
      responseTimeAverage: 0,
      documentCompletenessAverage: 0,
    };
  }
}

