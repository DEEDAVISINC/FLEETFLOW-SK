'use client';

import React, { useEffect, useState } from 'react';

interface InspectionItem {
  id: string;
  category: 'exterior' | 'interior' | 'mechanical' | 'safety' | 'documentation';
  item: string;
  description: string;
  required: boolean;
  status: 'pass' | 'fail' | 'na' | 'pending';
  notes?: string;
  photos?: string[];
  severity?: 'minor' | 'major' | 'critical';
  requiresPhoto: boolean;
}

interface VehicleInspection {
  id: string;
  vehicleId: string;
  vehicleVin: string;
  driverId: string;
  inspectionType:
    | 'pre_trip'
    | 'post_trip'
    | 'damage_assessment'
    | 'maintenance'
    | 'dot_inspection';
  inspectionDate: Date;
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  items: InspectionItem[];
  overallStatus: 'pass' | 'fail' | 'conditional' | 'pending';
  inspectorSignature: string;
  deficienciesFound: boolean;
  safeToOperate: boolean;
  completedAt?: Date;
}

interface VehicleInspectionChecklistProps {
  vehicleId: string;
  vehicleVin: string;
  driverId: string;
  inspectionType:
    | 'pre_trip'
    | 'post_trip'
    | 'damage_assessment'
    | 'maintenance'
    | 'dot_inspection';
  location: { address: string; coordinates?: { lat: number; lng: number } };
  onComplete?: (inspection: VehicleInspection) => void;
  onCancel?: () => void;
}

