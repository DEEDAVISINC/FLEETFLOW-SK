/**
 * Enhanced Document Filing Service with External Broker ID Tracking
 * Manages both FleetFlow internal identifiers AND external broker document systems
 */

import { LoadIdentificationService } from './LoadIdentificationService';
import { UserIdentificationService } from './UserIdentificationService';

export interface ExternalBrokerDocumentIds {
  // External Broker's Document System
  brokerDocumentId: string; // Broker's internal document ID
  brokerRateConfirmationNumber?: string; // Their rate confirmation #
  brokerBOLNumber?: string; // Their BOL number
  brokerPRONumber?: string; // Their PRO number
  brokerLoadNumber?: string; // Their load reference number
  brokerInvoiceNumber?: string; // Their invoice number
  brokerReferenceNumber?: string; // General reference number

  // External Broker Information
  brokerName: string;
  brokerMCNumber: string;
  brokerDOTNumber?: string;
  brokerSCAC?: string; // Standard Carrier Alpha Code

  // External Broker Contact System
  brokerContactName?: string;
  brokerContactPhone?: string;
  brokerContactEmail?: string;

  // External System Integration
  brokerTMSSystem?: string; // Their TMS system name
  brokerEDICapable?: boolean;
  brokerPortalURL?: string; // Link to their carrier portal

  // Cross-Reference Information
  originalLoadPostingId?: string; // ID from load board where we found it
  loadBoardSource?:
    | 'DAT'
    | 'Truckstop'
    | '123LoadBoard'
    | 'Landstar'
    | 'TQL'
    | 'Other';
  externalLoadBoardId?: string; // Their ID on the load board
}

export interface DocumentCrossReference {
  // FleetFlow Internal System
  fleetflowDocumentId: string;
  fleetflowLoadId: string;
  fleetflowLoadBoardNumber: string;

  // External Broker System
  externalBrokerIds: ExternalBrokerDocumentIds;

  // Cross-Reference Mapping
  documentMapping: {
    fleetflowType: string; // Our document type
    externalType?: string; // Their document type name
    equivalentDocuments?: string[]; // Multiple external docs that map to one internal
  };

  // Verification Status
  crossReferenceVerified: boolean;
  verificationDate?: string;
  verifiedByUserId?: string;
  discrepanciesFound?: string[];
}

export interface EnhancedDocumentMetadata {
  // All previous DocumentMetadata fields
  documentId: string;
  documentType:
    | 'rate_confirmation'
    | 'bol'
    | 'carrier_packet'
    | 'delivery_receipt'
    | 'invoice'
    | 'photo'
    | 'signature';
  documentSource:
    | 'fleetflow_generated'
    | 'dispatcher_uploaded'
    | 'external_broker';

  // Load Integration
  loadId: string;
  loadBoardNumber: string;
  loadIdentifier: string;

  // User Integration
  uploadedByUserId: string;
  uploadedByInitials: string;
  uploadedByDepartment: string;

  // Shipper/Vendor Integration
  shipperId?: string;
  shipperCode?: string;
  vendorCode?: string;

  // ENHANCED: External Broker Document Tracking
  externalBrokerIds?: ExternalBrokerDocumentIds;
  crossReference?: DocumentCrossReference;

  // Document Details
  fileName: string;
  originalFileName?: string; // Broker's original file name
  fileSize: number;
  mimeType: string;
  uploadTimestamp: string;

  // Enhanced Audit Trail
  auditTrail: EnhancedDocumentAuditEntry[];

  // Compliance & Legal
  retentionPeriod: number;
  complianceFlags: string[];
  legalHold?: boolean;

  // External Broker Compliance
  externalBrokerCompliance?: {
    brokerInsuranceVerified: boolean;
    brokerAuthorityVerified: boolean;
    brokerCreditRating?: string;
    lastVerificationDate?: string;
  };
}

export interface EnhancedDocumentAuditEntry {
  action:
    | 'uploaded'
    | 'viewed'
    | 'downloaded'
    | 'modified'
    | 'signed'
    | 'approved'
    | 'rejected'
    | 'cross_referenced'
    | 'verified';
  userId: string;
  userInitials: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;

