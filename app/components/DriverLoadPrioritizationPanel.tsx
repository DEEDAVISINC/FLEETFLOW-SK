'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface DriverLoad {
  id: string;
  origin: string;
  destination: string;
  rate: number;
  pickupDate: string;
  deliveryDate: string;
  equipment: string;
  weight: string;
  distance: string;
  status: string;
  workflowProgress: number;
  nextStep?: string;
  urgencyScore: number;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  daysUntilPickup: number;
  daysUntilDelivery: number;
  workflowStatus: 'pending' | 'in_progress' | 'completed';
  riskFactors: string[];
  businessValue: number;
}

interface PrioritizationMetrics {
  totalLoads: number;
  criticalLoads: number;
  highPriorityLoads: number;
  averageUrgency: number;
  workflowEfficiency: number;
  onTimePerformance: number;
}

interface DriverLoadPrioritizationPanelProps {
  assignedLoads: any[];
  driverId: string;
}

export default function DriverLoadPrioritizationPanel({
  assignedLoads,
  driverId,
}: DriverLoadPrioritizationPanelProps) {
  const isEnabled = useFeatureFlag('SMART_TASK_PRIORITIZATION');
  const [prioritizedLoads, setPrioritizedLoads] = useState<DriverLoad[]>([]);
  const [metrics, setMetrics] = useState<PrioritizationMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<
    'priority' | 'metrics' | 'recommendations'
  >('priority');

  useEffect(() => {
    if (isEnabled && assignedLoads.length > 0) {
      prioritizeDriverLoads();
    }
  }, [isEnabled, assignedLoads, driverId]);

  const prioritizeDriverLoads = async () => {
    setLoading(true);
    try {
      // Convert assigned loads to prioritization format
      const driverLoads = assignedLoads.map((load) => ({
        id: load.id,
        origin: load.origin,
        destination: load.destination,
        rate: load.rate,
        pickupDate: load.pickupDate,
        deliveryDate: load.deliveryDate,
        equipment: load.equipment,
        weight: load.weight,
        distance: load.distance,
        status: load.status,
        workflowProgress: load.workflowProgress || 0,
        nextStep: load.nextStep || 'load_assignment_confirmation',
        daysUntilPickup: Math.ceil(
          (new Date(load.pickupDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        daysUntilDelivery: Math.ceil(
          (new Date(load.deliveryDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        workflowStatus:
          load.workflowProgress === 100
            ? 'completed'
            : load.workflowProgress > 0
              ? 'in_progress'
              : 'pending',
        businessValue: load.rate || 2000,
      }));

      const response = await fetch('/api/analytics/task-prioritization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'prioritize-driver-loads',
          loads: driverLoads,
          driverId,
          context: {
            currentTime: new Date().toISOString(),
            driverLocation: 'current_location',
            availableHours: 11, // HOS remaining
            equipmentType: 'dry_van',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrioritizedLoads(data.prioritizedLoads || []);
        setMetrics(data.metrics || null);
        setRecommendations(data.recommendations || []);
      } else {
        console.error('Failed to prioritize driver loads');
        // Fallback to basic sorting
        const basicPrioritized = driverLoads
          .map((load) => ({
            ...load,
            urgencyScore: calculateBasicUrgency(load),
            priorityLevel: getBasicPriority(load),
            riskFactors: getBasicRiskFactors(load),
          }))
          .sort((a, b) => b.urgencyScore - a.urgencyScore);

        setPrioritizedLoads(basicPrioritized as DriverLoad[]);
        setMetrics({
          totalLoads: driverLoads.length,
          criticalLoads: basicPrioritized.filter(
            (l) => l.priorityLevel === 'CRITICAL'
          ).length,
          highPriorityLoads: basicPrioritized.filter(
            (l) => l.priorityLevel === 'HIGH'
          ).length,
          averageUrgency:
            basicPrioritized.reduce((sum, l) => sum + l.urgencyScore, 0) /
            basicPrioritized.length,
          workflowEfficiency: 75,
          onTimePerformance: 88,
        });
      }
    } catch (error) {
      console.error('Error prioritizing driver loads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBasicUrgency = (load: any): number => {
    let score = 50; // Base score

    // Time urgency
    if (load.daysUntilPickup <= 1) score += 30;
    else if (load.daysUntilPickup <= 2) score += 20;
    else if (load.daysUntilPickup <= 3) score += 10;

    // Workflow progress urgency
    if (load.workflowProgress === 0)
      score += 25; // Not started
    else if (load.workflowProgress < 50) score += 15; // In progress

    // Business value
    if (load.rate > 3000) score += 15;
    else if (load.rate > 2000) score += 10;

    return Math.min(100, score);
  };

  const getBasicPriority = (
    load: any
  ): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' => {
    const urgency = calculateBasicUrgency(load);
    if (urgency >= 80) return 'CRITICAL';
    if (urgency >= 65) return 'HIGH';
    if (urgency >= 50) return 'MEDIUM';
    return 'LOW';
  };

  const getBasicRiskFactors = (load: any): string[] => {
    const factors = [];
    if (load.daysUntilPickup <= 1) factors.push('Urgent pickup');
    if (load.workflowProgress === 0) factors.push('Workflow not started');
    if (load.rate > 3000) factors.push('High-value load');
    return factors;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return { bg: '#fef2f2', border: '#dc2626', text: '#dc2626' };
      case 'HIGH':
        return { bg: '#fef3c7', border: '#f59e0b', text: '#f59e0b' };
      case 'MEDIUM':
        return { bg: '#f0f9ff', border: '#3b82f6', text: '#3b82f6' };
      case 'LOW':
        return { bg: '#f9fafb', border: '#6b7280', text: '#6b7280' };
      default:
        return { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' };
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        color: 'white',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎯 AI Load Prioritization
        </h3>
        <p
          style={{
            fontSize: '14px',
            opacity: 0.9,
            margin: 0,
          }}
        >
          Smart prioritization of your assigned loads based on urgency,
          deadlines, and workflow status
        </p>
      </div>

      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '4px',
          borderRadius: '12px',
        }}
      >
        {[
          { id: 'priority', label: '📋 Priority Queue', icon: '🎯' },
          { id: 'metrics', label: '📊 Metrics', icon: '📈' },
          { id: 'recommendations', label: '💡 AI Insights', icon: '🤖' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as any)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background:
                activeView === view.id
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              color:
                activeView === view.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            🔄 Analyzing load priorities...
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            AI is optimizing your workflow
          </div>
        </div>
      ) : (
        <>
          {/* Priority Queue View */}
          {activeView === 'priority' && (
            <div>
              {prioritizedLoads.length === 0 ? (
                <div
                  style={{ textAlign: 'center', padding: '20px', opacity: 0.8 }}
                >
                  📭 No loads to prioritize
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {prioritizedLoads.slice(0, 5).map((load, index) => {
                    const priorityStyle = getPriorityColor(load.priorityLevel);

                    return (
                      <div
                        key={load.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: `2px solid ${priorityStyle.border}`,
                          position: 'relative',
                        }}
                      >
                        {/* Priority Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '16px',
                            background: priorityStyle.border,
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                          }}
                        >
                          #{index + 1} {load.priorityLevel}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '12px',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#111827',
                                margin: '0 0 4px 0',
                              }}
                            >
                              🚛 Load {load.id}
                            </h4>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                marginBottom: '4px',
                              }}
                            >
                              {load.origin} → {load.destination}
                            </div>
                            <div style={{ fontSize: '12px', color: '#374151' }}>
                              <strong>Next:</strong>{' '}
                              {load.nextStep
                                ?.replace(/_/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#111827',
                              }}
                            >
                              ${load.rate.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>
                              {load.daysUntilPickup <= 0
                                ? 'Due today'
                                : `${load.daysUntilPickup} days`}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              background: '#f3f4f6',
                              height: '4px',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                background: priorityStyle.border,
                                height: '100%',
                                width: `${load.workflowProgress}%`,
                                transition: 'width 0.3s ease',
                              }}
                             />
                          </div>
                        </div>

                        {/* Risk Factors */}
                        {load.riskFactors && load.riskFactors.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '4px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {load.riskFactors.map((factor, idx) => (
                              <span
                                key={idx}
                                style={{
                                  background: priorityStyle.bg,
                                  color: priorityStyle.text,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                }}
                              >
                                {factor}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Metrics View */}
          {activeView === 'metrics' && metrics && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {metrics.totalLoads}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  Total Loads
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(220, 38, 38, 0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {metrics.criticalLoads}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Critical</div>
              </div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {metrics.highPriorityLoads}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  High Priority
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {Math.round(metrics.averageUrgency)}%
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  Avg Urgency
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {Math.round(metrics.workflowEfficiency)}%
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Efficiency</div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {Math.round(metrics.onTimePerformance)}%
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>On-Time</div>
              </div>
            </div>
          )}

          {/* Recommendations View */}
          {activeView === 'recommendations' && (
            <div style={{ display: 'grid', gap: '8px' }}>
              {recommendations.length === 0 ? (
                <div
                  style={{ textAlign: 'center', padding: '20px', opacity: 0.8 }}
                >
                  🤖 AI recommendations will appear here
                </div>
              ) : (
                recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>💡</span>
                    <span>{rec}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
