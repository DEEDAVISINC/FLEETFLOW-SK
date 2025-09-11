// Vendor Document Service - Manages document uploads and broker notifications
// Connects shippers to their assigned brokers for document workflow

export interface VendorDocument {
  id: string;
  shipperId: string;
  brokerId: string; // The broker who created/manages this shipper
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType:
    | 'quote_request'
    | 'insurance_certificate'
    | 'bol'
    | 'invoice'
    | 'contract'
    | 'compliance_doc'
    | 'other';
  uploadedAt: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'requires_changes';
  description?: string;
  tags: string[];
  brokerNotes?: string;
  fileUrl: string; // In production, this would be a secure S3/storage URL
  expirationDate?: string; // For time-sensitive documents like insurance
  metadata?: {
    loadId?: string;
    contractValue?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    notificationSent?: boolean;
  };
}

export interface ShipperBrokerRelation {
  shipperId: string;
  brokerId: string;
  brokerName: string;
  brokerEmail: string;
  brokerPhone: string;
  relationshipType: 'primary' | 'secondary';
  createdAt: string;
  isActive: boolean;
}

class VendorDocumentService {
  private static instance: VendorDocumentService;
  private documents: VendorDocument[] = [];
  private shipperBrokerRelations: ShipperBrokerRelation[] = [];
  private listeners: Map<string, (documents: VendorDocument[]) => void> =
    new Map();

  public static getInstance(): VendorDocumentService {
    if (!VendorDocumentService.instance) {
      VendorDocumentService.instance = new VendorDocumentService();
    }
    return VendorDocumentService.instance;
  }

  constructor() {
    this.loadDocuments();
    this.initializeMockData();
  }

  // Load documents from localStorage
  private loadDocuments(): void {
    try {
      if (
        typeof window !== 'undefined' &&
        typeof localStorage !== 'undefined'
      ) {
        const storedDocs = localStorage.getItem('vendor-documents');
        const storedRelations = localStorage.getItem(
          'shipper-broker-relations'
        );

        if (storedDocs) {
          this.documents = JSON.parse(storedDocs);
        }

        if (storedRelations) {
          this.shipperBrokerRelations = JSON.parse(storedRelations);
        }
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      this.documents = [];
      this.shipperBrokerRelations = [];
    }
  }

  // Save documents to localStorage
  private saveDocuments(): void {
    try {
      if (
        typeof window !== 'undefined' &&
        typeof localStorage !== 'undefined'
      ) {
        localStorage.setItem(
          'vendor-documents',
          JSON.stringify(this.documents)
        );
        localStorage.setItem(
          'shipper-broker-relations',
          JSON.stringify(this.shipperBrokerRelations)
        );
      }
    } catch (error) {
      console.error('Error saving documents:', error);
    }
  }

  // Initialize mock data for demo
  private initializeMockData(): void {
    if (this.shipperBrokerRelations.length === 0) {
      // Mock shipper-broker relationships
      const mockRelations: ShipperBrokerRelation[] = [
        {
          shipperId: 'ABC-204-070', // ABC Manufacturing
          brokerId: 'FM-MGR-2023005', // From user system
          brokerName: 'Frank Martinez',
          brokerEmail: 'frank.martinez@fleetflowapp.com',
          brokerPhone: '+1-555-0123',
          relationshipType: 'primary',
          createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
          isActive: true,
        },
        {
          shipperId: 'RDI-204-050', // Retail Distribution
          brokerId: 'SJ-DC-2024014', // Dispatcher
          brokerName: 'Sarah Johnson',
          brokerEmail: 'sarah.johnson@fleetflowapp.com',
          brokerPhone: '+1-555-0124',
          relationshipType: 'primary',
          createdAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
          isActive: true,
        },
        {
          shipperId: 'TSL-204-085', // Tech Solutions
          brokerId: 'ED-BB-2024061', // Broker
          brokerName: 'Emily Davis',
          brokerEmail: 'emily.davis@fleetflowapp.com',
          brokerPhone: '+1-555-0125',
          relationshipType: 'primary',
          createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
          isActive: true,
        },
      ];

      this.shipperBrokerRelations = mockRelations;
    }

    if (this.documents.length === 0) {
      // Mock documents for demo
      const mockDocuments: VendorDocument[] = [
        {
          id: 'doc-001',
          shipperId: 'ABC-204-070',
          brokerId: 'FM-MGR-2023005',
          fileName: 'ABC_Insurance_Certificate.pdf',
          fileType: 'application/pdf',
          fileSize: 2457600, // 2.4MB
          documentType: 'insurance_certificate',
          uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'approved',
          description: 'Updated insurance certificate for 2025',
          tags: ['insurance', '2025', 'general-liability'],
          brokerNotes: 'Certificate verified and approved',
          fileUrl: '/mock-files/ABC_Insurance_Certificate.pdf',
          expirationDate: '2025-12-31T23:59:59Z',
          metadata: {
            priority: 'high',
            notificationSent: true,
          },
        },
        {
          id: 'doc-002',
          shipperId: 'ABC-204-070',
          brokerId: 'FM-MGR-2023005',
          fileName: 'Quote_Request_Electronics.pdf',
          fileType: 'application/pdf',
          fileSize: 1048576, // 1MB
          documentType: 'quote_request',
          uploadedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: 'pending_review',
          description: 'Quote request for electronics shipment ATL->MIA',
          tags: ['quote', 'electronics', 'atlanta', 'miami'],
          fileUrl: '/mock-files/Quote_Request_Electronics.pdf',
          metadata: {
            loadId: 'JS-25001-ATLMIA-ABC-DVFL-001',
            contractValue: 45000,
            priority: 'urgent',
            notificationSent: true,
          },
        },
        {
          id: 'doc-003',
          shipperId: 'RDI-204-050',
          brokerId: 'SJ-DC-2024014',
          fileName: 'Warehouse_Contract_2025.pdf',
          fileType: 'application/pdf',
          fileSize: 3145728, // 3MB
          documentType: 'contract',
          uploadedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          status: 'requires_changes',
          description: 'Warehouse services contract for 2025',
          tags: ['contract', 'warehouse', '2025'],
          brokerNotes: 'Please update section 3.2 regarding liability limits',
          fileUrl: '/mock-files/Warehouse_Contract_2025.pdf',
          metadata: {
            contractValue: 120000,
            priority: 'medium',
            notificationSent: true,
          },
        },
      ];

      this.documents = mockDocuments;
      this.saveDocuments();
    }
  }

  // Get documents for a specific shipper
  public getShipperDocuments(shipperId: string): VendorDocument[] {
    return this.documents
      .filter((doc) => doc.shipperId === shipperId)
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
  }

  // Get broker information for a shipper
  public getShipperBroker(shipperId: string): ShipperBrokerRelation | null {
    return (
      this.shipperBrokerRelations.find(
        (rel) => rel.shipperId === shipperId && rel.isActive
      ) || null
    );
  }

  // Upload a new document
  public async uploadDocument(
    shipperId: string,
    file: File,
    documentType: VendorDocument['documentType'],
    description?: string,
    tags: string[] = [],
    metadata?: VendorDocument['metadata']
  ): Promise<VendorDocument> {
    // Get the broker for this shipper
    const brokerRelation = this.getShipperBroker(shipperId);
    if (!brokerRelation) {
      throw new Error('No active broker found for this shipper');
    }

    // In production, this would upload to S3/cloud storage
    const mockFileUrl = `/mock-files/${file.name}`;

    const newDocument: VendorDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shipperId,
      brokerId: brokerRelation.brokerId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      documentType,
      uploadedAt: new Date().toISOString(),
      status: 'pending_review',
      description,
      tags,
      fileUrl: mockFileUrl,
      metadata: {
        ...metadata,
        priority: metadata?.priority || 'medium',
        notificationSent: false,
      },
    };

    // Add expiration date for certain document types
    if (documentType === 'insurance_certificate') {
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + 1);
      newDocument.expirationDate = expDate.toISOString();
    }