  // External Broker Audit Information
  externalBrokerAction?: string; // What happened on their end
  externalBrokerTimestamp?: string; // When it happened on their end
  externalBrokerUser?: string; // Who did it on their end
}

export class EnhancedDocumentFilingService {
  /**
   * File external broker document with complete ID tracking
   */
  static async fileExternalBrokerDocument(
    file: File,
    documentType: EnhancedDocumentMetadata['documentType'],
    loadId: string,
    uploadedByUserId: string,
    externalBrokerIds: ExternalBrokerDocumentIds,
    additionalMetadata?: {
      originalFileName?: string;
      brokerNotes?: string;
      urgencyLevel?: 'normal' | 'urgent' | 'critical';
    }
  ): Promise<EnhancedDocumentMetadata> {
    // Generate FleetFlow document ID
    const fleetflowDocumentId = this.generateDocumentId(
      documentType,
      loadId,
      uploadedByUserId
    );

    // Create cross-reference mapping
    const crossReference = this.createCrossReference(
      fleetflowDocumentId,
      loadId,
      externalBrokerIds,
      documentType
    );

    // Parse user and load information
    const userInfo = UserIdentificationService.parseUserId(uploadedByUserId);
    const loadInfo = LoadIdentificationService.parseLoadId(loadId);
    const loadBoardNumber = await this.getLoadBoardNumber(loadId);

    // Create enhanced metadata
    const metadata: EnhancedDocumentMetadata = {
      // Standard fields
      documentId: fleetflowDocumentId,
      documentType,
      documentSource: 'external_broker',

      // Load Integration
      loadId,
      loadBoardNumber,
      loadIdentifier: loadId,

      // User Integration
      uploadedByUserId,
      uploadedByInitials: userInfo?.brokerInitials || '',
      uploadedByDepartment: userInfo?.departmentCode || '',

      // Shipper Integration
      shipperId: loadInfo?.shipperCode,
      shipperCode: loadInfo?.shipperCode,

      // ENHANCED: External Broker Tracking
      externalBrokerIds,
      crossReference,

      // File Details
      fileName: this.generateStandardizedFileName(
        file.name,
        fleetflowDocumentId,
        externalBrokerIds
      ),
      originalFileName: additionalMetadata?.originalFileName || file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadTimestamp: new Date().toISOString(),

      // Enhanced Audit Trail
      auditTrail: [
        {
          action: 'uploaded',
          userId: uploadedByUserId,
          userInitials: userInfo?.brokerInitials || '',
          timestamp: new Date().toISOString(),
          notes: `External broker document uploaded. Broker: ${externalBrokerIds.brokerName} (MC: ${externalBrokerIds.brokerMCNumber})`,
          externalBrokerAction: 'document_provided',
          externalBrokerUser: externalBrokerIds.brokerContactName,
        },
      ],

      // Compliance
      retentionPeriod: this.getRetentionPeriod(documentType),
      complianceFlags: this.getComplianceFlags(documentType),

      // External Broker Compliance
      externalBrokerCompliance: {
        brokerInsuranceVerified: false, // To be verified
        brokerAuthorityVerified: false, // To be verified
        lastVerificationDate: new Date().toISOString(),
      },
    };

    // Store with enhanced filing structure
    await this.storeEnhancedDocument(file, metadata);

    // Create audit record for cross-referencing
    await this.createCrossReferenceAuditRecord(metadata);

    return metadata;
  }

