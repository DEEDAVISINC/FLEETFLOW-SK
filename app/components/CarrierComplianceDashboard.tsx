'use client';

import { useEffect, useState } from 'react';

interface CarrierComplianceProps {
  carrierId: string;
  dotNumber: string;
  userRole?: 'carrier' | 'driver' | 'admin';
  simplified?: boolean;
}

interface DocumentStatus {
  id: string;
  name: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  expirationDate?: string;
  daysRemaining?: number;
}

interface ComplianceData {
  overallScore: number;
  safetyRating: string;
  riskLevel: 'low' | 'medium' | 'high';
  documents: DocumentStatus[];
  alerts: {
    critical: string[];
    warnings: string[];
    upcoming: string[];
  };
  lastUpdated: string;
}

const CarrierComplianceDashboard: React.FC<CarrierComplianceProps> = ({
  carrierId,
  dotNumber,
  userRole = 'carrier',
  simplified = false,
}) => {
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplianceData = async () => {
      if (!dotNumber) return;

      try {
        setLoading(true);

        // Call the compliance API
        const response = await fetch('/api/dot/compliance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getProfile',
            dotNumber,
            carrierId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch compliance data');
        }

        const result = await response.json();

        if (result.success) {
          // Transform the data to match our component's structure
          const transformedData: ComplianceData = {
            overallScore: result.profile.complianceScore || 0,
            safetyRating: result.profile.safetyRating || 'UNRATED',
            riskLevel: getRiskLevel(result.profile.complianceScore),
            documents: transformDocuments(result.profile.documents || []),
            alerts: result.alerts || {
              critical: [],
              warnings: [],
              upcoming: [],
            },
            lastUpdated: new Date().toISOString(),
          };

          setComplianceData(transformedData);
          setError(null);
        } else {
          throw new Error(
            result.error || 'Unknown error fetching compliance data'
          );
        }
      } catch (err) {
        console.error('Error fetching compliance data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // Fallback mock data
        setComplianceData(getMockComplianceData(dotNumber));
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, [carrierId, dotNumber]);

  // Helper function to determine risk level from score
  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  };

  // Transform document data
  const transformDocuments = (documents: any[]): DocumentStatus[] => {
    return documents.map((doc) => {
      const expirationDate = doc.expirationDate
        ? new Date(doc.expirationDate)
        : null;
      const today = new Date();
      const daysRemaining = expirationDate
        ? Math.ceil(
            (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0;

      let status: 'valid' | 'expiring' | 'expired' | 'missing';

      if (!expirationDate) {
        status = 'missing';
      } else if (daysRemaining < 0) {
        status = 'expired';
      } else if (daysRemaining < 30) {
        status = 'expiring';
      } else {
        status = 'valid';
      }

      return {
        id: doc.id || `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: doc.name || doc.type || 'Unknown Document',
        status,
        expirationDate: expirationDate?.toISOString(),
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      };
    });
  };

  // Mock data for fallback
  const getMockComplianceData = (dotNumber: string): ComplianceData => {
    return {
      overallScore: 78,
      safetyRating: 'SATISFACTORY',
      riskLevel: 'medium',
      documents: [
        {
          id: 'doc-1',
          name: 'Operating Authority',
          status: 'valid',
          expirationDate: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          daysRemaining: 90,
        },
        {
          id: 'doc-2',
          name: 'Insurance Certificate',
          status: 'expiring',
          expirationDate: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(),
          daysRemaining: 15,
        },
        {
          id: 'doc-3',
          name: 'Drug & Alcohol Policy',
          status: 'missing',
        },
      ],
      alerts: {
        critical: ['Insurance certificate expires in 15 days'],
        warnings: ['Driver qualification file incomplete for one driver'],
        upcoming: ['Annual DOT inspection due next month'],
      },
      lastUpdated: new Date().toISOString(),
    };
  };

  // Get the appropriate color for the risk level
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return '#10b981'; // Green
      case 'medium':
        return '#f59e0b'; // Amber
      case 'high':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  // Simplified view (for embedding in other pages)
  if (simplified && complianceData) {
    return (
      <div
        className='compliance-widget'
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            DOT Compliance Status
          </h3>
          <div
            style={{
              background: getRiskColor(complianceData.riskLevel),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {complianceData.riskLevel.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              Compliance Score
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {complianceData.overallScore}%
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              Safety Rating
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {complianceData.safetyRating}
            </div>
          </div>
        </div>

        {(complianceData.alerts.critical.length > 0 ||
          complianceData.alerts.warnings.length > 0) && (
          <div
            style={{
              background:
                complianceData.alerts.critical.length > 0
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.8rem',
            }}
          >
            <strong>
              {complianceData.alerts.critical.length > 0
                ? '🚨 Critical Issues:'
                : '⚠️ Warnings:'}
            </strong>
            <p style={{ margin: '4px 0 0' }}>
              {complianceData.alerts.critical.length > 0
                ? complianceData.alerts.critical[0]
                : complianceData.alerts.warnings[0]}

              {complianceData.alerts.critical.length +
                complianceData.alerts.warnings.length >
                1 &&
                ` (+${complianceData.alerts.critical.length + complianceData.alerts.warnings.length - 1} more)`}
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '0.8rem',
            opacity: 0.7,
          }}
        >
          <a
            href='/carriers/compliance'
            style={{ color: 'white', textDecoration: 'none' }}
          >
            View Full Compliance Dashboard →
          </a>
        </div>
      </div>
    );
  }

  // Full dashboard view
  return (
    <div
      className='carrier-compliance-dashboard'
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Loading compliance data...
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              margin: '0 auto',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
           />
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
      ) : error ? (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              marginBottom: '10px',
              color: '#ef4444',
            }}
          >
            Error
          </div>
          <div>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      ) : complianceData ? (
        <>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              DOT Compliance Dashboard
            </h2>
            <div
              style={{
                background: getRiskColor(complianceData.riskLevel),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              {complianceData.riskLevel.toUpperCase()} RISK
            </div>
          </div>

          {/* Compliance Score */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                DOT Number
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {dotNumber}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                Compliance Score
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {complianceData.overallScore}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                Safety Rating
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {complianceData.safetyRating}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                Last Updated
              </span>
              <div style={{ fontSize: '0.875rem' }}>
                {new Date(complianceData.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '12px' }}>
              Compliance Alerts
            </h3>

            {complianceData.alerts.critical.length > 0 && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  🚨 Critical Issues
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {complianceData.alerts.critical.map((alert, index) => (
                    <li key={`critical-${index}`}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceData.alerts.warnings.length > 0 && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  ⚠️ Warnings
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {complianceData.alerts.warnings.map((alert, index) => (
                    <li key={`warning-${index}`}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceData.alerts.upcoming.length > 0 && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  📅 Upcoming Deadlines
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {complianceData.alerts.upcoming.map((alert, index) => (
                    <li key={`upcoming-${index}`}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {complianceData.alerts.critical.length === 0 &&
              complianceData.alerts.warnings.length === 0 &&
              complianceData.alerts.upcoming.length === 0 && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  ✅ No compliance issues to report. All systems green.
                </div>
              )}
          </div>

          {/* Document Status */}
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '12px' }}>
              Document Status
            </h3>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <th style={{ padding: '12px', textAlign: 'left' }}>
                      Document Name
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>
                      Status
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>
                      Expiration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complianceData.documents.map((doc) => (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <td style={{ padding: '12px' }}>{doc.name}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'inline-block',
                            background:
                              doc.status === 'valid'
                                ? '#10b981'
                                : doc.status === 'expiring'
                                  ? '#f59e0b'
                                  : doc.status === 'expired'
                                    ? '#ef4444'
                                    : '#6b7280',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {doc.status.toUpperCase()}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {doc.expirationDate ? (
                          <>
                            {new Date(doc.expirationDate).toLocaleDateString()}
                            {doc.daysRemaining !== undefined &&
                              doc.daysRemaining < 30 && (
                                <span
                                  style={{
                                    marginLeft: '8px',
                                    fontSize: '0.75rem',
                                    color:
                                      doc.daysRemaining <= 0
                                        ? '#ef4444'
                                        : '#f59e0b',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {doc.daysRemaining <= 0
                                    ? 'EXPIRED'
                                    : `${doc.daysRemaining} days left`}
                                </span>
                              )}
                          </>
                        ) : (
                          <span style={{ opacity: 0.5 }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <button
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📄 Generate Compliance Documents
            </button>

            <button
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              🔄 Refresh Compliance Data
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>No compliance data available</div>
        </div>
      )}
    </div>
  );
};

export default CarrierComplianceDashboard;
