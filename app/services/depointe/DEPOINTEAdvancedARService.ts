// DEPOINTE AI Company Dashboard - Advanced AR Management Service
// Transportation-Specific Accounts Receivable Optimization for Freight Operations

export interface CustomerPaymentProfile {
  customerId: string;
  customerName: string;
  averageDSO: number; // Days Sales Outstanding
  paymentBehaviorScore: number; // 0-100
  creditLimit: number;
  currentBalance: number;
  overdueAmount: number;
  paymentHistory: {
    onTimePayments: number;
    latePayments: number;
    averageDaysLate: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
}

export interface CollectionsPriority {
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  daysOverdue: number;
  priority: number; // 1-10 (10 = highest priority)
  collectionStrategy: string;
  suggestedActions: string[];
  estimatedRecoveryProbability: number;
  nextContactDate: Date;
  contactMethod: 'email' | 'phone' | 'both';
}

export interface AutomatedDunningCampaign {
  id: string;
  customerId: string;
  invoiceId: string;
  stage:
    | 'reminder'
    | 'first_notice'
    | 'second_notice'
    | 'final_notice'
    | 'collections';
  messageTemplate: string;
  scheduledDate: Date;
  sent: boolean;
  response?: string;
  effectiveness: number;
}

export interface ARAnalytics {
  totalAR: number;
  currentAR: number; // 0-30 days
  aging30: number; // 31-60 days
  aging60: number; // 61-90 days
  aging90Plus: number; // 90+ days
  averageDSO: number;
  collectionEfficiency: number; // Percentage
  badDebtRatio: number;
  trends: {
    dsoTrend: 'improving' | 'stable' | 'declining';
    collectionTrend: 'improving' | 'stable' | 'declining';
    riskTrend: 'improving' | 'stable' | 'declining';
  };
}

/**
 * DEPOINTE AI Advanced AR Management Service
 *
 * Provides AI-powered accounts receivable optimization for transportation operations:
 * - AI-powered collections prioritization
 * - Automated dunning campaigns
 * - Predictive payment analytics
 * - Customer payment behavior analysis
 * - Intelligent customer segmentation
 * - DSO reduction strategies
 *
 * This service enhances FleetFlow's basic AR tracking with advanced
 * intelligence similar to HighRadius but tailored for freight operations.
 */
export class DEPOINTEAdvancedARService {
  private static instance: DEPOINTEAdvancedARService;

  private constructor() {
    console.info('💰 DEPOINTE AI Advanced AR Management Service initialized');
  }

  public static getInstance(): DEPOINTEAdvancedARService {
    if (!DEPOINTEAdvancedARService.instance) {
      DEPOINTEAdvancedARService.instance = new DEPOINTEAdvancedARService();
    }
    return DEPOINTEAdvancedARService.instance;
  }