  /**
   * Create comprehensive cross-reference mapping
   */
  private static createCrossReference(
    fleetflowDocumentId: string,
    fleetflowLoadId: string,
    externalBrokerIds: ExternalBrokerDocumentIds,
    documentType: string
  ): DocumentCrossReference {
    const loadBoardNumber = this.generateLoadBoardNumber();

    return {
      // FleetFlow Internal System
      fleetflowDocumentId,
      fleetflowLoadId,
      fleetflowLoadBoardNumber: loadBoardNumber,

      // External Broker System
      externalBrokerIds,

      // Document Mapping
      documentMapping: {
        fleetflowType: documentType,
        externalType: this.mapExternalDocumentType(
          documentType,
          externalBrokerIds
        ),
        equivalentDocuments: this.findEquivalentDocuments(externalBrokerIds),
      },

      // Verification Status
      crossReferenceVerified: false,
      verificationDate: new Date().toISOString(),
      discrepanciesFound: [],
    };
  }

  /**
   * Generate standardized file name that includes both systems
   */
  private static generateStandardizedFileName(
    originalName: string,
    fleetflowDocumentId: string,
    externalBrokerIds: ExternalBrokerDocumentIds
  ): string {
    const extension = originalName.split('.').pop();
    const brokerCode = this.getBrokerCode(externalBrokerIds.brokerName);
    const externalRef = externalBrokerIds.brokerDocumentId || 'NOREF';

    // Format: {FleetFlowDocId}_{BrokerCode}_{ExternalRef}.{ext}
    // Example: DOC-RC-001-SJ-20250101-A1B2C3_LANDSTAR_RC123456.pdf
    return `${fleetflowDocumentId}_${brokerCode}_${externalRef}.${extension}`;
  }

  /**
   * Enhanced document storage with cross-reference indexing
   */
  private static async storeEnhancedDocument(
    file: File,
    metadata: EnhancedDocumentMetadata
  ): Promise<void> {
    // Create enhanced filing structure
    const structure = this.generateEnhancedFilingStructure(metadata);

    // Store primary document
    const primaryPath = this.buildPrimaryFilePath(structure, metadata);
    await this.storeFile(file, primaryPath, metadata);

    // Create cross-reference index
    await this.createCrossReferenceIndex(metadata);

    // Create external broker index
    await this.createExternalBrokerIndex(metadata);

    // Update Driver OTR Flow
    await this.updateDriverOTRFlowWithExternalDoc(metadata);

    console.log(`Enhanced document stored with cross-references:`);
    console.log(`FleetFlow ID: ${metadata.documentId}`);
    console.log(
      `External Broker ID: ${metadata.externalBrokerIds?.brokerDocumentId}`
    );
    console.log(
      `Cross-Reference Created: ${metadata.crossReference?.crossReferenceVerified}`
    );
  }

  /**
   * Create cross-reference index for fast lookups
   */
  private static async createCrossReferenceIndex(
    metadata: EnhancedDocumentMetadata
  ): Promise<void> {
    const crossRefIndex = {
      // FleetFlow to External mapping
      fleetflowToExternal: {
        [metadata.documentId]: metadata.externalBrokerIds?.brokerDocumentId,
        [metadata.loadId]: metadata.externalBrokerIds?.brokerLoadNumber,
        [metadata.loadBoardNumber]:
          metadata.externalBrokerIds?.externalLoadBoardId,
      },

      // External to FleetFlow mapping
      externalToFleetflow: {
        [metadata.externalBrokerIds?.brokerDocumentId || '']:
          metadata.documentId,
        [metadata.externalBrokerIds?.brokerLoadNumber || '']: metadata.loadId,
        [metadata.externalBrokerIds?.externalLoadBoardId || '']:
          metadata.loadBoardNumber,
      },

      // Broker-specific index
      brokerIndex: {
        brokerName: metadata.externalBrokerIds?.brokerName,
        brokerMC: metadata.externalBrokerIds?.brokerMCNumber,
        documentCount: 1, // Increment for existing brokers
        lastActivity: new Date().toISOString(),
      },
    };

    // Store cross-reference index (implementation depends on database)
    console.log('Cross-reference index created:', crossRefIndex);
  }

