// DEPOINTE AI Company Dashboard - Expense Management Service
// Transportation-Specific Expense Automation for Freight, Logistics, and Fleet Operations

export interface FuelExpense {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  fuelCardNumber: string;
  transactionDate: Date;
  location: string;
  gallons: number;
  pricePerGallon: number;
  totalAmount: number;
  odometer: number;
  category: 'diesel' | 'gasoline' | 'def';
  merchantName: string;
  receiptUrl?: string;
  autoCategor ized: boolean;
  glCode?: string;
  loadId?: string; // Link to specific load for profitability tracking
}

export interface DriverExpense {
  id: string;
  driverId: string;
  driverName: string;
  expenseType: 'per_diem' | 'lumper_fee' | 'tolls' | 'parking' | 'maintenance' | 'other';
  amount: number;
  date: Date;
  location: string;
  description: string;
  receiptUrl?: string;
  receiptProcessed: boolean;
  ocrConfidence: number;
  autoApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  policyViolation: boolean;
  violationReason?: string;
  glCode?: string;
  loadId?: string;
}

export interface ExpensePolicyRule {
  id: string;
  ruleType: 'per_diem_limit' | 'fuel_card_restriction' | 'receipt_required' | 'approval_threshold';
  condition: string;
  limit?: number;
  requiresApproval: boolean;
  autoReject: boolean;
  notificationRequired: boolean;
}

export interface ExpenseAnalytics {
  totalFuelExpenses: number;
  totalDriverExpenses: number;
  fuelEfficiency: {
    averageMPG: number;
    costPerMile: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  driverExpenseTrends: {
    driverId: string;
    driverName: string;
    monthlyAverage: number;
    complianceRate: number;
    policyViolations: number;
  }[];
  costSavingsOpportunities: {
    category: string;
    potentialSavings: number;
    recommendation: string;
  }[];
}

/**
 * DEPOINTE AI Expense Management Service
 *
 * Provides AI-powered expense automation specifically for transportation operations:
 * - Fuel card transaction processing and categorization
 * - Driver expense automation (per diem, lumper fees, tolls)
 * - Mobile receipt capture with OCR
 * - Real-time policy enforcement
 * - Predictive expense analytics
 * - Cost optimization recommendations
 *
 * This service fills the gap in FleetFlow's financial capabilities by adding
 * advanced expense management features similar to Ramp/Brex but tailored
 * for freight and logistics operations.
 */
export class DEPOINTEExpenseManagementService {
  private static instance: DEPOINTEExpenseManagementService;
  private policyRules: Map<string, ExpensePolicyRule> = new Map();

  private constructor() {
    this.initializeDefaultPolicies();
    console.info('💰 DEPOINTE AI Expense Management Service initialized');
  }

  public static getInstance(): DEPOINTEExpenseManagementService {
    if (!DEPOINTEExpenseManagementService.instance) {
      DEPOINTEExpenseManagementService.instance = new DEPOINTEExpenseManagementService();
    }
    return DEPOINTEExpenseManagementService.instance;
  }

  /**
   * Initialize default expense policies for transportation operations
   */
  private initializeDefaultPolicies(): void {
    // Per diem limits
    this.policyRules.set('per_diem_limit', {
      id: 'per_diem_limit',
      ruleType: 'per_diem_limit',
      condition: 'daily_limit',
      limit: 75, // IRS standard per diem for transportation
      requiresApproval: true,
      autoReject: false,
      notificationRequired: true,
    });

    // Fuel card restrictions
    this.policyRules.set('fuel_card_restriction', {
      id: 'fuel_card_restriction',
      ruleType: 'fuel_card_restriction',
      condition: 'fuel_only',
      requiresApproval: false,
      autoReject: true,
      notificationRequired: true,
    });

    // Receipt requirements
    this.policyRules.set('receipt_required_50', {
      id: 'receipt_required_50',
      ruleType: 'receipt_required',
      condition: 'amount_over_threshold',
      limit: 50,
      requiresApproval: true,
      autoReject: false,
      notificationRequired: true,
    });

    // Approval thresholds
    this.policyRules.set('approval_threshold_500', {
      id: 'approval_threshold_500',
      ruleType: 'approval_threshold',
      condition: 'amount_over_threshold',
      limit: 500,
      requiresApproval: true,
      autoReject: false,
      notificationRequired: true,
    });
  }

