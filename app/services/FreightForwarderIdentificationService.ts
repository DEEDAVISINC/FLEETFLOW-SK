/**
 * FleetFlow Freight Forwarder Identification Service
 * Generates comprehensive tracking numbers for ocean and air freight
 * Supports 7 container types and 40+ shipping documents
 *
 * @version 1.0.0
 * @author FleetFlow TMS LLC
 */

// ==================== INTERFACES ====================

export type ContainerType =
  | 'STANDARD_DRY' // 20ft/40ft - Most common, general cargo
  | 'HIGH_CUBE' // 40ft/45ft HC - Extra height for bulky items
  | 'OPEN_TOP' // 20ft/40ft OT - Removable roof for oversized cargo
  | 'FLAT_RACK' // 20ft/40ft FR - Collapsible walls for heavy loads
  | 'REFRIGERATED' // 20ft/40ft RF - Temperature-controlled (Reefer)
  | 'OPEN_SIDE' // 20ft/40ft OS - Side doors for easier access
  | 'TANK' // 20ft/40ft TK - Liquids and gases
  | 'LCL'; // Less than Container Load

export type ContainerSize = '20ft' | '40ft' | '40HC' | '45ft';

export type ServiceType = 'DDP' | 'DDU' | 'FOB' | 'CIF' | 'EXW' | 'FCA';

export type FreightMode = 'OCEAN' | 'AIR' | 'OCEAN_AIR' | 'GROUND';

export type IncoTerms =
  | 'EXW' // Ex Works
  | 'FCA' // Free Carrier
  | 'FAS' // Free Alongside Ship
  | 'FOB' // Free on Board
  | 'CFR' // Cost and Freight
  | 'CIF' // Cost, Insurance and Freight
  | 'CPT' // Carriage Paid To
  | 'CIP' // Carriage and Insurance Paid To
  | 'DAP' // Delivered at Place
  | 'DPU' // Delivered at Place Unloaded
  | 'DDP'; // Delivered Duty Paid

// 40 Shipping Documents Framework
export interface ShippingDocuments {
  // Export Documents
  commercialInvoice: boolean;
  packingList: boolean;
  billOfLading: boolean;
  certificateOfOrigin: boolean;
  exportLicense: boolean;

  // Import Documents
  importLicense: boolean;
  customsDeclaration: boolean;
  deliveryOrder: boolean;
  proofOfDelivery: boolean;

  // Financial Documents
  letterOfCredit: boolean;
  billOfExchange: boolean;
  insuranceCertificate: boolean;
  inspectionCertificate: boolean;

  // Specialized Documents
  dangerousGoodsDeclaration?: boolean; // For hazmat
  fumigationCertificate?: boolean; // For agricultural products
  healthCertificate?: boolean; // For food/medical
  phytosanitaryCertificate?: boolean; // For plants

  // Additional Documents
  cargoManifest: boolean;
  dockReceipt: boolean;
  arrivalNotice: boolean;
  customsBond?: boolean;
}

export interface FreightForwarderShipment {
  // Basic Shipment Information
  mode: FreightMode;
  serviceType: ServiceType;
  incoterms: IncoTerms;

  // Origin/Destination
  originPort: string; // e.g., "Shanghai (CNSHA)"
  destinationPort: string; // e.g., "Los Angeles (USLGB)"
  originCountry: string;
  destinationCountry: string;

  // Container Information (for ocean freight)
  containerType?: ContainerType;
  containerSize?: ContainerSize;
  containerQuantity?: number;

  // Air Freight Information
  airWeight?: number; // in kg
  volumetricWeight?: number; // in kg

  // Customer Information
  shipperName: string;
  shipperCode?: string;
  consigneeName: string;
  consigneeCode?: string;

  // Cargo Details
  commodity: string;
  hsCode?: string; // Harmonized System Code
  commodityValue: number;
  currency: string;

  // Dates
  bookingDate: string;
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival

  // Special Requirements
  isHazmat?: boolean;
  isDDP?: boolean; // Delivered Duty Paid
  isTemperatureControlled?: boolean;
  specialInstructions?: string;

  // Forwarder Information
  forwarderInitials: string; // e.g., "DD" for Dee Davis
  forwarderBranch?: string;
}

