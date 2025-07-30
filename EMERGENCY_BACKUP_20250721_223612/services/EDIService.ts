/**
 * FleetFlow EDI Service
 * Handles Electronic Data Interchange identification, validation, and transaction mapping
 * Internal service - EDI logic is not exposed to end users
 */

export interface EDIIdentifier {
  type: 'SCAC' | 'PRO' | 'BOL' | 'GLN' | 'DUNS' | 'LoadNumber' | 'TrailerNumber' |
        'SealNumber' | 'ContainerNumber' | 'PONumber' | 'CustomerReference' |
        'DeliveryNumber' | 'HazmatID' | 'NMFC' | 'AppointmentNumber' | 'ShipperID';
  value: string;
  isValid: boolean;
  transactionTypes: string[];
}

export interface ShipperIdentifier {
  fullId: string;
  companyInitials: string;
  transactionCode: string;
  commodityCode: string;
  sequenceNumber: string;
  timestamp: string;
  isValid: boolean;
  breakdown: {
    company: string;
    transaction: string;
    commodity: string;
    sequence: string;
    date: string;
  };
}

export interface LoadIdentifier {
  fullId: string;
  shipperId: string; // First 9 characters
  loadType: string; // FTL, LTL, EXP, etc.
  equipmentType: string; // DRY, REEF, FLAT, etc.
  priorityRateKey: string; // Priority/Rate classification
  sequenceNumber: string;
  timestamp: string;
  isValid: boolean;
  breakdown: {
    shipper: string;
    loadType: string;
    equipment: string;
    priority: string;
    sequence: string;
    date: string;
  };
}

export interface PermanentShipperIdentifier {
  id: string; // Permanent unique identifier (e.g., WMT001, AMZ002)
  companyName: string;
  companyInitials: string;
  transactionCode: string;
  commodityCode: string;
  createdAt: string;
  isActive: boolean;
  breakdown: {
    company: string;
    transaction: string;
    commodity: string;
    sequence: string;
  };
}

export interface EDITransaction {
  code: string;
  name: string;
  requiredIdentifiers: string[];
  optionalIdentifiers: string[];
}

export class EDIService {

  // Standard EDI Transaction Sets for freight
  private static transactions: Record<string, EDITransaction> = {
    '214': {
      code: '214',
      name: 'Transportation Carrier Shipment Status Message',
      requiredIdentifiers: ['SCAC', 'PRO', 'BOL'],
      optionalIdentifiers: ['LoadNumber', 'TrailerNumber', 'SealNumber']
    },
    '310': {
      code: '310',
      name: 'Freight Receipt and Invoice (Ocean)',
      requiredIdentifiers: ['SCAC', 'BOL', 'ContainerNumber'],
      optionalIdentifiers: ['SealNumber', 'PONumber']
    },
    '856': {
      code: '856',
      name: 'Ship Notice/Manifest',
      requiredIdentifiers: ['SCAC', 'BOL', 'LoadNumber'],
      optionalIdentifiers: ['TrailerNumber', 'PONumber', 'CustomerReference']
    },
    '210': {
      code: '210',
      name: 'Motor Carrier Freight Details and Invoice',
      requiredIdentifiers: ['SCAC', 'PRO', 'BOL'],
      optionalIdentifiers: ['LoadNumber', 'PONumber', 'CustomerReference', 'NMFC']
    },
    '211': {
      code: '211',
      name: 'Motor Carrier Bill of Lading',
      requiredIdentifiers: ['SCAC', 'BOL'],
      optionalIdentifiers: ['PRO', 'LoadNumber', 'PONumber', 'HazmatID']
    },
    '990': {
      code: '990',
      name: 'Response to a Load Tender',
      requiredIdentifiers: ['SCAC', 'LoadNumber'],
      optionalIdentifiers: ['BOL', 'PRO']
    },
    '204': {
      code: '204',
      name: 'Motor Carrier Load Tender',
      requiredIdentifiers: ['LoadNumber', 'PONumber'],
      optionalIdentifiers: ['SCAC', 'CustomerReference', 'AppointmentNumber']
    }
  };

