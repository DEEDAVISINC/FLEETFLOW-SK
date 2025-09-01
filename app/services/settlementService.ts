// Settlement Management Service
// Handles driver, carrier, and broker settlement calculations and management

export interface SettlementData {
  id: string;
  type: 'driver' | 'carrier' | 'broker';
  entityId: string;
  entityName: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: {
    taxes: number;
    insurance: number;
    equipment: number;
    fuel: number;
    permits: number;
    maintenance: number;
    other: number;
  };
  netPay: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  createdDate: string;
  approvedDate?: string;
  paymentDate?: string;
  loads: string[];
  notes?: string;
  paymentMethod?: 'check' | 'ach' | 'wire' | 'direct_deposit';
  approvedBy?: string;
}

export interface LoadProfitability {
  loadId: string;
  customerId: string;
  customerName: string;
  carrierId: string;
  carrierName: string;
  brokerId?: string;
  brokerName?: string;
  driverId?: string;
  driverName?: string;
  route: {
    origin: string;
    destination: string;
    miles: number;
  };
  financial: {
    customerRate: number;
    carrierPay: number;
    brokerCommission: number;
    dispatchFee: number;
    fuelCosts: number;
    tollCosts: number;
    permitCosts: number;
    maintenanceCosts: number;
    otherExpenses: number;
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    costPerMile: number;
    revenuePerMile: number;
  };
  dates: {
    pickupDate: string;
    deliveryDate: string;
    invoiceDate: string;
    paidDate?: string;
  };
}

export interface FinancialMetrics {
  role: 'broker' | 'dispatcher' | 'driver' | 'carrier' | 'admin';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dateRange: {
    start: string;
    end: string;
  };
  revenue: {
    total: number;
    byCustomer: { [customerId: string]: number };
    byRoute: { [route: string]: number };
    byPeriod: { [period: string]: number };
  };
  expenses: {
    total: number;
    byCategory: {
      fuel: number;
      maintenance: number;
      tolls: number;
      permits: number;
      insurance: number;
      equipment: number;
      other: number;
    };
    byVehicle: { [vehicleId: string]: number };
  };
  profitability: {
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    avgProfitPerLoad: number;
    avgMarginPerLoad: number;
  };
  cashFlow: {
    inflow: number;
    outflow: number;
    netCashFlow: number;
    outstandingReceivables: number;
    outstandingPayables: number;
  };
  kpis: {
    loadCount: number;
    avgRevenuePerLoad: number;
    avgCostPerMile: number;
    avgRevenuePerMile: number;
    onTimeDeliveryRate: number;
    collectionRate: number;
    avgPaymentDays: number;
  };
}

// Mock storage - in production this would be a real database
let SETTLEMENTS_DB: SettlementData[] = [];
let PROFITABILITY_DB: LoadProfitability[] = [];

