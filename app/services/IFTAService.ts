/**
 * IFTA (International Fuel Tax Agreement) Integration Service
 * 🗺️ Multi-state quarterly fuel tax reporting system
 * ⛽ Automated fuel tax calculations and submissions
 */

interface FuelPurchase {
  date: string; // YYYY-MM-DD
  jurisdiction: string; // State/Province code
  fuelType: 'diesel' | 'gasoline' | 'propane' | 'cng' | 'lng';
  gallons: number;
  unitPrice: number;
  totalAmount: number;
  vendorName: string;
  receiptNumber?: string;
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
}

interface MileageRecord {
  date: string;
  jurisdiction: string;
  miles: number;
  loadedMiles?: number;
  emptyMiles?: number;
  route: string;
  tripPurpose: 'revenue' | 'deadhead' | 'personal';
}

interface VehicleIFTAData {
  vin: string;
  unitNumber: string;
  make: string;
  model: string;
  year: number;
  fuelType: string[];
  registeredWeight: number;
  baseJurisdiction: string;
  iftaDecalNumber: string;
  licensePlate: string;
}

interface IFTAQuarterlyData {
  carrierId: string;
  carrierName: string;
  ein: string;
  iftaAccountNumber: string;
  baseJurisdiction: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  reportingPeriod: {
    startDate: string;
    endDate: string;
  };
  vehicles: VehicleIFTAData[];
  fuelPurchases: FuelPurchase[];
  mileageRecords: MileageRecord[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface JurisdictionSummary {
  jurisdiction: string;
  jurisdictionName: string;
  totalMiles: number;
  taxableMiles: number;
  fuelPurchased: number;
  fuelRate: number; // Current tax rate per gallon
  netGallons: number; // Calculated fuel consumption
  taxOwed: number;
  refundDue: number;
  netAmount: number; // Tax owed or refund due
}

interface IFTAResponse {
  success: boolean;
  submissionId: string;
  confirmationNumber: string;
  jurisdiction: string;
  processingStatus: 'submitted' | 'accepted' | 'rejected' | 'pending';
  errors?: string[];
  warnings?: string[];
  jurisdictionSummaries: JurisdictionSummary[];
  totalNetAmount: number;
  dueDate: string;
}

// Abstract base class for state-specific IFTA adapters
abstract class IFTAJurisdictionAdapter {
  abstract jurisdiction: string;
  abstract apiEndpoint: string;

  abstract submitReturn(data: IFTAQuarterlyData): Promise<IFTAResponse>;
  abstract checkStatus(submissionId: string): Promise<IFTAResponse>;
  abstract generateXML(data: IFTAQuarterlyData): string;
  abstract validateData(data: IFTAQuarterlyData): string[];
}

// California IFTA Adapter
class CaliforniaIFTAAdapter extends IFTAJurisdictionAdapter {
  jurisdiction = 'CA';
  apiEndpoint = 'https://onlineservices.cdtfa.ca.gov/ifta-api';

  async submitReturn(data: IFTAQuarterlyData): Promise<IFTAResponse> {
    try {
      const xmlPayload = this.generateXML(data);

      const response = await fetch(`${this.apiEndpoint}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'X-API-Key': process.env.CDTFA_API_KEY || '',
          'X-Carrier-ID': data.carrierId,
        },
        body: xmlPayload,
      });

      const result = await response.json();

      return {
        success: response.ok,
        submissionId: result.submissionId,
        confirmationNumber: result.confirmationNumber,
        jurisdiction: 'CA',
        processingStatus: result.status,
        jurisdictionSummaries: result.summaries || [],
        totalNetAmount: result.totalNetAmount || 0,
        dueDate: result.dueDate,
      };
    } catch (error) {
      return this.handleError(error, data);
    }
  }

  generateXML(data: IFTAQuarterlyData): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<IFTAReturn xmlns="http://www.cdtfa.ca.gov/ifta" version="2025.1">
  <Header>
    <CarrierInfo>
      <CarrierName>${data.carrierName}</CarrierName>
      <EIN>${data.ein}</EIN>
      <IFTAAccountNumber>${data.iftaAccountNumber}</IFTAAccountNumber>
      <BaseJurisdiction>${data.baseJurisdiction}</BaseJurisdiction>
    </CarrierInfo>
    <ReportingPeriod>
      <Quarter>${data.quarter}</Quarter>
      <Year>${data.year}</Year>
      <StartDate>${data.reportingPeriod.startDate}</StartDate>
      <EndDate>${data.reportingPeriod.endDate}</EndDate>
    </ReportingPeriod>
  </Header>

  <Vehicles>
    ${data.vehicles
      .map(
        (vehicle) => `
    <Vehicle>
      <VIN>${vehicle.vin}</VIN>
      <UnitNumber>${vehicle.unitNumber}</UnitNumber>
      <IFTADecal>${vehicle.iftaDecalNumber}</IFTADecal>
    </Vehicle>
    `
      )
      .join('')}
  </Vehicles>

  <FuelPurchases>
    ${data.fuelPurchases
      .map(
        (purchase) => `
    <Purchase>
      <Date>${purchase.date}</Date>
      <Jurisdiction>${purchase.jurisdiction}</Jurisdiction>
      <FuelType>${purchase.fuelType}</FuelType>
      <Gallons>${purchase.gallons}</Gallons>
      <Amount>${purchase.totalAmount}</Amount>
    </Purchase>
    `
      )
      .join('')}
  </FuelPurchases>

  <DistanceTraveled>
    ${this.generateDistanceXML(data.mileageRecords)}
  </DistanceTraveled>
</IFTAReturn>`;
  }

  private generateDistanceXML(records: MileageRecord[]): string {
    const jurisdictionMiles: { [key: string]: number } = {};

    records.forEach((record) => {
      if (!jurisdictionMiles[record.jurisdiction]) {
        jurisdictionMiles[record.jurisdiction] = 0;
      }
      jurisdictionMiles[record.jurisdiction] += record.miles;
    });

    return Object.entries(jurisdictionMiles)
      .map(
        ([jurisdiction, miles]) => `
    <Distance>
      <Jurisdiction>${jurisdiction}</Jurisdiction>
      <Miles>${miles}</Miles>
    </Distance>
    `
      )
      .join('');
  }

  validateData(data: IFTAQuarterlyData): string[] {
    const errors: string[] = [];

    if (!data.iftaAccountNumber) {
      errors.push('IFTA Account Number is required');
    }

    if (data.vehicles.length === 0) {
      errors.push('At least one vehicle must be reported');
    }

    return errors;
  }

  async checkStatus(submissionId: string): Promise<IFTAResponse> {
    // Implementation for checking submission status
    throw new Error('Status check not implemented for California');
  }

  private handleError(error: any, data: IFTAQuarterlyData): IFTAResponse {
    return {
      success: false,
      submissionId: '',
      confirmationNumber: '',
      jurisdiction: 'CA',
      processingStatus: 'rejected',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      jurisdictionSummaries: [],
      totalNetAmount: 0,
      dueDate: '',
    };
  }
}

// Texas IFTA Adapter
class TexasIFTAAdapter extends IFTAJurisdictionAdapter {
  jurisdiction = 'TX';
  apiEndpoint = 'https://webfile.window.state.tx.us/ifta-api';

  async submitReturn(data: IFTAQuarterlyData): Promise<IFTAResponse> {
    // Texas-specific implementation
    return {
      success: false,
      submissionId: '',
      confirmationNumber: '',
      jurisdiction: 'TX',
      processingStatus: 'pending',
      jurisdictionSummaries: [],
      totalNetAmount: 0,
      dueDate: '',
      errors: ['Texas IFTA integration pending implementation'],
    };
  }

  generateXML(data: IFTAQuarterlyData): string {
    return '<!-- Texas XML format -->';
  }

  validateData(data: IFTAQuarterlyData): string[] {
    return [];
  }

  async checkStatus(submissionId: string): Promise<IFTAResponse> {
    throw new Error('Not implemented');
  }
}

// Main IFTA Service
export class IFTAService {
  private adapters: Map<string, IFTAJurisdictionAdapter> = new Map();

  // Current IFTA tax rates (per gallon) by jurisdiction
  private readonly IFTA_RATES = {
    AL: 0.19,
    AK: 0.084,
    AZ: 0.18,
    AR: 0.223,
    CA: 0.533,
    CO: 0.2255,
    CT: 0.25,
    DE: 0.22,
    FL: 0.097,
    GA: 0.329,
    HI: 0.16,
    ID: 0.25,
    IL: 0.387,
    IN: 0.29,
    IA: 0.245,
    KS: 0.24,
    KY: 0.184,
    LA: 0.16,
    ME: 0.254,
    MD: 0.2425,
    MA: 0.24,
    MI: 0.27,
    MN: 0.286,
    MS: 0.184,
    MO: 0.17,
    MT: 0.2775,
    NE: 0.2461,
    NV: 0.23,
    NH: 0.232,
    NJ: 0.105,
    NM: 0.188,
    NY: 0.08,
    NC: 0.358,
    ND: 0.23,
    OH: 0.28,
    OK: 0.16,
    OR: 0.24,
    PA: 0.574,
    RI: 0.32,
    SC: 0.167,
    SD: 0.22,
    TN: 0.214,
    TX: 0.155,
    UT: 0.295,
    VT: 0.16,
    VA: 0.202,
    WA: 0.375,
    WV: 0.205,
    WI: 0.309,
    WY: 0.14,
    // Canadian provinces
    AB: 0.13,
    BC: 0.15,
    MB: 0.14,
    NB: 0.155,
    NL: 0.165,
    NT: 0.065,
    NS: 0.154,
    NU: 0.065,
    ON: 0.143,
    PE: 0.155,
    QC: 0.202,
    SK: 0.15,
    YT: 0.065,
  };

  constructor() {
    // Register available jurisdiction adapters
    this.registerAdapter(new CaliforniaIFTAAdapter());
    this.registerAdapter(new TexasIFTAAdapter());
  }

  private registerAdapter(adapter: IFTAJurisdictionAdapter): void {
    this.adapters.set(adapter.jurisdiction, adapter);
  }

  /**
   * Calculate fuel consumption based on miles and MPG
   */
  calculateFuelConsumption(miles: number, mpg: number = 6.5): number {
    return miles / mpg;
  }

  /**
   * Calculate net gallons for jurisdiction (consumption - purchases)
   */
  calculateNetGallons(jurisdiction: string, data: IFTAQuarterlyData): number {
    const jurisdictionMiles = this.getTotalMilesByJurisdiction(
      jurisdiction,
      data.mileageRecords
    );
    const fuelConsumed = this.calculateFuelConsumption(jurisdictionMiles);
    const fuelPurchased = this.getFuelPurchasedByJurisdiction(
      jurisdiction,
      data.fuelPurchases
    );

    return fuelConsumed - fuelPurchased;
  }

  /**
   * Calculate tax owed for jurisdiction
   */
  calculateTaxOwed(jurisdiction: string, netGallons: number): number {
    const rate =
      this.IFTA_RATES[jurisdiction as keyof typeof this.IFTA_RATES] || 0;
    return Math.max(0, netGallons * rate);
  }

  /**
   * Generate jurisdiction summaries for IFTA return
   */
  generateJurisdictionSummaries(
    data: IFTAQuarterlyData
  ): JurisdictionSummary[] {
    const jurisdictions = new Set([
      ...data.mileageRecords.map((r) => r.jurisdiction),
      ...data.fuelPurchases.map((p) => p.jurisdiction),
    ]);

    return Array.from(jurisdictions).map((jurisdiction) => {
      const totalMiles = this.getTotalMilesByJurisdiction(
        jurisdiction,
        data.mileageRecords
      );
      const fuelPurchased = this.getFuelPurchasedByJurisdiction(
        jurisdiction,
        data.fuelPurchases
      );
      const netGallons = this.calculateNetGallons(jurisdiction, data);
      const fuelRate =
        this.IFTA_RATES[jurisdiction as keyof typeof this.IFTA_RATES] || 0;
      const taxOwed = this.calculateTaxOwed(jurisdiction, netGallons);
      const refundDue = netGallons < 0 ? Math.abs(netGallons * fuelRate) : 0;

      return {
        jurisdiction,
        jurisdictionName: this.getJurisdictionName(jurisdiction),
        totalMiles,
        taxableMiles: totalMiles, // Simplified - would need business logic for taxable vs non-taxable
        fuelPurchased,
        fuelRate,
        netGallons,
        taxOwed,
        refundDue,
        netAmount: taxOwed - refundDue,
      };
    });
  }

  /**
   * Submit IFTA return to appropriate jurisdiction
   */
  async submitIFTAReturn(data: IFTAQuarterlyData): Promise<IFTAResponse[]> {
    const results: IFTAResponse[] = [];
    const jurisdictions = new Set(
      data.mileageRecords.map((r) => r.jurisdiction)
    );

    for (const jurisdiction of jurisdictions) {
      try {
        const adapter = this.adapters.get(jurisdiction);
        if (!adapter) {
          results.push({
            success: false,
            submissionId: '',
            confirmationNumber: '',
            jurisdiction,
            processingStatus: 'rejected',
            errors: [`No adapter available for jurisdiction: ${jurisdiction}`],
            jurisdictionSummaries: [],
            totalNetAmount: 0,
            dueDate: '',
          });
          continue;
        }

        const validationErrors = adapter.validateData(data);
        if (validationErrors.length > 0) {
          results.push({
            success: false,
            submissionId: '',
            confirmationNumber: '',
            jurisdiction,
            processingStatus: 'rejected',
            errors: validationErrors,
            jurisdictionSummaries: [],
            totalNetAmount: 0,
            dueDate: '',
          });
          continue;
        }

        const result = await adapter.submitReturn(data);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          submissionId: '',
          confirmationNumber: '',
          jurisdiction,
          processingStatus: 'rejected',
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          jurisdictionSummaries: [],
          totalNetAmount: 0,
          dueDate: '',
        });
      }
    }

    return results;
  }

  /**
   * Get available jurisdictions for filing
   */
  getAvailableJurisdictions(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Generate mock IFTA data for development/testing
   */
  generateMockIFTAData(): IFTAQuarterlyData {
    return {
      carrierId: 'FL-TEST-001',
      carrierName: 'FleetFlow Demo Carrier',
      ein: '12-3456789',
      iftaAccountNumber: 'FL123456',
      baseJurisdiction: 'FL',
      quarter: 'Q4',
      year: 2024,
      reportingPeriod: {
        startDate: '2024-10-01',
        endDate: '2024-12-31',
      },
      vehicles: [
        {
          vin: '1HGBH41JXMN109186',
          unitNumber: 'TRUCK-001',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2023,
          fuelType: ['diesel'],
          registeredWeight: 80000,
          baseJurisdiction: 'FL',
          iftaDecalNumber: 'FL0123456',
          licensePlate: 'FL123ABC',
        },
      ],
      fuelPurchases: [
        {
          date: '2024-10-15',
          jurisdiction: 'FL',
          fuelType: 'diesel',
          gallons: 150.5,
          unitPrice: 3.45,
          totalAmount: 519.23,
          vendorName: 'Flying J',
          location: { city: 'Jacksonville', state: 'FL', zipCode: '32099' },
        },
        {
          date: '2024-10-16',
          jurisdiction: 'GA',
          fuelType: 'diesel',
          gallons: 175.0,
          unitPrice: 3.52,
          totalAmount: 616.0,
          vendorName: 'TA Travel Center',
          location: { city: 'Valdosta', state: 'GA', zipCode: '31601' },
        },
      ],
      mileageRecords: [
        {
          date: '2024-10-15',
          jurisdiction: 'FL',
          miles: 285,
          route: 'I-95 Jacksonville to Valdosta',
          tripPurpose: 'revenue',
        },
        {
          date: '2024-10-16',
          jurisdiction: 'GA',
          miles: 125,
          route: 'I-75 Valdosta to Macon',
          tripPurpose: 'revenue',
        },
      ],
      address: {
        street: '123 Fleet Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'US',
      },
    };
  }

  // Helper methods
  private getTotalMilesByJurisdiction(
    jurisdiction: string,
    records: MileageRecord[]
  ): number {
    return records
      .filter((r) => r.jurisdiction === jurisdiction)
      .reduce((total, r) => total + r.miles, 0);
  }

  private getFuelPurchasedByJurisdiction(
    jurisdiction: string,
    purchases: FuelPurchase[]
  ): number {
    return purchases
      .filter((p) => p.jurisdiction === jurisdiction)
      .reduce((total, p) => total + p.gallons, 0);
  }

  private getJurisdictionName(code: string): string {
    const names: { [key: string]: string } = {
      AL: 'Alabama',
      AK: 'Alaska',
      AZ: 'Arizona',
      AR: 'Arkansas',
      CA: 'California',
      CO: 'Colorado',
      CT: 'Connecticut',
      DE: 'Delaware',
      FL: 'Florida',
      GA: 'Georgia',
      HI: 'Hawaii',
      ID: 'Idaho',
      IL: 'Illinois',
      IN: 'Indiana',
      IA: 'Iowa',
      KS: 'Kansas',
      KY: 'Kentucky',
      LA: 'Louisiana',
      ME: 'Maine',
      MD: 'Maryland',
      MA: 'Massachusetts',
      MI: 'Michigan',
      MN: 'Minnesota',
      MS: 'Mississippi',
      MO: 'Missouri',
      MT: 'Montana',
      NE: 'Nebraska',
      NV: 'Nevada',
      NH: 'New Hampshire',
      NJ: 'New Jersey',
      NM: 'New Mexico',
      NY: 'New York',
      NC: 'North Carolina',
      ND: 'North Dakota',
      OH: 'Ohio',
      OK: 'Oklahoma',
      OR: 'Oregon',
      PA: 'Pennsylvania',
      RI: 'Rhode Island',
      SC: 'South Carolina',
      SD: 'South Dakota',
      TN: 'Tennessee',
      TX: 'Texas',
      UT: 'Utah',
      VT: 'Vermont',
      VA: 'Virginia',
      WA: 'Washington',
      WV: 'West Virginia',
      WI: 'Wisconsin',
      WY: 'Wyoming',
    };
    return names[code] || code;
  }
}

// Export singleton instances
export const iftaService = new IFTAService();
