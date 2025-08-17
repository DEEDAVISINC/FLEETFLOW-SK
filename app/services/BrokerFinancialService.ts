/**
 * 💹 Advanced Financial Dashboard Service
 * Comprehensive financial analytics and automation for brokers
 */

interface CashFlowData {
  date: string;
  receivables: number;
  payables: number;
  netCashFlow: number;
  pendingInvoices: number;
  overdueAmount: number;
  projectedCashFlow: number;
}

interface ProfitLossData {
  laneId: string;
  laneName: string;
  revenue: number;
  costs: number;
  margin: number;
  marginPercent: number;
  loadCount: number;
  avgRevenuePerLoad: number;
  customerId: string;
  customerName: string;
}

interface CommissionData {
  brokerId: string;
  brokerName: string;
  grossRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  bonusEligible: boolean;
  bonusAmount: number;
  totalPayout: number;
  ytdCommission: number;
  period: string;
}

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  budgetVariance: number;
  subcategories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  grossMargin: number;
  grossMarginPercent: number;
  netProfit: number;
  netProfitPercent: number;
  avgMarginPerLoad: number;
  totalLoads: number;
  revenuePerLoad: number;
  operatingRatio: number;
}

interface CustomerProfitability {
  customerId: string;
  customerName: string;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
  loadCount: number;
  avgRevenuePerLoad: number;
  paymentTerms: number;
  creditRating: string;
  riskScore: number;
  lifetimeValue: number;
}

export class BrokerFinancialService {
  private static instance: BrokerFinancialService;

  public static getInstance(): BrokerFinancialService {
    if (!BrokerFinancialService.instance) {
      BrokerFinancialService.instance = new BrokerFinancialService();
    }
    return BrokerFinancialService.instance;
  }

  /**
   * Get cash flow analysis and forecasting
   */
  async getCashFlowAnalysis(
    brokerId: string,
    daysAhead: number = 30
  ): Promise<{
    current: CashFlowData[];
    forecast: CashFlowData[];
    metrics: {
      currentCashPosition: number;
      projectedCashPosition: number;
      daysSaleOutstanding: number;
      collectionsEfficiency: number;
      workingCapital: number;
      quickRatio: number;
    };
    alerts: Array<{
      type: 'warning' | 'critical' | 'info';
      message: string;
      amount?: number;
      dueDate?: string;
    }>;
  }> {
    // Mock data - replace with actual financial data queries
    const currentData: CashFlowData[] = this.generateCashFlowData(30, false);
    const forecastData: CashFlowData[] = this.generateCashFlowData(
      daysAhead,
      true
    );

    return {
      current: currentData,
      forecast: forecastData,
      metrics: {
        currentCashPosition: 284500,
        projectedCashPosition: 325800,
        daysSaleOutstanding: 32,
        collectionsEfficiency: 94.2,
        workingCapital: 156300,
        quickRatio: 1.87,
      },
      alerts: [
        {
          type: 'warning',
          message: 'Customer ABC Corp payment overdue',
          amount: 25400,
          dueDate: '2024-01-20',
        },
        {
          type: 'critical',
          message: 'Cash flow projected to go negative in 18 days',
          amount: -15600,
          dueDate: '2024-02-15',
        },
        {
          type: 'info',
          message: 'Large receivable expected from XYZ Shipping',
          amount: 47200,
          dueDate: '2024-02-10',
        },
      ],
    };
  }