  /**
   * Prioritize collections using AI
   */
  async prioritizeCollections(
    tenantId: string
  ): Promise<CollectionsPriority[]> {
    console.info(
      `🎯 AI-powered collections prioritization for tenant ${tenantId}`
    );

    // Mock overdue invoices (in production, query actual AR data)
    const overdueInvoices = [
      {
        invoiceId: 'INV-2025-001',
        customerId: 'customer-001',
        customerName: 'ABC Logistics',
        amount: 15000,
        daysOverdue: 15,
        customerScore: 85,
        historicalRecoveryRate: 0.95,
      },
      {
        invoiceId: 'INV-2025-002',
        customerId: 'customer-002',
        customerName: 'XYZ Freight',
        amount: 8500,
        daysOverdue: 45,
        customerScore: 62,
        historicalRecoveryRate: 0.75,
      },
      {
        invoiceId: 'INV-2024-099',
        customerId: 'customer-003',
        customerName: 'Slow Pay Transport',
        amount: 22000,
        daysOverdue: 90,
        customerScore: 35,
        historicalRecoveryRate: 0.45,
      },
    ];

    // AI prioritization algorithm
    const priorities = overdueInvoices.map((invoice) => {
      // Calculate priority score (1-10)
      const amountWeight = (invoice.amount / 25000) * 3; // Max 3 points for amount
      const overdueWeight = Math.min((invoice.daysOverdue / 30) * 4, 4); // Max 4 points for overdue
      const riskWeight = (1 - invoice.customerScore / 100) * 3; // Max 3 points for risk

      const priority = Math.min(
        Math.round(amountWeight + overdueWeight + riskWeight),
        10
      );

      // Determine collection strategy
      let collectionStrategy: string;
      let suggestedActions: string[];
      let contactMethod: 'email' | 'phone' | 'both';

      if (invoice.daysOverdue < 30) {
        collectionStrategy = 'Friendly Reminder';
        suggestedActions = [
          'Send automated email reminder',
          'Confirm invoice receipt',
          'Offer payment portal link',
        ];
        contactMethod = 'email';
      } else if (invoice.daysOverdue < 60) {
        collectionStrategy = 'Escalated Follow-up';
        suggestedActions = [
          'Phone call to accounts payable',
          'Request payment commitment date',
          'Offer payment plan if needed',
        ];
        contactMethod = 'both';
      } else {
        collectionStrategy = 'Urgent Collection';
        suggestedActions = [
          'Executive-level phone call',
          'Suspend new load bookings',
          'Consider factoring or collections agency',
          'Legal action if necessary',
        ];
        contactMethod = 'phone';
      }

      // Calculate next contact date
      const nextContactDate = new Date();
      nextContactDate.setDate(
        nextContactDate.getDate() + (invoice.daysOverdue < 30 ? 7 : 3)
      );

      return {
        invoiceId: invoice.invoiceId,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        amount: invoice.amount,
        daysOverdue: invoice.daysOverdue,
        priority,
        collectionStrategy,
        suggestedActions,
        estimatedRecoveryProbability: invoice.historicalRecoveryRate,
        nextContactDate,
        contactMethod,
      };
    });

    // Sort by priority (highest first)
    priorities.sort((a, b) => b.priority - a.priority);

    console.info(`✅ Collections prioritized: ${priorities.length} invoices`);
    return priorities;
  }

  /**
   * Analyze customer payment behavior
   */
  async analyzeCustomerPaymentBehavior(
    tenantId: string,
    customerId: string
  ): Promise<CustomerPaymentProfile> {
    console.info(`📊 Analyzing payment behavior for customer ${customerId}`);

    // Mock customer payment history (in production, query actual payment data)
    const paymentHistory = {
      totalInvoices: 48,
      onTimePayments: 38,
      latePayments: 10,
      averageDaysLate: 12,
      totalPaid: 580000,
      currentBalance: 45000,
      overdueAmount: 15000,
    };

    // Calculate payment behavior score (0-100)
    const onTimeRate =
      paymentHistory.onTimePayments / paymentHistory.totalInvoices;
    const latePaymentPenalty = (paymentHistory.averageDaysLate / 30) * 20;
    const paymentBehaviorScore = Math.max(
      0,
      Math.round(onTimeRate * 100 - latePaymentPenalty)
    );

    // Calculate average DSO
    const averageDSO = 30 + paymentHistory.averageDaysLate;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (paymentBehaviorScore >= 80) riskLevel = 'low';
    else if (paymentBehaviorScore >= 60) riskLevel = 'medium';
    else if (paymentBehaviorScore >= 40) riskLevel = 'high';
    else riskLevel = 'critical';

    // Generate recommended action
    let recommendedAction: string;
    if (riskLevel === 'low') {
      recommendedAction = 'Maintain current credit terms and relationship';
    } else if (riskLevel === 'medium') {
      recommendedAction =
        'Monitor closely and send proactive payment reminders';
    } else if (riskLevel === 'high') {
      recommendedAction =
        'Reduce credit limit and require prepayment for new loads';
    } else {
      recommendedAction =
        'Suspend credit and collect outstanding balance before new loads';
    }

    return {
      customerId,
      customerName: 'ABC Logistics', // Mock name
      averageDSO,
      paymentBehaviorScore,
      creditLimit: 100000,
      currentBalance: paymentHistory.currentBalance,
      overdueAmount: paymentHistory.overdueAmount,
      paymentHistory: {
        onTimePayments: paymentHistory.onTimePayments,
        latePayments: paymentHistory.latePayments,
        averageDaysLate: paymentHistory.averageDaysLate,
      },
      riskLevel,
      recommendedAction,
    };
  }

