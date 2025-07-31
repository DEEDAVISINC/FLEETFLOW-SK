/**
 * Form 2290 Heavy Highway Vehicle Use Tax - TaxBandits Integration Service
 * 🏛️ TaxBandits API Integration for IRS Form 2290 e-Filing
 * 🚛 Automated tax filing for heavy vehicles over 55,000 lbs
 */

interface TaxBanditsVehicleData {
  VIN: string;
  TaxableGrossWeight: number;
  VehicleCategory: string; // A through W
  FirstUsedMonth: string; // Format: YYYYMM
  SuspendedVehicle?: boolean;
  LoggingVehicle?: boolean;
}

interface TaxBanditsForm2290Data {
  ReturnHeader: {
    Business: {
      EIN: string;
      BusinessName: string;
      BusinessAddress: {
        Address1: string;
        City: string;
        State: string;
        ZipCode: string;
      };
      BusinessType: 'INDIVIDUAL' | 'PARTNERSHIP' | 'CORPORATION' | 'LLC';
    };
    IsBusinessClosed?: boolean;
    SigningAuthority: {
      Name: string;
      Phone: string;
    };
  };
  ReturnData: {
    Form2290: {
      TaxPeriodBeginDate: string; // YYYY-MM-DD
      TaxPeriodEndDate: string;   // YYYY-MM-DD
      IsAmendedReturn?: boolean;
      IsFinalReturn?: boolean;
      IsVINCorrection?: boolean;
      Vehicles: TaxBanditsVehicleData[];
    };
  };
}

interface TaxBanditsResponse {
  StatusCode: number;
  StatusName: string;
  StatusMessage: string;
  SubmissionId: string;
  Errors?: Array<{
    Id: string;
    Name: string;
    Message: string;
  }>;
  Form2290Records?: Array<{
    SubmissionId: string;
    AcceptedDate: string;
    Forms: Array<{
      FormId: string;
      FormName: string;
      Status: string;
      PdfUrl?: string;
      Schedule1PdfUrl?: string; // Stamped Schedule 1
    }>;
  }>;
}

export class TaxBanditsForm2290Service {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly userToken: string;

  constructor() {
    // Use sandbox for development, production for live
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.taxbandits.com/v1.7.3' 
      : 'https://testapi.taxbandits.com/v1.7.3';
    
    this.apiKey = process.env.TAXBANDITS_API_KEY || '';
    this.userToken = process.env.TAXBANDITS_USER_TOKEN || '';
  }

  // Tax rate tables for 2025 tax year
  private readonly TAX_RATES = {
    annual: {
      regular: {
        'A': 100.00,  'B': 122.00,  'C': 144.00,  'D': 166.00,  'E': 188.00,
        'F': 210.00,  'G': 232.00,  'H': 254.00,  'I': 276.00,  'J': 298.00,
        'K': 320.00,  'L': 342.00,  'M': 364.00,  'N': 386.00,  'O': 408.00,
        'P': 430.00,  'Q': 452.00,  'R': 474.00,  'S': 496.00,  'T': 518.00,
        'U': 540.00,  'V': 550.00,
      },
      logging: {
        'A': 75.00,   'B': 91.50,   'C': 108.00,  'D': 124.50,  'E': 141.00,
        'F': 157.50,  'G': 174.00,  'H': 190.50,  'I': 207.00,  'J': 223.50,
        'K': 240.00,  'L': 256.50,  'M': 273.00,  'N': 289.50,  'O': 306.00,
        'P': 322.50,  'Q': 339.00,  'R': 355.50,  'S': 372.00,  'T': 388.50,
        'U': 405.00,  'V': 412.50,
      }
    }
  };

