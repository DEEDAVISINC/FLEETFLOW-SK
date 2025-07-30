'use client';

import { useState, useEffect } from 'react';

interface ClearinghouseRecord {
  recordId: string;
  type: 'violation' | 'return_to_duty' | 'follow_up' | 'negative_return';
  substanceType: string;
  testType: string;
  date: string;
  employer: string;
  status: 'pending' | 'resolved' | 'active';
  details: string;
}

interface DriverClearinghouseData {
  driverId: string;
  licenseNumber: string;
  firstName: string;
  lastName: string;
  clearinghouseStatus: 'clear' | 'prohibited' | 'pending_info' | 'not_enrolled';
  enrollmentDate: string | null;
  lastQueryDate: string;
  prohibitionsActive: number;
  violationsResolved: number;
  records: ClearinghouseRecord[];
  consentStatus: 'active' | 'expired' | 'revoked' | 'pending';
  consentExpiryDate: string | null;
}

interface ClearinghouseStatusProps {
  driverId?: string;
  licenseNumber?: string;
  onRefresh?: () => void;
}

export default function ClearinghouseStatus({ 
  driverId, 
  licenseNumber, 
  onRefresh 
}: ClearinghouseStatusProps) {
  const [data, setData] = useState<DriverClearinghouseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockData: DriverClearinghouseData = {
    driverId: driverId || "DRV-001",
    licenseNumber: licenseNumber || "WA123456789",
    firstName: "John",
    lastName: "Driver",
    clearinghouseStatus: "clear",
    enrollmentDate: "2023-01-15",
    lastQueryDate: "2024-07-08",
    prohibitionsActive: 0,
    violationsResolved: 1,
    records: [
      {
        recordId: "CH-2023-001",
        type: "return_to_duty",
        substanceType: "Alcohol",
        testType: "Random",
        date: "2023-06-15",
        employer: "Previous Carrier Inc",
        status: "resolved",
        details: "Successfully completed SAP program and return-to-duty process"
      }
    ],
    consentStatus: "active",
    consentExpiryDate: "2025-01-15"
  };

  const fetchClearinghouseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual DOT Clearinghouse API call
      // const response = await fetch(`/api/compliance/clearinghouse?driverId=${driverId}`);
      // const result = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch Clearinghouse data');
      console.error('Clearinghouse API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driverId || licenseNumber) {
      fetchClearinghouseData();
    }
  }, [driverId, licenseNumber]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return '#10b981';
      case 'prohibited': return '#ef4444';
      case 'pending_info': return '#f59e0b';
      case 'not_enrolled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clear': return '✅';
      case 'prohibited': return '⚠️';
      case 'pending_info': return '📅';
      default: return '🛡️';
    }
  };

  const getConsentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'expired': return '#ef4444';
      case 'revoked': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'violation': return '⚠️';
      case 'return_to_duty': return '✅';
      case 'follow_up': return '🔄';
      case 'negative_return': return '❌';
      default: return '📋';
    }
  };

  const isConsentExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expDate = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiration <= 30;
  };

  const handleRefresh = () => {
    fetchClearinghouseData();
    onRefresh?.();
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '12px',
              animation: 'spin 1s linear infinite'
            }}>⏳</div>
            <div style={{ color: 'white', fontSize: '16px' }}>Loading Clearinghouse Data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ color: '#ef4444', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
            Clearinghouse Data Unavailable
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            style={{
              marginTop: '16px',
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          Select a driver to view Clearinghouse status
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>👤</span>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
            DOT Clearinghouse Status
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRefresh}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
          <a 
            href="https://clearinghouse.fmcsa.dot.gov/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '12px',
              textDecoration: 'none'
            }}
          >
            🔗 Portal
          </a>
        </div>
      </div>

      {/* Driver Info */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
            {data.firstName} {data.lastName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{getStatusIcon(data.clearinghouseStatus)}</span>
            <span style={{ 
              color: getStatusColor(data.clearinghouseStatus), 
              fontSize: '12px', 
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {data.clearinghouseStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
          CDL: {data.licenseNumber} | ID: {data.driverId}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '16px', 
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
            {data.prohibitionsActive}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Active Prohibitions
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
            {data.violationsResolved}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Resolved Cases
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
            {data.records.length}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Total Records
          </div>
        </div>
      </div>

      {/* Consent Status */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontWeight: '600', 
          fontSize: '14px',
          marginBottom: '8px' 
        }}>
          Consent Status
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              color: getConsentStatusColor(data.consentStatus),
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {data.consentStatus}
            </span>
            {data.consentExpiryDate && (
              <span style={{
                fontSize: '12px',
                color: isConsentExpiringSoon(data.consentExpiryDate) ? '#ef4444' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: isConsentExpiringSoon(data.consentExpiryDate) ? '600' : 'normal'
              }}>
                Expires: {new Date(data.consentExpiryDate).toLocaleDateString()}
                {isConsentExpiringSoon(data.consentExpiryDate) && ' ⚠️'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Info */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '16px',
        fontSize: '14px'
      }}>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', marginBottom: '4px' }}>
            Enrollment Date
          </div>
          <div style={{ color: 'white' }}>
            {data.enrollmentDate 
              ? new Date(data.enrollmentDate).toLocaleDateString()
              : 'Not enrolled'
            }
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', marginBottom: '4px' }}>
            Last Query
          </div>
          <div style={{ color: 'white' }}>
            {new Date(data.lastQueryDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Records */}
      {data.records.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: '600', 
            fontSize: '14px',
            marginBottom: '8px' 
          }}>
            Recent Records
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {data.records.map((record) => (
              <div key={record.recordId} style={{
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '8px',
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{getRecordTypeIcon(record.type)}</span>
                    <span style={{ color: 'white', fontWeight: '600', textTransform: 'capitalize' }}>
                      {record.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span style={{ 
                    color: record.status === 'resolved' ? '#10b981' : record.status === 'active' ? '#ef4444' : '#f59e0b',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {record.status}
                  </span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                  <strong>Test:</strong> {record.testType} - {record.substanceType}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                  <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                  <strong>Employer:</strong> {record.employer}
                </div>
                {record.details && (
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Details:</strong> {record.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Actions */}
      {data.clearinghouseStatus === 'prohibited' && (
        <div style={{
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
            <span>⚠️</span>
            Action Required
          </div>
          <div style={{ color: '#fecaca', fontSize: '12px' }}>
            Driver is currently prohibited from operating CMVs. Complete SAP program and return-to-duty process required.
          </div>
        </div>
      )}

      {isConsentExpiringSoon(data.consentExpiryDate) && (
        <div style={{
          padding: '12px',
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
            <span>📅</span>
            Consent Expiring Soon
          </div>
          <div style={{ color: '#fde68a', fontSize: '12px' }}>
            Driver consent expires in less than 30 days. Renewal required to continue queries.
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div style={{ 
        color: 'rgba(255, 255, 255, 0.6)', 
        fontSize: '12px', 
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        Last queried: {new Date(data.lastQueryDate).toLocaleString()}
      </div>
    </div>
  );
}