  /**
   * Create automated dunning campaign
   */
  async createAutomatedDunningCampaign(
    invoiceId: string,
    customerId: string,
    daysOverdue: number
  ): Promise<AutomatedDunningCampaign[]> {
    console.info(
      `📧 Creating automated dunning campaign for invoice ${invoiceId}`
    );

    const campaigns: AutomatedDunningCampaign[] = [];

    // Stage 1: Friendly Reminder (7 days overdue)
    if (daysOverdue >= 7) {
      campaigns.push({
        id: `dunning-${invoiceId}-reminder`,
        customerId,
        invoiceId,
        stage: 'reminder',
        messageTemplate: `
          Hi [Customer Name],

          This is a friendly reminder that invoice ${invoiceId} for $[Amount] was due on [Due Date].

          If you've already sent payment, please disregard this message. Otherwise, please submit
          payment at your earliest convenience.

          You can pay online at: [Payment Portal Link]

          Thank you for your business!

          [Your Company Name]
        `,
        scheduledDate: new Date(),
        sent: false,
        effectiveness: 0.65, // 65% effectiveness rate
      });
    }

    // Stage 2: First Notice (15 days overdue)
    if (daysOverdue >= 15) {
      campaigns.push({
        id: `dunning-${invoiceId}-first`,
        customerId,
        invoiceId,
        stage: 'first_notice',
        messageTemplate: `
          Dear [Customer Name],

          Invoice ${invoiceId} for $[Amount] is now [Days] days overdue.

          Please remit payment immediately to avoid service interruption. If there are any
          issues with this invoice, please contact us right away.

          Payment options:
          - Online: [Payment Portal Link]
          - ACH: [Bank Details]
          - Check: [Mailing Address]

          We value your business and want to resolve this matter promptly.

          Best regards,
          [Your Company Name]
        `,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sent: false,
        effectiveness: 0.75, // 75% effectiveness rate
      });
    }

    // Stage 3: Second Notice (30 days overdue)
    if (daysOverdue >= 30) {
      campaigns.push({
        id: `dunning-${invoiceId}-second`,
        customerId,
        invoiceId,
        stage: 'second_notice',
        messageTemplate: `
          URGENT: Past Due Invoice ${invoiceId}

          Dear [Customer Name],

          Invoice ${invoiceId} for $[Amount] is now [Days] days past due.

          IMMEDIATE ACTION REQUIRED:
          - Payment must be received within 5 business days
          - New load bookings are suspended until balance is cleared
          - Late fees may apply

          Please contact us immediately at [Phone Number] to arrange payment.

          [Your Company Name]
          Accounts Receivable Department
        `,
        scheduledDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        sent: false,
        effectiveness: 0.55, // 55% effectiveness rate
      });
    }

    // Stage 4: Final Notice (60 days overdue)
    if (daysOverdue >= 60) {
      campaigns.push({
        id: `dunning-${invoiceId}-final`,
        customerId,
        invoiceId,
        stage: 'final_notice',
        messageTemplate: `
          FINAL NOTICE: Invoice ${invoiceId}

          Dear [Customer Name],

          This is our final attempt to collect payment for invoice ${invoiceId} ($[Amount]),
          now [Days] days past due.

          If payment is not received within 10 days, we will:
          1. Report delinquency to credit bureaus
          2. Refer account to collections agency
          3. Pursue legal action if necessary

          Contact us immediately at [Phone Number] to avoid these actions.

          [Your Company Name]
          Collections Department
        `,
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sent: false,
        effectiveness: 0.4, // 40% effectiveness rate
      });
    }

    // Stage 5: Collections (90+ days overdue)
    if (daysOverdue >= 90) {
      campaigns.push({
        id: `dunning-${invoiceId}-collections`,
        customerId,
        invoiceId,
        stage: 'collections',
        messageTemplate: `
          COLLECTIONS NOTICE: Invoice ${invoiceId}

          Dear [Customer Name],

          Your account has been referred to our collections department for invoice ${invoiceId}
          ($[Amount]), now [Days] days past due.

          This is your final opportunity to resolve this matter directly with us before
          we engage external collections agencies and legal counsel.

          Contact our collections department immediately at [Phone Number].

          [Your Company Name]
          Legal & Collections Department
        `,
        scheduledDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        sent: false,
        effectiveness: 0.25, // 25% effectiveness rate
      });
    }

    console.info(`✅ Dunning campaign created: ${campaigns.length} stages`);
    return campaigns;
  }

