// Enterprise Invoice Service - Complete Integration with Bill.com and Multi-Tenant Architecture
import { ShipperInfo, shipperService } from './shipperService';

// Enterprise Invoice Interfaces
export interface EnterpriseInvoice {
  id: string;
  invoiceNumber: string; // Format: {TenantCode}-{ShipperCode}-{Year}-{Sequence}

  // Tenant & Multi-tenant Architecture
  tenantId: string;
  tenantName: string;
  tenantCode: string; // "FF", "ABC", etc.

  // Shipper Integration (from existing shipper management)
  shipperId: string;
  shipperCode: string; // "ABC-204-070"
  shipperCompanyName: string;
  shipperContactName: string;
  shipperEmail: string;
  shipperPaymentTerms: string;
  shipperCreditRating: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C' | 'D';
  shipperBusinessType: string;

  // Load & Service Details
  loadId?: string;
  serviceType: 'freight' | 'warehousing' | '3pl' | 'dispatch' | 'brokerage';

  // Financial Details
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: 'USD' | 'CAD' | 'MXN';

  // Payment & Status
  status:
    | 'draft'
    | 'sent'
    | 'viewed'
    | 'paid'
    | 'overdue'
    | 'disputed'
    | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'ach' | 'wire' | 'check' | 'credit_card' | 'factoring';

  // Aging & Collections
  agingBucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';
  daysOutstanding: number;

  // Line Items
  lineItems: EnterpriseLineItem[];

  // Integration Points
  billComInvoiceId?: string;
  quickBooksId?: string;
  stripeInvoiceId?: string;

  // Audit Trail
  createdBy: string;
  approvedBy?: string;
  sentBy?: string;
  createdAt: string;
  approvedAt?: string;
  sentAt?: string;
  dueDate: string;

  // Collections & Disputes
  collectionNotes?: CollectionNote[];
  disputeReason?: string;
  lastContactDate?: string;

  // Advanced Features
  recurringSchedule?: RecurringSchedule;
  factoring?: FactoringDetails;
  automatedReminders?: boolean;
  lateFeesEnabled?: boolean;

  // Performance Metrics
  profitMargin?: number;
  carrierCost?: number;
  dispatcherFee?: number;
  brokerCommission?: number;
}

export interface EnterpriseLineItem {
  id: string;
  description: string;
  serviceCode: string; // "FRT-001", "WHS-002", etc.
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;

  // Load-specific details
  origin?: string;
  destination?: string;
  miles?: number;
  weight?: number;
  commodity?: string;
  equipmentType?: string;

  // Cost tracking
  carrierCost?: number;
  margin?: number;
  marginPercent?: number;

  // Service-specific fields
  serviceDate?: string;
  completionDate?: string;
  driverName?: string;
  equipmentNumber?: string;
}

export interface CollectionNote {
  id: string;
  date: string;
  note: string;
  contactMethod: 'phone' | 'email' | 'letter' | 'in_person';
  contactedBy: string;
  outcome:
    | 'promised_payment'
    | 'dispute_raised'
    | 'no_response'
    | 'payment_plan'
    | 'escalated';
  followUpDate?: string;
}

export interface RecurringSchedule {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  startDate: string;
  endDate?: string;
  nextInvoiceDate: string;
  autoGenerate: boolean;
  template: boolean;
}

export interface FactoringDetails {
  factorCompany: string;
  factorRate: number;
  advanceRate: number;
  reserveRate: number;
  factorContactEmail: string;
  noticeOfAssignment: boolean;
  factorApprovalRequired: boolean;
}

export interface ShipperFinancialSummary {
  shipperId: string;
  shipperName: string;
  shipperCode: string;
  businessType: string;
  creditRating: string;
  paymentTerms: string;

  // Financial Metrics
  totalInvoices: number;
  totalRevenue: number;
  averageInvoiceAmount: number;
  averagePaymentDays: number;
  outstandingBalance: number;
  overdueAmount: number;
  disputedAmount: number;

