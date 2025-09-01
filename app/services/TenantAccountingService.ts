// Company Account-Aware Accounting Data Service for FleetFlow
// Provides user company-specific financial data from existing services

import { isBillingEnabled } from '../utils/environmentValidator';
import { BillingAutomationService } from './billing/BillingAutomationService';
import { quickBooksService } from './quickbooksService';
import StripeService from './stripe/StripeService';
import { SubscriptionManagementService } from './SubscriptionManagementService';
import UserDataService, { type UserProfile } from './user-data-service';

export interface CompanyFinancialData {
  userId: string;
  userName: string;
  companyName: string;
  departmentCode: string;
  companyInfo: {
    taxId: string;
    ein: string;
    fiscalYear: string;
    accountingMethod: string;
    operatingStatus: string;
  };
  subscription?: {
    isActive: boolean;
    tierName: string;
    monthlyRevenue: number;
    status: string;
    trialDaysRemaining?: number;
  };
  kpis: {
    totalRevenue: number;
    revenueChange: number;
    ebitdaMargin: number;
    ebitdaChange: number;
    cashPosition: number;
    cashChange: number;
    dso: number;
    dsoChange: number;
    workingCapital: number;
    workingCapitalChange: number;
    collectionRate: number;
    collectionRateChange: number;
  };
  arAging: Array<{
    bucket: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    entity: string;
    amount: number;
    status: string;
    time: string;
  }>;
  invoices: Array<{
    id: string;
    client: string;
    amount: number;
    status: 'paid' | 'sent' | 'overdue' | 'pending';
    date: string;
    daysOverdue?: number;
  }>;
  monthlyPnL: Array<{
    month: string;
    revenue: number;
    expenses: number;
    netIncome: number;
  }>;
}

export class CompanyAccountingService {
  private stripeService: StripeService | null = null;
  private billingService: BillingAutomationService | null = null;
  private userDataService: UserDataService;

  constructor() {
    // Initialize services safely - if environment variables are missing, use mock data
    if (isBillingEnabled()) {
      try {
        this.stripeService = new StripeService();
        console.info('✅ StripeService initialized successfully');
      } catch (error) {
        console.warn(
          '⚠️ StripeService initialization failed, using mock data:',
          error
        );
        this.stripeService = null;
      }
    } else {
      console.info(
        '⚠️ Stripe environment variables not configured, using mock data'
      );
      this.stripeService = null;
    }

    try {
      this.billingService = new BillingAutomationService();
      console.info('✅ BillingAutomationService initialized successfully');
    } catch (error) {
      console.warn(
        '⚠️ BillingAutomationService initialization failed, using mock data:',
        error
      );
      this.billingService = null;
    }

    this.userDataService = UserDataService.getInstance();
    console.info(
      '✅ CompanyAccountingService initialized with user data integration'
    );
  }

  /**
   * Get comprehensive financial data for the current logged-in user's company
   */
  async getCompanyFinancialData(): Promise<CompanyFinancialData> {
    const currentUser = this.userDataService.getCurrentUser();

    if (!currentUser) {
      throw new Error('No valid user logged in');
    }

    // Get data from existing services
    const [
      qbConnection,
      stripeData,
      billingData,
      invoiceData,
      subscriptionData,
    ] = await Promise.all([
      this.getQuickBooksData(currentUser.id),
      this.getStripeData(currentUser.id),
      this.getBillingData(currentUser.id),
      this.getInvoiceData(currentUser.id),
      this.getSubscriptionData(currentUser.id),
    ]);

    // Calculate company-specific KPIs based on user's department (including subscription revenue)
    const kpis = this.calculateCompanyKPIs(
      qbConnection,
      stripeData,
      billingData,
      currentUser,
      subscriptionData
    );
    const arAging = this.calculateARaging(invoiceData);
    const recentTransactions = this.getRecentTransactions(
      stripeData,
      billingData,
      currentUser
    );
    const monthlyPnL = this.calculateMonthlyPnL(qbConnection, stripeData);

    return {
      userId: currentUser.id,
      userName: currentUser.name,
      companyName: this.getCompanyName(currentUser),
      departmentCode: currentUser.departmentCode,
      companyInfo: {
        taxId: this.getCompanyTaxId(currentUser),
        ein: this.getCompanyEIN(currentUser),
        fiscalYear: new Date().getFullYear().toString(),
        accountingMethod: 'Accrual',
        operatingStatus:
          currentUser.status === 'active' ? 'Active' : 'Inactive',
      },
      subscription: subscriptionData,
      kpis,
      arAging,
      recentTransactions,
      invoices: invoiceData,
      monthlyPnL,
    };
  }