  /**
   * Validates EDI identifier format and content
   */
  static validateIdentifier(type: string, value: string): boolean {
    if (!value || typeof value !== 'string') return false;

    const trimmedValue = value.trim();

    switch (type) {
      case 'SCAC':
        // 2-4 uppercase letters
        return /^[A-Z]{2,4}$/.test(trimmedValue);

      case 'PRO':
        // 8-11 digits, may include hyphens
        return /^\d{8,11}$/.test(trimmedValue.replace(/-/g, ''));

      case 'BOL':
        // Alphanumeric, 6-20 characters
        return /^[A-Z0-9]{6,20}$/i.test(trimmedValue);

      case 'GLN':
        // Exactly 13 digits
        return /^\d{13}$/.test(trimmedValue);

      case 'DUNS':
        // Exactly 9 digits
        return /^\d{9}$/.test(trimmedValue);

      case 'LoadNumber':
        // Alphanumeric, 3-20 characters
        return /^[A-Z0-9]{3,20}$/i.test(trimmedValue);

      case 'TrailerNumber':
        // 4-13 characters, alphanumeric
        return /^[A-Z0-9]{4,13}$/i.test(trimmedValue);

      case 'SealNumber':
        // 3-15 characters, alphanumeric
        return /^[A-Z0-9]{3,15}$/i.test(trimmedValue);

      case 'ContainerNumber':
        // 4 letters + 7 digits (ISO 6346 standard)
        return /^[A-Z]{4}\d{7}$/i.test(trimmedValue);

      case 'PONumber':
        // Alphanumeric, 3-25 characters
        return /^[A-Z0-9\-]{3,25}$/i.test(trimmedValue);

      case 'CustomerReference':
        // Alphanumeric with some special chars, 3-30 characters
        return /^[A-Z0-9\-_\/]{3,30}$/i.test(trimmedValue);

      case 'DeliveryNumber':
        // Alphanumeric, 3-20 characters
        return /^[A-Z0-9\-]{3,20}$/i.test(trimmedValue);

      case 'HazmatID':
        // UN number format: UN followed by 4 digits
        return /^UN\d{4}$/i.test(trimmedValue);

      case 'NMFC':
        // 6 digits followed by optional subclass
        return /^\d{6}(-\d{1,2})?$/.test(trimmedValue);

      case 'AppointmentNumber':
        // Alphanumeric, 3-20 characters
        return /^[A-Z0-9\-]{3,20}$/i.test(trimmedValue);

      default:
        return false;
    }
  }

  /**
   * Automatically generates required EDI identifiers for a load/shipment
   */
  static generateIdentifiers(loadData: any): Record<string, string> {
    const identifiers: Record<string, string> = {};

    // Generate Load Number if not provided
    if (!loadData.loadNumber) {
      identifiers.LoadNumber = this.generateLoadNumber();
    }

    // Generate PRO Number if carrier is assigned
    if (loadData.assignedCarrier && !loadData.proNumber) {
      identifiers.PRO = this.generatePRONumber();
    }

    // Generate BOL Number if not provided
    if (!loadData.bolNumber) {
      identifiers.BOL = this.generateBOLNumber();
    }

    return identifiers;
  }

  /**
   * Gets required EDI identifiers for specific transaction type
   */
  static getRequiredIdentifiers(transactionCode: string): string[] {
    const transaction = this.transactions[transactionCode];
    return transaction ? transaction.requiredIdentifiers : [];
  }

  /**
   * Gets optional EDI identifiers for specific transaction type
   */
  static getOptionalIdentifiers(transactionCode: string): string[] {
    const transaction = this.transactions[transactionCode];
    return transaction ? transaction.optionalIdentifiers : [];
  }

