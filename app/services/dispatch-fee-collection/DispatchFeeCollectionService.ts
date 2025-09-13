// Dispatch Fee Collection Service
// Handles payment processing for carriers/drivers paying dispatch fees to their companies
// Mirrors the shipper payment system but for dispatch fee collection
// INTEGRATED WITH EXISTING DISPATCH INVOICE SYSTEM

import { calculateDispatchFee } from '../../config/dispatch';
import { AIReviewService } from '../ai-review/AIReviewService';
import BillComService from '../billing/BillComService';
import { getInvoiceById, updateInvoiceStatus } from '../invoiceService';
// StripeService removed - using Square for payments

export interface DispatchFeePayment {
  id: string;
  invoiceId: string; // Link to existing invoice
  loadId: string;
  carrierId: string;
  driverId: string;
  companyId: string; // The company receiving the dispatch fee
  amount: number;
  feePercentage: number;
  loadAmount: number;
  paymentMethod: 'square' | 'ach' | 'check' | 'wire';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'overdue';
  paymentDate?: Date;
  transactionId?: string;
  squarePaymentId?: string;
  billComInvoiceId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DispatchFeeCompany {
  id: string;
  companyName: string;
  squareLocationId?: string; // For direct payments to company
  billComAccountId?: string;
  paymentMethods: {
    stripe?: boolean;
    ach?: boolean;
    check?: boolean;
    wire?: boolean;
  };
  defaultPaymentMethod: 'square' | 'ach' | 'check' | 'wire';
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  contactInfo: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  taxId?: string;
  status: 'active' | 'suspended' | 'inactive';
}

export interface DispatchFeeConfig {
  defaultFeePercentage: number;
  minimumFeePercentage: number;
  maximumFeePercentage: number;
  paymentTerms: 'net_7' | 'net_15' | 'net_30' | 'immediate';
  lateFeePercentage: number;
  processingFeePercentage: number;
  autoPaymentEnabled: boolean;
  requireApproval: boolean;
}

export interface DispatchFeeMetrics {
  totalCollected: number;
  totalPending: number;
  totalFailed: number;
  averagePaymentTime: number;
  collectionRate: number;
  outstandingAmount: number;
  monthlyRevenue: number;
  topCompanies: Array<{
    companyId: string;
    companyName: string;
    totalCollected: number;
    paymentCount: number;
  }>;
}

export class DispatchFeeCollectionService {
  // Square service will be implemented here
  private billComService: BillComService;
  private aiReviewService: AIReviewService;
  private companies: Map<string, DispatchFeeCompany>;
  private payments: Map<string, DispatchFeePayment>;
  private config: DispatchFeeConfig;

  constructor() {
    // Square service initialization will go here
    this.billComService = new BillComService();
    this.aiReviewService = new AIReviewService();
    this.companies = new Map();
    this.payments = new Map();
    this.config = {
      defaultFeePercentage: 10.0,
      minimumFeePercentage: 5.0,
      maximumFeePercentage: 15.0,
      paymentTerms: 'net_15',
      lateFeePercentage: 2.0,
      processingFeePercentage: 2.9,
      autoPaymentEnabled: true,
      requireApproval: false,
    };
  }

  // ========================================
  // INTEGRATION WITH EXISTING INVOICE SYSTEM
  // ========================================

