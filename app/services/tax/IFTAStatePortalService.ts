// IFTA State Portal APIs Integration Service
// Handles Interstate Fuel Tax Agreement compliance across multiple states

interface IFTAJurisdiction {
  state: string;
  stateCode: string;
  taxRate: number; // per gallon in USD
  effectiveDate: string;
  fuelType: 'diesel' | 'gasoline' | 'both';
  apiEndpoint?: string;
  requiresRegistration: boolean;
  filingFrequency: 'quarterly' | 'monthly';
  portalUrl?: string;
}

interface FuelPurchase {
  id?: string;
  tenantId: string;
  vehicleId?: string;
  purchaseDate: string; // YYYY-MM-DD
  stateCode: string;
  gallons: number;
  pricePerGallon: number;
  totalAmount: number;
  vendorName?: string;
  receiptNumber?: string;
  fuelType: 'diesel' | 'gasoline';
  createdAt?: string;
}

interface MileageRecord {
  id?: string;
  tenantId: string;
  vehicleId: string;
  travelDate: string; // YYYY-MM-DD
  stateCode: string;
  miles: number;
  routeDetails?: string;
  createdAt?: string;
}

interface IFTAJurisdictionReturn {
  state: string;
  stateCode: string;
  totalMiles: number;
  taxableMiles: number;
  fuelPurchased: number;
  taxRate: number;
  taxOwed: number;
  taxPaid: number;
  netTaxDue: number; // positive = owe, negative = refund
}

interface IFTAQuarterlyReturn {
  tenantId: string;
  quarter: string; // "2024-Q1"
  year: number;
  quarterNumber: number;
  jurisdictions: IFTAJurisdictionReturn[];
  totalTaxDue: number;
  totalRefundDue: number;
  netAmount: number;
  filingStatus: 'draft' | 'filed' | 'accepted' | 'rejected';
  dueDate: string;
  filedDate?: string;
}

export class IFTAStatePortalService {
  private baseFleetMPG: number;
  private defaultFuelType: 'diesel' | 'gasoline';
  private filingBufferDays: number;

  constructor() {
    this.baseFleetMPG = parseFloat(process.env.IFTA_BASE_FLEET_MPG || '6.5');
    this.defaultFuelType =
      (process.env.IFTA_DEFAULT_FUEL_TYPE as 'diesel' | 'gasoline') || 'diesel';
    this.filingBufferDays = parseInt(
      process.env.IFTA_FILING_DEADLINE_BUFFER_DAYS || '7'
    );

    console.log('🗺️ IFTA State Portal Service initialized:', {
      baseFleetMPG: this.baseFleetMPG,
      defaultFuelType: this.defaultFuelType,
      filingBufferDays: this.filingBufferDays,
    });
  }