    this.documents.unshift(newDocument);
    this.saveDocuments();

    // Notification to broker (temporarily disabled)

    // Notify listeners
    this.notifyListeners(shipperId);

    return newDocument;
  }

  // Notification functionality temporarily disabled

  // Update document status (typically done by broker)
  public updateDocumentStatus(
    documentId: string,
    status: VendorDocument['status'],
    brokerNotes?: string
  ): boolean {
    const document = this.documents.find((doc) => doc.id === documentId);
    if (!document) return false;

    document.status = status;
    if (brokerNotes) {
      document.brokerNotes = brokerNotes;
    }

    this.saveDocuments();
    this.notifyListeners(document.shipperId);

    // Notification back to shipper (temporarily disabled)

    return true;
  }

  // Shipper notification functionality temporarily disabled

  // Get shipper name from ID (simplified for demo)
  private getShipperName(shipperId: string): string {
    const shipperNames: Record<string, string> = {
      'ABC-204-070': 'ABC Manufacturing Corp',
      'RDI-204-050': 'Retail Distribution Inc',
      'TSL-204-085': 'Tech Solutions LLC',
    };
    return shipperNames[shipperId] || 'Unknown Shipper';
  }

  // Get document statistics
  public getDocumentStats(shipperId: string): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byType: Record<string, number>;
  } {
    const docs = this.getShipperDocuments(shipperId);

    const stats = {
      total: docs.length,
      pending: docs.filter((d) => d.status === 'pending_review').length,
      approved: docs.filter((d) => d.status === 'approved').length,
      rejected: docs.filter(
        (d) => d.status === 'rejected' || d.status === 'requires_changes'
      ).length,
      byType: {} as Record<string, number>,
    };

    docs.forEach((doc) => {
      stats.byType[doc.documentType] =
        (stats.byType[doc.documentType] || 0) + 1;
    });

    return stats;
  }

  // Subscribe to document updates
  public subscribe(
    shipperId: string,
    callback: (documents: VendorDocument[]) => void
  ): () => void {
    this.listeners.set(shipperId, callback);

    // Send initial documents
    callback(this.getShipperDocuments(shipperId));

    return () => {
      this.listeners.delete(shipperId);
    };
  }

  // Notify listeners of changes
  private notifyListeners(shipperId: string): void {
    const callback = this.listeners.get(shipperId);
    if (callback) {
      callback(this.getShipperDocuments(shipperId));
    }
  }

  // Delete document
  public deleteDocument(documentId: string): boolean {
    const index = this.documents.findIndex((doc) => doc.id === documentId);
    if (index === -1) return false;

    const document = this.documents[index];
    this.documents.splice(index, 1);
    this.saveDocuments();
    this.notifyListeners(document.shipperId);

    return true;
  }

  // Get document by ID
  public getDocument(documentId: string): VendorDocument | null {
    return this.documents.find((doc) => doc.id === documentId) || null;
  }

  // Search documents
  public searchDocuments(shipperId: string, query: string): VendorDocument[] {
    const docs = this.getShipperDocuments(shipperId);
    const searchTerm = query.toLowerCase();

    return docs.filter(
      (doc) =>
        doc.fileName.toLowerCase().includes(searchTerm) ||
        doc.description?.toLowerCase().includes(searchTerm) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        doc.documentType.toLowerCase().includes(searchTerm)
    );
  }
}

export const vendorDocumentService = VendorDocumentService.getInstance();