// Initialize with mock data
const initializeMockData = () => {
  // Mock settlements
  SETTLEMENTS_DB = [
    {
      id: 'SET-001',
      type: 'driver',
      entityId: 'DRV-001',
      entityName: 'Mike Johnson',
      periodStart: '2024-12-01',
      periodEnd: '2024-12-31',
      grossPay: 3200,
      deductions: {
        taxes: 480,
        insurance: 150,
        equipment: 100,
        fuel: 0,
        permits: 0,
        maintenance: 0,
        other: 0,
      },
      netPay: 2470,
      status: 'approved',
      createdDate: '2024-12-31',
      loads: ['LD-001', 'LD-003', 'LD-005'],
      paymentMethod: 'direct_deposit',
    },
    {
      id: 'SET-002',
      type: 'broker',
      entityId: 'BRK-001',
      entityName: 'Sarah Wilson',
      periodStart: '2024-12-01',
      periodEnd: '2024-12-31',
      grossPay: 2850,
      deductions: {
        taxes: 427,
        insurance: 0,
        equipment: 0,
        fuel: 0,
        permits: 0,
        maintenance: 0,
        other: 100,
      },
      netPay: 2323,
      status: 'pending',
      createdDate: '2024-12-31',
      loads: ['LD-002', 'LD-004'],
      paymentMethod: 'ach',
    },
    {
      id: 'SET-003',
      type: 'carrier',
      entityId: 'CAR-001',
      entityName: 'ABC Transport LLC',
      periodStart: '2024-12-01',
      periodEnd: '2024-12-31',
      grossPay: 18500,
      deductions: {
        taxes: 0,
        insurance: 850,
        equipment: 200,
        fuel: 2200,
        permits: 150,
        maintenance: 400,
        other: 0,
      },
      netPay: 14700,
      status: 'paid',
      createdDate: '2024-12-28',
      paymentDate: '2024-12-30',
      loads: ['LD-001', 'LD-002', 'LD-003', 'LD-004', 'LD-005'],
      paymentMethod: 'ach',
    },
  ];

  // Mock profitability data
  PROFITABILITY_DB = [
    {
      loadId: 'LD-001',
      customerId: 'CUST-001',
      customerName: 'ABC Manufacturing',
      carrierId: 'CAR-001',
      carrierName: 'Reliable Transport',
      brokerId: 'BRK-001',
      brokerName: 'Sarah Wilson',
      driverId: 'DRV-001',
      driverName: 'Mike Johnson',
      route: {
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        miles: 650,
      },
      financial: {
        customerRate: 2450,
        carrierPay: 1850,
        brokerCommission: 245,
        dispatchFee: 122,
        fuelCosts: 285,
        tollCosts: 45,
        permitCosts: 0,
        maintenanceCosts: 65,
        otherExpenses: 25,
        totalRevenue: 2450,
        totalCosts: 2337,
        grossProfit: 600,
        netProfit: 113,
        profitMargin: 4.6,
        costPerMile: 3.59,
        revenuePerMile: 3.77,
      },
      dates: {
        pickupDate: '2024-12-15',
        deliveryDate: '2024-12-16',
        invoiceDate: '2024-12-16',
        paidDate: '2024-12-30',
      },
    },
    {
      loadId: 'LD-002',
      customerId: 'CUST-002',
      customerName: 'XYZ Logistics',
      carrierId: 'CAR-002',
      carrierName: 'Quick Freight',
      brokerId: 'BRK-002',
      brokerName: 'John Smith',
      route: {
        origin: 'Chicago, IL',
        destination: 'Houston, TX',
        miles: 925,
      },
      financial: {
        customerRate: 3200,
        carrierPay: 2400,
        brokerCommission: 320,
        dispatchFee: 160,
        fuelCosts: 405,
        tollCosts: 85,
        permitCosts: 25,
        maintenanceCosts: 95,
        otherExpenses: 15,
        totalRevenue: 3200,
        totalCosts: 3025,
        grossProfit: 800,
        netProfit: 175,
        profitMargin: 5.5,
        costPerMile: 3.27,
        revenuePerMile: 3.46,
      },
      dates: {
        pickupDate: '2024-12-18',
        deliveryDate: '2024-12-20',
        invoiceDate: '2024-12-20',
      },
    },
  ];
};

// Initialize mock data
initializeMockData();

// Load data from localStorage
const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const settlements = localStorage.getItem('fleetflow_settlements');
    const profitability = localStorage.getItem('fleetflow_profitability');

    if (settlements) {
      try {
        SETTLEMENTS_DB = JSON.parse(settlements);
      } catch (error) {
        console.error('Error loading settlements:', error);
      }
    }

    if (profitability) {
      try {
        PROFITABILITY_DB = JSON.parse(profitability);
      } catch (error) {
        console.error('Error loading profitability:', error);
      }
    }
  }
};

// Save data to localStorage
const saveToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      'fleetflow_settlements',
      JSON.stringify(SETTLEMENTS_DB)
    );
    localStorage.setItem(
      'fleetflow_profitability',
      JSON.stringify(PROFITABILITY_DB)
    );
  }
};

// Settlement Management Functions

export const createSettlement = (
  settlementData: Omit<SettlementData, 'id' | 'createdDate'>
): SettlementData => {
  const settlement: SettlementData = {
    ...settlementData,
    id: `SET-${Date.now()}`,
    createdDate: new Date().toISOString(),
  };

  SETTLEMENTS_DB.push(settlement);
  saveToStorage();

  return settlement;
};

