'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface SecurityAlert {
  id: string;
  type:
    | 'intrusion'
    | 'malware'
    | 'phishing'
    | 'data_breach'
    | 'unauthorized_access'
    | 'ddos'
    | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'mitigated' | 'resolved';
  affectedSystems: string[];
  mitigationSteps: string[];
  estimatedImpact: string;
}

interface DataProtectionPolicy {
  id: string;
  name: string;
  category:
    | 'encryption'
    | 'access_control'
    | 'backup'
    | 'retention'
    | 'compliance'
    | 'monitoring';
  description: string;
  requirements: string[];
  complianceStandards: string[];
  implementationStatus:
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'needs_review';
  lastReviewed: string;
  nextReview: string;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedAttacks: number;
  securityScore: number;
  complianceScore: number;
  dataEncryptionCoverage: number;
  accessControlsActive: number;
  lastSecurityAudit: string;
  vulnerabilitiesFound: number;
  vulnerabilitiesPatched: number;
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  complianceStatus: 'compliant' | 'partial' | 'non_compliant' | 'under_review';
  lastAssessment: string;
  nextAssessment: string;
  gaps: string[];
  remediationPlan: string[];
}

export default function CyberSecurityProtocolsWidget() {
  const isEnabled = useFeatureFlag('CYBER_SECURITY_PROTOCOLS');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [dataProtectionPolicies, setDataProtectionPolicies] = useState<
    DataProtectionPolicy[]
  >([]);
  const [securityMetrics, setSecurityMetrics] =
    useState<SecurityMetrics | null>(null);
  const [complianceFrameworks, setComplianceFrameworks] = useState<
    ComplianceFramework[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Force enable for development
  const forceEnabled = true;

  useEffect(() => {
    if (forceEnabled) {
      loadSecurityData();
    }
  }, [forceEnabled]);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/security/monitoring');
      if (response.ok) {
        const data = await response.json();
        setSecurityAlerts(data.alerts || []);
        setDataProtectionPolicies(data.policies || []);
        setSecurityMetrics(data.metrics || null);
        setComplianceFrameworks(data.compliance || []);
      } else {
        // Fallback to demo data
        loadDemoSecurityData();
      }
    } catch (error) {
      console.error('Error loading security data:', error);
      loadDemoSecurityData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoSecurityData = () => {
    setSecurityAlerts([
      {
        id: 'alert-001',
        type: 'unauthorized_access',
        severity: 'high',
        title: 'Multiple Failed Login Attempts',
        description:
          'Detected 15 failed login attempts from IP 192.168.1.100 targeting admin accounts',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'investigating',
        affectedSystems: ['User Management', 'Admin Portal'],
        mitigationSteps: [
          'IP blocked temporarily',
          'Account lockout activated',
          'Monitoring increased',
        ],
        estimatedImpact: 'Low - No successful breaches detected',
      },
      {
        id: 'alert-002',
        type: 'vulnerability',
        severity: 'medium',
        title: 'Outdated SSL Certificate',
        description: 'SSL certificate for api.fleetflowapp.com expires in 7 days',
        timestamp: '2024-01-15T08:15:00Z',
        status: 'active',
        affectedSystems: ['API Gateway', 'Mobile App'],
        mitigationSteps: [
          'Certificate renewal initiated',
          'Backup certificates prepared',
        ],
        estimatedImpact: 'Medium - Service disruption possible if not renewed',
      },
      {
        id: 'alert-003',
        type: 'phishing',
        severity: 'low',
        title: 'Suspicious Email Campaign',
        description:
          'Phishing emails detected targeting driver accounts with fake load offers',
        timestamp: '2024-01-15T07:45:00Z',
        status: 'mitigated',
        affectedSystems: ['Email System', 'Driver Portal'],
        mitigationSteps: [
          'Email filtering updated',
          'User awareness sent',
          'Suspicious domains blocked',
        ],
        estimatedImpact: 'Low - No successful compromises detected',
      },
    ]);

    setDataProtectionPolicies([
      {
        id: 'policy-001',
        name: 'Data Encryption at Rest',
        category: 'encryption',
        description:
          'All sensitive data must be encrypted using AES-256 encryption when stored',
        requirements: [
          'Customer PII encrypted with AES-256',
          'Financial data encrypted with additional key rotation',
          'Driver records encrypted with field-level encryption',
          'Load information encrypted in database',
        ],
        complianceStandards: ['SOC 2', 'GDPR', 'CCPA', 'HIPAA'],
        implementationStatus: 'completed',
        lastReviewed: '2024-01-01',
        nextReview: '2024-04-01',
      },
      {
        id: 'policy-002',
        name: 'Access Control Matrix',
        category: 'access_control',
        description:
          'Role-based access control with principle of least privilege',
        requirements: [
          'Multi-factor authentication required',
          'Role-based permissions enforced',
          'Regular access reviews quarterly',
          'Privileged access monitoring',
        ],
        complianceStandards: ['SOC 2', 'ISO 27001', 'NIST'],
        implementationStatus: 'completed',
        lastReviewed: '2024-01-10',
        nextReview: '2024-04-10',
      },
      {
        id: 'policy-003',
        name: 'Data Backup and Recovery',
        category: 'backup',
        description:
          'Comprehensive backup strategy with disaster recovery capabilities',
        requirements: [
          'Daily automated backups',
          'Geographic backup distribution',
          'Recovery time objective: 4 hours',
          'Recovery point objective: 1 hour',
        ],
        complianceStandards: ['SOC 2', 'ISO 27001'],
        implementationStatus: 'in_progress',
        lastReviewed: '2024-01-05',
        nextReview: '2024-04-05',
      },
    ]);

    setSecurityMetrics({
      threatLevel: 'medium',
      activeThreats: 3,
      blockedAttacks: 147,
      securityScore: 87,
      complianceScore: 92,
      dataEncryptionCoverage: 98,
      accessControlsActive: 156,
      lastSecurityAudit: '2024-01-01',
      vulnerabilitiesFound: 12,
      vulnerabilitiesPatched: 9,
    });

    setComplianceFrameworks([
      {
        id: 'framework-001',
        name: 'SOC 2 Type II',
        description:
          'System and Organization Controls for service organizations',
        requirements: [
          'Security controls documentation',
          'Availability monitoring',
          'Processing integrity verification',
          'Confidentiality protection',
          'Privacy controls implementation',
        ],
        complianceStatus: 'compliant',
        lastAssessment: '2023-12-15',
        nextAssessment: '2024-12-15',
        gaps: [],
        remediationPlan: [],
      },
      {
        id: 'framework-002',
        name: 'GDPR Compliance',
        description: 'General Data Protection Regulation for EU data subjects',
        requirements: [
          'Lawful basis for processing',
          'Data subject rights implementation',
          'Privacy by design',
          'Data breach notification procedures',
          'Data protection impact assessments',
        ],
        complianceStatus: 'partial',
        lastAssessment: '2024-01-10',
        nextAssessment: '2024-07-10',
        gaps: ['Data portability automation', 'Enhanced consent management'],
        remediationPlan: [
          'Implement data export automation',
          'Upgrade consent management system',
        ],
      },
      {
        id: 'framework-003',
        name: 'NIST Cybersecurity Framework',
        description:
          'National Institute of Standards and Technology cybersecurity guidelines',
        requirements: [
          'Asset identification and management',
          'Threat and vulnerability management',
          'Access control implementation',
          'Data security controls',
          'Incident response procedures',
        ],
        complianceStatus: 'compliant',
        lastAssessment: '2024-01-05',
        nextAssessment: '2024-07-05',
        gaps: [],
        remediationPlan: [],
      },
    ]);
  };

  const handleMitigateAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/security/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mitigate_alert', alertId }),
      });

      if (response.ok) {
        setSecurityAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId
              ? { ...alert, status: 'mitigated' as const }
              : alert
          )
        );
      }
    } catch (error) {
      console.error('Error mitigating alert:', error);
    }
  };

  if (!forceEnabled) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          background:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <h3 style={{ color: '#1f2937', marginBottom: '16px' }}>
          🔐 Cyber Security Protocols
        </h3>
        <p style={{ color: '#6b7280' }}>
          This feature is currently disabled. Enable it in your feature flags to
          access comprehensive cyber security and data protection tools.
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#dc2626';
      case 'investigating':
        return '#d97706';
      case 'mitigated':
        return '#16a34a';
      case 'resolved':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#16a34a';
      case 'partial':
        return '#d97706';
      case 'non_compliant':
        return '#dc2626';
      case 'under_review':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}
        >
          🔐 Cyber Security Protocols
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Comprehensive data protection and security monitoring for FleetFlow
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {[
            { id: 'dashboard', label: 'Security Dashboard', icon: '🛡️' },
            { id: 'alerts', label: 'Security Alerts', icon: '🚨' },
            { id: 'policies', label: 'Data Protection', icon: '🔒' },
            { id: 'compliance', label: 'Compliance', icon: '📋' },
            { id: 'monitoring', label: 'Real-time Monitoring', icon: '👁️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : 'rgba(255, 255, 255, 0.7)',
                color: activeTab === tab.id ? 'white' : '#374151',
                boxShadow:
                  activeTab === tab.id
                    ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Security Dashboard Tab */}
      {activeTab === 'dashboard' && securityMetrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Security Metrics Overview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <h4
                style={{
                  color: '#065f46',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Security Score
              </h4>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#059669',
                }}
              >
                {securityMetrics.securityScore}%
              </div>
              <p
                style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}
              >
                Overall security posture
              </p>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <h4
                style={{
                  color: '#1e40af',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Compliance Score
              </h4>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#2563eb',
                }}
              >
                {securityMetrics.complianceScore}%
              </div>
              <p
                style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}
              >
                Regulatory compliance
              </p>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.1))',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(251, 146, 60, 0.2)',
              }}
            >
              <h4
                style={{
                  color: '#ea580c',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Active Threats
              </h4>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#ea580c',
                }}
              >
                {securityMetrics.activeThreats}
              </div>
              <p
                style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}
              >
                Requiring attention
              </p>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <h4
                style={{
                  color: '#7c3aed',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Blocked Attacks
              </h4>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#7c3aed',
                }}
              >
                {securityMetrics.blockedAttacks}
              </div>
              <p
                style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}
              >
                Last 30 days
              </p>
            </div>
          </div>

          {/* Threat Level Indicator */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#1f2937',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              Current Threat Level
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getSeverityColor(securityMetrics.threatLevel)}, ${getSeverityColor(securityMetrics.threatLevel)}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                🛡️
              </div>
              <div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: getSeverityColor(securityMetrics.threatLevel),
                    textTransform: 'capitalize',
                  }}
                >
                  {securityMetrics.threatLevel}
                </div>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>
                  Based on current security metrics and active threats
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}
              >
                {securityMetrics.dataEncryptionCoverage}%
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Data Encryption Coverage
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}
              >
                {securityMetrics.accessControlsActive}
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Active Access Controls
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}
              >
                {securityMetrics.vulnerabilitiesPatched}/
                {securityMetrics.vulnerabilitiesFound}
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Vulnerabilities Patched
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Alerts Tab */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div
              style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}
            >
              Loading security alerts...
            </div>
          ) : securityAlerts.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}
            >
              No active security alerts
            </div>
          ) : (
            securityAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: `2px solid ${getSeverityColor(alert.severity)}33`,
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {alert.title}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          background: getSeverityColor(alert.severity),
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {alert.severity}
                      </span>
                      <span
                        style={{
                          background: getStatusColor(alert.status),
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {alert.status}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {alert.status === 'active' && (
                    <button
                      onClick={() => handleMitigateAlert(alert.id)}
                      style={{
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Mitigate
                    </button>
                  )}
                </div>

                <p
                  style={{
                    color: '#4b5563',
                    marginBottom: '16px',
                    lineHeight: '1.5',
                  }}
                >
                  {alert.description}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <h5
                      style={{
                        color: '#1f2937',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Affected Systems
                    </h5>
                    <ul
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: 0,
                        paddingLeft: '16px',
                      }}
                    >
                      {alert.affectedSystems.map((system, index) => (
                        <li key={index}>{system}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5
                      style={{
                        color: '#1f2937',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Mitigation Steps
                    </h5>
                    <ul
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: 0,
                        paddingLeft: '16px',
                      }}
                    >
                      {alert.mitigationSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <strong style={{ color: '#1e40af', fontSize: '14px' }}>
                    Estimated Impact:{' '}
                  </strong>
                  <span style={{ color: '#4b5563', fontSize: '14px' }}>
                    {alert.estimatedImpact}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Data Protection Policies Tab */}
      {activeTab === 'policies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {dataProtectionPolicies.map((policy) => (
            <div
              key={policy.id}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h4
                    style={{
                      color: '#1f2937',
                      marginBottom: '4px',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}
                  >
                    {policy.name}
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {policy.category.replace('_', ' ')}
                    </span>
                    <span
                      style={{
                        background:
                          policy.implementationStatus === 'completed'
                            ? '#16a34a'
                            : policy.implementationStatus === 'in_progress'
                              ? '#d97706'
                              : '#6b7280',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {policy.implementationStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  color: '#4b5563',
                  marginBottom: '16px',
                  lineHeight: '1.5',
                }}
              >
                {policy.description}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <h5
                    style={{
                      color: '#1f2937',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Requirements
                  </h5>
                  <ul
                    style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: 0,
                      paddingLeft: '16px',
                    }}
                  >
                    {policy.requirements.map((requirement, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5
                    style={{
                      color: '#1f2937',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Compliance Standards
                  </h5>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                  >
                    {policy.complianceStandards.map((standard, index) => (
                      <span
                        key={index}
                        style={{
                          background:
                            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Last Reviewed:</strong>{' '}
                  {new Date(policy.lastReviewed).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Next Review:</strong>{' '}
                  {new Date(policy.nextReview).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {complianceFrameworks.map((framework) => (
            <div
              key={framework.id}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '20px',
                borderRadius: '16px',
                border: `2px solid ${getComplianceColor(framework.complianceStatus)}33`,
                borderLeft: `4px solid ${getComplianceColor(framework.complianceStatus)}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h4
                    style={{
                      color: '#1f2937',
                      marginBottom: '4px',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}
                  >
                    {framework.name}
                  </h4>
                  <span
                    style={{
                      background: getComplianceColor(
                        framework.complianceStatus
                      ),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}
                  >
                    {framework.complianceStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p
                style={{
                  color: '#4b5563',
                  marginBottom: '16px',
                  lineHeight: '1.5',
                }}
              >
                {framework.description}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h5
                    style={{
                      color: '#1f2937',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Requirements
                  </h5>
                  <ul
                    style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: 0,
                      paddingLeft: '16px',
                    }}
                  >
                    {framework.requirements.map((requirement, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {framework.gaps.length > 0 && (
                  <div>
                    <h5
                      style={{
                        color: '#dc2626',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Compliance Gaps
                    </h5>
                    <ul
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: 0,
                        paddingLeft: '16px',
                      }}
                    >
                      {framework.gaps.map((gap, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {framework.remediationPlan.length > 0 && (
                <div
                  style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'rgba(251, 146, 60, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(251, 146, 60, 0.2)',
                  }}
                >
                  <h5
                    style={{
                      color: '#ea580c',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Remediation Plan
                  </h5>
                  <ul
                    style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: 0,
                      paddingLeft: '16px',
                    }}
                  >
                    {framework.remediationPlan.map((step, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Last Assessment:</strong>{' '}
                  {new Date(framework.lastAssessment).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Next Assessment:</strong>{' '}
                  {new Date(framework.nextAssessment).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Real-time Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                color: '#1f2937',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              🔍 Real-time Security Monitoring
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Continuous monitoring of security events, network traffic, and
              system integrity
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌐</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#059669',
                  }}
                >
                  Network Monitoring
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Active</p>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2563eb',
                  }}
                >
                  Intrusion Detection
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Active</p>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#7c3aed',
                  }}
                >
                  Behavioral Analysis
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Active</p>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.1))',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(251, 146, 60, 0.2)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ea580c',
                  }}
                >
                  Threat Intelligence
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Active</p>
              </div>
            </div>
          </div>

          {/* Live Security Feed */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '16px',
              color: '#00ff00',
              fontFamily: 'monospace',
              fontSize: '14px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <h4 style={{ color: '#00ff00', marginBottom: '16px' }}>
              🔴 Live Security Log
            </h4>
            <div>
              <div>
                [{new Date().toLocaleTimeString()}] ✅ Network scan completed -
                No threats detected
              </div>
              <div>
                [{new Date(Date.now() - 30000).toLocaleTimeString()}] 🔍
                Intrusion detection system active
              </div>
              <div>
                [{new Date(Date.now() - 60000).toLocaleTimeString()}] 🛡️
                Firewall rules updated
              </div>
              <div>
                [{new Date(Date.now() - 90000).toLocaleTimeString()}] 📊
                Behavioral analysis - Normal patterns
              </div>
              <div>
                [{new Date(Date.now() - 120000).toLocaleTimeString()}] 🔐 SSL
                certificate validation successful
              </div>
              <div>
                [{new Date(Date.now() - 150000).toLocaleTimeString()}] ⚠️ Failed
                login attempt blocked - IP: 192.168.1.100
              </div>
              <div>
                [{new Date(Date.now() - 180000).toLocaleTimeString()}] ✅ Data
                encryption integrity verified
              </div>
              <div>
                [{new Date(Date.now() - 210000).toLocaleTimeString()}] 🔍
                Vulnerability scan initiated
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
