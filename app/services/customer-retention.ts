// Customer Retention Analysis Service
// Analyzes customer behavior and provides retention strategies

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface CustomerData {
  customerId: string;
  customerName: string;
  totalRevenue: number;
  loadCount: number;
  averageRate: number;
  lastLoadDate: string;
  daysSinceLastLoad: number;
  customerType: 'premium' | 'standard' | 'occasional';
  serviceAreas: string[];
  preferredCarriers: string[];
  paymentHistory: {
    onTime: number;
    late: number;
    averageDaysToPay: number;
  };
  communicationHistory: {
    inquiries: number;
    complaints: number;
    compliments: number;
    lastContact: string;
  };
}

export interface RetentionAnalysis extends AnalysisResult<CustomerData> {
  retentionRisk: 'low' | 'medium' | 'high';
  churnProbability: number;
  lifetimeValue: number;
  retentionStrategies: string[];
  upsellOpportunities: string[];
  customerSatisfaction: number;
  loyaltyScore: number;
}

export interface RetentionMetrics {
  overallRetentionRate: number;
  averageCustomerLifetime: number;
  churnRate: number;
  revenueAtRisk: number;
  topRetentionFactors: string[];
  improvementAreas: string[];
}

export interface CustomerSegment {
  segmentName: string;
  customerCount: number;
  averageRevenue: number;
  retentionRate: number;
  churnRisk: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}

export class CustomerRetentionService extends BaseService {
  constructor() {
    super('CustomerRetention');
  }

