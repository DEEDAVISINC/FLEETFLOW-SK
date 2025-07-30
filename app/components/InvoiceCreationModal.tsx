'use client';

import { useRef, useState } from 'react';
import { getCurrentUser } from '../config/access';
import { getDefaultFeePercentage } from '../config/dispatch';
import {
  generateInvoiceNumber,
  getDepartmentCode,
  getUserInitials,
} from '../services/invoiceService';
import { Load } from '../services/loadService';
import DispatchInvoice from './DispatchInvoice';

interface InvoiceCreationModalProps {
  load: Load;
  onClose: () => void;
  onInvoiceCreated: (invoiceId: string) => void;
}

interface InvoiceData {
  id: string;
  loadId: string;
  loadBoardNumber?: string; // Phone reference - the 6-digit number customers call about (e.g., "100001")
  bolNumber?: string; // BOL number for document tracking (e.g., "BOL-MJ25015-001")
  departmentCode?: string; // Department code: DC (dispatcher), BB (broker)
  userInitials?: string; // User initials for accountability (e.g., "SJ")
  dispatcherName?: string; // Name of the dispatcher handling the load
  dispatcherUserIdentifier?: string; // Dispatcher user identifier (e.g., "SJ-DC-2024014")
  dispatcherCompanyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  }; // Dispatcher/tenant company information
  loadIdentifier: string;
  shipperId: string;
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails?: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight?: string;
    miles?: number;
  };
  paymentTerms?: string;
  notes?: string;
}

