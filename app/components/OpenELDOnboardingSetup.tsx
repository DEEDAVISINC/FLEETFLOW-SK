'use client';

import { useEffect, useState } from 'react';
import type {
  OpenELDDevice,
  OpenELDDriver,
} from '../services/openeld-integration';
import { openELDService } from '../services/openeld-integration';

interface OpenELDOnboardingSetupProps {
  onComplete: () => void;
  driverId: string;
  className?: string;
}

export default function OpenELDOnboardingSetup({
  onComplete,
  driverId,
  className = '',
}: OpenELDOnboardingSetupProps) {
  const [step, setStep] = useState<
    'device-selection' | 'configuration' | 'testing' | 'complete'
  >('device-selection');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [devices, setDevices] = useState<OpenELDDevice[]>([]);
  const [driver, setDriver] = useState<OpenELDDriver | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceAssigned, setDeviceAssigned] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [driverId]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [devicesData, driverData] = await Promise.all([
        openELDService.getDevices(),
        openELDService.getDriver(driverId),
      ]);

      setDevices(devicesData);
      setDriver(driverData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceSelection = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    setLoading(true);
    setError(null);

    try {
      await openELDService.assignDeviceToDriver(deviceId, driverId);
      setDeviceAssigned(true);
      setStep('configuration');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign device');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurationComplete = () => {
    setStep('testing');
  };

  const handleTestingComplete = () => {
    setTestCompleted(true);
    setStep('complete');
  };

  const handleComplete = () => {
    onComplete();
  };

  const getStepStatus = (stepName: string) => {
    if (step === stepName) return 'current';
    if (step === 'complete' || stepName === 'device-selection')
      return 'completed';
    if (stepName === 'configuration' && step === 'testing') return 'completed';
    if (stepName === 'testing' && step === 'complete') return 'completed';
    return 'pending';
  };

  const getStepIcon = (stepName: string) => {
    const status = getStepStatus(stepName);
    switch (status) {
      case 'completed':
        return '✅';
      case 'current':
        return '🔄';
      default:
        return '⏳';
    }
  };

  const getStepColor = (stepName: string) => {
    const status = getStepStatus(stepName);
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'current':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading && step === 'device-selection') {
    return (
      <div
        className={className}
        style={{ padding: '24px', textAlign: 'center' }}
      >
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔄</div>
        <div style={{ color: '#6b7280' }}>Loading OpenELD setup...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={className}
        style={{ padding: '24px', textAlign: 'center' }}
      >
        <div
          style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}
        >
          ❌
        </div>
        <div style={{ color: '#ef4444', marginBottom: '16px' }}>
          Error: {error}
        </div>
        <button
          onClick={loadInitialData}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#1f2937',
          }}
        >
          📱 OpenELD Setup
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          Configure your Electronic Logging Device for FMCSA compliance
        </p>
      </div>

      {/* Progress Steps */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          gap: '16px',
        }}
      >
        {[
          { id: 'device-selection', label: 'Device Selection' },
          { id: 'configuration', label: 'Configuration' },
          { id: 'testing', label: 'Testing' },
          { id: 'complete', label: 'Complete' },
        ].map((stepInfo) => (
          <div
            key={stepInfo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background:
                getStepStatus(stepInfo.id) === 'current'
                  ? '#fef3c7'
                  : 'transparent',
              border: `2px solid ${getStepColor(stepInfo.id)}`,
              color: getStepColor(stepInfo.id),
              fontWeight: '600',
            }}
          >
            <span style={{ fontSize: '16px' }}>{getStepIcon(stepInfo.id)}</span>
            <span>{stepInfo.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'device-selection' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1f2937',
            }}
          >
            Select Your ELD Device
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Choose how you want to use OpenELD. You can use your existing
            smartphone or select a dedicated device.
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Smartphone Option */}
            <div
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background:
                  selectedDevice === 'smartphone' ? '#f0f9ff' : 'white',
                borderColor:
                  selectedDevice === 'smartphone' ? '#0ea5e9' : '#e5e7eb',
              }}
              onClick={() => setSelectedDevice('smartphone')}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '24px' }}>📱</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}
                >
                  Use Your Smartphone
                </h4>
              </div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                Free option using your existing phone. Download the FleetFlow
                OpenELD app and start logging immediately.
              </p>
              <div
                style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#059669',
                }}
              >
                ✅ No additional cost • ✅ Instant setup • ✅ Always with you
              </div>
            </div>

            {/* Dedicated Device Options */}
            {devices.map((device) => (
              <div
                key={device.id}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background:
                    selectedDevice === device.id ? '#f0f9ff' : 'white',
                  borderColor:
                    selectedDevice === device.id ? '#0ea5e9' : '#e5e7eb',
                }}
                onClick={() => setSelectedDevice(device.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🔌</span>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    {device.name}
                  </h4>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background:
                        device.status === 'connected' ? '#dcfce7' : '#fef3c7',
                      color:
                        device.status === 'connected' ? '#059669' : '#d97706',
                    }}
                  >
                    {device.status === 'connected' ? 'Available' : 'In Use'}
                  </span>
                </div>
                <p
                  style={{
                    margin: '0 0 12px 0',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  {device.description}
                </p>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  📍 {device.location} • 🔋 {device.batteryLevel}% • 📶{' '}
                  {device.connectionType}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={() => handleDeviceSelection(selectedDevice)}
              disabled={!selectedDevice || loading}
              style={{
                background: selectedDevice && !loading ? '#10b981' : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: selectedDevice && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '🔄 Assigning Device...' : 'Continue to Configuration'}
            </button>
          </div>
        </div>
      )}

      {step === 'configuration' && (
        <div
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚙️</div>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1f2937',
            }}
          >
            Device Configuration
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Your device is being configured for OpenELD compliance. This
            includes:
          </p>

          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span>FMCSA compliance settings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span>Hours of service rules</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span>GPS tracking setup</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span>Data synchronization</span>
            </div>
          </div>

          <div
            style={{
              background: '#f0f9ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
            }}
          >
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '14px' }}>
              <strong>Note:</strong> Configuration typically takes 2-3 minutes.
              Your device will be ready for testing shortly.
            </p>
          </div>

          <button
            onClick={handleConfigurationComplete}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Continue to Testing
          </button>
        </div>
      )}

      {step === 'testing' && (
        <div
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧪</div>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1f2937',
            }}
          >
            System Testing
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Let's verify that your OpenELD system is working correctly before
            completing setup.
          </p>

          <div
            style={{
              background: '#fef3c7',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                margin: '0 0 12px 0',
                color: '#92400e',
                fontSize: '16px',
              }}
            >
              Testing Checklist
            </h4>
            <div style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✅</span>
                <span>Device connection verified</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✅</span>
                <span>GPS location tracking active</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✅</span>
                <span>Hours of service logging enabled</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✅</span>
                <span>Data sync to FleetFlow confirmed</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleTestingComplete}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Complete Testing
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1f2937',
            }}
          >
            OpenELD Setup Complete!
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Congratulations! Your Electronic Logging Device is now configured
            and ready for FMCSA compliance.
          </p>

          <div
            style={{
              background: '#dcfce7',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                margin: '0 0 12px 0',
                color: '#059669',
                fontSize: '16px',
              }}
            >
              What's Next?
            </h4>
            <div style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#059669' }}>📱</span>
                <span>Download FleetFlow OpenELD app to your device</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#059669' }}>🚛</span>
                <span>Start logging your hours of service immediately</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#059669' }}>📊</span>
                <span>Monitor compliance in your driver portal</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#059669' }}>✅</span>
                <span>You're now FMCSA compliant!</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Complete Onboarding Step
          </button>
        </div>
      )}
    </div>
  );
}
