// 📄 Document Viewer and Management Component
// components/DocumentViewer.tsx

'use client';

import React, { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'rate_confirmation' | 'bol' | 'load_confirmation' | 'license' | 'certification' | 'employment';
  url: string;
  size: number;
  uploadDate: string;
  loadId?: string;
  status: 'active' | 'expired' | 'pending';
}

interface DocumentViewerProps {
  driverId: string;
}

export default function DocumentViewer({ driverId }: DocumentViewerProps) {
  const [documents] = useState<Document[]>([
    {
      id: 'RC-2025-001',
      name: 'Rate Confirmation - Load LD-2025-001',
      type: 'rate_confirmation',
      url: '/documents/rate-confirmation-ld-2025-001.pdf',
      size: 245760,
      uploadDate: '2025-07-01T10:00:00Z',
      loadId: 'LD-2025-001',
      status: 'active'
    },
    {
      id: 'BOL-2025-001',
      name: 'Bill of Lading - Load LD-2025-001',
      type: 'bol',
      url: '/documents/bol-ld-2025-001.pdf',
      size: 189440,
      uploadDate: '2025-07-01T14:30:00Z',
      loadId: 'LD-2025-001',
      status: 'active'
    },
    {
      id: 'LC-2025-001',
      name: 'Load Confirmation - Mike Johnson',
      type: 'load_confirmation',
      url: '/documents/load-confirmation-drv-2025-001.pdf',
      size: 156720,
      uploadDate: '2025-07-01T15:45:00Z',
      loadId: 'LD-2025-001',
      status: 'active'
    },
    {
      id: 'LIC-2025-001',
      name: 'Commercial Driver License',
      type: 'license',
      url: '/documents/cdl-mike-johnson.pdf',
      size: 892160,
      uploadDate: '2025-06-15T09:00:00Z',
      status: 'active'
    },
    {
      id: 'CERT-2025-001',
      name: 'Hazmat Certification',
      type: 'certification',
      url: '/documents/hazmat-cert-mike-johnson.pdf',
      size: 567280,
      uploadDate: '2025-06-20T11:30:00Z',
      status: 'expired'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewDocument, setViewDocument] = useState<Document | null>(null);

  const categories = [
    { id: 'all', label: 'All Documents', icon: '📁' },
    { id: 'rate_confirmation', label: 'Rate Confirmations', icon: '💰' },
    { id: 'bol', label: 'Bills of Lading', icon: '📋' },
    { id: 'load_confirmation', label: 'Load Confirmations', icon: '✅' },
    { id: 'license', label: 'Licenses', icon: '🆔' },
    { id: 'certification', label: 'Certifications', icon: '🏆' },
    { id: 'employment', label: 'Employment Docs', icon: '👤' }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === selectedCategory);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#dcfce7', text: '#166534' };
      case 'expired': return { bg: '#fef2f2', text: '#dc2626' };
      case 'pending': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      rate_confirmation: '💰',
      bol: '📋',
      load_confirmation: '✅',
      license: '🆔',
      certification: '🏆',
      employment: '👤'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const downloadDocument = (document: Document) => {
    // In a real app, this would download from Cloudinary or your storage service
    console.log('Downloading document:', document.name);
    
    // Create a temporary link to simulate download
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.target = '_blank';
    link.click();
  };

  const previewDocument = (document: Document) => {
    setViewDocument(document);
  };

  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
        📄 My Documents
      </h3>

      {/* Category Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              background: selectedCategory === category.id 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                : 'white',
              color: selectedCategory === category.id ? 'white' : '#6b7280',
              border: selectedCategory === category.id ? 'none' : '1px solid #e5e7eb',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredDocuments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            📭 No documents found in this category
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div key={document.id} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'start',
                marginBottom: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {getTypeIcon(document.type)}
                    </span>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: '#111827',
                      margin: 0
                    }}>
                      {document.name}
                    </h4>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <div><strong>Size:</strong> {formatFileSize(document.size)}</div>
                    <div><strong>Uploaded:</strong> {new Date(document.uploadDate).toLocaleDateString()}</div>
                    {document.loadId && (
                      <div><strong>Load:</strong> {document.loadId}</div>
                    )}
                  </div>
                </div>

                <span style={{
                  background: getStatusColor(document.status).bg,
                  color: getStatusColor(document.status).text,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {document.status}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => previewDocument(document)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  👁️ Preview
                </button>
                
                <button
                  onClick={() => downloadDocument(document)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📥 Download
                </button>

                <button
                  onClick={() => {
                    navigator.share?.({
                      title: document.name,
                      url: document.url
                    }).catch(() => {
                      // Fallback to copy URL
                      navigator.clipboard.writeText(document.url);
                      alert('Document link copied to clipboard!');
                    });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📤 Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Preview Modal */}
      {viewDocument && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: '800px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#111827',
                margin: 0
              }}>
                📄 {viewDocument.name}
              </h3>
              <button 
                onClick={() => setViewDocument(null)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              minHeight: '400px'
            }}>
              {viewDocument.url.endsWith('.pdf') ? (
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
                  <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                    PDF Preview
                  </div>
                  <button
                    onClick={() => window.open(viewDocument.url, '_blank')}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🔗 Open in New Tab
                  </button>
                </div>
              ) : (
                <img 
                  src={viewDocument.url} 
                  alt={viewDocument.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    borderRadius: '8px'
                  }}
                />
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px',
              marginTop: '20px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => downloadDocument(viewDocument)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📥 Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