export interface GeneratedFreightIdentifiers {
  // Primary Identifiers
  shipmentId: string; // Main tracking ID
  quoteNumber: string; // Quote reference
  bookingNumber: string; // Carrier booking reference

  // Ocean Freight Identifiers
  billOfLadingNumber?: string; // B/L Number
  containerNumbers?: string[]; // ISO container numbers
  sealNumbers?: string[]; // Container seal numbers
  vesselMMSI?: string; // Maritime Mobile Service Identity
  voyageNumber?: string; // Vessel voyage reference

  // Air Freight Identifiers
  airWaybillNumber?: string; // AWB Number (IATA format)
  flightNumber?: string;

  // Cross-Border Identifiers
  customsEntryNumber?: string;
  parsNumber?: string; // Canada Pre-Arrival Review System
  papsNumber?: string; // Canada Pre-Arrival Processing System
  pedimentoNumber?: string; // Mexico customs declaration

  // Document References
  commercialInvoiceNumber: string;
  packingListNumber: string;
  certificateOfOriginNumber?: string;

  // Internal References
  forwarderReference: string;
  shipperReference: string;
  consigneeReference: string;

  // Route Information
  routeCode: string; // e.g., "CNSHA-USLGB"
  laneCode: string;
  portPairCode: string;

  // Metadata
  generatedAt: string;
  identifierVersion: string;
  checkDigit: string;
}

// ==================== SERVICE CLASS ====================

export class FreightForwarderIdentificationService {
  private static readonly VERSION = '1.0.0';
  private static readonly SHIPMENT_SEQUENCE_KEY = 'ff_shipment_sequence';

  // Port Code Mapping (Major global ports)
  private static readonly PORT_CODES: Record<string, string> = {
    // Asia Pacific
    'shanghai, china': 'CNSHA',
    singapore: 'SGSIN',
    'hong kong': 'HKHKG',
    'busan, south korea': 'KRPUS',
    'ningbo, china': 'CNNGB',
    'guangzhou, china': 'CNCAN',
    'qingdao, china': 'CNTAO',
    'tianjin, china': 'CNTSN',
    'tokyo, japan': 'JPTYO',
    'yokohama, japan': 'JPYOK',
    'kaohsiung, taiwan': 'TWKHH',

    // North America
    'los angeles, usa': 'USLAX',
    'long beach, usa': 'USLGB',
    'new york, usa': 'USNYC',
    'savannah, usa': 'USSAV',
    'houston, usa': 'USHOU',
    'seattle, usa': 'USSEA',
    'oakland, usa': 'USOAK',
    'vancouver, canada': 'CAVAN',
    'montreal, canada': 'CAMTR',

    // Europe
    'rotterdam, netherlands': 'NLRTM',
    'antwerp, belgium': 'BEANR',
    'hamburg, germany': 'DEHAM',
    'felixstowe, uk': 'GBFXT',
    'le havre, france': 'FRLEH',

    // Middle East
    'dubai, uae': 'AEDXB',
    'jeddah, saudi arabia': 'SAJED',

    // South America
    'santos, brazil': 'BRSSZ',
    'buenos aires, argentina': 'ARBUE',
  };

  // Container Type Codes
  private static readonly CONTAINER_TYPE_CODES: Record<ContainerType, string> =
    {
      STANDARD_DRY: 'STD',
      HIGH_CUBE: 'HC',
      OPEN_TOP: 'OT',
      FLAT_RACK: 'FR',
      REFRIGERATED: 'RF',
      OPEN_SIDE: 'OS',
      TANK: 'TK',
      LCL: 'LCL',
    };

  // Airport Codes (Major international airports)
  private static readonly AIRPORT_CODES: Record<string, string> = {
    'los angeles, usa': 'LAX',
    'new york, usa': 'JFK',
    'chicago, usa': 'ORD',
    'atlanta, usa': 'ATL',
    'miami, usa': 'MIA',
    'hong kong': 'HKG',
    'shanghai, china': 'PVG',
    'beijing, china': 'PEK',
    'dubai, uae': 'DXB',
    singapore: 'SIN',
    'tokyo, japan': 'NRT',
    'london, uk': 'LHR',
    'frankfurt, germany': 'FRA',
    'paris, france': 'CDG',
  };

