/**
 * Form 2290 Heavy Highway Vehicle Use Tax Integration Service
 * 📋 IRS Modernized e-File (MeF) API Integration
 * 🚛 Automated tax filing for heavy vehicles over 55,000 lbs
 */

interface VehicleData {
  vin: string;
  category: string; // A through W (W for suspended)
  taxableGrossWeight: number;
  firstUseMonth?: string; // Format: YYYYMM
  isLoggingVehicle: boolean;
  isSuspended: boolean;
  suspensionReason?: 'mileage_5000' | 'mileage_7500_agricultural';
}

interface Form2290Data {
  ein: string;
  businessName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  taxPeriod: string; // Format: YYYYMM
  vehicles: VehicleData[];
  isAmendedReturn?: boolean;
  isFinalReturn?: boolean;
  isVinCorrection?: boolean;
}

interface IRSResponse {
  success: boolean;
  submissionId: string;
  stampedSchedule1?: string; // Base64 PDF
  acknowledgmentId: string;
  errors?: string[];
  processingStatus: 'accepted' | 'rejected' | 'pending';
}

interface TaxCalculation {
  category: string;
  annualTax: number;
  partialTax?: number;
  vehicleCount: number;
  totalTax: number;
}

export class Form2290Service {
  private readonly baseUrl = 'https://irs-mef-api.gov'; // IRS MeF endpoint
  private readonly apiKey = process.env.IRS_MEFAPI_KEY;
  private readonly developerId = process.env.IRS_DEVELOPER_ID;

  // Tax rate tables for 2025 tax year
  private readonly TAX_RATES = {
    annual: {
      regular: {
        A: 100.0, // 55,000 lbs
        B: 122.0, // 55,001-56,000
        C: 144.0, // 56,001-57,000
        D: 166.0, // 57,001-58,000
        E: 188.0, // 58,001-59,000
        F: 210.0, // 59,001-60,000
        G: 232.0, // 60,001-61,000
        H: 254.0, // 61,001-62,000
        I: 276.0, // 62,001-63,000
        J: 298.0, // 63,001-64,000
        K: 320.0, // 64,001-65,000
        L: 342.0, // 65,001-66,000
        M: 364.0, // 66,001-67,000
        N: 386.0, // 67,001-68,000
        O: 408.0, // 68,001-69,000
        P: 430.0, // 69,001-70,000
        Q: 452.0, // 70,001-71,000
        R: 474.0, // 71,001-72,000
        S: 496.0, // 72,001-73,000
        T: 518.0, // 73,001-74,000
        U: 540.0, // 74,001-75,000
        V: 550.0, // over 75,000
      },
      logging: {
        A: 75.0, // 55,000 lbs (logging)
        B: 91.5, // 55,001-56,000 (logging)
        C: 108.0, // 56,001-57,000 (logging)
        D: 124.5, // 57,001-58,000 (logging)
        E: 141.0, // 58,001-59,000 (logging)
        F: 157.5, // 59,001-60,000 (logging)
        G: 174.0, // 60,001-61,000 (logging)
        H: 190.5, // 61,001-62,000 (logging)
        I: 207.0, // 62,001-63,000 (logging)
        J: 223.5, // 63,001-64,000 (logging)
        K: 240.0, // 64,001-65,000 (logging)
        L: 256.5, // 65,001-66,000 (logging)
        M: 273.0, // 66,001-67,000 (logging)
        N: 289.5, // 67,001-68,000 (logging)
        O: 306.0, // 68,001-69,000 (logging)
        P: 322.5, // 69,001-70,000 (logging)
        Q: 339.0, // 70,001-71,000 (logging)
        R: 355.5, // 71,001-72,000 (logging)
        S: 372.0, // 72,001-73,000 (logging)
        T: 388.5, // 73,001-74,000 (logging)
        U: 405.0, // 74,001-75,000 (logging)
        V: 412.5, // over 75,000 (logging)
      },
    },
  };

