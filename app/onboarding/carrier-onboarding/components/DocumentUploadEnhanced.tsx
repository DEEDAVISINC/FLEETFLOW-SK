'use client';

import React, { useState } from 'react';
import { DocumentVerificationService } from '../../../services/document-verification-service';
import { W9Form } from './W9Form';

interface DocumentInfo {
  id: string;
  type: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
  uploadDate?: string;
  expirationDate?: string;
  status:
    | 'pending'
    | 'uploaded'
    | 'approved'
    | 'rejected'
    | 'expired'
    | 'processing'
    | 'needs_attention';
  description: string;
  verificationResult?: any;
  issues?: string[];
  extractedData?: any;
}

interface DocumentUploadProps {
  onDocumentUploaded: (document: DocumentInfo) => void;
  onNext: () => void;
  onBack: () => void;
  carrierData?: any;
}

export const DocumentUploadEnhanced: React.FC<DocumentUploadProps> = ({
  onDocumentUploaded,
  onNext,
  onBack,
  carrierData,
}) => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([
    // Legal/Regulatory Documents
    {
      id: 'mc_authority',
      type: 'MC Authority Letter',
      category: 'Legal/Regulatory',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Motor Carrier Operating Authority certificate from FMCSA',
    },
    {
      id: 'dot_registration',
      type: 'DOT Registration',
      category: 'Legal/Regulatory',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Department of Transportation registration certificate',
    },

    // Insurance Documents
    {
      id: 'certificate_insurance',
      type: 'Certificate of Insurance',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description:
        'Primary certificate showing auto liability ($1M) and cargo ($100K) coverage',
    },
    {
      id: 'auto_liability',
      type: 'Auto Liability Insurance',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description:
        'Auto liability insurance certificate ($1M minimum, additional insured required)',
    },
    {
      id: 'cargo_insurance',
      type: 'Cargo Insurance',
      category: 'Insurance',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Cargo insurance certificate ($100K minimum coverage)',
    },

    // Financial Documents
    {
      id: 'w9_form',
      type: 'W-9 Tax Form',
      category: 'Financial',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Completed and signed W-9 tax form for 1099 reporting',
    },
    {
      id: 'voided_check',
      type: 'Voided Check',
      category: 'Financial',
      required: true,
      uploaded: false,
      status: 'pending',
      description: 'Voided check for ACH payment setup (or bank letter)',
    },

    // Visual Identity Documents
    {
      id: 'vehicle_equipment_photo',
      type: 'Vehicle Equipment Photo',
      category: 'Visual Identity',
      required: true,
      uploaded: false,
      status: 'pending',
      description:
        'High-quality photo of your primary vehicle/equipment for portal identification',
    },
    {
      id: 'user_photo_logo',
      type: 'User Photo or Company Logo',
      category: 'Visual Identity',
      required: true,
      uploaded: false,
      status: 'pending',
      description:
        'Professional photo of driver or company logo for portal display',
    },

    // Factoring (Conditional)
    {
      id: 'notice_assignment',
      type: 'Notice of Assignment (Factoring)',
      category: 'Financial',
      required: false, // Will be set to true if carrier has factoring
      uploaded: false,
      status: 'pending',
      description:
        'Notice of Assignment from factoring company (required if using factoring)',
    },

    // ELD/Technology
    {
      id: 'eld_compliance',
      type: 'ELD Compliance Certificate',
      category: 'Safety/Technology',
      required: true,
      uploaded: false,
      status: 'pending',
      description:
        'Electronic Logging Device compliance certificate and registration',
    },

    // Safety Documents (Optional but Recommended)
    {
      id: 'safety_training',
      type: 'Safety Training Certificates',
      category: 'Safety',
      required: false,
      uploaded: false,
      status: 'pending',
      description: 'Driver safety training certificates and compliance records',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [showW9Form, setShowW9Form] = useState(false);
  const [factoringRequired, setFactoringRequired] = useState(false);

  const categories = [
    'All',
    'Legal/Regulatory',
    'Insurance',
    'Financial',
    'Safety/Technology',
    'Safety',
  ];

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploadingId(documentId);

    try {
      // Update status to processing
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                status: 'processing' as const,
                fileName: file.name,
                uploadDate: new Date().toISOString().split('T')[0],
              }
            : doc
        )
      );

      // Send initial notification
      await DocumentVerificationService.sendNotification(
        'documentReceived',
        {
          carrierName: carrierData?.legalName || 'Carrier',
          email: carrierData?.email || 'carrier@example.com',
          phone: carrierData?.phone,
        },
        {
          documentName: documents.find((d) => d.id === documentId)?.type,
          uploadDate: new Date().toLocaleDateString(),
        }
      );

      // Simulate document verification
      const verificationResult =
        await DocumentVerificationService.verifyDocument(
          file,
          documentId,
          carrierData
        );

      // Update document with verification results
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === documentId) {
          const newStatus = verificationResult.verified
            ? 'approved'
            : verificationResult.requiresManualReview
              ? 'needs_attention'
              : 'rejected';

          const updatedDoc = {
            ...doc,
            uploaded: true,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            status: newStatus as DocumentInfo['status'],
            verificationResult,
            issues: verificationResult.issues,
            extractedData: verificationResult.extractedData,
            expirationDate: verificationResult.extractedData?.expirationDate,
          };

          // Send appropriate notification
          if (verificationResult.verified) {
            DocumentVerificationService.sendNotification(
              'documentApproved',
              {
                carrierName: carrierData?.legalName || 'Carrier',
                email: carrierData?.email || 'carrier@example.com',
              },
              {
                documentName: doc.type,
                approvalDate: new Date().toLocaleDateString(),
                expirationDate:
                  verificationResult.extractedData?.expirationDate || 'N/A',
              }
            );
          } else {
            DocumentVerificationService.sendNotification(
              'documentRejected',
              {
                carrierName: carrierData?.legalName || 'Carrier',
                email: carrierData?.email || 'carrier@example.com',
              },
              {
                documentName: doc.type,
                uploadDate: new Date().toLocaleDateString(),
                issues: verificationResult.issues,
              }
            );
          }

          onDocumentUploaded(updatedDoc);
          return updatedDoc;
        }
        return doc;
      });

      setDocuments(updatedDocuments);

      // Check if all required documents are now complete
      const completionCheck =
        DocumentVerificationService.checkOnboardingCompletion(
          updatedDocuments.filter(
            (doc) => doc.uploaded && doc.status === 'approved'
          )
        );

      if (completionCheck.complete) {
        await DocumentVerificationService.sendNotification(
          'allDocumentsComplete',
          {
            carrierName: carrierData?.legalName || 'Carrier',
            email: carrierData?.email || 'carrier@example.com',
          },
          {
            approvedDocuments: completionCheck.approvedDocuments,
          }
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);

      // Update status to rejected on error
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                status: 'rejected' as const,
                issues: ['Upload failed. Please try again.'],
              }
            : doc
        )
      );
    } finally {
      setUploadingId(null);
    }
  };

  const handleW9FormComplete = async (formData: any) => {
    setShowW9Form(false);

    // Create a mock W-9 document with the form data
    const w9Document: DocumentInfo = {
      id: 'w9_form',
      type: 'W-9 Tax Form',
      category: 'Financial',
      required: true,
      uploaded: true,
      fileName: 'W9_Form_Completed.pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'approved',
      description: 'Completed and signed W-9 tax form',
      extractedData: formData,
      verificationResult: {
        verified: true,
        confidence: 1.0,
        issues: [],
        requiresManualReview: false,
      },
    };

    // Update documents
    const updatedDocuments = documents.map((doc) =>
      doc.id === 'w9_form' ? w9Document : doc
    );
    setDocuments(updatedDocuments);
    onDocumentUploaded(w9Document);

    // Send approval notification
    await DocumentVerificationService.sendNotification(
      'documentApproved',
      {
        carrierName: carrierData?.legalName || 'Carrier',
        email: carrierData?.email || 'carrier@example.com',
      },
      {
        documentName: 'W-9 Tax Form',
        approvalDate: new Date().toLocaleDateString(),
        expirationDate: 'N/A',
      }
    );
  };

  const handleW9ButtonClick = (document: DocumentInfo) => {
    if (document.id === 'w9_form') {
      setShowW9Form(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return '⏳';
      case 'uploaded':
        return '📄';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'expired':
        return '⏰';
      case 'needs_attention':
        return '⚠️';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return '#f59e0b';
      case 'uploaded':
        return '#3b82f6';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'expired':
        return '#f59e0b';
      case 'needs_attention':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Legal/Regulatory':
        return '⚖️';
      case 'Insurance':
        return '🛡️';
      case 'Financial':
        return '💰';
      case 'Safety/Technology':
        return '📱';
      case 'Safety':
        return '🦺';
      default:
        return '📋';
    }
  };

  const filteredDocuments =
    selectedCategory === 'All'
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  const requiredDocsCompleted = documents.filter(
    (doc) => doc.required && doc.status === 'approved'
  ).length;
  const totalRequiredDocs = documents.filter((doc) => doc.required).length;
  const completionPercentage = Math.round(
    (requiredDocsCompleted / totalRequiredDocs) * 100
  );

  if (showW9Form) {
    return (
      <W9Form
        onFormCompleted={handleW9FormComplete}
        onCancel={() => setShowW9Form(false)}
        carrierInfo={carrierData}
      />
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          📄 Automated Document Verification Center
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            marginBottom: '20px',
          }}
        >
          Upload required documents for automated verification and instant
          processing
        </p>

        {/* Progress Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              Document Verification Progress
            </span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              {requiredDocsCompleted}/{totalRequiredDocs} (
              {completionPercentage}%)
            </span>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              height: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                height: '100%',
                width: `${completionPercentage}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background:
                  selectedCategory === category
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {category !== 'All' && getCategoryIcon(category)} {category}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: `2px solid ${
                document.status === 'approved'
                  ? 'rgba(16, 185, 129, 0.5)'
                  : document.status === 'rejected' ||
                      document.status === 'needs_attention'
                    ? 'rgba(239, 68, 68, 0.5)'
                    : document.required && !document.uploaded
                      ? 'rgba(239, 68, 68, 0.5)'
                      : 'rgba(255, 255, 255, 0.2)'
              }`,
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px',
              }}
            >
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {getCategoryIcon(document.category)} {document.type}
                  {document.required && (
                    <span
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                      }}
                    >
                      REQUIRED
                    </span>
                  )}
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    margin: 0,
                    lineHeight: '1.4',
                    marginBottom: '8px',
                  }}
                >
                  {document.description}
                </p>
              </div>
              <div
                style={{
                  background: getStatusColor(document.status),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '12px',
                }}
              >
                {getStatusIcon(document.status)}{' '}
                {document.status.toUpperCase().replace('_', ' ')}
              </div>
            </div>

            {/* Document Status and Details */}
            {document.uploaded ? (
              <div
                style={{
                  background:
                    document.status === 'approved'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : document.status === 'rejected' ||
                          document.status === 'needs_attention'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(59, 130, 246, 0.2)',
                  border: `1px solid ${
                    document.status === 'approved'
                      ? 'rgba(16, 185, 129, 0.5)'
                      : document.status === 'rejected' ||
                          document.status === 'needs_attention'
                        ? 'rgba(239, 68, 68, 0.5)'
                        : 'rgba(59, 130, 246, 0.5)'
                  }`,
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>File:</strong> {document.fileName}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Uploaded:</strong> {document.uploadDate}
                  </div>
                  {document.expirationDate && (
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Expires:</strong> {document.expirationDate}
                    </div>
                  )}
                  {document.verificationResult && (
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Confidence:</strong>{' '}
                      {Math.round(document.verificationResult.confidence * 100)}
                      %
                    </div>
                  )}
                </div>

                {/* Issues Display */}
                {document.issues && document.issues.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      Issues Found:
                    </div>
                    {document.issues.map((issue, index) => (
                      <div
                        key={index}
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.8rem',
                          marginBottom: '2px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: '#ef4444' }}>•</span>
                        {issue}
                      </div>
                    ))}

                    {document.status === 'needs_attention' && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '8px',
                          background: 'rgba(249, 115, 22, 0.2)',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: 'white',
                        }}
                      >
                        📞 Manual review required - Our team will contact you
                        within 2 business hours
                      </div>
                    )}
                  </div>
                )}

                {/* Reupload option for rejected documents */}
                {document.status === 'rejected' && (
                  <div style={{ marginTop: '12px' }}>
                    <input
                      type='file'
                      id={`refile-${document.id}`}
                      accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(document.id, file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor={`refile-${document.id}`}
                      style={{
                        display: 'block',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      🔄 Upload Corrected Document
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                {/* Special button for W-9 form */}
                {document.id === 'w9_form' ? (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <button
                      onClick={() => handleW9ButtonClick(document)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      📝 Complete W-9 Form Online
                    </button>
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                      }}
                    >
                      or
                    </div>
                    <input
                      type='file'
                      id={`file-${document.id}`}
                      accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
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
                        background: 'rgba(59, 130, 246, 0.8)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      📤 Upload Existing W-9
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type='file'
                      id={`file-${document.id}`}
                      accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
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
                        background:
                          uploadingId === document.id
                            ? '#6b7280'
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor:
                          uploadingId === document.id
                            ? 'not-allowed'
                            : 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {uploadingId === document.id
                        ? '⏳ Processing...'
                        : '📤 Choose File to Upload'}
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Status */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        {completionPercentage === 100 ? (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
            <h3
              style={{
                color: '#10b981',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              All Documents Verified!
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '16px',
              }}
            >
              Your onboarding will be completed within 24 hours. You will
              receive portal access credentials via email.
            </p>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                fontSize: '0.9rem',
              }}
            >
              📧 Notification sent to carrier and operations team
            </div>
          </div>
        ) : (
          <div>
            <h3
              style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              {totalRequiredDocs - requiredDocsCompleted} Required Documents
              Remaining
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Upload the remaining required documents to complete verification
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
            transition: 'all 0.2s ease',
          }}
        >
          ← Back to Verification
        </button>

        <button
          onClick={onNext}
          disabled={completionPercentage < 100}
          style={{
            background:
              completionPercentage === 100
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : '#6b7280',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: completionPercentage === 100 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
          }}
        >
          Continue to Factoring Setup →
        </button>
      </div>
    </div>
  );
};