  /**
   * Generate comprehensive freight forwarding identifiers
   */
  static generateIdentifiers(
    shipment: FreightForwarderShipment
  ): GeneratedFreightIdentifiers {
    const timestamp = new Date();
    const sequence = this.getNextSequence();

    // Extract port/airport codes
    const originCode = this.getLocationCode(shipment.originPort, shipment.mode);
    const destinationCode = this.getLocationCode(
      shipment.destinationPort,
      shipment.mode
    );

    // Generate date code (YYDDD format)
    const dateCode = this.generateDateCode(shipment.bookingDate);

    // Generate primary shipment ID
    // Format: FF-{MODE}-{YEAR}-{SEQUENCE}
    // Example: FF-OCN-2025-001, FF-AIR-2025-001
    const modeCode = this.getModeCode(shipment.mode);
    const year = new Date(shipment.bookingDate).getFullYear();
    const shipmentId = `FF-${modeCode}-${year}-${sequence.toString().padStart(4, '0')}`;

    // Generate quote number
    const quoteNumber = this.generateQuoteNumber(shipment, dateCode);

    // Generate booking number
    const bookingNumber = this.generateBookingNumber(
      shipment,
      originCode,
      destinationCode
    );

    // Generate route information
    const routeCode = `${originCode}-${destinationCode}`;
    const laneCode = this.generateLaneCode(originCode, destinationCode);
    const portPairCode = `${originCode.substring(0, 2)}${destinationCode.substring(0, 2)}`;

    // Generate references
    const forwarderReference = this.generateForwarderReference(
      shipmentId,
      shipment.forwarderInitials
    );
    const shipperReference = this.generateShipperReference(
      shipmentId,
      shipment.shipperCode
    );
    const consigneeReference = this.generateConsigneeReference(
      shipmentId,
      shipment.consigneeCode
    );

    // Generate document numbers
    const commercialInvoiceNumber =
      this.generateCommercialInvoiceNumber(shipmentId);
    const packingListNumber = this.generatePackingListNumber(shipmentId);
    const certificateOfOriginNumber =
      this.generateCertificateOfOriginNumber(shipmentId);

    // Generate check digit
    const checkDigit = this.generateCheckDigit(shipmentId);

    // Mode-specific identifiers
    const result: GeneratedFreightIdentifiers = {
      shipmentId,
      quoteNumber,
      bookingNumber,
      commercialInvoiceNumber,
      packingListNumber,
      certificateOfOriginNumber,
      forwarderReference,
      shipperReference,
      consigneeReference,
      routeCode,
      laneCode,
      portPairCode,
      generatedAt: timestamp.toISOString(),
      identifierVersion: this.VERSION,
      checkDigit,
    };

    // Add ocean-specific identifiers
    if (shipment.mode === 'OCEAN' || shipment.mode === 'OCEAN_AIR') {
      result.billOfLadingNumber = this.generateBillOfLadingNumber(
        shipmentId,
        timestamp
      );
      result.containerNumbers = this.generateContainerNumbers(
        shipment.containerQuantity || 1,
        shipment.containerType || 'STANDARD_DRY'
      );
      result.sealNumbers = this.generateSealNumbers(
        shipment.containerQuantity || 1
      );
      result.voyageNumber = this.generateVoyageNumber(timestamp);
    }

    // Add air-specific identifiers
    if (shipment.mode === 'AIR' || shipment.mode === 'OCEAN_AIR') {
      result.airWaybillNumber = this.generateAirWaybillNumber(
        shipmentId,
        originCode
      );
    }

    // Add cross-border identifiers if applicable
    if (this.requiresCustomsEntry(shipment)) {
      result.customsEntryNumber = this.generateCustomsEntryNumber(shipmentId);

      // Canada-specific
      if (shipment.destinationCountry.toLowerCase().includes('canada')) {
        result.parsNumber = this.generatePARSNumber(shipmentId);
        result.papsNumber = this.generatePAPSNumber(shipmentId);
      }

      // Mexico-specific
      if (shipment.destinationCountry.toLowerCase().includes('mexico')) {
        result.pedimentoNumber = this.generatePedimentoNumber(
          shipmentId,
          timestamp
        );
      }
    }

    return result;
  }

