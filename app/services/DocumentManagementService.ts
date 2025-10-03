/**
 * FLEETFLOW DOCUMENT MANAGEMENT SERVICE
 *
 * Handles document upload, download, storage, and management
 * for freight forwarding operations and client portals
 */

export interface ShipmentDocument {
  id: string;
  shipmentId: string;
  clientId: string;
  freightForwarderId: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  category:
    | 'COMMERCIAL_INVOICE'
    | 'PACKING_LIST'
    | 'BILL_OF_LADING'
    | 'CERTIFICATE_OF_ORIGIN'
    | 'CUSTOMS_DECLARATION'
    | 'INSURANCE'
    | 'INSPECTION_CERTIFICATE'
    | 'ARRIVAL_NOTICE'
    | 'DELIVERY_ORDER'
    | 'OTHER';
  uploadedBy: {
    userId: string;
    userName: string;
    role: 'FREIGHT_FORWARDER' | 'CLIENT_AGENT';
  };
  uploadedAt: Date;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  version: number;
  url?: string; // Storage URL
  notes?: string;
  metadata?: Record<string, any>;
}

export interface DocumentUploadRequest {
  file: File;
  shipmentId: string;
  clientId: string;
  freightForwarderId: string;
  category: ShipmentDocument['category'];
  uploadedBy: ShipmentDocument['uploadedBy'];
  notes?: string;
}

export interface DocumentFilter {
  shipmentId?: string;
  clientId?: string;
  category?: ShipmentDocument['category'];
  status?: ShipmentDocument['status'];
  dateRange?: { start: Date; end: Date };
}

class DocumentManagementService {
  private static instance: DocumentManagementService;
  private documents: Map<string, ShipmentDocument> = new Map();

  private constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  public static getInstance(): DocumentManagementService {
    if (!DocumentManagementService.instance) {
      DocumentManagementService.instance = new DocumentManagementService();
    }
    return DocumentManagementService.instance;
  }

  private initializeMockData(): void {
    // Add some sample documents
    const mockDocs: ShipmentDocument[] = [
      {
        id: 'DOC-001',
        shipmentId: 'SHIP-001',
        clientId: 'CLIENT-001',
        freightForwarderId: 'FF-001',
        fileName: 'commercial_invoice_001.pdf',
        fileType: 'application/pdf',
        fileSize: 245760,
        category: 'COMMERCIAL_INVOICE',
        uploadedBy: {
          userId: 'USER-001',
          userName: 'John Smith',
          role: 'CLIENT_AGENT',
        },
        uploadedAt: new Date('2024-01-15'),
        status: 'APPROVED',
        version: 1,
        url: '/documents/commercial_invoice_001.pdf',
      },
      {
        id: 'DOC-002',
        shipmentId: 'SHIP-001',
        clientId: 'CLIENT-001',
        freightForwarderId: 'FF-001',
        fileName: 'packing_list_001.pdf',
        fileType: 'application/pdf',
        fileSize: 189440,
        category: 'PACKING_LIST',
        uploadedBy: {
          userId: 'USER-001',
          userName: 'John Smith',
          role: 'CLIENT_AGENT',
        },
        uploadedAt: new Date('2024-01-15'),
        status: 'APPROVED',
        version: 1,
        url: '/documents/packing_list_001.pdf',
      },
      {
        id: 'DOC-003',
        shipmentId: 'SHIP-001',
        clientId: 'CLIENT-001',
        freightForwarderId: 'FF-001',
        fileName: 'bill_of_lading_001.pdf',
        fileType: 'application/pdf',
        fileSize: 312320,
        category: 'BILL_OF_LADING',
        uploadedBy: {
          userId: 'FF-USER-001',
          userName: 'Sarah Johnson',
          role: 'FREIGHT_FORWARDER',
        },
        uploadedAt: new Date('2024-01-16'),
        status: 'APPROVED',
        version: 1,
        url: '/documents/bill_of_lading_001.pdf',
      },
    ];

    mockDocs.forEach((doc) => this.documents.set(doc.id, doc));
  }

