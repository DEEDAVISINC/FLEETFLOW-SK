'use client';

import { useEffect, useState } from 'react';
import {
  ComprehensiveOptimizationResult,
  EnhancedAssignment,
  OptimizationRequest,
  aiLoadOptimizationService,
} from '../services/AILoadOptimizationService';
import { Driver, Load } from '../services/LinearProgrammingSolver';

interface AILoadOptimizationPanelProps {
  onOptimizationComplete?: (result: ComprehensiveOptimizationResult) => void;
  onAssignmentSelected?: (assignment: EnhancedAssignment) => void;
}

interface OptimizationSettings {
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  prioritizeProfit: boolean;
  prioritizeReliability: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // minutes
}

export default function AILoadOptimizationPanel({
  onOptimizationComplete,
  onAssignmentSelected,
}: AILoadOptimizationPanelProps) {
  // State management
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] =
    useState<ComprehensiveOptimizationResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'assignments' | 'analytics' | 'settings'
  >('overview');
  const [settings, setSettings] = useState<OptimizationSettings>({
    riskTolerance: 'MODERATE',
    prioritizeProfit: true,
    prioritizeReliability: true,
    autoRefresh: false,
    refreshInterval: 15,
  });
  const [mockData, setMockData] = useState({ loads: [], drivers: [] });
  const [lastOptimized, setLastOptimized] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock data
  useEffect(() => {
    setMockData(generateMockData());
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (settings.autoRefresh && settings.refreshInterval > 0) {
      const interval = setInterval(
        () => {
          if (!isOptimizing) {
            handleOptimize();
          }
        },
        settings.refreshInterval * 60 * 1000
      );

      return () => clearInterval(interval);
    }
  }, [settings.autoRefresh, settings.refreshInterval, isOptimizing]);

  /**
   * Main optimization handler
   */
  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      const request: OptimizationRequest = {
        loads: mockData.loads,
        drivers: mockData.drivers,
        riskTolerance: settings.riskTolerance,
        prioritizeProfit: settings.prioritizeProfit,
        prioritizeReliability: settings.prioritizeReliability,
        constraints: {
          minimumProfitMargin:
            settings.riskTolerance === 'CONSERVATIVE'
              ? 100
              : settings.riskTolerance === 'AGGRESSIVE'
                ? 25
                : 50,
        },
      };

      const result =
        await aiLoadOptimizationService.optimizeLoadAssignments(request);
      setOptimizationResult(result);
      setLastOptimized(new Date());

      if (onOptimizationComplete) {
        onOptimizationComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
      console.error('Optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  /**
   * Quick recommendation for single load
   */
  const handleQuickRecommendation = async (loadId: string) => {
    const load = mockData.loads.find((l) => l.id === loadId);
    if (!load) return;

    try {
      const result = await aiLoadOptimizationService.quickLoadRecommendation(
        load,
        mockData.drivers.filter((d) => d.hoursAvailable > 0)
      );

      if (result.recommendedAssignment && onAssignmentSelected) {
        onAssignmentSelected(result.recommendedAssignment);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Quick recommendation failed'
      );
    }
  };

  /**
   * Render optimization overview
   */
  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '5px',
            }}
          >
            {mockData.loads.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Available Loads</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '5px',
            }}
          >
            {mockData.drivers.filter((d) => d.hoursAvailable > 0).length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Available Drivers
          </div>
        </div>

        <div
          style={{
            background: optimizationResult
              ? `linear-gradient(135deg, ${getConfidenceColor(optimizationResult.averageConfidence)}, ${getConfidenceColor(optimizationResult.averageConfidence, true)})`
              : 'linear-gradient(135deg, #6b7280, #4b5563)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '5px',
            }}
          >
            {optimizationResult
              ? `${optimizationResult.averageConfidence}%`
              : '--'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>AI Confidence</div>
        </div>

        <div
          style={{
            background: optimizationResult
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #6b7280, #4b5563)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '5px',
            }}
          >
            {optimizationResult
              ? `$${optimizationResult.totalExpectedProfit.toLocaleString()}`
              : '--'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Expected Profit</div>
        </div>
      </div>

      {/* Optimization Controls */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '25px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            🤖 AI Load Optimization
          </h3>
          {lastOptimized && (
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              Last optimized: {lastOptimized.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            style={{
              background: isOptimizing
                ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isOptimizing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
            }}
          >
            {isOptimizing ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Optimizing...
              </>
            ) : (
              <>🚀 Run Optimization</>
            )}
          </button>

          <select
            value={settings.riskTolerance}
            onChange={(e) =>
              setSettings({ ...settings, riskTolerance: e.target.value as any })
            }
            style={{
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
            }}
          >
            <option value='CONSERVATIVE'>🛡️ Conservative</option>
            <option value='MODERATE'>⚖️ Balanced</option>
            <option value='AGGRESSIVE'>🚀 Aggressive</option>
          </select>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <input
              type='checkbox'
              checked={settings.prioritizeProfit}
              onChange={(e) =>
                setSettings({ ...settings, prioritizeProfit: e.target.checked })
              }
              style={{ accentColor: '#3b82f6' }}
            />
            💰 Prioritize Profit
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <input
              type='checkbox'
              checked={settings.prioritizeReliability}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  prioritizeReliability: e.target.checked,
                })
              }
              style={{ accentColor: '#10b981' }}
            />
            🎯 Prioritize Reliability
          </label>
        </div>

        {error && (
          <div
            style={{
              marginTop: '15px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              color: '#fecaca',
              fontSize: '14px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {optimizationResult && (
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                padding: '15px',
                background: `rgba(${
                  optimizationResult.overallRecommendation === 'EXECUTE_ALL'
                    ? '34, 197, 94'
                    : optimizationResult.overallRecommendation ===
                        'EXECUTE_SELECTIVE'
                      ? '245, 158, 11'
                      : optimizationResult.overallRecommendation ===
                          'REVIEW_REQUIRED'
                        ? '251, 146, 60'
                        : '239, 68, 68'
                }, 0.2)`,
                border: `1px solid rgba(${
                  optimizationResult.overallRecommendation === 'EXECUTE_ALL'
                    ? '34, 197, 94'
                    : optimizationResult.overallRecommendation ===
                        'EXECUTE_SELECTIVE'
                      ? '245, 158, 11'
                      : optimizationResult.overallRecommendation ===
                          'REVIEW_REQUIRED'
                        ? '251, 146, 60'
                        : '239, 68, 68'
                }, 0.4)`,
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                }}
              >
                {getRecommendationIcon(
                  optimizationResult.overallRecommendation
                )}{' '}
                {formatRecommendation(optimizationResult.overallRecommendation)}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                {optimizationResult.optimalAssignments.length} optimal
                assignments found • Risk Level:{' '}
                {optimizationResult.overallRiskLevel} • Utilization:{' '}
                {optimizationResult.utilizationRate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /**
   * Render detailed assignments view
   */
  const renderAssignments = () => {
    if (
      !optimizationResult ||
      optimizationResult.optimalAssignments.length === 0
    ) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            No Optimization Results
          </div>
          <div style={{ fontSize: '14px' }}>
            Run an optimization to see AI-powered load assignments
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {optimizationResult.optimalAssignments.map((assignment, index) => (
          <div
            key={`${assignment.driverId}-${assignment.loadId}`}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => onAssignmentSelected?.(assignment)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                  }}
                >
                  🚛 Driver {assignment.driverId} → 📦 Load {assignment.loadId}
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}
                >
                  Assignment #{index + 1}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    background: getRecommendationColor(
                      assignment.aiInsights.recommendation
                    ),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  {getRecommendationIcon(assignment.aiInsights.recommendation)}{' '}
                  {assignment.aiInsights.recommendation.replace(/_/g, ' ')}
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                >
                  Confidence: {assignment.monteCarloAnalysis.confidence}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginBottom: '15px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    marginBottom: '2px',
                  }}
                >
                  Expected Profit
                </div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  $
                  {assignment.monteCarloAnalysis.expectedProfit.toLocaleString()}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    marginBottom: '2px',
                  }}
                >
                  On-Time Probability
                </div>
                <div
                  style={{
                    color: '#60a5fa',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {assignment.monteCarloAnalysis.onTimeProbability}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    marginBottom: '2px',
                  }}
                >
                  Risk Level
                </div>
                <div
                  style={{
                    color:
                      assignment.monteCarloAnalysis.riskLevel === 'LOW'
                        ? '#22c55e'
                        : assignment.monteCarloAnalysis.riskLevel === 'MEDIUM'
                          ? '#f59e0b'
                          : '#ef4444',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {assignment.monteCarloAnalysis.riskLevel}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    marginBottom: '2px',
                  }}
                >
                  Utilization
                </div>
                <div
                  style={{
                    color: '#a78bfa',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {assignment.utilizationScore.toFixed(0)}%
                </div>
              </div>
            </div>

            {assignment.aiInsights.reasoning.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '13px',
                    marginBottom: '5px',
                  }}
                >
                  💡 AI Insights:
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    margin: '0',
                    paddingLeft: '15px',
                  }}
                >
                  {assignment.aiInsights.reasoning.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {assignment.riskFactors.length > 0 && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    color: '#fecaca',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '3px',
                  }}
                >
                  ⚠️ Risk Factors:
                </div>
                <div
                  style={{
                    color: 'rgba(254, 202, 202, 0.8)',
                    fontSize: '11px',
                  }}
                >
                  {assignment.riskFactors.join(' • ')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          padding: '20px 25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          🤖 AI Load Optimization Center
          {isOptimizing && (
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          )}
        </h2>
        <p
          style={{
            margin: '8px 0 0 0',
            opacity: 0.8,
            fontSize: '14px',
          }}
        >
          🛡️ Powered by Monte Carlo simulation and Linear Programming
          optimization
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          padding: '0 25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'overview', label: '📊 Overview', icon: '📊' },
            { key: 'assignments', label: '🎯 Assignments', icon: '🎯' },
            { key: 'analytics', label: '📈 Analytics', icon: '📈' },
            { key: 'settings', label: '⚙️ Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              style={{
                background:
                  selectedTab === tab.key
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'transparent',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom:
                  selectedTab === tab.key
                    ? '3px solid #3b82f6'
                    : '3px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ padding: '25px' }}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'assignments' && renderAssignments()}
        {selectedTab === 'analytics' && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📈</div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              Analytics Dashboard
            </div>
            <div style={{ fontSize: '14px' }}>
              Coming soon - Advanced analytics and performance metrics
            </div>
          </div>
        )}
        {selectedTab === 'settings' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '500px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              ⚙️ Optimization Settings
            </h3>

            <div>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Risk Tolerance
              </label>
              <select
                value={settings.riskTolerance}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    riskTolerance: e.target.value as any,
                  })
                }
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '12px 15px',
                  fontSize: '14px',
                }}
              >
                <option value='CONSERVATIVE'>
                  🛡️ Conservative - Minimize risk, prioritize reliability
                </option>
                <option value='MODERATE'>
                  ⚖️ Balanced - Balance risk and reward
                </option>
                <option value='AGGRESSIVE'>
                  🚀 Aggressive - Maximize profit, accept higher risk
                </option>
              </select>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <input
                  type='checkbox'
                  checked={settings.autoRefresh}
                  onChange={(e) =>
                    setSettings({ ...settings, autoRefresh: e.target.checked })
                  }
                  style={{ accentColor: '#3b82f6', transform: 'scale(1.2)' }}
                />
                <span>🔄 Auto-refresh optimization results</span>
              </label>

              {settings.autoRefresh && (
                <div style={{ marginLeft: '36px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '12px',
                      marginBottom: '5px',
                    }}
                  >
                    Refresh Interval (minutes)
                  </label>
                  <input
                    type='number'
                    min='5'
                    max='60'
                    value={settings.refreshInterval}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        refreshInterval: parseInt(e.target.value) || 15,
                      })
                    }
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      width: '100px',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Helper functions
function getConfidenceColor(confidence: number, darker = false): string {
  if (confidence >= 85) return darker ? '#059669' : '#10b981';
  if (confidence >= 70) return darker ? '#d97706' : '#f59e0b';
  if (confidence >= 50) return darker ? '#dc2626' : '#ef4444';
  return darker ? '#4b5563' : '#6b7280';
}

