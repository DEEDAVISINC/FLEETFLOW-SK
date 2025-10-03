'use client';

import { useEffect, useState } from 'react';
import {
  ShipmentDocument,
  documentManagementService,
} from '../services/DocumentManagementService';

interface DocumentManagementPanelProps {
  clientId?: string;
  shipmentId?: string;
  userId: string;
  userRole: 'FREIGHT_FORWARDER' | 'CLIENT_AGENT';
}

export default function DocumentManagementPanel({
  clientId,
  shipmentId,
  userId,
  userRole,
}: DocumentManagementPanelProps) {
  const [documents, setDocuments] = useState<ShipmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ShipmentDocument['category']>('COMMERCIAL_INVOICE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [filter, setFilter] = useState<'ALL' | ShipmentDocument['status']>(
    'ALL'
  );

  useEffect(() => {
    loadDocuments();
  }, [clientId, shipmentId, filter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      let docs: ShipmentDocument[] = [];

      if (shipmentId) {
        docs =
          await documentManagementService.getDocumentsByShipment(shipmentId);
      } else if (clientId) {
        docs = await documentManagementService.getDocumentsByClient(clientId, {
          status: filter === 'ALL' ? undefined : filter,
        });
      }

      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !clientId) return;

    try {
      setUploading(true);
      await documentManagementService.uploadDocument({
        file: selectedFile,
        shipmentId: shipmentId || 'GENERAL',
        clientId,
        freightForwarderId: 'FF-001',
        category: selectedCategory,
        uploadedBy: {
          userId,
          userName: 'Current User',
          role: userRole,
        },
        notes: uploadNotes,
      });

      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadNotes('');
      await loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: ShipmentDocument) => {
    try {
      const blob = await documentManagementService.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  const handleStatusUpdate = async (
    docId: string,
    status: ShipmentDocument['status']
  ) => {
    try {
      await documentManagementService.updateDocumentStatus(docId, status);
      await loadDocuments();
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Failed to update document status');
    }
  };

  const getStatusColor = (status: ShipmentDocument['status']) => {
    const colors = {
      PENDING_REVIEW: '#f59e0b',
      APPROVED: '#10b981',
      REJECTED: '#ef4444',
      ARCHIVED: '#6b7280',
    };
    return colors[status];
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#06b6d4',
            }}
          >
            📄 Document Management
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
            Upload, download, and manage shipment documents
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
          }}
        >
          + Upload Document
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'].map(
          (status) => (
            <button
              key={status}
              onClick={() =>
                setFilter(status as 'ALL' | ShipmentDocument['status'])
              }
              style={{
                padding: '8px 16px',
                background:
                  filter === status
                    ? 'rgba(6, 182, 212, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                border:
                  filter === status
                    ? '1px solid #06b6d4'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: filter === status ? '#06b6d4' : 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: filter === status ? '600' : '400',
              }}
            >
              {status.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Documents List */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0' }}>
            No documents found. Upload your first document to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '20px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>
                      {documentManagementService.getCategoryIcon(doc.category)}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        {doc.fileName}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {documentManagementService.getCategoryDisplayName(
                          doc.category
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: '12px',
                    }}
                  >
                    <span>
                      📦{' '}
                      {documentManagementService.formatFileSize(doc.fileSize)}
                    </span>
                    <span>
                      👤 {doc.uploadedBy.userName} ({doc.uploadedBy.role})
                    </span>
                    <span>📅 {doc.uploadedAt.toLocaleDateString()}</span>
                  </div>
                  {doc.notes && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      💬 {doc.notes}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: `${getStatusColor(doc.status)}20`,
                      color: getStatusColor(doc.status),
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    {doc.status.replace('_', ' ')}
                  </div>
                  <button
                    onClick={() => handleDownload(doc)}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(6, 182, 212, 0.2)',
                      border: '1px solid #06b6d4',
                      borderRadius: '8px',
                      color: '#06b6d4',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ⬇️ Download
                  </button>
                  {userRole === 'FREIGHT_FORWARDER' &&
                    doc.status === 'PENDING_REVIEW' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStatusUpdate(doc.id, 'APPROVED')}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid #10b981',
                            borderRadius: '8px',
                            color: '#10b981',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(doc.id, 'REJECTED')}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: '0 0 24px 0',
                color: '#06b6d4',
              }}
            >
              📤 Upload Document
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '8px',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Document Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value as ShipmentDocument['category']
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='COMMERCIAL_INVOICE'>Commercial Invoice</option>
                  <option value='PACKING_LIST'>Packing List</option>
                  <option value='BILL_OF_LADING'>Bill of Lading</option>
                  <option value='CERTIFICATE_OF_ORIGIN'>
                    Certificate of Origin
                  </option>
                  <option value='CUSTOMS_DECLARATION'>
                    Customs Declaration
                  </option>
                  <option value='INSURANCE'>Insurance Certificate</option>
                  <option value='INSPECTION_CERTIFICATE'>
                    Inspection Certificate
                  </option>
                  <option value='ARRIVAL_NOTICE'>Arrival Notice</option>
                  <option value='DELIVERY_ORDER'>Delivery Order</option>
                  <option value='OTHER'>Other</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '8px',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Select File
                </label>
                <input
                  type='file'
                  onChange={handleFileSelect}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                {selectedFile && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    📎 {selectedFile.name} (
                    {documentManagementService.formatFileSize(
                      selectedFile.size
                    )}
                    )
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    marginBottom: '8px',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Notes (Optional)
                </label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder='Add any notes about this document...'
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: selectedFile
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: selectedFile ? 'pointer' : 'not-allowed',
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? '⏳ Uploading...' : '📤 Upload'}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
