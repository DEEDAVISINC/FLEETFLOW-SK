// 🔄 Enhanced Driver Portal with Workflow Management
// Enforces step-by-step process with validation and flow control

'use client';

import { useState } from 'react';
import { useLoadWorkflow } from '../../lib/useWorkflowHooks';
import { WorkflowStepId } from '../../lib/workflowManager';
import TransitTracking from '../components/TransitTracking';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedTruckId: string;
  dispatcherId: string;
  dispatcherName: string;
  dispatcherPhone: string;
  dispatcherEmail: string;
  currentLocation: string;
  eldStatus: string;
  hoursRemaining: number;
}

interface Load {
  id: string;
  brokerName: string;
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  status: string;
  pickupDate: string;
  deliveryDate: string;
  assignedDriverId?: string;
  workflowStep?: string;
}

// Workflow Step Modal Component
function WorkflowStepModal({
  load,
  stepId,
  onClose,
  driverId,
}: {
  load: Load;
  stepId: string;
  onClose: () => void;
  driverId: string;
}) {
  const { completeStep, validateStepData } = useLoadWorkflow(load.id);
  const [stepData, setStepData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate step data
      const validation = validateStepData(stepId as WorkflowStepId, stepData);
      if (!validation.valid) {
        setError(validation.errors?.join(', ') || 'Validation failed');
        setLoading(false);
        return;
      }

      // Complete the step
      const result = await completeStep(
        stepId as WorkflowStepId,
        stepData,
        driverId
      );

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to complete step');
      }
    } catch (err) {
      setError('An error occurred while completing the step');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (stepId) {
      case 'load_assignment_confirmation':
        return (
          <LoadAssignmentConfirmation
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'rate_confirmation_review':
        return (
          <RateConfirmationReview
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'rate_confirmation_verification':
        return (
          <RateConfirmationVerification
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'bol_receipt_confirmation':
        return (
          <BOLReceiptConfirmation
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'bol_verification':
        return (
          <BOLVerification
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'pickup_completion':
        return (
          <PickupCompletion
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'transit_tracking':
        return (
          <TransitTracking
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      case 'delivery_completion':
        return (
          <DeliveryCompletion
            load={load}
            stepData={stepData}
            setStepData={setStepData}
          />
        );
      default:
        return <div>Step content not implemented yet</div>;
    }
  };

  return (
    <div
      style={{
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
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
            }}
          >
            {getStepTitle(stepId)}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {renderStepContent()}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={loading}
            style={{
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              flex: 2,
            }}
          >
            {loading ? 'Processing...' : 'Complete Step'}
          </button>
        </div>
      </div>
    </div>
  );
}

function getStepTitle(stepId: string): string {
  switch (stepId) {
    case 'load_assignment_confirmation':
      return 'Load Assignment Confirmation';
    case 'rate_confirmation_review':
      return 'Rate Confirmation Review';
    case 'rate_confirmation_verification':
      return 'Rate Confirmation Verification';
    case 'bol_receipt_confirmation':
      return 'BOL Receipt Confirmation';
    case 'bol_verification':
      return 'BOL Verification';
    case 'pickup_authorization':
      return 'Pickup Authorization';
    case 'pickup_arrival':
      return 'Pickup Arrival';
    case 'pickup_completion':
      return 'Pickup Completion';
    case 'transit_start':
      return 'Transit Start';
    case 'transit_tracking':
      return 'Transit Tracking';
    case 'delivery_arrival':
      return 'Delivery Arrival';
    case 'delivery_completion':
      return 'Delivery Completion';
    case 'pod_submission':
      return 'Proof of Delivery Submission';
    default:
      return 'Workflow Step';
  }
}

// Step Content Components (simplified - will be expanded)
function LoadAssignmentConfirmation({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Please confirm that you accept this load assignment:</p>
      <div
        style={{
          background: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <strong>Load:</strong> {load.id}
        <br />
        <strong>Route:</strong> {load.origin} → {load.destination}
        <br />
        <strong>Rate:</strong> ${load.rate.toLocaleString()}
        <br />
        <strong>Pickup:</strong>{' '}
        {new Date(load.pickupDate).toLocaleDateString()}
      </div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <input
          type='checkbox'
          checked={stepData.accepted || false}
          onChange={(e) =>
            setStepData({ ...stepData, accepted: e.target.checked })
          }
        />
        I accept this load assignment and understand the requirements
      </label>
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
        >
          Digital Signature:
        </label>
        <canvas
          width='400'
          height='100'
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            width: '100%',
          }}
          onMouseDown={(e) => {
            // Signature capture logic
            setStepData({
              ...stepData,
              driverSignature: 'signature_data',
              confirmationTimestamp: new Date().toISOString(),
            });
          }}
        />
      </div>
    </div>
  );
}

function RateConfirmationReview({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Please review the rate confirmation document:</p>
      <div
        style={{
          background: '#f0f9ff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #3b82f6',
        }}
      >
        <h4>📄 Rate Confirmation</h4>
        <p>
          <strong>Load ID:</strong> {load.id}
        </p>
        <p>
          <strong>Rate:</strong> ${load.rate.toLocaleString()}
        </p>
        <p>
          <strong>Fuel Surcharge:</strong> Included
        </p>
        <p>
          <strong>Accessorials:</strong> None
        </p>
        <p>
          <strong>Payment Terms:</strong> Net 30
        </p>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type='checkbox'
          checked={stepData.reviewed || false}
          onChange={(e) =>
            setStepData({
              ...stepData,
              reviewed: e.target.checked,
              reviewTimestamp: new Date().toISOString(),
            })
          }
        />
        I have reviewed the rate confirmation document
      </label>
    </div>
  );
}

function RateConfirmationVerification({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Please verify and confirm the rate details are accurate:</p>
      <div
        style={{
          background: '#f0fdf4',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #10b981',
        }}
      >
        <h4>✔️ Rate Verification</h4>
        <p>
          <strong>Agreed Rate:</strong> ${load.rate.toLocaleString()}
        </p>
        <p>
          <strong>Route:</strong> {load.origin} → {load.destination}
        </p>
        <p>
          <strong>Equipment:</strong> {load.equipment}
        </p>
      </div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <input
          type='checkbox'
          checked={stepData.rateAccepted || false}
          onChange={(e) =>
            setStepData({
              ...stepData,
              rateAccepted: e.target.checked,
              verificationTimestamp: new Date().toISOString(),
            })
          }
        />
        I verify that the rate and terms are accurate and acceptable
      </label>
    </div>
  );
}

function BOLReceiptConfirmation({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Confirm receipt of Bill of Lading from your dispatcher:</p>
      <div
        style={{
          background: '#fffbeb',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #f59e0b',
        }}
      >
        <h4>📋 Bill of Lading Status</h4>
        <p>
          <strong>Load ID:</strong> {load.id}
        </p>
        <p>
          <strong>Dispatcher:</strong> Sarah Johnson
        </p>
        <p>
          <strong>Status:</strong> Pending Receipt Confirmation
        </p>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type='checkbox'
          checked={stepData.bolReceived || false}
          onChange={(e) =>
            setStepData({
              ...stepData,
              bolReceived: e.target.checked,
              receiptTimestamp: new Date().toISOString(),
            })
          }
        />
        I confirm receipt of the Bill of Lading document
      </label>
    </div>
  );
}

function BOLVerification({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Verify the Bill of Lading details and confirm accuracy:</p>
      <div
        style={{
          background: '#f0f9ff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #3b82f6',
        }}
      >
        <h4>📋 Bill of Lading Details</h4>
        <p>
          <strong>Shipper:</strong> ABC Manufacturing
        </p>
        <p>
          <strong>Consignee:</strong> XYZ Distribution
        </p>
        <p>
          <strong>Commodity:</strong> Electronics
        </p>
        <p>
          <strong>Weight:</strong> {load.weight}
        </p>
        <p>
          <strong>Pieces:</strong> 10 pallets
        </p>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type='checkbox'
          checked={stepData.bolVerified || false}
          onChange={(e) =>
            setStepData({
              ...stepData,
              bolVerified: e.target.checked,
              verificationTimestamp: new Date().toISOString(),
            })
          }
        />
        I verify that all BOL details are accurate and I'm authorized to proceed
        to pickup
      </label>
    </div>
  );
}

function PickupCompletion({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Complete pickup process with photos and timestamp:</p>
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
        >
          📸 Pickup Photos (Required):
        </label>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={(e) =>
            setStepData({
              ...stepData,
              pickupPhotos: Array.from(e.target.files || []),
              pickupTimestamp: new Date().toISOString(),
            })
          }
        />
      </div>
      <button
        onClick={() =>
          setStepData({
            ...stepData,
            pickupTimestamp: new Date().toISOString(),
          })
        }
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        📍 Timestamp Pickup Completion
      </button>
      {stepData.pickupTimestamp && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669' }}>
          ✅ Pickup completed at:{' '}
          {new Date(stepData.pickupTimestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function DeliveryCompletion({ load, stepData, setStepData }: any) {
  return (
    <div>
      <p>Complete delivery with photos, signature, and receiver information:</p>
    </div>
  );
}

export default function WorkflowPortal() {
  return (
    <div>
      <h1>Workflow Portal</h1>
    </div>
  );
}