  /**
   * Get all IFTA participating jurisdictions with current tax rates
   */
  getIFTAJurisdictions(): IFTAJurisdiction[] {
    // Current IFTA tax rates (as of 2024) - these should be updated regularly
    return [
      {
        state: 'Alabama',
        stateCode: 'AL',
        taxRate: 0.19,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Arizona',
        stateCode: 'AZ',
        taxRate: 0.18,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Arkansas',
        stateCode: 'AR',
        taxRate: 0.225,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'California',
        stateCode: 'CA',
        taxRate: 0.4,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
        apiEndpoint: 'https://api.ca.gov/ifta',
      },
      {
        state: 'Colorado',
        stateCode: 'CO',
        taxRate: 0.2225,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Connecticut',
        stateCode: 'CT',
        taxRate: 0.25,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Delaware',
        stateCode: 'DE',
        taxRate: 0.22,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'District of Columbia',
        stateCode: 'DC',
        taxRate: 0.235,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Florida',
        stateCode: 'FL',
        taxRate: 0.336,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Georgia',
        stateCode: 'GA',
        taxRate: 0.295,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Idaho',
        stateCode: 'ID',
        taxRate: 0.25,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Illinois',
        stateCode: 'IL',
        taxRate: 0.405,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Indiana',
        stateCode: 'IN',
        taxRate: 0.32,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Iowa',
        stateCode: 'IA',
        taxRate: 0.245,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Kansas',
        stateCode: 'KS',
        taxRate: 0.26,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Kentucky',
        stateCode: 'KY',
        taxRate: 0.224,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Louisiana',
        stateCode: 'LA',
        taxRate: 0.2,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Maine',
        stateCode: 'ME',
        taxRate: 0.314,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Maryland',
        stateCode: 'MD',
        taxRate: 0.3675,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Massachusetts',
        stateCode: 'MA',
        taxRate: 0.24,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Michigan',
        stateCode: 'MI',
        taxRate: 0.277,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Minnesota',
        stateCode: 'MN',
        taxRate: 0.286,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Mississippi',
        stateCode: 'MS',
        taxRate: 0.184,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Missouri',
        stateCode: 'MO',
        taxRate: 0.17,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Montana',
        stateCode: 'MT',
        taxRate: 0.2775,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Nebraska',
        stateCode: 'NE',
        taxRate: 0.248,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Nevada',
        stateCode: 'NV',
        taxRate: 0.27,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'New Hampshire',
        stateCode: 'NH',
        taxRate: 0.222,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'New Jersey',
        stateCode: 'NJ',
        taxRate: 0.415,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'New Mexico',
        stateCode: 'NM',
        taxRate: 0.1875,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'New York',
        stateCode: 'NY',
        taxRate: 0.44,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'North Carolina',
        stateCode: 'NC',
        taxRate: 0.36,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'North Dakota',
        stateCode: 'ND',
        taxRate: 0.23,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Ohio',
        stateCode: 'OH',
        taxRate: 0.28,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Oklahoma',
        stateCode: 'OK',
        taxRate: 0.19,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Oregon',
        stateCode: 'OR',
        taxRate: 0.36,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Pennsylvania',
        stateCode: 'PA',
        taxRate: 0.577,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Rhode Island',
        stateCode: 'RI',
        taxRate: 0.34,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'South Carolina',
        stateCode: 'SC',
        taxRate: 0.22,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'South Dakota',
        stateCode: 'SD',
        taxRate: 0.22,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Tennessee',
        stateCode: 'TN',
        taxRate: 0.27,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Texas',
        stateCode: 'TX',
        taxRate: 0.2,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
        apiEndpoint: 'https://api.comptroller.texas.gov/ifta',
      },
      {
        state: 'Utah',
        stateCode: 'UT',
        taxRate: 0.295,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Vermont',
        stateCode: 'VT',
        taxRate: 0.3,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Virginia',
        stateCode: 'VA',
        taxRate: 0.204,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Washington',
        stateCode: 'WA',
        taxRate: 0.494,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'West Virginia',
        stateCode: 'WV',
        taxRate: 0.355,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Wisconsin',
        stateCode: 'WI',
        taxRate: 0.329,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
      {
        state: 'Wyoming',
        stateCode: 'WY',
        taxRate: 0.24,
        effectiveDate: '2024-01-01',
        fuelType: 'both',
        requiresRegistration: true,
        filingFrequency: 'quarterly',
      },
    ];
  }

  /**
   * Calculate quarterly IFTA return for a tenant
   */
  async calculateQuarterlyReturn(
    tenantId: string,
    year: number,
    quarter: number,
    fuelPurchases: FuelPurchase[],
    mileageRecords: MileageRecord[]
  ): Promise<IFTAQuarterlyReturn> {
    console.log('📊 Calculating IFTA quarterly return:', {
      tenantId,
      year,
      quarter,
      fuelPurchases: fuelPurchases.length,
      mileageRecords: mileageRecords.length,
    });

    const jurisdictions = this.getIFTAJurisdictions();
    const jurisdictionReturns: IFTAJurisdictionReturn[] = [];

    // Calculate total fleet miles for the quarter
    const totalFleetMiles = mileageRecords.reduce(
      (sum, record) => sum + record.miles,
      0
    );

    for (const jurisdiction of jurisdictions) {
      // Get fuel purchases for this state
      const stateFuelPurchases = fuelPurchases.filter(
        (purchase) => purchase.stateCode === jurisdiction.stateCode
      );

      // Get mileage for this state
      const stateMileageRecords = mileageRecords.filter(
        (record) => record.stateCode === jurisdiction.stateCode
      );

      const totalMiles = stateMileageRecords.reduce(
        (sum, record) => sum + record.miles,
        0
      );
      const fuelPurchased = stateFuelPurchases.reduce(
        (sum, purchase) => sum + purchase.gallons,
        0
      );

      // Calculate taxable miles (miles driven in this state)
      const taxableMiles = totalMiles;

      // Calculate tax owed based on miles driven
      const estimatedFuelConsumed = taxableMiles / this.baseFleetMPG;
      const taxOwed = estimatedFuelConsumed * jurisdiction.taxRate;

      // Calculate tax paid (based on fuel purchased in state)
      const taxPaid = fuelPurchased * jurisdiction.taxRate;

      // Net tax due (positive = owe money, negative = refund due)
      const netTaxDue = taxOwed - taxPaid;

      jurisdictionReturns.push({
        state: jurisdiction.state,
        stateCode: jurisdiction.stateCode,
        totalMiles,
        taxableMiles,
        fuelPurchased,
        taxRate: jurisdiction.taxRate,
        taxOwed,
        taxPaid,
        netTaxDue,
      });
    }

    // Calculate totals
    const totalTaxDue = jurisdictionReturns
      .filter((j) => j.netTaxDue > 0)
      .reduce((sum, j) => sum + j.netTaxDue, 0);

    const totalRefundDue = Math.abs(
      jurisdictionReturns
        .filter((j) => j.netTaxDue < 0)
        .reduce((sum, j) => sum + j.netTaxDue, 0)
    );

    const netAmount = totalTaxDue - totalRefundDue;

    // Calculate due date (last day of month following quarter end)
    const dueDate = this.calculateQuarterlyDueDate(year, quarter);

    return {
      tenantId,
      quarter: `${year}-Q${quarter}`,
      year,
      quarterNumber: quarter,
      jurisdictions: jurisdictionReturns,
      totalTaxDue,
      totalRefundDue,
      netAmount,
      filingStatus: 'draft',
      dueDate,
    };
  }

  /**
   * Calculate due date for quarterly IFTA return
   */
  private calculateQuarterlyDueDate(year: number, quarter: number): string {
    // IFTA returns are due by the last day of the month following the quarter end
    const quarterEndMonths = [3, 6, 9, 12]; // March, June, September, December
    const quarterEndMonth = quarterEndMonths[quarter - 1];
    const dueMonth = quarterEndMonth === 12 ? 1 : quarterEndMonth + 1;
    const dueYear = quarterEndMonth === 12 ? year + 1 : year;

    // Get last day of due month
    const lastDayOfMonth = new Date(dueYear, dueMonth, 0).getDate();

    return `${dueYear}-${dueMonth.toString().padStart(2, '0')}-${lastDayOfMonth}`;
  }

  /**
   * Get compliance status for a tenant
   */
  async getComplianceStatus(tenantId: string): Promise<{
    currentQuarter: string;
    upcomingDeadlines: Array<{
      quarter: string;
      dueDate: string;
      daysUntilDue: number;
    }>;
    overdueReturns: Array<{
      quarter: string;
      dueDate: string;
      daysOverdue: number;
    }>;
    registrationStatus: 'active' | 'expired' | 'pending';
  }> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentQuarter = Math.ceil(currentMonth / 3);

    // Calculate upcoming deadlines
    const upcomingDeadlines = [];
    for (let i = 0; i < 4; i++) {
      let quarter = currentQuarter + i;
      let year = currentYear;

      if (quarter > 4) {
        quarter -= 4;
        year += 1;
      }

      const dueDate = this.calculateQuarterlyDueDate(year, quarter);
      const dueDateObj = new Date(dueDate);
      const daysUntilDue = Math.ceil(
        (dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilDue > 0) {
        upcomingDeadlines.push({
          quarter: `${year}-Q${quarter}`,
          dueDate,
          daysUntilDue,
        });
      }
    }

    return {
      currentQuarter: `${currentYear}-Q${currentQuarter}`,
      upcomingDeadlines: upcomingDeadlines.slice(0, 2), // Next 2 deadlines
      overdueReturns: [], // Would be populated from database
      registrationStatus: 'active', // Would be checked from state registrations
    };
  }

  /**
   * Validate fuel purchase data
   */
  validateFuelPurchase(purchase: Partial<FuelPurchase>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (
      !purchase.purchaseDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(purchase.purchaseDate)
    ) {
      errors.push('Valid purchase date required (YYYY-MM-DD)');
    }

    if (!purchase.stateCode || purchase.stateCode.length !== 2) {
      errors.push('Valid 2-letter state code required');
    }

    if (!purchase.gallons || purchase.gallons <= 0) {
      errors.push('Gallons must be greater than 0');
    }

    if (!purchase.pricePerGallon || purchase.pricePerGallon <= 0) {
      errors.push('Price per gallon must be greater than 0');
    }

    if (!purchase.totalAmount || purchase.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    if (
      !purchase.fuelType ||
      !['diesel', 'gasoline'].includes(purchase.fuelType)
    ) {
      errors.push('Fuel type must be diesel or gasoline');
    }

    // Validate state code exists in IFTA jurisdictions
    const jurisdictions = this.getIFTAJurisdictions();
    if (
      purchase.stateCode &&
      !jurisdictions.find((j) => j.stateCode === purchase.stateCode)
    ) {
      errors.push(
        `State code ${purchase.stateCode} is not an IFTA jurisdiction`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate mileage record data
   */
  validateMileageRecord(record: Partial<MileageRecord>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!record.travelDate || !/^\d{4}-\d{2}-\d{2}$/.test(record.travelDate)) {
      errors.push('Valid travel date required (YYYY-MM-DD)');
    }

    if (!record.stateCode || record.stateCode.length !== 2) {
      errors.push('Valid 2-letter state code required');
    }

    if (!record.miles || record.miles <= 0) {
      errors.push('Miles must be greater than 0');
    }

    if (!record.vehicleId) {
      errors.push('Vehicle ID is required');
    }

    // Validate state code exists in IFTA jurisdictions
    const jurisdictions = this.getIFTAJurisdictions();
    if (
      record.stateCode &&
      !jurisdictions.find((j) => j.stateCode === record.stateCode)
    ) {
      errors.push(`State code ${record.stateCode} is not an IFTA jurisdiction`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get service health status
   */
  async healthCheck(): Promise<{
    status: string;
    jurisdictionCount: number;
    baseFleetMPG: number;
    defaultFuelType: string;
  }> {
    const jurisdictions = this.getIFTAJurisdictions();

    return {
      status: 'operational',
      jurisdictionCount: jurisdictions.length,
      baseFleetMPG: this.baseFleetMPG,
      defaultFuelType: this.defaultFuelType,
    };
  }
}

export const iftaStatePortalService = new IFTAStatePortalService();

