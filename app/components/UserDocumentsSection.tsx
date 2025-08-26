'use client';

import { useEffect, useState } from 'react';
import { SignedDocument, userDocumentService } from '../services/UserDocumentService';

interface UserDocumentsSectionProps {
  userId: string;
  isCompact?: boolean;
}

export default function UserDocumentsSection({
  userId,
  isCompact = false,
}: UserDocumentsSectionProps) {
  const [documents, setDocuments] = useState<SignedDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'onboarding' | 'employment' | 'compliance'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<SignedDocument | null>(null);

  useEffect(() => {
    loadUserDocuments();
  }, [userId]);

  const loadUserDocuments = async () => {
    try {
      setLoading(true);
      const userDocs = userDocumentService.getUserDocuments(userId);
      setDocuments(userDocs);
    } catch (error) {
      console.error('Error loading user documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    activeTab === 'all' || doc.category === activeTab
  );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'ica': return '📄';
      case 'nda': return '🔒';
      case 'agreement': return '📋';
      case 'contract': return '📝';
      case 'certificate': return '🏆';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'revoked': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const downloadDocument = (document: SignedDocument) => {
    const htmlContent = userDocumentService.formatDocumentForDownload(document);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}_${document.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
        🔄 Loading documents...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: '700',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📂 My Documents
          <span style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {documents.length} Documents
          </span>
        </h2>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'All Documents', count: documents.length },
          { key: 'onboarding', label: 'Onboarding', count: documents.filter(d => d.category === 'onboarding').length },
          { key: 'employment', label: 'Employment', count: documents.filter(d => d.category === 'employment').length },
          { key: 'compliance', label: 'Compliance', count: documents.filter(d => d.category === 'compliance').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.key 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: activeTab === tab.key ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '10px'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'rgba(255, 255, 255, 0.6)',
          border: '2px dashed rgba(255, 255, 255, 0.2)',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
            No {activeTab === 'all' ? '' : activeTab + ' '}documents found
          </h3>
          <p style={{ margin: 0 }}>
            {activeTab === 'onboarding' 
              ? 'Complete your employee onboarding to see signed documents here.'
              : 'Signed documents will appear here when available.'
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Document Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getDocumentIcon(document.type)}
                  </div>
                  <div>
                    <h3 style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      {document.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        background: getStatusColor(document.status),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {document.status}
                      </span>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px'
                      }}>
                        {new Date(document.signedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Document ID:</strong> {document.id}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Signed By:</strong> {document.signedBy}
                </div>
                <div>
                  <strong>Category:</strong> {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setSelectedDocument(document)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  👁️ View
                </button>
                {document.downloadable && (
                  <button
                    onClick={() => downloadDocument(document)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    📥 Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                color: 'white',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {getDocumentIcon(selectedDocument.type)} {selectedDocument.title}
              </h3>
              <button
                onClick={() => setSelectedDocument(null)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '6px',
                  color: '#ef4444',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '20px',
              maxHeight: '60vh',
              overflow: 'auto',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><strong>Document ID:</strong> {selectedDocument.id}</div>
                  <div><strong>Status:</strong> <span style={{ color: getStatusColor(selectedDocument.status) }}>{selectedDocument.status.toUpperCase()}</span></div>
                  <div><strong>Signed Date:</strong> {new Date(selectedDocument.signedDate).toLocaleString()}</div>
                  <div><strong>Signed By:</strong> {selectedDocument.signedBy}</div>
                </div>
              </div>
              
              <div style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '13px',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '16px',
                borderRadius: '8px'
              }}>
                {selectedDocument.documentContent}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              {selectedDocument.downloadable && (
                <button
                  onClick={() => {
                    downloadDocument(selectedDocument);
                    setSelectedDocument(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📥 Download Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