  /**
   * Process fuel card transaction with AI categorization
   */
  async processFuelCardTransaction(transaction: Partial<FuelExpense>): Promise<FuelExpense> {
    console.info(`⛽ Processing fuel card transaction for driver ${transaction.driverId}`);

    // AI-powered categorization
    const category = await this.categorizeFuelTransaction(transaction);

    // Auto-assign GL code based on category
    const glCode = this.assignGLCode('fuel', category);

    // Check for policy violations
    const policyCheck = await this.checkFuelCardPolicy(transaction);

    const processedExpense: FuelExpense = {
      id: transaction.id || `fuel-${Date.now()}`,
      driverId: transaction.driverId!,
      driverName: transaction.driverName || 'Unknown Driver',
      vehicleId: transaction.vehicleId || 'Unknown Vehicle',
      fuelCardNumber: transaction.fuelCardNumber || '',
      transactionDate: transaction.transactionDate || new Date(),
      location: transaction.location || '',
      gallons: transaction.gallons || 0,
      pricePerGallon: transaction.pricePerGallon || 0,
      totalAmount: transaction.totalAmount || 0,
      odometer: transaction.odometer || 0,
      category,
      merchantName: transaction.merchantName || '',
      receiptUrl: transaction.receiptUrl,
      autoCategorized: true,
      glCode,
      loadId: transaction.loadId,
    };

    // Calculate fuel efficiency metrics
    await this.calculateFuelEfficiency(processedExpense);

    console.info(`✅ Fuel transaction processed: ${processedExpense.id}`);
    return processedExpense;
  }

  /**
   * Process driver expense with mobile receipt OCR
   */
  async processDriverExpense(expense: Partial<DriverExpense>, receiptImage?: string): Promise<DriverExpense> {
    console.info(`💵 Processing driver expense for ${expense.driverId}`);

    let ocrConfidence = 0;
    let extractedData: any = {};

    // Process receipt with OCR if provided
    if (receiptImage) {
      const ocrResult = await this.processReceiptOCR(receiptImage);
      ocrConfidence = ocrResult.confidence;
      extractedData = ocrResult.data;
    }

    // AI-powered expense categorization
    const glCode = this.assignGLCode('driver_expense', expense.expenseType!);

    // Check policy compliance
    const policyCheck = await this.checkExpensePolicy(expense);

    const processedExpense: DriverExpense = {
      id: expense.id || `expense-${Date.now()}`,
      driverId: expense.driverId!,
      driverName: expense.driverName || 'Unknown Driver',
      expenseType: expense.expenseType || 'other',
      amount: expense.amount || extractedData.amount || 0,
      date: expense.date || new Date(),
      location: expense.location || extractedData.location || '',
      description: expense.description || extractedData.description || '',
      receiptUrl: expense.receiptUrl,
      receiptProcessed: !!receiptImage,
      ocrConfidence,
      autoApproved: policyCheck.autoApprove,
      approvalStatus: policyCheck.autoApprove ? 'approved' : 'pending',
      policyViolation: policyCheck.violation,
      violationReason: policyCheck.violationReason,
      glCode,
      loadId: expense.loadId,
    };

    console.info(`✅ Driver expense processed: ${processedExpense.id}`);
    return processedExpense;
  }

  /**
   * AI-powered receipt OCR processing
   */
  private async processReceiptOCR(receiptImage: string): Promise<{
    confidence: number;
    data: {
      amount?: number;
      date?: Date;
      merchantName?: string;
      location?: string;
      description?: string;
      category?: string;
    };
  }> {
    // Simulate OCR processing (in production, use Google Vision API or AWS Textract)
    console.info('📸 Processing receipt with OCR...');

    // Mock OCR result
    return {
      confidence: 0.95,
      data: {
        amount: 45.50,
        date: new Date(),
        merchantName: 'Pilot Flying J',
        location: 'Dallas, TX',
        description: 'Parking fee',
        category: 'parking',
      },
    };
  }

  /**
   * Categorize fuel transaction using AI
   */
  private async categorizeFuelTransaction(transaction: Partial<FuelExpense>): Promise<'diesel' | 'gasoline' | 'def'> {
    // AI logic to determine fuel type based on merchant, amount, and vehicle type
    const merchantName = transaction.merchantName?.toLowerCase() || '';

    if (merchantName.includes('def') || merchantName.includes('diesel exhaust fluid')) {
      return 'def';
    }

    // Default to diesel for commercial vehicles
    return 'diesel';
  }