  /**
   * Validates that load has all required identifiers for EDI transaction
   */
  static validateLoadForTransaction(loadData: any, transactionCode: string): {
    isValid: boolean;
    missingRequired: string[];
    invalidIdentifiers: string[];
  } {
    const transaction = this.transactions[transactionCode];
    if (!transaction) {
      return { isValid: false, missingRequired: [], invalidIdentifiers: ['Invalid transaction code'] };
    }

    const missingRequired: string[] = [];
    const invalidIdentifiers: string[] = [];

    // Check required identifiers
    for (const identifier of transaction.requiredIdentifiers) {
      const value = this.getIdentifierValue(loadData, identifier);
      if (!value) {
        missingRequired.push(identifier);
      } else if (!this.validateIdentifier(identifier, value)) {
        invalidIdentifiers.push(identifier);
      }
    }

    // Check optional identifiers if present
    for (const identifier of transaction.optionalIdentifiers) {
      const value = this.getIdentifierValue(loadData, identifier);
      if (value && !this.validateIdentifier(identifier, value)) {
        invalidIdentifiers.push(identifier);
      }
    }

    return {
      isValid: missingRequired.length === 0 && invalidIdentifiers.length === 0,
      missingRequired,
      invalidIdentifiers
    };
  }

  /**
   * Automatically determines appropriate EDI transaction type for load
   */
  static getTransactionType(loadData: any, context: 'status' | 'invoice' | 'manifest' | 'tender'): string {
    switch (context) {
      case 'status':
        return '214'; // Transportation Carrier Shipment Status Message
      case 'invoice':
        return loadData.type === 'Ocean' ? '310' : '210'; // Ocean vs Motor Carrier Invoice
      case 'manifest':
        return '856'; // Ship Notice/Manifest
      case 'tender':
        return loadData.isResponse ? '990' : '204'; // Response vs Load Tender
      default:
        return '214'; // Default to status message
    }
  }

  /**
   * Gets identifier value from load data using various field mappings
   */
  private static getIdentifierValue(loadData: any, identifier: string): string | null {
    const fieldMappings: Record<string, string[]> = {
      'SCAC': ['scac', 'carrierSCAC', 'carrierCode'],
      'PRO': ['proNumber', 'pro', 'trackingNumber'],
      'BOL': ['bolNumber', 'bol', 'billOfLading'],
      'GLN': ['gln', 'locationGLN', 'facilityGLN'],
      'DUNS': ['duns', 'dunsNumber', 'businessDUNS'],
      'LoadNumber': ['loadNumber', 'load', 'shipmentNumber'],
      'TrailerNumber': ['trailerNumber', 'trailer', 'equipmentNumber'],
      'SealNumber': ['sealNumber', 'seal'],
      'ContainerNumber': ['containerNumber', 'container'],
      'PONumber': ['poNumber', 'po', 'purchaseOrder'],
      'CustomerReference': ['customerReference', 'customerRef', 'reference'],
      'DeliveryNumber': ['deliveryNumber', 'delivery'],
      'HazmatID': ['hazmatID', 'hazmat', 'dangerousGoods'],
      'NMFC': ['nmfc', 'freightClass'],
      'AppointmentNumber': ['appointmentNumber', 'appointment']
    };

    const possibleFields = fieldMappings[identifier] || [identifier.toLowerCase()];

    for (const field of possibleFields) {
      if (loadData[field]) {
        return loadData[field];
      }
    }

    return null;
  }