  /**
   * Get AR analytics and insights
   */
  async getARAnalytics(tenantId: string): Promise<ARAnalytics> {
    console.info(`📊 Generating AR analytics for tenant ${tenantId}`);

    // Mock AR data (in production, query actual AR aging)
    const arData = {
      totalAR: 450000,
      current: 280000, // 0-30 days
      aging30: 95000, // 31-60 days
      aging60: 45000, // 61-90 days
      aging90Plus: 30000, // 90+ days
    };

    // Calculate average DSO
    const averageDSO = 42; // Mock DSO calculation

    // Calculate collection efficiency
    const collectionEfficiency = 0.89; // 89% collection rate

    // Calculate bad debt ratio
    const badDebtRatio = 0.02; // 2% bad debt

    // Determine trends
    const trends = {
      dsoTrend: 'improving' as const, // DSO decreased from 48 to 42 days
      collectionTrend: 'stable' as const, // Collection rate steady at 89%
      riskTrend: 'declining' as const, // More aging invoices in 90+ bucket
    };

    return {
      totalAR: arData.totalAR,
      currentAR: arData.current,
      aging30: arData.aging30,
      aging60: arData.aging60,
      aging90Plus: arData.aging90Plus,
      averageDSO,
      collectionEfficiency,
      badDebtRatio,
      trends,
    };
  }

  /**
   * Generate DSO reduction strategy
   */
  async generateDSOReductionStrategy(
    tenantId: string,
    currentDSO: number,
    targetDSO: number
  ): Promise<{
    currentDSO: number;
    targetDSO: number;
    gap: number;
    strategies: {
      strategy: string;
      expectedImpact: number; // Days reduction
      implementation: string;
      timeframe: string;
    }[];
    projectedDSO: number;
  }> {
    console.info(
      `🎯 Generating DSO reduction strategy: ${currentDSO} → ${targetDSO} days`
    );

    const gap = currentDSO - targetDSO;

    const strategies = [
      {
        strategy: 'Automated Payment Reminders',
        expectedImpact: 5, // 5 days DSO reduction
        implementation:
          'Implement automated email reminders at 7, 14, and 21 days',
        timeframe: '30 days',
      },
      {
        strategy: 'Early Payment Discounts',
        expectedImpact: 8, // 8 days DSO reduction
        implementation: 'Offer 2% discount for payment within 10 days',
        timeframe: '60 days',
      },
      {
        strategy: 'Customer Segmentation',
        expectedImpact: 4, // 4 days DSO reduction
        implementation:
          'Prioritize collections for high-risk, high-value customers',
        timeframe: '45 days',
      },
      {
        strategy: 'Selective Factoring',
        expectedImpact: 6, // 6 days DSO reduction
        implementation: 'Factor invoices from slow-paying customers (90+ days)',
        timeframe: '15 days',
      },
      {
        strategy: 'Credit Term Optimization',
        expectedImpact: 3, // 3 days DSO reduction
        implementation:
          'Tighten credit terms for new customers and high-risk accounts',
        timeframe: '90 days',
      },
    ];

    const totalExpectedImpact = strategies.reduce(
      (sum, s) => sum + s.expectedImpact,
      0
    );
    const projectedDSO = Math.max(targetDSO, currentDSO - totalExpectedImpact);

    return {
      currentDSO,
      targetDSO,
      gap,
      strategies,
      projectedDSO,
    };
  }
}

// Export singleton instance
export const depointeAdvancedAR = DEPOINTEAdvancedARService.getInstance();
