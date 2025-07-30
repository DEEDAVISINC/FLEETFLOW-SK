'use client';

import { useState, useEffect } from 'react';

interface LIInsuranceData {
  businessName: string;
  ubiNumber: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  coverageType: string;
  policyNumber: string;
  effectiveDate: string;
  expirationDate: string;
  premiumPaid: boolean;
  lastUpdated: string;
  violations: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    status: 'open' | 'resolved' | 'pending';
  }>;
}

interface LIInsuranceCardProps {
  ubiNumber?: string;
  onRefresh?: () => void;
}

export default function LIInsuranceCard({ ubiNumber, onRefresh }: LIInsuranceCardProps) {
  const [data, setData] = useState<LIInsuranceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockData: LIInsuranceData = {
    businessName: "FleetFlow Transportation LLC",
    ubiNumber: ubiNumber || "603-123-456",
    status: "active",
    coverageType: "Workers' Compensation",
    policyNumber: "WC-2024-789456",
    effectiveDate: "2024-01-01",
    expirationDate: "2024-12-31",
    premiumPaid: true,
    lastUpdated: "2024-07-08",
    violations: [
      {
        id: "LI-001",
        type: "Premium Payment",
        description: "Late premium payment for Q2 2024",
        date: "2024-06-15",
        status: "resolved"
      }
    ]
  };

  const fetchLIData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual L&I API call or scraping service
      // const response = await fetch(`/api/compliance/li-insurance?ubi=${ubiNumber}`);
      // const result = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch L&I insurance data');
      console.error('L&I API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLIData();
  }, [ubiNumber]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'suspended': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'suspended': return '⚠️';
      case 'pending': return '⏳';
      default: return '🛡️';
    }
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiration <= 30;
  };

  const handleRefresh = () => {
    fetchLIData();
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '12px',
              animation: 'spin 1s linear infinite'
            }}>⏳</div>
            <div style={{ color: 'white', fontSize: '16px' }}>Loading L&I Data...</div>
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
            L&I Data Unavailable
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
          No L&I insurance data available
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
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
            L&I Insurance Status
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
            href="https://secure.lni.wa.gov/verify/" 
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
            🔗 Verify
          </a>
        </div>
      </div>

      {/* Business Info */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
            {data.businessName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{getStatusIcon(data.status)}</span>
            <span style={{ 
              color: getStatusColor(data.status), 
              fontSize: '12px', 
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {data.status}
            </span>
          </div>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
          UBI: {data.ubiNumber} | Policy: {data.policyNumber}
        </div>
      </div>

      {/* Coverage Details */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '16px',
        fontSize: '14px'
      }}>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', marginBottom: '4px' }}>
            Coverage Type
          </div>
          <div style={{ color: 'white' }}>{data.coverageType}</div>
        </div>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', marginBottom: '4px' }}>
            Premium Status
          </div>
          <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{data.premiumPaid ? '✅' : '⚠️'}</span>
            {data.premiumPaid ? 'Paid' : 'Outstanding'}
          </div>
        </div>
      </div>

      {/* Policy Dates */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '16px',
        fontSize: '14px'
      }}>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', marginBottom: '4px' }}>
            Effective Date
          </div>
          <div style={{ color: 'white' }}>
            {new Date(data.effectiveDate).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', marginBottom: '4px' }}>
            Expiration Date
          </div>
          <div style={{ 
            color: isExpiringSoon(data.expirationDate) ? '#ef4444' : 'white',
            fontWeight: isExpiringSoon(data.expirationDate) ? '600' : 'normal'
          }}>
            {new Date(data.expirationDate).toLocaleDateString()}
            {isExpiringSoon(data.expirationDate) && <span style={{ marginLeft: '4px' }}>⚠️</span>}
          </div>
        </div>
      </div>

      {/* Violations */}
      {data.violations.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontWeight: '600', 
            fontSize: '14px',
            marginBottom: '8px' 
          }}>
            Recent Violations
          </div>
          <div>
            {data.violations.slice(0, 3).map((violation) => (
              <div key={violation.id} style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'white', fontWeight: '600' }}>{violation.type}</span>
                  <span style={{ 
                    color: violation.status === 'resolved' ? '#10b981' : violation.status === 'open' ? '#ef4444' : '#f59e0b',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {violation.status}
                  </span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                  {violation.description}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {new Date(violation.date).toLocaleDateString()}
                </div>
              </div>
            ))}
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
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