  /**
   * Generates a unique load number
   */
  private static generateLoadNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `FL${timestamp}${random}`;
  }

  /**
   * Generates a PRO number
   */
  private static generatePRONumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${random}`;
  }

  /**
   * Generates a BOL number
   */
  private static generateBOLNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `BOL${timestamp}${random}`;
  }

  /**
   * Enriches load data with automatically generated and validated EDI identifiers
   */
  static enrichLoadWithEDI(loadData: any, transactionContext?: string): any {
    // Generate missing identifiers
    const generatedIds = this.generateIdentifiers(loadData);

    // Merge generated identifiers with existing load data
    const enrichedLoad = { ...loadData, ...generatedIds };

    // If transaction context is provided, validate for that specific transaction
    if (transactionContext) {
      const validation = this.validateLoadForTransaction(enrichedLoad, transactionContext);
      enrichedLoad._ediValidation = validation;
    }

    return enrichedLoad;
  }

    /**
   * Formats EDI identifiers for transmission
   */
  static formatForTransmission(loadData: any, transactionCode: string): Record<string, string> {
    const transaction = this.transactions[transactionCode];
    if (!transaction) return {};

    const formatted: Record<string, string> = {};

    // Format required identifiers
    for (const identifier of transaction.requiredIdentifiers) {
      const value = this.getIdentifierValue(loadData, identifier);
      if (value && this.validateIdentifier(identifier, value)) {
        formatted[identifier] = value.trim().toUpperCase();
      }
    }

    // Format optional identifiers if present
    for (const identifier of transaction.optionalIdentifiers) {
      const value = this.getIdentifierValue(loadData, identifier);
      if (value && this.validateIdentifier(identifier, value)) {
        formatted[identifier] = value.trim().toUpperCase();
      }
    }

    return formatted;
  }

  /**
   * Generates a structured shipper identifier combining EDI transaction codes, commodity codes, and company initials
   * Format: {COMPANY}-{TRANSACTION}-{COMMODITY}-{SEQUENCE}-{DATE}
   * Example: WMT-204-070-001-20250115
   */
  static generateShipperIdentifier(
    companyName: string,
    transactionCode: string = '204',
    commodityCode: string = '070',
    sequenceNumber?: string
  ): ShipperIdentifier {
    // Extract company initials (2-4 characters)
    const initials = this.extractCompanyInitials(companyName);

    // Generate sequence number if not provided
    const seq = sequenceNumber || this.generateSequenceNumber();

    // Get current date in YYYYMMDD format
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Build the full identifier
    const fullId = `${initials}-${transactionCode}-${commodityCode}-${seq}-${date}`;

    return {
      fullId,
      companyInitials: initials,
      transactionCode,
      commodityCode,
      sequenceNumber: seq,
      timestamp: date,
      isValid: true,
      breakdown: {
        company: initials,
        transaction: transactionCode,
        commodity: commodityCode,
        sequence: seq,
        date: date
      }
    };
  }

  /**
   * Validates a shipper identifier format
   */
  static validateShipperIdentifier(identifier: string): boolean {
    const pattern = /^[A-Z]{2,4}-\d{3}-\d{3}-\d{3}-\d{8}$/;
    return pattern.test(identifier);
  }

  /**
   * Parses a shipper identifier into its components
   */
  static parseShipperIdentifier(identifier: string): ShipperIdentifier | null {
    if (!this.validateShipperIdentifier(identifier)) {
      return null;
    }

    const parts = identifier.split('-');
    if (parts.length !== 5) return null;

    const [company, transaction, commodity, sequence, date] = parts;

    return {
      fullId: identifier,
      companyInitials: company,
      transactionCode: transaction,
      commodityCode: commodity,
      sequenceNumber: sequence,
      timestamp: date,
      isValid: true,
      breakdown: {
        company,
        transaction,
        commodity,
        sequence,
        date
      }
    };
  }

  /**
   * Maps commodity names to standard freight class codes
   */
  static getCommodityCode(commodityName: string): string {
    const commodityMap: Record<string, string> = {
      // Electronics & Technology
      'electronics': '070',
      'computers': '070',
      'phones': '070',
      'appliances': '085',

      // Automotive
      'auto parts': '065',
      'automotive': '065',
      'tires': '077',
      'batteries': '077',

      // Food & Beverage
      'food': '070',
      'beverages': '065',
      'frozen': '070',
      'refrigerated': '070',

      // Industrial
      'steel': '050',
      'machinery': '085',
      'tools': '125',
      'construction': '055',

      // Consumer Goods
      'clothing': '150',
      'furniture': '175',
      'apparel': '150',
      'textiles': '150',

      // Chemicals & Hazmat
      'chemicals': '070',
      'hazmat': '070',
      'dangerous': '070',

      // Default
      'general': '070',
      'freight': '070'
    };

    const normalized = commodityName.toLowerCase().trim();

    // Try exact match first
    if (commodityMap[normalized]) {
      return commodityMap[normalized];
    }

    // Try partial matches
    for (const [key, code] of Object.entries(commodityMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return code;
      }
    }

    // Default to general freight class
    return '070';
  }

  /**
   * Maps transaction types to EDI transaction codes
   */
  static getTransactionCode(transactionType: string): string {
    const transactionMap: Record<string, string> = {
      'load tender': '204',
      'load posting': '204',
      'quote': '204',
      'rfq': '204',
      'status': '214',
      'tracking': '214',
      'invoice': '210',
      'billing': '210',
      'manifest': '856',
      'response': '990',
      'tender response': '990',
      'receipt': '310'
    };

    const normalized = transactionType.toLowerCase().trim();

    // Try exact match first
    if (transactionMap[normalized]) {
      return transactionMap[normalized];
    }

    // Try partial matches
    for (const [key, code] of Object.entries(transactionMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return code;
      }
    }

    // Default to load tender
    return '204';
  }

  /**
   * Extracts company initials from company name
   */
  private static extractCompanyInitials(companyName: string): string {
    if (!companyName || typeof companyName !== 'string') {
      return 'CO';
    }

    const words = companyName.trim().split(/\s+/);

    if (words.length === 1) {
      // Single word - take first 2-4 characters
      return words[0].substring(0, Math.min(4, words[0].length)).toUpperCase();
    }

    // Multiple words - take first letter of each word
    const initials = words.map(word => word.charAt(0)).join('').toUpperCase();

    // Limit to 4 characters
    return initials.substring(0, Math.min(4, initials.length));
  }

  /**
   * Generates a unique sequence number
   */
  private static generateSequenceNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${timestamp}${random}`.slice(-3);
  }

  /**
   * Generates a load identifier for rate cons and bills of lading
   * Format: {SHIPPER_ID}-{LOAD_TYPE}-{EQUIPMENT}-{PRIORITY}-{SEQUENCE}-{DATE}
   * Example: WMT-204-070-FTL-DRY-PRI-001-20250115
   * First 9 characters: WMT-204-070 (shipper identifier)
   */
  static generateLoadIdentifier(
    shipperId: string,
    loadType: string = 'FTL',
    equipmentType: string = 'DRY',
    priorityRateKey: string = 'STD',
    sequenceNumber?: string
  ): LoadIdentifier {
    // Validate shipper ID format (should be 9 characters: XXX-XXX-XXX)
    if (!this.validateShipperIdentifier(shipperId)) {
      throw new Error('Invalid shipper identifier format');
    }

    // Generate sequence number if not provided
    const seq = sequenceNumber || this.generateSequenceNumber();

    // Get current date in YYYYMMDD format
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Build the full load identifier
    const fullId = `${shipperId}-${loadType}-${equipmentType}-${priorityRateKey}-${seq}-${date}`;

    return {
      fullId,
      shipperId,
      loadType,
      equipmentType,
      priorityRateKey,
      sequenceNumber: seq,
      timestamp: date,
      isValid: true,
      breakdown: {
        shipper: shipperId,
        loadType,
        equipment: equipmentType,
        priority: priorityRateKey,
        sequence: seq,
        date
      }
    };
  }

  /**
   * Validates a load identifier format
   */
  static validateLoadIdentifier(identifier: string): boolean {
    const pattern = /^[A-Z]{2,4}-\d{3}-\d{3}-[A-Z]{2,4}-[A-Z]{2,4}-[A-Z]{2,4}-\d{3}-\d{8}$/;
    return pattern.test(identifier);
  }

  /**
   * Parses a load identifier into its components
   */
  static parseLoadIdentifier(identifier: string): LoadIdentifier | null {
    if (!this.validateLoadIdentifier(identifier)) {
      return null;
    }

    const parts = identifier.split('-');
    if (parts.length !== 8) return null;

    const [company, transaction, commodity, loadType, equipment, priority, sequence, date] = parts;
    const shipperId = `${company}-${transaction}-${commodity}`;

    return {
      fullId: identifier,
      shipperId,
      loadType,
      equipmentType: equipment,
      priorityRateKey: priority,
      sequenceNumber: sequence,
      timestamp: date,
      isValid: true,
      breakdown: {
        shipper: shipperId,
        loadType,
        equipment,
        priority,
        sequence,
        date
      }
    };
  }

  /**
   * Extracts shipper identifier from load identifier (first 9 characters)
   */
  static extractShipperIdFromLoadId(loadIdentifier: string): string | null {
    const parsed = this.parseLoadIdentifier(loadIdentifier);
    return parsed ? parsed.shipperId : null;
  }

  /**
   * Maps load types to standard codes
   */
  static getLoadTypeCode(loadType: string): string {
    const loadTypeMap: Record<string, string> = {
      'full truckload': 'FTL',
      'ftl': 'FTL',
      'less than truckload': 'LTL',
      'ltl': 'LTL',
      'expedited': 'EXP',
      'exp': 'EXP',
      'hot shot': 'HOT',
      'hot': 'HOT',
      'intermodal': 'INT',
      'int': 'INT',
      'partial': 'PAR',
      'par': 'PAR',
      'team': 'TEA',
      'tea': 'TEA',
      'solo': 'SOL',
      'sol': 'SOL'
    };

    const normalized = loadType.toLowerCase().trim();
    return loadTypeMap[normalized] || 'FTL';
  }

  /**
   * Maps equipment types to standard codes
   */
  static getEquipmentTypeCode(equipmentType: string): string {
    const equipmentMap: Record<string, string> = {
      'dry van': 'DRY',
      'dry': 'DRY',
      'reefer': 'REF',
      'refrigerated': 'REF',
      'flatbed': 'FLT',
      'flat': 'FLT',
      'step deck': 'STP',
      'step': 'STP',
      'power only': 'PWR',
      'power': 'PWR',
      'container': 'CNT',
      'tanker': 'TNK',
      'lowboy': 'LOW',
      'conestoga': 'CON',
      'box truck': 'BOX',
      'straight truck': 'STR'
    };

    const normalized = equipmentType.toLowerCase().trim();
    return equipmentMap[normalized] || 'DRY';
  }

  /**
   * Generates a complete load identifier from load data
   */
  static generateLoadIdFromData(loadData: any): LoadIdentifier {
    // Generate shipper ID first
    const shipperId = this.generateShipperIdentifier(
      loadData.shipper || loadData.company || 'Unknown Company',
      this.getTransactionCode(loadData.transactionType || 'load tender'),
      this.getCommodityCode(loadData.commodity || 'general')
    );

    // Get load type and equipment codes
    const loadTypeCode = this.getLoadTypeCode(loadData.loadType || 'FTL');
    const equipmentCode = this.getEquipmentTypeCode(loadData.equipmentType || 'dry van');
    const priorityCode = this.getPriorityRateKey(loadData.priority || 'standard');

    // Generate the full load identifier
    return this.generateLoadIdentifier(
      shipperId.fullId,
      loadTypeCode,
      equipmentCode,
      priorityCode
    );
  }

  /**
   * Generates a permanent shipper identifier when a shipper is added to the system
   * This creates a unique, permanent ID that will be used in all load identifiers
   */
  static generatePermanentShipperId(
    companyName: string,
    transactionCode: string = '204',
    commodityCode: string = '070',
    existingShippers?: PermanentShipperIdentifier[]
  ): PermanentShipperIdentifier {
    const initials = this.extractCompanyInitials(companyName);

    // Generate sequence number for this company
    const sequence = this.generateShipperSequence(initials, existingShippers);

    // Create permanent ID format: WMT001, AMZ002, etc.
    const permanentId = `${initials}${sequence}`;

    // Create the full shipper identifier for EDI purposes
    const fullShipperId = `${initials}-${transactionCode}-${commodityCode}`;

    return {
      id: permanentId,
      companyName,
      companyInitials: initials,
      transactionCode,
      commodityCode,
      createdAt: new Date().toISOString(),
      isActive: true,
      breakdown: {
        company: initials,
        transaction: transactionCode,
        commodity: commodityCode,
        sequence
      }
    };
  }

  /**
   * Maps priority/rate levels to standard codes
   */
  static getPriorityRateKey(priority: string): string {
    const priorityMap: Record<string, string> = {
      // Priority Levels
      'urgent': 'URG',
      'high': 'HIG',
      'medium': 'MED',
      'low': 'LOW',
      'standard': 'STD',

      // Rate Classes
      'premium': 'PRM',
      'express': 'EXP',
      'economy': 'ECO',
      'budget': 'BUD',

      // Service Levels
      'white glove': 'WHT',
      'white': 'WHT',
      'dedicated': 'DED',
      'team': 'TEA',
      'solo': 'SOL',

      // Special Handling
      'hazmat': 'HAZ',
      'temperature': 'TMP',
      'fragile': 'FRG',
      'oversized': 'OVS',
      'heavy': 'HVY'
    };

    const normalized = priority.toLowerCase().trim();
    return priorityMap[normalized] || 'STD';
  }

  /**
   * Generates a unique sequence number for a company's shipper ID
   */
  private static generateShipperSequence(
    companyInitials: string,
    existingShippers?: PermanentShipperIdentifier[]
  ): string {
    if (!existingShippers) {
      return '001';
    }

    // Find existing sequences for this company
    const existingSequences = existingShippers
      .filter(shipper => shipper.companyInitials === companyInitials)
      .map(shipper => parseInt(shipper.breakdown.sequence))
      .sort((a, b) => b - a);

    // Get next sequence number
    const nextSequence = existingSequences.length > 0 ? existingSequences[0] + 1 : 1;

    return nextSequence.toString().padStart(3, '0');
  }

  /**
   * Validates a permanent shipper identifier
   */
  static validatePermanentShipperId(identifier: string): boolean {
    const pattern = /^[A-Z]{2,4}\d{3}$/;
    return pattern.test(identifier);
  }

  /**
   * Converts permanent shipper ID to full EDI shipper identifier
   */
  static permanentIdToShipperId(
    permanentId: string,
    transactionCode: string = '204',
    commodityCode: string = '070'
  ): string {
    if (!this.validatePermanentShipperId(permanentId)) {
      throw new Error('Invalid permanent shipper identifier format');
    }

    // Extract company initials (everything before the numbers)
    const companyInitials = permanentId.replace(/\d+$/, '');

    return `${companyInitials}-${transactionCode}-${commodityCode}`;
  }

  /**
   * Extracts company initials from permanent shipper ID
   */
  static extractCompanyFromPermanentId(permanentId: string): string {
    // Extract company name from permanent ID (e.g., "WMT001" -> "Walmart")
    const companyMap: Record<string, string> = {
      'WMT': 'Walmart',
      'AMZ': 'Amazon',
      'TGT': 'Target',
      'HD': 'Home Depot',
      'COST': 'Costco',
      'BBY': 'Best Buy',
      'AAPL': 'Apple',
      'MSFT': 'Microsoft',
      'TSLA': 'Tesla'
    };

    const prefix = permanentId.substring(0, 3);
    return companyMap[prefix] || prefix;
  }

  // ========================================
  // LOAD BOARD NUMBER GENERATION (6-CHARACTER)
  // ========================================

  /**
   * Generate a simple 6-character numeric load board number for phone communication
   * Format: {BROKER_CODE}{SEQUENCE}
   * Example: 1001, 2001, 3001 (where 1=FleetFlow, 2=Other Broker, etc.)
   */
  static generateLoadBoardNumber(
    brokerCode: number = 1, // Default to FleetFlow
    sequenceNumber?: string
  ): {
    loadBoardNumber: string;
    breakdown: {
      brokerCode: number;
      sequence: string;
      fullNumber: string;
    };
  } {
    // Generate sequence number if not provided (3 digits)
    const sequence = sequenceNumber || this.generateNumericSequence();

    // Create 6-character number: broker code (1-3 digits) + sequence (3 digits)
    const loadBoardNumber = `${brokerCode}${sequence.padStart(3, '0')}`;

    // Ensure it's exactly 6 characters
    const paddedNumber = loadBoardNumber.padStart(6, '0');

    return {
      loadBoardNumber: paddedNumber,
      breakdown: {
        brokerCode,
        sequence,
        fullNumber: paddedNumber
      }
    };
  }

  /**
   * Generate a 3-digit numeric sequence
   */
  private static generateNumericSequence(): string {
    const sequence = Math.floor(Math.random() * 900) + 100; // 100-999
    return sequence.toString();
  }

  /**
   * Parse a load board number back to its components
   */
  static parseLoadBoardNumber(loadBoardNumber: string): {
    brokerCode: number;
    sequence: string;
  } | null {
    try {
      if (loadBoardNumber.length !== 6 || !/^\d{6}$/.test(loadBoardNumber)) {
        return null;
      }

      // First 1-3 digits are broker code, last 3 are sequence
      const brokerCode = parseInt(loadBoardNumber.substring(0, loadBoardNumber.length - 3));
      const sequence = loadBoardNumber.substring(loadBoardNumber.length - 3);

      return {
        brokerCode,
        sequence
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate a load board number format
   */
  static validateLoadBoardNumber(loadBoardNumber: string): boolean {
    return /^\d{6}$/.test(loadBoardNumber);
  }

  /**
   * Get broker name from broker code
   */
  static getBrokerNameFromCode(brokerCode: number): string {
    const brokerMap: Record<number, string> = {
      1: 'FleetFlow Management',
      2: 'Express Logistics',
      3: 'Reliable Freight',
      4: 'Quick Haul Inc',
      5: 'Mountain View Transport',
      6: 'ABC Transport LLC',
      7: 'Premium Carriers',
      8: 'Swift Delivery',
      9: 'Elite Logistics'
    };

    return brokerMap[brokerCode] || `Broker ${brokerCode}`;
  }

  /**
   * Generate load board number from load board data
   * This is the main function called when a load hits the load board
   */
  static generateLoadBoardId(loadData: {
    brokerName: string;
    shipperInfo: {
      companyName: string;
      permanentId?: string;
    };
    dispatcherName?: string;
    loadType?: string;
    equipment?: string;
  }): {
    loadBoardNumber: string;
    fullLoadId: string;
    breakdown: {
      brokerCode: number;
      sequence: string;
      brokerName: string;
      shipperName: string;
      dispatcherName?: string;
    };
  } {
    // Determine broker code from broker name
    const brokerCode = this.getBrokerCodeFromName(loadData.brokerName);

    // Generate simple 6-character load board number
    const loadBoardNumber = this.generateLoadBoardNumber(brokerCode);

    // Generate full EDI load ID for system operations
    const fullLoadId = this.generateLoadIdFromData({
      id: loadBoardNumber.loadBoardNumber,
      shipperInfo: loadData.shipperInfo,
      equipment: loadData.equipment || 'DRY',
      weight: '0'
    });

    return {
      loadBoardNumber: loadBoardNumber.loadBoardNumber,
      fullLoadId: fullLoadId.fullId,
      breakdown: {
        brokerCode: loadBoardNumber.breakdown.brokerCode,
        sequence: loadBoardNumber.breakdown.sequence,
        brokerName: this.getBrokerNameFromCode(brokerCode),
        shipperName: loadData.shipperInfo.companyName,
        dispatcherName: loadData.dispatcherName
      }
    };
  }

  /**
   * Get broker code from broker name
   */
  private static getBrokerCodeFromName(brokerName: string): number {
    const name = brokerName.toLowerCase();

    if (name.includes('fleetflow') || name.includes('fleet flow')) {
      return 1;
    } else if (name.includes('express')) {
      return 2;
    } else if (name.includes('reliable')) {
      return 3;
    } else if (name.includes('quick')) {
      return 4;
    } else if (name.includes('mountain')) {
      return 5;
    } else if (name.includes('abc')) {
      return 6;
    } else if (name.includes('premium')) {
      return 7;
    } else if (name.includes('swift')) {
      return 8;
    } else if (name.includes('elite')) {
      return 9;
    } else {
      // Default to 1 for FleetFlow
      return 1;
    }
  }
}

export default EDIService;
