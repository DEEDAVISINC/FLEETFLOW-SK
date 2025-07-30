'use client';

import React, { useState, useEffect } from 'react';

interface SAFERData {
  dotNumber: string;
  legalName: string;
  dbaName?: string;
  safetyRating: 'Satisfactory' | 'Conditional' | 'Unsatisfactory' | 'Not Rated';
  safetyRatingDate?: string;
  totalDrivers: number;
  totalVehicles: number;
  mcs150Date?: string;
  mcs150Mileage?: number;
  operationClassification: string[];
  carrierOperation: string[];
  hazmatFlag: boolean;
  pcFlag: boolean;
  reviewDate?: string;
  reviewType?: string;
  crashData: {
    fatal: number;
    injury: number;
    tow: number;
    total: number;
    date: string;
  };
  inspectionData: {
    vehicleInspections: number;
    vehicleOOSRate: number;
    driverInspections: number;
    driverOOSRate: number;
    hazmatInspections: number;
    iepFlag: boolean;
    date: string;
  };
  violationData: {
    alertsViolations: number;
    seriousViolations: number;
    date: string;
  };
}

interface SAFERStatusCardProps {
  dotNumber: string;
  companyName?: string;
  onRefresh?: () => void;
}

export default function SAFERStatusCard({ dotNumber, companyName, onRefresh }: SAFERStatusCardProps) {
  const [saferData, setSaferData] = useState<SAFERData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Mock SAFER data - In production, this would call the actual SAFER API
  const mockSAFERData: SAFERData = {
    dotNumber: dotNumber || "123456",
    legalName: companyName || "FleetFlow Transportation LLC",
    dbaName: "FleetFlow Express",
    safetyRating: 'Satisfactory',
    safetyRatingDate: '2024-03-15',
    totalDrivers: 45,
    totalVehicles: 32,
    mcs150Date: '2024-12-01',
    mcs150Mileage: 2856432,
    operationClassification: ['Interstate', 'Intrastate Hazmat', 'Intrastate Non-Hazmat'],
    carrierOperation: ['General Freight', 'Household Goods', 'Metal: sheets, coils, rolls'],
    hazmatFlag: true,
    pcFlag: false,
    reviewDate: '2024-06-20',
    reviewType: 'Compliance Review',
    crashData: {
      fatal: 0,
      injury: 2,
      tow: 5,
      total: 7,
      date: '24-Month Period'
    },
    inspectionData: {
      vehicleInspections: 87,
      vehicleOOSRate: 12.6,
      driverInspections: 45,
      driverOOSRate: 8.9,
      hazmatInspections: 12,
      iepFlag: false,
      date: '24-Month Period'
    },
    violationData: {
      alertsViolations: 3,
      seriousViolations: 8,
      date: '24-Month Period'
    }
  };

  // Simulate API call to SAFER Web Service
  const fetchSAFERData = async () => {
    try {
      setLoading(true);
      
      // In production, this would be:
      // const response = await fetch(`/api/safer/${dotNumber}`);
      // const data = await response.json();
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaferData(mockSAFERData);
      setLastUpdated(new Date().toLocaleString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch SAFER data');
      console.error('SAFER API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dotNumber) {
      fetchSAFERData();
    }
  }, [dotNumber]);

  const handleRefresh = () => {
    fetchSAFERData();
    onRefresh?.();
  };

  const getSafetyRatingColor = (rating: string) => {
    switch (rating) {
      case 'Satisfactory': return '#10b981';
      case 'Conditional': return '#f59e0b';
      case 'Unsatisfactory': return '#ef4444';
      case 'Not Rated': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getSafetyRatingIcon = (rating: string) => {
    switch (rating) {
      case 'Satisfactory': return '✅';
      case 'Conditional': return '⚠️';
      case 'Unsatisfactory': return '❌';
      case 'Not Rated': return '❓';
      default: return '❓';
    }
  };

  const getOOSRateColor = (rate: number) => {
    if (rate <= 10) return '#10b981';
    if (rate <= 20) return '#f59e0b';
    return '#ef4444';
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
            <div style={{ color: 'white', fontSize: '16px' }}>Loading SAFER Data...</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '8px' }}>
              Fetching DOT compliance information
            </div>
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
            SAFER Data Unavailable
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

  if (!saferData) return null;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
          </div>
          <div>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>
              SAFER DOT Compliance Status
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
              DOT #{saferData.dotNumber} • {saferData.legalName}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Last Updated</div>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{lastUpdated}</div>
        </div>
      </div>

      {/* Safety Rating */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: `2px solid ${getSafetyRatingColor(saferData.safetyRating)}30`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{getSafetyRatingIcon(saferData.safetyRating)}</span>
            <div>
              <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                Safety Rating: {saferData.safetyRating}
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                {saferData.safetyRatingDate ? `Rated: ${new Date(saferData.safetyRatingDate).toLocaleDateString()}` : 'No rating date available'}
              </p>
            </div>
          </div>
          <div style={{
            background: getSafetyRatingColor(saferData.safetyRating),
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {saferData.safetyRating.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Fleet Size */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Fleet Size</div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
            🚛 {saferData.totalVehicles} Vehicles
          </div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
            👥 {saferData.totalDrivers} Drivers
          </div>
        </div>

        {/* Vehicle OOS Rate */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Vehicle OOS Rate</div>
          <div style={{ 
            color: getOOSRateColor(saferData.inspectionData.vehicleOOSRate), 
            fontSize: '20px', 
            fontWeight: 'bold' 
          }}>
            {saferData.inspectionData.vehicleOOSRate}%
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            {saferData.inspectionData.vehicleInspections} inspections
          </div>
        </div>

        {/* Driver OOS Rate */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Driver OOS Rate</div>
          <div style={{ 
            color: getOOSRateColor(saferData.inspectionData.driverOOSRate), 
            fontSize: '20px', 
            fontWeight: 'bold' 
          }}>
            {saferData.inspectionData.driverOOSRate}%
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            {saferData.inspectionData.driverInspections} inspections
          </div>
        </div>

        {/* Crash Data */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>Crashes (24-Month)</div>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            {saferData.crashData.total}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            {saferData.crashData.fatal} Fatal, {saferData.crashData.injury} Injury
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Operations */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h5 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
            🚛 Operation Classification
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {saferData.operationClassification.map((classification, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {classification}
              </div>
            ))}
          </div>
        </div>

        {/* Cargo Types */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h5 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
            📦 Cargo Types
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {saferData.carrierOperation.slice(0, 3).map((cargo, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {cargo}
              </div>
            ))}
            {saferData.hazmatFlag && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#fbbf24',
                fontWeight: '600'
              }}>
                ⚠️ HAZMAT Authorized
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last MCS-150 Update */}
      {saferData.mcs150Date && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Last MCS-150 Update:</span>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
              {new Date(saferData.mcs150Date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Annual Mileage:</span>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
              {saferData.mcs150Mileage?.toLocaleString() || 'Not Reported'} miles
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
