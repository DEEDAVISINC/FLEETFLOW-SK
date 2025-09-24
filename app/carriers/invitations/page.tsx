'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

// Invitation Landing Page for carriers who click invitation links
const InvitationLandingPage: React.FC<{
  invitationData: {
    ref?: string;
    carrier?: string;
    mc?: string;
    dot?: string;
    email?: string;
    inviter?: string;
  };
  onProceedToOnboarding: () => void;
}> = ({ invitationData, onProceedToOnboarding }) => {
  return (
    <div
      style={{
        background: `
          linear-gradient(135deg, #000000 0%, #0a0a23 25%, #1a1a3e 50%, #0a0a23 75%, #000000 100%),
          radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Animation Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 49%, rgba(20, 184, 166, 0.03) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(59, 130, 246, 0.03) 50%, transparent 51%)
          `,
          backgroundSize: '60px 60px',
          animation: 'float 20s linear infinite',
          zIndex: 1,
        }}
      />

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(20, 184, 166, 0.5);
          }
          50% {
            text-shadow:
              0 0 40px rgba(20, 184, 166, 0.8),
              0 0 60px rgba(59, 130, 246, 0.3);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.3);
          }
          50% {
            box-shadow:
              0 0 50px rgba(20, 184, 166, 0.6),
              0 0 80px rgba(59, 130, 246, 0.2);
          }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Welcome Header */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '20px',
                animation: 'glow 3s ease-in-out infinite',
              }}
            >
              🚛
            </div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                background:
                  'linear-gradient(135deg, rgba(20, 184, 166, 1) 0%, rgba(59, 130, 246, 1) 50%, rgba(139, 92, 246, 1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '16px',
                lineHeight: '1.2',
                animation: 'glow 3s ease-in-out infinite',
              }}
            >
              Welcome to FleetFlow!
            </h1>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '0',
              }}
            >
              You've been invited to join our carrier network
            </p>
          </div>

          {/* Invitation Details */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '40px',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h3
              style={{
                color: 'rgba(20, 184, 166, 1)',
                fontSize: '1.3rem',
                marginBottom: '20px',
                fontWeight: '600',
              }}
            >
              📋 Invitation Details
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                textAlign: 'left',
              }}
            >
              {invitationData.carrier && (
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#60a5fa',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    COMPANY NAME
                  </div>
                  <div style={{ color: 'white', fontWeight: '500' }}>
                    {invitationData.carrier}
                  </div>
                </div>
              )}

              {invitationData.mc && (
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(20, 184, 166, 1)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    MC NUMBER
                  </div>
                  <div style={{ color: 'white', fontWeight: '500' }}>
                    {invitationData.mc}
                  </div>
                </div>
              )}

              {invitationData.dot && (
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#fbbf24',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    DOT NUMBER
                  </div>
                  <div style={{ color: 'white', fontWeight: '500' }}>
                    {invitationData.dot}
                  </div>
                </div>
              )}

              {invitationData.inviter && (
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#a78bfa',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    INVITED BY
                  </div>
                  <div style={{ color: 'white', fontWeight: '500' }}>
                    {invitationData.inviter}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onProceedToOnboarding}
            style={{
              background:
                'linear-gradient(135deg, rgba(20, 184, 166, 1) 0%, rgba(59, 130, 246, 1) 100%)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: 'pulse 2s ease-in-out infinite',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.animation = 'none';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.animation = 'pulse 2s ease-in-out infinite';
            }}
          >
            🚀 Start Onboarding Process
          </button>

          {/* Footer Note */}
          <div
            style={{
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
            }}
          >
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                margin: '0 0 8px 0',
              }}
            >
              🔐 <strong>Secure Onboarding Process</strong>
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.8rem',
                margin: 0,
                lineHeight: '1.4',
              }}
            >
              Your information is encrypted and secure. The onboarding process
              typically takes 5-10 minutes to complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Carrier Sign-Up/Request Page for carriers without invitations
const CarrierSignUpPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signup' | 'request'>('signup');

  // Sign up form data
  const [signUpData, setSignUpData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    mcNumber: '',
    dotNumber: '',
  });

  // Request invitation form data
  const [requestData, setRequestData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    mcNumber: '',
    dotNumber: '',
    message: '',
  });

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.set('company', signUpData.companyName);
    params.set('contact', signUpData.contactName);
    params.set('email', signUpData.email);
    params.set('phone', signUpData.phone);
    params.set('mc', signUpData.mcNumber);
    params.set('dot', signUpData.dotNumber);

    router.push(`/onboarding/carrier-onboarding/new?${params.toString()}`);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement actual invitation request API
    console.log('Invitation request submitted:', requestData);
  };

  return (
    <div
      style={{
        background: `
          linear-gradient(135deg, #000000 0%, #0a0a23 25%, #1a1a3e 50%, #0a0a23 75%, #000000 100%),
          radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      {/* Floating Animation Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 49%, rgba(20, 184, 166, 0.03) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(59, 130, 246, 0.03) 50%, transparent 51%)
          `,
          backgroundSize: '60px 60px',
          animation: 'float 20s linear infinite',
          zIndex: 1,
        }}
      />

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(20, 184, 166, 0.5);
          }
          50% {
            text-shadow:
              0 0 40px rgba(20, 184, 166, 0.8),
              0 0 60px rgba(59, 130, 246, 0.3);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.3);
          }
          50% {
            box-shadow:
              0 0 50px rgba(20, 184, 166, 0.6),
              0 0 80px rgba(59, 130, 246, 0.2);
          }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          maxWidth: '800px',
          margin: '0 auto 24px auto',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: '700',
              background:
                'linear-gradient(135deg, rgba(20, 184, 166, 1) 0%, rgba(59, 130, 246, 1) 50%, rgba(139, 92, 246, 1) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
              animation: 'glow 3s ease-in-out infinite',
            }}
          >
            🚛 Join FleetFlow Carrier Network
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0',
              fontSize: '1.2rem',
              fontWeight: '400',
            }}
          >
            Partner with us for reliable freight opportunities
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          margin: '0 auto 24px auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <button
          onClick={() => setActiveTab('signup')}
          style={{
            background:
              activeTab === 'signup'
                ? 'rgba(20, 184, 166, 0.3)'
                : 'rgba(0, 0, 0, 0.4)',
            color:
              activeTab === 'signup'
                ? 'rgba(20, 184, 166, 1)'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'signup'
                ? '2px solid rgba(20, 184, 166, 1)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          📝 Direct Sign-Up
        </button>
        <button
          onClick={() => setActiveTab('request')}
          style={{
            background:
              activeTab === 'request'
                ? 'rgba(20, 184, 166, 0.3)'
                : 'rgba(0, 0, 0, 0.4)',
            color:
              activeTab === 'request'
                ? 'rgba(20, 184, 166, 1)'
                : 'rgba(255, 255, 255, 0.8)',
            border:
              activeTab === 'request'
                ? '2px solid rgba(20, 184, 166, 1)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          📧 Request Invitation
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {activeTab === 'signup' ? (
          <form onSubmit={handleSignUpSubmit}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h2
                style={{
                  color: 'rgba(20, 184, 166, 1)',
                  marginBottom: '24px',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  animation: 'glow 3s ease-in-out infinite',
                }}
              >
                📝 Carrier Application - Direct Sign-Up
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
                <input
                  type='text'
                  name='companyName'
                  placeholder='Company Name *'
                  value={signUpData.companyName}
                  onChange={handleSignUpChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='text'
                  name='contactName'
                  placeholder='Contact Name *'
                  value={signUpData.contactName}
                  onChange={handleSignUpChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Email Address *'
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='tel'
                  name='phone'
                  placeholder='Phone Number *'
                  value={signUpData.phone}
                  onChange={handleSignUpChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='text'
                  name='mcNumber'
                  placeholder='MC Number *'
                  value={signUpData.mcNumber}
                  onChange={handleSignUpChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='text'
                  name='dotNumber'
                  placeholder='DOT Number *'
                  value={signUpData.dotNumber}
                  onChange={handleSignUpChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type='submit'
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(20, 184, 166, 1) 0%, rgba(59, 130, 246, 1) 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 48px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  🚀 Begin Onboarding Process
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequestSubmit}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h2
                style={{
                  color: 'rgba(20, 184, 166, 1)',
                  marginBottom: '24px',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  animation: 'glow 3s ease-in-out infinite',
                }}
              >
                📧 Request Carrier Invitation
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
                <input
                  type='text'
                  name='companyName'
                  placeholder='Company Name *'
                  value={requestData.companyName}
                  onChange={handleRequestChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='text'
                  name='contactName'
                  placeholder='Contact Name *'
                  value={requestData.contactName}
                  onChange={handleRequestChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Email Address *'
                  value={requestData.email}
                  onChange={handleRequestChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='tel'
                  name='phone'
                  placeholder='Phone Number *'
                  value={requestData.phone}
                  onChange={handleRequestChange}
                  required
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='text'
                  name='mcNumber'
                  placeholder='MC Number (optional)'
                  value={requestData.mcNumber}
                  onChange={handleRequestChange}
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type='text'
                  name='dotNumber'
                  placeholder='DOT Number (optional)'
                  value={requestData.dotNumber}
                  onChange={handleRequestChange}
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <textarea
                  name='message'
                  placeholder="Tell us about your company and why you'd like to join FleetFlow..."
                  value={requestData.message}
                  onChange={handleRequestChange}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type='submit'
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(20, 184, 166, 1) 0%, rgba(59, 130, 246, 1) 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 48px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  📧 Request Invitation
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Contact Info */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          marginTop: '40px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          maxWidth: '800px',
          margin: '40px auto 0 auto',
        }}
      >
        <p>
          📞 Questions? Call us at{' '}
          <strong style={{ color: 'rgba(20, 184, 166, 1)' }}>
            (833) 386-3509
          </strong>{' '}
          or email{' '}
          <strong style={{ color: 'rgba(20, 184, 166, 1)' }}>
            carriers@fleetflowapp.com
          </strong>
        </p>
      </div>
    </div>
  );
};

function CarrierInvitationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showInvitationLanding, setShowInvitationLanding] = useState(false);
  const [invitationData, setInvitationData] = useState({
    ref: '',
    carrier: '',
    mc: '',
    dot: '',
    email: '',
    inviter: '',
  });

  // Check for invitation parameters on component mount
  useEffect(() => {
    if (!searchParams) return;

    const ref = searchParams.get('ref');
    const carrier = searchParams.get('carrier');
    const mc = searchParams.get('mc');
    const dot = searchParams.get('dot');
    const email = searchParams.get('email');
    const inviter = searchParams.get('inviter');

    // If we have invitation parameters, show the landing page
    if (ref || carrier || mc || dot || inviter) {
      console.log('Showing invitation landing page with data:', {
        ref,
        carrier,
        mc,
        dot,
        email,
        inviter,
      });
      setInvitationData({
        ref: ref || '',
        carrier: carrier || '',
        mc: mc || '',
        dot: dot || '',
        email: email || '',
        inviter: inviter || '',
      });
      setShowInvitationLanding(true);

      // Track invitation opened (console log for now)
      if (ref) {
        console.info(`Invitation ${ref} marked as opened`);
      }
    }
  }, [searchParams]);

  // Invitation landing page handler
  const handleProceedToOnboarding = () => {
    // Track invitation started (console log for now)
    if (invitationData.ref) {
      console.info(`Invitation ${invitationData.ref} marked as started`);
    }

    // Build the onboarding URL with pre-filled data
    const params = new URLSearchParams();
    if (invitationData.carrier) params.set('company', invitationData.carrier);
    if (invitationData.mc) params.set('mc', invitationData.mc);
    if (invitationData.dot) params.set('dot', invitationData.dot);
    if (invitationData.email) params.set('email', invitationData.email);
    if (invitationData.ref) params.set('invitationRef', invitationData.ref);

    const onboardingUrl = `/onboarding/carrier-onboarding/new?${params.toString()}`;
    router.push(onboardingUrl);
  };

  // Show invitation landing page if we have invitation data
  if (showInvitationLanding) {
    return (
      <InvitationLandingPage
        invitationData={invitationData}
        onProceedToOnboarding={handleProceedToOnboarding}
      />
    );
  }

  // Show sign-up page for carriers without invitations
  return <CarrierSignUpPage />;
}

export default function CarrierInvitationsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: `
            linear-gradient(135deg, #000000 0%, #0a0a23 25%, #1a1a3e 50%, #0a0a23 75%, #000000 100%),
            radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
          }}
        >
          🔄 Loading...
        </div>
      }
    >
      <CarrierInvitationsContent />
    </Suspense>
  );
}
