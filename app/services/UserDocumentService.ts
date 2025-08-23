/**
 * User Document Service
 * Manages signed documents for individual users
 */

export interface SignedDocument {
  id: string;
  title: string;
  type: 'ica' | 'nda' | 'agreement' | 'contract' | 'certificate';
  category: 'onboarding' | 'employment' | 'compliance' | 'training';
  signedDate: string;
  signedBy: string;
  digitalSignature: string;
  documentContent: string;
  documentUrl?: string;
  metadata: {
    ipAddress: string;
    userAgent: string;
    documentVersion: string;
    witnessData?: string;
    notarized?: boolean;
  };
  status: 'signed' | 'pending' | 'expired' | 'revoked';
  expiryDate?: string;
  downloadable: boolean;
}

export interface UserDocumentRecord {
  userId: string;
  documents: SignedDocument[];
  lastUpdated: string;
}

class UserDocumentService {
  private static instance: UserDocumentService;
  private userDocuments: Map<string, UserDocumentRecord> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): UserDocumentService {
    if (!UserDocumentService.instance) {
      UserDocumentService.instance = new UserDocumentService();
    }
    return UserDocumentService.instance;
  }

  private initializeMockData() {
    // Initialize with some demo data for the demo user
    const demoUserDocuments: SignedDocument[] = [
      {
        id: 'ICA-DD-MGR-20240101-001',
        title: 'Independent Contractor Agreement',
        type: 'ica',
        category: 'onboarding',
        signedDate: '2024-01-15T10:30:00Z',
        signedBy: 'David Davis',
        digitalSignature: 'David Davis',
        documentContent: `INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is entered into between FleetFlow Transportation LLC and David Davis...

[Executive Summary]
• Independent Contractor Status confirmed
• Executive management role with comprehensive authority
• NDA and confidentiality provisions accepted
• Non-compete provisions for 12 months
• Full regulatory compliance responsibilities

Document ID: ICA-DD-MGR-20240101-001
Signed: January 15, 2024 at 10:30 AM EST
IP Address: 192.168.1.100
Digital Signature: David Davis

This document contains comprehensive terms for independent contractor relationship including confidentiality, non-compete, compensation structure, and legal obligations.`,
        metadata: {
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          documentVersion: '2024.1',
          witnessData: 'HR Department - Sarah Johnson',
          notarized: false,
        },
        status: 'signed',
        downloadable: true,
      },
      {
        id: 'NDA-DD-MGR-20240101-002',
        title: 'Non-Disclosure Agreement',
        type: 'nda',
        category: 'onboarding',
        signedDate: '2024-01-15T10:35:00Z',
        signedBy: 'David Davis',
        digitalSignature: 'David Davis',
        documentContent: `NON-DISCLOSURE AGREEMENT

Confidentiality provisions acknowledged and accepted...

[Key Provisions]
• Customer information protection
• Proprietary business strategy confidentiality
• Load and carrier relationship protection
• 12-month non-solicitation period
• Legal consequences for violations

Document ID: NDA-DD-MGR-20240101-002
Signed: January 15, 2024 at 10:35 AM EST
Acknowledged by: David Davis

All confidentiality requirements understood and legally binding.`,
        metadata: {
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          documentVersion: '2024.1',
        },
        status: 'signed',
        downloadable: true,
      },
    ];

    this.userDocuments.set('DD-MGR-20240101-1', {
      userId: 'DD-MGR-20240101-1',
      documents: demoUserDocuments,
      lastUpdated: new Date().toISOString(),
    });

    // Add demo carrier documents
    const demoCarrierDocuments: SignedDocument[] = [
      {
        id: 'BCA-CARRIER-001-20240115',
        title: 'Comprehensive Broker/Dispatch/Carrier Agreement',
        type: 'agreement',
        category: 'onboarding',
        signedDate: '2024-01-15T14:30:00Z',
        signedBy: 'ABC Transport LLC',
        digitalSignature: 'ABC Transport LLC',
        documentContent: `COMPREHENSIVE BROKER/DISPATCH/CARRIER AGREEMENT

This agreement establishes the relationship between FleetFlow Transportation LLC and ABC Transport LLC.

Agreement Details:
• MC Number: MC-987654
• DOT Number: DOT-1234567
• Insurance Requirements: $1M auto liability, $100K cargo
• Payment Terms: Net 30 days
• Factoring arrangements and NOA procedures
• Performance standards and compliance requirements
• 2025 FMCSA compliance requirements

Key Terms:
• Carrier must maintain valid operating authority
• All loads must be picked up and delivered on time
• Proper documentation required for all shipments
• FleetFlow provides load opportunities and dispatch services
• Payment processed through factoring company

This document was signed during the carrier onboarding process and represents a legally binding agreement.`,
        metadata: {
          ipAddress: '192.168.1.200',
          userAgent: 'FleetFlow Onboarding System',
          documentVersion: '2024.1',
          witnessData: 'FleetFlow Onboarding System',
        },
        status: 'signed',
        downloadable: true,
      },
      {
        id: 'DCA-CARRIER-001-20240115',
        title: 'Dispatcher-Carrier Service Agreement',
        type: 'contract',
        category: 'onboarding',
        signedDate: '2024-01-15T14:35:00Z',
        signedBy: 'ABC Transport LLC',
        digitalSignature: 'ABC Transport LLC',
        documentContent: `DISPATCHER-CARRIER SERVICE AGREEMENT

Service agreement between FleetFlow and ABC Transport LLC.

Key Terms:
• 10% dispatch fee structure
• Load board access and booking procedures
• Performance metrics (95% on-time pickup/delivery)
• Territory and equipment preferences
• Technology requirements and training support
• Weekly billing cycle with dispatch fees due Wednesday

Services Provided:
• Load sourcing and negotiation
• Rate optimization
• Route planning and coordination
• Customer communication
• Documentation management
• Payment processing coordination

This agreement was executed during carrier onboarding and establishes the terms for ongoing dispatch services.`,
        metadata: {
          ipAddress: '192.168.1.200',
          userAgent: 'FleetFlow Onboarding System',
          documentVersion: '2024.1',
          witnessData: 'FleetFlow Onboarding System',
        },
        status: 'signed',
        downloadable: true,
      },
    ];

    // Add documents for a demo carrier user
    this.userDocuments.set('CARRIER-ABC-001', {
      userId: 'CARRIER-ABC-001',
      documents: demoCarrierDocuments,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Get all documents for a user
  public getUserDocuments(userId: string): SignedDocument[] {
    const userRecord = this.userDocuments.get(userId);
    return userRecord?.documents || [];
  }

  // Add a signed document for a user
  public addSignedDocument(
    userId: string,
    document: Omit<SignedDocument, 'id'>
  ): string {
    const documentId = `${document.type.toUpperCase()}-${userId}-${Date.now()}`;
    const signedDocument: SignedDocument = {
      ...document,
      id: documentId,
    };

    let userRecord = this.userDocuments.get(userId);
    if (!userRecord) {
      userRecord = {
        userId,
        documents: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    userRecord.documents.push(signedDocument);
    userRecord.lastUpdated = new Date().toISOString();
    this.userDocuments.set(userId, userRecord);

    return documentId;
  }

  // Store ICA onboarding completion documents (Internal Staff)
  public storeICAOnboardingDocuments(
    userId: string,
    icaData: any,
    signatureData: any,
    ndaAcknowledgment: any
  ): void {
    const timestamp = new Date().toISOString();

    // Store ICA document
    if (icaData) {
      this.addSignedDocument(userId, {
        title: 'Independent Contractor Agreement',
        type: 'ica',
        category: 'onboarding',
        signedDate: signatureData?.signedDate || timestamp,
        signedBy: signatureData?.signature || 'Employee',
        digitalSignature: signatureData?.signature || 'Digital Signature',
        documentContent: icaData.content || 'ICA content not available',
        metadata: {
          ipAddress: 'localhost',
          userAgent: navigator.userAgent,
          documentVersion: '2024.1',
        },
        status: 'signed',
        downloadable: true,
      });
    }

    // Store NDA acknowledgment
    if (ndaAcknowledgment) {
      this.addSignedDocument(userId, {
        title: 'NDA & Confidentiality Acknowledgment',
        type: 'nda',
        category: 'onboarding',
        signedDate: ndaAcknowledgment?.acknowledgedDate || timestamp,
        signedBy: ndaAcknowledgment?.acknowledgedBy || 'Employee',
        digitalSignature: 'NDA Acknowledged',
        documentContent: `NDA & CONFIDENTIALITY ACKNOWLEDGMENT

I acknowledge that I have read, understood, and will strictly comply with all confidentiality, non-disclosure, and non-compete provisions outlined in my signed Independent Contractor Agreement.

Key Provisions Acknowledged:
• Customer information protection
• Proprietary business strategy confidentiality
• Load and carrier relationship protection
• 12-month non-solicitation period
• Legal consequences for violations

Acknowledged: ${ndaAcknowledgment?.acknowledgedDate}
By: ${ndaAcknowledgment?.acknowledgedBy}`,
        metadata: {
          ipAddress: ndaAcknowledgment?.ipAddress || 'localhost',
          userAgent: navigator.userAgent,
          documentVersion: '2024.1',
        },
        status: 'signed',
        downloadable: true,
      });
    }

    console.log(
      `✅ Stored ${icaData ? 1 : 0} ICA + ${ndaAcknowledgment ? 1 : 0} NDA documents for user ${userId}`
    );
  }

  // Store Carrier onboarding completion documents (Drivers/Carriers)
  public storeCarrierOnboardingDocuments(
    userId: string,
    signedAgreements: any[],
    carrierData: any
  ): void {
    const timestamp = new Date().toISOString();

    signedAgreements.forEach((agreement) => {
      let documentType: 'agreement' | 'contract' = 'agreement';
      let category: 'onboarding' | 'employment' = 'onboarding';

      // Determine document type based on agreement type
      switch (agreement.type) {
        case 'broker_carrier':
          documentType = 'agreement';
          break;
        case 'dispatcher_carrier':
          documentType = 'contract';
          break;
        default:
          documentType = 'agreement';
      }

      this.addSignedDocument(userId, {
        title: agreement.title || 'Carrier Agreement',
        type: documentType,
        category,
        signedDate: agreement.signedDate || timestamp,
        signedBy: agreement.signedBy || carrierData?.carrierName || 'Carrier',
        digitalSignature: agreement.signature || 'Digital Signature',
        documentContent:
          agreement.content ||
          `${agreement.title}

Agreement Type: ${agreement.type}
Signed: ${agreement.signedDate || timestamp}
Carrier: ${carrierData?.carrierName || 'Unknown Carrier'}
MC Number: ${carrierData?.mcNumber || 'Unknown'}
DOT Number: ${carrierData?.dotNumber || 'Unknown'}

${
  agreement.type === 'dispatcher_carrier'
    ? 'DISPATCHER-CARRIER SERVICE AGREEMENT\n\n• 10% dispatch fee structure\n• Load board access and booking procedures\n• Performance metrics (95% on-time pickup/delivery)\n• Territory and equipment preferences'
    : 'BROKER-CARRIER TRANSPORTATION AGREEMENT\n\n• Insurance requirements ($1M auto liability, $100K cargo)\n• Payment terms (Net 30 days)\n• Factoring arrangements and NOA procedures\n• Performance standards and compliance requirements'
}

This document represents a legally binding agreement between FleetFlow and the carrier.`,
        metadata: {
          ipAddress: agreement.ipAddress || 'localhost',
          userAgent: agreement.userAgent || 'FleetFlow System',
          documentVersion: '2024.1',
          witnessData: 'FleetFlow Onboarding System',
        },
        status: 'signed',
        downloadable: true,
      });
    });

    console.log(
      `✅ Stored ${signedAgreements.length} carrier agreement(s) for user ${userId}`
    );
  }

  // Get document by ID
  public getDocument(
    userId: string,
    documentId: string
  ): SignedDocument | null {
    const userRecord = this.userDocuments.get(userId);
    return userRecord?.documents.find((doc) => doc.id === documentId) || null;
  }

  // Get documents by category
  public getDocumentsByCategory(
    userId: string,
    category: string
  ): SignedDocument[] {
    const userRecord = this.userDocuments.get(userId);
    return (
      userRecord?.documents.filter((doc) => doc.category === category) || []
    );
  }

  // Get documents by type
  public getDocumentsByType(userId: string, type: string): SignedDocument[] {
    const userRecord = this.userDocuments.get(userId);
    return userRecord?.documents.filter((doc) => doc.type === type) || [];
  }

  // Format document for download
  public formatDocumentForDownload(document: SignedDocument): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${document.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; padding: 20px; border-bottom: 2px solid #333; }
    .content { white-space: pre-wrap; margin-bottom: 30px; }
    .signature { margin-top: 30px; padding: 20px; border: 2px solid #333; background: #f9f9f9; }
    .metadata { margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${document.title}</h1>
    <p><strong>Document ID:</strong> ${document.id}</p>
    <p><strong>Status:</strong> ${document.status.toUpperCase()}</p>
  </div>

  <div class="content">${document.documentContent}</div>

  <div class="signature">
    <h3>Digital Signature</h3>
    <p><strong>Signed By:</strong> ${document.signedBy}</p>
    <p><strong>Date:</strong> ${new Date(document.signedDate).toLocaleString()}</p>
    <p><strong>Signature:</strong> ${document.digitalSignature}</p>
  </div>

  <div class="metadata">
    <h4>Document Metadata</h4>
    <p><strong>IP Address:</strong> ${document.metadata.ipAddress}</p>
    <p><strong>Document Version:</strong> ${document.metadata.documentVersion}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;
  }
}

export const userDocumentService = UserDocumentService.getInstance();