  /**
   * Get profit/loss analysis by lane and customer
   */
  async getProfitLossAnalysis(
    brokerId: string,
    period: string = 'month'
  ): Promise<{
    byLane: ProfitLossData[];
    byCustomer: CustomerProfitability[];
    summary: FinancialMetrics;
    trends: {
      revenueGrowth: number;
      marginTrend: number;
      costEfficiency: number;
      volumeGrowth: number;
    };
  }> {
    // Mock data - replace with actual P&L queries
    const laneData = this.generateLaneProfitability();
    const customerData = this.generateCustomerProfitability();

    return {
      byLane: laneData,
      byCustomer: customerData,
      summary: {
        totalRevenue: 1245680,
        totalCosts: 978420,
        grossMargin: 267260,
        grossMarginPercent: 21.45,
        netProfit: 187340,
        netProfitPercent: 15.04,
        avgMarginPerLoad: 1285,
        totalLoads: 208,
        revenuePerLoad: 5988,
        operatingRatio: 0.785,
      },
      trends: {
        revenueGrowth: 12.8,
        marginTrend: 2.3,
        costEfficiency: -1.7,
        volumeGrowth: 8.9,
      },
    };
  }

  /**
   * Calculate commission automation
   */
  async calculateCommissions(period: string = 'month'): Promise<{
    brokers: CommissionData[];
    totalCommissions: number;
    averageCommissionRate: number;
    topPerformers: Array<{
      brokerId: string;
      brokerName: string;
      performance: number;
      bonus: number;
    }>;
    payrollSummary: {
      totalPayout: number;
      totalBonuses: number;
      payrollTaxes: number;
      netPayroll: number;
    };
  }> {
    // Mock data - replace with actual commission calculations
    const brokerCommissions = this.generateCommissionData();

    return {
      brokers: brokerCommissions,
      totalCommissions: 84650,
      averageCommissionRate: 6.8,
      topPerformers: [
        {
          brokerId: 'BR001',
          brokerName: 'Sarah Johnson',
          performance: 127.5,
          bonus: 5200,
        },
        {
          brokerId: 'BR003',
          brokerName: 'Mike Chen',
          performance: 118.2,
          bonus: 3800,
        },
        {
          brokerId: 'BR005',
          brokerName: 'Lisa Rodriguez',
          performance: 115.6,
          bonus: 3200,
        },
      ],
      payrollSummary: {
        totalPayout: 98750,
        totalBonuses: 14100,
        payrollTaxes: 19825,
        netPayroll: 78925,
      },
    };
  }

  /**
   * Get expense tracking and analysis
   */
  async getExpenseAnalysis(brokerId: string): Promise<{
    categories: ExpenseData[];
    monthlyTrend: Array<{
      month: string;
      totalExpenses: number;
      varianceFromBudget: number;
    }>;
    budgetAnalysis: {
      totalBudget: number;
      totalSpent: number;
      remainingBudget: number;
      projectedOverrun: number;
      savingsOpportunities: Array<{
        category: string;
        potentialSavings: number;
        recommendation: string;
      }>;
    };
  }> {
    // Mock data - replace with actual expense queries
    return {
      categories: [
        {
          category: 'Fuel & Transportation',
          amount: 156800,
          percentage: 42.3,
          trend: 'up',
          budgetVariance: 8200,
          subcategories: [
            { name: 'Fuel Costs', amount: 98400, percentage: 62.8 },
            { name: 'Carrier Payments', amount: 45200, percentage: 28.8 },
            { name: 'Fuel Surcharges', amount: 13200, percentage: 8.4 },
          ],
        },
        {
          category: 'Operations',
          amount: 89600,
          percentage: 24.1,
          trend: 'stable',
          budgetVariance: -2400,
          subcategories: [
            { name: 'Load Board Fees', amount: 28400, percentage: 31.7 },
            { name: 'Insurance', amount: 24800, percentage: 27.7 },
            { name: 'Equipment Lease', amount: 19200, percentage: 21.4 },
            { name: 'Maintenance', amount: 17200, percentage: 19.2 },
          ],
        },
        {
          category: 'Personnel',
          amount: 78400,
          percentage: 21.1,
          trend: 'up',
          budgetVariance: 5600,
          subcategories: [
            { name: 'Salaries', amount: 52800, percentage: 67.3 },
            { name: 'Benefits', amount: 15200, percentage: 19.4 },
            { name: 'Commissions', amount: 10400, percentage: 13.3 },
          ],
        },
        {
          category: 'Technology',
          amount: 24600,
          percentage: 6.6,
          trend: 'down',
          budgetVariance: -1800,
          subcategories: [
            { name: 'Software Licenses', amount: 14200, percentage: 57.7 },
            { name: 'Communication', amount: 6800, percentage: 27.6 },
            { name: 'Hardware', amount: 3600, percentage: 14.6 },
          ],
        },
        {
          category: 'Administrative',
          amount: 21800,
          percentage: 5.9,
          trend: 'stable',
          budgetVariance: 200,
          subcategories: [
            { name: 'Office Rent', amount: 12000, percentage: 55.0 },
            { name: 'Legal & Professional', amount: 4800, percentage: 22.0 },
            { name: 'Utilities', amount: 3200, percentage: 14.7 },
            { name: 'Office Supplies', amount: 1800, percentage: 8.3 },
          ],
        },
      ],
      monthlyTrend: this.generateMonthlyExpenseTrend(),
      budgetAnalysis: {
        totalBudget: 385000,
        totalSpent: 371200,
        remainingBudget: 13800,
        projectedOverrun: 18400,
        savingsOpportunities: [
          {
            category: 'Fuel & Transportation',
            potentialSavings: 12400,
            recommendation:
              'Negotiate better fuel surcharge rates with top carriers',
          },
          {
            category: 'Operations',
            potentialSavings: 6800,
            recommendation:
              'Consolidate load board subscriptions and renegotiate insurance',
          },
          {
            category: 'Technology',
            potentialSavings: 3200,
            recommendation:
              'Review unused software licenses and optimize communication plans',
          },
        ],
      },
    };
  }