export default function InvoiceCreationModal({
  load,
  onClose,
  onInvoiceCreated,
}: InvoiceCreationModalProps) {
  // Auto-populate carrier info from load data
  const getCarrierInfo = () => {
    const customerInfo = (load as any).customerInfo;
    const dispatcherName = (load as any).dispatcher || load.dispatcherName;

    return {
      name: customerInfo?.name || dispatcherName || 'Auto-Generated Carrier',
      address: customerInfo?.address || '',
      email: customerInfo?.email || '',
      phone: customerInfo?.phone || '',
    };
  };

  const carrierInfo = getCarrierInfo();

  const [feePercentage, setFeePercentage] = useState(getDefaultFeePercentage());
  const [customRate, setCustomRate] = useState(load.rate);
  const [loadType, setLoadType] = useState<
    'standard' | 'expedited' | 'hazmat' | 'oversize' | 'team'
  >('standard');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isSubmittedToManagement, setIsSubmittedToManagement] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');

  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateInvoiceData = (): InvoiceData => {
    const currentUser = getCurrentUser();
    const departmentCode = getDepartmentCode(currentUser.user.role);
    const userInitials = getUserInitials(currentUser.user.name);
    const dispatchFee = load.rate * (feePercentage / 100);

    // Check if management approval is required
    const requiresApproval = JSON.parse(
      localStorage.getItem('requireManagementApproval') || 'true'
    );

    return {
      id: generateInvoiceNumber(load.id, departmentCode, userInitials),
      loadId: load.id,
      loadBoardNumber: load.id.replace(/\D/g, '').slice(0, 6) || '100001',
      bolNumber: (load as any).bolNumber || `BOL-${load.id}-001`,
      departmentCode,
      userInitials,
      dispatcherName: currentUser.user.name,
      dispatcherUserIdentifier: currentUser.user.id,
      dispatcherCompanyInfo: {
        name: 'Dispatch Services',
        address: '123 Fleet Street, Transport City, TX 75001',
        phone: '(555) 123-4567',
        email: 'billing@dispatchservices.com',
      },
      loadIdentifier: load.id,
      shipperId: (load as any).customerId || 'DEFAULT_SHIPPER',
      carrierName: (load as any).assignedDriver || 'TBD Carrier',
      carrierAddress: 'TBD',
      carrierEmail: 'carrier@example.com',
      carrierPhone: '(555) 000-0000',
      loadAmount: load.rate,
      dispatchFee: dispatchFee,
      feePercentage: feePercentage,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: requiresApproval
        ? ('pending_management_review' as const)
        : ('auto_approved' as const),
      managementSubmissionId: '', // Will be set in handleCreateInvoice if needed
      loadDetails: {
        origin: load.origin,
        destination: load.destination,
        pickupDate:
          (load as any).pickupDate || new Date().toISOString().split('T')[0],
        deliveryDate:
          (load as any).deliveryDate ||
          new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        equipment: load.equipment,
        weight: (load as any).weight,
        miles: load.distance
          ? parseInt(load.distance.replace(/[^\d]/g, ''))
          : undefined,
      },
      paymentTerms: paymentTerms,
      notes: notes,
      loadDescription: (load as any).loadDescription,
      financialBreakdown: (load as any).billingDetails,
      routeDetails: {
        origin: load.origin,
        destination: load.destination,
        distance: load.distance,
        equipmentType: load.equipment,
      },
      serviceDetails: {
        serviceType: 'Dispatch Services',
        description:
          'Load coordination, carrier management, and documentation processing',
      },
      customerInfo: (load as any).customerInfo,
    };
  };

  const handleCreateInvoice = async () => {
    if (isCreating) return;

    setIsCreating(true);

    try {
      // Generate invoice data
      const invoiceData = generateInvoiceData();

      // Check if management approval is required
      const requiresApproval = JSON.parse(
        localStorage.getItem('requireManagementApproval') || 'true'
      );

      if (requiresApproval) {
        // Management approval workflow
        // Generate management submission ID
        const currentDate = new Date();
        const submissionIdGenerated = `MGT-${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Update invoice data with submission ID
        invoiceData.managementSubmissionId = submissionIdGenerated;

        setSubmissionId(submissionIdGenerated);
        setIsSubmittedToManagement(true);

        // Simulate submission delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log('Dispatcher fee submitted to management:', invoiceData);
      } else {
        // Auto-approval workflow
        invoiceData.status = 'auto_approved';
        invoiceData.approvedAt = new Date().toISOString();
        invoiceData.approvedBy = 'Auto-System';

        // Skip management review and go directly to success
        setIsSubmittedToManagement(true);
        setSubmissionId('AUTO-APPROVED');

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Dispatcher fee auto-approved:', invoiceData);
      }

      // Save to localStorage (simulate database)
      const existingInvoices = JSON.parse(
        localStorage.getItem('invoices') || '[]'
      );

      // Prevent duplicates by checking if invoice ID already exists
      const isDuplicate = existingInvoices.some(
        (inv: any) => inv.id === invoiceData.id
      );

      if (!isDuplicate) {
        existingInvoices.push(invoiceData);
        localStorage.setItem('invoices', JSON.stringify(existingInvoices));
        console.log('Invoice saved successfully:', invoiceData.id);
      } else {
        console.warn('Duplicate invoice prevented:', invoiceData.id);
        // Generate a new unique ID if duplicate detected
        const currentUserData = getCurrentUser();
        invoiceData.id = generateInvoiceNumber(
          load.id,
          getDepartmentCode(currentUserData.user.role),
          getUserInitials(currentUserData.user.name)
        );
        existingInvoices.push(invoiceData);
        localStorage.setItem('invoices', JSON.stringify(existingInvoices));
        console.log('Invoice saved with new ID:', invoiceData.id);
      }

      // Update the onInvoiceCreated callback if provided
      if (onInvoiceCreated) {
        onInvoiceCreated(invoiceData.id);
      }
    } catch (error) {
      console.error('Error processing dispatcher fee:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const previewInvoiceData = generateInvoiceData();

  console.log(
    'InvoiceCreationModal render - showPreview:',
    showPreview,
    'load:',
    load.id,
    'Preview Invoice Data:',
    previewInvoiceData
  );

  if (showPreview) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'white',
          zIndex: 10000,
          overflow: 'auto',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              💼 Submit Dispatcher Fee to Management
            </h1>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Review dispatcher fee details • Submit for management approval •
              Await approval for carrier payment
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowPreview(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ← Back to Review
            </button>
            <button
              onClick={handleCreateInvoice}
              disabled={isCreating}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: isCreating ? 0.6 : 1,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isCreating) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 20px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCreating) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isCreating ? '⏳ Submitting...' : '📋 Submit to Management'}
            </button>
          </div>
        </div>

        {/* Invoice Content - Full Width No Constraints */}
        <div
          style={{
            padding: '40px',
            background: '#f8fafc',
            minHeight: 'calc(100vh - 84px)',
          }}
        >
          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto 20px auto',
                background: '#1f2937',
                color: '#10b981',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            >
              <div>
                <strong>🔍 Debug Info:</strong>
              </div>
              <div>• Load ID: {load.id}</div>
              <div>• Invoice ID: {previewInvoiceData?.id}</div>
              <div>
                • Has Load Description:{' '}
                {(load as any).loadDescription ? '✅' : '❌'}
              </div>
              <div>
                • Has Billing Details:{' '}
                {(load as any).billingDetails ? '✅' : '❌'}
              </div>
              <div>
                • Has Customer Info: {(load as any).customerInfo ? '✅' : '❌'}
              </div>
              <div>• Dispatcher: {previewInvoiceData?.dispatcherName}</div>
              <div>
                • Total Amount: $
                {(load as any).billingDetails?.totalAmount || 'N/A'}
              </div>
            </div>
          )}

          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'visible',
              minHeight: '800px',
            }}
          >
            {previewInvoiceData ? (
              <div style={{ width: '100%', minHeight: '100%' }}>
                <DispatchInvoice
                  ref={invoiceRef}
                  invoice={previewInvoiceData}
                />
              </div>
            ) : (
              <div
                style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '18px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  Calculating Dispatcher Fee...
                </div>
                <div style={{ fontSize: '14px' }}>
                  Preparing dispatcher fee calculation and documentation
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show management submission confirmation
  if (isSubmittedToManagement) {
    const requiresApproval = JSON.parse(
      localStorage.getItem('requireManagementApproval') || 'true'
    );
    const isAutoApproved = submissionId === 'AUTO-APPROVED';

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: '20px',
            padding: '48px',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            border: '3px solid #22c55e',
            boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.3)',
          }}
        >
          {/* Success Icon and Header */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '72px',
                marginBottom: '16px',
                animation: 'pulse 2s infinite',
              }}
            >
              {isAutoApproved ? '⚡' : '✅'}
            </div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#15803d',
                margin: '0 0 12px 0',
                letterSpacing: '-0.025em',
              }}
            >
              {isAutoApproved
                ? 'Dispatcher Fee Auto-Approved!'
                : 'Dispatcher Fee Submitted Successfully!'}
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#16a34a',
                fontWeight: '600',
                margin: '0',
                lineHeight: '1.5',
              }}
            >
              {isAutoApproved
                ? 'Your dispatcher fee has been automatically approved and sent to the carrier for payment'
                : 'Your dispatcher fee has been submitted to management for approval'}
            </p>
          </div>

          {/* Submission Details */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '32px',
              border: '2px solid #a3e635',
              textAlign: 'left',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#15803d',
                margin: '0 0 20px 0',
                textAlign: 'center',
              }}
            >
              {isAutoApproved
                ? '⚡ Auto-Approval Details'
                : '📋 Submission Details'}
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {!isAutoApproved && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#374151' }}>
                    Management Submission ID:
                  </span>
                  <span
                    style={{
                      fontWeight: '800',
                      color: '#15803d',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      background: '#f0fdf4',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #22c55e',
                    }}
                  >
                    {submissionId}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: '600', color: '#374151' }}>
                  Load ID:
                </span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>
                  {load.id}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: '600', color: '#374151' }}>
                  Dispatcher Fee:
                </span>
                <span
                  style={{
                    fontWeight: '800',
                    color: '#15803d',
                    fontSize: '18px',
                  }}
                >
                  ${(load.rate * (feePercentage / 100)).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: '600', color: '#374151' }}>
                  {isAutoApproved ? 'Auto-Approved:' : 'Submitted:'}
                </span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>
                  {new Date().toLocaleString()}
                </span>
              </div>

              {isAutoApproved && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#374151' }}>
                    Status:
                  </span>
                  <span
                    style={{
                      fontWeight: '800',
                      color: '#15803d',
                      fontSize: '14px',
                      background: '#f0fdf4',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: '1px solid #22c55e',
                    }}
                  >
                    ⚡ AUTO-APPROVED & SENT TO CARRIER
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div
            style={{
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid #3b82f6',
              textAlign: 'left',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e40af',
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              {isAutoApproved ? '⚡ Auto-Processing Complete' : '📋 Next Steps'}
            </h3>

            <div
              style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.6' }}
            >
              {isAutoApproved ? (
                <>
                  <div
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ marginRight: '8px', fontWeight: '700' }}>
                      ✅
                    </span>
                    <span>
                      <strong>Auto-Approved:</strong> Your dispatcher fee has
                      been automatically approved and processed
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ marginRight: '8px', fontWeight: '700' }}>
                      📧
                    </span>
                    <span>
                      <strong>Invoice Sent:</strong> Dispatcher fee invoice has
                      been sent to the carrier for payment
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '8px', fontWeight: '700' }}>
                      💰
                    </span>
                    <span>
                      <strong>Payment Expected:</strong> Carrier payment
                      expected per your weekly payment schedule
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ marginRight: '8px', fontWeight: '700' }}>
                      1.
                    </span>
                    <span>
                      <strong>Management Review:</strong> Your submission will
                      be reviewed by management within 2-4 hours
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ marginRight: '8px', fontWeight: '700' }}>
                      2.
                    </span>
                    <span>
                      <strong>Approval Notification:</strong> You'll receive
                      confirmation once approved
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '8px', fontWeight: '700' }}>
                      3.
                    </span>
                    <span>
                      <strong>Payment Processing:</strong> Invoice will be sent
                      to carrier for payment per your weekly schedule
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
          >
            <button
              onClick={() => {
                setIsSubmittedToManagement(false);
                setSubmissionId('');
                onClose();
              }}
              style={{
                background: 'linear-gradient(135deg, #15803d, #22c55e)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 15px -3px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px -1px rgba(34, 197, 94, 0.3)';
              }}
            >
              {isAutoApproved
                ? '⚡ Complete - Return to Dispatch'
                : '✅ Complete - Return to Dispatch'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'white',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '98vh',
          height: 'auto',
          borderRadius: '12px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
            }}
          >
            🧾 Invoice Order Confirmation
          </h2>
          <p
            style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}
          >
            {load.origin} → {load.destination} | Status: {load.status}
          </p>
        </div>

        <div
          style={{
            padding: '24px',
            background: '#ffffff',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* COMPREHENSIVE LOAD INFORMATION DISPLAY - ORDER CONFIRMATION STYLE */}
          <div
            style={{
              display: 'grid',
              gap: '20px',
              minHeight: '400px',
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Invoice Identifiers */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #60a5fa',
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#e0e7ff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                📋 Invoice Identifiers
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  color: '#ffffff',
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                >
                  <strong style={{ color: '#e0e7ff' }}>Invoice #:</strong>{' '}
                  {previewInvoiceData?.id}
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                >
                  <strong style={{ color: '#e0e7ff' }}>📞 Board #:</strong>{' '}
                  {previewInvoiceData?.loadBoardNumber}
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                >
                  <strong style={{ color: '#e0e7ff' }}>BOL #:</strong>{' '}
                  {previewInvoiceData?.bolNumber}
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                >
                  <strong style={{ color: '#e0e7ff' }}>Load ID:</strong>{' '}
                  {previewInvoiceData?.loadIdentifier}
                </div>
              </div>
            </div>

            {/* Dispatcher Fee Calculation */}
            <div
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                padding: '24px',
                borderRadius: '12px',
                border: '3px solid #34d399',
                color: '#ffffff',
                boxShadow: '0 12px 32px rgba(5, 150, 105, 0.3)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  textAlign: 'center',
                }}
              >
                💰 DISPATCHER FEE CALCULATION
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '20px',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                {/* Load Revenue */}
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#d1fae5',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    LOAD REVENUE
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}
                  >
                    $
                    {(
                      (load as any).billingDetails?.totalAmount ||
                      previewInvoiceData?.loadAmount ||
                      0
                    ).toLocaleString()}
                  </div>
                </div>

                {/* Multiplication Symbol */}
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#ffffff',
                    textAlign: 'center',
                  }}
                >
                  ×
                </div>

                {/* Fee Percentage */}
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#d1fae5',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    DISPATCHER FEE RATE
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}
                  >
                    {previewInvoiceData?.feePercentage || 10}%
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#a7f3d0',
                      marginTop: '4px',
                    }}
                  >
                    ({loadType.charAt(0).toUpperCase() + loadType.slice(1)}{' '}
                    Rate)
                  </div>
                </div>
              </div>

              {/* Equals and Result */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  =
                </div>
                <div
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    border: '3px solid #ffffff',
                    display: 'inline-block',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#ffffff',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    DISPATCHER FEE AMOUNT
                  </div>
                  <div
                    style={{
                      fontSize: '36px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}
                  >
                    ${(previewInvoiceData?.dispatchFee || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Fee Justification */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#d1fae5',
                }}
              >
                <strong>Fee Justification:</strong> This dispatcher fee covers
                load coordination, carrier management, documentation processing,
                and customer service for successful load completion.
              </div>
            </div>

            {/* ROUTE & SERVICE DETAILS - COMPLETED LOADS STYLE */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                overflow: 'visible',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
                minHeight: '150px',
              }}
            >
              {/* Header for Route & Service Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  visibility: 'visible',
                  position: 'relative',
                }}
              >
                <div>🗺️ Route Information</div>
                <div>🚛 Equipment & Distance</div>
                <div>👥 Personnel</div>
                <div>📋 Service Details</div>
              </div>

              {/* Data Row 1 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  padding: '16px 20px',
                  background: '#ffffff',
                  color: '#1e293b',
                  fontSize: '13px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#3b82f6',
                    }}
                  >
                    Origin
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {load.origin || 'N/A'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#8b5cf6',
                    }}
                  >
                    Equipment
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {load.equipment || (load as any).type || 'N/A'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#059669',
                    }}
                  >
                    Dispatcher
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {(load as any).dispatcher || load.dispatcherName || 'N/A'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#d97706',
                    }}
                  >
                    Service Level
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {(load as any).serviceLevel || 'Standard'}
                  </div>
                </div>
              </div>

              {/* Data Row 2 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: '13px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#3b82f6',
                    }}
                  >
                    Destination
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {load.destination || 'N/A'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#f59e0b',
                    }}
                  >
                    Distance
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {load.distance ? `${load.distance} mi` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#059669',
                    }}
                  >
                    Broker
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {(load as any).broker || 'N/A'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#d97706',
                    }}
                  >
                    Priority
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                    {(load as any).priorityLevel || 'Medium'}
                  </div>
                </div>
              </div>
            </div>

            {/* Load Description Section */}
            {(load as any).loadDescription && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #1f2937, #374151)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #fde047',
                  color: '#ffffff',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#fbbf24',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  📦 Load Description
                </h3>
                <div style={{ display: 'grid', gap: '12px', color: '#ffffff' }}>
                  <div
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#fbbf24' }}>Commodity:</strong>{' '}
                    {(load as any).loadDescription.commodity}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#fbbf24' }}>Description:</strong>{' '}
                    {(load as any).loadDescription.description}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px',
                      marginTop: '8px',
                      color: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                      }}
                    >
                      <strong style={{ color: '#fbbf24' }}>Pieces:</strong>{' '}
                      {(load as any).loadDescription.pieces}
                    </div>
                    <div
                      style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                      }}
                    >
                      <strong style={{ color: '#fbbf24' }}>Pallets:</strong>{' '}
                      {(load as any).loadDescription.palletCount}
                    </div>
                    <div
                      style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                      }}
                    >
                      <strong style={{ color: '#fbbf24' }}>Type:</strong>{' '}
                      {(load as any).loadDescription.packagingType}
                    </div>
                    <div
                      style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                      }}
                    >
                      <strong style={{ color: '#fbbf24' }}>PO#:</strong>{' '}
                      {(load as any).loadDescription.poNumber}
                    </div>
                  </div>
                  {(load as any).loadDescription.specialHandling && (
                    <div
                      style={{
                        color: '#ffffff',
                        fontSize: '15px',
                        marginTop: '12px',
                        padding: '12px',
                        background: 'rgba(251, 191, 36, 0.2)',
                        borderRadius: '8px',
                        border: '1px solid #fbbf24',
                      }}
                    >
                      <strong style={{ color: '#fbbf24' }}>
                        Special Handling:
                      </strong>{' '}
                      {(load as any).loadDescription.specialHandling}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Breakdown Section */}
            {(load as any).billingDetails && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #064e3b, #065f46)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #10b981',
                  color: '#ffffff',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#34d399',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  💰 Financial Breakdown
                </h3>
                <div style={{ display: 'grid', gap: '12px', color: '#ffffff' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(52, 211, 153, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                    }}
                  >
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      <strong style={{ color: '#34d399' }}>Base Rate:</strong>
                    </span>
                    <span
                      style={{
                        fontWeight: '700',
                        color: '#34d399',
                        fontSize: '16px',
                      }}
                    >
                      ${(load as any).billingDetails.baseRate?.toLocaleString()}
                    </span>
                  </div>

                  {/* Lumper Fees */}
                  {(load as any).billingDetails.lumperFee && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        color: '#ffffff',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: '#34d399',
                          fontSize: '15px',
                        }}
                      >
                        Lumper Fees:
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          fontSize: '14px',
                          color: '#ffffff',
                        }}
                      >
                        <div style={{ color: '#ffffff', padding: '4px' }}>
                          <strong>Pickup:</strong> $
                          {(load as any).billingDetails.lumperFee.pickup}
                        </div>
                        <div style={{ color: '#ffffff', padding: '4px' }}>
                          <strong>Delivery:</strong> $
                          {(load as any).billingDetails.lumperFee.delivery}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#d1d5db',
                          marginTop: '4px',
                        }}
                      >
                        {(load as any).billingDetails.lumperFee.description}
                      </div>
                    </div>
                  )}

                  {/* Fuel Surcharge */}
                  {(load as any).billingDetails.fuelSurcharge && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '15px',
                        color: '#ffffff',
                      }}
                    >
                      <span style={{ color: '#ffffff' }}>
                        <strong style={{ color: '#34d399' }}>
                          Fuel Surcharge
                        </strong>{' '}
                        ({(load as any).billingDetails.fuelSurcharge.percentage}
                        %):
                      </span>
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>
                        ${(load as any).billingDetails.fuelSurcharge.amount}
                      </span>
                    </div>
                  )}

                  {/* Liftgate Fee */}
                  {(load as any).billingDetails.liftgateFee && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '15px',
                        color: '#ffffff',
                      }}
                    >
                      <span style={{ color: '#ffffff' }}>
                        <strong style={{ color: '#34d399' }}>
                          Liftgate Fee:
                        </strong>
                      </span>
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>
                        ${(load as any).billingDetails.liftgateFee}
                      </span>
                    </div>
                  )}

                  {/* Custom Charges */}
                  {(load as any).billingDetails.customCharges &&
                    (load as any).billingDetails.customCharges.length > 0 && (
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          color: '#ffffff',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            marginBottom: '8px',
                            color: '#34d399',
                            fontSize: '15px',
                          }}
                        >
                          Additional Charges:
                        </div>
                        {(load as any).billingDetails.customCharges.map(
                          (charge: any, index: number) => (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '14px',
                                marginBottom: '4px',
                                color: '#ffffff',
                                padding: '4px',
                              }}
                            >
                              <span style={{ color: '#ffffff' }}>
                                {charge.name}:
                              </span>
                              <span
                                style={{ color: '#ffffff', fontWeight: '600' }}
                              >
                                ${charge.amount}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  <div
                    style={{
                      borderTop: '2px solid #34d399',
                      paddingTop: '12px',
                      marginTop: '12px',
                      color: '#ffffff',
                      background: 'rgba(52, 211, 153, 0.15)',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#ffffff',
                      }}
                    >
                      <span style={{ color: '#ffffff' }}>TOTAL AMOUNT:</span>
                      <span style={{ color: '#34d399', fontSize: '20px' }}>
                        $
                        {(
                          load as any
                        ).billingDetails.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Information */}
            {(load as any).customerInfo && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  color: '#ffffff',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#60a5fa',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  👤 Customer Information
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                    fontSize: '15px',
                    color: '#ffffff',
                  }}
                >
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#60a5fa' }}>Company:</strong>{' '}
                    {(load as any).customerInfo.name}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#60a5fa' }}>Contact:</strong>{' '}
                    {(load as any).customerInfo.contactPerson}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#60a5fa' }}>Phone:</strong>{' '}
                    {(load as any).customerInfo.phone}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#60a5fa' }}>Email:</strong>{' '}
                    {(load as any).customerInfo.email}
                  </div>
                  {(load as any).customerInfo.address && (
                    <div
                      style={{
                        color: '#ffffff',
                        padding: '10px',
                        background: 'rgba(96, 165, 250, 0.2)',
                        borderRadius: '6px',
                        border: '1px solid #60a5fa',
                      }}
                    >
                      <strong style={{ color: '#60a5fa' }}>Address:</strong>{' '}
                      {(load as any).customerInfo.address}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Equipment Details */}
            {(load as any).equipmentDetail && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #581c87, #7c3aed)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #8b5cf6',
                  color: '#ffffff',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#c4b5fd',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  🚛 Equipment Details
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                    fontSize: '15px',
                    color: '#ffffff',
                  }}
                >
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#c4b5fd' }}>Type:</strong>{' '}
                    {(load as any).equipmentDetail.type}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#c4b5fd' }}>Length:</strong>{' '}
                    {(load as any).equipmentDetail.length}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                    }}
                  >
                    <strong style={{ color: '#c4b5fd' }}>
                      Weight Capacity:
                    </strong>{' '}
                    {(load as any).equipmentDetail.weight}
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(196, 181, 253, 0.2)',
                      borderRadius: '6px',
                      border: '1px solid #c4b5fd',
                    }}
                  >
                    <strong style={{ color: '#c4b5fd' }}>
                      Hazmat Certified:
                    </strong>{' '}
                    <span
                      style={{
                        fontWeight: '600',
                        color: (load as any).equipmentDetail.hazmat
                          ? '#34d399'
                          : '#f87171',
                      }}
                    >
                      {(load as any).equipmentDetail.hazmat ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      padding: '10px',
                      background: 'rgba(196, 181, 253, 0.2)',
                      borderRadius: '6px',
                      border: '1px solid #c4b5fd',
                    }}
                  >
                    <strong style={{ color: '#c4b5fd' }}>
                      Temperature Control:
                    </strong>{' '}
                    <span
                      style={{
                        fontWeight: '600',
                        color: (load as any).equipmentDetail.temperature
                          ? '#34d399'
                          : '#f87171',
                      }}
                    >
                      {(load as any).equipmentDetail.temperature ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleCreateInvoice}
                disabled={isCreating}
                style={{
                  background: isCreating ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {isCreating
                  ? '⏳ Submitting to Management...'
                  : '📋 Submit Dispatcher Fee to Management'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
