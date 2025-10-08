// DEPOINTE AI Company Dashboard - Predictive Cash Flow Service
// Transportation-Specific Cash Flow Forecasting for Freight and Logistics Operations

export interface CashFlowForecast {
  date: Date;
  projectedInflow: number;
  projectedOutflow: number;
  netCashFlow: number;
  cumulativeCashPosition: number;
  confidence: number;
  factors: string[];
}

export interface CustomerPaymentPrediction {
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceAmount: number;
  dueDate: Date;
  predictedPaymentDate: Date;
  paymentProbability: number;
  paymentBehaviorScore: number;
  historicalDSO: number; // Days Sales Outstanding
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CarrierPaymentSchedule {
  carrierId: string;
  carrierName: string;
  invoiceId: string;
  amount: number;
  dueDate: Date;
  paymentTerms: string;
  quickPayDiscount?: number;
  factoringOption: boolean;
  recommendedPaymentDate: Date;
}

export interface CashFlowAlert {
  id: string;
  type: 'warning' | 'critical' | 'opportunity';
  severity: number; // 1-10
  date: Date;
  message: string;
  impact: number; // Dollar amount
  recommendations: string[];
  actionRequired: boolean;
}

export interface WorkingCapitalOptimization {
  currentWorkingCapital: number;
  optimalWorkingCapital: number;
  gap: number;
  recommendations: {
    category: string;
    action: string;
    potentialImprovement: number;
    timeframe: string;
  }[];
}

/**
 * DEPOINTE AI Predictive Cash Flow Service
 *
 * Provides AI-powered cash flow forecasting specifically for transportation operations:
 * - 30-90 day cash flow forecasting
 * - Customer payment timing prediction
 * - Carrier payment optimization
 * - Working capital management
 * - Cash flow alerts and warnings
 * - Factoring and quick pay recommendations
 *
 * This service enhances FleetFlow's basic cash flow tracking with advanced
 * predictive analytics and optimization capabilities.
 */
export class DEPOINTEPredictiveCashFlowService {
  private static instance: DEPOINTEPredictiveCashFlowService;

  private constructor() {
    console.info('💰 DEPOINTE AI Predictive Cash Flow Service initialized');
  }

  public static getInstance(): DEPOINTEPredictiveCashFlowService {
    if (!DEPOINTEPredictiveCashFlowService.instance) {
      DEPOINTEPredictiveCashFlowService.instance =
        new DEPOINTEPredictiveCashFlowService();
    }
    return DEPOINTEPredictiveCashFlowService.instance;
  }

  /**
   * Generate 30-90 day cash flow forecast
   */
  async generateCashFlowForecast(
    tenantId: string,
    daysAhead: number = 30
  ): Promise<{
    forecasts: CashFlowForecast[];
    summary: {
      totalProjectedInflow: number;
      totalProjectedOutflow: number;
      netCashFlow: number;
      endingCashPosition: number;
      averageConfidence: number;
    };
    alerts: CashFlowAlert[];
  }> {
    console.info(
      `🔮 Generating ${daysAhead}-day cash flow forecast for tenant ${tenantId}`
    );

    // Get customer payment predictions
    const customerPayments = await this.predictCustomerPayments(
      tenantId,
      daysAhead
    );

    // Get carrier payment schedule
    const carrierPayments = await this.getCarrierPaymentSchedule(
      tenantId,
      daysAhead
    );

    // Generate daily forecasts
    const forecasts: CashFlowForecast[] = [];
    let cumulativeCash = await this.getCurrentCashPosition(tenantId);

    for (let day = 0; day < daysAhead; day++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + day);

      // Calculate projected inflows (customer payments)
      const dailyInflow = this.calculateDailyInflow(
        customerPayments,
        forecastDate
      );

      // Calculate projected outflows (carrier payments, expenses)
      const dailyOutflow = this.calculateDailyOutflow(
        carrierPayments,
        forecastDate
      );

      const netCashFlow = dailyInflow - dailyOutflow;
      cumulativeCash += netCashFlow;

      forecasts.push({
        date: forecastDate,
        projectedInflow: dailyInflow,
        projectedOutflow: dailyOutflow,
        netCashFlow,
        cumulativeCashPosition: cumulativeCash,
        confidence: 0.85, // AI confidence score
        factors: [
          'Historical payment patterns',
          'Seasonal freight trends',
          'Customer payment behavior',
          'Scheduled carrier payments',
        ],
      });
    }

    // Generate cash flow alerts
    const alerts = await this.generateCashFlowAlerts(forecasts);

    // Calculate summary
    const summary = {
      totalProjectedInflow: forecasts.reduce(
        (sum, f) => sum + f.projectedInflow,
        0
      ),
      totalProjectedOutflow: forecasts.reduce(
        (sum, f) => sum + f.projectedOutflow,
        0
      ),
      netCashFlow: forecasts.reduce((sum, f) => sum + f.netCashFlow, 0),
      endingCashPosition:
        forecasts[forecasts.length - 1]?.cumulativeCashPosition || 0,
      averageConfidence:
        forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length,
    };

