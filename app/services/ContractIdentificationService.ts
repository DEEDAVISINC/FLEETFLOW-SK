/**
 * FleetFlow Contract Identification Service
 * Generates professional contract identifiers for lead generation and exclusive partnership contracts
 * Format: EP-{Year}{Sequence}-{BrokerCode}-{ShipperCode}-{CommissionCode}-{Status}
 * Example: EP-2024001-JD-WMT-05-A
 */

export interface ContractIdentificationData {
  brokerInitials: string; // e.g., "JD" for John Doe
  brokerCompany: string; // e.g., "Acme Logistics"
  shipperCode: string; // e.g., "WMT" for Walmart
  commissionRate: number; // e.g., 5 for 5%
  statusCode?: string; // e.g., 'A' for Active, 'P' for Pending
}

export interface GeneratedContractIdentifier {
  contractIdentifier: string;
  contractNumber: string;
  sequence: number;
  year: number;
  brokerInitials: string;
  shipperCode: string;
  commissionCode: string;
  statusCode: string;
  generatedAt: string;
}

export class ContractIdentificationService {
  private static sequence = 1;
  private static lastYear = new Date().getFullYear();

  /**
   * Generate a professional contract identifier and number
   */
  static generateContractIdentifier(
    data: ContractIdentificationData
  ): GeneratedContractIdentifier {
    const now = new Date();
    const year = now.getFullYear();
    if (year !== this.lastYear) {
      this.sequence = 1;
      this.lastYear = year;
    }
    const sequence = this.sequence++;
    const paddedSeq = String(sequence).padStart(3, '0');
    const broker = (data.brokerInitials || 'XX').toUpperCase();
    const shipper = (data.shipperCode || 'XXX').toUpperCase();
    const commission = String(Math.round(data.commissionRate)).padStart(2, '0');
    const status = (data.statusCode || 'A').toUpperCase();
    const contractIdentifier = `EP-${year}${paddedSeq}-${broker}-${shipper}-${commission}-${status}`;
    const contractNumber = `EP-${year}-${paddedSeq}`;
    return {
      contractIdentifier,
      contractNumber,
      sequence,
      year,
      brokerInitials: broker,
      shipperCode: shipper,
      commissionCode: commission,
      statusCode: status,
      generatedAt: now.toISOString(),
    };
  }
}