  /**
   * Calculate tax category based on vehicle weight
   */
  private calculateTaxCategory(weight: number): string {
    if (weight <= 55000) return 'A';
    if (weight <= 56000) return 'B';
    if (weight <= 57000) return 'C';
    if (weight <= 58000) return 'D';
    if (weight <= 59000) return 'E';
    if (weight <= 60000) return 'F';
    if (weight <= 61000) return 'G';
    if (weight <= 62000) return 'H';
    if (weight <= 63000) return 'I';
    if (weight <= 64000) return 'J';
    if (weight <= 65000) return 'K';
    if (weight <= 66000) return 'L';
    if (weight <= 67000) return 'M';
    if (weight <= 68000) return 'N';
    if (weight <= 69000) return 'O';
    if (weight <= 70000) return 'P';
    if (weight <= 71000) return 'Q';
    if (weight <= 72000) return 'R';
    if (weight <= 73000) return 'S';
    if (weight <= 74000) return 'T';
    if (weight <= 75000) return 'U';
    return 'V'; // over 75,000
  }

  /**
   * Calculate tax amount for a vehicle
   */
  private calculateTaxAmount(vehicle: TaxBanditsVehicleData): number {
    if (vehicle.SuspendedVehicle) return 0;
    
    const category = vehicle.VehicleCategory;
    const rateTable = vehicle.LoggingVehicle ? 
      this.TAX_RATES.annual.logging : 
      this.TAX_RATES.annual.regular;
    
    return rateTable[category as keyof typeof rateTable] || 0;
  }

  /**
   * Convert our internal format to TaxBandits format
   */
  private convertToTaxBanditsFormat(data: any): TaxBanditsForm2290Data {
    return {
      ReturnHeader: {
        Business: {
          EIN: data.ein,
          BusinessName: data.businessName,
          BusinessAddress: {
            Address1: data.address.street,
            City: data.address.city,
            State: data.address.state,
            ZipCode: data.address.zipCode,
          },
          BusinessType: 'CORPORATION', // Default - should be configurable
        },
        SigningAuthority: {
          Name: data.signingAuthority || 'Fleet Manager',
          Phone: data.phone || '555-0123',
        },
      },
      ReturnData: {
        Form2290: {
          TaxPeriodBeginDate: '2025-07-01',
          TaxPeriodEndDate: '2026-06-30',
          IsAmendedReturn: data.isAmendedReturn || false,
          IsFinalReturn: data.isFinalReturn || false,
          IsVINCorrection: data.isVinCorrection || false,
          Vehicles: data.vehicles.map((vehicle: any) => ({
            VIN: vehicle.vin,
            TaxableGrossWeight: vehicle.taxableGrossWeight,
            VehicleCategory: this.calculateTaxCategory(vehicle.taxableGrossWeight),
            FirstUsedMonth: vehicle.firstUseMonth || data.taxPeriod,
            SuspendedVehicle: vehicle.isSuspended || false,
            LoggingVehicle: vehicle.isLoggingVehicle || false,
          })),
        },
      },
    };
  }

  /**
   * Submit Form 2290 to TaxBandits
   */
  async submitForm2290(data: any): Promise<{
    success: boolean;
    submissionId: string;
    message: string;
    stampedSchedule1Url?: string;
    errors?: string[];
  }> {
    try {
      const taxBanditsData = this.convertToTaxBanditsFormat(data);
      
      const response = await fetch(`${this.baseUrl}/Form2290/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userToken}`,
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(taxBanditsData),
      });

      if (!response.ok) {
        throw new Error(`TaxBandits API Error: ${response.status} ${response.statusText}`);
      }

      const result: TaxBanditsResponse = await response.json();
      
      return {
        success: result.StatusCode === 200,
        submissionId: result.SubmissionId,
        message: result.StatusMessage,
        stampedSchedule1Url: result.Form2290Records?.[0]?.Forms?.[0]?.Schedule1PdfUrl,
        errors: result.Errors?.map(e => e.Message) || [],
      };

    } catch (error) {
      console.error('Form 2290 TaxBandits submission error:', error);
      return {
        success: false,
        submissionId: '',
        message: error instanceof Error ? error.message : 'Unknown error',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Check submission status
   */
  async checkSubmissionStatus(submissionId: string): Promise<{
    success: boolean;
    status: string;
    message: string;
    stampedSchedule1Url?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/Form2290/Status?SubmissionId=${submissionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'X-API-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const result: TaxBanditsResponse = await response.json();
      
      return {
        success: result.StatusCode === 200,
        status: result.Form2290Records?.[0]?.Forms?.[0]?.Status || 'unknown',
        message: result.StatusMessage,
        stampedSchedule1Url: result.Form2290Records?.[0]?.Forms?.[0]?.Schedule1PdfUrl,
      };

    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        status: 'error',
        message: error instanceof Error ? error.message : 'Status check failed',
      };
    }
  }

  /**
   * Get stamped Schedule 1 PDF
   */
  async getStampedSchedule1(submissionId: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/Form2290/StatusPdf?SubmissionId=${submissionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'X-API-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`PDF retrieval failed: ${response.status}`);
      }

      const result = await response.json();
      return result.PdfUrl || null;

    } catch (error) {
      console.error('PDF retrieval error:', error);
      return null;
    }
  }