export const getSettlements = (filters?: {
  type?: 'driver' | 'carrier' | 'broker';
  status?: 'pending' | 'approved' | 'paid' | 'cancelled';
  entityId?: string;
  periodStart?: string;
  periodEnd?: string;
}): SettlementData[] => {
  let settlements = [...SETTLEMENTS_DB];

  if (filters) {
    if (filters.type) {
      settlements = settlements.filter((s) => s.type === filters.type);
    }
    if (filters.status) {
      settlements = settlements.filter((s) => s.status === filters.status);
    }
    if (filters.entityId) {
      settlements = settlements.filter((s) => s.entityId === filters.entityId);
    }
    if (filters.periodStart) {
      settlements = settlements.filter(
        (s) => s.periodStart >= filters.periodStart!
      );
    }
    if (filters.periodEnd) {
      settlements = settlements.filter(
        (s) => s.periodEnd <= filters.periodEnd!
      );
    }
  }

  return settlements.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
};

export const updateSettlementStatus = (
  settlementId: string,
  status: SettlementData['status'],
  approvedBy?: string
): boolean => {
  const settlementIndex = SETTLEMENTS_DB.findIndex(
    (s) => s.id === settlementId
  );
  if (settlementIndex === -1) return false;

  const updates: Partial<SettlementData> = { status };

  if (status === 'approved') {
    updates.approvedDate = new Date().toISOString();
    if (approvedBy) updates.approvedBy = approvedBy;
  } else if (status === 'paid') {
    updates.paymentDate = new Date().toISOString();
  }

  SETTLEMENTS_DB[settlementIndex] = {
    ...SETTLEMENTS_DB[settlementIndex],
    ...updates,
  };
  saveToStorage();

  return true;
};

// Profitability Analysis Functions

export const calculateLoadProfitability = (loadData: {
  loadId: string;
  customerRate: number;
  carrierPay: number;
  brokerCommission?: number;
  dispatchFee?: number;
  expenses: {
    fuel: number;
    tolls: number;
    permits: number;
    maintenance: number;
    other: number;
  };
  // Accessorial fees to charge back to broker/shipper via Square
  accessorials?: {
    detention: number;
    lumper: number;
    other: number;
    total: number;
    squareInvoiceId?: string; // Square invoice ID for accessorial charges
    squarePaymentStatus?: 'pending' | 'paid' | 'failed' | 'cancelled';
  };
  miles: number;
}): Partial<LoadProfitability['financial']> => {
  const {
    customerRate,
    carrierPay,
    brokerCommission = 0,
    dispatchFee = 0,
    expenses,
    miles,
  } = loadData;

  const totalExpenses = Object.values(expenses).reduce(
    (sum, exp) => sum + exp,
    0
  );
  const totalCosts =
    carrierPay + brokerCommission + dispatchFee + totalExpenses;
  const grossProfit = customerRate - carrierPay;
  const netProfit = customerRate - totalCosts;
  const profitMargin = customerRate > 0 ? (netProfit / customerRate) * 100 : 0;
  const costPerMile = miles > 0 ? totalCosts / miles : 0;
  const revenuePerMile = miles > 0 ? customerRate / miles : 0;

  return {
    customerRate,
    carrierPay,
    brokerCommission,
    dispatchFee,
    fuelCosts: expenses.fuel,
    tollCosts: expenses.tolls,
    permitCosts: expenses.permits,
    maintenanceCosts: expenses.maintenance,
    otherExpenses: expenses.other,
    totalRevenue: customerRate,
    totalCosts,
    grossProfit,
    netProfit,
    profitMargin,
    costPerMile,
    revenuePerMile,
  };
};

export const getProfitabilityData = (filters?: {
  customerId?: string;
  carrierId?: string;
  brokerId?: string;
  dateStart?: string;
  dateEnd?: string;
  minMargin?: number;
}): LoadProfitability[] => {
  let data = [...PROFITABILITY_DB];

  if (filters) {
    if (filters.customerId) {
      data = data.filter((d) => d.customerId === filters.customerId);
    }
    if (filters.carrierId) {
      data = data.filter((d) => d.carrierId === filters.carrierId);
    }
    if (filters.brokerId) {
      data = data.filter((d) => d.brokerId === filters.brokerId);
    }
    if (filters.dateStart) {
      data = data.filter((d) => d.dates.pickupDate >= filters.dateStart!);
    }
    if (filters.dateEnd) {
      data = data.filter((d) => d.dates.pickupDate <= filters.dateEnd!);
    }
    if (filters.minMargin !== undefined) {
      data = data.filter((d) => d.financial.profitMargin >= filters.minMargin!);
    }
  }

  return data.sort(
    (a, b) =>
      new Date(b.dates.pickupDate).getTime() -
      new Date(a.dates.pickupDate).getTime()
  );
};

