'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DispatchCentralOperationsTraining() {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Load Board Management',
      duration: '40 minutes',
      topics: [
        'Load Board Navigation & Interface',
        'Search Filters & Optimization',
        'Load Posting Best Practices',
        'Rate Analysis & Market Intelligence',
        'Multi-Board Management',
        'Performance Tracking & Analytics',
      ],
    },
    {
      id: 2,
      title: 'Carrier Assignment',
      duration: '45 minutes',
      topics: [
        'Carrier Selection Criteria',
        'Capacity Matching Strategies',
        'Assignment Workflow Optimization',
        'Carrier Performance Evaluation',
        'Backup Carrier Management',
        'Assignment Documentation',
      ],
    },
    {
      id: 3,
      title: 'Route Optimization',
      duration: '35 minutes',
      topics: [
        'Route Planning Fundamentals',
        'Multi-Stop Optimization',
        'Traffic & Weather Considerations',
        'Fuel Efficiency Strategies',
        'Delivery Time Optimization',
        'Route Performance Analysis',
      ],
    },
    {
      id: 4,
      title: 'Real-time Tracking',
      duration: '30 minutes',
      topics: [
        'GPS Tracking Systems',
        'Status Update Management',
        'Exception Handling Procedures',
        'Customer Communication Protocols',
        'Tracking Data Analysis',
        'Proactive Issue Resolution',
      ],
    },
    {
      id: 5,
      title: 'Communication Protocols',
      duration: '25 minutes',
      topics: [
        'Professional Communication Standards',
        'Multi-Channel Communication',
        'Escalation Procedures',
        'Documentation Requirements',
        'Customer Service Excellence',
        'Internal Team Coordination',
      ],
    },
    {
      id: 6,
      title: 'Emergency Procedures',
      duration: '20 minutes',
      topics: [
        'Emergency Response Planning',
        'Breakdown & Delay Management',
        'Incident Reporting Protocols',
        'Customer Notification Systems',
        'Recovery Action Plans',
        'Post-Incident Analysis',
      ],
    },
  ];

  const completeModule = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
    if (moduleId < modules.length) {
      setCurrentModule(moduleId + 1);
    } else {
      setShowCertificate(true);
    }
  };

  const getModuleStatus = (moduleId: number) => {
    if (completedModules.includes(moduleId)) return 'completed';
    if (moduleId === currentModule) return 'current';
    return 'locked';
  };

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        color: '#ffffff',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span style={{ fontSize: '32px' }}>📋</span>
          </div>
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 8px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Dispatch Central Operations
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Complete training on dispatch operations, load management, and
              carrier coordination
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}
            >
              {completedModules.length}/{modules.length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Modules Complete
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}
            >
              195 min
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Total Duration
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}
            >
              4.7★
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Rating
            </div>
          </div>
        </div>
      </div>

      {/* Core Operations Areas */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          🎯 Core Operations Areas
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}
            >
              Load Management
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Board management & optimization
            </div>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚛</div>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}
            >
              Carrier Coordination
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Assignment & tracking
            </div>
          </div>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</div>
            <div
              style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}
            >
              Route Optimization
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Efficiency & planning
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Training Progress
        </h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            height: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              height: '100%',
              width: `${(completedModules.length / modules.length) * 100}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <span>
            Progress:{' '}
            {Math.round((completedModules.length / modules.length) * 100)}%
          </span>
          <span>
            {completedModules.reduce((total, moduleId) => {
              const module = modules.find((m) => m.id === moduleId);
              return total + (module ? parseInt(module.duration) : 0);
            }, 0)}{' '}
            minutes completed
          </span>
        </div>
      </div>

      {/* Training Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {modules.map((module) => {
          const status = getModuleStatus(module.id);
          return (
            <div
              key={module.id}
              style={{
                background:
                  status === 'completed'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : status === 'current'
                      ? 'rgba(59, 130, 246, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border:
                  status === 'completed'
                    ? '2px solid rgba(16, 185, 129, 0.3)'
                    : status === 'current'
                      ? '2px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                opacity: status === 'locked' ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Module {module.id}: {module.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Duration: {module.duration}
                  </p>
                </div>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      status === 'completed'
                        ? 'rgba(16, 185, 129, 0.3)'
                        : status === 'current'
                          ? 'rgba(59, 130, 246, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                  }}
                >
                  {status === 'completed'
                    ? '✅ Completed'
                    : status === 'current'
                      ? '▶️ Current'
                      : '🔒 Locked'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}
                >
                  Topics Covered:
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                  }}
                >
                  {module.topics.map((topic, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <div style={{ color: '#3b82f6' }}>•</div>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {status !== 'locked' && (
                <button
                  onClick={() => completeModule(module.id)}
                  disabled={status === 'completed'}
                  style={{
                    background:
                      status === 'completed'
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: status === 'completed' ? 'default' : 'pointer',
                    opacity: status === 'completed' ? 0.7 : 1,
                  }}
                >
                  {status === 'completed' ? 'Module Completed' : 'Start Module'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Certificate Section */}
      {showCertificate && (
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '20px',
            padding: '32px',
            marginTop: '32px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            🎉 Congratulations!
          </h2>
          <p
            style={{ fontSize: '16px', color: '#ffffff', marginBottom: '24px' }}
          >
            You are now certified in Dispatch Central Operations!
          </p>
          <button
            style={{
              background: '#ffffff',
              color: '#2563eb',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '16px',
            }}
          >
            Download Certificate
          </button>
          <Link
            href='/university'
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Return to University
          </Link>
        </div>
      )}

      {/* Back to University */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link
          href='/university'
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          ← Back to FleetFlow University
        </Link>
      </div>
    </div>
  );
}