  /**
   * Create dispatch fee payment from existing invoice
   * This integrates with the existing dispatch invoice system
   */
  async createPaymentFromInvoice(
    invoiceId: string,
    paymentData: {
      paymentMethod: 'square' | 'ach' | 'check' | 'wire';
      companyId: string;
      notes?: string;
    }
  ): Promise<DispatchFeePayment> {
    // Get existing invoice
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    // Validate invoice is approved
    if (invoice.status !== 'approved') {
      throw new Error(
        `Invoice ${invoiceId} is not approved for payment. Status: ${invoice.status}`
      );
    }

    // Perform AI review before payment processing
    const reviewData = {
      ...invoice,
      ...paymentData,
      dispatcherUserIdentifier: invoice.dispatcherUserIdentifier || 'unknown',
    };

    const reviewResult =
      await this.aiReviewService.reviewDispatchInvoice(reviewData);

    // Check if AI review passed
    if (!reviewResult.isValid) {
      throw new Error(`AI Review failed: ${reviewResult.errors.join(', ')}`);
    }

    // If human review is required, update invoice status
    if (reviewResult.requiresHumanReview) {
      updateInvoiceStatus(invoiceId, 'pending_management_review');
      throw new Error(
        'Payment requires management review based on AI analysis'
      );
    }

    // Calculate fees using existing dispatch config
    const { feePercentage, dispatchFee } = calculateDispatchFee(
      invoice.loadAmount,
      'standard' // Default load type, can be enhanced
    );

    const processingFee =
      (dispatchFee * this.config.processingFeePercentage) / 100;
    const totalAmount = dispatchFee + processingFee;

    // Get company payment information
    const company = this.companies.get(paymentData.companyId);
    if (!company) {
      throw new Error(`Company ${paymentData.companyId} not found`);
    }

    // Create payment record
    const payment: DispatchFeePayment = {
      id: `DFP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      invoiceId: invoiceId,
      loadId: invoice.loadId,
      carrierId: invoice.carrierName, // Using carrier name as ID for now
      driverId: invoice.dispatcherUserIdentifier || 'unknown',
      companyId: paymentData.companyId,
      amount: totalAmount,
      feePercentage: feePercentage,
      loadAmount: invoice.loadAmount,
      paymentMethod: paymentData.paymentMethod,
      status: 'pending',
      notes: paymentData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.storeDispatchFeePayment(payment);
    updateInvoiceStatus(invoiceId, 'Pending'); // Update invoice status to indicate payment processing

    // Auto-process payment if enabled and not requiring approval
    if (
      this.config.autoPaymentEnabled &&
      !this.config.requireApproval &&
      reviewResult.autoApproved
    ) {
      await this.processPayment(payment);
    }

    return payment;
  }

  /**
   * Process payment and update invoice status
   */
  async processPayment(
    payment: DispatchFeePayment
  ): Promise<{ success: boolean; error?: string }> {
    try {
      payment.status = 'processing';
      payment.updatedAt = new Date();
      await this.storeDispatchFeePayment(payment);

      // Perform AI review before processing
      const reviewData = {
        loadId: payment.loadId,
        carrierId: payment.carrierId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        companyId: payment.companyId,
        processedBy: 'system',
      };

      const reviewResult =
        await this.aiReviewService.reviewPaymentProcessing(reviewData);

      // Check if AI review passed
      if (!reviewResult.isValid) {
        payment.status = 'failed';
        payment.updatedAt = new Date();
        await this.storeDispatchFeePayment(payment);
        updateInvoiceStatus(payment.invoiceId, 'Overdue');
        return {
          success: false,
          error: `AI Review failed: ${reviewResult.errors.join(', ')}`,
        };
      }

      let paymentResult;

      switch (payment.paymentMethod) {
        case 'square':
          paymentResult = await this.processStripePayment(payment);
          break;
        case 'ach':
          paymentResult = await this.processACHPayment(payment);
          break;
        case 'check':
          paymentResult = await this.processCheckPayment(payment);
          break;
        case 'wire':
          paymentResult = await this.processWirePayment(payment);
          break;
        default:
          throw new Error(
            `Unsupported payment method: ${payment.paymentMethod}`
          );
      }

      if (paymentResult.success) {
        payment.status = 'completed';
        payment.paymentDate = new Date();
        payment.transactionId = paymentResult.transactionId;
        if ('squarePaymentId' in paymentResult) {
          payment.squarePaymentId =
            paymentResult.squarePaymentId as string;
        }
        if ('billComInvoiceId' in paymentResult) {
          payment.billComInvoiceId = paymentResult.billComInvoiceId as string;
        }

        // Update invoice status to 'Paid'
        updateInvoiceStatus(payment.invoiceId, 'Paid');
      } else {
        payment.status = 'failed';
        payment.notes = paymentResult.error;

        // Update invoice status to 'Overdue' if payment failed
        updateInvoiceStatus(payment.invoiceId, 'Overdue');
      }

      payment.updatedAt = new Date();
      await this.storeDispatchFeePayment(payment);

      return paymentResult;
    } catch (error) {
      payment.status = 'failed';
      payment.notes =
        error instanceof Error ? error.message : 'Payment processing failed';
      payment.updatedAt = new Date();
      await this.storeDispatchFeePayment(payment);

      // Update invoice status to 'Overdue'
      updateInvoiceStatus(payment.invoiceId, 'Overdue');

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  /**
   * Get payments by invoice ID
   */
  async getPaymentsByInvoiceId(
    invoiceId: string
  ): Promise<DispatchFeePayment[]> {
    const payments = await this.getDispatchFeePayments({ invoiceId });
    return payments;
  }

  /**
   * Get payment status for an invoice
   */
  async getInvoicePaymentStatus(invoiceId: string): Promise<{
    hasPayment: boolean;
    paymentStatus?: DispatchFeePayment['status'];
    paymentAmount?: number;
    paymentDate?: Date;
  }> {
    const payments = await this.getPaymentsByInvoiceId(invoiceId);
    const latestPayment = payments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return {
      hasPayment: payments.length > 0,
      paymentStatus: latestPayment?.status,
      paymentAmount: latestPayment?.amount,
      paymentDate: latestPayment?.paymentDate,
    };
  }

  // ========================================
  // DISPATCH FEE CALCULATION (USING EXISTING CONFIG)
  // ========================================

  calculateDispatchFee(
    loadAmount: number,
    feePercentage?: number,
    loadType:
      | 'standard'
      | 'expedited'
      | 'hazmat'
      | 'oversize'
      | 'team' = 'standard'
  ): {
    feePercentage: number;
    dispatchFee: number;
    processingFee: number;
    totalAmount: number;
  } {
    // Use existing dispatch fee calculation
    const { feePercentage: calculatedFee, dispatchFee } = calculateDispatchFee(
      loadAmount,
      loadType
    );

    const effectiveFeePercentage = feePercentage || calculatedFee;
    const finalDispatchFee = (loadAmount * effectiveFeePercentage) / 100;
    const processingFee =
      (finalDispatchFee * this.config.processingFeePercentage) / 100;
    const totalAmount = finalDispatchFee + processingFee;

    return {
      feePercentage: effectiveFeePercentage,
      dispatchFee: finalDispatchFee,
      processingFee,
      totalAmount,
    };
  }

  private async processStripePayment(payment: DispatchFeePayment): Promise<{
    success: boolean;
    transactionId?: string;
    squarePaymentId?: string;
    error?: string;
  }> {
    try {
      // Get company payment info
      const company = this.companies.get(payment.companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // TODO: Implement Square payment processing
      // For now, return mock successful payment
      console.info('Processing Square dispatch fee payment:', {
        amount: payment.amount,
        loadId: payment.loadId,
        companyId: payment.companyId,
      });

      return {
        success: true,
        transactionId: mockPaymentId,
        squarePaymentId: mockPaymentId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Square payment failed',
      };
    }
  }

  private async processACHPayment(
    payment: DispatchFeePayment
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Process ACH payment through Bill.com
      const company = this.companies.get(payment.companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Create ACH payment record
      const lineItems = [
        {
          description: `Dispatch Fee - Load ${payment.loadId}`,
          quantity: 1,
          rate: payment.amount,
          amount: payment.amount,
          category: 'TMS' as const,
          metadata: {
            loadId: payment.loadId,
            carrierId: payment.carrierId,
            driverId: payment.driverId,
            paymentType: 'dispatch_fee',
            invoiceId: payment.invoiceId,
          },
        },
      ];

      const achPayment = await this.billComService.createInvoice(
        company.billComAccountId || payment.companyId,
        lineItems,
        {
          loadId: payment.loadId,
          carrierId: payment.carrierId,
          driverId: payment.driverId,
          paymentType: 'dispatch_fee',
          invoiceId: payment.invoiceId,
        }
      );

      return {
        success: true,
        transactionId: achPayment.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'ACH payment failed',
      };
    }
  }

  private async processCheckPayment(
    payment: DispatchFeePayment
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Create check payment record (manual processing)
      const checkPayment = {
        id: `CHECK-${Date.now()}`,
        amount: payment.amount,
        companyId: payment.companyId,
        loadId: payment.loadId,
        invoiceId: payment.invoiceId,
        status: 'pending',
        createdAt: new Date(),
      };

      // Store check payment for manual processing
      await this.storeCheckPayment(checkPayment);

      return {
        success: true,
        transactionId: checkPayment.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Check payment failed',
      };
    }
  }

  private async processWirePayment(
    payment: DispatchFeePayment
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Create wire transfer record
      const wirePayment = {
        id: `WIRE-${Date.now()}`,
        amount: payment.amount,
        companyId: payment.companyId,
        loadId: payment.loadId,
        invoiceId: payment.invoiceId,
        status: 'pending',
        createdAt: new Date(),
      };

      // Store wire payment for manual processing
      await this.storeWirePayment(wirePayment);

      return {
        success: true,
        transactionId: wirePayment.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Wire payment failed',
      };
    }
  }

  // ========================================
  // COMPANY MANAGEMENT
  // ========================================

  async createDispatchFeeCompany(
    companyData: Omit<DispatchFeeCompany, 'id'>
  ): Promise<DispatchFeeCompany> {
    const company: DispatchFeeCompany = {
      id: `DFC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...companyData,
      status: 'active',
    };

    await this.storeDispatchFeeCompany(company);
    return company;
  }

