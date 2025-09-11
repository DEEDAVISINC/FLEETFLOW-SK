'use client';

import React, { useState, useEffect } from 'react';

interface BOLSubmission {
  id: string;
  loadId: string;
  loadIdentifierId: string;
  driverName: string;
  shipperName: string;
  shipperEmail: string;
  status: 'submitted' | 'broker_review' | 'broker_approved' | 'invoice_generated' | 'invoice_sent' | 'completed';
  submittedAt: string;
  bolData: {
    bolNumber: string;
    proNumber: string;
    deliveryDate: string;
    deliveryTime: string;
    receiverName: string;
    deliveryPhotos: string[];
    pickupPhotos: string[];
    sealNumbers: string[];
    weight: string;
    pieces: number;
    damages: string[];
    notes: string;
  };
}

interface BOLReviewPanelProps {
  brokerId: string;
  brokerName: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
  paymentTerms: string;
  specialInstructions: string;
  contactInfo: string;
}

export default function BOLReviewPanel({ brokerId, brokerName }: BOLReviewPanelProps) {
  const [submissions, setSubmissions] = useState<BOLSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<BOLSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [adjustments, setAdjustments] = useState({
    rate: '',
    additionalCharges: [] as Array<{ description: string; amount: number }>,
    deductions: [] as Array<{ description: string; amount: number }>
  });

  // Email editing state
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    subject: '',
    body: '',
    paymentTerms: 'Net 30 Days',
    specialInstructions: '',
    contactInfo: 'billing@fleetflowapp.com'
  });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [brokerId]);

  useEffect(() => {
    // Generate default email template when submission is selected
    if (selectedSubmission) {
      generateDefaultEmailTemplate(selectedSubmission);
    }
  }, [selectedSubmission, adjustments]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bol-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_submissions',
          brokerId
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmissions(result.submissions.filter((sub: BOLSubmission) => 
          sub.status === 'broker_review' || sub.status === 'submitted'
        ));
      }
    } catch (error) {
      console.error('Failed to load BOL submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultEmailTemplate = (submission: BOLSubmission) => {
    const rate = parseFloat(adjustments.rate) || 2500;
    const additionalCharges = adjustments.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const deductions = adjustments.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const totalAmount = rate + additionalCharges - deductions;

    const invoiceId = `INV-${submission.loadIdentifierId}-${Date.now().toString().slice(-6)}`;

    setEmailTemplate({
      subject: `Invoice ${invoiceId} - Load ${submission.loadIdentifierId} Delivered`,
      body: `Dear ${submission.shipperName} Accounts Payable,

Your shipment has been successfully delivered and is ready for payment processing.

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: ${invoiceId}
Load Reference: ${submission.loadIdentifierId}
BOL Number: ${submission.bolData.bolNumber}
PRO Number: ${submission.bolData.proNumber}

DELIVERY INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivery Date: ${submission.bolData.deliveryDate}
Delivery Time: ${submission.bolData.deliveryTime}
Receiver Name: ${submission.bolData.receiverName}
Driver: ${submission.driverName}
Carrier: ${brokerName}

BILLING INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount Due: $${totalAmount.toLocaleString()}
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

${adjustments.rate || adjustments.additionalCharges.length > 0 || adjustments.deductions.length > 0 ? `
RATE BREAKDOWN:
Base Rate: $${rate.toLocaleString()}
${adjustments.additionalCharges.map(charge => `${charge.description}: +$${charge.amount.toLocaleString()}`).join('\n')}
${adjustments.deductions.map(deduction => `${deduction.description}: -$${deduction.amount.toLocaleString()}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: $${totalAmount.toLocaleString()}
` : ''}

Thank you for your business!

FleetFlow Transportation Services
Professional Freight & Logistics Solutions`,
      paymentTerms: 'Net 30 Days',
      specialInstructions: '',
      contactInfo: 'billing@fleetflowapp.com'
    });
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedSubmission) return;

    try {
      setLoading(true);
      const response = await fetch('/api/bol-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          submissionId: selectedSubmission.id,
          brokerId,
          approved,
          reviewNotes,
          adjustments: adjustments.rate ? {
            rate: parseFloat(adjustments.rate) || undefined,
            additionalCharges: adjustments.additionalCharges,
            deductions: adjustments.deductions
          } : undefined,
          // Include custom email template
          emailTemplate: approved ? emailTemplate : undefined
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(approved ? 
          `✅ BOL approved! Invoice ${result.invoiceId} sent to vendor via customized email.` : 
          '❌ BOL rejected. Driver has been notified.');
        setSelectedSubmission(null);
        setReviewNotes('');
        setAdjustments({ rate: '', additionalCharges: [], deductions: [] });
        setShowEmailEditor(false);
        loadSubmissions(); // Refresh list
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'broker_review':
        return '#f59e0b'; // Yellow
      case 'broker_approved':
        return '#10b981'; // Green
      case 'invoice_sent':
        return '#3b82f6'; // Blue
      default:
        return '#6b7280'; // Gray
    }
  };

  const addCharge = (type: 'additionalCharges' | 'deductions') => {
    setAdjustments(prev => ({
      ...prev,
      [type]: [...prev[type], { description: '', amount: 0 }]
    }));
  };

  const updateCharge = (type: 'additionalCharges' | 'deductions', index: number, field: 'description' | 'amount', value: string | number) => {
    setAdjustments(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeCharge = (type: 'additionalCharges' | 'deductions', index: number) => {
    setAdjustments(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const generateEmailPreview = () => {
    if (!selectedSubmission) return '';

    const rate = parseFloat(adjustments.rate) || 2500;
    const additionalCharges = adjustments.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const deductions = adjustments.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const totalAmount = rate + additionalCharges - deductions;

    return `${emailTemplate.body}

${emailTemplate.specialInstructions ? `
SPECIAL INSTRUCTIONS:
${emailTemplate.specialInstructions}
` : ''}

REMIT PAYMENT TO:
FleetFlow Transportation Services
Accounts Receivable Department
Email: ${emailTemplate.contactInfo}
Payment Terms: ${emailTemplate.paymentTerms}
Reference: ${selectedSubmission.loadIdentifierId}

For questions regarding this invoice, please contact our billing department.`;
  };

  if (loading && submissions.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        🔄 Loading BOL submissions...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0
        }}>
          📋 BOL Review Queue
        </h2>
        <button
          onClick={loadSubmissions}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {submissions.length === 0 ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          📋 No BOL submissions pending review
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {submissions.map(submission => (
            <div
              key={submission.id}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedSubmission(submission)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: 0
                    }}>
                      Load {submission.loadIdentifierId}
                    </h3>
                    <div
                      style={{
                        background: getStatusColor(submission.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {submission.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                    🚛 Driver: {submission.driverName} | 📦 Shipper: {submission.shipperName}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                    📅 Delivered: {submission.bolData.deliveryDate} at {submission.bolData.deliveryTime}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                    📷 {submission.bolData.deliveryPhotos.length} delivery photos
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                    🔒 Seal: {submission.bolData.sealNumbers.join(', ') || 'N/A'}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubmission(submission);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOL Review Modal with Email Editor */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: showEmailEditor ? '1200px' : '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedSubmission(null);
                setShowEmailEditor(false);
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #fca5a5',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#dc2626'
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
              📋 BOL Review - {selectedSubmission.loadIdentifierId}
            </h2>

            <div style={{ display: 'flex', gap: '30px' }}>
              {/* Left Column - BOL Details */}
              <div style={{ flex: showEmailEditor ? '1' : '2' }}>
                {/* BOL Details */}
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    Delivery Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                    <div><strong>BOL #:</strong> {selectedSubmission.bolData.bolNumber}</div>
                    <div><strong>PRO #:</strong> {selectedSubmission.bolData.proNumber}</div>
                    <div><strong>Driver:</strong> {selectedSubmission.driverName}</div>
                    <div><strong>Receiver:</strong> {selectedSubmission.bolData.receiverName}</div>
                    <div><strong>Delivery Date:</strong> {selectedSubmission.bolData.deliveryDate}</div>
                    <div><strong>Delivery Time:</strong> {selectedSubmission.bolData.deliveryTime}</div>
                    <div><strong>Weight:</strong> {selectedSubmission.bolData.weight}</div>
                    <div><strong>Pieces:</strong> {selectedSubmission.bolData.pieces}</div>
                  </div>
                  {selectedSubmission.bolData.notes && (
                    <div style={{ marginTop: '12px' }}>
                      <strong>Notes:</strong> {selectedSubmission.bolData.notes}
                    </div>
                  )}
                </div>

                {/* Rate Adjustments */}
                <div style={{
                  background: '#f0f9ff',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    �� Rate Adjustments (Optional)
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                      Adjusted Rate
                    </label>
                    <input
                      type="number"
                      value={adjustments.rate}
                      onChange={(e) => setAdjustments(prev => ({ ...prev, rate: e.target.value }))}
                      placeholder="Leave blank to use original rate"
                      style={{
                        width: '200px',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Review Notes */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                    📝 Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add any notes about this BOL review..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Right Column - Email Editor */}
              {showEmailEditor && (
                <div style={{ flex: '2' }}>
                  <div style={{
                    background: '#fef3c7',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                        📧 Customize Invoice Email
                      </h3>
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        style={{
                          background: previewMode ? '#ef4444' : '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {previewMode ? '✏️ Edit' : '👁️ Preview'}
                      </button>
                    </div>

                    {!previewMode ? (
                      <>
                        {/* Email Subject */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            Email Subject
                          </label>
                          <input
                            type="text"
                            value={emailTemplate.subject}
                            onChange={(e) => setEmailTemplate(prev => ({ ...prev, subject: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        {/* Email Body */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            Email Body
                          </label>
                          <textarea
                            value={emailTemplate.body}
                            onChange={(e) => setEmailTemplate(prev => ({ ...prev, body: e.target.value }))}
                            rows={12}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              resize: 'vertical'
                            }}
                          />
                        </div>

                        {/* Payment Terms */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            Payment Terms
                          </label>
                          <select
                            value={emailTemplate.paymentTerms}
                            onChange={(e) => setEmailTemplate(prev => ({ ...prev, paymentTerms: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="Net 15 Days">Net 15 Days</option>
                            <option value="Net 30 Days">Net 30 Days</option>
                            <option value="Net 45 Days">Net 45 Days</option>
                            <option value="Net 60 Days">Net 60 Days</option>
                            <option value="Due on Receipt">Due on Receipt</option>
                            <option value="2/10 Net 30">2/10 Net 30</option>
                          </select>
                        </div>

                        {/* Special Instructions */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            Special Instructions
                          </label>
                          <textarea
                            value={emailTemplate.specialInstructions}
                            onChange={(e) => setEmailTemplate(prev => ({ ...prev, specialInstructions: e.target.value }))}
                            placeholder="Add any special billing instructions, PO numbers, or vendor-specific requirements..."
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        </div>

                        {/* Contact Info */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            Billing Contact Email
                          </label>
                          <input
                            type="email"
                            value={emailTemplate.contactInfo}
                            onChange={(e) => setEmailTemplate(prev => ({ ...prev, contactInfo: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      /* Email Preview */
                      <div style={{
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '20px',
                        maxHeight: '500px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                          <strong>Subject:</strong> {emailTemplate.subject}
                        </div>
                        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                          <strong>To:</strong> {selectedSubmission.shipperEmail}
                        </div>
                        <div style={{ whiteSpace: 'pre-line', fontSize: '14px', fontFamily: 'monospace' }}>
                          {generateEmailPreview()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <button
                onClick={() => setShowEmailEditor(!showEmailEditor)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showEmailEditor ? '📋 Hide Email Editor' : '📧 Customize Email'}
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleApproval(false)}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  ❌ Reject BOL
                </button>
                <button
                  onClick={() => handleApproval(true)}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  ✅ Approve & Send Custom Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
