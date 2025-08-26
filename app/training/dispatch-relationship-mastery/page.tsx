'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CarrierDocumentsChecklist } from './carrier-documents-checklist';
import { DispatchCommunicationScripts } from './communication-scripts';

export default function DispatchRelationshipMasteryTraining() {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Carrier Acquisition & Client Development',
      duration: '55 minutes',
      topics: [
        'Carrier Prospecting Strategies',
        'Cold Calling Techniques for Carriers',
        'Building Trust with New Carriers',
        'Carrier Onboarding Best Practices',
        'Long-term Carrier Relationship Management',
        'Carrier Retention Strategies',
      ],
    },
    {
      id: 2,
      title: 'Load Board Mastery & Navigation',
      duration: '60 minutes',
      topics: [
        'DAT Load Board Advanced Features',
        'Truckstop.com Optimization Techniques',
        '123LoadBoard Professional Usage',
        'Load Board Search Strategies',
        'Rate Analysis & Market Intelligence',
        'Load Board Etiquette & Best Practices',
      ],
    },
    {
      id: 3,
      title: 'Broker Networking & Communication',
      duration: '50 minutes',
      topics: [
        'Professional Broker Outreach',
        'Load Inquiry Communication Scripts',
        'Building Broker Relationships',
        'Email Templates & Phone Strategies',
        'Follow-up Systems & CRM Usage',
        'Professional Networking Events',
      ],
    },
    {
      id: 4,
      title: 'Becoming the Go-To Dispatcher',
      duration: '45 minutes',
      topics: [
        'Reliability & Consistency Building',
        'Proactive Communication Strategies',
        'Problem-Solving Excellence',
        'Value-Added Service Development',
        'Reputation Management',
        'Referral Network Building',
      ],
    },
    {
      id: 5,
      title: 'Transportation Documents Mastery',
      duration: '55 minutes',
      topics: [
        'Carrier Onboarding Document Requirements',
        'MC Authority & DOT Number Verification',
        'Insurance Certificates & Coverage Limits',
        'Bill of Lading (BOL) Management',
        'Rate Confirmations & Load Agreements',
        'Delivery Receipts & POD Requirements',
        'Detention & Accessorial Documentation',
        'W-9 Forms & Tax Documentation',
        'Safety Ratings & CSA Scores',
        'Equipment Inspections & Compliance',
      ],
    },
    {
      id: 6,
      title: 'Advanced Dispatch Operations',
      duration: '40 minutes',
      topics: [
        'Multi-Broker Relationship Management',
        'Load Optimization & Route Planning',
        'Emergency Dispatch Procedures',
        'Performance Metrics & KPIs',
        'Technology Integration & Automation',
        'Continuous Improvement Strategies',
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
              Dispatch Central Relationship Mastery
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Master carrier acquisition, loadboard expertise, and broker
              networking
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
              305 min
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
              4.9★
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Rating
            </div>
          </div>
        </div>
      </div>

      {/* Key Focus Areas */}
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
          🎯 Key Focus Areas
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '24px' }}>🚛</div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                Carrier Acquisition
              </div>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Build your carrier network
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '24px' }}>📊</div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                Load Board Mastery
              </div>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                DAT, Truckstop, 123LoadBoard
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '24px' }}>🤝</div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                Broker Networking
              </div>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Professional relationships
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '24px' }}>⭐</div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                Go-To Dispatcher
              </div>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Become the preferred choice
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Load Board Integration */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>📊</span> Load Board Integration Training
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎯</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                DAT Load Board
              </div>
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Advanced search & rate analysis
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚛</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                Truckstop.com
              </div>
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Professional networking tools
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📋</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                123LoadBoard
              </div>
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Load matching optimization
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Documents Training Highlight */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>🆕</span> NEW: Transportation Documents Mastery Module
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              📋 Carrier Onboarding Documents
            </h4>
            <ul
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                paddingLeft: '20px',
              }}
            >
              <li>MC Authority & DOT Verification</li>
              <li>Insurance Certificates & W-9 Forms</li>
              <li>Safety Ratings & CSA Scores</li>
              <li>Driver Qualification Files</li>
            </ul>
          </div>
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              📅 Document Management
            </h4>
            <ul
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                paddingLeft: '20px',
              }}
            >
              <li>Renewal Tracking Systems</li>
              <li>Compliance Monitoring</li>
              <li>Professional Communication Scripts</li>
              <li>Interactive Document Checklists</li>
            </ul>
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
              const trainingModule = modules.find((m) => m.id === moduleId);
              return (
                total + (trainingModule ? parseInt(trainingModule.duration) : 0)
              );
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

      {/* Communication Scripts & Templates */}
      <DispatchCommunicationScripts />

      {/* Carrier Documents Checklist */}
      <CarrierDocumentsChecklist />

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
            You are now certified in Dispatch Central Relationship Mastery!
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
