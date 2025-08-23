/**
 * CRM Phone Integration Status Widget
 * Shows integration status and quick stats for phone-CRM connection
 */

'use client';

import { useEffect, useState } from 'react';
import { crmPhoneIntegrationService } from '../services/CRMPhoneIntegrationService';

interface CRMIntegrationStats {
  totalCalls: number;
  connectedCalls: number;
  newContacts: number;
  opportunities: number;
  followUpsRequired: number;
}

export default function CRMPhoneIntegrationWidget() {
  const [stats, setStats] = useState<CRMIntegrationStats | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadStats = () => {
    try {
      const data = crmPhoneIntegrationService.getCallSummaryForCRM(timeRange);
      setStats(data);
    } catch (error) {
      console.error('Error loading CRM integration stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
          Loading CRM integration...
        </div>
      </div>
    );
  }

  const getConnectionQuality = (): {
    status: string;
    color: string;
    message: string;
  } => {
    if (!stats)
      return {
        status: 'Unknown',
        color: '#6b7280',
        message: 'Unable to determine status',
      };

    const connectedRate =
      stats.totalCalls > 0
        ? (stats.connectedCalls / stats.totalCalls) * 100
        : 0;
    const opportunityRate =
      stats.totalCalls > 0 ? (stats.opportunities / stats.totalCalls) * 100 : 0;

    if (connectedRate >= 80 && opportunityRate >= 20) {
      return {
        status: 'Excellent',
        color: '#10b981',
        message: 'Strong phone-CRM integration performance',
      };
    } else if (connectedRate >= 60 && opportunityRate >= 10) {
      return {
        status: 'Good',
        color: '#3b82f6',
        message: 'Good integration with room for improvement',
      };
    } else if (connectedRate >= 40) {
      return {
        status: 'Fair',
        color: '#f59e0b',
        message: 'Integration working but needs attention',
      };
    } else {
      return {
        status: 'Poor',
        color: '#ef4444',
        message: 'Integration issues detected',
      };
    }
  };

  const connectionQuality = getConnectionQuality();

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#60a5fa',
            }}
          >
            🔗 CRM Integration
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: connectionQuality.color,
              }}
            />
            <span style={{ color: connectionQuality.color, fontWeight: '600' }}>
              {connectionQuality.status}
            </span>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '4px 8px',
            color: 'white',
            fontSize: '12px',
          }}
        >
          <option value='24h'>24h</option>
          <option value='7d'>7d</option>
          <option value='30d'>30d</option>
        </select>
      </div>

      {stats && (
        <div>
          {/* Quick Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#60a5fa',
                }}
              >
                {stats.totalCalls}
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Total Calls
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                {stats.connectedCalls}
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Connected
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                {stats.opportunities}
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Opportunities
              </div>
            </div>

            <div
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#a855f7',
                }}
              >
                {stats.newContacts}
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                New Contacts
              </div>
            </div>
          </div>

          {/* Integration Quality Message */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
            }}
          >
            {connectionQuality.message}
          </div>

          {/* Follow-ups Alert */}
          {stats.followUpsRequired > 0 && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ color: '#fca5a5' }}>
                {stats.followUpsRequired} follow-up
                {stats.followUpsRequired > 1 ? 's' : ''} required
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