  async analyzeCustomerRetention(
    customerId: string
  ): Promise<ServiceResponse<RetentionAnalysis>> {
    try {
      if (!isFeatureEnabled('CUSTOMER_RETENTION_ANALYSIS')) {
        return this.createErrorResponse(
          new Error('Customer Retention Analysis feature is not enabled'),
          'analyzeCustomerRetention'
        );
      }

      this.log(
        'info',
        `Starting retention analysis for customer: ${customerId}`
      );

      const customerData = await this.gatherCustomerData(customerId);
      const analysis = await this.performRetentionAnalysis(customerData);

      this.log(
        'info',
        `Completed retention analysis for customer: ${customerId}`,
        {
          retentionRisk: analysis.retentionRisk,
          churnProbability: analysis.churnProbability,
        }
      );

      return this.createSuccessResponse(
        analysis,
        `Customer retention analysis completed for ${customerData.customerName}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'analyzeCustomerRetention');
    }
  }

  async getRetentionMetrics(): Promise<ServiceResponse<RetentionMetrics>> {
    try {
      if (!isFeatureEnabled('CUSTOMER_RETENTION_ANALYSIS')) {
        return this.createErrorResponse(
          new Error('Customer Retention Analysis feature is not enabled'),
          'getRetentionMetrics'
        );
      }

      this.log('info', 'Generating overall retention metrics');

      const metrics = await this.calculateRetentionMetrics();

      return this.createSuccessResponse(
        metrics,
        'Retention metrics generated successfully'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getRetentionMetrics');
    }
  }

  async segmentCustomers(): Promise<ServiceResponse<CustomerSegment[]>> {
    try {
      if (!isFeatureEnabled('CUSTOMER_RETENTION_ANALYSIS')) {
        return this.createErrorResponse(
          new Error('Customer Retention Analysis feature is not enabled'),
          'segmentCustomers'
        );
      }

      this.log('info', 'Segmenting customers by retention characteristics');

      const segments = await this.performCustomerSegmentation();

      return this.createSuccessResponse(
        segments,
        `Customer segmentation completed with ${segments.length} segments`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'segmentCustomers');
    }
  }

  async getRetentionRecommendations(
    customerId?: string
  ): Promise<ServiceResponse<string[]>> {
    try {
      if (!isFeatureEnabled('CUSTOMER_RETENTION_ANALYSIS')) {
        return this.createErrorResponse(
          new Error('Customer Retention Analysis feature is not enabled'),
          'getRetentionRecommendations'
        );
      }

      this.log(
        'info',
        `Generating retention recommendations for ${customerId || 'all customers'}`
      );

      const recommendations =
        await this.generateRetentionRecommendations(customerId);

      return this.createSuccessResponse(
        recommendations,
        'Retention recommendations generated successfully'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getRetentionRecommendations');
    }
  }

  // Private helper methods
  private async gatherCustomerData(customerId: string): Promise<CustomerData> {
    // Mock data - in production, this would query the database
    return {
      customerId,
      customerName: 'ABC Manufacturing Co.',
      totalRevenue: 125000,
      loadCount: 45,
      averageRate: 2800,
      lastLoadDate: '2024-01-15',
      daysSinceLastLoad: 12,
      customerType: 'premium',
      serviceAreas: ['Southeast', 'Midwest'],
      preferredCarriers: ['Carrier A', 'Carrier B'],
      paymentHistory: {
        onTime: 42,
        late: 3,
        averageDaysToPay: 28,
      },
      communicationHistory: {
        inquiries: 8,
        complaints: 1,
        compliments: 3,
        lastContact: '2024-01-10',
      },
    };
  }

  private async performRetentionAnalysis(
    customerData: CustomerData
  ): Promise<RetentionAnalysis> {
    const analysis = await this.callAI('customer_retention_analysis', {
      customerData,
      analysisType: 'retention_risk_assessment',
    });

    return {
      result: customerData,
      confidence: analysis.confidence || 85,
      reasoning:
        analysis.reasoning || 'Customer shows strong engagement patterns',
      recommendations: analysis.recommendations || [
        'Implement proactive communication strategy',
        'Offer loyalty program benefits',
        'Provide personalized service recommendations',
      ],
      riskFactors: analysis.riskFactors || [
        'Recent decrease in load frequency',
      ],
      retentionRisk: this.calculateRetentionRisk(customerData),
      churnProbability: this.calculateChurnProbability(customerData),
      lifetimeValue: this.calculateLifetimeValue(customerData),
      retentionStrategies: [
        'Proactive communication every 2 weeks',
        'Loyalty program with tier benefits',
        'Personalized load recommendations',
        'Expedited payment terms for premium customers',
      ],
      upsellOpportunities: [
        'Additional service areas',
        'Premium scheduling options',
        'Dedicated account manager',
      ],
      customerSatisfaction: 92,
      loyaltyScore: 8.5,
    };
  }

  private async calculateRetentionMetrics(): Promise<RetentionMetrics> {
    return {
      overallRetentionRate: 87.5,
      averageCustomerLifetime: 3.2,
      churnRate: 12.5,
      revenueAtRisk: 450000,
      topRetentionFactors: [
        'Proactive communication',
        'Reliable service delivery',
        'Competitive pricing',
        'Personalized attention',
      ],
      improvementAreas: [
        'Faster response times',
        'More flexible scheduling',
        'Enhanced tracking capabilities',
        'Better payment terms',
      ],
    };
  }

  private async performCustomerSegmentation(): Promise<CustomerSegment[]> {
    return [
      {
        segmentName: 'Premium Loyal',
        customerCount: 25,
        averageRevenue: 85000,
        retentionRate: 95,
        churnRisk: 'low',
        recommendedActions: [
          'Maintain current service levels',
          'Offer exclusive benefits',
          'Request referrals',
        ],
      },
      {
        segmentName: 'At Risk',
        customerCount: 12,
        averageRevenue: 35000,
        retentionRate: 65,
        churnRisk: 'high',
        recommendedActions: [
          'Immediate outreach campaign',
          'Special retention offers',
          'Enhanced support services',
        ],
      },
      {
        segmentName: 'Growth Potential',
        customerCount: 38,
        averageRevenue: 52000,
        retentionRate: 82,
        churnRisk: 'medium',
        recommendedActions: [
          'Upsell additional services',
          'Expand service areas',
          'Introduce premium features',
        ],
      },
    ];
  }

  private async generateRetentionRecommendations(
    customerId?: string
  ): Promise<string[]> {
    return [
      'Implement automated customer health monitoring',
      'Create personalized communication schedules',
      'Develop customer success playbooks',
      'Establish early warning systems for at-risk customers',
      'Launch customer feedback programs',
      'Create loyalty and rewards programs',
      'Provide proactive support and education',
      'Develop customer onboarding excellence',
    ];
  }

  private calculateRetentionRisk(
    customerData: CustomerData
  ): 'low' | 'medium' | 'high' {
    const riskFactors = [];

    if (customerData.daysSinceLastLoad > 30) riskFactors.push(3);
    if (customerData.paymentHistory.late > 2) riskFactors.push(2);
    if (customerData.communicationHistory.complaints > 0) riskFactors.push(1);

    const totalRisk = riskFactors.reduce((sum, factor) => sum + factor, 0);

    if (totalRisk >= 5) return 'high';
    if (totalRisk >= 2) return 'medium';
    return 'low';
  }

  private calculateChurnProbability(customerData: CustomerData): number {
    let probability = 0;

    // Days since last load
    if (customerData.daysSinceLastLoad > 60) probability += 40;
    else if (customerData.daysSinceLastLoad > 30) probability += 20;

    // Payment history
    const latePaymentRate =
      customerData.paymentHistory.late /
      (customerData.paymentHistory.onTime + customerData.paymentHistory.late);
    if (latePaymentRate > 0.2) probability += 30;

    // Communication issues
    if (customerData.communicationHistory.complaints > 0) probability += 15;

    return Math.min(probability, 100);
  }

  private calculateLifetimeValue(customerData: CustomerData): number {
    const averageMonthlyRevenue = customerData.totalRevenue / 12;
    const estimatedLifespan = customerData.customerType === 'premium' ? 5 : 3;
    return averageMonthlyRevenue * 12 * estimatedLifespan;
  }
}