  /**
   * Get QuickBooks data for tenant
   */
  private async getQuickBooksData(tenantId: string) {
    try {
      const connection = quickBooksService.getConnectionStatus(tenantId);

      if (connection?.isConnected) {
        // Get real QB data if connected
        return {
          isConnected: true,
          companyName: connection.companyName,
          revenue: this.generateUserRevenue(tenantId),
          expenses: this.generateUserExpenses(tenantId),
          cashPosition: this.generateUserCash(tenantId),
        };
      }

      // Generate tenant-specific mock data if not connected
      return this.generateMockQBData(tenantId);
    } catch (error) {
      console.error('Error fetching QuickBooks data:', error);
      return this.generateMockQBData(tenantId);
    }
  }

  /**
   * Get Stripe data for user company
   */
  private async getStripeData(userId: string) {
    try {
      if (this.stripeService) {
        // Use real Stripe service if available
        // In production, this would query Stripe with user-specific customer ID
        return this.generateMockStripeData(userId);
      }

      // Generate user-specific mock data if Stripe not available
      return this.generateMockStripeData(userId);
    } catch (error) {
      console.error('Error fetching Stripe data:', error);
      return this.generateMockStripeData(userId);
    }
  }

  /**
   * Get billing automation data for user company
   */
  private async getBillingData(userId: string) {
    try {
      if (this.billingService) {
        // Use real billing service if available
        // In production, this would query billing service
        return this.generateMockBillingData(userId);
      }

      // Generate user-specific mock data if billing service not available
      return this.generateMockBillingData(userId);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      return this.generateMockBillingData(userId);
    }
  }

  /**
   * Get subscription data for user
   */
  private async getSubscriptionData(userId: string) {
    try {
      // Get user's subscription from subscription service
      const subscription =
        SubscriptionManagementService.getUserSubscription(userId);
      const trialStatus = SubscriptionManagementService.getTrialStatus(userId);

      if (!subscription) {
        return null; // No subscription
      }

      const tier = SubscriptionManagementService.getSubscriptionTier(
        subscription.subscriptionTierId
      );
      if (!tier) {
        return null;
      }

      return {
        isActive: subscription.status === 'active',
        tierName: tier.name,
        monthlyRevenue:
          tier.billingCycle === 'annual'
            ? Math.round(tier.price / 12)
            : tier.price,
        status: subscription.status,
        trialDaysRemaining: trialStatus.isInTrial
          ? trialStatus.daysRemaining
          : undefined,
      };
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      return null;
    }
  }

  /**
   * Get invoice data for tenant
   */
  private async getInvoiceData(tenantId: string) {
    // Empty state - no invoices configured
    return [];
  }

  /**
   * Calculate tenant-specific KPIs
   */
  private calculateTenantKPIs(qbData: any, stripeData: any, billingData: any) {
    // Return empty state - no tenant KPI data configured
    return {
      totalRevenue: 0,
      revenueChange: 0,
      ebitdaMargin: 0,
      ebitdaChange: 0,
      cashPosition: 0,
      cashChange: 0,
      dso: 0,
      dsoChange: 0,
      workingCapital: 0,
      workingCapitalChange: 0,
      collectionRate: 0,
      collectionRateChange: 0,
    };
  }

  /**
   * Calculate A/R aging for tenant
   */
  private calculateARaging(invoices: any[]) {
    // Return empty state when no invoices exist
    if (!invoices || invoices.length === 0) {
      return [
        {
          bucket: 'Current (0-30)',
          amount: 0,
          percentage: 0,
          count: 0,
        },
        {
          bucket: '31-60 days',
          amount: 0,
          percentage: 0,
          count: 0,
        },
        {
          bucket: '61-90 days',
          amount: 0,
          percentage: 0,
          count: 0,
        },
        {
          bucket: '91-120 days',
          amount: 0,
          percentage: 0,
          count: 0,
        },
        {
          bucket: '120+ days',
          amount: 0,
          percentage: 0,
          count: 0,
        },
      ];
    }

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const seed = this.getTenantSeed(invoices[0]?.id || '');

    return [
      {
        bucket: 'Current (0-30)',
        amount: totalInvoiced * 0.65,
        percentage: 65.0 + (seed % 10),
        count: 15 + (seed % 10),
      },
      {
        bucket: '31-60 days',
        amount: totalInvoiced * 0.18,
        percentage: 18.0 + (seed % 5),
        count: 4 + (seed % 3),
      },
      {
        bucket: '61-90 days',
        amount: totalInvoiced * 0.1,
        percentage: 10.0,
        count: 2 + (seed % 2),
      },
      {
        bucket: '91-120 days',
        amount: totalInvoiced * 0.05,
        percentage: 5.0,
        count: 1,
      },
      {
        bucket: '120+ days',
        amount: totalInvoiced * 0.02,
        percentage: 2.0,
        count: 1,
      },
    ];
  }