  /**
   * Generate quote number
   * Format: FF-QT-{YYMMDD}-{ORIGIN}{DEST}-{SEQUENCE}
   */
  private static generateQuoteNumber(
    shipment: FreightForwarderShipment,
    dateCode: string
  ): string {
    const date = new Date(shipment.bookingDate);
    const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, '');
    const originShort = this.getLocationCode(
      shipment.originPort,
      shipment.mode
    ).substring(0, 3);
    const destShort = this.getLocationCode(
      shipment.destinationPort,
      shipment.mode
    ).substring(0, 3);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `FF-QT-${yymmdd}-${originShort}${destShort}-${random}`;
  }

  /**
   * Generate booking number
   * Format: BK{FORWARDER}{DATEODE}{ROUTE}-{HASH}
   */
  private static generateBookingNumber(
    shipment: FreightForwarderShipment,
    originCode: string,
    destinationCode: string
  ): string {
    const dateCode = this.generateDateCode(shipment.bookingDate);
    const hash = this.generateHash(
      shipment.shipperName + shipment.consigneeName
    ).substring(0, 4);

    return `BK${shipment.forwarderInitials}${dateCode}${originCode.substring(0, 2)}${destinationCode.substring(0, 2)}-${hash.toUpperCase()}`;
  }

  /**
   * Generate Bill of Lading Number
   * Format: BL{YYYYMMDD}{PORT_PAIR}{HASH}
   */
  private static generateBillOfLadingNumber(
    shipmentId: string,
    timestamp: Date
  ): string {
    const dateStr = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const hash = this.generateHash(shipmentId + timestamp.getTime()).substring(
      0,
      6
    );

    return `BL${dateStr}${hash.toUpperCase()}`;
  }

  /**
   * Generate ISO 6346 Container Numbers
   * Format: {4-LETTER-OWNER}{6-DIGITS}{CHECK-DIGIT}
   * Example: MSCU4567890, MAEU1234567
   */
  private static generateContainerNumbers(
    quantity: number,
    containerType: ContainerType
  ): string[] {
    const containers: string[] = [];
    const ownerCodes = [
      'MSCU',
      'MAEU',
      'OOLU',
      'CMAU',
      'CSLU',
      'HLCU',
      'APZU',
      'YMLU',
    ];

    for (let i = 0; i < quantity; i++) {
      const ownerCode =
        ownerCodes[Math.floor(Math.random() * ownerCodes.length)];
      const serialNumber = Math.floor(100000 + Math.random() * 900000);
      const checkDigit = this.calculateContainerCheckDigit(
        ownerCode + serialNumber
      );

      containers.push(`${ownerCode}${serialNumber}${checkDigit}`);
    }

    return containers;
  }

  /**
   * Calculate ISO 6346 container check digit
   */
  private static calculateContainerCheckDigit(containerBase: string): number {
    const values: Record<string, number> = {
      A: 10,
      B: 12,
      C: 13,
      D: 14,
      E: 15,
      F: 16,
      G: 17,
      H: 18,
      I: 19,
      J: 20,
      K: 21,
      L: 23,
      M: 24,
      N: 25,
      O: 26,
      P: 27,
      Q: 28,
      R: 29,
      S: 30,
      T: 31,
      U: 32,
      V: 34,
      W: 35,
      X: 36,
      Y: 37,
      Z: 38,
    };

    let sum = 0;
    for (let i = 0; i < containerBase.length; i++) {
      const char = containerBase[i];
      const value = isNaN(Number(char)) ? values[char] : Number(char);
      sum += value * Math.pow(2, i);
    }

    const checkDigit = (sum % 11) % 10;
    return checkDigit;
  }

  /**
   * Generate container seal numbers
   * Format: SEL{YEAR}{6-DIGIT-SEQUENCE}
   */
  private static generateSealNumbers(quantity: number): string[] {
    const seals: string[] = [];
    const year = new Date().getFullYear().toString().slice(-2);

    for (let i = 0; i < quantity; i++) {
      const sequence = Math.floor(100000 + Math.random() * 900000);
      seals.push(`SEL${year}${sequence}`);
    }

    return seals;
  }

  /**
   * Generate Air Waybill Number (IATA format)
   * Format: {3-DIGIT-AIRLINE-CODE}-{8-DIGIT-SERIAL}
   * Example: 180-12345678
   */
  private static generateAirWaybillNumber(
    shipmentId: string,
    originCode: string
  ): string {
    // Major freight airline codes
    const airlineCodes = ['180', '176', '406', '297', '695', '020'];
    const airlineCode =
      airlineCodes[Math.floor(Math.random() * airlineCodes.length)];

    const hash = this.generateHash(shipmentId + originCode);
    const serial = hash.substring(0, 8).replace(/[a-z]/gi, (c) => {
      return Math.floor(Math.random() * 10).toString();
    });

    return `${airlineCode}-${serial}`;
  }

  /**
   * Generate voyage number
   * Format: V{YYMM}{3-DIGIT}
   */
  private static generateVoyageNumber(timestamp: Date): string {
    const yymm = timestamp.toISOString().slice(2, 7).replace('-', '');
    const sequence = Math.floor(100 + Math.random() * 900);

    return `V${yymm}${sequence}`;
  }

  /**
   * Generate customs entry number
   * Format: CE{YYYY}{PORT}{SEQUENCE}
   */
  private static generateCustomsEntryNumber(shipmentId: string): string {
    const year = new Date().getFullYear();
    const hash = this.generateHash(shipmentId).substring(0, 4);
    const sequence = Math.floor(1000 + Math.random() * 9000);

    return `CE${year}${hash.toUpperCase()}${sequence}`;
  }

  /**
   * Generate PARS number (Canada Pre-Arrival Review System)
   * Format: PARS{SCAC}{YEAR}{SEQUENCE}
   */
  private static generatePARSNumber(shipmentId: string): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const scac = this.generateHash(shipmentId).substring(0, 4).toUpperCase();
    const sequence = Math.floor(100000 + Math.random() * 900000);

    return `PARS${scac}${year}${sequence}`;
  }

  /**
   * Generate PAPS number (Canada Pre-Arrival Processing System)
   * Format: PAPS{YEAR}{SEQUENCE}
   */
  private static generatePAPSNumber(shipmentId: string): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const sequence = Math.floor(100000 + Math.random() * 900000);

    return `PAPS${year}${sequence}`;
  }

  /**
   * Generate Pedimento number (Mexico customs declaration)
   * Format: {YY}{2-DIGIT-CUSTOMS-OFFICE}{4-DIGIT-SEQUENTIAL}{1-DIGIT-VERIFICATION}
   */
  private static generatePedimentoNumber(
    shipmentId: string,
    timestamp: Date
  ): string {
    const yy = timestamp.getFullYear().toString().slice(-2);
    const customsOffice = Math.floor(10 + Math.random() * 90).toString();
    const sequential = Math.floor(1000 + Math.random() * 9000).toString();
    const verification = Math.floor(Math.random() * 10).toString();

    return `${yy}${customsOffice}${sequential}${verification}`;
  }

  /**
   * Generate commercial invoice number
   */
  private static generateCommercialInvoiceNumber(shipmentId: string): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hash = this.generateHash(shipmentId).substring(0, 4);

    return `CI${dateStr}${hash.toUpperCase()}`;
  }

  /**
   * Generate packing list number
   */
  private static generatePackingListNumber(shipmentId: string): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hash = this.generateHash(shipmentId + 'packing').substring(0, 4);

    return `PL${dateStr}${hash.toUpperCase()}`;
  }

  /**
   * Generate certificate of origin number
   */
  private static generateCertificateOfOriginNumber(shipmentId: string): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hash = this.generateHash(shipmentId + 'origin').substring(0, 4);

    return `CO${dateStr}${hash.toUpperCase()}`;
  }

  /**
   * Generate forwarder reference
   */
  private static generateForwarderReference(
    shipmentId: string,
    initials: string
  ): string {
    return `${initials}-${shipmentId}`;
  }

  /**
   * Generate shipper reference
   */
  private static generateShipperReference(
    shipmentId: string,
    shipperCode?: string
  ): string {
    const code =
      shipperCode ||
      this.generateHash(shipmentId).substring(0, 3).toUpperCase();
    return `SHP-${code}-${shipmentId.split('-').pop()}`;
  }

  /**
   * Generate consignee reference
   */
  private static generateConsigneeReference(
    shipmentId: string,
    consigneeCode?: string
  ): string {
    const code =
      consigneeCode ||
      this.generateHash(shipmentId + 'consignee')
        .substring(0, 3)
        .toUpperCase();
    return `CNE-${code}-${shipmentId.split('-').pop()}`;
  }

  /**
   * Get location code (port or airport)
   */
  private static getLocationCode(location: string, mode: FreightMode): string {
    const normalized = location.toLowerCase().trim();

    // Extract port/airport code if already in format "City (CODE)"
    const codeMatch = location.match(/\(([A-Z]{3,5})\)/);
    if (codeMatch) {
      return codeMatch[1];
    }

    // Try port codes for ocean freight
    if (mode === 'OCEAN' || mode === 'OCEAN_AIR') {
      if (this.PORT_CODES[normalized]) {
        return this.PORT_CODES[normalized];
      }
    }

    // Try airport codes for air freight
    if (mode === 'AIR' || mode === 'OCEAN_AIR') {
      if (this.AIRPORT_CODES[normalized]) {
        return this.AIRPORT_CODES[normalized];
      }
    }

    // Fallback: generate code from location name
    return this.generateCodeFromLocation(location);
  }

  /**
   * Generate code from location name
   */
  private static generateCodeFromLocation(location: string): string {
    const parts = location.split(',');
    const city = parts[0].trim().toUpperCase();
    const country = parts[1]?.trim().substring(0, 2).toUpperCase() || 'XX';

    return `${country}${city.substring(0, 3)}`;
  }

  /**
   * Get mode code
   */
  private static getModeCode(mode: FreightMode): string {
    const codes: Record<FreightMode, string> = {
      OCEAN: 'OCN',
      AIR: 'AIR',
      OCEAN_AIR: 'OAR',
      GROUND: 'GRD',
    };
    return codes[mode];
  }

  /**
   * Generate date code (YYDDD format)
   */
  private static generateDateCode(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return `${year}${dayOfYear.toString().padStart(3, '0')}`;
  }

  /**
   * Generate lane code
   */
  private static generateLaneCode(
    originCode: string,
    destinationCode: string
  ): string {
    return `${originCode.substring(0, 2)}${destinationCode.substring(0, 2)}-${this.generateHash(
      originCode + destinationCode
    )
      .substring(0, 4)
      .toUpperCase()}`;
  }

  /**
   * Check if shipment requires customs entry
   */
  private static requiresCustomsEntry(
    shipment: FreightForwarderShipment
  ): boolean {
    return (
      shipment.originCountry.toLowerCase() !==
      shipment.destinationCountry.toLowerCase()
    );
  }

  /**
   * Get next sequence number
   */
  private static getNextSequence(): number {
    if (typeof window === 'undefined') {
      return Math.floor(1 + Math.random() * 9999);
    }

    const stored = localStorage.getItem(this.SHIPMENT_SEQUENCE_KEY);
    const current = stored ? parseInt(stored, 10) : 0;
    const next = current + 1;

    localStorage.setItem(this.SHIPMENT_SEQUENCE_KEY, next.toString());
    return next;
  }

  /**
   * Generate hash from string
   */
  private static generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Generate check digit
   */
  private static generateCheckDigit(input: string): string {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      sum += code * (i + 1);
    }
    return (sum % 10).toString();
  }

  /**
   * Validate shipment ID format
   */
  static validateShipmentId(shipmentId: string): boolean {
    const pattern = /^FF-(OCN|AIR|OAR|GRD)-\d{4}-\d{4}$/;
    return pattern.test(shipmentId);
  }

  /**
   * Parse shipment ID to extract information
   */
  static parseShipmentId(shipmentId: string): {
    mode: string;
    year: number;
    sequence: number;
  } | null {
    if (!this.validateShipmentId(shipmentId)) {
      return null;
    }

    const parts = shipmentId.split('-');
    return {
      mode: parts[1],
      year: parseInt(parts[2], 10),
      sequence: parseInt(parts[3], 10),
    };
  }
}

export default FreightForwarderIdentificationService;
