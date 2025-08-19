/**
 * External Broker Document Mapping Service
 * Manages mapping between FleetFlow document IDs and external broker document systems
 */

export interface BrokerDocumentPattern {
  brokerName: string;
  brokerMC: string;

  // Document ID Patterns (regex patterns for their document numbering)
  rateConfirmationPattern?: string; // e.g., "RC\\d{6}" for RC123456
  bolPattern?: string; // e.g., "BOL[A-Z]{2}\\d{8}" for BOLAA12345678
  proPattern?: string; // e.g., "PRO\\d{10}" for PRO1234567890
  loadNumberPattern?: string; // e.g., "LD\\d{8}" for LD12345678
  invoicePattern?: string; // e.g., "INV\\d{6}" for INV123456

  // Document Naming Conventions
  documentNamingConvention?: string;
  fileNamingPattern?: string;

  // System Information
  tmsSystem?: string;
  ediCapable?: boolean;
  preferredCommunicationMethod?: 'email' | 'portal' | 'edi' | 'fax';

  // Contact Information
  documentContact?: {
    name: string;
    email: string;
    phone: string;
    department: string;
  };
}

export interface DocumentIdMapping {
  // FleetFlow System
  fleetflowDocumentId: string;
  fleetflowLoadId: string;
  fleetflowDocumentType: string;

  // External Broker System
  externalBrokerMC: string;
  externalBrokerName: string;
  externalDocumentId: string;
  externalDocumentType?: string;
  externalLoadId?: string;
  externalReferenceNumbers?: {
    rateConfirmation?: string;
    bol?: string;
    pro?: string;
    invoice?: string;
    other?: Record<string, string>;
  };

  // Mapping Metadata
  mappingCreatedDate: string;
  mappingCreatedBy: string;
  mappingVerified: boolean;
  mappingVerifiedDate?: string;
  mappingVerifiedBy?: string;

  // Quality Control
  documentMatches: boolean;
  discrepanciesFound?: string[];
  resolutionRequired?: boolean;
  resolutionNotes?: string;
}

export class ExternalBrokerDocumentMappingService {
  // Known broker document patterns (can be expanded)
  private static readonly KNOWN_BROKER_PATTERNS: BrokerDocumentPattern[] = [
    {
      brokerName: 'Landstar',
      brokerMC: 'MC-5398',
      rateConfirmationPattern: 'RC\\d{8}',
      bolPattern: 'L\\d{10}',
      proPattern: 'PRO\\d{9}',
      loadNumberPattern: 'LD\\d{8}',
      tmsSystem: 'Landstar TMS',
      ediCapable: true,
      preferredCommunicationMethod: 'edi',
    },
    {
      brokerName: 'TQL',
      brokerMC: 'MC-6205',
      rateConfirmationPattern: 'TQL\\d{7}',
      bolPattern: 'BOL\\d{8}',
      proPattern: 'P\\d{10}',
      loadNumberPattern: 'TQ\\d{8}',
      tmsSystem: 'TQL LoadNet',
      ediCapable: true,
      preferredCommunicationMethod: 'portal',
    },
    {
      brokerName: 'CH Robinson',
      brokerMC: 'MC-15',
      rateConfirmationPattern: 'CHR\\d{8}',
      bolPattern: 'CHB\\d{9}',
      proPattern: 'CHRPRO\\d{7}',
      loadNumberPattern: 'CHL\\d{8}',
      tmsSystem: 'Navisphere',
      ediCapable: true,
      preferredCommunicationMethod: 'edi',
    },
    {
      brokerName: 'Coyote Logistics',
      brokerMC: 'MC-757',
      rateConfirmationPattern: 'CY\\d{8}',
      bolPattern: 'CYBOL\\d{7}',
      proPattern: 'CYPRO\\d{7}',
      loadNumberPattern: 'CYL\\d{8}',
      tmsSystem: 'Coyote GO',
      ediCapable: true,
      preferredCommunicationMethod: 'portal',
    },
  ];

