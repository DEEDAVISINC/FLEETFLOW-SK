// Driver Tax Preparation Service
// Connects drivers directly to their fuel tax and IFTA data

export interface DriverTaxData {
  driverId: string;
  driverName: string;
  licenseNumber: string;
  taxYear: number;
  quarter: string;
  totalMiles: number;
  totalFuelPurchases: number;
  totalTaxLiability: number;
  jurisdictions: DriverJurisdictionData[];
  fuelReceipts: FuelReceipt[];
  iftaStatus: 'needs-filing' | 'filed' | 'paid' | 'complete';
  lastUpdated: Date;
}

export interface DriverJurisdictionData {
  jurisdiction: string;
  jurisdictionCode: string;
  miles: number;
  fuelPurchased: number;
  fuelGallons: number;
  taxRate: number;
  taxDue: number;
  taxPaid: number;
  balance: number;
}

export interface FuelReceipt {
  id: string;
  date: Date;
  location: string;
  jurisdiction: string;
  vendor: string;
  gallons: number;
  pricePerGallon: number;
  totalAmount: number;
  taxAmount: number;
  receiptNumber: string;
  uploaded: boolean;
}

export interface DriverTaxSummary {
  driverId: string;
  currentQuarter: {
    totalMiles: number;
    totalFuel: number;
    totalTax: number;
    filingDue: Date;
    status: string;
  };
  yearToDate: {
    totalMiles: number;
    totalFuel: number;
    totalTax: number;
    refundsReceived: number;
  };
  compliance: {
    iftaUpToDate: boolean;
    receiptsComplete: boolean;
    nextFilingDue: Date;
    overdueItems: string[];
  };
}

class DriverTaxService {
  private driverTaxData: Map<string, DriverTaxData> = new Map();
  private taxSummaries: Map<string, DriverTaxSummary> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock data for different drivers
    const drivers = [
      {
        id: 'driver_001',
        name: 'John Smith',
        license: 'CDL123456789'
      },
      {
        id: 'driver_002', 
        name: 'Maria Garcia',
        license: 'CDL987654321'
      },
      {
        id: 'driver_003',
        name: 'Robert Johnson',
        license: 'CDL456789123'
      }
    ];