  // Performance Metrics
  onTimePaymentRate: number;
  disputeRate: number;
  averageMargin: number;
  totalMargin: number;

  // Risk Assessment
  riskScore: 'Low' | 'Medium' | 'High';
  creditUtilization: number;
  paymentTrend: 'improving' | 'stable' | 'declining';

  // Dates
  firstInvoiceDate: string;
  lastPaymentDate: string;
  lastContactDate: string;

  // Collections
  collectionNotes: number;
  escalationLevel: 'none' | 'gentle' | 'firm' | 'legal';
}

export interface TenantFinancialMetrics {
  tenantId: string;
  tenantName: string;
  tenantCode: string;

  // Revenue Metrics
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  yearOverYearGrowth: number;
  quarterOverQuarterGrowth: number;

  // Profitability
  grossMargin: number;
  netMargin: number;
  averageMargin: number;
  totalProfit: number;

  // Invoice Metrics
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  disputedInvoices: number;
  draftInvoices: number;

  // Collection Metrics
  collectionEfficiency: number;
  averageDaysOutstanding: number;
  badDebtRate: number;
  writeOffAmount: number;

  // Customer Metrics
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  customerLifetimeValue: number;

  // Operational Metrics
  averageInvoiceAmount: number;
  invoiceVelocity: number;
  paymentVelocity: number;
  automationRate: number;
}

// Bill.com Integration Service
export class BillComIntegrationService {
  private apiUrl: string;
  private apiKey: string;
  private username: string;
  private password: string;
  private orgId: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.apiUrl =
      process.env.BILLCOM_ENVIRONMENT === 'production'
        ? 'https://api.bill.com/api/v2'
        : 'https://api-sandbox.bill.com/api/v2';
    this.apiKey = process.env.BILLCOM_API_KEY || '';
    this.username = process.env.BILLCOM_USERNAME || '';
    this.password = process.env.BILLCOM_PASSWORD || '';
    this.orgId = process.env.BILLCOM_ORG_ID || '';
    this.environment = (process.env.BILLCOM_ENVIRONMENT as any) || 'sandbox';
  }

  // Create or update customer in Bill.com
  async createOrUpdateCustomer(shipper: ShipperInfo): Promise<any> {
    try {
      const customerData = {
        name: shipper.companyName,
        email: shipper.email,
        phone: shipper.phone,
        address: {
          addressLine1: shipper.address,
          city: shipper.city,
          state: shipper.state,
          zip: shipper.zipCode,
        },
        paymentTerms: this.parsePaymentTerms(shipper.paymentTerms),
        creditLimit: this.calculateCreditLimit(shipper.creditRating),
        isActive: true,
      };

      const response = await this.makeApiCall(
        '/customers',
        'POST',
        customerData
      );
      return response;
    } catch (error) {
      console.error('Error creating Bill.com customer:', error);
      throw new Error('Failed to create Bill.com customer');
    }
  }

  // Create invoice in Bill.com
  async createInvoice(invoice: EnterpriseInvoice): Promise<any> {
    try {
      const invoiceData = {
        customerId: invoice.billComInvoiceId, // Assuming customer already exists
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.createdAt,
        dueDate: invoice.dueDate,
        description: `Invoice for ${invoice.serviceType} services`,
        lineItems: invoice.lineItems.map((item) => ({
          item: item.serviceCode,
          description: item.description,
          quantity: item.quantity,
          price: item.unitPrice,
          amount: item.totalPrice,
        })),
        subtotal: invoice.subtotal,
        tax: invoice.taxAmount,
        total: invoice.totalAmount,
        currency: invoice.currency,
      };

      const response = await this.makeApiCall('/invoices', 'POST', invoiceData);
      return response;
    } catch (error) {
      console.error('Error creating Bill.com invoice:', error);
      throw new Error('Failed to create Bill.com invoice');
    }
  }

  // Send invoice via Bill.com
  async sendInvoice(
    billComInvoiceId: string,
    emailAddress: string
  ): Promise<any> {
    try {
      const sendData = {
        invoiceId: billComInvoiceId,
        emailAddress: emailAddress,
        subject: 'Invoice from FleetFlow',
        message: 'Please find your invoice attached.',
      };

      const response = await this.makeApiCall(
        `/invoices/${billComInvoiceId}/send`,
        'POST',
        sendData
      );
      return response;
    } catch (error) {
      console.error('Error sending Bill.com invoice:', error);
      throw new Error('Failed to send Bill.com invoice');
    }
  }

  // Process payment
  async processPayment(invoiceId: string, paymentData: any): Promise<any> {
    try {
      const response = await this.makeApiCall(
        `/invoices/${invoiceId}/payments`,
        'POST',
        paymentData
      );
      return response;
    } catch (error) {
      console.error('Error processing Bill.com payment:', error);
      throw new Error('Failed to process Bill.com payment');
    }
  }

  private async makeApiCall(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<any> {
    // Mock implementation for now - replace with actual Bill.com API calls
    console.info(`Bill.com API Call: ${method} ${endpoint}`, data);

    // Simulate API response
    return {
      id: `billcom_${Date.now()}`,
      status: 'success',
      data: data,
    };
  }

  private parsePaymentTerms(terms: string): number {
    if (terms.includes('Net 30')) return 30;
    if (terms.includes('Net 21')) return 21;
    if (terms.includes('Net 15')) return 15;
    if (terms.includes('Net 45')) return 45;
    return 30; // Default
  }

  private calculateCreditLimit(creditRating: string): number {
    switch (creditRating) {
      case 'A+':
        return 100000;
      case 'A':
        return 75000;
      case 'A-':
        return 50000;
      case 'B+':
        return 35000;
      case 'B':
        return 25000;
      case 'B-':
        return 15000;
      case 'C':
        return 10000;
      case 'D':
        return 5000;
      default:
        return 25000;
    }
  }
}

