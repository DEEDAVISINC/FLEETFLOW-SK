/**
 * Adaptive Learning Dashboard - Comprehensive AI Workforce Learning Management
 * Provides real-time monitoring and control of adaptive learning capabilities
 */

'use client';

import { useEffect, useState } from 'react';
import {
  LEARNING_LEVELS,
  calculateLearningMaturity,
  getRecommendedLearningLevel,
} from '../utils/enhanceStaffWithAdaptiveLearning';
import { depointeStaffRoster } from './DEPOINTEStaffRoster';

interface LearningMetrics {
  totalInteractions: number;
  successRate: number;
  userSatisfaction: number;
  learningMaturity: number;
  recommendedLevel: string;
  adaptationStrengths: string[];
}

export default function AdaptiveLearningDashboard() {
  const [learningMetrics, setLearningMetrics] = useState<
    Record<string, LearningMetrics>
  >({});
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [learningConfig, setLearningConfig] = useState({
    autoOptimize: true,
    learningRate: 'adaptive',
    focusAreas: ['performance', 'efficiency', 'user_satisfaction'],
    updateFrequency: 30, // seconds
  });

  useEffect(() => {
    // Simulate real-time learning data generation
    const updateMetrics = () => {
      const newMetrics: Record<string, LearningMetrics> = {};

      depointeStaffRoster.forEach((staff) => {
        if (staff.adaptiveLearning?.enabled) {
          const totalInteractions = Math.floor(Math.random() * 1000) + 100;
          const successRate = Math.random() * 20 + 80; // 80-100%
          const userSatisfaction = Math.random() * 2 + 8; // 8-10

          const learningMaturity = calculateLearningMaturity(
            totalInteractions,
            successRate,
            userSatisfaction
          );

          const recommendedLevel =
            getRecommendedLearningLevel(learningMaturity);

          newMetrics[staff.id] = {
            totalInteractions,
            successRate: Math.round(successRate * 100) / 100,
            userSatisfaction: Math.round(userSatisfaction * 10) / 10,
            learningMaturity,
            recommendedLevel,
            adaptationStrengths: staff.adaptiveLearning.adaptationStrengths,
          };
        }
      });

      setLearningMetrics(newMetrics);
    };

    updateMetrics();
    const interval = setInterval(
      updateMetrics,
      learningConfig.updateFrequency * 1000
    );

    return () => clearInterval(interval);
  }, [learningConfig.updateFrequency]);

  const learningEnabledStaff = depointeStaffRoster.filter(
    (staff) => staff.adaptiveLearning?.enabled
  );

  const averageMaturity =
    learningEnabledStaff.length > 0
      ? Math.round(
          Object.values(learningMetrics).reduce(
            (sum, metrics) => sum + metrics.learningMaturity,
            0
          ) / learningEnabledStaff.length
        )
      : 0;

  const getMaturityColor = (score: number) => {
    if (score >= 85) return '#22c55e';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getLearningLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return '#22c55e';
      case 'advanced':
        return '#3b82f6';
      case 'intermediate':
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  };

  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '20px',
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🧠
          </div>
          <div>
            <h3
              style={{
                color: 'white',
                fontSize: '1.4rem',
                fontWeight: '700',
                margin: 0,
              }}
            >
              AI Adaptive Learning System
            </h3>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                marginTop: '4px',
              }}
            >
              {learningEnabledStaff.length} Staff Learning • Avg Maturity:{' '}
              {averageMaturity}%
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfig(!showConfig);
            }}
            style={{
              padding: '6px 12px',
              background: showConfig
                ? 'rgba(147, 51, 234, 0.3)'
                : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${showConfig ? '#9333ea' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ⚙️ Config
          </button>
          <span
            style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          ▼
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '8px',
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          <h4
            style={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🔧 Learning Configuration
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Auto Optimization Toggle */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginBottom: '8px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={learningConfig.autoOptimize}
                  onChange={(e) =>
                    setLearningConfig((prev) => ({
                      ...prev,
                      autoOptimize: e.target.checked,
                    }))
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#9333ea',
                  }}
                />
                🤖 Auto-Optimize Learning
              </label>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.8rem',
                }}
              >
                Automatically adjust learning parameters based on performance
              </div>
            </div>

            {/* Learning Rate */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                📈 Learning Rate
              </label>
              <select
                value={learningConfig.learningRate}
                onChange={(e) =>
                  setLearningConfig((prev) => ({
                    ...prev,
                    learningRate: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.9rem',
                }}
              >
                <option value='conservative'>Conservative</option>
                <option value='adaptive'>Adaptive</option>
                <option value='aggressive'>Aggressive</option>
              </select>
            </div>

            {/* Focus Areas */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                🎯 Focus Areas
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                {[
                  { key: 'performance', label: 'Performance', icon: '📊' },
                  { key: 'efficiency', label: 'Efficiency', icon: '⚡' },
                  {
                    key: 'user_satisfaction',
                    label: 'User Satisfaction',
                    icon: '😊',
                  },
                  { key: 'accuracy', label: 'Accuracy', icon: '🎯' },
                  { key: 'speed', label: 'Speed', icon: '🚀' },
                ].map(({ key, label, icon }) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: learningConfig.focusAreas.includes(key)
                        ? 'rgba(147, 51, 234, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${learningConfig.focusAreas.includes(key) ? '#9333ea' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={learningConfig.focusAreas.includes(key)}
                      onChange={(e) => {
                        const newFocusAreas = e.target.checked
                          ? [...learningConfig.focusAreas, key]
                          : learningConfig.focusAreas.filter(
                              (area) => area !== key
                            );
                        setLearningConfig((prev) => ({
                          ...prev,
                          focusAreas: newFocusAreas,
                        }));
                      }}
                      style={{ display: 'none' }}
                    />
                    {icon} {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Update Frequency */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                ⏱️ Update Frequency
              </label>
              <select
                value={learningConfig.updateFrequency}
                onChange={(e) =>
                  setLearningConfig((prev) => ({
                    ...prev,
                    updateFrequency: parseInt(e.target.value),
                  }))
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.9rem',
                }}
              >
                <option value='15'>15 seconds</option>
                <option value='30'>30 seconds</option>
                <option value='60'>1 minute</option>
                <option value='300'>5 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div
          style={{
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          {/* Overview Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: getMaturityColor(averageMaturity),
                  marginBottom: '8px',
                }}
              >
                {averageMaturity}%
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                Average Learning Maturity
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#22c55e',
                  marginBottom: '8px',
                }}
              >
                {learningEnabledStaff.length}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                Learning-Enabled Staff
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#f59e0b',
                  marginBottom: '8px',
                }}
              >
                24/7
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                Continuous Learning
              </div>
            </div>
          </div>

          {/* Learning Level Distribution */}
          <div
            style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📊 Learning Level Distribution
            </h4>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {LEARNING_LEVELS.map((level) => {
                const count = Object.values(learningMetrics).filter(
                  (metrics) => metrics.recommendedLevel === level
                ).length;

                return (
                  <div
                    key={level}
                    style={{
                      padding: '8px 12px',
                      background: `rgba(${level === 'expert' ? '34, 197, 94' : level === 'advanced' ? '59, 130, 246' : level === 'intermediate' ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
                      border: `1px solid rgba(${level === 'expert' ? '34, 197, 94' : level === 'advanced' ? '59, 130, 246' : level === 'intermediate' ? '245, 158, 11' : '239, 68, 68'}, 0.3)`,
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: getLearningLevelColor(level),
                    }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}: {count}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Staff Learning Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '16px',
            }}
          >
            {learningEnabledStaff.map((staff) => {
              const metrics = learningMetrics[staff.id];
              if (!metrics) return null;

              return (
                <div
                  key={staff.id}
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() =>
                    setSelectedStaff(
                      selectedStaff === staff.id ? null : staff.id
                    )
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                        }}
                      >
                        {staff.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem',
                          }}
                        >
                          {staff.firstName} {staff.lastName}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {staff.department}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        background: `rgba(${metrics.recommendedLevel === 'expert' ? '34, 197, 94' : metrics.recommendedLevel === 'advanced' ? '59, 130, 246' : metrics.recommendedLevel === 'intermediate' ? '245, 158, 11' : '239, 68, 68'}, 0.2)`,
                        border: `1px solid rgba(${metrics.recommendedLevel === 'expert' ? '34, 197, 94' : metrics.recommendedLevel === 'advanced' ? '59, 130, 246' : metrics.recommendedLevel === 'intermediate' ? '245, 158, 11' : '239, 68, 68'}, 0.4)`,
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: getLearningLevelColor(metrics.recommendedLevel),
                        textTransform: 'uppercase',
                      }}
                    >
                      {metrics.recommendedLevel}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Maturity Score
                      </div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: getMaturityColor(metrics.learningMaturity),
                        }}
                      >
                        {metrics.learningMaturity}%
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Success Rate
                      </div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#22c55e',
                        }}
                      >
                        {metrics.successRate}%
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                        marginBottom: '4px',
                      }}
                    >
                      Interactions: {metrics.totalInteractions.toLocaleString()}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min((metrics.totalInteractions / 1000) * 100, 100)}%`,
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #3b82f6, #06b6d4)',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  </div>

                  {selectedStaff === staff.id && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '6px',
                        animation: 'slideDown 0.2s ease-out',
                      }}
                    >
                      <h5
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Learning Strengths
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}
                      >
                        {metrics.adaptationStrengths
                          .slice(0, 4)
                          .map((strength, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '4px 8px',
                                background: 'rgba(147, 51, 234, 0.2)',
                                border: '1px solid rgba(147, 51, 234, 0.3)',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                color: '#c084fc',
                              }}
                            >
                              {strength}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Learning Analytics & Insights */}
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📈 Learning Analytics & Insights
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {/* Performance Trends */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '8px',
                }}
              >
                <h5
                  style={{
                    color: '#22c55e',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📊 Performance Trends
                </h5>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  <div>• Success rate improving by 2.3% weekly</div>
                  <div>• User satisfaction up 1.8% this month</div>
                  <div>• Response time reduced by 15% average</div>
                  <div>• Top performer: Sales team (94.2% efficiency)</div>
                </div>
              </div>

              {/* Learning Patterns */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                }}
              >
                <h5
                  style={{
                    color: '#3b82f6',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🧠 Learning Patterns
                </h5>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  <div>• Peak learning: 2-4 PM daily</div>
                  <div>• Most effective: Interactive feedback loops</div>
                  <div>• Strongest adaptation: Customer communication</div>
                  <div>• Weakest area: Technical troubleshooting</div>
                </div>
              </div>

              {/* Recommendations */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                }}
              >
                <h5
                  style={{
                    color: '#f59e0b',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  💡 AI Recommendations
                </h5>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  <div>• Increase focus on technical training</div>
                  <div>• Implement peer learning sessions</div>
                  <div>• Expand user satisfaction metrics</div>
                  <div>• Add predictive analytics training</div>
                </div>
              </div>

              {/* Learning Effectiveness */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(147, 51, 234, 0.1)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  borderRadius: '8px',
                }}
              >
                <h5
                  style={{
                    color: '#9333ea',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🎯 Effectiveness Score
                </h5>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#9333ea',
                    }}
                  >
                    87%
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '87%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #9333ea, #c084fc)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8rem',
                  }}
                >
                  Based on 2,340 learning interactions this month
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
