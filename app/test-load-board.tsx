'use client';

import { useState } from 'react';
import ComplianceLoadFilter, {
  ComplianceFilterOptions,
} from '../components/ComplianceLoadFilter';

// Test page to isolate the load board section
export default function TestLoadBoard() {
  const [complianceFilter, setComplianceFilter] =
    useState<ComplianceFilterOptions>({});

  // Full load dataset
  const allLoads = [
    {
      id: 'LD-2024-001',
      origin: 'Los Angeles, CA',
      destination: 'Chicago, IL',
      rate: '$3,450',
      miles: '2,015',
      pickup: 'Jan 15',
      status: 'Available',
      statusColor: '#22c55e',
      loadBoardNumber: '100001',
      compliance: {
        safetyScore: 87,
        riskLevel: 'low',
        hasValidAuthority: true,
        hasValidInsurance: true,
        safetyRating: 'SATISFACTORY',
      },
    },
    {
      id: 'LD-2024-002',
      origin: 'Houston, TX',
      destination: 'Atlanta, GA',
      rate: '$2,180',
      miles: '789',
      pickup: 'Jan 16',
      status: 'Assigned',
      statusColor: '#3b82f6',
      loadBoardNumber: '100002',
      compliance: {
        safetyScore: 76,
        riskLevel: 'medium',
        hasValidAuthority: true,
        hasValidInsurance: true,
        safetyRating: 'CONDITIONAL',
      },
    },
    {
      id: 'LD-2024-003',
      origin: 'Phoenix, AZ',
      destination: 'Denver, CO',
      rate: '$1,950',
      miles: '602',
      pickup: 'Jan 17',
      status: 'Available',
      statusColor: '#22c55e',
      loadBoardNumber: '100003',
      compliance: {
        safetyScore: 92,
        riskLevel: 'low',
        hasValidAuthority: true,
        hasValidInsurance: true,
        safetyRating: 'SATISFACTORY',
      },
    },
    {
      id: 'LD-2024-004',
      origin: 'Miami, FL',
      destination: 'Nashville, TN',
      rate: '$1,875',
      miles: '856',
      pickup: 'Jan 18',
      status: 'Available',
      statusColor: '#22c55e',
      loadBoardNumber: '100004',
      compliance: {
        safetyScore: 65,
        riskLevel: 'medium',
        hasValidAuthority: true,
        hasValidInsurance: false,
        safetyRating: 'UNRATED',
      },
    },
    {
      id: 'LD-2024-005',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      rate: '$1,200',
      miles: '173',
      pickup: 'Jan 19',
      status: 'Available',
      statusColor: '#22c55e',
      loadBoardNumber: '100005',
      compliance: {
        safetyScore: 54,
        riskLevel: 'high',
        hasValidAuthority: false,
        hasValidInsurance: true,
        safetyRating: 'CONDITIONAL',
      },
    },
  ];

  // Filter loads based on compliance filters
  const loads = allLoads.filter((load) => {
    // Safety Score Filter
    if (
      complianceFilter.minSafetyScore !== undefined &&
      load.compliance.safetyScore < complianceFilter.minSafetyScore
    ) {
      return false;
    }

    // Risk Level Filter
    if (complianceFilter.maxRiskLevel) {
      if (
        complianceFilter.maxRiskLevel === 'low' &&
        load.compliance.riskLevel !== 'low'
      ) {
        return false;
      }
      if (
        complianceFilter.maxRiskLevel === 'medium' &&
        load.compliance.riskLevel === 'high'
      ) {
        return false;
      }
    }

    // Authority Filter
    if (
      complianceFilter.requireValidAuthority &&
      !load.compliance.hasValidAuthority
    ) {
      return false;
    }

    // Insurance Filter
    if (
      complianceFilter.requireValidInsurance &&
      !load.compliance.hasValidInsurance
    ) {
      return false;
    }

    // Rating Filters
    if (
      complianceFilter.excludeConditionalRatings &&
      load.compliance.safetyRating === 'CONDITIONAL'
    ) {
      return false;
    }

    if (
      complianceFilter.excludeUnratedCarriers &&
      load.compliance.safetyRating === 'UNRATED'
    ) {
      return false;
    }

    return true;
  });

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}
        >
          Load Board Test
        </h1>

        {/* Compliance Filter */}
        <div style={{ marginBottom: '24px' }}>
          <ComplianceLoadFilter
            onFilterChange={setComplianceFilter}
            initialFilter={{}}
            compact={true}
          />
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '10px 16px',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Showing {loads.length} of {allLoads.length} loads
            </span>
            {loads.length < allLoads.length && (
              <span>
                <span style={{ color: '#fbbf24', marginRight: '4px' }}>⚠️</span>
                Some loads hidden by compliance filters
              </span>
            )}
          </div>
        </div>

        {/* General Load Board */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            📋 Available Loads - General Load Board
          </h2>

          {/* Load Board Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr 2fr 2fr 1fr 1fr 1fr 120px',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '14px',
              color: 'white',
            }}
          >
            <div>📞 Board #</div>
            <div>Load ID</div>
            <div>Origin</div>
            <div>Destination</div>
            <div>Rate</div>
            <div>Miles</div>
            <div>Pickup</div>
            <div>Status</div>
          </div>

          {/* Dynamic Load Board Rows */}
          {loads.map((load, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr 2fr 2fr 1fr 1fr 1fr 120px',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '8px',
                color: 'white',
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontWeight: '700',
                  color: '#10b981',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '4px',
                  padding: '2px 4px',
                }}
              >
                {load.loadBoardNumber || '000000'}
              </div>
              <div style={{ fontWeight: '600' }}>{load.id}</div>
              <div>
                <div>{load.origin}</div>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    marginTop: '2px',
                  }}
                >
                  {load.compliance.riskLevel === 'low' && (
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        fontSize: '10px',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      LOW RISK
                    </span>
                  )}
                  {load.compliance.riskLevel === 'medium' && (
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#f59e0b',
                        fontSize: '10px',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      MED RISK
                    </span>
                  )}
                  {load.compliance.riskLevel === 'high' && (
                    <span
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontSize: '10px',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      HIGH RISK
                    </span>
                  )}
                  {!load.compliance.hasValidInsurance && (
                    <span
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontSize: '10px',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      NO INSURANCE
                    </span>
                  )}
                </div>
              </div>
              <div>{load.destination}</div>
              <div style={{ fontWeight: '600', color: '#10b981' }}>
                {load.rate}
              </div>
              <div>{load.miles}</div>
              <div>{load.pickup}</div>
              <div>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: load.statusColor || '#10b981',
                    color: 'white',
                  }}
                >
                  {load.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