  /**
   * Get comprehensive financial dashboard data
   */
  async getFinancialDashboard(brokerId: string): Promise<{
    cashFlow: any;
    profitLoss: any;
    commissions: any;
    expenses: any;
    kpis: {
      revenueGrowth: number;
      profitMargin: number;
      cashPosition: number;
      dso: number;
      operatingRatio: number;
      roiPercentage: number;
    };
    alerts: Array<{
      type: 'success' | 'warning' | 'error' | 'info';
      title: string;
      message: string;
      action?: string;
    }>;
  }> {
    const [cashFlow, profitLoss, commissions, expenses] = await Promise.all([
      this.getCashFlowAnalysis(brokerId),
      this.getProfitLossAnalysis(brokerId),
      this.calculateCommissions(),
      this.getExpenseAnalysis(brokerId),
    ]);

    return {
      cashFlow,
      profitLoss,
      commissions,
      expenses,
      kpis: {
        revenueGrowth: 12.8,
        profitMargin: 21.45,
        cashPosition: 284500,
        dso: 32,
        operatingRatio: 78.5,
        roiPercentage: 18.7,
      },
      alerts: [
        {
          type: 'warning',
          title: 'Cash Flow Alert',
          message: 'Projected negative cash flow in 18 days',
          action: 'Review receivables',
        },
        {
          type: 'success',
          title: 'Revenue Growth',
          message: '12.8% revenue growth this month',
          action: 'View details',
        },
        {
          type: 'info',
          title: 'Commission Ready',
          message: 'Monthly commissions calculated and ready for approval',
          action: 'Process payroll',
        },
        {
          type: 'error',
          title: 'Budget Overrun',
          message: 'Fuel costs 8.2% over budget',
          action: 'Optimize routing',
        },
      ],
    };
  }

  // Helper methods for generating mock data
  private generateCashFlowData(
    days: number,
    isForecast: boolean
  ): CashFlowData[] {
    const data: CashFlowData[] = [];
    const baseDate = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + (isForecast ? i : -i));

      const receivables = 45000 + Math.random() * 20000;
      const payables = 35000 + Math.random() * 15000;