  /**
   * Validate vehicle data before submission
   */
  validateVehicleData(vehicles: any[]): string[] {
    const errors: string[] = [];

    vehicles.forEach((vehicle, index) => {
      // VIN validation
      if (!vehicle.vin || vehicle.vin.length !== 17) {
        errors.push(`Vehicle ${index + 1}: Invalid VIN format (must be 17 characters)`);
      }

      // Weight validation
      if (vehicle.taxableGrossWeight < 55000 && !vehicle.isSuspended) {
        errors.push(`Vehicle ${index + 1}: Vehicles under 55,000 lbs are not subject to Form 2290 tax`);
      }

      if (vehicle.taxableGrossWeight > 150000) {
        errors.push(`Vehicle ${index + 1}: Weight seems unusually high (${vehicle.taxableGrossWeight} lbs)`);
      }

      // Suspension validation
      if (vehicle.isSuspended && !vehicle.suspensionReason) {
        errors.push(`Vehicle ${index + 1}: Suspended vehicles must have a suspension reason`);
      }
    });

    return errors;
  }

  /**
   * Calculate estimated tax for planning purposes
   */
  calculateEstimatedTax(vehicles: any[]): number {
    return vehicles.reduce((total, vehicle) => {
      if (vehicle.isSuspended) return total;
      
      const category = this.calculateTaxCategory(vehicle.taxableGrossWeight);
      const rateTable = vehicle.isLoggingVehicle ? 
        this.TAX_RATES.annual.logging : 
        this.TAX_RATES.annual.regular;
      
      return total + (rateTable[category as keyof typeof rateTable] || 0);
    }, 0);
  }

  /**
   * Test API connection with TaxBandits
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/Business/Validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userToken}`,
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          EIN: '12-3456789',
          BusinessName: 'Test Connection',
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: '✅ TaxBandits API connection successful!'
        };
      } else {
        return {
          success: false,
          message: `❌ Connection failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Generate mock data for development/testing
   */
  generateMockVehicleData(): any {
    return {
      ein: '12-3456789',
      businessName: 'FleetFlow Demo Carrier LLC',
      address: {
        street: '123 Fleet Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
      },
      taxPeriod: '202507',
      signingAuthority: 'John Rodriguez',
      phone: '305-555-0123',
      vehicles: [
        {
          vin: '1HGBH41JXMN109186',
          taxableGrossWeight: 64500, // Category K - $320
          isLoggingVehicle: false,
          isSuspended: false,
          firstUseMonth: '202507',
        },
        {
          vin: '2T1BURHE0JC123456',
          taxableGrossWeight: 80000, // Category V - $412.50 (logging)
          isLoggingVehicle: true,
          isSuspended: false,
          firstUseMonth: '202507',
        },
        {
          vin: '3GNDA13D76S123789',
          taxableGrossWeight: 60000, // Category F - Suspended
          isLoggingVehicle: false,
          isSuspended: true,
          suspensionReason: 'mileage_5000',
          firstUseMonth: '202507',
        },
      ],
    };
  }
}

// Export singleton instance
export const taxBanditsForm2290Service = new TaxBanditsForm2290Service();
