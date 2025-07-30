// 🔄 Workflow Step Modal Component
// Handles individual workflow step completion with document upload and validation

'use client';

import React, { useState } from 'react';

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
}

interface WorkflowStepModalProps {
  stepId: string;
  load: Load;
  onComplete: (data: any) => void;
  onCancel: () => void;
  uploadDocument: (file: File, stepId: string) => Promise<any>;
  isUploading: boolean;
}

const WorkflowStepModal: React.FC<WorkflowStepModalProps> = ({
  stepId,
  load,
  onComplete,
  onCancel,
  uploadDocument,
  isUploading
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [signature, setSignature] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const getStepConfig = (stepId: string) => {
    const configs = {
      'load_assignment_confirmation': {
        title: '✅ Confirm Load Assignment',
        description: 'Review and confirm receipt of this load assignment',
        fields: [
          { key: 'confirmed', label: 'I confirm receipt and acceptance of this load', type: 'checkbox', required: true },
          { key: 'rateAccepted', label: 'I accept the rate of $' + load.rate.toLocaleString(), type: 'checkbox', required: true }
        ],
        requiresSignature: true,
        requiresPhotos: false,
        allowNotes: true
      },
      'rate_confirmation_review': {
        title: '📋 Rate Confirmation Review',
        description: 'Review the rate confirmation document provided by dispatch',
        fields: [
          { key: 'documentReviewed', label: 'I have reviewed the rate confirmation document', type: 'checkbox', required: true },
          { key: 'rateMatches', label: 'The rate matches what was agreed upon', type: 'checkbox', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: false,
        allowNotes: true
      },
      'rate_confirmation_verification': {
        title: '✍️ Rate Confirmation Verification',
        description: 'Verify and sign the rate confirmation details',
        fields: [
          { key: 'detailsVerified', label: 'All details are correct and verified', type: 'checkbox', required: true },
          { key: 'readyToProceed', label: 'Ready to proceed with pickup', type: 'checkbox', required: true }
        ],
        requiresSignature: true,
        requiresPhotos: false,
        allowNotes: true
      },
      'bol_receipt_confirmation': {
        title: '📄 Bill of Lading Receipt',
        description: 'Confirm receipt of Bill of Lading from dispatcher',
        fields: [
          { key: 'bolReceived', label: 'Bill of Lading received from dispatcher', type: 'checkbox', required: true },
          { key: 'bolReadable', label: 'BOL is clear and readable', type: 'checkbox', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: true,
        allowNotes: true
      },
      'bol_verification': {
        title: '🔍 Bill of Lading Verification',
        description: 'Verify BOL details match load information',
        fields: [
          { key: 'detailsMatch', label: 'BOL details match load information', type: 'checkbox', required: true },
          { key: 'pickupInfoCorrect', label: 'Pickup information is correct', type: 'checkbox', required: true },
          { key: 'deliveryInfoCorrect', label: 'Delivery information is correct', type: 'checkbox', required: true }
        ],
        requiresSignature: true,
        requiresPhotos: false,
        allowNotes: true
      },
      'pickup_authorization': {
        title: '🚥 Pickup Authorization',
        description: 'Receive green light to proceed to pickup location',
        fields: [
          { key: 'routePlanned', label: 'Route to pickup location planned', type: 'checkbox', required: true },
          { key: 'readyToDepart', label: 'Ready to depart for pickup', type: 'checkbox', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: false,
        allowNotes: true
      },
      'pickup_arrival': {
        title: '📍 Pickup Arrival',
        description: 'Confirm arrival at pickup location',
        fields: [
          { key: 'arrivedOnTime', label: 'Arrived at pickup location', type: 'checkbox', required: true },
          { key: 'locationCorrect', label: 'Location matches BOL address', type: 'checkbox', required: true },
          { key: 'arrivalTime', label: 'Arrival Time', type: 'time', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: true,
        allowNotes: true
      },
      'pickup_completion': {
        title: '📦 Pickup Completion',
        description: 'Complete loading and document pickup process',
        fields: [
          { key: 'loadingComplete', label: 'Loading completed successfully', type: 'checkbox', required: true },
          { key: 'weightVerified', label: 'Weight verified and documented', type: 'checkbox', required: true },
          { key: 'sealNumber', label: 'Seal Number', type: 'text', required: true },
          { key: 'completionTime', label: 'Completion Time', type: 'time', required: true }
        ],
        requiresSignature: true,
        requiresPhotos: true,
        allowNotes: true
      },
      'transit_start': {
        title: '🚛 Transit Start',
        description: 'Begin transit to delivery location',
        fields: [
          { key: 'departureTime', label: 'Departure Time', type: 'time', required: true },
          { key: 'routeConfirmed', label: 'Route to delivery confirmed', type: 'checkbox', required: true },
          { key: 'eldUpdated', label: 'ELD status updated', type: 'checkbox', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: false,
        allowNotes: true
      },
      'delivery_arrival': {
        title: '🏢 Delivery Arrival',
        description: 'Confirm arrival at delivery location',
        fields: [
          { key: 'arrivedAtDelivery', label: 'Arrived at delivery location', type: 'checkbox', required: true },
          { key: 'receiverContacted', label: 'Receiver contacted for unloading', type: 'checkbox', required: true },
          { key: 'deliveryArrivalTime', label: 'Arrival Time', type: 'time', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: true,
        allowNotes: true
      },
      'delivery_completion': {
        title: '✍️ Delivery Completion',
        description: 'Complete delivery with receiver signature and documentation',
        fields: [
          { key: 'unloadingComplete', label: 'Unloading completed successfully', type: 'checkbox', required: true },
          { key: 'receiverName', label: 'Receiver Name', type: 'text', required: true },
          { key: 'receiverTitle', label: 'Receiver Title/Position', type: 'text', required: false },
          { key: 'deliveryTime', label: 'Delivery Completion Time', type: 'time', required: true }
        ],
        requiresSignature: true,
        requiresPhotos: true,
        allowNotes: true
      },
      'pod_submission': {
        title: '📋 Proof of Delivery Submission',
        description: 'Submit complete delivery documentation',
        fields: [
          { key: 'allPhotosUploaded', label: 'All required photos uploaded', type: 'checkbox', required: true },
          { key: 'signatureObtained', label: 'Receiver signature obtained', type: 'checkbox', required: true },
          { key: 'documentationComplete', label: 'All documentation complete', type: 'checkbox', required: true }
        ],
        requiresSignature: false,
        requiresPhotos: false,
        allowNotes: true
      }
    };

    return configs[stepId as keyof typeof configs] || {
      title: 'Unknown Step',
      description: 'Complete this workflow step',
      fields: [],
      requiresSignature: false,
      requiresPhotos: false,
      allowNotes: true
    };
  };

  const config = getStepConfig(stepId);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(file => uploadDocument(file, stepId));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(result => result.secureUrl);
      setUploadedFiles(prev => [...prev, ...newUrls]);
    } catch (error) {
      alert('Error uploading files. Please try again.');
    }
  };

  const isFormValid = () => {
    // Check required fields
    for (const field of config.fields) {
      if (field.required && !formData[field.key]) {
        return false;
      }
    }

    // Check signature if required
    if (config.requiresSignature && !signature) {
      return false;
    }

    // Check photos if required
    if (config.requiresPhotos && uploadedFiles.length === 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert('Please complete all required fields before proceeding.');
      return;
    }

    const completionData = {
      ...formData,
      signature: signature || undefined,
      uploadedFiles,
      notes: notes || undefined,
      completedAt: new Date().toISOString(),
      stepId
    };

    onComplete(completionData);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          {config.title}
        </h3>
        <button 
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <p style={{ margin: 0, color: '#374151' }}>{config.description}</p>
      </div>

      {/* Load Context */}
      <div style={{
        background: '#f9fafb',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Load Context
        </h4>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          <strong>Load:</strong> {load.id} | <strong>Route:</strong> {load.origin} → {load.destination}
        </div>
      </div>

      {/* Form Fields */}
      <div style={{ marginBottom: '24px' }}>
        {config.fields.map((field) => (
          <div key={field.key} style={{ marginBottom: '16px' }}>
            {field.type === 'checkbox' ? (
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData[field.key] || false}
                  onChange={(e) => handleInputChange(field.key, e.target.checked)}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </span>
              </label>
            ) : (
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo Upload */}
      {config.requiresPhotos && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            📸 Required Photos/Documents <span style={{ color: '#ef4444' }}>*</span>
          </h4>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            style={{ marginBottom: '12px' }}
          />
          {uploadedFiles.length > 0 && (
            <div style={{ fontSize: '12px', color: '#059669' }}>
              ✅ {uploadedFiles.length} file(s) uploaded successfully
            </div>
          )}
          {isUploading && (
            <div style={{ fontSize: '12px', color: '#3b82f6' }}>
              📤 Uploading files...
            </div>
          )}
        </div>
      )}

      {/* Signature */}
      {config.requiresSignature && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            ✍️ Digital Signature <span style={{ color: '#ef4444' }}>*</span>
          </h4>
          <input
            type="text"
            placeholder="Type your full name as digital signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'cursive'
            }}
          />
        </div>
      )}

      {/* Notes */}
      {config.allowNotes && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            📝 Additional Notes (Optional)
          </h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or comments..."
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
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(156, 163, 175, 0.2)',
            color: '#374151',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid() || isUploading}
          style={{
            background: isFormValid() && !isUploading 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : '#d1d5db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isFormValid() && !isUploading ? 'pointer' : 'not-allowed',
            opacity: isFormValid() && !isUploading ? 1 : 0.6
          }}
        >
          {isUploading ? '⏳ Processing...' : '✅ Complete Step'}
        </button>
      </div>
    </div>
  );
};

export default WorkflowStepModal;