  /**
   * Upload a new document
   */
  public async uploadDocument(
    request: DocumentUploadRequest
  ): Promise<ShipmentDocument> {
    try {
      // In production: Upload to cloud storage (S3, Azure Blob, etc.)
      // For now, create a mock document
      const documentId = `DOC-${Date.now()}`;
      const document: ShipmentDocument = {
        id: documentId,
        shipmentId: request.shipmentId,
        clientId: request.clientId,
        freightForwarderId: request.freightForwarderId,
        fileName: request.file.name,
        fileType: request.file.type,
        fileSize: request.file.size,
        category: request.category,
        uploadedBy: request.uploadedBy,
        uploadedAt: new Date(),
        status: 'PENDING_REVIEW',
        version: 1,
        url: `/documents/${request.file.name}`,
        notes: request.notes,
      };

      this.documents.set(documentId, document);

      // In production: Send notifications to relevant parties
      console.log('Document uploaded:', document);

      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Get documents for a shipment
   */
  public async getDocumentsByShipment(
    shipmentId: string
  ): Promise<ShipmentDocument[]> {
    try {
      const shipmentDocs = Array.from(this.documents.values()).filter(
        (doc) => doc.shipmentId === shipmentId
      );
      return shipmentDocs;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw new Error('Failed to retrieve documents');
    }
  }

  /**
   * Get documents by client
   */
  public async getDocumentsByClient(
    clientId: string,
    filters?: DocumentFilter
  ): Promise<ShipmentDocument[]> {
    try {
      let clientDocs = Array.from(this.documents.values()).filter(
        (doc) => doc.clientId === clientId
      );

      // Apply filters
      if (filters) {
        if (filters.category) {
          clientDocs = clientDocs.filter(
            (doc) => doc.category === filters.category
          );
        }
        if (filters.status) {
          clientDocs = clientDocs.filter(
            (doc) => doc.status === filters.status
          );
        }
        if (filters.shipmentId) {
          clientDocs = clientDocs.filter(
            (doc) => doc.shipmentId === filters.shipmentId
          );
        }
      }

      return clientDocs;
    } catch (error) {
      console.error('Error getting client documents:', error);
      throw new Error('Failed to retrieve documents');
    }
  }

  /**
   * Download a document
   */
  public async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const document = this.documents.get(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // In production: Fetch from cloud storage
      // For now, create a mock blob
      const mockContent = `Mock document content for ${document.fileName}`;
      const blob = new Blob([mockContent], { type: document.fileType });

      return blob;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error('Failed to download document');
    }
  }

  /**
   * Update document status
   */
  public async updateDocumentStatus(
    documentId: string,
    status: ShipmentDocument['status'],
    notes?: string
  ): Promise<ShipmentDocument> {
    try {
      const document = this.documents.get(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      document.status = status;
      if (notes) {
        document.notes = notes;
      }

      this.documents.set(documentId, document);

      // In production: Send notifications
      console.log('Document status updated:', document);

      return document;
    } catch (error) {
      console.error('Error updating document status:', error);
      throw new Error('Failed to update document status');
    }
  }

  /**
   * Delete a document
   */
  public async deleteDocument(documentId: string): Promise<void> {
    try {
      const document = this.documents.get(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // In production: Delete from cloud storage
      this.documents.delete(documentId);

      console.log('Document deleted:', documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  /**
   * Get document by ID
   */
  public async getDocumentById(
    documentId: string
  ): Promise<ShipmentDocument | null> {
    return this.documents.get(documentId) || null;
  }

  /**
   * Get document statistics
   */
  public async getDocumentStats(clientId?: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byCategory: Record<string, number>;
  }> {
    try {
      let docs = Array.from(this.documents.values());

      if (clientId) {
        docs = docs.filter((doc) => doc.clientId === clientId);
      }

      const stats = {
        total: docs.length,
        pending: docs.filter((doc) => doc.status === 'PENDING_REVIEW').length,
        approved: docs.filter((doc) => doc.status === 'APPROVED').length,
        rejected: docs.filter((doc) => doc.status === 'REJECTED').length,
        byCategory: {} as Record<string, number>,
      };

      // Count by category
      docs.forEach((doc) => {
        stats.byCategory[doc.category] =
          (stats.byCategory[doc.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting document stats:', error);
      throw new Error('Failed to retrieve document statistics');
    }
  }

  /**
   * Format file size for display
   */
  public formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Get category display name
   */
  public getCategoryDisplayName(
    category: ShipmentDocument['category']
  ): string {
    const names: Record<ShipmentDocument['category'], string> = {
      COMMERCIAL_INVOICE: 'Commercial Invoice',
      PACKING_LIST: 'Packing List',
      BILL_OF_LADING: 'Bill of Lading',
      CERTIFICATE_OF_ORIGIN: 'Certificate of Origin',
      CUSTOMS_DECLARATION: 'Customs Declaration',
      INSURANCE: 'Insurance Certificate',
      INSPECTION_CERTIFICATE: 'Inspection Certificate',
      ARRIVAL_NOTICE: 'Arrival Notice',
      DELIVERY_ORDER: 'Delivery Order',
      OTHER: 'Other',
    };
    return names[category];
  }

  /**
   * Get category icon
   */
  public getCategoryIcon(category: ShipmentDocument['category']): string {
    const icons: Record<ShipmentDocument['category'], string> = {
      COMMERCIAL_INVOICE: '💰',
      PACKING_LIST: '📦',
      BILL_OF_LADING: '📜',
      CERTIFICATE_OF_ORIGIN: '🌍',
      CUSTOMS_DECLARATION: '🛃',
      INSURANCE: '🛡️',
      INSPECTION_CERTIFICATE: '✅',
      ARRIVAL_NOTICE: '📬',
      DELIVERY_ORDER: '📋',
      OTHER: '📄',
    };
    return icons[category];
  }
}

export const documentManagementService =
  DocumentManagementService.getInstance();
export default documentManagementService;