  /**
   * Create document ID mapping between FleetFlow and external broker
   */
  static async createDocumentMapping(
    fleetflowDocumentId: string,
    fleetflowLoadId: string,
    fleetflowDocumentType: string,
    externalBrokerMC: string,
    externalBrokerName: string,
    externalDocumentId: string,
    createdByUserId: string,
    additionalExternalRefs?: {
      rateConfirmation?: string;
      bol?: string;
      pro?: string;
      invoice?: string;
      loadNumber?: string;
      other?: Record<string, string>;
    }
  ): Promise<DocumentIdMapping> {
    // Validate external document ID against known patterns
    const brokerPattern = this.getBrokerPattern(
      externalBrokerMC,
      externalBrokerName
    );
    const validationResult = this.validateExternalDocumentId(
      externalDocumentId,
      fleetflowDocumentType,
      brokerPattern
    );

    // Create mapping
    const mapping: DocumentIdMapping = {
      // FleetFlow System
      fleetflowDocumentId,
      fleetflowLoadId,
      fleetflowDocumentType,

      // External Broker System
      externalBrokerMC,
      externalBrokerName,
      externalDocumentId,
      externalDocumentType: this.mapDocumentType(
        fleetflowDocumentType,
        brokerPattern
      ),
      externalLoadId: additionalExternalRefs?.loadNumber,
      externalReferenceNumbers: additionalExternalRefs,

      // Mapping Metadata
      mappingCreatedDate: new Date().toISOString(),
      mappingCreatedBy: createdByUserId,
      mappingVerified: validationResult.isValid,
      mappingVerifiedDate: validationResult.isValid
        ? new Date().toISOString()
        : undefined,
      mappingVerifiedBy: validationResult.isValid ? createdByUserId : undefined,

      // Quality Control
      documentMatches: validationResult.isValid,
      discrepanciesFound: validationResult.discrepancies,
      resolutionRequired: !validationResult.isValid,
      resolutionNotes: validationResult.notes,
    };

    // Store mapping
    await this.storeDocumentMapping(mapping);

    // Create audit trail
    await this.createMappingAuditTrail(mapping, 'created');

    return mapping;
  }

  /**
   * Find document mapping by FleetFlow document ID
   */
  static async findMappingByFleetFlowId(
    fleetflowDocumentId: string
  ): Promise<DocumentIdMapping | null> {
    // Implementation would query the mapping database
    console.log(
      `Finding mapping for FleetFlow document: ${fleetflowDocumentId}`
    );

    // Mock implementation
    return null;
  }

  /**
   * Find document mapping by external broker document ID
   */
  static async findMappingByExternalId(
    externalDocumentId: string,
    externalBrokerMC?: string
  ): Promise<DocumentIdMapping[]> {
    // Implementation would query the mapping database
    console.log(`Finding mapping for external document: ${externalDocumentId}`);
    if (externalBrokerMC) {
      console.log(`Filtering by broker MC: ${externalBrokerMC}`);
    }

    // Mock implementation
    return [];
  }

  /**
   * Verify document mapping accuracy
   */
  static async verifyDocumentMapping(
    mappingId: string,
    verifiedByUserId: string,
    verificationNotes?: string
  ): Promise<{
    verified: boolean;
    discrepancies: string[];
    requiresResolution: boolean;
  }> {
    // Implementation would verify the mapping
    console.log(`Verifying document mapping: ${mappingId}`);
    console.log(`Verified by: ${verifiedByUserId}`);

    const result = {
      verified: true,
      discrepancies: [] as string[],
      requiresResolution: false,
    };

    // Update mapping verification status
    await this.updateMappingVerification(
      mappingId,
      result,
      verifiedByUserId,
      verificationNotes
    );

    return result;
  }

  /**
   * Get all mappings for a specific external broker
   */
  static async getMappingsForBroker(
    brokerMC: string,
    dateRange?: {
      startDate: string;
      endDate: string;
    }
  ): Promise<DocumentIdMapping[]> {
    console.log(`Getting mappings for broker MC: ${brokerMC}`);
    if (dateRange) {
      console.log(`Date range: ${dateRange.startDate} to ${dateRange.endDate}`);
    }

    // Mock implementation
    return [];
  }

  /**
   * Generate mapping report for audit purposes
   */
  static async generateMappingReport(criteria: {
    brokerMC?: string;
    dateRange?: { startDate: string; endDate: string };
    documentType?: string;
    verificationStatus?: 'verified' | 'unverified' | 'discrepancies';
  }): Promise<{
    totalMappings: number;
    verifiedMappings: number;
    unverifiedMappings: number;
    discrepancyMappings: number;
    brokerBreakdown: Record<string, number>;
    documentTypeBreakdown: Record<string, number>;
    mappings: DocumentIdMapping[];
  }> {
    console.log('Generating mapping report with criteria:', criteria);

    // Mock implementation
    return {
      totalMappings: 0,
      verifiedMappings: 0,
      unverifiedMappings: 0,
      discrepancyMappings: 0,
      brokerBreakdown: {},
      documentTypeBreakdown: {},
      mappings: [],
    };
  }