function getRecommendationIcon(recommendation: string): string {
  switch (recommendation) {
    case 'EXECUTE_ALL':
      return '✅';
    case 'EXECUTE_SELECTIVE':
      return '🎯';
    case 'REVIEW_REQUIRED':
      return '⚠️';
    case 'REJECT_SOLUTION':
      return '❌';
    case 'STRONGLY_RECOMMEND':
      return '⭐';
    case 'RECOMMEND':
      return '✅';
    case 'CAUTION':
      return '⚠️';
    case 'AVOID':
      return '❌';
    default:
      return '❓';
  }
}

function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case 'EXECUTE_ALL':
    case 'STRONGLY_RECOMMEND':
    case 'RECOMMEND':
      return 'linear-gradient(135deg, #22c55e, #16a34a)';
    case 'EXECUTE_SELECTIVE':
    case 'CAUTION':
      return 'linear-gradient(135deg, #f59e0b, #d97706)';
    case 'REVIEW_REQUIRED':
      return 'linear-gradient(135deg, #f97316, #ea580c)';
    case 'REJECT_SOLUTION':
    case 'AVOID':
      return 'linear-gradient(135deg, #ef4444, #dc2626)';
    default:
      return 'linear-gradient(135deg, #6b7280, #4b5563)';
  }
}

