// TaxBandits Form 2290 Integration Service
// Handles Heavy Vehicle Use Tax (HVUT) filing automation

interface BusinessAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BusinessInfo {
  ein: string;
  businessName: string;
  address: BusinessAddress;
  phone?: string;
  email?: string;
}

interface VehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  grossWeight: number; // in pounds
  firstUsedDate: string; // YYYY-MM-DD format
  category: 'logging' | 'public_highway' | 'agricultural';
  taxableGrossWeight?: number;
}

interface Form2290Data {
  businessInfo: BusinessInfo;
  vehicles: VehicleInfo[];
  taxPeriod: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
  };
  filingType: 'original' | 'amended' | 'suspended';
  amendmentReason?: string;
}

interface Form2290Response {
  submissionId: string;
  status: 'submitted' | 'processing' | 'accepted' | 'rejected';
  totalTaxDue: number;
  filingDate: string;
  errors?: string[];
  warnings?: string[];
  receiptUrl?: string;
  stamped2290Url?: string;
}

interface FilingStatus {
  submissionId: string;
  status: 'submitted' | 'processing' | 'accepted' | 'rejected';
  statusDate: string;
  totalTaxDue: number;
  vehicleCount: number;
  errors?: string[];
  receiptUrl?: string;
  stamped2290Url?: string;
}

export class TaxBanditsService {
  private apiKey: string;
  private userToken: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;
  private apiVersion: string;

  constructor() {
    this.apiKey = process.env.TAXBANDITS_API_KEY || '';
    this.userToken = process.env.TAXBANDITS_USER_TOKEN || '';
    this.environment =
      (process.env.TAXBANDITS_ENVIRONMENT as 'sandbox' | 'production') ||
      'sandbox';
    this.apiVersion = process.env.TAXBANDITS_API_VERSION || 'v1.7.3';

    this.baseUrl =
      this.environment === 'production'
        ? 'https://api.taxbandits.com'
        : 'https://testtaxbandits.com';

    if (!this.apiKey || !this.userToken) {
      console.warn(
        '⚠️ TaxBandits credentials not configured. Service will use mock data.'
      );
    }
  }

