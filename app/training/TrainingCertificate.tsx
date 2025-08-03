'use client';

import React from 'react';

interface TrainingCertificateProps {
  userName: string;
  userRole: 'dispatcher' | 'broker';
  score: number;
  completionDate: string;
  certificateId: string;
  onDownload?: () => void;
  onClose?: () => void;
}

export const TrainingCertificate: React.FC<TrainingCertificateProps> = ({
  userName,
  userRole,
  score,
  completionDate,
  certificateId,
  onDownload,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#1f2937',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        border: '2px solid #d1d5db',
      }}
    >
      {/* Certificate Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          padding: '40px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
          }}
        >
          Certificate ID: {certificateId}
        </div>

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '12px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          🏆 CERTIFICATE OF COMPLETION
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            margin: 0,
          }}
        >
          FleetFlow University℠℠ - Professional Training Program
        </p>
      </div>

      {/* Certificate Body */}
      <div style={{ padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p
            style={{
              fontSize: '1.3rem',
              color: '#374151',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}
          >
            This is to certify that
          </p>

          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '20px',
              textDecoration: 'underline',
              textDecorationColor: '#3b82f6',
              textDecorationThickness: '3px',
            }}
          >
            {userName}
          </h2>

          <p
            style={{
              fontSize: '1.3rem',
              color: '#374151',
              marginBottom: '30px',
              lineHeight: '1.6',
            }}
          >
            has successfully completed the comprehensive training program for
          </p>

          <div
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '30px',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              Carrier Onboard Workflow
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                margin: '8px 0 0 0',
                opacity: 0.9,
              }}
            >
              Advanced {userRole === 'broker' ? 'Broker' : 'Dispatcher'}{' '}
              Certification
            </p>
          </div>
        </div>

        {/* Achievement Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📊</div>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}
            >
              {score}%
            </div>
            <div style={{ color: '#64748b', fontWeight: 'bold' }}>
              Final Score
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
            <div
              style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#1e40af',
              }}
            >
              {formatDate(completionDate)}
            </div>
            <div style={{ color: '#64748b', fontWeight: 'bold' }}>
              Completion Date
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💼</div>
            <div
              style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#1e40af',
              }}
            >
              {userRole === 'broker' ? 'Broker' : 'Dispatcher'}
            </div>
            <div style={{ color: '#64748b', fontWeight: 'bold' }}>
              Role Certification
            </div>
          </div>
        </div>

        {/* Training Modules Completed */}
        <div
          style={{
            background: '#f8fafc',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            marginBottom: '40px',
          }}
        >
          <h4
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e40af',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            📚 Training Modules Mastered
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              'System Overview & Navigation',
              'Document Verification Process',
              'Automated Workflow Management',
              'Communication & Notifications',
              'Quality Assurance & Compliance',
            ].map((module, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              >
                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✅</span>
                <span style={{ color: '#374151', fontWeight: 'bold' }}>
                  {module}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Authority */}
        <div
          style={{
            textAlign: 'center',
            paddingTop: '30px',
            borderTop: '2px solid #e2e8f0',
          }}
        >
          <p
            style={{
              fontSize: '1.1rem',
              color: '#64748b',
              marginBottom: '20px',
            }}
          >
            This certificate is valid for 12 months from the completion date.
            <br />
            Continuing education and periodic refresher training are
            recommended.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '150px',
                  height: '2px',
                  background: '#1e40af',
                  margin: '0 auto 8px',
                }}
              ></div>
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  margin: 0,
                }}
              >
                FleetFlow University℠
              </p>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  margin: 0,
                }}
              >
                Training Authority
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '150px',
                  height: '2px',
                  background: '#1e40af',
                  margin: '0 auto 8px',
                }}
              ></div>
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  margin: 0,
                }}
              >
                Digital Signature
              </p>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  margin: 0,
                }}
              >
                Verified & Authenticated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {(onDownload || onClose) && (
        <div
          style={{
            background: '#f8fafc',
            padding: '20px 40px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {onDownload && (
            <button
              onClick={onDownload}
              style={{
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
              }}
            >
              📄 Download Certificate
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(107, 114, 128, 0.1)',
                color: '#374151',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
};