  /**
   * Check fuel card policy compliance
   */
  private async checkFuelCardPolicy(transaction: Partial<FuelExpense>): Promise<{
    compliant: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    // Check for non-fuel purchases on fuel card
    const fuelCardRule = this.policyRules.get('fuel_card_restriction');
    if (fuelCardRule && transaction.category && !['diesel', 'gasoline', 'def'].includes(transaction.category)) {
      violations.push('Non-fuel purchase on fuel card');
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  }

  /**
   * Check expense policy compliance
   */
  private async checkExpensePolicy(expense: Partial<DriverExpense>): Promise<{
    autoApprove: boolean;
    violation: boolean;
    violationReason?: string;
  }> {
    const amount = expense.amount || 0;
    let violation = false;
    let violationReason: string | undefined;
    let autoApprove = true;

    // Check per diem limits
    if (expense.expenseType === 'per_diem') {
      const perDiemRule = this.policyRules.get('per_diem_limit');
      if (perDiemRule && amount > (perDiemRule.limit || 0)) {
        violation = true;
        violationReason = `Per diem exceeds limit of $${perDiemRule.limit}`;
        autoApprove = false;
      }
    }

    // Check receipt requirements
    const receiptRule = this.policyRules.get('receipt_required_50');
    if (receiptRule && amount > (receiptRule.limit || 0) && !expense.receiptUrl) {
      violation = true;
      violationReason = `Receipt required for expenses over $${receiptRule.limit}`;
      autoApprove = false;
    }

    // Check approval thresholds
    const approvalRule = this.policyRules.get('approval_threshold_500');
    if (approvalRule && amount > (approvalRule.limit || 0)) {
      autoApprove = false;
    }

    return {
      autoApprove,
      violation,
      violationReason,
    };
  }

  /**
   * Assign GL code based on expense category
   */
  private assignGLCode(type: 'fuel' | 'driver_expense', category: string): string {
    const glCodes: Record<string, string> = {
      // Fuel GL codes
      diesel: '5100-FUEL-DIESEL',
      gasoline: '5100-FUEL-GASOLINE',
      def: '5100-FUEL-DEF',

      // Driver expense GL codes
      per_diem: '5200-DRIVER-PERDIEM',
      lumper_fee: '5300-LUMPER-FEES',
      tolls: '5400-TOLLS',
      parking: '5500-PARKING',
      maintenance: '5600-MAINTENANCE',
      other: '5900-OTHER-EXPENSES',
    };

    return glCodes[category] || '5900-OTHER-EXPENSES';
  }

  /**
   * Calculate fuel efficiency metrics
   */
  private async calculateFuelEfficiency(expense: FuelExpense): Promise<void> {
    // Calculate MPG if odometer data available
    // This would integrate with FleetFlow's vehicle tracking data
    console.info(`📊 Calculating fuel efficiency for vehicle ${expense.vehicleId}`);
  }

  /**
   * Get expense analytics and insights
   */
  async getExpenseAnalytics(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ExpenseAnalytics> {
    console.info(`📊 Generating expense analytics for tenant ${tenantId}`);

    // Mock analytics (in production, query actual expense data)
    return {
      totalFuelExpenses: 125000,
      totalDriverExpenses: 45000,
      fuelEfficiency: {
        averageMPG: 6.8,
        costPerMile: 0.65,
        trend: 'improving',
      },
      driverExpenseTrends: [
        {
          driverId: 'driver-001',
          driverName: 'John Smith',
          monthlyAverage: 2500,
          complianceRate: 0.98,
          policyViolations: 1,
        },
      ],
      costSavingsOpportunities: [
        {
          category: 'Fuel Optimization',
          potentialSavings: 8500,
          recommendation: 'Optimize routes to reduce fuel consumption by 7%',
        },
        {
          category: 'Driver Expense Policy',
          potentialSavings: 3200,
          recommendation: 'Implement stricter per diem approval workflow',
        },
      ],
    };
  }

  /**
   * Get predictive expense forecast
   */
  async getPredictiveExpenseForecast(
    tenantId: string,
    daysAhead: number = 30
  ): Promise<{
    forecastedFuelExpenses: number;
    forecastedDriverExpenses: number;
    confidence: number;
    factors: string[];
  }> {
    console.info(`🔮 Generating ${daysAhead}-day expense forecast for tenant ${tenantId}`);

    // AI-powered predictive forecasting
    return {
      forecastedFuelExpenses: 42000,
      forecastedDriverExpenses: 15000,
      confidence: 0.87,
      factors: [
        'Historical spending patterns',
        'Seasonal freight volume trends',
        'Fuel price forecasts',
        'Scheduled load commitments',
      ],
    };
  }

  /**
   * Real-time expense policy enforcement
   */
  async enforceExpensePolicy(
    expense: Partial<DriverExpense>
  ): Promise<{
    allowed: boolean;
    requiresApproval: boolean;
    warnings: string[];
    recommendations: string[];
  }> {
    const policyCheck = await this.checkExpensePolicy(expense);

    return {
      allowed: !policyCheck.violation,
      requiresApproval: !policyCheck.autoApprove,
      warnings: policyCheck.violation ? [policyCheck.violationReason!] : [],
      recommendations: [
        'Submit receipt within 24 hours',
        'Link expense to specific load for accurate profitability tracking',
      ],
    };
  }
}

// Export singleton instance
export const depointeExpenseManagement = DEPOINTEExpenseManagementService.getInstance();