function formatRecommendation(recommendation: string): string {
  return recommendation
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate mock data for demo purposes
function generateMockData(): { loads: Load[]; drivers: Driver[] } {
  const loads: Load[] = [
    {
      id: 'FL-001',
      origin: { lat: 32.7767, lng: -96.797, city: 'Dallas', state: 'TX' },
      destination: {
        lat: 33.4484,
        lng: -112.074,
        city: 'Phoenix',
        state: 'AZ',
      },
      distance: 887,
      revenue: 2450,
      requiredEquipment: 'dry_van',
      weight: 42000,
      hazmat: false,
      urgency: 'HIGH',
      pickupTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      deliveryTime: new Date(Date.now() + 28 * 60 * 60 * 1000),
      customerPriority: 'HIGH',
      estimatedHours: 14,
    },
    {
      id: 'FL-002',
      origin: { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
      destination: { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' },
      distance: 1187,
      revenue: 3200,
      requiredEquipment: 'reefer',
      weight: 38500,
      hazmat: false,
      urgency: 'MEDIUM',
      pickupTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      deliveryTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
      customerPriority: 'MEDIUM',
      estimatedHours: 18,
    },
    {
      id: 'FL-003',
      origin: {
        lat: 34.0522,
        lng: -118.2437,
        city: 'Los Angeles',
        state: 'CA',
      },
      destination: {
        lat: 47.6062,
        lng: -122.3321,
        city: 'Seattle',
        state: 'WA',
      },
      distance: 1135,
      revenue: 2890,
      requiredEquipment: 'flatbed',
      weight: 45000,
      hazmat: true,
      urgency: 'LOW',
      pickupTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      deliveryTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      customerPriority: 'LOW',
      estimatedHours: 16,
    },
  ];

  const drivers: Driver[] = [
    {
      id: 'DRV-001',
      name: 'John Rodriguez',
      location: { lat: 32.7767, lng: -96.797, city: 'Dallas', state: 'TX' },
      hoursAvailable: 11,
      equipment: ['dry_van', 'reefer'],
      rating: 4.8,
      costPerMile: 1.65,
      efficiency: 1.1,
      specializations: ['expedited'],
      currentLocation: 'Dallas, TX',
      maxDistance: 1200,
      preferredLanes: ['TX-CA', 'TX-FL', 'TX-AZ'],
    },
    {
      id: 'DRV-002',
      name: 'Maria Santos',
      location: { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
      hoursAvailable: 8.5,
      equipment: ['reefer', 'dry_van'],
      rating: 4.9,
      costPerMile: 1.75,
      efficiency: 1.15,
      specializations: ['reefer', 'temperature_controlled'],
      currentLocation: 'Houston, TX',
      maxDistance: 1500,
      preferredLanes: ['TX-FL', 'TX-GA', 'TX-LA'],
    },
    {
      id: 'DRV-003',
      name: 'David Thompson',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        city: 'Los Angeles',
        state: 'CA',
      },
      hoursAvailable: 10,
      equipment: ['flatbed', 'step_deck'],
      rating: 4.6,
      costPerMile: 1.85,
      efficiency: 1.05,
      specializations: ['HAZMAT', 'oversized', 'heavy_haul'],
      currentLocation: 'Los Angeles, CA',
      maxDistance: 1000,
      preferredLanes: ['CA-TX', 'CA-AZ', 'CA-WA'],
    },
  ];

  return { loads, drivers };
}
