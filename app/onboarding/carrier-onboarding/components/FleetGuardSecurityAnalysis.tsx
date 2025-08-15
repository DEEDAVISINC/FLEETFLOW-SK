'use client';

import React, { useEffect, useState } from 'react';
import { EnhancedCarrierService } from '../../../services/enhanced-carrier-service';
import { FraudGuardService } from '../../../services/fraud-guard-service';

interface FleetGuardSecurityAnalysisProps {
  onAnalysisComplete: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  carrierData?: any;
}

interface SecurityAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  primaryRiskFactors: string[];
  recommendations: string[];
  detailedAnalysis: {
    addressRisk: any;
    documentRisk: any;
    behaviorRisk: any;
    complianceRisk: any;
  };
  financialData?: {
    creditScore: string;
    paymentHistory: string;
    averagePaymentDays: number;
    trackingEnabled: boolean;
  };
  dataSource: string;
}

export const FleetGuardSecurityAnalysis: React.FC<
  FleetGuardSecurityAnalysisProps
> = ({ onAnalysisComplete, onNext, onBack, carrierData }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SecurityAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const fraudGuardService = new FraudGuardService();
  const carrierService = new EnhancedCarrierService();

  useEffect(() => {
    if (carrierData && !analysisResult && !isAnalyzing) {
      runSecurityAnalysis();
    }
  }, [carrierData]);

  const runSecurityAnalysis = async () => {
    if (!carrierData) {
      setError('No carrier data available for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      console.log(
        '🛡️ FleetGuard AI: Starting comprehensive security analysis...'
      );

      // Step 1: Get enhanced carrier data with BrokerSnapshot
      let comprehensiveData = null;
      let brokerSnapshotData = null;

      try {
        if (carrierData.mcNumber) {
          comprehensiveData = await carrierService.verifyCarrierComprehensive(
            carrierData.mcNumber
          );
          if (!comprehensiveData) {
            brokerSnapshotData = await carrierService.getCarrierBrokerSnapshot(
              carrierData.mcNumber
            );
          }
        }
      } catch (error) {
        console.log(
          '⚠️ Enhanced data unavailable, using FMCSA data for analysis'
        );
      }

      // Step 2: Prepare analysis data
      const analysisData = {
        mcNumber: carrierData.mcNumber,
        dotNumber: carrierData.dotNumber,
        companyName: carrierData.legalName || carrierData.companyName,
        physicalAddress: carrierData.physicalAddress,
        mailingAddress:
          carrierData.mailingAddress || carrierData.physicalAddress,
        phone: carrierData.phone,
        safetyRating: carrierData.safetyRating,
        operatingStatus: carrierData.operatingStatus || 'ACTIVE',
        // Enhanced with BrokerSnapshot data if available
        creditScore:
          comprehensiveData?.creditScore || brokerSnapshotData?.creditScore,
        paymentHistory:
          comprehensiveData?.paymentHistory ||
          brokerSnapshotData?.paymentHistory,
        averagePaymentDays:
          comprehensiveData?.averagePaymentDays ||
          brokerSnapshotData?.averagePaymentDays,
        trackingEnabled:
          comprehensiveData?.trackingEnabled ||
          brokerSnapshotData?.trackingEnabled,
      };

      // Step 3: Run comprehensive fraud analysis
      const fraudAnalysis =
        await fraudGuardService.assessFraudRisk(analysisData);

      // Step 4: Format results for display
      const result: SecurityAnalysisResult = {
        riskLevel: fraudAnalysis.riskLevel,
        confidence: fraudAnalysis.confidence,
        primaryRiskFactors: fraudAnalysis.primaryRiskFactors || [],
        recommendations: fraudAnalysis.recommendations || [],
        detailedAnalysis: {
          addressRisk: fraudAnalysis.addressRisk || {},
          documentRisk: fraudAnalysis.documentRisk || {},
          behaviorRisk: fraudAnalysis.behaviorRisk || {},
          complianceRisk: fraudAnalysis.complianceRisk || {},
        },
        financialData: analysisData.creditScore
          ? {
              creditScore: analysisData.creditScore,
              paymentHistory: analysisData.paymentHistory || 'Not Available',
              averagePaymentDays: analysisData.averagePaymentDays || 0,
              trackingEnabled: analysisData.trackingEnabled || false,
            }
          : undefined,
        dataSource: comprehensiveData
          ? 'COMPREHENSIVE'
          : brokerSnapshotData
            ? 'BROKERSNAPSHOT'
            : 'FMCSA',
      };

      setAnalysisResult(result);
      setAnalysisComplete(true);

      // Pass analysis data to parent workflow
      onAnalysisComplete({
        fleetGuardAnalysis: result,
        analysisTimestamp: new Date().toISOString(),
        carrierApproved: result.riskLevel !== 'high',
      });

      console.log('✅ FleetGuard AI: Security analysis complete', result);
    } catch (error) {
      console.error('❌ FleetGuard AI analysis failed:', error);
      setError(
        'Security analysis failed. Please try again or proceed with manual review.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getRiskLevelBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'rgba(16, 185, 129, 0.1)';
      case 'medium':
        return 'rgba(245, 158, 11, 0.1)';
      case 'high':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0 0 16px 0',
              background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FleetGuard AI Security Analysis
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Comprehensive fraud detection and carrier risk assessment using
            FMCSA safety data and BrokerSnapshot financial intelligence
          </p>
        </div>

        {/* Carrier Information */}
        {carrierData && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Analyzing Carrier:{' '}
              {carrierData.legalName || carrierData.companyName}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  MC Number
                </div>
                <div style={{ fontWeight: '600' }}>{carrierData.mcNumber}</div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  DOT Number
                </div>
                <div style={{ fontWeight: '600' }}>{carrierData.dotNumber}</div>
              </div>
              <div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  Safety Rating
                </div>
                <div style={{ fontWeight: '600' }}>
                  {carrierData.safetyRating}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Status */}
        {isAnalyzing && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 24px auto',
              }}
            ></div>
            <h3 style={{ margin: '0 0 12px 0' }}>
              Running Security Analysis...
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Analyzing carrier data, financial history, and fraud indicators
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div style={{ marginBottom: '32px' }}>
            {/* Risk Level Summary */}
            <div
              style={{
                background: getRiskLevelBg(analysisResult.riskLevel),
                border: `2px solid ${getRiskLevelColor(analysisResult.riskLevel)}`,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <h2
                style={{
                  margin: '0 0 12px 0',
                  color: getRiskLevelColor(analysisResult.riskLevel),
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontSize: '1.8rem',
                }}
              >
                {analysisResult.riskLevel} Risk
              </h2>
              <div
                style={{
                  fontSize: '1.1rem',
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Analysis Confidence:{' '}
                {Math.round(analysisResult.confidence * 100)}%
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  display: 'inline-block',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Data Source:{' '}
                {analysisResult.dataSource === 'COMPREHENSIVE'
                  ? '🔗 FMCSA + BrokerSnapshot'
                  : analysisResult.dataSource === 'BROKERSNAPSHOT'
                    ? '📊 BrokerSnapshot'
                    : '📋 FMCSA Data'}
              </div>
            </div>

            {/* Risk Factors */}
            {analysisResult.primaryRiskFactors.length > 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  🚨 Risk Factors Identified
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysisResult.primaryRiskFactors.map((factor, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        color: '#fca5a5',
                      }}
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Data */}
            {analysisResult.financialData && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  📊 Financial Intelligence
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                      }}
                    >
                      Credit Score
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '18px',
                        color:
                          parseInt(analysisResult.financialData.creditScore) >=
                          700
                            ? '#10b981'
                            : parseInt(
                                  analysisResult.financialData.creditScore
                                ) >= 650
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    >
                      {analysisResult.financialData.creditScore}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                      }}
                    >
                      Payment History
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '18px',
                        color:
                          analysisResult.financialData.paymentHistory ===
                          'Excellent'
                            ? '#10b981'
                            : analysisResult.financialData.paymentHistory ===
                                'Good'
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    >
                      {analysisResult.financialData.paymentHistory}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                      }}
                    >
                      Avg Payment Days
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '18px',
                        color:
                          analysisResult.financialData.averagePaymentDays <= 30
                            ? '#10b981'
                            : analysisResult.financialData.averagePaymentDays <=
                                45
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    >
                      {analysisResult.financialData.averagePaymentDays} days
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                      }}
                    >
                      Tracking
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '18px',
                        color: analysisResult.financialData.trackingEnabled
                          ? '#10b981'
                          : '#ef4444',
                      }}
                    >
                      {analysisResult.financialData.trackingEnabled
                        ? 'Enabled'
                        : 'Disabled'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations.length > 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  💡 Recommendations
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {analysisResult.recommendations.map(
                    (recommendation, index) => (
                      <li
                        key={index}
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          lineHeight: '1.5',
                        }}
                      >
                        {recommendation}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#fca5a5' }}>
              Analysis Error
            </h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px',
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: '16px' }}>
            {!analysisComplete && !isAnalyzing && (
              <button
                onClick={runSecurityAnalysis}
                disabled={!carrierData}
                style={{
                  background: carrierData
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: carrierData ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: carrierData ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (carrierData) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (carrierData) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                🛡️ Run Security Analysis
              </button>
            )}

            {analysisComplete && (
              <button
                onClick={onNext}
                style={{
                  background:
                    analysisResult?.riskLevel === 'high'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {analysisResult?.riskLevel === 'high'
                  ? '⚠️ Proceed with Caution'
                  : '✅ Continue Onboarding'}{' '}
                →
              </button>
            )}
          </div>
        </div>
      </div>

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
};