// Enterprise Invoice Service
export class EnterpriseInvoiceService {
  private static instance: EnterpriseInvoiceService;
  private billComService: BillComIntegrationService;
  private invoiceSequence: Map<string, number> = new Map();

  constructor() {
    this.billComService = new BillComIntegrationService();
  }

  static getInstance(): EnterpriseInvoiceService {
    if (!EnterpriseInvoiceService.instance) {
      EnterpriseInvoiceService.instance = new EnterpriseInvoiceService();
    }
    return EnterpriseInvoiceService.instance;
  }

  // Generate enterprise invoice number
  generateInvoiceNumber(tenantCode: string, shipperCode: string): string {
    const year = new Date().getFullYear();
    const key = `${tenantCode}-${year}`;

    let sequence = this.invoiceSequence.get(key) || 0;
    sequence++;
    this.invoiceSequence.set(key, sequence);

    return `${tenantCode}-${shipperCode}-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  // Generate enterprise invoice from shipper data
  async generateInvoiceFromShipper(
    shipperId: string,
    loadDetails: any,
    tenantId: string = 'tenant-fleetflow-001'
  ): Promise<EnterpriseInvoice> {
    const shipper = shipperService.getShipperById(shipperId);
    if (!shipper) throw new Error('Shipper not found');

    const tenantCode = this.getTenantCode(tenantId);
    const invoiceNumber = this.generateInvoiceNumber(tenantCode, shipper.id);
    const createdDate = new Date().toISOString();
    const dueDate = this.calculateDueDate(shipper.paymentTerms);

    // Calculate financial details
    const subtotal = loadDetails?.amount || 0;
    const taxRate = 0.08; // 8% tax rate
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Calculate margins
    const carrierCost = loadDetails?.carrierCost || 0;
    const margin = subtotal - carrierCost;
    const marginPercent = subtotal > 0 ? (margin / subtotal) * 100 : 0;

    const invoice: EnterpriseInvoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber,
      tenantId,
      tenantName: this.getTenantName(tenantId),
      tenantCode,

      // Shipper integration
      shipperId: shipper.id,
      shipperCode: shipper.id,
      shipperCompanyName: shipper.companyName,
      shipperContactName: shipper.contactName || '',
      shipperEmail: shipper.email || '',
      shipperPaymentTerms: shipper.paymentTerms,
      shipperCreditRating: shipper.creditRating as any,
      shipperBusinessType: shipper.businessType,

      // Load details
      loadId: loadDetails?.loadId,
      serviceType: loadDetails?.serviceType || 'freight',

      // Financial calculations
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      currency: 'USD',

      // Status
      status: 'draft',
      paymentStatus: 'pending',
      agingBucket: 'current',
      daysOutstanding: 0,

      // Line items
      lineItems: [
        {
          id: `LI-${Date.now()}`,
          description:
            loadDetails?.description ||
            `Freight Transportation: ${loadDetails?.origin || 'Origin'} to ${loadDetails?.destination || 'Destination'}`,
          serviceCode: this.getServiceCode(
            loadDetails?.serviceType || 'freight'
          ),
          quantity: 1,
          unitPrice: subtotal,
          totalPrice: subtotal,
          taxRate,
          taxAmount,
          origin: loadDetails?.origin,
          destination: loadDetails?.destination,
          miles: loadDetails?.miles,
          weight: loadDetails?.weight,
          commodity: loadDetails?.commodity,
          equipmentType: loadDetails?.equipmentType,
          carrierCost,
          margin,
          marginPercent,
          serviceDate: loadDetails?.serviceDate || createdDate,
          driverName: loadDetails?.driverName,
          equipmentNumber: loadDetails?.equipmentNumber,
        },
      ],

      // Audit trail
      createdBy: loadDetails?.createdBy || 'system',
      createdAt: createdDate,
      dueDate,

      // Performance metrics
      profitMargin: marginPercent,
      carrierCost,
      dispatcherFee: loadDetails?.dispatcherFee || 0,
      brokerCommission: loadDetails?.brokerCommission || 0,

      // Collections
      collectionNotes: [],
      automatedReminders: true,
      lateFeesEnabled: false,
    };

    return invoice;
  }

  // Process invoice with Bill.com integration
  async processInvoiceWithBillCom(
    invoice: EnterpriseInvoice
  ): Promise<EnterpriseInvoice> {
    try {
      // Get shipper data
      const shipper = shipperService.getShipperById(invoice.shipperId);
      if (!shipper) throw new Error('Shipper not found');

      // Create or update customer in Bill.com
      const billComCustomer =
        await this.billComService.createOrUpdateCustomer(shipper);

      // Create invoice in Bill.com
      const billComInvoice = await this.billComService.createInvoice({
        ...invoice,
        billComInvoiceId: billComCustomer.id,
      });

      // Update invoice with Bill.com ID
      const updatedInvoice: EnterpriseInvoice = {
        ...invoice,
        billComInvoiceId: billComInvoice.id,
        status: 'sent',
        sentAt: new Date().toISOString(),
        sentBy: 'system',
      };

      return updatedInvoice;
    } catch (error) {
      console.error('Error processing invoice with Bill.com:', error);
      throw new Error('Failed to process invoice with Bill.com');
    }
  }

  // Send invoice
  async sendInvoice(invoice: EnterpriseInvoice): Promise<EnterpriseInvoice> {
    try {
      if (invoice.billComInvoiceId) {
        await this.billComService.sendInvoice(
          invoice.billComInvoiceId,
          invoice.shipperEmail
        );
      }

      return {
        ...invoice,
        status: 'sent',
        sentAt: new Date().toISOString(),
        sentBy: 'system',
      };
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw new Error('Failed to send invoice');
    }
  }

  // Calculate aging and update invoice status
  updateInvoiceAging(invoice: EnterpriseInvoice): EnterpriseInvoice {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const createdDate = new Date(invoice.createdAt);

    const daysOverdue = Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysOutstanding = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let agingBucket: EnterpriseInvoice['agingBucket'] = 'current';
    let status = invoice.status;

    if (daysOverdue > 0 && invoice.status !== 'paid') {
      status = 'overdue';
      if (daysOverdue <= 30) agingBucket = '1-30';
      else if (daysOverdue <= 60) agingBucket = '31-60';
      else if (daysOverdue <= 90) agingBucket = '61-90';
      else agingBucket = '90+';
    }

    return {
      ...invoice,
      status,
      agingBucket,
      daysOutstanding,
    };
  }

  // Generate shipper financial summary
  generateShipperSummary(
    shipperId: string,
    invoices: EnterpriseInvoice[]
  ): ShipperFinancialSummary {
    const shipper = shipperService.getShipperById(shipperId);
    if (!shipper) throw new Error('Shipper not found');

    const shipperInvoices = invoices.filter(
      (inv) => inv.shipperId === shipperId
    );
    const paidInvoices = shipperInvoices.filter((inv) => inv.status === 'paid');
    const overdueInvoices = shipperInvoices.filter(
      (inv) => inv.status === 'overdue'
    );
    const disputedInvoices = shipperInvoices.filter(
      (inv) => inv.status === 'disputed'
    );

    const totalRevenue = shipperInvoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );
    const outstandingBalance = shipperInvoices
      .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const overdueAmount = overdueInvoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );
    const disputedAmount = disputedInvoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );

    const averagePaymentDays =
      paidInvoices.length > 0
        ? paidInvoices.reduce((sum, inv) => sum + inv.daysOutstanding, 0) /
          paidInvoices.length
        : 0;

    const totalMargin = shipperInvoices.reduce((sum, inv) => {
      return (
        sum +
        inv.lineItems.reduce((lineSum, item) => lineSum + (item.margin || 0), 0)
      );
    }, 0);

    const averageMargin =
      shipperInvoices.length > 0 ? (totalMargin / totalRevenue) * 100 : 0;

    const onTimePaymentRate =
      shipperInvoices.length > 0
        ? (paidInvoices.filter(
            (inv) =>
              inv.daysOutstanding <=
              this.parsePaymentTerms(shipper.paymentTerms)
          ).length /
            paidInvoices.length) *
          100
        : 0;

    const disputeRate =
      shipperInvoices.length > 0
        ? (disputedInvoices.length / shipperInvoices.length) * 100
        : 0;

    return {
      shipperId: shipper.id,
      shipperName: shipper.companyName,
      shipperCode: shipper.id,
      businessType: shipper.businessType,
      creditRating: shipper.creditRating,
      paymentTerms: shipper.paymentTerms,

      totalInvoices: shipperInvoices.length,
      totalRevenue,
      averageInvoiceAmount:
        shipperInvoices.length > 0 ? totalRevenue / shipperInvoices.length : 0,
      averagePaymentDays,
      outstandingBalance,
      overdueAmount,
      disputedAmount,

      onTimePaymentRate,
      disputeRate,
      averageMargin,
      totalMargin,

      riskScore: this.calculateRiskScore(
        shipper.creditRating,
        averagePaymentDays,
        overdueInvoices.length,
        disputeRate
      ),
      creditUtilization: this.calculateCreditUtilization(
        outstandingBalance,
        shipper.creditRating
      ),
      paymentTrend: this.calculatePaymentTrend(paidInvoices),

      firstInvoiceDate:
        shipperInvoices.length > 0
          ? shipperInvoices.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )[0].createdAt
          : '',
      lastPaymentDate:
        paidInvoices.length > 0
          ? paidInvoices.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0].createdAt
          : '',
      lastContactDate: '',

      collectionNotes: shipperInvoices.reduce(
        (sum, inv) => sum + (inv.collectionNotes?.length || 0),
        0
      ),
      escalationLevel: this.calculateEscalationLevel(
        overdueAmount,
        disputeRate,
        averagePaymentDays
      ),
    };
  }

  // Helper methods
  private getTenantCode(tenantId: string): string {
    // Map tenant IDs to codes
    const tenantCodes: Record<string, string> = {
      'tenant-fleetflow-001': 'FF',
      'tenant-abc-freight': 'ABC',
      'tenant-xyz-logistics': 'XYZ',
    };
    return tenantCodes[tenantId] || 'FF';
  }

  private getTenantName(tenantId: string): string {
    const tenantNames: Record<string, string> = {
      'tenant-fleetflow-001': 'FleetFlow Enterprise',
      'tenant-abc-freight': 'ABC Freight Solutions',
      'tenant-xyz-logistics': 'XYZ Logistics Group',
    };
    return tenantNames[tenantId] || 'FleetFlow Enterprise';
  }

  private getServiceCode(serviceType: string): string {
    const serviceCodes: Record<string, string> = {
      freight: 'FRT-001',
      warehousing: 'WHS-001',
      '3pl': '3PL-001',
      dispatch: 'DSP-001',
      brokerage: 'BRK-001',
    };
    return serviceCodes[serviceType] || 'FRT-001';
  }

  private calculateDueDate(paymentTerms: string): string {
    const today = new Date();
    const daysToAdd = this.parsePaymentTerms(paymentTerms);
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0];
  }

  private parsePaymentTerms(terms: string): number {
    if (terms.includes('Net 30')) return 30;
    if (terms.includes('Net 21')) return 21;
    if (terms.includes('Net 15')) return 15;
    if (terms.includes('Net 45')) return 45;
    return 30; // Default
  }

  private calculateRiskScore(
    creditRating: string,
    avgPaymentDays: number,
    overdueCount: number,
    disputeRate: number
  ): 'Low' | 'Medium' | 'High' {
    let score = 0;

    // Credit rating scoring
    if (creditRating.includes('A')) score += 1;
    else if (creditRating.includes('B')) score += 2;
    else score += 3;

    // Payment days scoring
    if (avgPaymentDays > 45) score += 2;
    else if (avgPaymentDays > 30) score += 1;

    // Overdue count scoring
    if (overdueCount > 2) score += 2;
    else if (overdueCount > 0) score += 1;

    // Dispute rate scoring
    if (disputeRate > 10) score += 2;
    else if (disputeRate > 5) score += 1;

    if (score <= 2) return 'Low';
    if (score <= 5) return 'Medium';
    return 'High';
  }

  private calculateCreditUtilization(
    outstandingBalance: number,
    creditRating: string
  ): number {
    const creditLimit =
      this.billComService['calculateCreditLimit'](creditRating);
    return creditLimit > 0 ? (outstandingBalance / creditLimit) * 100 : 0;
  }

  private calculatePaymentTrend(
    paidInvoices: EnterpriseInvoice[]
  ): 'improving' | 'stable' | 'declining' {
    if (paidInvoices.length < 3) return 'stable';

    const recent = paidInvoices.slice(-3);
    const older = paidInvoices.slice(-6, -3);

    const recentAvg =
      recent.reduce((sum, inv) => sum + inv.daysOutstanding, 0) / recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, inv) => sum + inv.daysOutstanding, 0) /
          older.length
        : recentAvg;

    if (recentAvg < olderAvg - 5) return 'improving';
    if (recentAvg > olderAvg + 5) return 'declining';
    return 'stable';
  }

  private calculateEscalationLevel(
    overdueAmount: number,
    disputeRate: number,
    avgPaymentDays: number
  ): 'none' | 'gentle' | 'firm' | 'legal' {
    if (overdueAmount === 0) return 'none';
    if (overdueAmount < 5000 && avgPaymentDays < 45) return 'gentle';
    if (overdueAmount < 15000 && disputeRate < 10) return 'firm';
    return 'legal';
  }
}

export default EnterpriseInvoiceService;
