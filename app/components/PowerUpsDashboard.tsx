/**
 * DEPOINTE Power-Ups Dashboard
 * Inspired by Sintra.ai's Power-Ups interface
 * Freight-specific micro-AI tools management
 */

'use client';

import {
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle,
  Clock,
  Cog,
  Grid,
  MessageSquare,
  Pause,
  Play,
  Shield,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  PowerUp,
  PowerUpResult,
  depointePowerUpsService,
} from '../services/DEPOINTEPowerUpsService';
import { freightBrainAI } from '../services/FreightBrainAI';

interface PowerUpsDashboardProps {
  selectedStaff?: string;
}

export default function PowerUpsDashboard({
  selectedStaff,
}: PowerUpsDashboardProps) {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [filteredPowerUps, setFilteredPowerUps] = useState<PowerUp[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [executingPowerUp, setExecutingPowerUp] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<PowerUpResult | null>(
    null
  );
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadPowerUps();
    loadStats();
  }, []);

  useEffect(() => {
    filterPowerUps();
  }, [powerUps, selectedCategory, selectedStaff]);

  const loadPowerUps = () => {
    const allPowerUps = depointePowerUpsService.getAllPowerUps();
    setPowerUps(allPowerUps);
  };

  const loadStats = () => {
    const powerUpStats = depointePowerUpsService.getPowerUpStats();
    const brainStats = freightBrainAI.getBrainStats();
    setStats({ powerUps: powerUpStats, brain: brainStats });
  };

  const filterPowerUps = () => {
    let filtered = powerUps;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by staff member
    if (selectedStaff) {
      filtered = filtered.filter((p) => p.aiStaff.includes(selectedStaff));
    }

    setFilteredPowerUps(filtered);
  };

  const executePowerUp = async (powerUpId: string) => {
    setExecutingPowerUp(powerUpId);
    setExecutionResult(null);

    try {
      const result = await depointePowerUpsService.executePowerUp(powerUpId, {
        staffMember: selectedStaff,
        timestamp: new Date(),
      });
      setExecutionResult(result);
      loadPowerUps(); // Refresh to update usage counts
    } catch (error) {
      setExecutionResult({
        success: false,
        message: 'Failed to execute Power-Up',
      });
    } finally {
      setExecutingPowerUp(null);
    }
  };

  const togglePowerUp = (powerUpId: string) => {
    depointePowerUpsService.togglePowerUp(powerUpId);
    loadPowerUps();
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      lead_generation: Target,
      operations: Cog,
      compliance: Shield,
      analytics: BarChart3,
      communication: MessageSquare,
      automation: Bot,
    };
    return icons[category as keyof typeof icons] || Bot;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      lead_generation: 'bg-red-500',
      operations: 'bg-green-500',
      compliance: 'bg-blue-500',
      analytics: 'bg-purple-500',
      communication: 'bg-yellow-500',
      automation: 'bg-indigo-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const categories = [
    { key: 'all', label: 'All Power-Ups', icon: Grid },
    { key: 'lead_generation', label: 'Lead Generation', icon: Target },
    { key: 'operations', label: 'Operations', icon: Cog },
    { key: 'compliance', label: 'Compliance', icon: Shield },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'communication', label: 'Communication', icon: MessageSquare },
    { key: 'automation', label: 'Automation', icon: Bot },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        margin: '20px',
        color: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <div
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            ⚡
          </div>
          <div>
            <h1
              style={{
                background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
              }}
            >
              DEPOINTE Power-Ups
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '16px',
              }}
            >
              {selectedStaff
                ? `Power-Ups for ${selectedStaff}`
                : 'Freight-Specific Micro-AI Tools'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div
            style={{
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px',
                  }}
                >
                  <CheckCircle
                    style={{ height: '20px', width: '20px', color: '#22c55e' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.powerUps.activePowerUps}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Active Power-Ups
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '8px',
                  }}
                >
                  <TrendingUp
                    style={{ height: '20px', width: '20px', color: '#3b82f6' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.powerUps.totalUsage.toLocaleString()}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Total Executions
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '8px',
                  }}
                >
                  <BarChart3
                    style={{ height: '20px', width: '20px', color: '#8b5cf6' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.powerUps.averageSuccessRate}%
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Success Rate
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    padding: '8px',
                  }}
                >
                  <Clock
                    style={{ height: '20px', width: '20px', color: '#f59e0b' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      margin: '0 0 4px 0',
                    }}
                  >
                    2,400+
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Hours Saved
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div
        style={{
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.key;

            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isSelected
                    ? 'linear-gradient(135deg, #9333ea, #3b82f6)'
                    : 'rgba(30, 41, 59, 0.5)',
                  color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  border: isSelected
                    ? 'none'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                }}
              >
                <Icon style={{ height: '16px', width: '16px' }} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            padding: '16px',
            border: executionResult.success
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.3)',
            background: executionResult.success
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            color: executionResult.success
              ? 'rgba(34, 197, 94, 0.9)'
              : 'rgba(239, 68, 68, 0.9)',
          }}
        >
          <div
            style={{
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {executionResult.success ? (
              <CheckCircle
                style={{ height: '20px', width: '20px', color: '#22c55e' }}
              />
            ) : (
              <AlertTriangle
                style={{ height: '20px', width: '20px', color: '#ef4444' }}
              />
            )}
            <h3
              style={{
                fontWeight: '600',
                fontSize: '18px',
                margin: 0,
              }}
            >
              {executionResult.success
                ? 'Power-Up Executed Successfully!'
                : 'Execution Failed'}
            </h3>
          </div>

          <p
            style={{
              marginBottom: '12px',
              fontSize: '14px',
            }}
          >
            {executionResult.message}
          </p>

          {executionResult.success && executionResult.data && (
            <div
              style={{
                marginBottom: '12px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.3)',
                padding: '12px',
              }}
            >
              <pre
                style={{
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(executionResult.data, null, 2)}
              </pre>
            </div>
          )}

          {executionResult.timesSaved && (
            <p
              style={{
                marginBottom: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              ⏱️ Time Saved: {Math.floor(executionResult.timesSaved / 60)} hours{' '}
              {executionResult.timesSaved % 60} minutes
            </p>
          )}

          {executionResult.nextSteps && (
            <div>
              <p
                style={{
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: executionResult.success
                    ? 'rgba(34, 197, 94, 0.9)'
                    : 'rgba(239, 68, 68, 0.9)',
                }}
              >
                Next Steps:
              </p>
              <ul
                style={{
                  listStyle: 'inside disc',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                }}
              >
                {executionResult.nextSteps.map((step, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Power-Ups Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredPowerUps.map((powerUp) => {
          const CategoryIcon = getCategoryIcon(powerUp.category);
          const isExecuting = executingPowerUp === powerUp.id;

          return (
            <div
              key={powerUp.id}
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '24px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)')
              }
              onMouseLeave={(e) =>
                (e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)')
              }
            >
              {/* Header */}
              <div
                style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
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
                      borderRadius: '8px',
                      padding: '8px',
                      background:
                        powerUp.category === 'lead_generation'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : powerUp.category === 'operations'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : powerUp.category === 'compliance'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : powerUp.category === 'analytics'
                                ? 'rgba(139, 92, 246, 0.2)'
                                : powerUp.category === 'communication'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : powerUp.category === 'automation'
                                    ? 'rgba(147, 51, 234, 0.2)'
                                    : 'rgba(107, 114, 128, 0.2)',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{powerUp.icon}</span>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '18px',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {powerUp.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        margin: 0,
                        textTransform: 'capitalize',
                      }}
                    >
                      {powerUp.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => togglePowerUp(powerUp.id)}
                  style={{
                    borderRadius: '8px',
                    padding: '8px',
                    border: 'none',
                    background: powerUp.isActive
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(71, 85, 105, 0.2)',
                    color: powerUp.isActive
                      ? '#22c55e'
                      : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = powerUp.isActive
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(71, 85, 105, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = powerUp.isActive
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(71, 85, 105, 0.2)';
                  }}
                >
                  {powerUp.isActive ? (
                    <Play style={{ height: '16px', width: '16px' }} />
                  ) : (
                    <Pause style={{ height: '16px', width: '16px' }} />
                  )}
                </button>
              </div>

              {/* Description */}
              <p
                style={{
                  marginBottom: '20px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {powerUp.description}
              </p>

              {/* Stats */}
              <div
                style={{
                  marginBottom: '20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    Usage Count
                  </p>
                  <p
                    style={{
                      fontWeight: '600',
                      color: 'white',
                      fontSize: '16px',
                      margin: 0,
                    }}
                  >
                    {powerUp.usageCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    Success Rate
                  </p>
                  <p
                    style={{
                      fontWeight: '600',
                      color: '#22c55e',
                      fontSize: '16px',
                      margin: 0,
                    }}
                  >
                    {powerUp.successRate}%
                  </p>
                </div>
              </div>

              {/* Time Saved */}
              <div
                style={{
                  marginBottom: '20px',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: '0 0 4px 0',
                  }}
                >
                  Time Saved
                </p>
                <p
                  style={{
                    fontWeight: '600',
                    color: '#3b82f6',
                    fontSize: '16px',
                    margin: 0,
                  }}
                >
                  {powerUp.timesSaved}
                </p>
              </div>

              {/* AI Staff */}
              <div
                style={{
                  marginBottom: '20px',
                }}
              >
                <p
                  style={{
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: 0,
                  }}
                >
                  AI Staff
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}
                >
                  {powerUp.aiStaff.slice(0, 3).map((staff) => (
                    <span
                      key={staff}
                      style={{
                        borderRadius: '4px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        padding: '4px 8px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {staff}
                    </span>
                  ))}
                  {powerUp.aiStaff.length > 3 && (
                    <span
                      style={{
                        borderRadius: '4px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        padding: '4px 8px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      +{powerUp.aiStaff.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={() => executePowerUp(powerUp.id)}
                disabled={!powerUp.isActive || isExecuting}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor:
                    powerUp.isActive && !isExecuting
                      ? 'pointer'
                      : 'not-allowed',
                  background:
                    powerUp.isActive && !isExecuting
                      ? 'linear-gradient(135deg, #9333ea, #3b82f6)'
                      : 'rgba(71, 85, 105, 0.5)',
                  color:
                    powerUp.isActive && !isExecuting
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (powerUp.isActive && !isExecuting) {
                    e.target.style.background =
                      'linear-gradient(135deg, #7c3aed, #2563eb)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (powerUp.isActive && !isExecuting) {
                    e.target.style.background =
                      'linear-gradient(135deg, #9333ea, #3b82f6)';
                  }
                }}
              >
                {isExecuting ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        height: '16px',
                        width: '16px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                      }}
                    />
                    Executing...
                  </div>
                ) : (
                  'Execute Power-Up'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPowerUps.length === 0 && (
        <div
          style={{
            padding: '48px 0',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              margin: '0 auto 16px auto',
              display: 'flex',
              height: '64px',
              width: '64px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.3)',
              padding: '16px',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              ⚡
            </span>
          </div>
          <h3
            style={{
              marginBottom: '8px',
              fontSize: '20px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            No Power-Ups Found
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '16px',
              margin: 0,
            }}
          >
            {selectedStaff
              ? `No Power-Ups available for ${selectedStaff} in the ${selectedCategory} category.`
              : `No Power-Ups found in the ${selectedCategory} category.`}
          </p>
        </div>
      )}
    </div>
  );
}