  /**
   * File Form 2290 with the IRS via TaxBandits
   */
  async fileForm2290(formData: Form2290Data): Promise<Form2290Response> {
    try {
      console.info('📋 Filing Form 2290 via TaxBandits...', {
        businessName: formData.businessInfo.businessName,
        vehicleCount: formData.vehicles.length,
        filingType: formData.filingType,
      });

      // Validate form data before submission
      this.validateForm2290Data(formData);

      if (!this.apiKey || !this.userToken) {
        return this.getMockFilingResponse(formData);
      }

      const payload = this.buildTaxBanditsPayload(formData);

      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/Form2290/Create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Auth: this.apiKey,
            UserToken: this.userToken,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          `TaxBandits API error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      console.info('✅ Form 2290 filed successfully:', {
        submissionId: result.SubmissionId,
        status: result.Status,
        totalTax: result.TotalTaxDue,
      });

      return this.mapTaxBanditsResponse(result);
    } catch (error) {
      console.error('❌ Form 2290 filing failed:', error);
      throw new Error(
        `Form 2290 filing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check the status of a filed Form 2290
   */
  async getFilingStatus(submissionId: string): Promise<FilingStatus> {
    try {
      console.info('🔍 Checking Form 2290 status:', submissionId);

      if (!this.apiKey || !this.userToken) {
        return this.getMockStatusResponse(submissionId);
      }

      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/Form2290/Status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Auth: this.apiKey,
            UserToken: this.userToken,
          },
          body: JSON.stringify({
            SubmissionId: submissionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `TaxBandits API error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return this.mapStatusResponse(result);
    } catch (error) {
      console.error('❌ Status check failed:', error);
      throw new Error(
        `Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Calculate HVUT tax for vehicles
   */
  calculateHVUT(vehicles: VehicleInfo[]): {
    vehicleTaxes: Array<{ vin: string; taxAmount: number }>;
    totalTax: number;
  } {
    const vehicleTaxes = vehicles.map((vehicle) => {
      let taxAmount = 0;

      // 2024 HVUT Tax Table (simplified)
      if (vehicle.grossWeight >= 55000 && vehicle.grossWeight <= 75000) {
        taxAmount = 100 + Math.floor((vehicle.grossWeight - 55000) / 1000) * 22;
      } else if (vehicle.grossWeight > 75000) {
        taxAmount = 550 + Math.floor((vehicle.grossWeight - 75000) / 1000) * 22;
      }

      // Maximum tax cap
      taxAmount = Math.min(taxAmount, 550);

      return {
        vin: vehicle.vin,
        taxAmount: taxAmount,
      };
    });

    const totalTax = vehicleTaxes.reduce(
      (sum, vehicle) => sum + vehicle.taxAmount,
      0
    );

    return { vehicleTaxes, totalTax };
  }

  /**
   * Validate Form 2290 data before submission
   */
  private validateForm2290Data(formData: Form2290Data): void {
    const errors: string[] = [];

    // Business info validation
    if (
      !formData.businessInfo.ein ||
      !/^\d{2}-\d{7}$/.test(formData.businessInfo.ein)
    ) {
      errors.push('Valid EIN required (format: XX-XXXXXXX)');
    }

    if (!formData.businessInfo.businessName?.trim()) {
      errors.push('Business name is required');
    }

    // Vehicle validation
    if (!formData.vehicles || formData.vehicles.length === 0) {
      errors.push('At least one vehicle is required');
    }

    formData.vehicles.forEach((vehicle, index) => {
      if (!vehicle.vin || vehicle.vin.length !== 17) {
        errors.push(`Vehicle ${index + 1}: Valid 17-character VIN required`);
      }

      if (!vehicle.grossWeight || vehicle.grossWeight < 55000) {
        errors.push(
          `Vehicle ${index + 1}: Gross weight must be 55,000 pounds or more`
        );
      }

      if (
        !vehicle.firstUsedDate ||
        !/^\d{4}-\d{2}-\d{2}$/.test(vehicle.firstUsedDate)
      ) {
        errors.push(
          `Vehicle ${index + 1}: Valid first used date required (YYYY-MM-DD)`
        );
      }
    });

    // Tax period validation
    if (!formData.taxPeriod.startDate || !formData.taxPeriod.endDate) {
      errors.push('Tax period start and end dates are required');
    }

    if (errors.length > 0) {
      throw new Error(`Form validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Build TaxBandits API payload
   */
  private buildTaxBanditsPayload(formData: Form2290Data): any {
    const { vehicleTaxes, totalTax } = this.calculateHVUT(formData.vehicles);

    return {
      ReturnHeader: {
        Business: {
          EIN: formData.businessInfo.ein,
          BusinessName: formData.businessInfo.businessName,
          BusinessNameControl: formData.businessInfo.businessName
            .substring(0, 4)
            .toUpperCase(),
          USAddress: {
            Address1: formData.businessInfo.address.line1,
            Address2: formData.businessInfo.address.line2 || '',
            City: formData.businessInfo.address.city,
            State: formData.businessInfo.address.state,
            ZipCd: formData.businessInfo.address.zipCode,
          },
        },
      },
      Form2290: {
        TaxPeriodBeginDt: formData.taxPeriod.startDate,
        TaxPeriodEndDt: formData.taxPeriod.endDate,
        VehicleDetails: formData.vehicles.map((vehicle, index) => ({
          VIN: vehicle.vin,
          VehicleDesc: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          TaxableGrossWt: vehicle.grossWeight,
          FirstUsedDt: vehicle.firstUsedDate,
          TaxComputationDetails: {
            Category: vehicle.category === 'logging' ? 'Logging' : 'Highway',
            Tax: vehicleTaxes[index].taxAmount,
          },
        })),
        TotalTax: totalTax,
      },
    };
  }

  /**
   * Map TaxBandits response to our interface
   */
  private mapTaxBanditsResponse(response: any): Form2290Response {
    return {
      submissionId: response.SubmissionId,
      status: response.Status?.toLowerCase() || 'submitted',
      totalTaxDue: response.TotalTaxDue || 0,
      filingDate: response.CreatedTs || new Date().toISOString(),
      errors: response.Errors || [],
      warnings: response.Warnings || [],
      receiptUrl: response.ReceiptUrl,
      stamped2290Url: response.Stamped2290Url,
    };
  }

  /**
   * Map status response to our interface
   */
  private mapStatusResponse(response: any): FilingStatus {
    return {
      submissionId: response.SubmissionId,
      status: response.Status?.toLowerCase() || 'processing',
      statusDate: response.StatusTs || new Date().toISOString(),
      totalTaxDue: response.TotalTaxDue || 0,
      vehicleCount: response.VehicleCount || 0,
      errors: response.Errors || [],
      receiptUrl: response.ReceiptUrl,
      stamped2290Url: response.Stamped2290Url,
    };
  }

  /**
   * Generate mock filing response for testing
   */
  private getMockFilingResponse(formData: Form2290Data): Form2290Response {
    const { totalTax } = this.calculateHVUT(formData.vehicles);
    const submissionId = `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.info('🧪 Using mock TaxBandits response (no API key configured)');

    return {
      submissionId,
      status: 'submitted',
      totalTaxDue: totalTax,
      filingDate: new Date().toISOString(),
      receiptUrl: `https://mock-taxbandits.com/receipt/${submissionId}`,
      stamped2290Url: `https://mock-taxbandits.com/stamped/${submissionId}`,
    };
  }

  /**
   * Generate mock status response for testing
   */
  private getMockStatusResponse(submissionId: string): FilingStatus {
    console.info('🧪 Using mock status response (no API key configured)');

    // Simulate different statuses based on submission ID
    const statuses = ['processing', 'accepted', 'rejected'];
    const status = submissionId.includes('MOCK')
      ? 'accepted'
      : statuses[Math.floor(Math.random() * statuses.length)];

    return {
      submissionId,
      status: status as any,
      statusDate: new Date().toISOString(),
      totalTaxDue: 1100, // Mock tax amount
      vehicleCount: 2,
      receiptUrl:
        status === 'accepted'
          ? `https://mock-taxbandits.com/receipt/${submissionId}`
          : undefined,
      stamped2290Url:
        status === 'accepted'
          ? `https://mock-taxbandits.com/stamped/${submissionId}`
          : undefined,
    };
  }

  /**
   * Get service health status
   */
  async healthCheck(): Promise<{
    status: string;
    environment: string;
    configured: boolean;
  }> {
    return {
      status: 'operational',
      environment: this.environment,
      configured: !!(this.apiKey && this.userToken),
    };
  }
}

export const taxBanditsService = new TaxBanditsService();