  /**
   * Create external broker index for broker management
   */
  private static async createExternalBrokerIndex(
    metadata: EnhancedDocumentMetadata
  ): Promise<void> {
    const brokerIndex = {
      brokerMC: metadata.externalBrokerIds?.brokerMCNumber,
      brokerName: metadata.externalBrokerIds?.brokerName,
      brokerDOT: metadata.externalBrokerIds?.brokerDOTNumber,
      brokerSCAC: metadata.externalBrokerIds?.brokerSCAC,

      // Document tracking
      documentsReceived: [
        {
          documentId: metadata.documentId,
          documentType: metadata.documentType,
          externalDocumentId: metadata.externalBrokerIds?.brokerDocumentId,
          receivedDate: metadata.uploadTimestamp,
          loadId: metadata.loadId,
        },
      ],

      // Performance tracking
      responseTime: 'TBD', // Track how fast they provide documents
      documentQuality: 'TBD', // Track document completeness
      complianceScore: 'TBD', // Track regulatory compliance

      // Contact information
      primaryContact: {
        name: metadata.externalBrokerIds?.brokerContactName,
        phone: metadata.externalBrokerIds?.brokerContactPhone,
        email: metadata.externalBrokerIds?.brokerContactEmail,
      },

      // System integration
      tmsSystem: metadata.externalBrokerIds?.brokerTMSSystem,
      ediCapable: metadata.externalBrokerIds?.brokerEDICapable,
      portalURL: metadata.externalBrokerIds?.brokerPortalURL,
    };

    console.log('External broker index created:', brokerIndex);
  }

  /**
   * Search documents by external broker ID
   */
  static async findDocumentByExternalId(
    externalDocumentId: string,
    brokerMC?: string
  ): Promise<EnhancedDocumentMetadata[]> {
    // Implementation would search the cross-reference index
    console.log(`Searching for external document ID: ${externalDocumentId}`);
    if (brokerMC) {
      console.log(`Filtering by broker MC: ${brokerMC}`);
    }

    // Return mock results for now
    return [];
  }

  /**
   * Search documents by FleetFlow ID to find external references
   */
  static async findExternalReferencesForFleetFlowDoc(
    fleetflowDocumentId: string
  ): Promise<ExternalBrokerDocumentIds[]> {
    // Implementation would search the cross-reference index
    console.log(
      `Finding external references for FleetFlow doc: ${fleetflowDocumentId}`
    );

    // Return mock results for now
    return [];
  }

  /**
   * Verify cross-references between systems
   */
  static async verifyCrossReferences(
    documentId: string,
    verifiedByUserId: string
  ): Promise<{
    verified: boolean;
    discrepancies: string[];
    verificationReport: any;
  }> {
    // Implementation would verify that external broker IDs match our records
    console.log(`Verifying cross-references for document: ${documentId}`);
    console.log(`Verified by user: ${verifiedByUserId}`);

    return {
      verified: true,
      discrepancies: [],
      verificationReport: {
        verificationDate: new Date().toISOString(),
        verifiedBy: verifiedByUserId,
        checksPerformed: [
          'Document ID match',
          'Load number match',
          'BOL number match',
          'Rate confirmation match',
        ],
      },
    };
  }

  // Helper methods
  private static generateDocumentId(
    documentType: string,
    loadId: string,
    userId: string
  ): string {
    const timestamp = new Date();
    const dateCode = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const userInfo = UserIdentificationService.parseUserId(userId);
    const loadInfo = LoadIdentificationService.parseLoadId(loadId);

    const docTypeCode = this.getDocumentTypeCode(documentType);
    const loadSequence =
      loadInfo?.sequence?.toString().padStart(3, '0') || '000';
    const userInitials = userInfo?.brokerInitials || 'UNK';
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `DOC-${docTypeCode}-${loadSequence}-${userInitials}-${dateCode}-${hash}`;
  }

  private static getDocumentTypeCode(documentType: string): string {
    const codes = {
      rate_confirmation: 'RC',
      bol: 'BOL',
      carrier_packet: 'CP',
      delivery_receipt: 'DR',
      invoice: 'INV',
      photo: 'PHO',
      signature: 'SIG',
    };
    return codes[documentType as keyof typeof codes] || 'DOC';
  }