  /**
   * Add new broker document pattern
   */
  static async addBrokerPattern(pattern: BrokerDocumentPattern): Promise<void> {
    // Implementation would store the new pattern
    console.log('Adding new broker pattern:', pattern);

    // Validate pattern
    const validation = this.validateBrokerPattern(pattern);
    if (!validation.isValid) {
      throw new Error(
        `Invalid broker pattern: ${validation.errors.join(', ')}`
      );
    }

    // Store pattern
    // this.KNOWN_BROKER_PATTERNS.push(pattern); // In real implementation, store in database
  }

  // Private helper methods

  private static getBrokerPattern(
    brokerMC: string,
    brokerName: string
  ): BrokerDocumentPattern | undefined {
    return this.KNOWN_BROKER_PATTERNS.find(
      (pattern) =>
        pattern.brokerMC === brokerMC ||
        pattern.brokerName.toLowerCase().includes(brokerName.toLowerCase())
    );
  }

  private static validateExternalDocumentId(
    externalDocumentId: string,
    documentType: string,
    brokerPattern?: BrokerDocumentPattern
  ): {
    isValid: boolean;
    discrepancies: string[];
    notes?: string;
  } {
    const result = {
      isValid: true,
      discrepancies: [] as string[],
      notes: undefined as string | undefined,
    };

    if (!brokerPattern) {
      result.isValid = false;
      result.discrepancies.push(
        'Unknown broker pattern - manual verification required'
      );
      result.notes = 'Broker pattern not found in known patterns database';
      return result;
    }

    // Validate against pattern based on document type
    let pattern: string | undefined;
    switch (documentType) {
      case 'rate_confirmation':
        pattern = brokerPattern.rateConfirmationPattern;
        break;
      case 'bol':
        pattern = brokerPattern.bolPattern;
        break;
      case 'invoice':
        pattern = brokerPattern.invoicePattern;
        break;
      default:
        pattern = undefined;
    }

    if (pattern && !new RegExp(pattern).test(externalDocumentId)) {
      result.isValid = false;
      result.discrepancies.push(
        `Document ID doesn't match expected pattern: ${pattern}`
      );
    }

    return result;
  }

  private static mapDocumentType(
    fleetflowType: string,
    brokerPattern?: BrokerDocumentPattern
  ): string | undefined {
    // Map FleetFlow document types to broker document types
    const typeMap: Record<string, string> = {
      rate_confirmation: 'Rate Confirmation',
      bol: 'Bill of Lading',
      invoice: 'Invoice',
      carrier_packet: 'Carrier Packet',
      delivery_receipt: 'Delivery Receipt',
    };

    return typeMap[fleetflowType];
  }

  private static async storeDocumentMapping(
    mapping: DocumentIdMapping
  ): Promise<void> {
    // Implementation would store in database
    console.log('Storing document mapping:', mapping);
  }

  private static async createMappingAuditTrail(
    mapping: DocumentIdMapping,
    action: string
  ): Promise<void> {
    const auditEntry = {
      mappingId: `${mapping.fleetflowDocumentId}_${mapping.externalDocumentId}`,
      action,
      timestamp: new Date().toISOString(),
      userId: mapping.mappingCreatedBy,
      details: {
        fleetflowId: mapping.fleetflowDocumentId,
        externalId: mapping.externalDocumentId,
        brokerMC: mapping.externalBrokerMC,
      },
    };

    console.log('Creating mapping audit trail:', auditEntry);
  }

  private static async updateMappingVerification(
    mappingId: string,
    verificationResult: any,
    verifiedByUserId: string,
    notes?: string
  ): Promise<void> {
    console.log(`Updating mapping verification for: ${mappingId}`);
    console.log('Verification result:', verificationResult);
    console.log('Notes:', notes);
  }

  private static validateBrokerPattern(pattern: BrokerDocumentPattern): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!pattern.brokerName) {
      errors.push('Broker name is required');
    }

    if (!pattern.brokerMC) {
      errors.push('Broker MC number is required');
    }

    // Validate regex patterns
    const patterns = [
      pattern.rateConfirmationPattern,
      pattern.bolPattern,
      pattern.proPattern,
      pattern.loadNumberPattern,
      pattern.invoicePattern,
    ].filter(Boolean);

    patterns.forEach((p) => {
      try {
        new RegExp(p!);
      } catch (e) {
        errors.push(`Invalid regex pattern: ${p}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default ExternalBrokerDocumentMappingService;