  async updateDispatchFeeCompany(
    companyId: string,
    updates: Partial<DispatchFeeCompany>
  ): Promise<DispatchFeeCompany | null> {
    const company = this.companies.get(companyId);
    if (!company) return null;

    const updatedCompany = { ...company, ...updates, updatedAt: new Date() };
    await this.storeDispatchFeeCompany(updatedCompany);
    return updatedCompany;
  }

  async getDispatchFeeCompany(
    companyId: string
  ): Promise<DispatchFeeCompany | null> {
    // Implementation would connect to database
    // For now, return mock data
    return {
      id: companyId,
      companyName: 'Sample Dispatch Company',
      squareLocationId: 'acct_sample',
      billComAccountId: 'billcom_sample',
      paymentMethods: {
        stripe: true,
        ach: true,
        check: true,
        wire: false,
      },
      defaultPaymentMethod: 'square',
      contactInfo: {
        email: 'dispatch@company.com',
        phone: '555-123-4567',
        address: {
          street: '123 Dispatch St',
          city: 'Dispatch City',
          state: 'TX',
          zip: '12345',
          country: 'USA',
        },
      },
      status: 'active',
    };
  }

  // ========================================
  // PAYMENT RETRIEVAL & REPORTING (ENHANCED)
  // ========================================