// Financial Metrics Calculation

export const calculateFinancialMetrics = (
  role: FinancialMetrics['role'],
  period: FinancialMetrics['period'],
  entityId?: string
): FinancialMetrics => {
  const now = new Date();
  let dateRange: { start: string; end: string };

  // Calculate date range based on period
  switch (period) {
    case 'daily':
      dateRange = {
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString(),
        end: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        ).toISOString(),
      };
      break;
    case 'weekly':
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateRange = { start: weekStart.toISOString(), end: now.toISOString() };
      break;
    case 'monthly':
      dateRange = {
        start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
      };
      break;
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      dateRange = {
        start: new Date(now.getFullYear(), quarter * 3, 1).toISOString(),
        end: new Date(now.getFullYear(), quarter * 3 + 3, 0).toISOString(),
      };
      break;
    case 'yearly':
      dateRange = {
        start: new Date(now.getFullYear(), 0, 1).toISOString(),
        end: new Date(now.getFullYear(), 11, 31).toISOString(),
      };
      break;
    default:
      dateRange = {
        start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
      };
  }

  // Filter profitability data based on role and entity
  let filteredData = PROFITABILITY_DB.filter(
    (d) =>
      d.dates.pickupDate >= dateRange.start &&
      d.dates.pickupDate <= dateRange.end
  );

  if (entityId) {
    switch (role) {
      case 'broker':
        filteredData = filteredData.filter((d) => d.brokerId === entityId);
        break;
      case 'driver':
        filteredData = filteredData.filter((d) => d.driverId === entityId);
        break;
      case 'carrier':
        filteredData = filteredData.filter((d) => d.carrierId === entityId);
        break;
    }
  }

  // Calculate aggregated metrics
  const totalRevenue = filteredData.reduce(
    (sum, d) => sum + d.financial.totalRevenue,
    0
  );
  const totalCosts = filteredData.reduce(
    (sum, d) => sum + d.financial.totalCosts,
    0
  );
  const grossProfit = filteredData.reduce(
    (sum, d) => sum + d.financial.grossProfit,
    0
  );
  const netProfit = filteredData.reduce(
    (sum, d) => sum + d.financial.netProfit,
    0
  );

  const metrics: FinancialMetrics = {
    role,
    period,
    dateRange,
    revenue: {
      total: totalRevenue,
      byCustomer: {},
      byRoute: {},
      byPeriod: {},
    },
    expenses: {
      total: totalCosts,
      byCategory: {
        fuel: filteredData.reduce((sum, d) => sum + d.financial.fuelCosts, 0),
        maintenance: filteredData.reduce(
          (sum, d) => sum + d.financial.maintenanceCosts,
          0
        ),
        tolls: filteredData.reduce((sum, d) => sum + d.financial.tollCosts, 0),
        permits: filteredData.reduce(
          (sum, d) => sum + d.financial.permitCosts,
          0
        ),
        insurance: 0, // Would be calculated from separate insurance data
        equipment: 0, // Would be calculated from separate equipment data
        other: filteredData.reduce(
          (sum, d) => sum + d.financial.otherExpenses,
          0
        ),
      },
      byVehicle: {},
    },
    profitability: {
      grossProfit,
      netProfit,
      profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      avgProfitPerLoad:
        filteredData.length > 0 ? netProfit / filteredData.length : 0,
      avgMarginPerLoad:
        filteredData.length > 0
          ? filteredData.reduce((sum, d) => sum + d.financial.profitMargin, 0) /
            filteredData.length
          : 0,
    },
    cashFlow: {
      inflow: totalRevenue,
      outflow: totalCosts,
      netCashFlow: totalRevenue - totalCosts,
      outstandingReceivables: 0, // Would be calculated from invoice data
      outstandingPayables: 0, // Would be calculated from payables data
    },
    kpis: {
      loadCount: filteredData.length,
      avgRevenuePerLoad:
        filteredData.length > 0 ? totalRevenue / filteredData.length : 0,
      avgCostPerMile:
        filteredData.length > 0
          ? filteredData.reduce((sum, d) => sum + d.financial.costPerMile, 0) /
            filteredData.length
          : 0,
      avgRevenuePerMile:
        filteredData.length > 0
          ? filteredData.reduce(
              (sum, d) => sum + d.financial.revenuePerMile,
              0
            ) / filteredData.length
          : 0,
      onTimeDeliveryRate: 95.5, // Would be calculated from delivery data
      collectionRate: 94.2, // Would be calculated from payment data
      avgPaymentDays: 18.5, // Would be calculated from payment data
    },
  };

  return metrics;
};