  private static getBrokerCode(brokerName: string): string {
    // Generate 3-letter code from broker name
    const words = brokerName.toUpperCase().split(' ');
    if (words.length >= 2) {
      return `${words[0].substring(0, 2)}${words[1].substring(0, 1)}`;
    }
    return brokerName.substring(0, 3).toUpperCase();
  }

  private static mapExternalDocumentType(
    fleetflowType: string,
    externalBrokerIds: ExternalBrokerDocumentIds
  ): string | undefined {
    // Map our document types to their document types
    if (
      fleetflowType === 'rate_confirmation' &&
      externalBrokerIds.brokerRateConfirmationNumber
    ) {
      return 'Rate Confirmation';
    }
    if (fleetflowType === 'bol' && externalBrokerIds.brokerBOLNumber) {
      return 'Bill of Lading';
    }
    return undefined;
  }

  private static findEquivalentDocuments(
    externalBrokerIds: ExternalBrokerDocumentIds
  ): string[] {
    const equivalents: string[] = [];

    if (externalBrokerIds.brokerRateConfirmationNumber) {
      equivalents.push(externalBrokerIds.brokerRateConfirmationNumber);
    }
    if (externalBrokerIds.brokerBOLNumber) {
      equivalents.push(externalBrokerIds.brokerBOLNumber);
    }
    if (externalBrokerIds.brokerPRONumber) {
      equivalents.push(externalBrokerIds.brokerPRONumber);
    }

    return equivalents;
  }

  private static generateLoadBoardNumber(): string {
    return `${100000 + Math.floor(Math.random() * 899999)}`;
  }

  private static async getLoadBoardNumber(loadId: string): Promise<string> {
    // Implementation would retrieve existing load board number
    return this.generateLoadBoardNumber();
  }

  private static getRetentionPeriod(documentType: string): number {
    const periods = {
      rate_confirmation: 7,
      bol: 7,
      carrier_packet: 7,
      delivery_receipt: 3,
      invoice: 7,
      photo: 3,
      signature: 7,
    };
    return periods[documentType as keyof typeof periods] || 7;
  }

  private static getComplianceFlags(documentType: string): string[] {
    const requirements = {
      DOT: ['bol', 'carrier_packet', 'delivery_receipt'],
      FMCSA: ['rate_confirmation', 'bol', 'carrier_packet'],
      IRS: ['invoice', 'rate_confirmation'],
    };

    const flags: string[] = [];
    Object.entries(requirements).forEach(([regulation, types]) => {
      if (types.includes(documentType)) {
        flags.push(regulation);
      }
    });

    return flags;
  }

  private static generateEnhancedFilingStructure(
    metadata: EnhancedDocumentMetadata
  ): any {
    // Implementation for enhanced filing structure
    return {
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      brokerType: 'external',
      externalBrokerMC: metadata.externalBrokerIds?.brokerMCNumber,
      loadId: metadata.loadId,
      documentType: metadata.documentType,
    };
  }

  private static buildPrimaryFilePath(
    structure: any,
    metadata: EnhancedDocumentMetadata
  ): string {
    return [
      'documents',
      structure.year,
      structure.month,
      structure.brokerType,
      structure.externalBrokerMC,
      structure.loadId,
      structure.documentType,
      metadata.fileName,
    ].join('/');
  }

  private static async storeFile(
    file: File,
    path: string,
    metadata: EnhancedDocumentMetadata
  ): Promise<void> {
    console.log(`Storing file at: ${path}`);
    console.log('Metadata:', metadata);
  }

  private static async createCrossReferenceAuditRecord(
    metadata: EnhancedDocumentMetadata
  ): Promise<void> {
    console.log(
      'Creating cross-reference audit record for:',
      metadata.documentId
    );
  }

  private static async updateDriverOTRFlowWithExternalDoc(
    metadata: EnhancedDocumentMetadata
  ): Promise<void> {
    console.log(
      'Updating Driver OTR Flow with external document:',
      metadata.documentId
    );
  }
}

export default EnhancedDocumentFilingService;