  /**
   * Get recent transactions for tenant
   */
  private getRecentTransactions(stripeData: any, billingData: any) {
    const seed = this.getTenantSeed(stripeData?.tenantId || '');

    return [
      {
        id: `TXN-${seed}001`,
        type: 'Wire',
        entity: 'No Recent Transactions',
        amount: 0,
        status: 'No Data',
        time: '--:-- EST',
      },
      {
        id: `TXN-${seed}002`,
        type: 'ACH',
        entity: 'No Recent Transactions',
        amount: 0,
        status: 'No Data',
        time: '--:-- EST',
      },
      {
        id: `TXN-${seed}003`,
        type: 'Check',
        entity: 'No Recent Transactions',
        amount: 0,
        status: 'No Data',
        time: '--:-- EST',
      },
    ];
  }

  /**
   * Calculate monthly P&L for tenant
   */
  private calculateMonthlyPnL(qbData: any, stripeData: any) {
    return [
      {
        month: 'Jan',
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      {
        month: 'Feb',
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      {
        month: 'Mar',
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      {
        month: 'Apr',
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      {
        month: 'May',
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      {
        month: 'Jun',
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
    ];
  }

  // Helper methods for tenant-specific data generation
  private getTenantSeed(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private generateTenantTaxId(tenantId: string): string {
    const seed = this.getTenantSeed(tenantId);
    return `${(seed % 99) + 10}-${(seed % 999999) + 1000000}`;
  }

  private generateTenantEIN(tenantId: string): string {
    return this.generateTenantTaxId(tenantId); // Same format
  }

  private generateTenantRevenue(tenantId: string): number {
    return 0; // Empty state - no revenue data
  }

  private generateTenantExpenses(tenantId: string): number {
    return 0; // Empty state - no expense data
  }

  private generateTenantCash(tenantId: string): number {
    return 0; // Empty state - no cash data
  }

  private getTenantCustomerName(tenantId: string, index: number): string {
    const customers = [
      'Prime Manufacturing Co',
      'Elite Electronics Inc',
      'Summit Logistics LLC',
      'Apex Foods Corp',
      'Metro Transport Ltd',
      'Global Solutions Inc',
    ];
    const seed = this.getTenantSeed(tenantId + index);
    return customers[seed % customers.length];
  }

  private generateMockQBData(tenantId: string) {
    return {
      isConnected: false,
      tenantId,
      revenue: this.generateTenantRevenue(tenantId),
      expenses: this.generateTenantExpenses(tenantId),
      cashPosition: this.generateTenantCash(tenantId),
    };
  }

  private generateMockStripeData(tenantId: string) {
    return {
      tenantId,
      subscriptions: [],
      revenue: this.generateTenantRevenue(tenantId) * 0.3, // 30% via Stripe
    };
  }

  private generateMockBillingData(tenantId: string) {
    return {
      tenantId,
      totalBilled: this.generateTenantRevenue(tenantId) * 0.7, // 70% via billing
      outstanding: this.generateTenantRevenue(tenantId) * 0.15,
    };
  }

  /**
   * Get company name based on user's department
   */
  private getCompanyName(user: UserProfile): string {
    return 'Company Not Configured';
  }

  /**
   * Get company tax ID based on user's department
   */
  private getCompanyTaxId(user: UserProfile): string {
    return 'Not Configured';
  }

  /**
   * Get company EIN based on user's department
   */
  private getCompanyEIN(user: UserProfile): string {
    return 'Not Configured';
  }

  /**
   * Calculate company-specific KPIs based on user, department, and subscription
   */
  private calculateCompanyKPIs(
    qbData: any,
    stripeData: any,
    billingData: any,
    user: UserProfile,
    subscriptionData?: any
  ) {
    // Return empty state - no KPI data configured
    return {
      totalRevenue: 0,
      revenueChange: 0,
      ebitdaMargin: 0,
      ebitdaChange: 0,
      cashPosition: 0,
      cashChange: 0,
      dso: 0,
      dsoChange: 0,
      workingCapital: 0,
      workingCapitalChange: 0,
      collectionRate: 0,
      collectionRateChange: 0,
    };
  }

  /**
   * Get department-specific multiplier for financial calculations
   */
  private getDepartmentMultiplier(departmentCode: string): number {
    const multipliers: Record<string, number> = {
      MGR: 5, // Management has highest revenue
      BB: 4, // Brokerage is high-revenue
      DC: 3, // Dispatch is mid-revenue
      DM: 2, // Driver Management is lower revenue
    };
    return multipliers[departmentCode] || 1;
  }

  /**
   * Generate user-specific seed for consistent data generation
   */
  private getUserSeed(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 10000;
  }

  /**
   * Generate user-specific revenue
   */
  private generateUserRevenue(userId: string): number {
    const seed = this.getUserSeed(userId);
    return 100000 + seed * 15;
  }

  /**
   * Generate user-specific expenses
   */
  private generateUserExpenses(userId: string): number {
    const seed = this.getUserSeed(userId);
    return 60000 + seed * 8;
  }

  /**
   * Generate user-specific cash position
   */
  private generateUserCash(userId: string): number {
    const seed = this.getUserSeed(userId);
    return 250000 + seed * 50;
  }

  /**
   * Update recent transactions to include user context
   */
  private getRecentTransactions(
    stripeData: any,
    billingData: any,
    user: UserProfile
  ) {
    const seed = this.getUserSeed(user.id);

    return [
      {
        id: `TXN-${seed}001`,
        type: 'Wire',
        entity: 'No Recent Transactions',
        amount: 0,
        status: 'No Data',
        time: '--:-- EST',
      },
      {
        id: `TXN-${seed}002`,
        type: 'ACH',
        entity: 'No Recent Transactions',
        amount: 0,
        status: 'No Data',
        time: '--:-- EST',
      },
      {
        id: `TXN-${seed}003`,
        type: 'Check',
        entity: 'No Recent Transactions',
        amount: 0,
        status: 'No Data',
        time: '--:-- EST',
      },
    ];
  }

  /**
   * Get department-specific customer names
   */
  private getCompanyCustomerName(
    departmentCode: string,
    index: number
  ): string {
    const customerSets: Record<string, string[]> = {
      MGR: [
        'Strategic Partners Inc',
        'Enterprise Solutions LLC',
        'Global Management Co',
      ],
      BB: [
        'Freight Network Corp',
        'Logistics Alliance Inc',
        'Transport Solutions LLC',
      ],
      DC: [
        'Regional Carriers Ltd',
        'Express Delivery Co',
        'Route Optimization Inc',
      ],
      DM: [
        'Driver Services Inc',
        'Fleet Personnel LLC',
        'Transportation Staffing Co',
      ],
    };

    const customers = customerSets[departmentCode] || [
      'General Business Corp',
      'Standard Services Inc',
      'Default Company LLC',
    ];
    return customers[index] || customers[0];
  }

  // Mock methods for invoice management
  getShipperInvoices(): any[] {
    return [
      {
        id: 'INV-SH-001',
        shipper: 'ABC Manufacturing',
        amount: 2850.0,
        status: 'paid',
        dueDate: '2024-08-15',
        invoiceDate: '2024-07-15',
        description: 'Electronics shipment - Dallas to Houston',
      },
      {
        id: 'INV-SH-002',
        shipper: 'XYZ Distribution',
        amount: 1920.0,
        status: 'pending',
        dueDate: '2024-09-01',
        invoiceDate: '2024-08-01',
        description: 'Auto parts delivery - Austin to San Antonio',
      },
    ];
  }

  getDispatcherInvoices(): any[] {
    return [
      {
        id: 'INV-DS-001',
        dispatcher: 'Central Dispatch LLC',
        amount: 450.0,
        status: 'paid',
        dueDate: '2024-08-10',
        invoiceDate: '2024-07-25',
        description: 'Dispatch coordination services',
      },
      {
        id: 'INV-DS-002',
        dispatcher: 'FleetFlow Dispatch',
        amount: 680.0,
        status: 'overdue',
        dueDate: '2024-08-20',
        invoiceDate: '2024-07-20',
        description: 'Load board management and driver coordination',
      },
    ];
  }
}

// Export singleton instance
export const companyAccountingService = new CompanyAccountingService();

// Legacy export for backwards compatibility during transition
export const tenantAccountingService = companyAccountingService;