  /**
   * Calculate tax category based on vehicle weight
   */
  private calculateTaxCategory(weight: number): string {
    if (weight < 55000) return 'EXEMPT';
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
  private calculateTaxAmount(vehicle: VehicleData): number {
    if (vehicle.isSuspended) return 0;

    const category = vehicle.category;
    const rateTable = vehicle.isLoggingVehicle
      ? this.TAX_RATES.annual.logging
      : this.TAX_RATES.annual.regular;

    return rateTable[category as keyof typeof rateTable] || 0;
  }

  /**
   * Generate XML payload for IRS MeF submission
   */
  private generateXMLPayload(data: Form2290Data): string {
    const taxCalculations = this.calculateTotalTax(data.vehicles);

    return `<?xml version="1.0" encoding="UTF-8"?>
<Return xmlns="http://www.irs.gov/efile" returnVersion="2025v1.0">
  <ReturnHeader>
    <ReturnTs>${new Date().toISOString()}</ReturnTs>
    <TaxPeriodEndDt>2026-06-30</TaxPeriodEndDt>
    <TaxYr>2025</TaxYr>
    <SoftwareId>${this.developerId}</SoftwareId>
    <Filer>
      <EIN>${data.ein}</EIN>
      <BusinessName>
        <BusinessNameLine1Txt>${data.businessName}</BusinessNameLine1Txt>
      </BusinessName>
      <USAddress>
        <AddressLine1Txt>${data.address.street}</AddressLine1Txt>
        <CityNm>${data.address.city}</CityNm>
        <StateAbbreviationCd>${data.address.state}</StateAbbreviationCd>
        <ZIPCd>${data.address.zipCode}</ZIPCd>
      </USAddress>
    </Filer>
  </ReturnHeader>

  <ReturnData documentCnt="2">
    <IRS2290>
      <TaxPeriodBeginDt>2025-07-01</TaxPeriodBeginDt>
      <TaxPeriodEndDt>2026-06-30</TaxPeriodEndDt>
      <FirstUseDt>${data.taxPeriod}01</FirstUseDt>
      <AmendedReturnInd>${data.isAmendedReturn || false}</AmendedReturnInd>
      <FinalReturnInd>${data.isFinalReturn || false}</FinalReturnInd>
      <VINCorrectionsInd>${data.isVinCorrection || false}</VINCorrectionsInd>

      <TaxComputationGrp>
        ${taxCalculations
          .map(
            (calc) => `
        <TaxComputation>
          <TaxableGrossWeightCategoryCd>${calc.category}</TaxableGrossWeightCategoryCd>
          <VehicleCnt>${calc.vehicleCount}</VehicleCnt>
          <TaxAmt>${calc.totalTax}</TaxAmt>
        </TaxComputation>
        `
          )
          .join('')}
      </TaxComputationGrp>

      <TotalTaxAmt>${taxCalculations.reduce((sum, calc) => sum + calc.totalTax, 0)}</TotalTaxAmt>
      <BalanceDueAmt>${taxCalculations.reduce((sum, calc) => sum + calc.totalTax, 0)}</BalanceDueAmt>
    </IRS2290>

    <IRS2290Schedule1>
      <TaxPeriodBeginDt>2025-07-01</TaxPeriodBeginDt>
      <TaxPeriodEndDt>2026-06-30</TaxPeriodEndDt>

      <VehicleGrp>
        ${data.vehicles
          .map(
            (vehicle) => `
        <Vehicle>
          <VIN>${vehicle.vin}</VIN>
          <TaxableGrossWeightCategoryCd>${vehicle.category}</TaxableGrossWeightCategoryCd>
          ${vehicle.isSuspended ? '<SuspendedVehicleInd>true</SuspendedVehicleInd>' : ''}
        </Vehicle>
        `
          )
          .join('')}
      </VehicleGrp>

      <TotalVehicleCnt>${data.vehicles.length}</TotalVehicleCnt>
      <SuspendedVehicleCnt>${data.vehicles.filter((v) => v.isSuspended).length}</SuspendedVehicleCnt>
      <TaxableVehicleCnt>${data.vehicles.filter((v) => !v.isSuspended).length}</TaxableVehicleCnt>
    </IRS2290Schedule1>
  </ReturnData>
</Return>`;
  }

  /**
   * Calculate total tax for all vehicles grouped by category
   */
  private calculateTotalTax(vehicles: VehicleData[]): TaxCalculation[] {
    const categoryGroups: { [key: string]: VehicleData[] } = {};

    vehicles.forEach((vehicle) => {
      if (!categoryGroups[vehicle.category]) {
        categoryGroups[vehicle.category] = [];
      }
      categoryGroups[vehicle.category].push(vehicle);
    });

    return Object.entries(categoryGroups).map(([category, vehicleGroup]) => {
      const vehicleCount = vehicleGroup.length;
      const taxPerVehicle = vehicleGroup[0]
        ? this.calculateTaxAmount(vehicleGroup[0])
        : 0;
      const totalTax = taxPerVehicle * vehicleCount;

      return {
        category,
        annualTax: taxPerVehicle,
        vehicleCount,
        totalTax,
      };
    });
  }

  /**
   * Submit Form 2290 to IRS e-File system
   */
  async submitForm2290(data: Form2290Data): Promise<IRSResponse> {
    try {
      const xmlPayload = this.generateXMLPayload(data);

      const response = await fetch(`${this.baseUrl}/mef/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Authorization: `Bearer ${this.apiKey}`,
          'X-Developer-ID': this.developerId || '',
          'X-Submission-Type': 'Form2290',
        },
        body: xmlPayload,
      });

      if (!response.ok) {
        throw new Error(
          `IRS API Error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        submissionId: result.submissionId,
        acknowledgmentId: result.acknowledgmentId,
        processingStatus: result.status,
        stampedSchedule1: result.stampedSchedule1, // Base64 PDF
      };
    } catch (error) {
      console.error('Form 2290 submission error:', error);
      return {
        success: false,
        submissionId: '',
        acknowledgmentId: '',
        processingStatus: 'rejected',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Check submission status
   */
  async checkSubmissionStatus(submissionId: string): Promise<IRSResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/mef/status/${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'X-Developer-ID': this.developerId || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        submissionId,
        acknowledgmentId: result.acknowledgmentId,
        processingStatus: result.status,
        stampedSchedule1: result.stampedSchedule1,
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        submissionId,
        acknowledgmentId: '',
        processingStatus: 'rejected',
        errors: [
          error instanceof Error ? error.message : 'Status check failed',
        ],
      };
    }
  }

  /**
   * Validate vehicle data before submission
   */
  validateVehicleData(vehicles: VehicleData[]): string[] {
    const errors: string[] = [];

    vehicles.forEach((vehicle, index) => {
      // VIN validation
      if (!vehicle.vin || vehicle.vin.length !== 17) {
        errors.push(`Vehicle ${index + 1}: Invalid VIN format`);
      }

      // Weight validation
      if (vehicle.taxableGrossWeight < 55000 && !vehicle.isSuspended) {
        errors.push(
          `Vehicle ${index + 1}: Vehicles under 55,000 lbs are not subject to tax`
        );
      }

      // Category validation
      if (!vehicle.category || !/^[A-W]$/.test(vehicle.category)) {
        errors.push(`Vehicle ${index + 1}: Invalid tax category`);
      }

      // Suspension validation
      if (vehicle.isSuspended && !vehicle.suspensionReason) {
        errors.push(
          `Vehicle ${index + 1}: Suspended vehicles must have a suspension reason`
        );
      }
    });

    return errors;
  }

  /**
   * Generate mock data for development/testing
   */
  generateMockVehicleData(): VehicleData[] {
    return [
      {
        vin: '1HGBH41JXMN109186',
        category: 'K', // 64,001-65,000 lbs
        taxableGrossWeight: 64500,
        isLoggingVehicle: false,
        isSuspended: false,
      },
      {
        vin: '2T1BURHE0JC123456',
        category: 'V', // over 75,000 lbs
        taxableGrossWeight: 80000,
        isLoggingVehicle: true,
        isSuspended: false,
      },
      {
        vin: '3GNDA13D76S123789',
        category: 'W', // Suspended
        taxableGrossWeight: 60000,
        isLoggingVehicle: false,
        isSuspended: true,
        suspensionReason: 'mileage_5000',
      },
    ];
  }

  /**
   * Calculate estimated tax for planning purposes
   */
  calculateEstimatedTax(vehicles: VehicleData[]): number {
    return vehicles.reduce((total, vehicle) => {
      return total + this.calculateTaxAmount(vehicle);
    }, 0);
  }
}

// Export singleton instance
export const form2290Service = new Form2290Service();