    drivers.forEach((driver, index) => {
      // Create tax data for each driver
      const taxData: DriverTaxData = {
        driverId: driver.id,
        driverName: driver.name,
        licenseNumber: driver.license,
        taxYear: 2024,
        quarter: 'Q4',
        totalMiles: 15000 + (index * 3000),
        totalFuelPurchases: 5500 + (index * 1200),
        totalTaxLiability: 650 + (index * 150),
        lastUpdated: new Date(),
        iftaStatus: index === 0 ? 'needs-filing' : index === 1 ? 'filed' : 'complete',
        jurisdictions: this.generateJurisdictionData(index),
        fuelReceipts: this.generateFuelReceipts(driver.id, index)
      };

      this.driverTaxData.set(driver.id, taxData);

      // Create tax summary
      const summary: DriverTaxSummary = {
        driverId: driver.id,
        currentQuarter: {
          totalMiles: taxData.totalMiles,
          totalFuel: taxData.totalFuelPurchases,
          totalTax: taxData.totalTaxLiability,
          filingDue: new Date('2025-01-31'),
          status: taxData.iftaStatus
        },
        yearToDate: {
          totalMiles: taxData.totalMiles * 4,
          totalFuel: taxData.totalFuelPurchases * 4,
          totalTax: taxData.totalTaxLiability * 4,
          refundsReceived: 450 + (index * 100)
        },
        compliance: {
          iftaUpToDate: taxData.iftaStatus === 'complete',
          receiptsComplete: index < 2,
          nextFilingDue: new Date('2025-01-31'),
          overdueItems: index === 2 ? ['Upload fuel receipts for December'] : []
        }
      };

      this.taxSummaries.set(driver.id, summary);
    });
  }

  private generateJurisdictionData(driverIndex: number): DriverJurisdictionData[] {
    const baseJurisdictions = [
      { name: 'California', code: 'CA', taxRate: 0.13 },
      { name: 'Nevada', code: 'NV', taxRate: 0.12 },
      { name: 'Arizona', code: 'AZ', taxRate: 0.11 },
      { name: 'Oregon', code: 'OR', taxRate: 0.0 },
      { name: 'Texas', code: 'TX', taxRate: 0.14 }
    ];

    return baseJurisdictions.map((jurisdiction, index) => {
      const miles = 1000 + (driverIndex * 500) + (index * 200);
      const fuelGallons = miles / 6.5; // Assume 6.5 MPG
      const fuelPurchased = fuelGallons * (3.50 + (index * 0.1));
      const taxDue = fuelPurchased * jurisdiction.taxRate;

      return {
        jurisdiction: jurisdiction.name,
        jurisdictionCode: jurisdiction.code,
        miles,
        fuelPurchased: Math.round(fuelPurchased * 100) / 100,
        fuelGallons: Math.round(fuelGallons * 100) / 100,
        taxRate: jurisdiction.taxRate,
        taxDue: Math.round(taxDue * 100) / 100,
        taxPaid: index < 3 ? Math.round(taxDue * 100) / 100 : 0,
        balance: index < 3 ? 0 : Math.round(taxDue * 100) / 100
      };
    });
  }

  private generateFuelReceipts(driverId: string, driverIndex: number): FuelReceipt[] {
    const receipts: FuelReceipt[] = [];
    const vendors = ['Shell', 'Chevron', 'Flying J', 'Love\'s', 'Pilot'];
    const locations = [
      { city: 'Los Angeles, CA', jurisdiction: 'California' },
      { city: 'Las Vegas, NV', jurisdiction: 'Nevada' },
      { city: 'Phoenix, AZ', jurisdiction: 'Arizona' },
      { city: 'Portland, OR', jurisdiction: 'Oregon' },
      { city: 'Dallas, TX', jurisdiction: 'Texas' }
    ];

    for (let i = 0; i < 12; i++) {
      const location = locations[i % locations.length];
      const vendor = vendors[i % vendors.length];
      const gallons = 80 + Math.random() * 40;
      const pricePerGallon = 3.40 + Math.random() * 0.60;
      const totalAmount = gallons * pricePerGallon;
      const taxRate = location.jurisdiction === 'Oregon' ? 0 : 0.12 + Math.random() * 0.03;
      const taxAmount = totalAmount * taxRate;

      receipts.push({
        id: `receipt_${driverId}_${i + 1}`,
        date: new Date(2024, 9 + Math.floor(i / 4), Math.floor(Math.random() * 28) + 1),
        location: location.city,
        jurisdiction: location.jurisdiction,
        vendor,
        gallons: Math.round(gallons * 100) / 100,
        pricePerGallon: Math.round(pricePerGallon * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        receiptNumber: `${vendor.toUpperCase()}${Date.now()}${i}`,
        uploaded: driverIndex < 2 || i < 10
      });
    }

    return receipts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Get driver's complete tax data
  getDriverTaxData(driverId: string): DriverTaxData | null {
    return this.driverTaxData.get(driverId) || null;
  }

  // Get driver's tax summary
  getDriverTaxSummary(driverId: string): DriverTaxSummary | null {
    return this.taxSummaries.get(driverId) || null;
  }

  // Get all drivers for admin view
  getAllDriverTaxData(): DriverTaxData[] {
    return Array.from(this.driverTaxData.values());
  }

  // Update fuel receipt
  addFuelReceipt(driverId: string, receipt: Omit<FuelReceipt, 'id'>): boolean {
    const driverData = this.driverTaxData.get(driverId);
    if (!driverData) return false;

    const newReceipt: FuelReceipt = {
      ...receipt,
      id: `receipt_${driverId}_${Date.now()}`
    };

    driverData.fuelReceipts.unshift(newReceipt);
    driverData.lastUpdated = new Date();

    // Recalculate totals
    this.recalculateDriverTotals(driverId);
    return true;
  }

  // Update mileage for jurisdiction
  updateJurisdictionMiles(driverId: string, jurisdictionCode: string, miles: number): boolean {
    const driverData = this.driverTaxData.get(driverId);
    if (!driverData) return false;

    const jurisdiction = driverData.jurisdictions.find(j => j.jurisdictionCode === jurisdictionCode);
    if (!jurisdiction) return false;

    jurisdiction.miles = miles;
    driverData.lastUpdated = new Date();

    this.recalculateDriverTotals(driverId);
    return true;
  }

  // File IFTA for driver
  fileIFTA(driverId: string): boolean {
    const driverData = this.driverTaxData.get(driverId);
    if (!driverData) return false;

    driverData.iftaStatus = 'filed';
    driverData.lastUpdated = new Date();

    // Update summary
    const summary = this.taxSummaries.get(driverId);
    if (summary) {
      summary.currentQuarter.status = 'filed';
      summary.compliance.iftaUpToDate = true;
    }

    return true;
  }

  private recalculateDriverTotals(driverId: string): void {
    const driverData = this.driverTaxData.get(driverId);
    if (!driverData) return;

    // Recalculate totals from jurisdictions
    driverData.totalMiles = driverData.jurisdictions.reduce((sum, j) => sum + j.miles, 0);
    driverData.totalFuelPurchases = driverData.jurisdictions.reduce((sum, j) => sum + j.fuelPurchased, 0);
    driverData.totalTaxLiability = driverData.jurisdictions.reduce((sum, j) => sum + j.taxDue, 0);

    // Update summary
    const summary = this.taxSummaries.get(driverId);
    if (summary) {
      summary.currentQuarter.totalMiles = driverData.totalMiles;
      summary.currentQuarter.totalFuel = driverData.totalFuelPurchases;
      summary.currentQuarter.totalTax = driverData.totalTaxLiability;
    }
  }

  // Generate IFTA report for driver
  generateIFTAReport(driverId: string): string {
    const driverData = this.driverTaxData.get(driverId);
    if (!driverData) return '';

    let report = `IFTA QUARTERLY REPORT - ${driverData.quarter} ${driverData.taxYear}\n`;
    report += `Driver: ${driverData.driverName} (${driverData.licenseNumber})\n\n`;
    report += `JURISDICTION SUMMARY:\n`;
    report += `${'Jurisdiction'.padEnd(15)} ${'Miles'.padStart(8)} ${'Fuel($)'.padStart(10)} ${'Tax Due'.padStart(10)}\n`;
    report += `${'='.repeat(50)}\n`;

    driverData.jurisdictions.forEach(j => {
      report += `${j.jurisdiction.padEnd(15)} ${j.miles.toString().padStart(8)} `;
      report += `$${j.fuelPurchased.toFixed(2).padStart(9)} $${j.taxDue.toFixed(2).padStart(9)}\n`;
    });

    report += `${'='.repeat(50)}\n`;
    report += `TOTALS:          ${driverData.totalMiles.toString().padStart(8)} `;
    report += `$${driverData.totalFuelPurchases.toFixed(2).padStart(9)} $${driverData.totalTaxLiability.toFixed(2).padStart(9)}\n`;

    return report;
  }

  // Get alert information for driver
  getDriverAlerts(driverId: string): { urgent: number; warning: number; total: number } {
    const summary = this.taxSummaries.get(driverId);
    if (!summary) return { urgent: 0, warning: 0, total: 0 };

    let urgent = 0;
    let warning = 0;

    const today = new Date();
    const filingDue = new Date(summary.currentQuarter.filingDue);
    const daysUntilDue = Math.ceil((filingDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Check filing alerts
    if (summary.currentQuarter.status === 'needs-filing') {
      if (daysUntilDue <= 7) {
        urgent++;
      } else if (daysUntilDue <= 30) {
        warning++;
      }
    }

    // Check compliance alerts
    if (!summary.compliance.receiptsComplete) {
      warning++;
    }

    // Check overdue items
    urgent += summary.compliance.overdueItems.length;

    return { urgent, warning, total: urgent + warning };
  }

  // Check if driver has any urgent alerts
  hasUrgentAlerts(driverId: string): boolean {
    const alerts = this.getDriverAlerts(driverId);
    return alerts.urgent > 0;
  }
}

export const driverTaxService = new DriverTaxService();
