'use client';

import React, { useState } from 'react';

interface DocumentInfo {
  id: string;
  type: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
  uploadDate?: string;
  expirationDate?: string;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected' | 'expired';
  description: string;
}

interface DocumentUploadProps {
  onDocumentUploaded: (document: DocumentInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUploaded, onNext, onBack }) => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([
    // Legal/Regulatory Documents
    {
      id: 'op_authority',
      type: 'Operating Authority Letter',
      category: 'Legal/Regulatory',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Certificate showing motor carrier operating authority'
    },
    {
      id: 'dot_registration',
      type: 'DOT Registration',
      category: 'Legal/Regulatory',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Department of Transportation registration certificate'
    },
    {
      id: 'state_registration',
      type: 'State Registration',
      category: 'Legal/Regulatory',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'State business registration documents'
    },

    // Insurance Documents
    {
      id: 'certificate_insurance',
      type: 'Certificate of Insurance',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Primary certificate of insurance'
    },
    {
      id: 'auto_liability',
      type: 'Auto Liability Insurance',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Auto liability insurance certificate ($1M minimum)'
    },
    {
      id: 'cargo_insurance',
      type: 'Cargo Insurance',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Cargo insurance certificate ($100K minimum)'
    },
    {
      id: 'workers_comp',
      type: 'Workers Compensation',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Workers compensation insurance or exemption'
    },

    // Financial Documents
    {
      id: 'w9_form',
      type: 'W-9 Tax Form',
      category: 'Financial',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Completed and signed W-9 tax form'
    },
    {
      id: 'voided_check',
      type: 'Voided Check',
      category: 'Financial',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Voided check for ACH payment setup'
    },
    {
      id: 'bank_letter',
      type: 'Bank Letter',
      category: 'Financial',
      required: false,
      uploaded: false,
      status: 'pending',
      description: 'Bank letter confirming account ownership'
    },

    // Safety Documents
    {
      id: 'safety_training',
      type: 'Safety Training Certificates',
      category: 'Safety',
      required: false,
      uploaded: false,
      status: 'pending',
      description: 'Driver safety training certificates'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const categories = ['All', 'Legal/Regulatory', 'Insurance', 'Financial', 'Safety'];

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploadingId(documentId);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          const updatedDoc = {
            ...doc,
            uploaded: true,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'uploaded' as const
          };
          onDocumentUploaded(updatedDoc);
          return updatedDoc;
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return '📄';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'expired': return '⏰';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'expired': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Legal/Regulatory': return '⚖️';
      case 'Insurance': return '🛡️';
      case 'Financial': return '💰';
      case 'Safety': return '🦺';
      default: return '📋';
    }
  };

  const filteredDocuments = selectedCategory === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const requiredDocsUploaded = documents.filter(doc => doc.required && doc.uploaded).length;
  const totalRequiredDocs = documents.filter(doc => doc.required).length;
  const completionPercentage = Math.round((requiredDocsUploaded / totalRequiredDocs) * 100);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '12px' 
        }}>
          📄 Document Upload Center
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', marginBottom: '20px' }}>
          Upload required documents to complete carrier onboarding
        </p>
        
        {/* Progress Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>Required Documents</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              {requiredDocsUploaded}/{totalRequiredDocs} ({completionPercentage}%)
            </span>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            height: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              height: '100%',
              width: `${completionPercentage}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {category !== 'All' && getCategoryIcon(category)} {category}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: `2px solid ${document.required && !document.uploaded ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {getCategoryIcon(document.category)} {document.type}
                  {document.required && (
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem' 
                    }}>
                      REQUIRED
                    </span>
                  )}
                </h4>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9rem', 
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {document.description}
                </p>
              </div>
              <div style={{
                background: getStatusColor(document.status),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {getStatusIcon(document.status)} {document.status.toUpperCase()}
              </div>
            </div>

            {document.uploaded ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  <div><strong>File:</strong> {document.fileName}</div>
                  <div><strong>Uploaded:</strong> {document.uploadDate}</div>
                  {document.expirationDate && (
                    <div><strong>Expires:</strong> {document.expirationDate}</div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="file"
                  id={`file-${document.id}`}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(document.id, file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor={`file-${document.id}`}
                  style={{
                    display: 'block',
                    background: uploadingId === document.id 
                      ? '#6b7280' 
                      : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: uploadingId === document.id ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {uploadingId === document.id ? '⬆️ Uploading...' : '📤 Choose File'}
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back to Verification
        </button>

        <div style={{ textAlign: 'center' }}>
          {completionPercentage === 100 ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              marginBottom: '16px'
            }}>
              ✅ All required documents uploaded!
            </div>
          ) : (
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              marginBottom: '16px'
            }}>
              📋 Upload {totalRequiredDocs - requiredDocsUploaded} more required documents
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={completionPercentage < 100}
          style={{
            background: completionPercentage === 100 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : '#6b7280',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: completionPercentage === 100 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          Continue to Factoring Setup →
        </button>
      </div>
    </div>
  );
};