    console.info(`✅ Cash flow forecast generated: ${forecasts.length} days`);
    return { forecasts, summary, alerts };
  }

  /**
   * Predict customer payment timing using AI
   */
  async predictCustomerPayments(
    tenantId: string,
    daysAhead: number
  ): Promise<CustomerPaymentPrediction[]> {
    console.info(`🎯 Predicting customer payments for next ${daysAhead} days`);

    // Mock customer payment predictions (in production, use ML model trained on historical data)
    const predictions: CustomerPaymentPrediction[] = [
      {
        customerId: 'customer-001',
        customerName: 'ABC Logistics',
        invoiceId: 'INV-2025-001',
        invoiceAmount: 15000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        predictedPaymentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 3 days late
        paymentProbability: 0.92,
        paymentBehaviorScore: 85,
        historicalDSO: 33, // Typically pays in 33 days
        riskLevel: 'low',
      },
      {
        customerId: 'customer-002',
        customerName: 'XYZ Freight',
        invoiceId: 'INV-2025-002',
        invoiceAmount: 8500,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        predictedPaymentDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 11 days late
        paymentProbability: 0.75,
        paymentBehaviorScore: 62,
        historicalDSO: 55, // Typically pays in 55 days
        riskLevel: 'medium',
      },
      {
        customerId: 'customer-003',
        customerName: 'Fast Shipping Co',
        invoiceId: 'INV-2025-003',
        invoiceAmount: 22000,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        predictedPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // On time
        paymentProbability: 0.98,
        paymentBehaviorScore: 95,
        historicalDSO: 28, // Typically pays in 28 days
        riskLevel: 'low',
      },
    ];

    return predictions;
  }

