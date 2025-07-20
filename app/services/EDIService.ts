/**
 * FleetFlow EDI Service
 * Handles Electronic Data Interchange identification, validation, and transaction mapping
 * Internal service - EDI logic is not exposed to end users
 */

export interface EDIIdentifier {
  type: 'SCAC' | 'PRO' | 'BOL' | 'GLN' | 'DUNS' | 'LoadNumber' | 'TrailerNumber' | 
        'SealNumber' | 'ContainerNumber' | 'PONumber' | 'CustomerReference' | 
        'DeliveryNumber' | 'HazmatID' | 'NMFC' | 'AppointmentNumber';
  value: string;
  isValid: boolean;
  transactionTypes: string[];
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
}

export default EDIService;