      data.push({
        date: date.toISOString().split('T')[0],
        receivables,
        payables,
        netCashFlow: receivables - payables,
        pendingInvoices: Math.floor(Math.random() * 15) + 5,
        overdueAmount: Math.random() * 25000,
        projectedCashFlow:
          receivables - payables + (Math.random() - 0.5) * 10000,
      });
    }

    return data.reverse();
  }

  private generateLaneProfitability(): ProfitLossData[] {
    const lanes = [
      { id: 'ATL-MIA', name: 'Atlanta to Miami' },
      { id: 'CHI-DET', name: 'Chicago to Detroit' },
      { id: 'LAX-LAS', name: 'Los Angeles to Las Vegas' },
      { id: 'NYC-BOS', name: 'New York to Boston' },
      { id: 'DAL-HOU', name: 'Dallas to Houston' },
    ];

    return lanes.map((lane) => {
      const revenue = 150000 + Math.random() * 100000;
      const costs = revenue * (0.75 + Math.random() * 0.15);
      const margin = revenue - costs;
      const loadCount = Math.floor(Math.random() * 50) + 20;

      return {
        laneId: lane.id,
        laneName: lane.name,
        revenue,
        costs,
        margin,
        marginPercent: (margin / revenue) * 100,
        loadCount,
        avgRevenuePerLoad: revenue / loadCount,
        customerId: `CUST${Math.floor(Math.random() * 100)
          .toString()
          .padStart(3, '0')}`,
        customerName: `Customer ${Math.floor(Math.random() * 100)}`,
      };
    });
  }

  private generateCustomerProfitability(): CustomerProfitability[] {
    const customers = [
      'Walmart Distribution',
      'Amazon Logistics',
      'Target Supply Chain',
      'Home Depot',
      'FedEx Ground',
    ];

    return customers.map((name, index) => {
      const revenue = 200000 + Math.random() * 150000;
      const costs = revenue * (0.7 + Math.random() * 0.2);
      const netProfit = revenue - costs;
      const loadCount = Math.floor(Math.random() * 60) + 30;

      return {
        customerId: `CUST${(index + 1).toString().padStart(3, '0')}`,
        customerName: name,
        totalRevenue: revenue,
        totalCosts: costs,
        netProfit,
        profitMargin: (netProfit / revenue) * 100,
        loadCount,
        avgRevenuePerLoad: revenue / loadCount,
        paymentTerms: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        creditRating: ['AAA', 'AA', 'A', 'BBB'][Math.floor(Math.random() * 4)],
        riskScore: Math.floor(Math.random() * 30) + 70,
        lifetimeValue: revenue * (2 + Math.random() * 3),
      };
    });
  }

  private generateCommissionData(): CommissionData[] {
    const brokers = [
      'Sarah Johnson',
      'Mike Chen',
      'Emily Davis',
      'Lisa Rodriguez',
      'David Kim',
    ];

    return brokers.map((name, index) => {
      const grossRevenue = 150000 + Math.random() * 100000;
      const commissionRate = 5 + Math.random() * 5;
      const commissionAmount = grossRevenue * (commissionRate / 100);
      const bonusEligible = grossRevenue > 200000;
      const bonusAmount = bonusEligible ? commissionAmount * 0.15 : 0;

      return {
        brokerId: `BR${(index + 1).toString().padStart(3, '0')}`,
        brokerName: name,
        grossRevenue,
        commissionRate,
        commissionAmount,
        bonusEligible,
        bonusAmount,
        totalPayout: commissionAmount + bonusAmount,
        ytdCommission: commissionAmount * 8.5, // Assuming 8.5 months YTD
        period: 'January 2024',
      };
    });
  }

  private generateMonthlyExpenseTrend() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => ({
      month,
      totalExpenses: 350000 + Math.random() * 50000,
      varianceFromBudget: (Math.random() - 0.5) * 20000,
    }));
  }
}
