'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import { DocumentManagementService } from '../services/document-management';

interface Document {
  id: string;
  driverId: string;
  type:
    | 'bol'
    | 'rate_confirmation'
    | 'photo'
    | 'signature'
    | 'invoice'
    | 'receipt'
    | 'permit'
    | 'insurance'
    | 'dvir';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  loadId?: string;
  metadata?: any;
  status: 'pending' | 'approved' | 'rejected';
}

export default function DocumentsHubPage() {
  // LOCAL ADMIN ACCESS - Always allow access for local development
  const { user } = getCurrentUser();
  const hasDocumentAccess = true; // Local admin always has access

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'upload' | 'manage' | 'reports'
  >('overview');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Local admin access - always allow
    setIsLoading(false);
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Load documents for all drivers (mock data from service)
      const allDocs: Document[] = [];
      const driverIds = ['DRV-001', 'DRV-002', 'DRV-003'];

      for (const driverId of driverIds) {
        const driverDocs =
          await DocumentManagementService.getDocuments(driverId);
        allDocs.push(...driverDocs);
      }

      setDocuments(allDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesDriver =
      selectedDriver === 'all' || doc.driverId === selectedDriver;
    const matchesSearch =
      searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDriver && matchesSearch;
  });

  // Show loading state initially
  if (isLoading) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>📁</div>
          <p>Loading Documents Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 10px 0',
            }}
          >
            📁 Documents Hub
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              margin: '0',
            }}
          >
            Centralized document management and oversight
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #e5e7eb',
            marginBottom: '30px',
          }}
        >
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'upload', label: '⬆️ Upload', icon: '⬆️' },
            { id: 'manage', label: '📋 Manage', icon: '📋' },
            { id: 'reports', label: '📈 Reports', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === tab.id ? '#667eea' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '10px 10px 0 0',
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📊 Document Overview
            </h2>

            {/* Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  padding: '25px',
                  borderRadius: '15px',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  📄
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {documents.length}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Total Documents
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  padding: '25px',
                  borderRadius: '15px',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  ✅
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {documents.filter((d) => d.status === 'approved').length}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Approved</div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  padding: '25px',
                  borderRadius: '15px',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  ⏳
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {documents.filter((d) => d.status === 'pending').length}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Pending Review
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  padding: '25px',
                  borderRadius: '15px',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  ❌
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {documents.filter((d) => d.status === 'rejected').length}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Rejected</div>
              </div>
            </div>

            {/* Recent Documents */}
            <div
              style={{
                background: '#f9fafb',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e5e7eb',
              }}
            >
              <h3
                style={{
                  fontSize: '1.4rem',
                  color: '#1f2937',
                  marginBottom: '20px',
                }}
              >
                📋 Recent Documents
              </h3>
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'white',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {doc.driverId} • {doc.type}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background:
                        doc.status === 'approved'
                          ? '#dcfce7'
                          : doc.status === 'pending'
                            ? '#fef3c7'
                            : '#fee2e2',
                      color:
                        doc.status === 'approved'
                          ? '#166534'
                          : doc.status === 'pending'
                            ? '#92400e'
                            : '#991b1b',
                    }}
                  >
                    {doc.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              ⬆️ Document Upload
            </h2>
            <div
              style={{
                background: '#f9fafb',
                padding: '40px',
                borderRadius: '15px',
                border: '2px dashed #d1d5db',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  color: '#1f2937',
                  marginBottom: '10px',
                }}
              >
                Upload Documents
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Drag and drop files here or click to browse
              </p>
              <button
                style={{
                  padding: '12px 30px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Choose Files
              </button>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📋 Document Management
            </h2>

            {/* Filters */}
            <div
              style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '25px',
                flexWrap: 'wrap',
              }}
            >
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                style={{
                  padding: '10px 15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                }}
              >
                <option value='all'>All Drivers</option>
                <option value='DRV-001'>Driver 001</option>
                <option value='DRV-002'>Driver 002</option>
                <option value='DRV-003'>Driver 003</option>
              </select>

              <input
                type='text'
                placeholder='Search documents...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  flex: '1',
                  minWidth: '200px',
                }}
              />
            </div>

            {/* Documents Table */}
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: '15px',
                  padding: '20px',
                  background: '#f9fafb',
                  fontWeight: '600',
                  color: '#1f2937',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <div>Document Name</div>
                <div>Driver</div>
                <div>Type</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    gap: '15px',
                    padding: '20px',
                    borderBottom: '1px solid #f3f4f6',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ color: '#6b7280' }}>{doc.driverId}</div>
                  <div style={{ color: '#6b7280' }}>{doc.type}</div>
                  <div>
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background:
                          doc.status === 'approved'
                            ? '#dcfce7'
                            : doc.status === 'pending'
                              ? '#fef3c7'
                              : '#fee2e2',
                        color:
                          doc.status === 'approved'
                            ? '#166534'
                            : doc.status === 'pending'
                              ? '#92400e'
                              : '#991b1b',
                      }}
                    >
                      {doc.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      style={{
                        padding: '5px 10px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: '5px 10px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              📈 Document Reports
            </h2>
            <div
              style={{
                background: '#f9fafb',
                padding: '40px',
                borderRadius: '15px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  color: '#1f2937',
                  marginBottom: '10px',
                }}
              >
                Document Analytics
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Generate comprehensive reports on document status, compliance,
                and trends
              </p>
              <button
                style={{
                  padding: '12px 30px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