// ========================================
// SQUARE ACCESSORIAL FEE MANAGEMENT
// ========================================

export const createAccessorialInvoice = async (
  loadId: string,
  brokerId: string,
  accessorialFees: {
    detention?: {
      hours: number;
      rate: number;
      location: string;
      total: number;
    };
    lumper?: { amount: number; location: string; receiptNumber?: string };
    other?: Array<{ type: string; description: string; amount: number }>;
  }
): Promise<{ success: boolean; invoiceId?: string; error?: string }> => {
  try {
    // Import Square service dynamically to avoid circular dependencies
    const { MultiTenantSquareService } = await import(
      './MultiTenantSquareService'
    );

    // Calculate total accessorial amount
    let totalAmount = 0;
    const lineItems: Array<{
      name: string;
      quantity: number;
      basePriceMoney: { amount: number; currency: string };
    }> = [];

    // Add detention fees
    if (accessorialFees.detention) {
      totalAmount += accessorialFees.detention.total;
      lineItems.push({
        name: `Detention Fee - ${accessorialFees.detention.location} (${accessorialFees.detention.hours} hours)`,
        quantity: 1,
        basePriceMoney: {
          amount: accessorialFees.detention.total * 100, // Square uses cents
          currency: 'USD',
        },
      });
    }

    // Add lumper fees
    if (accessorialFees.lumper) {
      totalAmount += accessorialFees.lumper.amount;
      lineItems.push({
        name: `Lumper Fee - ${accessorialFees.lumper.location}${accessorialFees.lumper.receiptNumber ? ` (Receipt: ${accessorialFees.lumper.receiptNumber})` : ''}`,
        quantity: 1,
        basePriceMoney: {
          amount: accessorialFees.lumper.amount * 100, // Square uses cents
          currency: 'USD',
        },
      });
    }

    // Add other accessorial fees
    if (accessorialFees.other && accessorialFees.other.length > 0) {
      accessorialFees.other.forEach((fee) => {
        totalAmount += fee.amount;
        lineItems.push({
          name: `${fee.type} - ${fee.description}`,
          quantity: 1,
          basePriceMoney: {
            amount: fee.amount * 100, // Square uses cents
            currency: 'USD',
          },
        });
      });
    }

    // Create Square invoice
    const invoiceData = {
      invoiceNumber: `ACC-${loadId}-${Date.now()}`,
      title: `Accessorial Fees - Load ${loadId}`,
      description: `Accessorial charges for load ${loadId}`,
      primaryRecipient: {
        customerId: brokerId,
      },
      paymentRequests: [
        {
          requestMethod: 'EMAIL',
          requestType: 'BALANCE',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0], // 30 days from now
        },
      ],
      deliveryMethod: 'EMAIL',
      invoiceRequestMethod: 'EMAIL',
      personalMessage: `Accessorial fees for Load ${loadId}. Total amount: $${totalAmount.toFixed(2)}`,
      orderSource: {
        name: 'FleetFlow Accessorial Billing',
      },
      order: {
        locationId: 'main', // This should be your Square location ID
        lineItems: lineItems,
      },
    };

    // Use Square service to create invoice
    const squareService = new MultiTenantSquareService();
    const result = await squareService.createInvoice({
      tenantId: brokerId,
      customerId: brokerId,
      invoiceTitle: `Accessorial Fees - Load ${loadId}`,
      description: `Accessorial charges for load ${loadId}`,
      lineItems: lineItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        rate: item.basePriceMoney.amount / 100,
        amount: item.basePriceMoney.amount / 100,
      })),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    });

    if (result.success && result.invoice) {
      console.info(
        `✅ Square accessorial invoice created: ${result.invoice.id} for Load ${loadId}`
      );
      return {
        success: true,
        invoiceId: result.invoice.id,
      };
    } else {
      console.error(
        '❌ Failed to create Square accessorial invoice:',
        result.error
      );
      return {
        success: false,
        error: result.error || 'Failed to create invoice',
      };
    }
  } catch (error) {
    console.error('❌ Error creating accessorial invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const processAccessorialPayment = async (
  invoiceId: string,
  paymentAmount: number
): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
  try {
    const { MultiTenantSquareService } = await import(
      './MultiTenantSquareService'
    );

    // Process payment through Square
    const squareService = new MultiTenantSquareService();
    const result = await squareService.processPayment({
      tenantId: 'admin',
      amount: paymentAmount * 100, // Square uses cents
      currency: 'USD',
      sourceId: 'card-nonce-ok', // This would come from Square's payment form
      description: `Accessorial fee payment for invoice ${invoiceId}`,
      metadata: { invoiceId: invoiceId },
    });

    if (result.success) {
      console.info(
        `✅ Accessorial payment processed: ${result.paymentId} for invoice ${invoiceId}`
      );
      return {
        success: true,
        paymentId: result.paymentId,
      };
    } else {
      console.error('❌ Failed to process accessorial payment:', result.error);
      return {
        success: false,
        error: result.error || 'Payment processing failed',
      };
    }
  } catch (error) {
    console.error('❌ Error processing accessorial payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getAccessorialFeeStatus = async (
  invoiceId: string
): Promise<{
  status: string;
  amount?: number;
  paidAmount?: number;
  dueDate?: string;
}> => {
  try {
    const { MultiTenantSquareService } = await import(
      './MultiTenantSquareService'
    );

    // Get invoice status from Square
    const squareService = new MultiTenantSquareService();
    const result = await squareService.getInvoice('admin', invoiceId);

    if (result.success && result.invoice) {
      return {
        status: result.invoice.invoiceStatus || 'UNKNOWN',
        amount: result.invoice.orderValue?.totalMoney?.amount
          ? result.invoice.orderValue.totalMoney.amount / 100
          : 0,
        paidAmount: result.invoice.totalCompletedAmountMoney?.amount
          ? result.invoice.totalCompletedAmountMoney.amount / 100
          : 0,
        dueDate: result.invoice.nextPaymentAmountMoney?.dueDate,
      };
    } else {
      console.warn(
        '⚠️ Could not retrieve accessorial invoice status:',
        result.error
      );
      return { status: 'UNKNOWN' };
    }
  } catch (error) {
    console.error('❌ Error getting accessorial fee status:', error);
    return { status: 'ERROR' };
  }
};

// Settlement Summary Functions

export const getSettlementSummary = () => {
  const totalPending = SETTLEMENTS_DB.filter(
    (s) => s.status === 'pending'
  ).reduce((sum, s) => sum + s.netPay, 0);
  const totalApproved = SETTLEMENTS_DB.filter(
    (s) => s.status === 'approved'
  ).reduce((sum, s) => sum + s.netPay, 0);
  const totalPaid = SETTLEMENTS_DB.filter((s) => s.status === 'paid').reduce(
    (sum, s) => sum + s.netPay,
    0
  );

  return {
    counts: {
      total: SETTLEMENTS_DB.length,
      pending: SETTLEMENTS_DB.filter((s) => s.status === 'pending').length,
      approved: SETTLEMENTS_DB.filter((s) => s.status === 'approved').length,
      paid: SETTLEMENTS_DB.filter((s) => s.status === 'paid').length,
      cancelled: SETTLEMENTS_DB.filter((s) => s.status === 'cancelled').length,
    },
    amounts: {
      totalPending,
      totalApproved,
      totalPaid,
      totalOutstanding: totalPending + totalApproved,
    },
  };
};

// Initialize data on load
if (typeof window !== 'undefined') {
  loadFromStorage();
}

const settlementService = {
  createSettlement,
  getSettlements,
  updateSettlementStatus,
  calculateLoadProfitability,
  getProfitabilityData,
  calculateFinancialMetrics,
  getSettlementSummary,
  // Square Accessorial Fee Functions
  createAccessorialInvoice,
  processAccessorialPayment,
  getAccessorialFeeStatus,
};

export default settlementService;