  /**
   * Get optimized carrier payment schedule
   */
  async getCarrierPaymentSchedule(
    tenantId: string,
    daysAhead: number
  ): Promise<CarrierPaymentSchedule[]> {
    console.info(
      `🚛 Generating carrier payment schedule for next ${daysAhead} days`
    );

    // Mock carrier payment schedule (in production, query actual carrier invoices)
    const schedule: CarrierPaymentSchedule[] = [
      {
        carrierId: 'carrier-001',
        carrierName: 'Swift Transport',
        invoiceId: 'CARR-INV-001',
        amount: 5000,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        paymentTerms: 'Net 30',
        quickPayDiscount: 150, // Save $150 with quick pay
        factoringOption: true,
        recommendedPaymentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Pay early for discount
      },
      {
        carrierId: 'carrier-002',
        carrierName: 'Owner Operator LLC',
        invoiceId: 'CARR-INV-002',
        amount: 3200,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        paymentTerms: 'Net 15',
        quickPayDiscount: 0,
        factoringOption: false,
        recommendedPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    return schedule;
  }

  /**
   * Calculate daily inflow from customer payments
   */
  private calculateDailyInflow(
    predictions: CustomerPaymentPrediction[],
    date: Date
  ): number {
    const dateString = date.toDateString();
    return predictions
      .filter((p) => p.predictedPaymentDate.toDateString() === dateString)
      .reduce((sum, p) => sum + p.invoiceAmount * p.paymentProbability, 0);
  }

  /**
   * Calculate daily outflow from carrier payments and expenses
   */
  private calculateDailyOutflow(
    schedule: CarrierPaymentSchedule[],
    date: Date
  ): number {
    const dateString = date.toDateString();
    const carrierPayments = schedule
      .filter((s) => s.recommendedPaymentDate.toDateString() === dateString)
      .reduce((sum, s) => sum + s.amount, 0);

    // Add estimated daily operational expenses
    const dailyOperationalExpenses = 2500; // Fuel, driver expenses, etc.

    return carrierPayments + dailyOperationalExpenses;
  }

  /**
   * Get current cash position
   */
  private async getCurrentCashPosition(tenantId: string): Promise<number> {
    // In production, query actual bank balances and accounts receivable
    return 125000; // Mock current cash position
  }

  /**
   * Generate cash flow alerts
   */
  private async generateCashFlowAlerts(
    forecasts: CashFlowForecast[]
  ): Promise<CashFlowAlert[]> {
    const alerts: CashFlowAlert[] = [];

    // Check for negative cash positions
    forecasts.forEach((forecast, index) => {
      if (forecast.cumulativeCashPosition < 50000) {
        alerts.push({
          id: `alert-${index}`,
          type: 'warning',
          severity: 7,
          date: forecast.date,
          message: `Cash position projected to drop below $50,000 on ${forecast.date.toLocaleDateString()}`,
          impact: 50000 - forecast.cumulativeCashPosition,
          recommendations: [
            'Accelerate customer collections',
            'Consider factoring high-value invoices',
            'Delay non-critical carrier payments',
            'Negotiate extended payment terms with carriers',
          ],
          actionRequired: true,
        });
      }

      if (forecast.cumulativeCashPosition < 25000) {
        alerts.push({
          id: `alert-critical-${index}`,
          type: 'critical',
          severity: 10,
          date: forecast.date,
          message: `CRITICAL: Cash position projected to drop below $25,000 on ${forecast.date.toLocaleDateString()}`,
          impact: 25000 - forecast.cumulativeCashPosition,
          recommendations: [
            'URGENT: Activate line of credit',
            'Factor all outstanding invoices immediately',
            'Contact top customers for early payment',
            'Pause new load bookings until cash improves',
          ],
          actionRequired: true,
        });
      }

      // Identify cash surplus opportunities
      if (forecast.cumulativeCashPosition > 200000) {
        alerts.push({
          id: `alert-opportunity-${index}`,
          type: 'opportunity',
          severity: 3,
          date: forecast.date,
          message: `Cash surplus projected on ${forecast.date.toLocaleDateString()}`,
          impact: forecast.cumulativeCashPosition - 200000,
          recommendations: [
            'Negotiate early payment discounts with carriers',
            'Invest in fuel hedging for cost savings',
            'Consider equipment purchases or upgrades',
            'Build cash reserves for seasonal fluctuations',
          ],
          actionRequired: false,
        });
      }
    });

    return alerts;
  }

  /**
   * Optimize working capital
   */
  async optimizeWorkingCapital(
    tenantId: string
  ): Promise<WorkingCapitalOptimization> {
    console.info(`⚙️ Optimizing working capital for tenant ${tenantId}`);

    // Calculate current working capital metrics
    const currentAR = 450000; // Accounts receivable
    const currentAP = 280000; // Accounts payable
    const currentCash = 125000;
    const currentWorkingCapital = currentCash + currentAR - currentAP;

    // Calculate optimal working capital
    const optimalWorkingCapital = 350000; // Based on industry benchmarks

    const gap = optimalWorkingCapital - currentWorkingCapital;

    const recommendations = [
      {
        category: 'Accounts Receivable',
        action:
          'Reduce DSO from 45 days to 35 days through proactive collections',
        potentialImprovement: 75000,
        timeframe: '60 days',
      },
      {
        category: 'Accounts Payable',
        action:
          'Negotiate extended payment terms with top 10 carriers (Net 30 → Net 45)',
        potentialImprovement: 50000,
        timeframe: '30 days',
      },
      {
        category: 'Cash Management',
        action: 'Implement selective factoring for slow-paying customers',
        potentialImprovement: 35000,
        timeframe: '15 days',
      },
      {
        category: 'Operational Efficiency',
        action:
          'Reduce fuel costs through route optimization and bulk purchasing',
        potentialImprovement: 15000,
        timeframe: '45 days',
      },
    ];

    return {
      currentWorkingCapital,
      optimalWorkingCapital,
      gap,
      recommendations,
    };
  }

  /**
   * Get real-time cash flow health score
   */
  async getCashFlowHealthScore(tenantId: string): Promise<{
    score: number; // 0-100
    rating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    factors: {
      name: string;
      score: number;
      weight: number;
      impact: string;
    }[];
    recommendations: string[];
  }> {
    console.info(
      `📊 Calculating cash flow health score for tenant ${tenantId}`
    );

    // Calculate individual factor scores
    const factors = [
      {
        name: 'Current Cash Position',
        score: 85,
        weight: 0.25,
        impact: 'Strong cash reserves provide operational flexibility',
      },
      {
        name: 'Days Sales Outstanding (DSO)',
        score: 70,
        weight: 0.2,
        impact: 'DSO of 45 days is above industry average of 35 days',
      },
      {
        name: 'Payment Collection Rate',
        score: 92,
        weight: 0.2,
        impact: 'Excellent collection rate with minimal bad debt',
      },
      {
        name: 'Working Capital Ratio',
        score: 78,
        weight: 0.15,
        impact: 'Adequate working capital but room for optimization',
      },
      {
        name: 'Cash Flow Predictability',
        score: 88,
        weight: 0.2,
        impact: 'Consistent cash flow patterns enable accurate forecasting',
      },
    ];

    // Calculate weighted score
    const score = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

    // Determine rating
    let rating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    if (score >= 90) rating = 'excellent';
    else if (score >= 75) rating = 'good';
    else if (score >= 60) rating = 'fair';
    else if (score >= 40) rating = 'poor';
    else rating = 'critical';

    const recommendations = [
      'Implement automated collections reminders to reduce DSO',
      'Offer 2% early payment discount to improve cash velocity',
      'Factor slow-paying customer invoices to accelerate cash flow',
      'Negotiate extended payment terms with reliable carriers',
    ];

    return {
      score: Math.round(score),
      rating,
      factors,
      recommendations,
    };
  }
}

// Export singleton instance
export const depointePredictiveCashFlow =
  DEPOINTEPredictiveCashFlowService.getInstance();

