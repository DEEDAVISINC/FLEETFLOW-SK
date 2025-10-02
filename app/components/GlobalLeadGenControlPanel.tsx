'use client';

import { useEffect, useState } from 'react';
import { masterLeadOrchestrator } from '../services/MasterLeadGenerationOrchestrator';

/**
 * Global Lead Generation Control Panel
 *
 * Can be embedded anywhere in FleetFlow to monitor and control
 * all automated lead generation sources.
 *
 * Usage:
 * - Add to any dashboard
 * - Shows real-time status of all sources
 * - Start/stop individual sources
 * - Manual trigger buttons
 * - Schedule configuration
 */

export default function GlobalLeadGenControlPanel() {
  const [status, setStatus] = useState(
    masterLeadOrchestrator.getOverallStatus()
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Start orchestrator on mount
    masterLeadOrchestrator.startAllSources();

    // Refresh status every 5 seconds
    const interval = setInterval(() => {
      setStatus(masterLeadOrchestrator.getOverallStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRunSource = (sourceId: string) => {
    masterLeadOrchestrator.runSource(sourceId);
  };

  const handleToggleSource = (sourceId: string, enabled: boolean) => {
    if (enabled) {
      masterLeadOrchestrator.disableSource(sourceId);
    } else {
      masterLeadOrchestrator.enableSource(sourceId);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: isExpanded ? '500px' : '300px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Collapsed View */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>
                Lead Gen Orchestrator
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                {status.runningSources > 0 ? '⚡ Active' : '✅ Monitoring'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {status.enabledSources}/{status.totalSources} sources active
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {status.totalLeadsGenerated.toLocaleString()} leads generated
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            maxHeight: '600px',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
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
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🤖</span> Lead Gen Orchestrator
              </div>
              <div
                style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}
              >
                {status.totalLeadsGenerated.toLocaleString()} total leads
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'rgba(71, 85, 105, 0.5)',
                color: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Overall Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#3b82f6',
                }}
              >
                {status.enabledSources}
              </div>
              <div
                style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}
              >
                Active
              </div>
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#10b981',
                }}
              >
                {status.runningSources}
              </div>
              <div
                style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}
              >
                Running
              </div>
            </div>
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#fbbf24',
                }}
              >
                {status.totalLeadsGenerated}
              </div>
              <div
                style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}
              >
                Leads
              </div>
            </div>
          </div>

          {/* Source List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {status.sources.map((source) => (
              <div
                key={source.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${
                    source.status === 'running'
                      ? 'rgba(16, 185, 129, 0.5)'
                      : 'rgba(71, 85, 105, 0.5)'
                  }`,
                  borderRadius: '8px',
                  padding: '12px',
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
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#f1f5f9',
                        marginBottom: '2px',
                      }}
                    >
                      {source.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {source.enabled
                        ? source.status === 'running'
                          ? '⚡ Running now...'
                          : source.nextRun
                            ? `📅 Next: ${new Date(source.nextRun).toLocaleTimeString()}`
                            : '⏸ Idle'
                        : '🛑 Disabled'}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#10b981',
                    }}
                  >
                    {source.totalLeadsGenerated} leads
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '8px',
                  }}
                >
                  <button
                    onClick={() => handleRunSource(source.id)}
                    disabled={source.status === 'running' || !source.enabled}
                    style={{
                      flex: 1,
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '4px',
                      padding: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor:
                        source.status === 'running' || !source.enabled
                          ? 'not-allowed'
                          : 'pointer',
                      opacity:
                        source.status === 'running' || !source.enabled
                          ? 0.5
                          : 1,
                    }}
                  >
                    🎯 Run Now
                  </button>
                  <button
                    onClick={() =>
                      handleToggleSource(source.id, source.enabled)
                    }
                    style={{
                      flex: 1,
                      background: source.enabled
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(59, 130, 246, 0.2)',
                      color: source.enabled ? '#ef4444' : '#3b82f6',
                      border: `1px solid ${source.enabled ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      borderRadius: '4px',
                      padding: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {source.enabled ? '⏸ Pause' : '▶ Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(71, 85, 105, 0.5)',
              fontSize: '10px',
              color: '#94a3b8',
              textAlign: 'center',
            }}
          >
            100% Automated Lead Generation • Zero Manual Work
          </div>
        </div>
      )}
    </div>
  );
}
