'use client';

import React from 'react';

interface CertificationProps {
  userName: string;
  userRole: 'dispatcher' | 'broker';
  score: number;
  passed: boolean;
  certificateId: string;
  completedDate: string;
  onDownload: () => void;
  onRetake?: () => void;
}

export const CarrierOnboardWorkflowCertification: React.FC<
  CertificationProps
> = ({
  userName,
  userRole,
  score,
  passed,
  certificateId,
  completedDate,
  onDownload,
  onRetake,
}) => {
  const requiredScore = userRole === 'broker' ? 90 : 80;
  const currentDate = new Date().toLocaleDateString();
  const expirationDate = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toLocaleDateString(); // 1 year from now

  if (passed) {
    return (
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* Success Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h1
            style={{
              color: '#10b981',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Congratulations!
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
            You have successfully completed the Carrier Onboard Workflow
            Training
          </p>
        </div>

        {/* Certificate Details */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginBottom: '24px',
            }}
          >
            <div>
              <h3
                style={{
                  color: '#10b981',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                }}
              >
                Trainee
              </h3>
              <p
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                {userName}
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: '#10b981',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                }}
              >
                Role
              </h3>
              <p
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                }}
              >
                {userRole}
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: '#10b981',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                }}
              >
                Score
              </h3>
              <p
                style={{
                  color: '#10b981',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                }}
              >
                {score}%
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: '#10b981',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                }}
              >
                Completed
              </h3>
              <p
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                {new Date(completedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              paddingTop: '16px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: 'white' }}>Certificate ID:</strong>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginLeft: '8px',
                  fontFamily: 'monospace',
                }}
              >
                {certificateId}
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: 'white' }}>Issued:</strong>
              <span
                style={{ color: 'rgba(255, 255, 255, 0.8)', marginLeft: '8px' }}
              >
                {currentDate}
              </span>
            </div>
            <div>
              <strong style={{ color: 'white' }}>Valid Until:</strong>
              <span
                style={{ color: 'rgba(255, 255, 255, 0.8)', marginLeft: '8px' }}
              >
                {expirationDate}
              </span>
            </div>
          </div>
        </div>

        {/* Achievement Summary */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ color: '#10b981', marginBottom: '16px' }}>
            🏆 Training Achievements
          </h3>
          <div style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              ✅ Completed all 5 training modules
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              ✅ Passed final assessment with {score}% (required:{' '}
              {requiredScore}%+)
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              ✅ Demonstrated proficiency in automated carrier onboarding
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              ✅ Certified for 12 months with quarterly refresher
              recommendations
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={onDownload}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            📄 Download Certificate
          </button>

          <button
            onClick={() => window.print()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🖨️ Print Certificate
          </button>
        </div>

        {/* Next Steps */}
        <div
          style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ color: '#3b82f6', marginBottom: '12px' }}>
            🚀 Next Steps
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              lineHeight: '1.6',
            }}
          >
            You are now certified to use the automated carrier onboarding
            system. Access the live system, monitor carrier progress, and help
            streamline the 24-hour onboarding process. Remember to complete
            quarterly refresher training to stay up-to-date with system
            enhancements.
          </p>
        </div>
      </div>
    );
  }

  // Failed Certification View
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px',
        border: '2px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Failed Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📚</div>
        <h1
          style={{
            color: '#ef4444',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          Training Incomplete
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
          You need to retake the assessment to earn your certification
        </p>
      </div>

      {/* Score Details */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          <div>
            <h3
              style={{
                color: '#ef4444',
                marginBottom: '8px',
                fontSize: '1.1rem',
              }}
            >
              Your Score
            </h3>
            <p
              style={{
                color: '#ef4444',
                fontWeight: 'bold',
                fontSize: '2rem',
              }}
            >
              {score}%
            </p>
          </div>

          <div>
            <h3
              style={{
                color: 'white',
                marginBottom: '8px',
                fontSize: '1.1rem',
              }}
            >
              Required
            </h3>
            <p
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2rem',
              }}
            >
              {requiredScore}%
            </p>
          </div>

          <div>
            <h3
              style={{
                color: 'white',
                marginBottom: '8px',
                fontSize: '1.1rem',
              }}
            >
              Improvement Needed
            </h3>
            <p
              style={{
                color: '#f59e0b',
                fontWeight: 'bold',
                fontSize: '2rem',
              }}
            >
              +{requiredScore - score}%
            </p>
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}
      >
        <h3
          style={{
            color: '#3b82f6',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          📖 Study Recommendations
        </h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            • Review the 11 required documents and their verification criteria
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            • Practice with the automated workflow process steps
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            • Study troubleshooting scenarios and common issues
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            • Familiarize yourself with carrier communication templates
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            • Understand FMCSA 2025 compliance requirements
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        {onRetake && (
          <button
            onClick={onRetake}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            🔄 Retake Training
          </button>
        )}

        <button
          onClick={() =>
            (window.location.href =
              '/training/carrier-onboard-workflow/study-materials')
          }
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          📚 Study Materials
        </button>
      </div>

      {/* Encouragement */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#10b981', marginBottom: '12px' }}>
          💪 Keep Going!
        </h3>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            lineHeight: '1.6',
          }}
        >
          Don't worry - this is a learning process! Review the study
          materials, practice with the training modules, and retake the
          assessment when you're ready. You're close to certification!
        </p>
      </div>
    </div>
  );
};