const VehicleInspectionChecklist: React.FC<VehicleInspectionChecklistProps> = ({
  vehicleId,
  vehicleVin,
  driverId,
  inspectionType,
  location,
  onComplete,
  onCancel,
}) => {
  const [inspection, setInspection] = useState<VehicleInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('exterior');
  const [signature, setSignature] = useState('');
  const [showSignature, setShowSignature] = useState(false);

  const inspectionTypeLabels = {
    pre_trip: 'Pre-Trip Inspection',
    post_trip: 'Post-Trip Inspection',
    damage_assessment: 'Damage Assessment',
    maintenance: 'Maintenance Inspection',
    dot_inspection: 'DOT Inspection',
  };

  const categoryLabels = {
    exterior: { label: 'Exterior', icon: '🚗', color: '#3b82f6' },
    interior: { label: 'Interior', icon: '🪑', color: '#f59e0b' },
    mechanical: { label: 'Mechanical', icon: '🔧', color: '#ef4444' },
    safety: { label: 'Safety', icon: '🦺', color: '#10b981' },
    documentation: { label: 'Documentation', icon: '📄', color: '#8b5cf6' },
  };

  const statusColors = {
    pass: '#10b981',
    fail: '#ef4444',
    na: '#6b7280',
    pending: '#f59e0b',
  };

  const severityColors = {
    minor: '#f59e0b',
    major: '#ef4444',
    critical: '#dc2626',
  };

  useEffect(() => {
    initializeInspection();
  }, []);

  const initializeInspection = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/vehicle-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_inspection',
          vehicleId,
          vehicleVin,
          driverId,
          inspectionType,
          location,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setInspection(data.inspection);
        console.log('✅ Inspection initialized:', data.inspection.id);
      } else {
        console.error('Failed to create inspection:', data.error);
        alert('Failed to initialize inspection');
      }
    } catch (error) {
      console.error('Error initializing inspection:', error);
      alert('Error initializing inspection');
    } finally {
      setLoading(false);
    }
  };

  const updateInspectionItem = async (
    itemId: string,
    updates: Partial<InspectionItem>
  ) => {
    if (!inspection) return;

    try {
      setSaving(true);

      const response = await fetch('/api/vehicle-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_item',
          inspectionId: inspection.id,
          itemId,
          updates,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setInspection(data.inspection);
        console.log('✅ Item updated:', itemId);
      } else {
        console.error('Failed to update item:', data.error);
        alert('Failed to update inspection item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating inspection item');
    } finally {
      setSaving(false);
    }
  };

  const completeInspection = async () => {
    if (!inspection || !signature) return;

    // Validate required items
    const incompleteRequired = inspection.items.filter(
      (item) => item.required && item.status === 'pending'
    );

    if (incompleteRequired.length > 0) {
      alert(
        `Please complete ${incompleteRequired.length} required inspection items`
      );
      return;
    }

    // Validate photo requirements
    const photoRequiredItems = inspection.items.filter(
      (item) =>
        item.requiresPhoto &&
        item.status !== 'na' &&
        (!item.photos || item.photos.length === 0)
    );

    if (photoRequiredItems.length > 0) {
      alert(
        `Please add photos for ${photoRequiredItems.length} required items`
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('/api/vehicle-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_inspection',
          inspectionId: inspection.id,
          inspectorSignature: signature,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Inspection completed:', data.inspection.overallStatus);

        if (data.alerts && data.alerts.length > 0) {
          alert(`INSPECTION ALERT:\n${data.alerts.join('\n')}`);
        }

        if (onComplete) {
          onComplete(data.inspection);
        }
      } else {
        console.error('Failed to complete inspection:', data.error);
        alert(`Failed to complete inspection: ${data.error}`);
      }
    } catch (error) {
      console.error('Error completing inspection:', error);
      alert('Error completing inspection');
    } finally {
      setSaving(false);
    }
  };

  const getProgressStats = () => {
    if (!inspection) return { completed: 0, total: 0, percentage: 0 };

    const total = inspection.items.length;
    const completed = inspection.items.filter(
      (item) => item.status !== 'pending'
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const getCategoryItems = (category: string) => {
    if (!inspection) return [];
    return inspection.items.filter((item) => item.category === category);
  };

  const getCategoryStatus = (category: string) => {
    const items = getCategoryItems(category);
    const completed = items.filter((item) => item.status !== 'pending').length;
    const failed = items.filter((item) => item.status === 'fail').length;

    if (failed > 0) return 'fail';
    if (completed === items.length) return 'pass';
    return 'pending';
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔍</div>
          <div>Initializing Inspection...</div>
        </div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          color: 'white',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h3>Failed to Initialize Inspection</h3>
        <p>Please try again or contact support.</p>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '16px',
            }}
          >
            Close
          </button>
        )}
      </div>
    );
  }

  const progress = getProgressStats();

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            {inspectionTypeLabels[inspectionType]}
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '16px' }}>
          <div>
            Vehicle: {vehicleId} • VIN: {vehicleVin}
          </div>
          <div>Location: {location.address}</div>
          <div>Status: {inspection.overallStatus.toUpperCase()}</div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span>
              Progress: {progress.completed}/{progress.total} items
            </span>
            <span>{progress.percentage}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress.percentage}%`,
                height: '100%',
                background: progress.percentage === 100 ? '#10b981' : '#f59e0b',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {Object.entries(categoryLabels).map(([category, config]) => {
          const categoryStatus = getCategoryStatus(category);
          const itemCount = getCategoryItems(category).length;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                background:
                  activeCategory === category
                    ? config.color
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                minWidth: '120px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{config.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>
                  {config.label}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  {itemCount} items
                </div>
              </div>

              {/* Status indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    statusColors[categoryStatus] || statusColors.pending,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Inspection Items */}
      <div style={{ flex: 1, overflow: 'auto', marginBottom: '24px' }}>
        {getCategoryItems(activeCategory).map((item) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}
            >
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {item.item}
                  {item.required && (
                    <span style={{ color: '#ef4444', marginLeft: '4px' }}>
                      *
                    </span>
                  )}
                </h4>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    opacity: 0.8,
                  }}
                >
                  {item.description}
                </p>
                {item.severity && (
                  <span
                    style={{
                      background: severityColors[item.severity],
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {item.severity.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Status Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                {['pass', 'fail', 'na'].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      updateInspectionItem(item.id, { status: status as any })
                    }
                    disabled={saving}
                    style={{
                      background:
                        item.status === status
                          ? statusColors[status]
                          : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      opacity: saving ? 0.5 : 1,
                    }}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <textarea
              placeholder='Add notes (optional)'
              value={item.notes || ''}
              onChange={(e) =>
                updateInspectionItem(item.id, { notes: e.target.value })
              }
              style={{
                width: '100%',
                minHeight: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                color: 'white',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />

            {/* Photo Requirements */}
            {item.requiresPhoto && item.status !== 'na' && (
              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  <span>📸</span>
                  <span>Photo required for this item</span>
                  {item.photos && item.photos.length > 0 && (
                    <span
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {item.photos.length} photo(s)
                    </span>
                  )}
                </div>
                {/* Photo upload would integrate with existing PhotoUploadComponent */}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Section */}
      {progress.percentage === 100 && !inspection.completedAt && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#10b981' }}>
            Ready to Complete Inspection
          </h4>

          {!showSignature ? (
            <button
              onClick={() => setShowSignature(true)}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Add Signature & Complete
            </button>
          ) : (
            <div>
              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                  }}
                >
                  Inspector Signature:
                </label>
                <input
                  type='text'
                  placeholder='Enter your full name'
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={completeInspection}
                  disabled={!signature || saving}
                  style={{
                    background: signature ? '#10b981' : '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: signature && !saving ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  {saving ? 'Completing...' : 'Complete Inspection'}
                </button>

                <button
                  onClick={() => setShowSignature(false)}
                  disabled={saving}
                  style={{
                    background: 'transparent',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Summary */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          fontSize: '14px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
        }}
      >
        <div>
          <span style={{ color: statusColors.pass }}>●</span> Passed:{' '}
          {inspection.items.filter((i) => i.status === 'pass').length}
        </div>
        <div>
          <span style={{ color: statusColors.fail }}>●</span> Failed:{' '}
          {inspection.items.filter((i) => i.status === 'fail').length}
        </div>
        <div>
          <span style={{ color: statusColors.na }}>●</span> N/A:{' '}
          {inspection.items.filter((i) => i.status === 'na').length}
        </div>
        <div>
          <span style={{ color: statusColors.pending }}>●</span> Pending:{' '}
          {inspection.items.filter((i) => i.status === 'pending').length}
        </div>
      </div>
    </div>
  );
};

export default VehicleInspectionChecklist;