  async getDispatchFeeMetrics(
    timeframe: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<DispatchFeeMetrics> {
    const payments = await this.getDispatchFeePayments();

    const totalCollected = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter((p) => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalFailed = payments
      .filter((p) => p.status === 'failed')
      .reduce((sum, p) => sum + p.amount, 0);

    const completedPayments = payments.filter((p) => p.status === 'completed');
    const averagePaymentTime =
      completedPayments.length > 0
        ? completedPayments.reduce((sum, p) => {
            const timeDiff = p.paymentDate!.getTime() - p.createdAt.getTime();
            return sum + timeDiff;
          }, 0) / completedPayments.length
        : 0;

    const collectionRate =
      (totalCollected / (totalCollected + totalFailed)) * 100;

    return {
      totalCollected,
      totalPending,
      totalFailed,
      averagePaymentTime,
      collectionRate,
      outstandingAmount: totalPending,
      monthlyRevenue: totalCollected,
      topCompanies: [],
    };
  }

  // ========================================
  // CONFIGURATION MANAGEMENT
  // ========================================

  updateConfig(newConfig: Partial<DispatchFeeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): DispatchFeeConfig {
    return { ...this.config };
  }

  // ========================================
  // DATA STORAGE (Mock Implementation)
  // ========================================

  private async storeDispatchFeePayment(
    payment: DispatchFeePayment
  ): Promise<void> {
    // Implementation would store to database
    console.info('Storing dispatch fee payment:', payment.id);
  }

  private async storeDispatchFeeCompany(
    company: DispatchFeeCompany
  ): Promise<void> {
    // Implementation would store to database
    console.info('Storing dispatch fee company:', company.id);
  }

  private async storeCheckPayment(payment: any): Promise<void> {
    // Implementation would store to database
    console.info('Storing check payment:', payment.id);
  }

  private async storeWirePayment(payment: any): Promise<void> {
    // Implementation would store to database
    console.info('Storing wire payment:', payment.id);
  }

  async getDispatchFeePayments(filters?: {
    companyId?: string;
    carrierId?: string;
    driverId?: string;
    invoiceId?: string;
    status?: DispatchFeePayment['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<DispatchFeePayment[]> {
    // Implementation would query database
    // For now, return mock data
    return [];
  }
}
