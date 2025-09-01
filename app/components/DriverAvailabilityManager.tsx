'use client';

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Save,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

interface DriverAvailabilityWindow {
  driverId: string;
  driverName: string;
  availableFrom: string;
  availableTo: string;
  preferredRegions: string[];
  maxWeeklyHours: number;
  homeBase: string;
  currentLocation?: string;
  restRequiredUntil?: string;
  weeklyHoursUsed: number;
  preferences: {
    preferLongHaul: boolean;
    preferLocalDelivery: boolean;
    avoidNightDriving: boolean;
    preferWeekends: boolean;
    maxDaysOut: number;
  };
}

interface AvailabilityManagerProps {
  driverId: string;
  driverName: string;
  onAvailabilityUpdate: (availability: DriverAvailabilityWindow) => void;
}

export default function DriverAvailabilityManager({
  driverId,
  driverName,
  onAvailabilityUpdate,
}: AvailabilityManagerProps) {
  const [availability, setAvailability] = useState<DriverAvailabilityWindow>({
    driverId,
    driverName,
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 30 days out
    preferredRegions: [],
    maxWeeklyHours: 60, // Default HOS limit
    homeBase: '',
    weeklyHoursUsed: 0,
    preferences: {
      preferLongHaul: false,
      preferLocalDelivery: false,
      avoidNightDriving: false,
      preferWeekends: false,
      maxDaysOut: 7,
    },
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  const regions = [
    'Northeast',
    'Southeast',
    'Midwest',
    'Southwest',
    'West Coast',
    'Mountain West',
    'Great Plains',
    'Gulf Coast',
    'Great Lakes',
  ];

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onAvailabilityUpdate(availability);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updatePreference = (
    key: keyof typeof availability.preferences,
    value: boolean | number
  ) => {
    setAvailability((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const toggleRegion = (region: string) => {
    setAvailability((prev) => ({
      ...prev,
      preferredRegions: prev.preferredRegions.includes(region)
        ? prev.preferredRegions.filter((r) => r !== region)
        : [...prev.preferredRegions, region],
    }));
  };

  const calculateAvailableDays = () => {
    const start = new Date(availability.availableFrom);
    const end = new Date(availability.availableTo);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return '#f59e0b';
      case 'saved':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={24} style={{ color: '#3b82f6' }} />
          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
            }}
          >
            Set Your Availability
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saveStatus === 'saving' && (
            <Clock size={16} style={{ color: getStatusColor() }} />
          )}
          {saveStatus === 'saved' && (
            <CheckCircle size={16} style={{ color: getStatusColor() }} />
          )}
          {saveStatus === 'error' && (
            <AlertCircle size={16} style={{ color: getStatusColor() }} />
          )}
          <span
            style={{
              fontSize: '14px',
              color: getStatusColor(),
              fontWeight: '500',
            }}
          >
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved!'}
            {saveStatus === 'error' && 'Error saving'}
            {saveStatus === 'idle' &&
              `${calculateAvailableDays()} days scheduled`}
          </span>
        </div>
      </div>

      {/* Basic Availability */}
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          📅 Availability Period
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Available From
            </label>
            <input
              type='date'
              value={availability.availableFrom}
              onChange={(e) =>
                setAvailability((prev) => ({
                  ...prev,
                  availableFrom: e.target.value,
                }))
              }
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Available Until
            </label>
            <input
              type='date'
              value={availability.availableTo}
              onChange={(e) =>
                setAvailability((prev) => ({
                  ...prev,
                  availableTo: e.target.value,
                }))
              }
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Max Weekly Hours
            </label>
            <input
              type='number'
              min='40'
              max='70'
              value={availability.maxWeeklyHours}
              onChange={(e) =>
                setAvailability((prev) => ({
                  ...prev,
                  maxWeeklyHours: parseInt(e.target.value),
                }))
              }
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Home Base
            </label>
            <input
              type='text'
              placeholder='City, State'
              value={availability.homeBase}
              onChange={(e) =>
                setAvailability((prev) => ({
                  ...prev,
                  homeBase: e.target.value,
                }))
              }
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Load Preferences */}
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          🚛 Load Preferences
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={availability.preferences.preferLongHaul}
              onChange={(e) =>
                updatePreference('preferLongHaul', e.target.checked)
              }
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Prefer Long Haul (500+ miles)
            </span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={availability.preferences.preferLocalDelivery}
              onChange={(e) =>
                updatePreference('preferLocalDelivery', e.target.checked)
              }
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Prefer Local Delivery (250 miles)
            </span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={availability.preferences.avoidNightDriving}
              onChange={(e) =>
                updatePreference('avoidNightDriving', e.target.checked)
              }
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Avoid Night Driving
            </span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={availability.preferences.preferWeekends}
              onChange={(e) =>
                updatePreference('preferWeekends', e.target.checked)
              }
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Available Weekends
            </span>
          </label>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px',
            }}
          >
            Max Days Away from Home
          </label>
          <input
            type='range'
            min='1'
            max='14'
            value={availability.preferences.maxDaysOut}
            onChange={(e) =>
              updatePreference('maxDaysOut', parseInt(e.target.value))
            }
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
            }}
          >
            <span>1 day</span>
            <span style={{ fontWeight: '600', color: '#3b82f6' }}>
              {availability.preferences.maxDaysOut} days
            </span>
            <span>14 days</span>
          </div>
        </div>
      </div>

      {/* Preferred Regions */}
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          🗺️ Preferred Regions
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: availability.preferredRegions.includes(region)
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'white',
                color: availability.preferredRegions.includes(region)
                  ? 'white'
                  : '#374151',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {region}
            </button>
          ))}
        </div>

        <div
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px',
          }}
        >
          {availability.preferredRegions.length === 0
            ? 'No regional preferences (available nationwide)'
            : `Selected: ${availability.preferredRegions.join(', ')}`}
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: showAdvanced ? '16px' : '24px',
        }}
      >
        <Settings size={16} />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <h5
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            ⚙️ Advanced Scheduling Options
          </h5>

          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            <p>• Automatic load consolidation optimization</p>
            <p>• HOS compliance monitoring and alerts</p>
            <p>• Revenue per mile optimization</p>
            <p>• Multi-stop route planning</p>
            <p>• Real-time capacity utilization tracking</p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          onClick={() =>
            setAvailability({
              ...availability,
              availableFrom: new Date().toISOString().split('T')[0],
              availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              preferredRegions: [],
              preferences: {
                preferLongHaul: false,
                preferLocalDelivery: false,
                avoidNightDriving: false,
                preferWeekends: false,
                maxDaysOut: 7,
              },
            })
          }
          style={{
            padding: '10px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            background: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Reset to Defaults
        </button>

        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            background:
              saveStatus === 'saving'
                ? 'rgba(59, 130, 246, 0.5)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Save size={16} />
          {saveStatus === 'saving' ? 'Saving...' : 'Save Availability'}
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#065f46',
        }}
      >
        <strong>Summary:</strong> Available for {calculateAvailableDays()} days,
        up to {availability.maxWeeklyHours} hours/week, max{' '}
        {availability.preferences.maxDaysOut} days away from{' '}
        {availability.homeBase || 'home base'}.
        {availability.preferredRegions.length > 0 &&
          ` Preferred regions: ${availability.preferredRegions.join(', ')}.`}
      </div>
    </div>
  );
}






















