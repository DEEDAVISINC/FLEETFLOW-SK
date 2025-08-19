'use client';

import { useEffect, useState } from 'react';

interface OnboardingComplianceCheckProps {
  carrierId: string;
  dotNumber: string;
  companyName: string;
  onVerificationComplete: (result: ComplianceVerificationResult) => void;
  onboardingStep: number;
  totalSteps: number;
}

interface ComplianceVerificationResult {
  success: boolean;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  missingDocuments: string[];
  message: string;
  verificationDetails: any;
}

const OnboardingComplianceCheck: React.FC<OnboardingComplianceCheckProps> = ({
  carrierId,
  dotNumber,
  companyName,
  onVerificationComplete,
  onboardingStep,
  totalSteps,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<string>('not_started');
  const [verificationResult, setVerificationResult] =
    useState<ComplianceVerificationResult | null>(null);

  useEffect(() => {
    if (onboardingStep === 2) {
      // Assuming step 2 is the verification step
      startVerification();
    }
  }, [onboardingStep]);

  const startVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      setVerificationStatus('in_progress');

      // Call the verification API
      const response = await fetch('/api/onboarding/compliance-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carrierId,
          dotNumber,
          companyName,
          // In a real implementation, documents would be uploaded separately and referenced here
          documents: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Process the verification results
      const verification = data.verification;
      const result: ComplianceVerificationResult = {
        success: true,
        status: verification.overallStatus,
        score: verification.complianceScore,
        riskLevel: verification.riskLevel,
        missingDocuments: verification.missingDocuments || [],
        message: getStatusMessage(verification),
        verificationDetails: verification,
      };

      setVerificationResult(result);
      setVerificationStatus(verification.overallStatus);

      // Call the callback with the results
      onVerificationComplete(result);
    } catch (err) {
      console.error('Compliance verification error:', err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Unknown error during compliance verification';
      setError(errorMessage);

      // Call the callback with failure
      onVerificationComplete({
        success: false,
        status: 'pending',
        score: 0,
        riskLevel: 'high',
        missingDocuments: [],
        message: errorMessage,
        verificationDetails: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate status message
  const getStatusMessage = (verification: any): string => {
    switch (verification.overallStatus) {
      case 'approved':
        return 'Compliance verification successful. Your carrier profile meets all requirements.';
      case 'rejected':
        return 'Compliance verification failed. Your carrier profile does not meet requirements.';
      case 'in_progress':
        return `Compliance verification in progress. ${verification.missingDocuments.length} required documents are still needed.`;
      case 'pending':
        return 'Compliance verification pending. Please complete document submission.';
      default:
        return 'Waiting to start compliance verification process.';
    }
  };

  // Helper to get color for status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return '#22c55e';
      case 'rejected':
        return '#ef4444';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  // Render appropriate step based on verification status
  const renderVerificationStep = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255,255,255,0.1)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            Verifying DOT Compliance
          </div>
          <div style={{ color: '#6b7280' }}>Checking DOT #: {dotNumber}</div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            color: '#ef4444',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            Verification Error
          </div>
          <div style={{ marginBottom: '16px' }}>{error}</div>
          <button
            onClick={startVerification}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (verificationResult) {
      const statusColor = getStatusColor(verificationResult.status);

      return (
        <div
          style={{
            background: `rgba(${statusColor === '#22c55e' ? '34, 197, 94' : statusColor === '#ef4444' ? '239, 68, 68' : '59, 130, 246'}, 0.1)`,
            border: `1px solid rgba(${statusColor === '#22c55e' ? '34, 197, 94' : statusColor === '#ef4444' ? '239, 68, 68' : '59, 130, 246'}, 0.3)`,
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                background: statusColor,
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px',
                color: 'white',
              }}
            >
              {verificationResult.status === 'approved'
                ? '✓'
                : verificationResult.status === 'rejected'
                  ? '✗'
                  : '!'}
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              {verificationResult.status === 'approved'
                ? 'Verification Successful'
                : verificationResult.status === 'rejected'
                  ? 'Verification Failed'
                  : 'Verification In Progress'}
            </div>
            <div>{verificationResult.message}</div>
          </div>

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
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}
              >
                Compliance Score
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color:
                    verificationResult.score >= 80
                      ? '#22c55e'
                      : verificationResult.score >= 60
                        ? '#f59e0b'
                        : '#ef4444',
                }}
              >
                {verificationResult.score}%
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}
              >
                Risk Level
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color:
                    verificationResult.riskLevel === 'low'
                      ? '#22c55e'
                      : verificationResult.riskLevel === 'medium'
                        ? '#f59e0b'
                        : '#ef4444',
                }}
              >
                {verificationResult.riskLevel.toUpperCase()}
              </div>
            </div>
          </div>

          {verificationResult.missingDocuments.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Required Documents Missing:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {verificationResult.missingDocuments.map((doc, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    {doc
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verificationResult.status !== 'approved' && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={startVerification}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Recheck Compliance Status
              </button>
            </div>
          )}
        </div>
      );
    }

    // Initial state - ready to start verification
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 0',
        }}
      >
        <div
          style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}
        >
          DOT Compliance Verification
        </div>
        <div style={{ color: '#6b7280', marginBottom: '24px' }}>
          We will verify your DOT #: {dotNumber} and compliance status
        </div>
        <button
          onClick={startVerification}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Start Verification
        </button>
      </div>
    );
  };

  return (
    <div className='onboarding-compliance-check'>
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
      {renderVerificationStep()}
    </div>
  );
};

export default OnboardingComplianceCheck;
